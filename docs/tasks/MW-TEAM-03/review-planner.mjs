// Read-only cross-review harness. Run from the MW-TEAM-03 repository root:
// node docs/tasks/MW-TEAM-03/review-planner.mjs <MW-TEAM-02 checkout>
// This checks domain composition, not UI, IndexedDB, migration or reload.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
const reviewRoot = path.resolve(process.argv[2] || '../majorweave-review-mw02-44595b9');
const reviewSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: reviewRoot, encoding: 'utf8' }).trim();
assert.equal(reviewSha, '44595b90d54d5e18cd5055d8f8f36ae03fab1f95', 'Review must use the documented revision');
async function bundle(entry) {
  const result = await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}
const planner = await bundle(path.join(reviewRoot, 'src/domain/planner.ts'));
const progress = await bundle('src/domain/progress.ts');
const packs = [];
for (const name of ['scientist', 'ml', 'mlops', 'ai-engineer']) {
  const mod = await bundle(`src/content/paths/${name}.ts`);
  packs.push(Object.values(mod).find(value => value?.pathId === name));
}
const backend = (await bundle(path.join(reviewRoot, 'src/content/paths/backend.ts'))).backendPack;
const stages = [...packs, backend].flatMap(pack => pack.stages);
const resources = [...packs, backend].flatMap(pack => pack.resources);
let counter = 1000, passed = 0;
const uuid = () => `10000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`;
const now = '2026-10-08T16:30:00Z'; // 23:30 Vietnam; explicit clock.
const ctx = () => ({ now, today: '2026-10-08', timeZone: 'Asia/Ho_Chi_Minh', nextCompletionId: uuid });
const ok = result => { assert.equal(result.ok, true, JSON.stringify(result)); return result.value; };
console.log(`Planner review SHA ${reviewSha}; MW-TEAM-03 working tree, domain only`);
for (const track of [...packs.flatMap(pack => pack.tracks), ...backend.tracks]) {
  const selected = track.stageIds.map(id => stages.find(stage => stage.id === id));
  assert.ok(selected.every(Boolean));
  for (const hours of [2, 20]) {
    const draft = { trackId: track.id, selectedStageIds: [...track.stageIds], knownStageIds: [], resourceByStage: Object.fromEntries(selected.map(stage => [stage.id, stage.defaultResourceId])), goal: 'Cross-review reproducible plan', hoursPerWeek: hours, startDate: '2026-10-12' };
    const input = structuredClone({ track, stages, resources, draft });
    const plan = ok(planner.generatePlan(track, stages, resources, draft, { planId: uuid(), generationId: uuid(), nextTaskId: uuid, now, contentVersion: 'cross-review-2026-10-08' }));
    assert.deepEqual({ track, stages, resources, draft }, input);
    assert.equal(new Set(plan.current.tasks.map(task => task.id)).size, plan.current.tasks.length);
    assert.equal(plan.current.tasks.reduce((n, task) => n + task.minutes, 0), selected.flatMap(stage => stage.work).reduce((n, work) => n + work.minutes, 0));
    for (const week of new Set(plan.current.tasks.map(task => task.weekIndex))) {
      assert.notEqual(week, null);
      assert.ok(plan.current.tasks.filter(task => task.weekIndex === week).reduce((n, task) => n + task.minutes, 0) <= hours * 60);
    }
    assert.ok(plan.current.tasks.every(task => task.minutes <= 120 && task.source));
    const first = plan.current.tasks[0];
    let done = ok(progress.setTaskCompletion(plan, first.id, true, ctx()));
    done = ok(progress.setTaskCompletion(done, first.id, true, ctx()));
    assert.equal(done.completions.length, 1);
    assert.equal(done.completions[0].localDate, '2026-10-08');
    const customId = done.current.tasks[1].id;
    done = ok(progress.updateTask(done, customId, { title: 'Reviewer customized work', notes: 'Retain across regeneration' }));
    const closed = ok(progress.closeWeek(done, 0, 'move_backlog', ctx()));
    const before = structuredClone(closed);
    const next = ok(planner.regeneratePlan(closed, track, stages, resources, { ...draft, hoursPerWeek: hours === 2 ? 20 : 2 }, { generationId: uuid(), nextTaskId: uuid, now, contentVersion: 'cross-review-2026-10-08' }));
    assert.deepEqual(closed, before);
    assert.deepEqual(next.history.at(-1), before.current);
    assert.deepEqual(next.completions, before.completions);
    const retained = next.current.tasks.find(task => task.id === first.id);
    assert.equal(retained.completionId, before.current.tasks.find(task => task.id === first.id).completionId);
    assert.equal(retained.status, 'done');
    const customized = next.current.tasks.find(task => task.id === customId);
    assert.equal(customized.weekIndex, null); assert.equal(customized.dayIndex, null);
    assert.equal(customized.notes, 'Retain across regeneration');
    assert.equal(next.current.tasks.filter(task => task.id === customId).length, 1);
    assert.equal(ok(progress.calculateWeekStats(next, 0, before.current.id)).done, before.current.closedWeeks[0].done);
    next.history.at(-1).tasks[0].title = 'Mutation probe';
    assert.deepEqual(closed, before);
    passed++;
    console.log(`PASS ${track.id} ${hours}h: full minutes/budget, repeated done, close snapshot, custom backlog, regenerate identity/history/input`);
  }
}
console.log(`${passed}/${passed} cross-review cases passed (8 AI + 3 Backend tracks at 2/20 hours). No persistence test.`);
