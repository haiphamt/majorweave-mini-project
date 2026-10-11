import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, useId, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../auth/supabase';
import { createCloudWorkspace, type CloudStore } from '../persistence/cloud-workspace';
import { downloadBackup } from '../components/downloadBackup';
import { browserOptions, WorkspaceProvider, useWorkspace } from './WorkspaceProvider';
import type { WorkspaceOptions } from './workspace-api';

const AccountScope = createContext<{ userId: string | null; cloud: boolean; formDirty: boolean; markDirty: (id: string, dirty: boolean) => void }>({ userId: null, cloud: false, formDirty: false, markDirty: () => {} });
export const useAccountScope = () => useContext(AccountScope);
export function useAccountDraftProtection(dirty: boolean) {
  const { markDirty } = useAccountScope();
  const id = useId();
  useEffect(() => { markDirty(id, dirty); return () => markDirty(id, false); }, [markDirty, id, dirty]);
}

export function AccountWorkspace({ children, options }: { children: ReactNode; options?: WorkspaceOptions }) {
  const auth = useAuth();
  const targetId = options ? null : auth.session?.user.id ?? null;
  const [scopeId, setScopeId] = useState<string | null | undefined>(undefined);
  const [dirtyForms, setDirtyForms] = useState<Set<string>>(() => new Set());
  const markDirty = useCallback((id: string, dirty: boolean) => setDirtyForms(before => {
    if (before.has(id) === dirty) return before;
    const next = new Set(before); if (dirty) next.add(id); else next.delete(id); return next;
  }), []);
  useEffect(() => { if (!auth.loading && scopeId === undefined) setScopeId(targetId); }, [auth.loading, scopeId, targetId]);
  const cloudStore = useMemo(() => scopeId && supabase && !options ? createCloudWorkspace(supabase, scopeId, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }) : null, [scopeId, options]);
  const scopedOptions = useMemo(() => {
    if (options) return options;
    const base = browserOptions();
    return cloudStore ? { ...base, persistence: cloudStore, readLegacy: () => null } : base;
  }, [options, cloudStore]);
  if (scopeId === undefined) return <div className="auth-startup" role="status">Đang mở kế hoạch…</div>;
  return <AccountScope.Provider value={{ userId: scopeId, cloud: !!cloudStore, formDirty: dirtyForms.size > 0, markDirty }}>
    <WorkspaceProvider key={scopeId ?? 'guest'} options={scopedOptions}>
      <ScopeAndSync targetId={targetId} scopeId={scopeId} changeScope={setScopeId} cloudStore={cloudStore} formDirty={dirtyForms.size > 0}/>
      {children}
    </WorkspaceProvider>
  </AccountScope.Provider>;
}

function ScopeAndSync({ targetId, scopeId, changeScope, cloudStore, formDirty }: {
  targetId: string | null; scopeId: string | null; changeScope: (id: string | null) => void; cloudStore: CloudStore | null; formDirty: boolean;
}) {
  const current = useWorkspace();
  const currentRef = useRef(current);
  currentRef.current = current;
  const formDirtyRef = useRef(formDirty);
  formDirtyRef.current = formDirty;
  const [remoteChanged, setRemoteChanged] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [exportError, setExportError] = useState('');
  const transition = targetId !== scopeId;
  const protectedState = formDirty || current.dirty || !!current.unsavedWorkspace || !!current.transfer || !!current.preview;
  const busy = current.status === 'loading' || current.status === 'saving';
  useEffect(() => {
    if (transition && !protectedState && !busy) changeScope(targetId);
  }, [transition, protectedState, busy, targetId, changeScope]);
  useEffect(() => {
    if (!cloudStore || transition) return;
    let alive = true;
    let checking = false;
    async function checkRemote() {
      const before = currentRef.current;
      if (checking || document.visibilityState === 'hidden' || !before.workspace || before.status === 'loading' || before.status === 'saving') return;
      checking = true;
      try {
        const result = await cloudStore!.readRevision();
        if (!alive) return;
        if (!result.ok) { setConnectionError(result.issues.map(i => i.message).join(' ')); return; }
        setConnectionError('');
        const now = currentRef.current;
        if (now.workspace && result.value !== now.workspace.revision) {
          if (!formDirtyRef.current && !now.dirty && !now.unsavedWorkspace && !now.transfer && !now.preview && now.status === 'ready' && result.value > now.workspace.revision) {
            const loaded = await now.actions.reloadWorkspace();
            if (alive) { setRemoteChanged(!loaded.ok); if (!loaded.ok) setConnectionError(loaded.issues.map(i => i.message).join(' ')); }
          } else setRemoteChanged(true);
        } else setRemoteChanged(false);
      } finally { checking = false; }
    }
    const refresh = () => void checkRemote();
    const timer = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    window.addEventListener('online', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('focus', refresh); window.removeEventListener('online', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [cloudStore, transition]);
  function exportPending() {
    const result = current.actions.exportBackupFile();
    if (result.ok) { downloadBackup(result.value.json); setExportError(''); }
    else setExportError(result.issues.map(i => i.message).join(' '));
  }
  return <>
    {transition && protectedState && <section className="account-notice" role="alert">
      <h2>Giữ lại phần đang làm trước khi đổi tài khoản.</h2>
      <p>Phiên đăng nhập đã thay đổi. Bạn có thể xuất bản đang sửa; dữ liệu đã lưu của Guest và từng tài khoản vẫn được giữ riêng.</p>
      <button className="secondary-button" onClick={exportPending}>Xuất dữ liệu hiện có</button>
      {formDirty && <p>Phần biểu mẫu chưa gửi chưa nằm trong file sao lưu. Giữ lại nội dung bạn cần trước khi chuyển.</p>}
      <label className="checkbox-label"><input type="checkbox" checked={confirmSwitch} onChange={e => setConfirmSwitch(e.target.checked)}/>Tôi đã giữ lại dữ liệu cần thiết và đồng ý bỏ phần chưa lưu trên màn hình này.</label>
      <button className="primary-button" disabled={busy || !confirmSwitch} onClick={() => changeScope(targetId)}>{targetId ? 'Mở dữ liệu tài khoản' : 'Tiếp tục với Guest'}</button>
      {exportError && <p role="alert">{exportError}</p>}
    </section>}
    {!transition && cloudStore && (connectionError || remoteChanged) && <div className="account-notice" role="status">
      <p>{connectionError || 'Kế hoạch đã thay đổi trên thiết bị khác. Lưu/xuất hoặc bỏ phần đang sửa trước khi tải phiên bản mới.'}</p>
    </div>}
  </>;
}
