import type { LearningPlan, PlanTask, Instant, ISODate, OperationResult, ValidationIssue, PlanGeneration } from './contracts';

export type ProgressContext = {
  now: Instant;
  today: ISODate;
  timeZone: string;
  nextCompletionId: () => string;
};
export type TaskUpdates = Partial<Pick<PlanTask, 'title' | 'notes' | 'minutes' | 'acceptance' | 'weekIndex' | 'dayIndex'>>;
export type NewTask = Pick<PlanTask, 'stageId' | 'title' | 'minutes' | 'acceptance' | 'notes' | 'weekIndex' | 'dayIndex'>;

const issue = (code: string, field: string, message: string): ValidationIssue => ({ code, field, message });
const fail = <T>(problem: ValidationIssue): OperationResult<T> => ({ ok: false, code: 'validation', issues: [problem] });
const success = <T>(value: T): OperationResult<T> => ({ ok: true, value });
const closed = (plan: LearningPlan, week: number | null) => week !== null && plan.current.closedWeeks.some(w => w.weekIndex === week);
const weekValid = (week: number | null) => week === null || (Number.isSafeInteger(week) && week >= 0);
const realDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
const instantValid = (instant: string) => {
  if (typeof instant !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(instant)) return false;
  return realDate(instant.slice(0, 10)) && Number.isFinite(Date.parse(instant));
};
function clockIssue(context: ProgressContext): ValidationIssue | undefined {
  if (!instantValid(context.now) || typeof context.today !== 'string' || !realDate(context.today)) return issue('invalid_date', 'context', 'Cần thời điểm ISO có múi giờ và ngày thực.');
  try {
    if (typeof context.timeZone !== 'string' || !context.timeZone.trim()) throw new Error('timezone');
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: context.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(context.now));
    const part = (type: string) => parts.find(p => p.type === type)?.value;
    if (`${part('year')}-${part('month')}-${part('day')}` !== context.today) return issue('date_mismatch', 'context.today', 'Ngày phải khớp thời điểm tại múi giờ đã truyền.');
  } catch { return issue('invalid_timezone', 'context.timeZone', 'Múi giờ không hợp lệ.'); }
}

// Input is a validated contracts LearningPlan. Check relational invariants here too,
// so a stale/broken completion link cannot silently create a second active record.
function planIssue(plan: LearningPlan): ValidationIssue | undefined {
  if (plan.status !== 'active') return issue('readonly', 'plan.status', 'Kế hoạch lưu trữ chỉ đọc.');
  if (new Set(plan.current.tasks.map(t => t.id)).size !== plan.current.tasks.length || new Set(plan.completions.map(c => c.id)).size !== plan.completions.length) return issue('duplicate_id', 'plan', 'ID việc hoặc ghi nhận bị trùng.');
  for (const task of plan.current.tasks) {
    const active = plan.completions.filter(c => c.taskId === task.id && c.revertedAt === null);
    if (task.status === 'done' ? active.length !== 1 || active[0].id !== task.completionId : task.completionId !== null || active.length !== 0) return issue('completion_conflict', 'completionId', 'Trạng thái và sổ ghi nhận không khớp.');
  }
}
function taskIssue(plan: LearningPlan, taskId: string): ValidationIssue | undefined {
  const problem = planIssue(plan);
  if (problem) return problem;
  const task = plan.current.tasks.find(t => t.id === taskId);
  if (!task) return issue('task_not_found', 'taskId', 'Không có việc trong generation hiện tại.');
  if (closed(plan, task.weekIndex)) return issue('closed_week', 'weekIndex', 'Tuần đã chốt chỉ đọc.');
}
function taskFieldsIssue(task: Pick<PlanTask, 'title' | 'notes' | 'minutes' | 'acceptance' | 'weekIndex' | 'dayIndex'>): ValidationIssue | undefined {
  if (typeof task.title !== 'string' || !task.title.trim()) return issue('invalid_title', 'title', 'Tiêu đề không được trống.');
  if (!Number.isSafeInteger(task.minutes) || task.minutes <= 0) return issue('invalid_minutes', 'minutes', 'Phút phải là số nguyên dương an toàn.');
  if (!Array.isArray(task.acceptance) || !task.acceptance.length || !task.acceptance.every(a => typeof a === 'string' && a.trim())) return issue('invalid_acceptance', 'acceptance', 'Cần ít nhất một yêu cầu không trống.');
  if (typeof task.notes !== 'string') return issue('invalid_notes', 'notes', 'Ghi chú phải là chuỗi.');
  if (!weekValid(task.weekIndex)) return issue('invalid_week', 'weekIndex', 'Tuần phải là số nguyên không âm hoặc null.');
  if (task.dayIndex !== null && (!Number.isInteger(task.dayIndex) || task.dayIndex < 0 || task.dayIndex > 6 || task.weekIndex === null)) return issue('invalid_day', 'dayIndex', 'Ngày phải từ 0 đến 6; backlog không có ngày.');
}
function allocateId(plan: LearningPlan, factory: () => string): OperationResult<string> {
  let id: string;
  try { id = factory(); } catch { return fail(issue('id_factory_failed', 'id', 'Không tạo được ID.')); }
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return fail(issue('invalid_id', 'id', 'ID mới phải là UUID.'));
  const generations = [plan.current, ...plan.history];
  const ids = [plan.id, ...plan.completions.map(c => c.id), ...generations.flatMap(g => [g.id, ...g.tasks.map(t => t.id), ...g.closedWeeks.flatMap(w => w.tasks.map(t => t.id))])];
  if (ids.some(used => used.toLowerCase() === id.toLowerCase())) return fail(issue('duplicate_id', 'id', 'ID đã được sử dụng trong kế hoạch.'));
  return success(id);
}

/** Explicit desired state: replaying done or undo does not append a completion. */
export function setTaskCompletion(plan: LearningPlan, taskId: string, completed: boolean, context: ProgressContext): OperationResult<LearningPlan> {
  const problem = taskIssue(plan, taskId) ?? clockIssue(context);
  if (problem) return fail(problem);
  if (typeof completed !== 'boolean') return fail(issue('invalid_status', 'completed', 'Cần true hoặc false.'));
  const task = plan.current.tasks.find(t => t.id === taskId)!;
  if (task.status === 'skipped') return fail(issue('skipped_task', 'status', 'Không hoàn thành việc đã bỏ qua.'));
  if ((task.status === 'done') === completed) return success(structuredClone(plan));
  const next = structuredClone(plan);
  const target = next.current.tasks.find(t => t.id === taskId)!;
  if (completed) {
    const id = allocateId(plan, context.nextCompletionId);
    if (!id.ok) return id;
    next.completions.push({ id: id.value, taskId, completedAt: context.now, localDate: context.today, timeZone: context.timeZone, estimatedMinutes: task.minutes, revertedAt: null });
    target.status = 'done';
    target.completionId = id.value;
  } else {
    const completion = next.completions.find(c => c.id === task.completionId)!;
    if (completion.completedAt !== null && Date.parse(context.now) < Date.parse(completion.completedAt)) return fail(issue('clock_before_completion', 'context.now', 'Không thể bỏ hoàn thành trước thời điểm hoàn thành.'));
    completion.revertedAt = context.now;
    target.status = 'todo';
    target.completionId = null;
  }
  return success(next);
}

/** Compatibility only. UI should call setTaskCompletion with an explicit boolean. */
export function toggleTaskCompletion(plan: LearningPlan, taskId: string, context: ProgressContext): OperationResult<LearningPlan> {
  return setTaskCompletion(plan, taskId, plan.current.tasks.find(t => t.id === taskId)?.status !== 'done', context);
}

export function updateTask(plan: LearningPlan, taskId: string, updates: TaskUpdates): OperationResult<LearningPlan> {
  const problem = taskIssue(plan, taskId);
  if (problem) return fail(problem);
  if (!updates || typeof updates !== 'object' || Array.isArray(updates) || Object.keys(updates).some(k => !['title', 'notes', 'minutes', 'acceptance', 'weekIndex', 'dayIndex'].includes(k))) return fail(issue('invalid_patch', 'updates', 'Chỉ được sửa tiêu đề, yêu cầu, phút, ghi chú và lịch.'));
  const task = plan.current.tasks.find(t => t.id === taskId)!;
  const candidate = { ...task, ...updates };
  if (updates.weekIndex === null && !Object.hasOwn(updates, 'dayIndex')) candidate.dayIndex = null;
  const invalid = taskFieldsIssue(candidate);
  if (invalid) return fail(invalid);
  if (closed(plan, candidate.weekIndex)) return fail(issue('closed_week', 'weekIndex', 'Không dời vào tuần đã chốt.'));
  candidate.customized = task.customized || candidate.title !== task.title || candidate.minutes !== task.minutes || JSON.stringify(candidate.acceptance) !== JSON.stringify(task.acceptance);
  const next = structuredClone(plan);
  next.current.tasks = next.current.tasks.map(t => t.id === taskId ? structuredClone(candidate) : t);
  return success(next);
}

/** Custom tasks have no catalog provenance; stageId must belong to this generation. */
export function addTask(plan: LearningPlan, input: NewTask, context: { nextTaskId: () => string }): OperationResult<LearningPlan> {
  const problem = planIssue(plan);
  if (problem) return fail(problem);
  if (!input || typeof input !== 'object' || Object.keys(input).some(k => !['stageId', 'title', 'minutes', 'acceptance', 'notes', 'weekIndex', 'dayIndex'].includes(k))) return fail(issue('invalid_task', 'input', 'Dữ liệu việc tự thêm không hợp lệ.'));
  const invalid = taskFieldsIssue(input);
  if (invalid) return fail(invalid);
  if (!plan.current.selectedStageIds.includes(input.stageId)) return fail(issue('invalid_stage', 'stageId', 'Chọn một chặng của generation hiện tại.'));
  if (closed(plan, input.weekIndex)) return fail(issue('closed_week', 'weekIndex', 'Không thêm vào tuần đã chốt.'));
  const id = allocateId(plan, context.nextTaskId);
  if (!id.ok) return id;
  const next = structuredClone(plan);
  next.current.tasks.push({ ...structuredClone(input), id: id.value, workId: null, workRevision: null, segment: null, source: null, status: 'todo', customized: true, completionId: null });
  return success(next);
}

/** Scheduling never changes task identity, provenance, status or completion. */
export const moveTaskToBacklog = (plan: LearningPlan, taskId: string): OperationResult<LearningPlan> => updateTask(plan, taskId, { weekIndex: null, dayIndex: null });

function stats(tasks: PlanTask[]) {
  const counted = tasks.filter(t => t.status !== 'skipped');
  const done = counted.filter(t => t.status === 'done');
  return { total: counted.length, done: done.length, percentage: counted.length ? done.length / counted.length * 100 : 0, empty: counted.length === 0, totalMinutes: counted.reduce((sum, t) => sum + t.minutes, 0), estimatedCompletedMinutes: done.reduce((sum, t) => sum + t.minutes, 0) };
}

export function closeWeek(plan: LearningPlan, weekIndex: number, unfinishedAction: 'move_next' | 'move_backlog' | 'skip', context: ProgressContext): OperationResult<LearningPlan> {
  const problem = planIssue(plan) ?? clockIssue(context);
  if (problem) return fail(problem);
  if (weekIndex === null || !weekValid(weekIndex)) return fail(issue('invalid_week', 'weekIndex', 'Tuần phải là số nguyên không âm.'));
  if (!['move_next', 'move_backlog', 'skip'].includes(unfinishedAction)) return fail(issue('invalid_action', 'unfinishedAction', 'Chọn dời tuần, backlog hoặc bỏ qua.'));
  // First close wins, including retries with a different action.
  if (closed(plan, weekIndex)) return success(structuredClone(plan));
  const tasks = plan.current.tasks.filter(t => t.weekIndex === weekIndex);
  if (!tasks.length) return fail(issue('empty_week', 'weekIndex', 'Tuần không có việc để chốt.'));
  let destination = weekIndex;
  if (unfinishedAction === 'move_next' && tasks.some(t => t.status === 'todo')) {
    do { destination++; } while (Number.isSafeInteger(destination) && closed(plan, destination));
    if (!Number.isSafeInteger(destination)) return fail(issue('invalid_week', 'weekIndex', 'Không còn chỉ số tuần hợp lệ.'));
  }
  const next = structuredClone(plan);
  const snapshot = stats(tasks);
  next.current.closedWeeks.push({ weekIndex, closedAt: context.now, tasks: structuredClone(tasks), total: snapshot.total, done: snapshot.done, estimatedCompletedMinutes: snapshot.estimatedCompletedMinutes });
  for (const task of next.current.tasks) {
    if (task.weekIndex !== weekIndex || task.status !== 'todo') continue;
    if (unfinishedAction === 'skip') task.status = 'skipped';
    else { task.weekIndex = unfinishedAction === 'move_backlog' ? null : destination; task.dayIndex = null; }
  }
  return success(next);
}

/** Current plan inventory only; snapshots are not added to its denominator. */
export const calculatePlanStats = (plan: LearningPlan) => stats(plan.current.tasks);

/** Historical stats read the requested generation, never the mutable completion ledger. */
export function calculateWeekStats(plan: LearningPlan, weekIndex: number | null, generationId = plan.current.id) {
  if (!weekValid(weekIndex)) return fail<ReturnType<typeof weekStats>>(issue('invalid_week', 'weekIndex', 'Tuần không hợp lệ.'));
  const generation = [plan.current, ...plan.history].find(g => g.id === generationId);
  if (!generation) return fail<ReturnType<typeof weekStats>>(issue('generation_not_found', 'generationId', 'Không tìm thấy generation.'));
  return success(weekStats(generation, weekIndex));
}
function weekStats(generation: PlanGeneration, weekIndex: number | null) {
  const snapshot = generation.closedWeeks.find(w => w.weekIndex === weekIndex);
  const result = stats(snapshot?.tasks ?? generation.tasks.filter(t => t.weekIndex === weekIndex));
  if (snapshot) {
    result.total = snapshot.total;
    result.done = snapshot.done;
    result.estimatedCompletedMinutes = snapshot.estimatedCompletedMinutes;
    result.empty = snapshot.total === 0;
    result.percentage = snapshot.total ? snapshot.done / snapshot.total * 100 : 0;
  }
  const budgetMinutes = weekIndex === null ? null : generation.hoursPerWeek * 60;
  return { ...result, closed: !!snapshot, budgetMinutes, overtimeMinutes: budgetMinutes === null ? 0 : Math.max(0, result.totalMinutes - budgetMinutes) };
}
