import type { LearningPlan, PlanGeneration, PlanTask, ValidationIssue } from '../../domain/contracts';
import type { NewTask } from '../../domain/progress';

export type TaskForm = { stageId: string; title: string; minutes: string; acceptance: string; notes: string; week: string; day: string };
export function taskForm(task: PlanTask): TaskForm {
  return { stageId: task.stageId, title: task.title, minutes: String(task.minutes), acceptance: task.acceptance.join('\n'), notes: task.notes, week: task.weekIndex === null ? '' : String(task.weekIndex + 1), day: task.dayIndex === null ? '' : String(task.dayIndex) };
}
export function parseTaskForm(form: TaskForm): { ok: true; value: NewTask } | { ok: false; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const invalid = (field: string, message: string) => issues.push({ code: 'invalid_field', field, message });
  if (!form.title.trim()) invalid('title', 'Nhập tiêu đề công việc.');
  const minutes = Number(form.minutes);
  if (!form.minutes.trim() || !Number.isSafeInteger(minutes) || minutes <= 0) invalid('minutes', 'Phút phải là số nguyên dương.');
  const acceptance = form.acceptance.split('\n').map(a => a.trim()).filter(Boolean);
  if (!acceptance.length) invalid('acceptance', 'Nhập ít nhất một yêu cầu.');
  const weekIndex = form.week.trim() ? Number(form.week) - 1 : null;
  if (weekIndex !== null && (!Number.isSafeInteger(weekIndex) || weekIndex < 0)) invalid('week', 'Tuần phải là số nguyên từ 1; để trống cho backlog.');
  const dayIndex = form.day === '' ? null : Number(form.day);
  if (dayIndex !== null && (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6 || weekIndex === null)) invalid('day', 'Ngày phải trong tuần được chọn; backlog không có ngày.');
  if (!form.stageId) invalid('stageId', 'Chọn chặng học.');
  return issues.length ? { ok: false, issues } : { ok: true, value: { stageId: form.stageId, title: form.title.trim(), minutes, acceptance, notes: form.notes, weekIndex, dayIndex } };
}
export function weekIndices(generation: PlanGeneration): number[] {
  return [...new Set([0, ...generation.tasks.flatMap(t => t.weekIndex === null ? [] : [t.weekIndex]), ...generation.closedWeeks.map(w => w.weekIndex)])].sort((a,b) => a-b);
}
export function visibleTasks(generation: PlanGeneration, week: number | null): PlanTask[] {
  return generation.closedWeeks.find(w => w.weekIndex === week)?.tasks ?? generation.tasks.filter(t => t.weekIndex === week);
}
export function readOnly(plan: LearningPlan, generation: PlanGeneration, week: number | null): boolean {
  return plan.status === 'archived' || generation.id !== plan.current.id || generation.closedWeeks.some(w => w.weekIndex === week);
}
export function safeSourceUrl(url: string): boolean {
  try { return ['https:', 'http:'].includes(new URL(url).protocol); } catch { return false; }
}
