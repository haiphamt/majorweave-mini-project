import { modules, faculties, stacks, modulesForStack, defaultSelected, defaultSource, sourceForModule, type BackendStack } from './data';

export const STORAGE_KEY = 'majorweave.prototype.v1';
export type Task = { id: string; moduleId: string; title: string; minutes: number; sourceId: string; week: number; completed: boolean; notes: string; completedAt?: string };
export type PlanMeta = { stack: BackendStack; goal: string; hours: number; startDate: string };
export type State = { version: 1; stack: BackendStack; profileName: string; planMeta: PlanMeta | null; major: string; browseFaculty: string; level: string; preferFree: boolean; language: string; selected: string[]; known: string[]; sourceByModule: Record<string, string>; goal: string; hours: number; startDate: string; tasks: Task[]; credentials: string[] };
export function localISO(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function nextMonday() { const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return localISO(d); }
export function defaults(): State { return { version: 1, stack: 'node', profileName: '', planMeta: null, major: 'software', browseFaculty: 'all', level: 'basic', preferFree: true, language: 'all', selected: defaultSelected('node'), known: ['js'], sourceByModule: Object.fromEntries(modules.map(m => [m.id, m.source])), goal: 'Xây API quản lý công việc', hours: 5, startDate: nextMonday(), tasks: [], credentials: [] }; }
const isStack = (value: unknown): value is BackendStack => typeof value === 'string' && Object.prototype.hasOwnProperty.call(stacks, value);
const isDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T00:00:00`).getTime()) && localISO(new Date(`${value}T00:00:00`)) === value;
export function stackPatch(state: State, stack: BackendStack): Partial<State> {
  const available = modulesForStack(stack);
  const common = state.selected.filter(id => !modules.find(m => m.id === id)?.stacks);
  return {
    stack, level: state.known.includes(stacks[stack].languageModule) ? 'basic' : 'beginner',
    selected: available.filter(m => m.stacks ? !m.optional : common.includes(m.id)).map(m => m.id),
    sourceByModule: { ...state.sourceByModule, ...Object.fromEntries(available.map(m => [m.id, sourceForModule(m.id, stack, state.sourceByModule)])) },
  };
}
export function loadState(): State {
  const base = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || saved.version !== 1) return base;
    const stack = isStack(saved.stack) ? saved.stack : 'node';
    const ids = modulesForStack(stack).map(m => m.id);
    const allIds = modules.map(m => m.id);
    const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(x => typeof x === 'string');
    const goal = typeof saved.goal === 'string' && saved.goal.trim() ? saved.goal.slice(0, 120) : base.goal;
    const hours = Number.isFinite(saved.hours) ? Math.min(20, Math.max(2, Math.round(saved.hours))) : base.hours;
    const startDate = isDate(saved.startDate) ? saved.startDate : base.startDate;
    const oldPlanStack: BackendStack = Array.isArray(saved.tasks) && saved.tasks.some((t: Task) => ['python', 'python-runtime', 'fastapi', 'pytest'].includes(t?.moduleId)) ? 'python' : Array.isArray(saved.tasks) && saved.tasks.some((t: Task) => ['java', 'java-runtime', 'spring', 'junit'].includes(t?.moduleId)) ? 'java' : 'node';
    const meta = saved.planMeta;
    return {
      ...base,
      stack,
      profileName: typeof saved.profileName === 'string' ? saved.profileName.slice(0, 60) : '',
      planMeta: Array.isArray(saved.tasks) && saved.tasks.length ? { stack: isStack(meta?.stack) ? meta.stack : oldPlanStack, goal: typeof meta?.goal === 'string' && meta.goal.trim() ? meta.goal.slice(0, 120) : goal, hours: Number.isFinite(meta?.hours) ? Math.min(20, Math.max(2, Math.round(meta.hours))) : hours, startDate: isDate(meta?.startDate) ? meta.startDate : startDate } : null,
      major: faculties.flatMap(f => f.majors).some(m => m.id === saved.major) ? saved.major : '',
      browseFaculty: faculties.some(f => f.id === saved.browseFaculty) ? saved.browseFaculty : 'all',
      level: ['beginner', 'basic', 'api'].includes(saved.level) ? saved.level : base.level,
      preferFree: typeof saved.preferFree === 'boolean' ? saved.preferFree : true,
      language: ['all', 'vi', 'en'].includes(saved.language) ? saved.language : 'all',
      selected: strings(saved.selected) ? [...new Set((saved.selected as string[]).filter(id => ids.includes(id)))] : defaultSelected(stack),
      known: strings(saved.known) ? (saved.known as string[]).filter(id => allIds.includes(id)) : base.known,
      sourceByModule: Object.fromEntries(modules.map(m => [m.id, modulesForStack(stack).some(a => a.id === m.id) ? sourceForModule(m.id, stack, saved.sourceByModule || {}) : typeof saved.sourceByModule?.[m.id] === 'string' ? saved.sourceByModule[m.id] : defaultSource(m, stack)])),
      goal, hours, startDate,
      tasks: Array.isArray(saved.tasks) ? saved.tasks.filter((t: Task) => t && typeof t.id === 'string' && typeof t.moduleId === 'string' && typeof t.title === 'string' && Number.isFinite(t.minutes) && t.minutes > 0 && Number.isInteger(t.week) && t.week >= 0 && t.week < 1000 && typeof t.completed === 'boolean' && typeof t.sourceId === 'string' && typeof t.notes === 'string').map((t: Task) => ({ ...t, minutes: Math.min(1200, t.minutes), completedAt: t.completed && typeof t.completedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(t.completedAt) && Number.isFinite(new Date(t.completedAt).getTime()) ? t.completedAt : undefined })) : [],
      credentials: strings(saved.credentials) ? saved.credentials : [],
    };
  } catch { return base; }
}
export function generatePlan(state: State): Task[] {
  const budget = state.hours * 60;
  let week = 0;
  let minutes = 0;
  return state.selected.filter(id => !state.known.includes(id) && modulesForStack(state.stack).some(m => m.id === id)).flatMap(id => {
    const module = modules.find(m => m.id === id)!;
    return module.tasks.map((task, index) => {
      if (minutes + task.minutes > budget && minutes > 0) { week++; minutes = 0; }
      minutes += task.minutes;
      const taskId = `${state.stack !== 'node' && ['oop', 'sql', 'auth', 'deploy'].includes(id) ? state.stack + '-' : ''}${id}-${index}`;
      const old = state.tasks.find(t => t.id === taskId);
      return { id: taskId, moduleId: id, title: task.title, minutes: task.minutes, sourceId: sourceForModule(id, state.stack, state.sourceByModule), week, completed: old?.completed || false, completedAt: old?.completed ? old.completedAt : undefined, notes: old?.notes || '' };
    });
  });
}
export function hoursText(minutes: number) { return minutes < 60 ? `${minutes} phút` : `${Number((minutes / 60).toFixed(1))} giờ`; }
export function weekDate(start: string, week: number) { const d = new Date(`${start}T00:00:00`); d.setDate(d.getDate() + week * 7); return d; }
export function shortDate(d: Date) { return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); }
