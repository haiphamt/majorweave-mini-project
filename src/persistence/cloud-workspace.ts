import type { SupabaseClient } from '@supabase/supabase-js';
import type { OperationResult, Workspace, WorkspacePersistence } from '../domain/contracts';
import { validateWorkspace } from '../domain/validate';
import { emptyWorkspace } from './roadmap-store';

type CloudClient = Pick<SupabaseClient, 'auth' | 'from' | 'rpc'>;
export type CloudStore = WorkspacePersistence & { readRevision: () => Promise<OperationResult<number>> };
function failure(code: 'storage' | 'conflict' | 'validation', issue: string, message: string): Extract<OperationResult<never>, { ok: false }> {
  return { ok: false, code, issues: [{ code: issue, field: 'workspace', message }] };
}
function cloudError(error: { code?: string } | null) {
  if (error?.code === 'PT409') return failure('conflict', 'CLOUD_REVISION_CONFLICT', 'Kế hoạch đã đổi trên thiết bị khác. Xuất bản chưa lưu trước khi tải lại; không ghi đè dữ liệu online.');
  if (error?.code === 'PT401' || error?.code === '42501') return failure('storage', 'CLOUD_AUTH', 'Phiên đăng nhập không còn hợp lệ. Đăng nhập lại cùng tài khoản để lưu bản đang sửa.');
  if (error?.code === 'PT422') return failure('validation', 'CLOUD_INVALID', 'Dữ liệu hoặc phiên bản chưa hợp lệ. Giữ bản hiện tại để kiểm tra.');
  return failure('storage', 'CLOUD_UNAVAILABLE', 'Chưa lưu/tải được dữ liệu online. Kiểm tra kết nối và thử lại; bản chưa lưu vẫn được giữ.');
}

/** Cloud commits are authoritative. No successful save is reported before the server commits. */
export function createCloudWorkspace(client: CloudClient, userId: string, options: { timeZone: string; nextId?: () => string }): CloudStore {
  let pending: { key: string; requestId: string } | null = null;
  async function authorize() {
    const { data, error } = await client.auth.getSession();
    return !error && data.session?.user.id === userId;
  }
  const wrongAccount = () => failure('storage', 'CLOUD_ACCOUNT_CHANGED', 'Tài khoản đã thay đổi. Bản đang sửa vẫn thuộc tài khoản trước; hãy xuất sao lưu hoặc đăng nhập lại tài khoản đó.');
  async function read(): Promise<OperationResult<Workspace>> {
    try {
      if (!await authorize()) return wrongAccount();
      const { data, error } = await client.from('uitplans_workspaces').select('workspace, revision').eq('user_id', userId).maybeSingle();
      if (error) return cloudError(error);
      if (!await authorize()) return wrongAccount();
      if (!data) return { ok: true, value: emptyWorkspace(options.timeZone) };
      const checked = validateWorkspace(data.workspace);
      if (!checked.ok) return checked;
      if (checked.value.revision !== data.revision) return failure('validation', 'CLOUD_REVISION_INVALID', 'Phiên bản dữ liệu online không khớp; không thay dữ liệu hiện tại.');
      return checked;
    } catch { return cloudError(null); }
  }
  return {
    loadWorkspace: read,
    async readRevision() {
      try {
        if (!await authorize()) return wrongAccount();
        const { data, error } = await client.from('uitplans_workspaces').select('revision').eq('user_id', userId).maybeSingle();
        if (error) return cloudError(error);
        if (!await authorize()) return wrongAccount();
        const value = data?.revision ?? 0;
        return Number.isSafeInteger(value) && value >= 0 ? { ok: true, value } : failure('validation', 'CLOUD_REVISION_INVALID', 'Phiên bản dữ liệu online chưa hợp lệ.');
      } catch { return cloudError(null); }
    },
    async saveWorkspace(next, expectedRevision) {
      try {
        const checked = validateWorkspace(structuredClone(next));
        if (!checked.ok) return checked;
        if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || expectedRevision >= Number.MAX_SAFE_INTEGER || checked.value.revision !== expectedRevision)
          return failure('validation', 'CLOUD_EXPECTED_REVISION', 'Phiên bản cần lưu chưa hợp lệ.');
        if (!await authorize()) return wrongAccount();
        const key = JSON.stringify([expectedRevision, checked.value]);
        if (pending?.key !== key) pending = { key, requestId: (options.nextId ?? (() => crypto.randomUUID()))() };
        const { data, error } = await client.rpc('save_uitplans_workspace', {
          p_user_id: userId, p_workspace: checked.value, p_expected_revision: expectedRevision, p_request_id: pending.requestId,
        });
        if (error) return cloudError(error);
        if (!await authorize()) return wrongAccount();
        const saved = validateWorkspace(data);
        if (!saved.ok) return saved;
        if (saved.value.revision !== expectedRevision + 1) return failure('validation', 'CLOUD_ACK_INVALID', 'Máy chủ chưa xác nhận đúng phiên bản đã lưu. Giữ bản đang sửa để thử lại.');
        pending = null;
        return saved;
      } catch { return cloudError(null); }
    },
  };
}
