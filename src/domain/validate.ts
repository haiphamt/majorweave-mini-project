import type {
  BackupFile, ClosedWeek, ContentPack, LearningPlan, OperationResult, PlanGeneration,
  PlanTask, ResourceSnapshot, RoadmapDraft, StudyCompletion, ValidationIssue, Workspace,
} from './contracts';

// contentPacks remains accepted for existing callers; catalog readiness is checked
// separately at generation time, never when persisting an editable draft.
type Options = { majorIds?: readonly string[]; contentPacks?: readonly ContentPack[] };
type Check<T> = (value: unknown, field: string) => value is T;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const contentId = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function calendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function instant(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  return !!match && calendarDate(match[1]) && Number(match[2]) < 24 && Number(match[3]) < 60
    && Number(match[4]) < 60 && (!match[7] || (Number(match[7]) <= 23 && Number(match[8]) < 60))
    && Number.isFinite(Date.parse(value));
}

function timeZone(value: unknown): value is string {
  if (typeof value !== 'string' || !value || /^[+-]/.test(value)) return false;
  try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; }
}

function localDateAt(value: string, zone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(value));
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function checker(issues: ValidationIssue[], options: Options) {
  const issue = (code: string, field: string, message: string) => { issues.push({ code, field, message }); return false; };
  const test = (condition: boolean, field: string, message: string, code = 'invalid_value') => condition || issue(code, field, message);
  const object: Check<Record<string, unknown>> = (v, f): v is Record<string, unknown> => test(record(v), f, 'Cần một object.', 'invalid_type');
  const text = (v: unknown, f: string, allowEmpty = false, max = Infinity): v is string =>
    test(typeof v === 'string' && (allowEmpty || v.trim().length > 0) && v.length <= max, f, `Cần chuỗi${allowEmpty ? '' : ' không rỗng'}${max < Infinity ? ` tối đa ${max} ký tự` : ''}.`, 'invalid_type');
  const id: Check<string> = (v, f): v is string => test(typeof v === 'string' && contentId.test(v), f, 'ID nội dung không hợp lệ.', 'invalid_id');
  const uid: Check<string> = (v, f): v is string => test(typeof v === 'string' && uuid.test(v), f, 'Cần UUID hợp lệ.', 'invalid_id');
  const integer = (v: unknown, f: string, min = 0, max = Number.MAX_SAFE_INTEGER): v is number =>
    test(typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max, f, `Cần số nguyên từ ${min} đến ${max}.`, 'invalid_range');
  const bool: Check<boolean> = (v, f): v is boolean => test(typeof v === 'boolean', f, 'Cần boolean.', 'invalid_type');
  const date: Check<string> = (v, f): v is string => test(calendarDate(v), f, 'Ngày YYYY-MM-DD không tồn tại.', 'invalid_date');
  const timestamp: Check<string> = (v, f): v is string => test(instant(v), f, 'Cần thời điểm ISO có timezone và ngày hợp lệ.', 'invalid_date');
  const zone: Check<string> = (v, f): v is string => test(timeZone(v), f, 'Timezone IANA không hợp lệ.', 'invalid_timezone');
  const enumeration = <T extends string>(v: unknown, f: string, values: readonly T[]): v is T =>
    test(typeof v === 'string' && values.some(item => item === v), f, `Chọn một trong: ${values.join(', ')}.`, 'invalid_enum');
  const nullable = <T>(v: unknown, f: string, check: Check<T>): v is T | null => v === null || check(v, f);
  const array = <T>(v: unknown, f: string, check: Check<T>): v is T[] => {
    if (!Array.isArray(v)) return issue('invalid_type', f, 'Cần mảng.');
    return Array.from(v, (item: unknown, i) => check(item, `${f}[${i}]`)).every(Boolean);
  };
  const unique = (values: readonly string[], f: string) => {
    const seen = new Set<string>();
    values.forEach((v, i) => { if (seen.has(v)) issue('duplicate_id', `${f}[${i}]`, `ID trùng: ${v}`); seen.add(v); });
  };
  const ids: Check<string[]> = (v, f): v is string[] => {
    if (!array(v, f, id)) return false;
    unique(v, f); return true;
  };
  const resourceMap: Check<Record<string, string>> = (v, f): v is Record<string, string> => {
    if (!object(v, f)) return false;
    return Object.entries(v).map(([key, value]) => [id(key, `${f}.${key}`), id(value, `${f}.${key}`)].every(Boolean)).every(Boolean);
  };
  const url: Check<string> = (v, f): v is string => {
    if (typeof v !== 'string') return issue('invalid_url', f, 'Cần URL http/https.');
    try { const u = new URL(v); return test(['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password, f, 'Chỉ nhận URL http/https không chứa thông tin đăng nhập.', 'invalid_url'); }
    catch { return issue('invalid_url', f, 'URL không hợp lệ.'); }
  };
  const profile: Check<Workspace['profile']> = (v, f): v is Workspace['profile'] => {
    if (!object(v, f)) return false;
    return [text(v.displayName, `${f}.displayName`, true, 60), nullable(v.majorId, `${f}.majorId`, id), zone(v.timeZone, `${f}.timeZone`),
      test(v.majorId === null || !options.majorIds || options.majorIds.some(x => x === v.majorId), `${f}.majorId`, 'Ngành không có trong catalog được truyền vào.', 'unknown_major')].every(Boolean);
  };
  const source: Check<ResourceSnapshot> = (v, f): v is ResourceSnapshot => {
    if (!object(v, f)) return false;
    return [id(v.id, `${f}.id`), text(v.title, `${f}.title`), text(v.provider, `${f}.provider`), url(v.url, `${f}.url`)].every(Boolean);
  };
  const segment: Check<NonNullable<PlanTask['segment']>> = (v, f): v is NonNullable<PlanTask['segment']> => {
    if (!object(v, f)) return false;
    return [integer(v.fromMinute, `${f}.fromMinute`), integer(v.toMinute, `${f}.toMinute`, 1)].every(Boolean);
  };
  const task: Check<PlanTask> = (v, f): v is PlanTask => {
    if (!object(v, f)) return false;
    return [uid(v.id, `${f}.id`), id(v.stageId, `${f}.stageId`), nullable(v.workId, `${f}.workId`, id),
      nullable(v.workRevision, `${f}.workRevision`, (x, p): x is number => integer(x, p, 1)), nullable(v.segment, `${f}.segment`, segment),
      text(v.title, `${f}.title`), integer(v.minutes, `${f}.minutes`, 1), array(v.acceptance, `${f}.acceptance`, text),
      nullable(v.source, `${f}.source`, source), nullable(v.weekIndex, `${f}.weekIndex`, integer),
      nullable(v.dayIndex, `${f}.dayIndex`, (x, p): x is number => integer(x, p, 0, 6)),
      enumeration(v.status, `${f}.status`, ['todo', 'done', 'skipped'] as const), bool(v.customized, `${f}.customized`),
      nullable(v.completionId, `${f}.completionId`, uid), text(v.notes, `${f}.notes`, true)].every(Boolean);
  };
  const completion: Check<StudyCompletion> = (v, f): v is StudyCompletion => {
    if (!object(v, f)) return false;
    return [uid(v.id, `${f}.id`), uid(v.taskId, `${f}.taskId`), nullable(v.completedAt, `${f}.completedAt`, timestamp),
      nullable(v.localDate, `${f}.localDate`, date), nullable(v.timeZone, `${f}.timeZone`, zone),
      integer(v.estimatedMinutes, `${f}.estimatedMinutes`, 1), nullable(v.revertedAt, `${f}.revertedAt`, timestamp)].every(Boolean);
  };
  const closedWeek: Check<ClosedWeek> = (v, f): v is ClosedWeek => {
    if (!object(v, f)) return false;
    return [integer(v.weekIndex, `${f}.weekIndex`), timestamp(v.closedAt, `${f}.closedAt`), array(v.tasks, `${f}.tasks`, task),
      integer(v.total, `${f}.total`), integer(v.done, `${f}.done`), integer(v.estimatedCompletedMinutes, `${f}.estimatedCompletedMinutes`)].every(Boolean);
  };
  const draft: Check<RoadmapDraft> = (v, f): v is RoadmapDraft => {
    if (!object(v, f)) return false;
    const checks = [id(v.trackId, `${f}.trackId`), ids(v.selectedStageIds, `${f}.selectedStageIds`), ids(v.knownStageIds, `${f}.knownStageIds`),
      resourceMap(v.resourceByStage, `${f}.resourceByStage`), text(v.goal, `${f}.goal`, true), integer(v.hoursPerWeek, `${f}.hoursPerWeek`, 2, 20), date(v.startDate, `${f}.startDate`)];
    if (calendarDate(v.startDate)) checks.push(test(new Date(`${v.startDate}T00:00:00Z`).getUTCDay() === 1, `${f}.startDate`, 'Ngày bắt đầu phải là thứ Hai.', 'invalid_start_day'));
    return checks.every(Boolean);
  };
  const generation: Check<PlanGeneration> = (v, f): v is PlanGeneration => {
    if (!object(v, f)) return false;
    return [draft(v, f), uid(v.id, `${f}.id`), timestamp(v.createdAt, `${f}.createdAt`), text(v.contentVersion, `${f}.contentVersion`),
      array(v.tasks, `${f}.tasks`, task), array(v.closedWeeks, `${f}.closedWeeks`, closedWeek)].every(Boolean);
  };
  const plan: Check<LearningPlan> = (v, f): v is LearningPlan => {
    if (!object(v, f)) return false;
    return [uid(v.id, `${f}.id`), text(v.name, `${f}.name`), id(v.pathId, `${f}.pathId`), id(v.trackId, `${f}.trackId`),
      text(v.contentVersion, `${f}.contentVersion`), timestamp(v.createdAt, `${f}.createdAt`), enumeration(v.status, `${f}.status`, ['active', 'archived'] as const),
      generation(v.current, `${f}.current`), array(v.history, `${f}.history`, generation), array(v.completions, `${f}.completions`, completion)].every(Boolean);
  };
  const preferences: Check<Workspace['preferences']> = (v, f): v is Workspace['preferences'] => {
    if (!object(v, f)) return false;
    return [enumeration(v.resourceLanguage, `${f}.resourceLanguage`, ['all', 'vi', 'en'] as const), bool(v.preferFree, `${f}.preferFree`)].every(Boolean);
  };
  const imports: Check<Workspace['imports'][number]> = (v, f): v is Workspace['imports'][number] => {
    if (!object(v, f)) return false;
    return [text(v.fingerprint, `${f}.fingerprint`), timestamp(v.importedAt, `${f}.importedAt`), array(v.planIds, `${f}.planIds`, uid)].every(Boolean);
  };
  const drafts: Check<Workspace['drafts']> = (v, f): v is Workspace['drafts'] => {
    if (!object(v, f)) return false;
    return Object.entries(v).map(([key, value]) => [id(key, `${f}.${key}`), draft(value, `${f}.${key}`),
      test(record(value) && value.trackId === key, `${f}.${key}.trackId`, 'Key draft phải bằng trackId.', 'relation')].every(Boolean)).every(Boolean);
  };
  const workspace: Check<Workspace> = (v, f): v is Workspace => {
    if (!object(v, f)) return false;
    return [test(v.schemaVersion === 2, `${f}.schemaVersion`, 'Chỉ hỗ trợ Workspace schemaVersion 2.', 'unsupported_version'),
      integer(v.revision, `${f}.revision`), profile(v.profile, `${f}.profile`), preferences(v.preferences, `${f}.preferences`),
      nullable(v.activePlanId, `${f}.activePlanId`, uid), array(v.plans, `${f}.plans`, plan), drafts(v.drafts, `${f}.drafts`),
      ids(v.savedCredentialIds, `${f}.savedCredentialIds`), array(v.imports, `${f}.imports`, imports)].every(Boolean);
  };

  function relations(w: Workspace, root: string) {
    unique(w.plans.map(p => p.id), `${root}.plans`);
    test(w.activePlanId === null || w.plans.some(p => p.id === w.activePlanId), `${root}.activePlanId`, 'Không tìm thấy plan đang xem.', 'relation');
    unique(w.imports.map(i => i.fingerprint), `${root}.imports`);
    w.imports.forEach((entry, i) => {
      unique(entry.planIds, `${root}.imports[${i}].planIds`);
      entry.planIds.forEach((id, j) => test(w.plans.some(p => p.id === id), `${root}.imports[${i}].planIds[${j}]`, 'Không tìm thấy plan đã nhập.', 'relation'));
    });
    const ownedIds = new Map<string, string>();
    function claim(id: string, owner: string, field: string) {
      test(!ownedIds.has(id) || ownedIds.get(id) === owner, field, 'UUID bị dùng cho nhiều thực thể.', 'duplicate_id');
      ownedIds.set(id, owner);
    }
    w.plans.forEach((p, pi) => {
      const f = `${root}.plans[${pi}]`;
      claim(p.id, `plan:${pi}`, `${f}.id`);
      test(p.trackId.startsWith(`${p.pathId}.`), `${f}.trackId`, 'Track phải thuộc path của plan.', 'relation');
      test(p.trackId === p.current.trackId && p.contentVersion === p.current.contentVersion, `${f}.current`, 'Track/version hiện hành phải khớp plan.', 'relation');
      const generations = [...p.history, p.current];
      unique(generations.map(g => g.id), `${f}.generations`);
      unique(p.completions.map(c => c.id), `${f}.completions`);
      const ledger = new Map(p.completions.map(c => [c.id, c]));
      const taskIds = new Set(generations.flatMap(g => [...g.tasks, ...g.closedWeeks.flatMap(cw => cw.tasks)]).map(t => t.id));
      const liveByTask = new Set<string>();
      p.completions.forEach((c, ci) => {
        const cf = `${f}.completions[${ci}]`;
        claim(c.id, `completion:${pi}:${ci}`, `${cf}.id`);
        test(taskIds.has(c.taskId), `${cf}.taskId`, 'Completion không có task trong plan/history/snapshot.', 'relation');
        test((c.completedAt === null && c.localDate === null && c.timeZone === null) || (c.completedAt !== null && c.localDate !== null && c.timeZone !== null), cf, 'Legacy phải thiếu đồng thời timestamp/ngày/timezone.', 'relation');
        if (c.completedAt && c.timeZone) test(c.localDate === localDateAt(c.completedAt, c.timeZone), `${cf}.localDate`, 'Ngày không khớp timestamp/timezone tại ghi nhận.', 'relation');
        if (c.completedAt && c.revertedAt) test(Date.parse(c.revertedAt) >= Date.parse(c.completedAt), `${cf}.revertedAt`, 'Undo không được trước completion.', 'relation');
        if (!c.revertedAt) { test(!liveByTask.has(c.taskId), cf, 'Một task có nhiều completion chưa revert.', 'relation'); liveByTask.add(c.taskId); }
      });
      function taskRelations(t: PlanTask, tf: string, snapshotAt: string | null) {
        claim(t.id, `task:${pi}:${t.id}`, `${tf}.id`);
        test((t.workId === null) === (t.workRevision === null), `${tf}.workRevision`, 'workId/revision phải cùng có hoặc cùng null.', 'relation');
        test(t.workId !== null || (t.customized && t.segment === null), tf, 'Việc tự thêm phải customized và không có segment.', 'relation');
        // Segment preserves source provenance; customized minutes are the learner's estimate.
        if (t.segment) test(t.workId !== null && t.segment.toMinute > t.segment.fromMinute
          && (t.customized || t.segment.toMinute - t.segment.fromMinute === t.minutes),
        `${tf}.segment`, 'Đoạn phải có workId, biên tăng và khớp số phút khi chưa customized.', 'relation');
        test(t.weekIndex !== null || t.dayIndex === null, `${tf}.dayIndex`, 'Backlog không có ngày trong tuần.', 'relation');
        if (t.status !== 'done') {
          test(t.completionId === null, `${tf}.completionId`, 'Todo/skipped không có completion hiện hành.', 'relation');
          if (snapshotAt === null) test(!liveByTask.has(t.id), `${tf}.completionId`, 'Current todo/skipped còn completion chưa revert.', 'relation');
          return;
        }
        const c = t.completionId === null ? undefined : ledger.get(t.completionId);
        if (!c) { issue('relation', `${tf}.completionId`, 'Done phải tham chiếu completion tồn tại.'); return; }
        test(c.taskId === t.id, `${tf}.completionId`, 'Completion thuộc task khác.', 'relation');
        if (snapshotAt === null) test(c.revertedAt === null, `${tf}.completionId`, 'Current done không được trỏ tới completion đã revert.', 'relation');
        else {
          if (c.completedAt) test(Date.parse(c.completedAt) <= Date.parse(snapshotAt), `${tf}.completionId`, 'Completion xảy ra sau snapshot.', 'relation');
          if (c.revertedAt) test(Date.parse(c.revertedAt) >= Date.parse(snapshotAt), `${tf}.completionId`, 'Completion đã bị undo trước snapshot.', 'relation');
        }
      }
      generations.forEach((g, gi) => {
        const gf = gi === p.history.length ? `${f}.current` : `${f}.history[${gi}]`;
        claim(g.id, `generation:${pi}:${gi}`, `${gf}.id`);
        test(Date.parse(g.createdAt) >= Date.parse(p.createdAt), `${gf}.createdAt`, 'Generation trước ngày tạo plan.', 'relation');
        if (gi > 0) test(Date.parse(g.createdAt) >= Date.parse(generations[gi - 1].createdAt), `${gf}.createdAt`, 'History không theo thứ tự tạo.', 'relation');
        unique(g.tasks.map(t => t.id), `${gf}.tasks`);
        unique(g.closedWeeks.map(cw => String(cw.weekIndex)), `${gf}.closedWeeks`);
        const nextCreatedAt = gi < p.history.length ? generations[gi + 1].createdAt : null;
        g.tasks.forEach((t, ti) => taskRelations(t, `${gf}.tasks[${ti}]`, nextCreatedAt));
        g.closedWeeks.forEach((cw, wi) => {
          const wf = `${gf}.closedWeeks[${wi}]`;
          unique(cw.tasks.map(t => t.id), `${wf}.tasks`);
          test(Date.parse(cw.closedAt) >= Date.parse(g.createdAt) && (!nextCreatedAt || Date.parse(cw.closedAt) <= Date.parse(nextCreatedAt)), `${wf}.closedAt`, 'Tuần chốt ngoài khoảng generation.', 'relation');
          cw.tasks.forEach((t, ti) => { taskRelations(t, `${wf}.tasks[${ti}]`, cw.closedAt); test(t.weekIndex === cw.weekIndex, `${wf}.tasks[${ti}].weekIndex`, 'Task snapshot nằm sai tuần.', 'relation'); });
          const included = cw.tasks.filter(t => t.status !== 'skipped');
          const done = included.filter(t => t.status === 'done');
          test(cw.total === included.length, `${wf}.total`, 'Tổng snapshot phải bỏ skipped.', 'snapshot_total');
          test(cw.done === done.length, `${wf}.done`, 'Số done không khớp snapshot.', 'snapshot_total');
          test(cw.estimatedCompletedMinutes === done.reduce((sum, t) => sum + t.minutes, 0), `${wf}.estimatedCompletedMinutes`, 'Phút hoàn thành không khớp snapshot.', 'snapshot_total');
        });
      });
    });
  }
  function draftCatalog(d: RoadmapDraft, packs: readonly ContentPack[], f: string) {
    const stages = new Map(packs.flatMap(p => p.stages).map(s => [s.id, s]));
    const resources = new Set(packs.flatMap(p => p.resources).map(r => r.id));
    const track = packs.flatMap(p => p.tracks).find(t => t.id === d.trackId);
    if (!track) { issue('catalog_reference', `${f}.trackId`, 'Không tìm thấy track để tạo kế hoạch.'); return; }
    const allowed = new Set(track.stageIds);
    const available = new Set([...d.selectedStageIds, ...d.knownStageIds]);
    [...available].forEach(id => test(allowed.has(id), f, `Chặng ${id} không thuộc track.`, 'catalog_reference'));
    const visiting = new Set<string>(), visited = new Set<string>();
    function visit(id: string) {
      if (visiting.has(id)) { issue('prerequisite_cycle', f, `Vòng tiên quyết tại ${id}.`); return; }
      if (visited.has(id)) return;
      const stage = stages.get(id);
      if (!stage) { issue('catalog_reference', f, `Thiếu pack chứa chặng ${id}.`); return; }
      visiting.add(id);
      stage.prerequisiteIds.forEach(pre => { test(available.has(pre), f, `Thiếu tiên quyết ${pre}.`, 'missing_prerequisite'); if (available.has(pre)) visit(pre); });
      visiting.delete(id); visited.add(id);
    }
    d.selectedStageIds.filter(id => !d.knownStageIds.includes(id)).forEach(visit);
    Object.entries(d.resourceByStage).forEach(([id, resource]) => test(allowed.has(id) && !!stages.get(id)?.resourceIds.includes(resource) && resources.has(resource), `${f}.resourceByStage.${id}`, 'Nguồn không thuộc chặng/track hoặc thiếu pack.', 'catalog_reference'));
  }
  return { workspace, profile, draft, draftCatalog, timestamp, issue, relations };
}

function failure<T>(issues: ValidationIssue[]): OperationResult<T> {
  return { ok: false, code: issues.some(i => i.code === 'unsupported_version') ? 'unsupported_version' : 'validation', issues };
}

export function validateProfile(value: unknown, majorIds?: readonly string[]): OperationResult<Workspace['profile']> {
  const issues: ValidationIssue[] = [];
  const check = checker(issues, { majorIds });
  if (!check.profile(value, 'profile') || issues.length) return failure(issues);
  return { ok: true, value };
}

export function validateWorkspace(value: unknown, options: Options = {}): OperationResult<Workspace> {
  const issues: ValidationIssue[] = [];
  const check = checker(issues, options);
  if (!check.workspace(value, 'workspace')) return failure(issues);
  check.relations(value, 'workspace');
  return issues.length ? failure(issues) : { ok: true, value };
}

// Optional catalog preflight for the resolver/planner, not a persistence gate.
// The planner still owns scheduling, capacity and generation-specific checks.
export function validateDraftForGeneration(value: unknown, contentPacks: readonly ContentPack[]): OperationResult<RoadmapDraft> {
  const issues: ValidationIssue[] = [];
  const check = checker(issues, {});
  if (!check.draft(value, 'draft') || issues.length) return failure(issues);
  check.draftCatalog(value, contentPacks, 'draft');
  return issues.length ? failure(issues) : { ok: true, value };
}

export function validateBackupFile(value: unknown, options: Options = {}): OperationResult<BackupFile> {
  const issues: ValidationIssue[] = [];
  const check = checker(issues, options);
  if (!record(value)) return failure([{ code: 'invalid_type', field: 'backup', message: 'Cần object backup.' }]);
  if (value.format !== 'majorweave-backup') check.issue('invalid_format', 'backup.format', 'Không phải file majorweave-backup.');
  if (value.formatVersion !== 1) check.issue('unsupported_version', 'backup.formatVersion', 'Chỉ hỗ trợ formatVersion 1.');
  const validTime = check.timestamp(value.exportedAt, 'backup.exportedAt');
  const result = validateWorkspace(value.workspace, options);
  if (!result.ok) issues.push(...result.issues);
  if (issues.length || !validTime || !result.ok || typeof value.exportedAt !== 'string') return failure(issues);
  return { ok: true, value: { format: 'majorweave-backup', formatVersion: 1, exportedAt: value.exportedAt, workspace: result.value } };
}
