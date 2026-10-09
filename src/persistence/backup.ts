import type { BackupFile, LearningPlan, OperationResult, PlanTask, Workspace, WorkspacePersistence } from '../domain/contracts';

export type BackupValidators = {
  workspace: (value: unknown) => OperationResult<Workspace>;
  backup: (value: unknown) => OperationResult<BackupFile>;
};
export type ImportChoices = {
  planActions: Record<string, 'skip' | 'copy'>;
  importProfile: boolean;
  importPreferences: boolean;
  importDrafts: boolean;
  importCredentials: boolean;
};
export type BackupPreview = {
  candidate: Workspace;
  addedPlanIds: string[];
  skippedPlanIds: string[];
  copiedPlans: { sourceId: string; newId: string }[];
  skippedDraftTrackIds: string[];
  fileRevision: number;
  deviceRevision: number;
};
const defaults: ImportChoices = { planActions: {}, importProfile: false, importPreferences: false, importDrafts: false, importCredentials: false };
const uid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const failure = <T>(code: 'validation' | 'storage' | 'conflict' | 'unsupported_version', issue: string, message: string): OperationResult<T> =>
  ({ ok: false, code, issues: [{ code: issue, field: 'backup', message }] });
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function checked<T>(validate: (value: unknown) => OperationResult<T>, value: unknown): OperationResult<T> {
  try {
    const result = validate(structuredClone(value));
    return result.ok ? { ok: true, value: structuredClone(result.value) } : result;
  } catch { return failure('validation', 'BACKUP_VALIDATOR', 'Validator gặp lỗi; không ghi dữ liệu.'); }
}
function validInstant(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value)) return false;
  const day = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(Date.parse(value)) && Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === value.slice(0, 10);
}
/** Exports the supplied snapshot, including an unsaved proposal; never loads or writes storage. */
export function exportBackup(snapshot: unknown, options: { exportedAt: string; unsaved: boolean }, validators: BackupValidators): OperationResult<{ file: BackupFile; json: string; containsUnsavedChanges: boolean }> {
  if (!validInstant(options.exportedAt) || typeof options.unsaved !== 'boolean') return failure('validation', 'BACKUP_OPTIONS', 'Cần thời điểm thực và trạng thái bản chưa lưu.');
  const workspace = checked(validators.workspace, snapshot);
  if (!workspace.ok) return workspace;
  const validated = checked(validators.backup, { format: 'majorweave-backup', formatVersion: 1, exportedAt: options.exportedAt, workspace: workspace.value });
  if (!validated.ok) return validated;
  try { return { ok: true, value: { file: validated.value, json: JSON.stringify(validated.value, null, 2), containsUnsavedChanges: options.unsaved } }; }
  catch { return failure('validation', 'BACKUP_SERIALIZE', 'Không chuyển được bản này thành JSON.'); }
}
export function parseBackup(raw: string, validators: BackupValidators): OperationResult<BackupFile> {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return failure('validation', 'BACKUP_JSON', 'File không phải JSON hợp lệ; giữ file nguồn.'); }
  if (typeof value !== 'object' || value === null || Array.isArray(value) || !('format' in value) || value.format !== 'majorweave-backup') return failure('validation', 'BACKUP_FORMAT', 'Không phải file backup MajorWeave.');
  if (!('formatVersion' in value) || value.formatVersion !== 1) return failure('unsupported_version', 'BACKUP_VERSION', 'Phiên bản backup không hỗ trợ; không đoán cấu trúc.');
  return checked(validators.backup, value);
}
function planIds(plan: LearningPlan): string[] {
  return [plan.id, ...plan.completions.flatMap(c => [c.id, c.taskId]), ...[plan.current, ...plan.history].flatMap(g =>
    [g.id, ...[...g.tasks, ...g.closedWeeks.flatMap(w => w.tasks)].flatMap(t => [t.id, ...(t.completionId ? [t.completionId] : [])])])];
}
/** Remaps every user ID including references in history and closed-week snapshots. Content IDs are unchanged. */
function copyPlan(plan: LearningPlan, nextId: () => string, reserved: Set<string>) {
  const map = new Map<string, string>();
  for (const old of planIds(plan)) {
    const key = old.toLowerCase();
    if (map.has(key)) continue;
    const id = nextId();
    if (typeof id !== 'string' || !uid.test(id) || reserved.has(id.toLowerCase())) throw new Error('Factory UUID lỗi/trùng');
    reserved.add(id.toLowerCase()); map.set(key, id);
  }
  const id = (old: string) => {
    const mapped = map.get(old.toLowerCase());
    if (!mapped) throw new Error('Thiếu ánh xạ quan hệ');
    return mapped;
  };
  const task = (t: PlanTask) => { t.id = id(t.id); if (t.completionId !== null) t.completionId = id(t.completionId); };
  const result = structuredClone(plan);
  result.id = id(result.id);
  for (const g of [result.current, ...result.history]) {
    g.id = id(g.id); g.tasks.forEach(task); g.closedWeeks.forEach(w => w.tasks.forEach(task));
  }
  for (const c of result.completions) { c.id = id(c.id); c.taskId = id(c.taskId); }
  return result;
}
export function previewBackupImport(raw: string, current: unknown, choices: Partial<ImportChoices>, nextId: () => string, validators: BackupValidators): OperationResult<BackupPreview> {
  const file = parseBackup(raw, validators); if (!file.ok) return file;
  const base = checked(validators.workspace, current); if (!base.ok) return base;
  const decision = { ...defaults, ...choices };
  if (Object.keys(choices).some(k => !Object.hasOwn(defaults, k)) || ['importProfile', 'importPreferences', 'importDrafts', 'importCredentials'].some(k => typeof decision[k as keyof ImportChoices] !== 'boolean')
    || typeof decision.planActions !== 'object' || decision.planActions === null || Array.isArray(decision.planActions)
    || Object.entries(decision.planActions).some(([id, action]) => !file.value.workspace.plans.some(p => p.id === id) || !['skip', 'copy'].includes(action)))
    return failure('validation', 'IMPORT_CHOICES', 'Lựa chọn nhập không hợp lệ.');
  try {
    const source = file.value.workspace, candidate = structuredClone(base.value);
    const reserved = new Set([...candidate.plans, ...source.plans].flatMap(planIds).map(id => id.toLowerCase()));
    const deviceIds = new Set(candidate.plans.flatMap(planIds).map(id => id.toLowerCase()));
    const planMap = new Map<string, string>();
    const summary: BackupPreview = { candidate, addedPlanIds: [], skippedPlanIds: [], copiedPlans: [], skippedDraftTrackIds: [], fileRevision: source.revision, deviceRevision: candidate.revision };
    for (const plan of source.plans) {
      const duplicate = candidate.plans.some(p => p.id.toLowerCase() === plan.id.toLowerCase());
      const action = Object.hasOwn(decision.planActions, plan.id) ? decision.planActions[plan.id] : duplicate ? 'skip' : undefined;
      if (action === 'skip') { summary.skippedPlanIds.push(plan.id); continue; }
      let added: LearningPlan;
      if (action === 'copy') {
        added = copyPlan(plan, nextId, reserved);
        summary.copiedPlans.push({ sourceId: plan.id, newId: added.id });
      } else {
        if (planIds(plan).some(id => deviceIds.has(id.toLowerCase()))) return failure('validation', 'IMPORT_NESTED_ID_COLLISION', 'ID task/generation/completion trùng dữ liệu thiết bị; chọn rõ nhập plan này thành bản sao.');
        added = structuredClone(plan);
      }
      for (const id of planIds(added)) deviceIds.add(id.toLowerCase());
      candidate.plans.push(added); planMap.set(plan.id, added.id); summary.addedPlanIds.push(added.id);
    }
    if (candidate.activePlanId === null) candidate.activePlanId = (source.activePlanId && planMap.get(source.activePlanId)) || summary.addedPlanIds[0] || null;
    if (decision.importProfile) candidate.profile = structuredClone(source.profile);
    if (decision.importPreferences) candidate.preferences = structuredClone(source.preferences);
    if (decision.importCredentials) candidate.savedCredentialIds = [...new Set([...candidate.savedCredentialIds, ...source.savedCredentialIds])];
    if (decision.importDrafts) for (const [track, draft] of Object.entries(source.drafts)) {
      if (Object.hasOwn(candidate.drafts, track)) summary.skippedDraftTrackIds.push(track);
      else Object.defineProperty(candidate.drafts, track, { value: structuredClone(draft), enumerable: true, writable: true, configurable: true });
    }
    // Keep existing provenance; only add source markers referring to plans actually added.
    for (const marker of source.imports) {
      if (candidate.imports.some(i => i.fingerprint === marker.fingerprint)) continue;
      const mapped = marker.planIds.flatMap(id => planMap.has(id) ? [planMap.get(id)!] : []);
      if (mapped.length) candidate.imports.push({ ...structuredClone(marker), planIds: mapped });
    }
    const valid = checked(validators.workspace, candidate); if (!valid.ok) return valid;
    summary.candidate = valid.value;
    return { ok: true, value: summary };
  } catch { return failure('validation', 'IMPORT_REMAP', 'Không ánh xạ được ID hoặc quan hệ; chưa ghi dữ liệu.'); }
}
export function createBackupImport(deps: { persistence: WorkspacePersistence; validators: BackupValidators; nextId: () => string }) {
  let session: { ticket: string; base: Workspace; preview: BackupPreview } | null = null;
  let busy = false, sequence = 0;
  async function load(): Promise<OperationResult<Workspace>> {
    try { const r = await deps.persistence.loadWorkspace(); return r.ok ? checked(deps.validators.workspace, r.value) : r; }
    catch { return failure('storage', 'IMPORT_LOAD', 'Không đọc được workspace; chưa nhập dữ liệu.'); }
  }
  async function prepare(raw: string, choices: Partial<ImportChoices> = {}): Promise<OperationResult<BackupPreview & { ticket: string }>> {
    if (busy) return failure('conflict', 'IMPORT_BUSY', 'Một thao tác đang chạy.');
    busy = true; session = null;
    try {
      const loaded = await load(); if (!loaded.ok) return loaded;
      const p = previewBackupImport(raw, loaded.value, choices, deps.nextId, deps.validators); if (!p.ok) return p;
      const ticket = `backup-import-${++sequence}`;
      session = { ticket, base: loaded.value, preview: structuredClone(p.value) };
      return { ok: true, value: { ...structuredClone(p.value), ticket } };
    } finally { busy = false; }
  }
  async function confirm(ticket: string): Promise<OperationResult<Workspace>> {
    if (busy) return failure('conflict', 'IMPORT_BUSY', 'Đang nhập; không gửi xác nhận hai lần.');
    if (!session || session.ticket !== ticket) return failure('validation', 'IMPORT_TICKET', 'Preview đã hủy hoặc không còn hiệu lực.');
    busy = true; const pending = session;
    try {
      const loaded = await load(); if (!loaded.ok) return loaded;
      if (!same(loaded.value, pending.base)) return failure('conflict', 'IMPORT_REVISION', 'Workspace đã đổi; giữ đề xuất, cần preview lại trước nhập.');
      const valid = checked(deps.validators.workspace, pending.preview.candidate); if (!valid.ok) return valid;
      if (same(valid.value, pending.base)) { session = null; return { ok: true, value: loaded.value }; } // All duplicates skipped: no write/revision bump.
      let saved: OperationResult<Workspace>;
      try { saved = await deps.persistence.saveWorkspace(structuredClone(valid.value), pending.base.revision); }
      catch { return failure('storage', 'IMPORT_SAVE', 'Lưu lỗi; giữ cùng đề xuất để retry hoặc xuất backup.'); }
      if (saved.ok) session = null;
      return saved;
    } finally { busy = false; }
  }
  function cancel(ticket: string): OperationResult<void> {
    if (busy) return failure('conflict', 'IMPORT_BUSY', 'Thao tác đang chạy; hủy UI không phải hủy transaction.');
    if (!session || session.ticket !== ticket) return failure('validation', 'IMPORT_TICKET', 'Preview không còn hiệu lực.');
    session = null; return { ok: true, value: undefined };
  }
  return { prepare, confirm, cancel, isBusy: () => busy, getProposal: () => session ? structuredClone(session.preview.candidate) : null };
}
