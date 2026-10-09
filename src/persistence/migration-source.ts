import type { State } from '../state';
import type { OperationResult, ValidationIssue } from '../domain/contracts';

export const LEGACY_V1_KEY = 'majorweave.prototype.v1';
// Earlier v1 saves may predate planMeta. Keep the original object; never run
// loadState(), which normalizes defaults and filters out unknown work.
export type LegacyMigrationInput = Omit<State, 'planMeta'> & { planMeta?: State['planMeta'] };
export type LegacySource = {
  raw: string;
  fingerprint: string;
  state: LegacyMigrationInput;
  warnings: ValidationIssue[];
};
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const date = (v: unknown): v is string => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === v;
};
const instant = (v: unknown): v is string => {
  if (typeof v !== 'string') return false;
  const m = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(v);
  return !!m && date(m[1]) && Number.isFinite(Date.parse(v));
};
const stack = (v: unknown) => v === 'node' || v === 'python' || v === 'java';
const strings = (v: unknown) => Array.isArray(v) && v.every(x => typeof x === 'string');
const hours = (v: unknown) => typeof v === 'number' && Number.isInteger(v) && v >= 2 && v <= 20;

function validateLegacy(value: unknown, issues: ValidationIssue[], warnings: ValidationIssue[]): value is LegacyMigrationInput {
  const check = (ok: boolean, field: string, message: string) => {
    if (!ok) issues.push({ code: 'LEGACY_INVALID', field, message });
  };
  if (!object(value)) {
    issues.push({ code: 'LEGACY_INVALID', field: 'legacy', message: 'Dữ liệu v1 phải là object.' });
    return false;
  }
  check(value.version === 1, 'legacy.version', 'Chỉ hỗ trợ bản v1.');
  check(stack(value.stack), 'legacy.stack', 'Stack phải là node, python hoặc java.');
  for (const key of ['profileName', 'major', 'browseFaculty', 'level', 'language', 'goal'])
    check(typeof value[key] === 'string', `legacy.${key}`, 'Cần chuỗi; không tự thay bằng defaults.');
  check(['all','vi','en'].includes(String(value.language)), 'legacy.language', 'Ngôn ngữ tài liệu không hợp lệ.');
  check(typeof value.preferFree === 'boolean', 'legacy.preferFree', 'Cần boolean.');
  check(hours(value.hours), 'legacy.hours', 'Quỹ giờ phải là số nguyên từ 2 đến 20.');
  check(date(value.startDate), 'legacy.startDate', 'Ngày bắt đầu không tồn tại.');
  for (const key of ['selected','known','credentials'])
    check(strings(value[key]), `legacy.${key}`, 'Cần mảng chuỗi.');
  check(object(value.sourceByModule) && Object.values(value.sourceByModule).every(x => typeof x === 'string'), 'legacy.sourceByModule', 'Cần map nguồn dạng chuỗi.');
  if (value.planMeta === undefined) warnings.push({ code: 'LEGACY_NO_PLAN_META', field: 'legacy.planMeta', message: 'Bản cũ chưa có planMeta; preview cần giải thích cách xác định bối cảnh plan.' });
  else if (value.planMeta !== null) {
    if (!object(value.planMeta)) check(false, 'legacy.planMeta', 'planMeta phải là object hoặc null.');
    else {
      check(stack(value.planMeta.stack), 'legacy.planMeta.stack', 'Stack của plan không hợp lệ.');
      check(typeof value.planMeta.goal === 'string', 'legacy.planMeta.goal', 'Mục tiêu plan phải là chuỗi.');
      check(hours(value.planMeta.hours), 'legacy.planMeta.hours', 'Quỹ giờ plan không hợp lệ.');
      check(date(value.planMeta.startDate), 'legacy.planMeta.startDate', 'Ngày bắt đầu plan không tồn tại.');
    }
  }
  if (!Array.isArray(value.tasks)) check(false, 'legacy.tasks', 'Cần mảng công việc.');
  else {
    const ids = new Set<string>();
    value.tasks.forEach((task: unknown, i: number) => {
      const f = `legacy.tasks[${i}]`;
      if (!object(task)) { check(false, f, 'Công việc phải là object.'); return; }
      for (const key of ['id','moduleId','title','sourceId','notes'])
        check(typeof task[key] === 'string', `${f}.${key}`, 'Cần chuỗi; không loại bỏ công việc lỗi.');
      check(typeof task.id === 'string' && !!task.id, `${f}.id`, 'ID việc không được trống.');
      if (typeof task.id === 'string') {
        check(!ids.has(task.id), `${f}.id`, 'ID việc trùng; cần xử lý bản nguồn trước khi chuyển.'); ids.add(task.id);
      }
      check(typeof task.minutes === 'number' && Number.isSafeInteger(task.minutes) && task.minutes > 0, `${f}.minutes`, 'Phút phải là số nguyên dương; không cắt thời lượng.');
      check(typeof task.week === 'number' && Number.isSafeInteger(task.week) && task.week >= 0, `${f}.week`, 'Tuần phải là số nguyên không âm.');
      check(typeof task.completed === 'boolean', `${f}.completed`, 'Cần trạng thái boolean.');
      if (task.completedAt !== undefined) check(instant(task.completedAt), `${f}.completedAt`, 'Timestamp phải có timezone và ngày hợp lệ; giữ raw để sửa, không tự xóa ngày.');
      if (task.completed === true && task.completedAt === undefined)
        warnings.push({ code: 'LEGACY_UNKNOWN_COMPLETION_DATE', field: `${f}.completedAt`, message: 'Việc cũ đã hoàn thành nhưng không có timestamp; không suy ra ngày từ lịch.' });
    });
  }
  return issues.length === 0;
}

/** Read/validate/fingerprint only. This function never opens or writes storage. */
export async function inspectLegacyV1(raw: string | null): Promise<OperationResult<LegacySource | null>> {
  if (raw === null) return { ok: true, value: null };
  let parsed: unknown;
  try { parsed = JSON.parse(raw); }
  catch { return { ok: false, code: 'validation', issues: [{ code: 'LEGACY_JSON', field: 'legacy', message: 'JSON lỗi. Giữ nguyên bản nguồn để tải xuống/xử lý.' }] }; }
  if (object(parsed) && parsed.version !== undefined && parsed.version !== 1)
    return { ok: false, code: 'unsupported_version', issues: [{ code: 'LEGACY_VERSION', field: 'legacy.version', message: 'Phiên bản nguồn chưa được hỗ trợ; không thử đoán hoặc reset.' }] };
  const issues: ValidationIssue[] = [], warnings: ValidationIssue[] = [];
  if (!validateLegacy(parsed, issues, warnings)) return { ok: false, code: 'validation', issues };
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    const fingerprint = `legacy-v1:sha256:${Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')}`;
    return { ok: true, value: { raw, fingerprint, state: parsed, warnings } };
  } catch {
    return { ok: false, code: 'storage', issues: [{ code: 'LEGACY_FINGERPRINT', field: 'legacy', message: 'Không tạo được SHA-256; giữ nguyên bản nguồn và chưa cho xác nhận chuyển.' }] };
  }
}

/** Inject a read function for a QA fixture; the caller keeps any invalid raw. */
export async function readLegacyV1(read: (key: string) => string | null): Promise<OperationResult<LegacySource | null>> {
  let raw: string | null;
  try { raw = read(LEGACY_V1_KEY); }
  catch { return { ok: false, code: 'storage', issues: [{ code: 'LEGACY_READ', field: 'legacy', message: 'Không đọc được kho v1; không thay bằng dữ liệu mặc định.' }] }; }
  return inspectLegacyV1(raw);
}
