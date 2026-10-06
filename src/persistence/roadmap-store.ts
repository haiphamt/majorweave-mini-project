import type { LearningPlan, OperationResult, PlanGeneration, PlanTask, RoadmapDraft, Workspace, WorkspacePersistence } from '../domain/contracts';

// Bootstrap adapter for the shared context. MW-TEAM-05 owns migration/backup;
// MW-TEAM-04 adds the complete semantic validator through validate below.
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);
const integer = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const nullableText = (value: unknown) => value === null || text(value);
const nullableIndex = (value: unknown) => value === null || integer(value);

function draftShape(value: unknown): value is RoadmapDraft {
  return record(value) && text(value.trackId) && strings(value.selectedStageIds) && strings(value.knownStageIds)
    && record(value.resourceByStage) && Object.values(value.resourceByStage).every(text)
    && text(value.goal) && integer(value.hoursPerWeek) && value.hoursPerWeek >= 2 && value.hoursPerWeek <= 20 && text(value.startDate);
}
function generationShape(value: unknown): value is PlanGeneration {
  if (!record(value)) return false;
  const { id, createdAt, contentVersion, tasks, closedWeeks } = value;
  if (!draftShape(value) || !text(id) || !text(createdAt) || !text(contentVersion) || !Array.isArray(tasks) || !Array.isArray(closedWeeks)) return false;
  const taskShape = (task: unknown): task is PlanTask => record(task) && text(task.id) && text(task.stageId) && nullableText(task.workId)
    && (task.workRevision === null || integer(task.workRevision)) && text(task.title) && integer(task.minutes) && task.minutes > 0 && strings(task.acceptance)
    && nullableIndex(task.weekIndex) && (task.dayIndex === null || integer(task.dayIndex) && task.dayIndex <= 6)
    && text(task.status) && ['todo', 'done', 'skipped'].includes(task.status) && typeof task.customized === 'boolean' && nullableText(task.completionId) && text(task.notes)
    && (task.segment === null || record(task.segment) && integer(task.segment.fromMinute) && integer(task.segment.toMinute) && task.segment.toMinute > task.segment.fromMinute)
    && (task.source === null || record(task.source) && text(task.source.id) && text(task.source.title) && text(task.source.provider) && text(task.source.url) && /^https?:\/\//.test(task.source.url));
  if (!tasks.every(taskShape) || new Set(tasks.map(task => task.id)).size !== tasks.length) return false;
  return closedWeeks.every(week => record(week) && integer(week.weekIndex) && text(week.closedAt) && integer(week.total) && integer(week.done)
    && integer(week.estimatedCompletedMinutes) && Array.isArray(week.tasks) && week.tasks.every(taskShape));
}
function planShape(value: unknown): value is LearningPlan {
  return record(value) && text(value.id) && text(value.name) && text(value.pathId) && text(value.trackId) && text(value.contentVersion) && text(value.createdAt)
    && (value.status === 'active' || value.status === 'archived') && generationShape(value.current) && Array.isArray(value.history) && value.history.every(generationShape)
    && Array.isArray(value.completions) && value.completions.every(completion => record(completion) && text(completion.id) && text(completion.taskId)
      && nullableText(completion.completedAt) && nullableText(completion.localDate) && nullableText(completion.timeZone) && integer(completion.estimatedMinutes) && nullableText(completion.revertedAt));
}
function workspaceShape(value: unknown): value is Workspace {
  return record(value) && value.schemaVersion === 2 && integer(value.revision)
    && record(value.profile) && text(value.profile.displayName) && nullableText(value.profile.majorId) && text(value.profile.timeZone)
    && record(value.preferences) && text(value.preferences.resourceLanguage) && ['all', 'vi', 'en'].includes(value.preferences.resourceLanguage) && typeof value.preferences.preferFree === 'boolean'
    && nullableText(value.activePlanId) && Array.isArray(value.plans) && value.plans.every(planShape)
    && new Set(value.plans.map(plan => plan.id)).size === value.plans.length && (value.activePlanId === null || value.plans.some(plan => plan.id === value.activePlanId))
    && record(value.drafts) && Object.entries(value.drafts).every(([id, draft]) => draftShape(draft) && draft.trackId === id)
    && strings(value.savedCredentialIds) && Array.isArray(value.imports) && value.imports.every(item => record(item) && text(item.fingerprint) && text(item.importedAt) && strings(item.planIds));
}
export function validateRoadmapWorkspace(value: unknown): OperationResult<Workspace> {
  if (record(value) && value.schemaVersion !== 2) return { ok: false, code: 'unsupported_version', issues: [{ code: 'UNSUPPORTED_WORKSPACE_VERSION', field: 'schemaVersion', message: 'Phiên bản workspace không hỗ trợ; dữ liệu gốc được giữ.' }] };
  if (!workspaceShape(value)) return { ok: false, code: 'validation', issues: [{ code: 'INVALID_WORKSPACE_SHAPE', field: 'workspace', message: 'Dữ liệu workspace không đúng cấu trúc; không ghi đè bản đang lưu.' }] };
  return { ok: true, value: structuredClone(value) };
}
export function emptyWorkspace(timeZone: string): Workspace {
  return { schemaVersion: 2, revision: 0, profile: { displayName: '', majorId: null, timeZone }, preferences: { resourceLanguage: 'all', preferFree: true },
    activePlanId: null, plans: [], drafts: {}, savedCredentialIds: [], imports: [] };
}
type StoreOptions = { databaseName?: string; timeZone: string; validate?: (value: unknown) => OperationResult<Workspace> };
const storageFailure = (): OperationResult<Workspace> => ({ ok: false, code: 'storage', issues: [{ code: 'INDEXEDDB_FAILED', field: 'workspace', message: 'Không mở/lưu được IndexedDB. Dữ liệu chưa lưu vẫn được giữ; không chuyển kho lưu tự động.' }] });

export function createRoadmapStore(options: StoreOptions): WorkspacePersistence {
  const validate = options.validate ?? validateRoadmapWorkspace;
  function open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(options.databaseName ?? 'majorweave', 1);
      let blocked = false;
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('workspace')) request.result.createObjectStore('workspace'); };
      request.onerror = () => reject(request.error);
      request.onblocked = () => { blocked = true; reject(new Error('Database blocked')); };
      request.onsuccess = () => {
        if (blocked) { request.result.close(); return; }
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
    });
  }
  async function transact(next?: Workspace, expectedRevision?: number): Promise<OperationResult<Workspace>> {
    let candidate: Workspace | undefined;
    if (next) { const checked = validate(next); if (!checked.ok) return checked; candidate = checked.value; }
    try {
      const db = await open();
      return await new Promise<OperationResult<Workspace>>(resolve => {
        let result: OperationResult<Workspace> = storageFailure();
        const transaction = db.transaction('workspace', candidate ? 'readwrite' : 'readonly');
        const store = transaction.objectStore('workspace');
        const request = store.get('local');
        request.onsuccess = () => {
          const checked = request.result === undefined ? { ok: true as const, value: emptyWorkspace(options.timeZone) } : validate(request.result);
          if (!checked.ok) { result = checked; transaction.abort(); return; }
          if (!candidate) { result = checked; return; }
          if (checked.value.revision !== expectedRevision || candidate.revision !== expectedRevision) {
            result = { ok: false, code: 'conflict', issues: [{ code: 'REVISION_CONFLICT', field: 'revision', message: 'Dữ liệu đã đổi ở tab khác. Tải lại sau khi giữ/xuất bản chưa lưu.' }] };
            transaction.abort(); return;
          }
          const saved = structuredClone({ ...candidate, revision: checked.value.revision + 1 });
          store.put(saved, 'local');
          result = { ok: true, value: saved };
        };
        transaction.oncomplete = () => { db.close(); resolve(result); };
        transaction.onabort = () => { db.close(); resolve(result.ok ? storageFailure() : result); };
      });
    } catch { return storageFailure(); }
  }
  return { loadWorkspace: () => transact(), saveWorkspace: (next, expectedRevision) => transact(next, expectedRevision) };
}
