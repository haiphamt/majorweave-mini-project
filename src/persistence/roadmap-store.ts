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

function failure(code: string, message: string): OperationResult<Workspace> {
  return { ok: false, code: 'storage', issues: [{ code, field: 'workspace', message }] };
}
function storageFailure(error: unknown, phase: 'open' | 'read' | 'write' | 'abort'): OperationResult<Workspace> {
  const name = error instanceof Error || error instanceof DOMException ? error.name : '';
  if (name === 'QuotaExceededError') return failure('INDEXEDDB_QUOTA', 'Thiết bị không đủ dung lượng lưu. Giữ bản chưa lưu để thử lại hoặc xuất sao lưu.');
  if (name === 'VersionError') return failure('INDEXEDDB_VERSION', 'Database có phiên bản mới hơn ứng dụng. Dữ liệu gốc được giữ; hãy cập nhật ứng dụng.');
  if (name === 'SecurityError' || name === 'NotAllowedError') return failure('INDEXEDDB_UNAVAILABLE', 'Trình duyệt không cho phép dùng IndexedDB. Bản chưa lưu được giữ, không tự đổi kho lưu.');
  if (name === 'AbortError' || phase === 'abort') return failure('INDEXEDDB_ABORTED', 'Giao dịch lưu đã bị hủy. Chưa lưu thành công; giữ bản đang sửa để thử lại.');
  return failure(`INDEXEDDB_${phase.toUpperCase()}_FAILED`, 'Không đọc/lưu được IndexedDB. Bản chưa lưu được giữ; không tự đặt lại dữ liệu.');
}

export function createRoadmapStore(options: StoreOptions): WorkspacePersistence {
  const validate = options.validate ?? validateRoadmapWorkspace;
  type OpenResult = { ok: true; db: IDBDatabase } | { ok: false; result: OperationResult<Workspace> };
  function open(): Promise<OpenResult> {
    return new Promise(resolve => {
      let settled = false;
      const fail = (result: OperationResult<Workspace>) => {
        if (!settled) { settled = true; resolve({ ok: false, result }); }
      };
      try {
        if (typeof indexedDB === 'undefined') {
          fail(failure('INDEXEDDB_UNAVAILABLE', 'Trình duyệt không hỗ trợ IndexedDB. Không tự chuyển kho lưu.'));
          return;
        }
        const request = indexedDB.open(options.databaseName ?? 'majorweave', 1);
        request.onblocked = () => fail(failure('INDEXEDDB_BLOCKED', 'Tab khác đang giữ database. Đóng hoặc tải lại tab ấy rồi thử lại; không xóa database.'));
        request.onerror = () => fail(storageFailure(request.error, 'open'));
        request.onupgradeneeded = () => {
          try {
            // A blocked open may resume after the caller already received an error.
            if (settled) { request.transaction?.abort(); return; }
            if (!request.result.objectStoreNames.contains('workspace')) request.result.createObjectStore('workspace');
          } catch (error) {
            request.transaction?.abort();
            fail(storageFailure(error, 'open'));
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          if (settled) { db.close(); return; }
          db.onversionchange = () => db.close();
          settled = true;
          resolve({ ok: true, db });
        };
      } catch (error) { fail(storageFailure(error, 'open')); }
    });
  }

  async function transact(next?: Workspace, expectedRevision?: number): Promise<OperationResult<Workspace>> {
    let candidate: Workspace | undefined;
    try {
      if (next !== undefined) {
        if (!Number.isSafeInteger(expectedRevision) || (expectedRevision ?? -1) < 0) {
          return { ok: false, code: 'validation', issues: [{ code: 'INVALID_EXPECTED_REVISION', field: 'revision', message: 'Revision mong đợi phải là số nguyên không âm.' }] };
        }
        // Snapshot before awaiting open: caller changes cannot alter the pending save.
        const checked = validate(structuredClone(next));
        if (!checked.ok) return checked;
        candidate = structuredClone(checked.value);
      }
    } catch (error) { return storageFailure(error, 'write'); }
    const opened = await open();
    if (!opened.ok) return opened.result;
    const db = opened.db;
    return new Promise<OperationResult<Workspace>>(resolve => {
      let transaction: IDBTransaction;
      let result: OperationResult<Workspace> = failure('INDEXEDDB_ABORTED', 'Giao dịch chưa hoàn tất hoặc đã bị hủy. Bản chưa lưu được giữ.');
      let requestFailure: OperationResult<Workspace> | undefined;
      try {
        transaction = db.transaction('workspace', candidate ? 'readwrite' : 'readonly');
        // Register handlers before queuing any request, including synchronous failures.
        transaction.oncomplete = () => { db.close(); resolve(result); };
        transaction.onabort = () => {
          db.close();
          resolve(requestFailure ?? (!result.ok ? result : storageFailure(transaction.error, 'abort')));
        };
        transaction.onerror = () => {
          if (!requestFailure) requestFailure = storageFailure(transaction.error, candidate ? 'write' : 'read');
          // Do not preventDefault: native request errors must abort the transaction.
        };
        const store = transaction.objectStore('workspace');
        const request = store.get('local');
        request.onerror = () => { requestFailure = storageFailure(request.error, 'read'); };
        request.onsuccess = () => {
          try {
            const checked = request.result === undefined
              ? { ok: true as const, value: emptyWorkspace(options.timeZone) }
              : validate(request.result);
            if (!checked.ok) { result = checked; transaction.abort(); return; }
            if (!candidate) { result = checked; return; }
            if (checked.value.revision !== expectedRevision || candidate.revision !== expectedRevision) {
              result = { ok: false, code: 'conflict', issues: [{ code: 'REVISION_CONFLICT', field: 'revision', message: 'Dữ liệu đã đổi ở tab khác. Giữ/xuất bản chưa lưu trước khi tải lại.' }] };
              transaction.abort(); return;
            }
            if (checked.value.revision === Number.MAX_SAFE_INTEGER) {
              result = { ok: false, code: 'validation', issues: [{ code: 'REVISION_OVERFLOW', field: 'revision', message: 'Revision vượt giới hạn số nguyên an toàn; dữ liệu gốc được giữ.' }] };
              transaction.abort(); return;
            }
            const saved = structuredClone({ ...candidate, revision: checked.value.revision + 1 });
            const write = store.put(saved, 'local');
            write.onerror = () => { requestFailure = storageFailure(write.error, 'write'); };
            // This is a candidate result; resolve only from transaction.oncomplete.
            result = { ok: true, value: saved };
          } catch (error) {
            requestFailure = storageFailure(error, candidate ? 'write' : 'read');
            transaction.abort();
          }
        };
      } catch (error) {
        // Transaction creation / object-store lookup can throw synchronously.
        db.close();
        resolve(storageFailure(error, candidate ? 'write' : 'read'));
      }
    });
  }
  return { loadWorkspace: () => transact(), saveWorkspace: (next, expectedRevision) => transact(next, expectedRevision) };
}
