import { backendPack } from '../../../src/content/paths/backend';
import { devopsPack } from '../../../src/content/paths/devops';
import { networkPack } from '../../../src/content/paths/network';
import { securityPack } from '../../../src/content/paths/security';
import { qaPack } from '../../../src/content/paths/qa';
import { resolveRegisteredTrack } from '../../../src/app/resolve-track';
import { generatePlan } from '../../../src/domain/planner';
import { createRoadmapStore, validateRoadmapWorkspace } from '../../../src/persistence/roadmap-store';
import { exportBackup, parseBackup } from '../../../src/persistence/backup';
import type { BackupFile, OperationResult, RoadmapDraft } from '../../../src/domain/contracts';

const packs = [backendPack, devopsPack, networkPack, securityPack, qaPack];
const tracks = [devopsPack, networkPack, securityPack, qaPack].flatMap(p => p.tracks);
const select = document.querySelector<HTMLSelectElement>('#track')!;
const hours = document.querySelector<HTMLSelectElement>('#hours')!;
const stages = document.querySelector<HTMLDivElement>('#stages')!;
const planOutput = document.querySelector<HTMLPreElement>('#plan')!;
const output = document.querySelector<HTMLPreElement>('#output')!;
let activeDraft: RoadmapDraft | null = null;
for (const track of tracks) {
  const option = document.createElement('option'); option.value = track.id; option.textContent = track.label; select.append(option);
}
const assert: (value: unknown, message: string) => asserts value = (value, message) => { if (!value) throw Error(message); };
function unwrap<T>(result: OperationResult<T>): T { assert(result.ok, JSON.stringify(result)); return result.value; }
const equal = (a: unknown, b: unknown) => assert(JSON.stringify(a) === JSON.stringify(b), 'Dữ liệu không khớp');
const clock = () => new Date().toISOString();
const id = () => crypto.randomUUID();
function render() {
  stages.replaceChildren(); activeDraft = null; planOutput.textContent = 'Chưa tạo preview.';
  try {
    const resolved = unwrap(resolveRegisteredTrack(packs, select.value));
    activeDraft = { trackId: select.value, selectedStageIds: [...resolved.track.stageIds], knownStageIds: [], resourceByStage: Object.fromEntries(resolved.stages.map(s => [s.id, s.defaultResourceId])), goal: resolved.track.portfolio.title, hoursPerWeek: Number(hours.value), startDate: '2026-10-05' };
    for (const stage of resolved.stages) {
      const section = document.createElement('section'), heading = document.createElement('h2'), text = document.createElement('p');
      heading.textContent = `${stage.title}${stage.optional ? ' (mở rộng)' : ''}`; text.textContent = stage.outcome; section.append(heading, text);
      const label = document.createElement('label'), source = document.createElement('select'), link = document.createElement('a'), note = document.createElement('p');
      label.textContent = 'Nguồn cho chặng: '; source.setAttribute('aria-label', `Nguồn ${stage.title}`);
      for (const resourceId of stage.resourceIds) { const resource = resolved.resources.find(r => r.id === resourceId)!; const option = document.createElement('option'); option.value = resource.id; option.textContent = resource.title; source.append(option); }
      source.value = stage.defaultResourceId;
      const update = () => { const resource = resolved.resources.find(r => r.id === source.value)!; if (activeDraft) activeDraft.resourceByStage[stage.id] = resource.id; link.href = resource.url; link.textContent = `${resource.provider}: ${resource.title}`; note.textContent = resource.accessNote; planOutput.textContent = 'Nguồn đã đổi; tạo preview lại để xem kết quả.'; };
      source.addEventListener('change', update); update(); label.append(source); section.append(label, document.createTextNode(' '), link, note);
      const list = document.createElement('ul');
      for (const work of stage.work) { const item = document.createElement('li'); item.textContent = `${work.title} — ${work.minutes} phút. ${work.acceptance.join(' ')}`; list.append(item); }
      section.append(list); stages.append(section);
    }
  } catch (error) { planOutput.textContent = String(error); }
}
document.querySelector<HTMLButtonElement>('#preview')!.addEventListener('click', render);
select.addEventListener('change', render); hours.addEventListener('change', render);
document.querySelector<HTMLButtonElement>('#generate')!.addEventListener('click', () => {
  try {
    assert(activeDraft, 'Cần xem chặng trước');
    const resolved = unwrap(resolveRegisteredTrack(packs, activeDraft.trackId));
    const plan = unwrap(generatePlan(resolved.track, resolved.stages, resolved.resources, activeDraft, { contentVersion: resolved.contentVersion, planId: id(), generationId: id(), nextTaskId: id, now: clock() }));
    const tasks = plan.current.tasks;
    planOutput.textContent = `${plan.name}\n${tasks.length} đoạn việc, ${tasks.reduce((n, t) => n + t.minutes, 0)} phút. Chưa ghi DB.\n` + tasks.map(t => `Tuần ${t.weekIndex === null ? 'backlog' : t.weekIndex + 1}: ${t.title} · ${t.minutes} phút · ${t.source?.provider}`).join('\n');
  } catch (error) { planOutput.textContent = String(error); }
});
const validators = {
  workspace: validateRoadmapWorkspace,
  backup(value: unknown): OperationResult<BackupFile> {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('format' in value) || value.format !== 'majorweave-backup' || !('formatVersion' in value) || value.formatVersion !== 1 || !('exportedAt' in value) || typeof value.exportedAt !== 'string' || !('workspace' in value))
      return { ok: false, code: 'validation', issues: [{ code: 'QA_ENVELOPE', field: 'backup', message: 'Envelope không hợp lệ' }] };
    const w = validateRoadmapWorkspace(value.workspace); if (!w.ok) return w;
    return { ok: true, value: { format: 'majorweave-backup', formatVersion: 1, exportedAt: value.exportedAt, workspace: w.value } };
  }
};
const run = document.querySelector<HTMLButtonElement>('#run')!;
run.addEventListener('click', async () => {
  run.disabled = true; output.textContent = '';
  const prefix = `majorweave.qa.team05.content.${id()}`;
  const log = (line: string) => { output.textContent += `${line}\n`; };
  let pass = 0, fail = 0;
  log(`Database QA prefix: ${prefix}`);
  try {
    for (const track of tracks) {
      const databaseName = `${prefix}.${track.id}`;
      log(`DB: ${databaseName}`);
      try {
        const resolved = unwrap(resolveRegisteredTrack(packs, track.id));
        const draft: RoadmapDraft = { trackId: track.id, selectedStageIds: [...track.stageIds], knownStageIds: [], resourceByStage: Object.fromEntries(resolved.stages.map(s => [s.id, s.resourceIds[s.resourceIds.length - 1]])), goal: track.portfolio.title, hoursPerWeek: 2, startDate: '2026-10-05' };
        const plan = unwrap(generatePlan(track, resolved.stages, resolved.resources, draft, { contentVersion: resolved.contentVersion, planId: id(), generationId: id(), nextTaskId: id, now: clock() }));
        const port = createRoadmapStore({ databaseName, timeZone: 'Asia/Ho_Chi_Minh' });
        const candidate = unwrap(await port.loadWorkspace()); candidate.plans.push(plan); candidate.activePlanId = plan.id; candidate.drafts[track.id] = draft;
        const first = unwrap(await port.saveWorkspace(candidate, candidate.revision));
        const next = structuredClone(first), task = next.plans[0].current.tasks[0], completedAt = clock(), completionId = id();
        const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(completedAt));
        const part = (type: string) => parts.find(p => p.type === type)?.value;
        task.status = 'done'; task.completionId = completionId;
        next.plans[0].completions.push({ id: completionId, taskId: task.id, completedAt, localDate: `${part('year')}-${part('month')}-${part('day')}`, timeZone: 'Asia/Ho_Chi_Minh', estimatedMinutes: task.minutes, revertedAt: null });
        const saved = unwrap(await port.saveWorkspace(next, first.revision));
        const reloaded = unwrap(await createRoadmapStore({ databaseName, timeZone: 'Asia/Ho_Chi_Minh' }).loadWorkspace());
        equal(saved, reloaded); assert(reloaded.revision === 2, 'Revision sai'); equal(reloaded.drafts[track.id], draft);
        const tasks = reloaded.plans[0].current.tasks;
        assert(tasks.every(t => t.source?.id === draft.resourceByStage[t.stageId]), 'Nguồn bị thay');
        assert(tasks[0].completionId === reloaded.plans[0].completions[0].id, 'Mất completion fixture');
        const backup = unwrap(exportBackup(reloaded, { exportedAt: clock(), unsaved: false }, validators)); equal(unwrap(parseBackup(backup.json, validators)).workspace, reloaded);
        pass++; log(`PASS ${track.id}: generate/save/completion fixture/reload/export, ${tasks.length} đoạn việc.`);
      } catch (error) { fail++; log(`FAIL ${track.id}: ${error instanceof Error ? error.message : String(error)}`); }
    }
    log(`${pass} PASS / ${fail} FAIL — 10 track isolated, native IndexedDB, validator cấu trúc.`);
    log('Completion do fixture QA tạo; chưa kiểm UI progress/Context thật, semantic, hai tab hay toàn hành trình app chính. Không đọc/xóa DB học thật.');
  } finally { run.disabled = false; }
});
render();
