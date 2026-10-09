import type { LearningPlan } from './contracts';

// Caller validates the workspace first. Dates belong to the original completion,
// never to the current profile timezone or the week where a task was scheduled.
export function summarizeActivity(plans: readonly LearningPlan[]) {
  const days = new Map<string, { date: string; completedTasks: number; estimatedMinutes: number }>();
  let undatedTasks = 0;
  let undatedEstimatedMinutes = 0;
  for (const plan of plans) {
    for (const completion of plan.completions) {
      if (completion.revertedAt !== null) continue;
      if (completion.localDate === null) {
        undatedTasks++;
        undatedEstimatedMinutes += completion.estimatedMinutes;
        continue;
      }
      const day = days.get(completion.localDate) ?? { date: completion.localDate, completedTasks: 0, estimatedMinutes: 0 };
      day.completedTasks++;
      day.estimatedMinutes += completion.estimatedMinutes;
      days.set(day.date, day);
    }
  }
  const ordered = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  return {
    days: ordered,
    completedTasks: ordered.reduce((sum, day) => sum + day.completedTasks, 0),
    estimatedMinutes: ordered.reduce((sum, day) => sum + day.estimatedMinutes, 0),
    undatedTasks,
    undatedEstimatedMinutes,
  };
}
