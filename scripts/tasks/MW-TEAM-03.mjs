import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const output = await build({ entryPoints: ['src/domain/progress.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const api = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
const { setTaskCompletion: set, updateTask: edit, addTask: add, moveTaskToBacklog: backlog, closeWeek: close, calculatePlanStats: stats, calculateWeekStats: week } = api;
const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
let sequence = 100;
const context = (extra = {}) => ({ now: '2026-10-06T18:00:00Z', today: '2026-10-07', timeZone: 'Asia/Ho_Chi_Minh', nextCompletionId: () => uuid(sequence++), ...extra });
const task = (n, extra = {}) => ({ id: uuid(n), stageId: 's1', workId: 'w1', workRevision: 1, segment: { fromMinute: 0, toMinute: 30 }, title: 'Bài thực hành', minutes: 30, acceptance: ['Có kết quả'], source: { id: 'r1', title: 'Tài liệu', provider: 'Provider', url: 'https://example.org/resource' }, weekIndex: 0, dayIndex: 1, status: 'todo', customized: false, completionId: null, notes: 'Ghi chú', ...extra });
function fixture() {
  const current = { id: uuid(90), createdAt: '2026-10-01T00:00:00Z', trackId: 'ml.classical', contentVersion: '1', selectedStageIds: ['s1'], knownStageIds: [], resourceByStage: { s1: 'r1' }, tasks: [task(1), task(2), task(3, { weekIndex: null, dayIndex: null })], closedWeeks: [], goal: 'Học', hoursPerWeek: 1, startDate: '2026-10-05' };
  return { id: uuid(91), name: 'Plan', pathId: 'ml', trackId: current.trackId, contentVersion: '1', createdAt: current.createdAt, status: 'active', current, history: [], completions: [] };
}
const ok = result => { assert.equal(result.ok, true, JSON.stringify(result)); return result.value; };
const bad = (result, code) => { assert.equal(result.ok, false); assert.equal(result.code, 'validation'); assert.equal(result.issues[0].code, code); };
const freeze = obj => { Object.freeze(obj); for (const value of Object.values(obj)) if (value && typeof value === 'object' && !Object.isFrozen(value)) freeze(value); return obj; };
const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('TC01 done / repeated done / undo / repeated undo / redo', () => {
  let calls = 0;
  const ctx = context({ nextCompletionId: () => uuid(200 + calls++) });
  const original = freeze(fixture());
  const done = ok(set(original, uuid(1), true, ctx));
  assert.equal(done.current.tasks[0].completionId, uuid(200));
  assert.deepEqual(done.completions[0], { id: uuid(200), taskId: uuid(1), completedAt: ctx.now, localDate: ctx.today, timeZone: ctx.timeZone, estimatedMinutes: 30, revertedAt: null });
  assert.deepEqual(ok(set(done, uuid(1), true, ctx)), done);
  assert.equal(calls, 1);
  const undo = ok(set(done, uuid(1), false, ctx));
  assert.equal(undo.completions[0].revertedAt, ctx.now);
  assert.equal(undo.current.tasks[0].completionId, null);
  assert.deepEqual(ok(set(undo, uuid(1), false, ctx)), undo);
  const redo = ok(set(undo, uuid(1), true, ctx));
  assert.equal(redo.completions.length, 2);
  assert.equal(redo.completions.filter(c => c.revertedAt === null).length, 1);
  assert.equal(stats(redo).done, 1);
  assert.equal(calls, 2);
  assert.equal(original.completions.length, 0);
});
test('TC02 clock: real calendar, offset, timezone, midnight, leap year and DST', () => {
  const p = fixture();
  for (const now of ['2026-02-30T12:00:00Z', '2026-10-06T24:00:00Z', '2026-10-06T18:00:00', 'bad']) bad(set(p, uuid(1), true, context({ now })), 'invalid_date');
  bad(set(p, uuid(1), true, context({ today: '2026-02-30' })), 'invalid_date');
  bad(set(p, uuid(1), true, context({ today: '2026-10-06' })), 'date_mismatch');
  bad(set(p, uuid(1), true, context({ timeZone: 'Unknown/Zone' })), 'invalid_timezone');
  for (const ctx of [context(), context({ now: '2024-02-29T23:30:00+07:00', today: '2024-02-29' }), context({ now: '2026-03-08T07:30:00Z', today: '2026-03-08', timeZone: 'America/New_York' })]) assert.equal(ok(set(p, uuid(1), true, ctx)).completions[0].localDate, ctx.today);
});
test('TC03 rejects duplicate, malformed and throwing ID factories', () => {
  for (const id of [uuid(1), uuid(90), uuid(91), 'not-uuid']) bad(set(fixture(), uuid(1), true, context({ nextCompletionId: () => id })), id === 'not-uuid' ? 'invalid_id' : 'duplicate_id');
  bad(set(fixture(), uuid(1), true, context({ nextCompletionId: () => { throw Error('offline'); } })), 'id_factory_failed');
  const p = fixture(); p.history.push({ ...structuredClone(p.current), id: uuid(80), tasks: [task(81)] });
  bad(set(p, uuid(1), true, context({ nextCompletionId: () => uuid(81) })), 'duplicate_id');
});
test('TC04 invalid task, status and completion relationships', () => {
  bad(set(fixture(), 'missing', true, context()), 'task_not_found');
  bad(set(fixture(), uuid(1), 'true', context()), 'invalid_status');
  const p = fixture(); p.current.tasks[0].status = 'skipped';
  bad(set(p, uuid(1), true, context()), 'skipped_task');
  p.current.tasks[0].status = 'done'; bad(set(p, uuid(1), true, context()), 'completion_conflict');
  const duplicate = fixture(); duplicate.current.tasks.push(task(1)); bad(edit(duplicate, uuid(1), {}), 'duplicate_id');
  const done = ok(set(fixture(), uuid(1), true, context()));
  done.completions.push({ ...done.completions[0], id: uuid(999) }); bad(set(done, uuid(1), true, context()), 'completion_conflict');
});
test('TC05 undo preserves legacy unknown dates and rejects backwards clock', () => {
  const done = ok(set(fixture(), uuid(1), true, context()));
  bad(set(done, uuid(1), false, context({ now: '2026-10-05T18:00:00Z', today: '2026-10-06' })), 'clock_before_completion');
  Object.assign(done.completions[0], { completedAt: null, localDate: null, timeZone: null });
  const undone = ok(set(done, uuid(1), false, context()));
  assert.equal(undone.completions[0].completedAt, null);
  assert.equal(undone.completions[0].localDate, null);
});
test('TC06 edit title / requirements / minutes sets sticky customized; notes / schedule do not', () => {
  const p = freeze(fixture());
  for (const patch of [{ title: 'Tên mới' }, { acceptance: ['Yêu cầu mới'] }, { minutes: 45 }]) {
    const changed = ok(edit(p, uuid(1), patch)); assert.equal(changed.current.tasks[0].customized, true);
    assert.equal(ok(edit(changed, uuid(1), { title: p.current.tasks[0].title, minutes: 30, acceptance: ['Có kết quả'] })).current.tasks[0].customized, true);
  }
  for (const patch of [{ notes: 'Mới' }, { weekIndex: 2 }, { title: p.current.tasks[0].title }, { acceptance: ['Có kết quả'] }]) assert.equal(ok(edit(p, uuid(1), patch)).current.tasks[0].customized, false);
});
test('TC07 edit validates all fields and rejects metadata injection', () => {
  for (const [patch, code] of [[{ title: ' ' }, 'invalid_title'], [{ title: undefined }, 'invalid_title'], [{ minutes: 0 }, 'invalid_minutes'], [{ minutes: -1 }, 'invalid_minutes'], [{ minutes: 1.5 }, 'invalid_minutes'], [{ minutes: NaN }, 'invalid_minutes'], [{ minutes: Infinity }, 'invalid_minutes'], [{ acceptance: [] }, 'invalid_acceptance'], [{ acceptance: [' '] }, 'invalid_acceptance'], [{ acceptance: [42] }, 'invalid_acceptance'], [{ notes: null }, 'invalid_notes'], [{ weekIndex: -1 }, 'invalid_week'], [{ weekIndex: 0.5 }, 'invalid_week'], [{ dayIndex: 7 }, 'invalid_day'], [{ weekIndex: null, dayIndex: 2 }, 'invalid_day'], [{ id: uuid(8) }, 'invalid_patch'], [null, 'invalid_patch']]) bad(edit(fixture(), uuid(1), patch), code);
});
const newTask = () => ({ stageId: 's1', title: 'Tự thêm', minutes: 90, acceptance: ['Báo cáo'], notes: '', weekIndex: 1, dayIndex: null });
test('TC08 add custom task; ID, stage, field and closed destination validation', () => {
  const p = freeze(fixture()), input = freeze(newTask());
  const added = ok(add(p, input, { nextTaskId: () => uuid(300) }));
  assert.deepEqual(added.current.tasks[3], { ...input, id: uuid(300), workId: null, workRevision: null, segment: null, source: null, status: 'todo', customized: true, completionId: null });
  bad(add(p, input, { nextTaskId: () => uuid(1) }), 'duplicate_id');
  bad(add(p, { ...input, stageId: 'missing' }, { nextTaskId: () => uuid(301) }), 'invalid_stage');
  bad(add(p, { ...input, minutes: 0 }, { nextTaskId: () => uuid(301) }), 'invalid_minutes');
  bad(add(p, { ...input, status: 'done' }, { nextTaskId: () => uuid(301) }), 'invalid_task');
  const c = ok(close(p, 0, 'skip', context()));
  bad(add(c, { ...input, weekIndex: 0 }, { nextTaskId: () => uuid(301) }), 'closed_week');
});
test('TC09 move done / backlog / move back preserves provenance and completion dates', () => {
  const done = freeze(ok(set(fixture(), uuid(1), true, context())));
  const moved = ok(edit(done, uuid(1), { weekIndex: 3, dayIndex: 6 }));
  const back = ok(backlog(moved, uuid(1)));
  const returned = ok(edit(back, uuid(1), { weekIndex: 4 }));
  for (const p of [moved, back, returned]) {
    assert.deepEqual(p.completions, done.completions);
    for (const field of ['id', 'source', 'workId', 'workRevision', 'segment', 'notes', 'status', 'completionId', 'customized']) assert.deepEqual(p.current.tasks[0][field], done.current.tasks[0][field]);
  }
  assert.equal(back.current.tasks[0].dayIndex, null);
  assert.equal(back.current.tasks[0].weekIndex, null);
  assert.deepEqual(ok(backlog(back, uuid(1))), back);
});
test('TC10 editing completed estimate does not rewrite historical completion minutes', () => {
  const done = ok(set(fixture(), uuid(1), true, context()));
  const changed = ok(edit(done, uuid(1), { minutes: 80 }));
  assert.equal(changed.completions[0].estimatedMinutes, 30);
  assert.equal(stats(changed).estimatedCompletedMinutes, 80);
});
test('TC11 move_next chooses next OPEN week; snapshot precedes movement', () => {
  let p = fixture(); p.current.tasks.push(task(4, { weekIndex: 1 }));
  p = ok(close(p, 1, 'skip', context())); p = ok(set(p, uuid(1), true, context()));
  const before = structuredClone(p); freeze(p);
  const c = ok(close(p, 0, 'move_next', context()));
  assert.equal(c.current.tasks[1].weekIndex, 2); assert.equal(c.current.tasks[1].dayIndex, null);
  assert.equal(c.current.tasks[0].weekIndex, 0);
  assert.deepEqual(c.current.closedWeeks[1].tasks, before.current.tasks.filter(t => t.weekIndex === 0));
  assert.equal(c.current.closedWeeks[1].total, 2); assert.equal(c.current.closedWeeks[1].done, 1);
  assert.deepEqual(c.completions, before.completions);
  assert.deepEqual(p, before);
});
for (const action of ['move_next', 'move_backlog', 'skip']) test(`TC12-${action} unfinished handling and repeated close`, () => {
  const p = freeze(ok(set(fixture(), uuid(1), true, context())));
  const c = ok(close(p, 0, action, context()));
  const unfinished = c.current.tasks[1];
  assert.equal(unfinished.status, action === 'skip' ? 'skipped' : 'todo');
  assert.equal(unfinished.weekIndex, action === 'skip' ? 0 : action === 'move_backlog' ? null : 1);
  assert.deepEqual(ok(close(c, 0, 'skip', context())), c);
  assert.equal(c.current.closedWeeks.length, 1);
  assert.equal(ok(week(c, 0)).percentage, 50);
  assert.equal(c.current.closedWeeks[0].tasks[1].status, 'todo');
});
test('TC13 closed origin and destination reject edit, completion and moves', () => {
  const p = ok(close(fixture(), 0, 'skip', context()));
  bad(edit(p, uuid(1), { notes: 'no' }), 'closed_week');
  bad(backlog(p, uuid(1)), 'closed_week');
  bad(set(p, uuid(1), true, context()), 'closed_week');
  bad(edit(p, uuid(3), { weekIndex: 0 }), 'closed_week');
});
test('TC14 close validates index/action, empty week and index overflow', () => {
  for (const index of [-1, 0.1, NaN, null]) bad(close(fixture(), index, 'skip', context()), 'invalid_week');
  bad(close(fixture(), 5, 'skip', context()), 'empty_week');
  bad(close(fixture(), 0, 'remove', context()), 'invalid_action');
  const p = fixture(); p.current.tasks[0].weekIndex = Number.MAX_SAFE_INTEGER;
  bad(close(p, Number.MAX_SAFE_INTEGER, 'move_next', context()), 'invalid_week');
});
test('TC15 stats exclude skipped, include backlog exactly once, empty and overtime', () => {
  let p = fixture(); p.current.tasks[1].status = 'skipped'; p = ok(set(p, uuid(1), true, context()));
  assert.deepEqual(stats(p), { total: 2, done: 1, percentage: 50, empty: false, totalMinutes: 60, estimatedCompletedMinutes: 30 });
  assert.equal(ok(week(p, 0)).percentage, 100);
  assert.equal(ok(week(p, 99)).empty, true); assert.equal(ok(week(p, 99)).percentage, 0);
  assert.equal(ok(week(p, null)).budgetMinutes, null);
  p = ok(edit(p, uuid(1), { minutes: 100 })); assert.equal(ok(week(p, 0)).overtimeMinutes, 40);
  p.current.tasks = []; assert.equal(stats(p).empty, true); assert.equal(stats(p).percentage, 0);
  p.current.tasks = [task(1, { status: 'skipped' })]; assert.equal(stats(p).empty, true);
});
test('TC16 snapshot and history immutable across edit/done/undo; no double count', () => {
  let p = ok(set(fixture(), uuid(1), true, context()));
  p.history.push({ ...structuredClone(p.current), id: uuid(70) });
  p = ok(close(p, 0, 'move_next', context()));
  const before = structuredClone(p); freeze(p);
  let next = ok(edit(p, uuid(2), { title: 'Thay đổi', minutes: 150 }));
  next = ok(set(next, uuid(2), true, context())); next = ok(set(next, uuid(2), false, context()));
  assert.deepEqual(next.current.closedWeeks, before.current.closedWeeks);
  assert.deepEqual(next.history, before.history);
  assert.equal(ok(week(next, 0)).percentage, 50);
  assert.equal(ok(week(next, 0, uuid(70))).percentage, 50);
  assert.equal(stats(next).total, 3); assert.equal(stats(next).done, 1);
  bad(week(next, 0, 'missing'), 'generation_not_found'); bad(week(next, -1), 'invalid_week');
  next.current.closedWeeks[0].tasks[0].source.title = 'mutated output';
  next.history[0].tasks[0].acceptance.push('mutated output');
  assert.deepEqual(p, before);
});
test('TC17 archived plan read-only, history-only task not editable', () => {
  const p = fixture(); p.status = 'archived';
  for (const result of [set(p, uuid(1), true, context()), edit(p, uuid(1), {}), add(p, newTask(), { nextTaskId: () => uuid(300) }), close(p, 0, 'skip', context())]) bad(result, 'readonly');
  assert.equal(stats(p).total, 3);
  p.status = 'active'; p.history.push({ ...structuredClone(p.current), id: uuid(71), tasks: [task(72)] });
  bad(edit(p, uuid(72), { notes: 'no' }), 'task_not_found');
});
test('TC18 caller patch/input references cannot mutate returned plan', () => {
  const p = fixture(), patch = { acceptance: ['Original'] };
  const edited = ok(edit(p, uuid(1), patch)); patch.acceptance.push('Later');
  assert.deepEqual(edited.current.tasks[0].acceptance, ['Original']);
  const input = newTask(), added = ok(add(p, input, { nextTaskId: () => uuid(300) })); input.acceptance.push('Later');
  assert.deepEqual(added.current.tasks[3].acceptance, ['Báo cáo']);
});

// Resolve the four unregistered packs together with the real registered dependency
// packs. This does not modify the app registry or imply integrated UI coverage.
const contentOutput = await build({ stdin: { contents: `
  import { contentPacks } from './src/content/index.ts';
  import { scientistPack } from './src/content/paths/scientist.ts';
  import { mlPack } from './src/content/paths/ml.ts';
  import { mlopsPack } from './src/content/paths/mlops.ts';
  import { aiEngineerPack } from './src/content/paths/ai-engineer.ts';
  export const own = [scientistPack, mlPack, mlopsPack, aiEngineerPack];
  export const combined = [...new Set([...contentPacks, ...own])];
`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', write: false });
const { own, combined } = await import(`data:text/javascript;base64,${Buffer.from(contentOutput.outputFiles[0].text).toString('base64')}`);
const sourceEvidence = JSON.parse(fs.readFileSync('docs/tasks/MW-TEAM-03/SOURCES.json', 'utf8'));
const expectedTracks = ['scientist.python', 'ml.classical', 'ml.cv', 'ml.nlp', 'mlops.serving', 'mlops.pipeline', 'ai-engineer.rag', 'ai-engineer.agents'];
const collection = (packs, key) => packs.flatMap(p => p[key]);
function uniqueMap(items) {
  const map = new Map();
  for (const item of items) {
    assert.ok(typeof item.id === 'string' && item.id.trim(), 'missing ID');
    assert.ok(!map.has(item.id), `duplicate ID: ${item.id}`);
    map.set(item.id, item);
  }
  return map;
}
function validateContent(packs, reviewed) {
  uniqueMap(packs.map(pack => ({ id: pack.pathId })));
  const stages = uniqueMap(collection(packs, 'stages'));
  const resources = uniqueMap(collection(packs, 'resources'));
  const credentials = uniqueMap(collection(packs, 'credentials'));
  uniqueMap([...stages.values(), ...resources.values(), ...credentials.values(), ...collection(packs, 'tracks'), ...[...stages.values()].flatMap(s => s.work)]);
  const visited = new Set(), visiting = new Set();
  function visit(id) {
    assert.ok(stages.has(id), `missing prerequisite: ${id}`);
    assert.ok(!visiting.has(id), `cycle: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id); stages.get(id).prerequisiteIds.forEach(visit);
    visiting.delete(id); visited.add(id);
  }
  [...stages.keys()].forEach(visit);
  for (const pack of reviewed) {
    assert.equal(pack.schemaVersion, 1);
    assert.equal(pack.reviewStatus, 'review');
    assert.ok(pack.contentVersion.trim());
    assert.ok(pack.stages.length && pack.resources.length && pack.tracks.length, 'empty pack');
    for (const stage of pack.stages) {
      assert.ok(stage.title.trim() && stage.description.trim() && stage.outcome.trim());
      assert.ok(['foundation','build','ship','expand'].includes(stage.phase));
      assert.equal(typeof stage.optional, 'boolean');
      assert.equal(new Set(stage.prerequisiteIds).size, stage.prerequisiteIds.length);
      assert.ok(stage.resourceIds.length && stage.resourceIds.includes(stage.defaultResourceId), `default source: ${stage.id}`);
      assert.equal(new Set(stage.resourceIds).size, stage.resourceIds.length);
      stage.resourceIds.forEach(id => assert.ok(resources.has(id), `missing resource: ${id}`));
      assert.ok(stage.work.length, `no work: ${stage.id}`);
      for (const work of stage.work) {
        assert.ok(work.title.trim());
        assert.ok(Number.isInteger(work.revision) && work.revision > 0);
        assert.ok(Number.isInteger(work.minutes) && work.minutes > 0 && work.minutes <= 120, `minutes: ${work.id}`);
        assert.ok(work.acceptance.length >= 2 && work.acceptance.every(a => typeof a === 'string' && a.trim()), `acceptance: ${work.id}`);
      }
    }
    for (const track of pack.tracks) {
      assert.equal(track.pathId, pack.pathId);
      assert.ok(track.label.trim() && track.stageIds.length, 'empty track');
      const seen = new Set();
      for (const id of track.stageIds) {
        assert.ok(stages.has(id), `missing stage: ${id}`);
        assert.ok(!seen.has(id), `duplicate track stage: ${id}`);
        for (const prerequisite of stages.get(id).prerequisiteIds) assert.ok(seen.has(prerequisite), `prerequisite order: ${track.id} / ${id} / ${prerequisite}`);
        seen.add(id);
      }
      track.credentialIds.forEach(id => assert.ok(credentials.has(id), `missing credential: ${id}`));
      assert.ok(track.roadmapLinks.length);
      track.roadmapLinks.forEach(link => { assert.ok(link.label.trim()); assert.equal(new URL(link.url).protocol, 'https:'); });
      assert.ok(track.portfolio.title.trim() && track.portfolio.acceptance.length >= 4);
      assert.ok(track.portfolio.acceptance.every(a => a.trim()));
    }
  }
  return { stages, resources, credentials };
}
test('CONTENT01 all four packs + registered dependencies: IDs, DAG, references, order, work and portfolios', () => {
  validateContent(combined, own);
  assert.deepEqual(collection(own, 'tracks').map(t => t.id).sort(), [...expectedTracks].sort());
  assert.equal(new Set(own.map(p => p.pathId)).size, 4);
  const usedStages = new Set(collection(own, 'tracks').flatMap(t => t.stageIds));
  const usedResources = new Set(collection(own, 'stages').flatMap(s => s.resourceIds));
  for (const stage of collection(own, 'stages')) assert.ok(usedStages.has(stage.id), `orphan stage: ${stage.id}`);
  for (const resource of collection(own, 'resources')) assert.ok(usedResources.has(resource.id), `orphan resource: ${resource.id}`);
});
test('CONTENT02 resource and credential metadata match official-page evidence', () => {
  const records = uniqueMap(sourceEvidence.entries);
  const urls = new Set();
  const providers = {
    scientist: new Set(['docs.python.org','numpy.org','pandas.pydata.org','docs.scipy.org','developers.google.com','scikit-learn.org','www.postgresql.org','matplotlib.org']),
    ml: new Set(['scikit-learn.org','docs.pytorch.org','huggingface.co']),
    mlops: new Set(['git-scm.com','docs.python.org','mlflow.org','scikit-learn.org','fastapi.tiangolo.com','docs.docker.com','prometheus.io','doc.dvc.org','docs.github.com']),
    'ai-engineer': new Set(['developers.google.com','www.sbert.net','ai.google.dev','huggingface.co']),
  };
  for (const pack of own) {
    for (const resource of pack.resources) {
      assert.equal(new URL(resource.url).protocol, 'https:');
      assert.ok(providers[pack.pathId].has(new URL(resource.url).hostname), `unreviewed provider: ${resource.id}`);
      assert.ok(!urls.has(resource.url), `duplicated source URL: ${resource.url}`); urls.add(resource.url);
      assert.ok(resource.title.trim() && resource.provider.trim() && resource.accessNote.trim());
      assert.equal(resource.language, 'en');
      assert.ok(['article','video','course','exercise','lab'].includes(resource.format));
      assert.ok(['free','mixed','paid','unknown'].includes(resource.cost));
      assert.ok(['introductory','intermediate','advanced','mixed'].includes(resource.level));
      const proof = records.get(resource.id);
      assert.ok(proof?.topic.trim() && proof.method.includes('Opened'));
      assert.equal(proof.url, resource.url); assert.equal(proof.checkedAt, resource.checkedAt);
      assert.equal(proof.accessNote, resource.accessNote);
      assert.equal(resource.checkedAt, '2026-10-06');
    }
    for (const credential of pack.credentials) {
      const proof = records.get(credential.id);
      assert.equal(proof?.url, credential.url);
      assert.equal(proof?.checkedAt, credential.checkedAt);
      assert.ok(credential.name.trim() && credential.provider.trim() && credential.prerequisites.trim() && credential.requirements.trim());
      assert.ok(['course_certificate','program_certificate','exam_certificate','skill_assessment'].includes(credential.kind));
      assert.ok(['free','paid','unknown'].includes(credential.cost));
    }
  }
  assert.equal(records.size, collection(own,'resources').length + collection(own,'credentials').length);
  sourceEvidence.unverified.forEach(r => assert.equal(r.checkedAt, null));
});
test('CONTENT03 cross-pack sharing: foundations, default sources and prerequisite closure', () => {
  const { stages, resources } = validateContent(combined, own);
  const tracks = uniqueMap(collection(own,'tracks'));
  for (const id of expectedTracks) {
    const track = tracks.get(id);
    for (const base of ['scientist.foundation.python','scientist.tables','scientist.statistics','scientist.math','scientist.evaluation','scientist.responsible-data']) assert.ok(track.stageIds.includes(base), `${id}: missing foundation ${base}`);
    for (const stageId of track.stageIds) assert.ok(resources.has(stages.get(stageId).defaultResourceId));
  }
  assert.ok(tracks.get('mlops.serving').stageIds.includes('ml.classical.models'));
  assert.ok(tracks.get('ai-engineer.rag').stageIds.includes('ml.neural'));
  assert.equal(collection(own,'stages').filter(s => s.id === 'scientist.foundation.python').length, 1);
  assert.equal(collection(own,'stages').filter(s => s.id === 'ml.neural').length, 1);
});
test('CONTENT04 branch-specific content + cost/hardware/API and optional credentials', () => {
  const tracks = uniqueMap(collection(own,'tracks'));
  const milestones = {
    'scientist.python':['scientist.sql','scientist.visualization','scientist.report'],
    'ml.classical':['ml.classical.models','ml.classical.tuning','ml.classical.ship'],
    'ml.cv':['ml.neural','ml.cv.data','ml.cv.transfer','ml.cv.ship'],
    'ml.nlp':['ml.neural','ml.nlp.baseline','ml.nlp.transformers','ml.nlp.ship'],
    'mlops.serving':['mlops.api','mlops.container','mlops.monitoring'],
    'mlops.pipeline':['mlops.data-versioning','mlops.pipeline.dag','mlops.ci','mlops.lifecycle'],
    'ai-engineer.rag':['ai-engineer.retrieval','ai-engineer.rag.pipeline','ai-engineer.rag-evaluation'],
    'ai-engineer.agents':['ai-engineer.tools','ai-engineer.agent-loop','ai-engineer.agent-evaluation'],
  };
  Object.entries(milestones).forEach(([id, required]) => required.forEach(stage => assert.ok(tracks.get(id).stageIds.includes(stage))));
  assert.equal(new Set(collection(own,'tracks').map(t => t.portfolio.title)).size, 8);
  const resources = uniqueMap(collection(own,'resources'));
  for (const id of ['ai-engineer.resource.gemini','ai-engineer.resource.function-calling']) {
    assert.equal(resources.get(id).cost,'mixed'); assert.match(resources.get(id).accessNote,/key/);
    assert.ok(sourceEvidence.entries.find(r => r.id === id).supportUrls.includes('https://ai.google.dev/gemini-api/docs/pricing'));
  }
  assert.match(resources.get('ml.resource.transfer-learning').accessNote,/CPU/);
  assert.match(resources.get('ml.resource.text-classification').accessNote,/CPU/);
  assert.equal(uniqueMap(collection(own,'credentials')).get('ai-engineer.credential.hf-agents').cost,'free');
  assert.equal(tracks.get('ml.cv').credentialIds.length,0);
  assert.equal(tracks.get('ml.nlp').credentialIds.length,0);
  assert.equal(tracks.get('ai-engineer.rag').credentialIds.length,0);
});
function contentMustReject(mutate, pattern) {
  const clone = structuredClone(combined);
  const reviewed = clone.filter(p => own.some(o => o.pathId === p.pathId));
  mutate(reviewed);
  assert.throws(() => validateContent(clone, reviewed), pattern);
}
test('CONTENT05 guard detects duplicate definitions across packs', () => contentMustReject(p => p[1].stages.push(structuredClone(p[0].stages[0])), /duplicate ID/));
test('CONTENT06 guard detects missing dependency and cycles', () => {
  contentMustReject(p => p[0].stages[0].prerequisiteIds=['missing.stage'], /missing prerequisite/);
  contentMustReject(p => p[0].stages[0].prerequisiteIds=[p[0].stages[1].id], /cycle/);
});
test('CONTENT07 guard detects invalid order and omitted prerequisites', () => {
  contentMustReject(p => p[1].tracks[1].stageIds.reverse(), /prerequisite order/);
  contentMustReject(p => p[2].tracks[0].stageIds=p[2].tracks[0].stageIds.filter(id => id !== 'scientist.evaluation'), /prerequisite order/);
});
test('CONTENT08 guard detects missing source and invalid default', () => {
  contentMustReject(p => p[0].stages[0].resourceIds.push('missing.resource'), /missing resource/);
  contentMustReject(p => p[0].stages[0].defaultResourceId='missing.resource', /default source/);
});
test('CONTENT09 guard detects invalid minutes and empty acceptance', () => {
  contentMustReject(p => p[0].stages[0].work[0].minutes=0, /minutes/);
  contentMustReject(p => p[0].stages[0].work[0].minutes=121, /minutes/);
  contentMustReject(p => p[0].stages[0].work[0].acceptance=[], /acceptance/);
});
test('CONTENT10 guard detects missing credential, foreign track path and repeated track stage', () => {
  contentMustReject(p => p[0].tracks[0].credentialIds=['missing.credential'], /missing credential/);
  contentMustReject(p => p[0].tracks[0].pathId='ml', /Expected values/);
  contentMustReject(p => p[0].tracks[0].stageIds.push('scientist.foundation.python'), /duplicate track stage/);
});
console.log(`Content under review: ${own.length} packs, ${collection(own,'tracks').length} tracks, ${collection(own,'stages').length} unique stages, ${collection(own,'resources').length} resources, ${collection(own,'stages').reduce((n,s)=>n+s.work.length,0)} work items; dependencies: ${combined.length - own.length} registered pack(s).`);

const uiOutput = await build({ stdin: { contents: `
 import { createElement } from 'react';
 import { renderToStaticMarkup } from 'react-dom/server';
 import { MyPlanV2 } from './src/features/my-plan/MyPlanV2';
 export * from './src/features/my-plan/viewModel';
 export const renderMyPlan = props => renderToStaticMarkup(createElement(MyPlanV2, props));
`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', jsx: 'automatic', banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(process.cwd() + '/package.json');" }, write: false });
const ui = await import(`data:text/javascript;base64,${Buffer.from(uiOutput.outputFiles[0].text).toString('base64')}`).catch(error => { throw new Error(error.message); });
const validForm = () => ({stageId:'s1',title:'  Tên bài  ',minutes:'90',acceptance:' Yêu cầu 1\n\n Yêu cầu 2 ',notes:'Ghi chú',week:'2',day:'0'});
test('UI01 form parsing validates and normalizes user input', () => {
 assert.deepEqual(ok(ui.parseTaskForm(validForm())),{stageId:'s1',title:'Tên bài',minutes:90,acceptance:['Yêu cầu 1','Yêu cầu 2'],notes:'Ghi chú',weekIndex:1,dayIndex:0});
 assert.equal(ok(ui.parseTaskForm({...validForm(),week:'',day:''})).weekIndex,null);
 assert.equal(ok(ui.parseTaskForm({...validForm(),week:'',day:'0'})).dayIndex,null);
 for (const patch of [{title:' '},{minutes:''},{minutes:'0'},{minutes:'1.5'},{minutes:'Infinity'},{week:'0'},{week:'1.5'},{acceptance:'\n '},{stageId:''},{day:'7'},{week:'',day:'7'}]) assert.equal(ui.parseTaskForm({...validForm(),...patch}).ok,false,JSON.stringify(patch));
});
test('UI02 sparse week list and snapshot display never duplicate/mutate tasks', () => {
 const p=ok(close(fixture(),0,'move_next',context()));
 assert.deepEqual(ui.weekIndices(p.current),[0,1]);
 assert.deepEqual(ui.visibleTasks(p.current,0),p.current.closedWeeks[0].tasks);
 assert.equal(ui.visibleTasks(p.current,null).length,1);
 p.current.tasks.filter(t=>t.weekIndex===1).forEach(t=>t.weekIndex=1000000);
 assert.deepEqual(ui.weekIndices(p.current),[0,1000000]);
});
test('UI03 readonly includes closed weeks, archived plans and history', () => {
 const p=fixture(); assert.equal(ui.readOnly(p,p.current,0),false);
 const c=ok(close(p,0,'skip',context())); assert.equal(ui.readOnly(c,c.current,0),true);
 assert.equal(ui.readOnly(c,c.current,null),false);
 assert.equal(ui.readOnly(p,{...p.current,id:uuid(70)},null),true);
 p.status='archived'; assert.equal(ui.readOnly(p,p.current,null),true);
});
test('UI04 form roundtrip keeps ID, source and completion when editing schedule', () => {
 const p=ok(set(fixture(),uuid(1),true,context()));
 const form=ui.taskForm(p.current.tasks[0]);
 const {stageId,...patch}=ok(ui.parseTaskForm({...form,week:'',day:''}));
 const next=ok(edit(p,uuid(1),patch));
 assert.equal(next.current.tasks[0].id,uuid(1)); assert.deepEqual(next.current.tasks[0].source,p.current.tasks[0].source);
 assert.deepEqual(next.completions,p.completions); assert.equal(next.current.tasks[0].customized,false);
});
const uiProps = p => ({plans:[p],activePlanId:p.id,stages:[],onSelectPlan:async()=>({ok:true,value:undefined}),onSavePlan:async()=>({ok:true,value:undefined}),getProgressContext:()=>context(),nextTaskId:()=>uuid(900)});
test('UI05 server render empty/loading/load-error and missing selection states', () => {
 const props=uiProps(fixture());
 assert.match(ui.renderMyPlan({...props,plans:[],activePlanId:null}),/Chưa có kế hoạch/);
 assert.match(ui.renderMyPlan({...props,loading:true}),/Đang tải kế hoạch/);
 assert.match(ui.renderMyPlan({...props,loadError:'Lỗi tải fixture'}),/role="alert"/);
 assert.match(ui.renderMyPlan({...props,activePlanId:'missing'}),/lựa chọn cũ có thể không còn tồn tại/);
});
test('UI06 server render controlled plan, navigation, overtime and source snapshot', () => {
 const p=fixture();
 assert.ok(!ui.renderMyPlan(uiProps(p)).includes('Phiên bản kế hoạch'), 'Hide version selector until history exists');
 p.history.push({...structuredClone(p.current),id:uuid(80)});
 p.current.hoursPerWeek=0.5;
 p.current.tasks[0].dayIndex=0; p.current.tasks[1].dayIndex=null;
 const html=ui.renderMyPlan(uiProps(p));
 for(const text of ['Kế hoạch đang xem','Phiên bản kế hoạch','Thống kê','Các tuần','Chưa xếp lịch','Vượt quỹ giờ','Có kết quả','https://example.org/resource']) assert.ok(html.includes(text),text);
 assert.ok(html.includes('aria-label="Thứ Hai"') && html.includes('aria-label="Chưa chọn ngày"'));
 assert.equal((html.match(/type="checkbox"/g)||[]).length,2,'Show each task in the week once; do not include backlog tasks');
 assert.equal(p.current.tasks.length,3);
});
test('UI07 archived render hides mutation buttons and disables completion', () => {
 const p=fixture(); p.status='archived';
 const html=ui.renderMyPlan(uiProps(p));
 assert.ok(html.includes('chỉ đọc'));
 assert.ok(!html.includes('Chốt tuần') && !html.includes('Sửa:') && !html.includes('Thêm việc'));
 assert.match(html,/type="checkbox"[^>]*disabled/);
});
test('UI08 source links are escaped and unsafe URLs are not rendered as links', () => {
 const p=fixture(); p.current.tasks[0].title='<script>alert(1)</script>'; p.current.tasks[0].source.url='javascript:alert(1)';
 const html=ui.renderMyPlan(uiProps(p));
 assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('href="javascript:'));
 assert.ok(html.includes('URL không hợp lệ'));
 for(const url of ['javascript:alert(1)','data:text/html,bad','bad']) assert.equal(ui.safeSourceUrl(url),false);
 assert.equal(ui.safeSourceUrl('https://example.org'),true);
});

test('UI09 week edit with temporary blank preserves all seven weekdays and task identity', () => {
 for (let day=0; day<7; day++) {
  const p=ok(set(fixture(),uuid(1),true,context()));
  p.current.tasks[0].dayIndex=day;
  freeze(p);
  const before=structuredClone(p);
  const original=ui.taskForm(p.current.tasks[0]);
  const temporary={...original,week:''};
  assert.equal(temporary.day,String(day));
  const {stageId,...patch}=ok(ui.parseTaskForm({...temporary,week:'2'}));
  const next=ok(edit(p,uuid(1),patch));
  assert.equal(next.current.tasks[0].weekIndex,1);
  assert.equal(next.current.tasks[0].dayIndex,day);
  assert.equal(next.current.tasks[0].id,p.current.tasks[0].id);
  assert.deepEqual(next.current.tasks[0].source,p.current.tasks[0].source);
  assert.equal(next.current.tasks[0].completionId,p.current.tasks[0].completionId);
  assert.deepEqual(next.completions,p.completions);
  assert.equal(next.current.tasks[0].customized,false);
  assert.deepEqual(p,before);
 }
});
test('UI10 committing blank week clears backlog day; cancel/invalid input leave plan unchanged', () => {
 const p=freeze(fixture()), before=structuredClone(p);
 const original=ui.taskForm(p.current.tasks[0]);
 const draft={...original,week:''};
 const {stageId,...patch}=ok(ui.parseTaskForm(draft));
 assert.equal(patch.weekIndex,null); assert.equal(patch.dayIndex,null);
 assert.equal(draft.day,'1'); // UI draft retains Tuesday until commit.
 const next=ok(edit(p,uuid(1),patch));
 assert.equal(next.current.tasks[0].dayIndex,null);
 assert.equal(ui.taskForm(next.current.tasks[0]).day,'');
 assert.equal(ui.parseTaskForm({...draft,week:'0'}).ok,false);
 assert.equal(ui.parseTaskForm({...draft,week:'1.5'}).ok,false);
 assert.deepEqual(p,before);
});
test('UI11 fixture loads the same Vietnamese-capable fonts as the app entry', () => {
 const entry=fs.readFileSync('index.html','utf8'), preview=fs.readFileSync('docs/tasks/MW-TEAM-03/ui-preview.html','utf8');
 const fontLinks=html=>[...html.matchAll(/<link\b[^>]*href="(https:\/\/fonts\.[^"]+)"[^>]*>/g)].map(m=>m[1]);
 assert.equal(fontLinks(entry).length,3);
 assert.deepEqual(fontLinks(preview),fontLinks(entry));
 assert.match(preview,/charset="UTF-8"/i); assert.match(preview,/<html lang="vi">/);
});

let failed = 0;
for (const { name, fn } of tests) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { failed++; console.error(`FAIL ${name}\n${error.stack.replace(/data:text\/javascript;base64,[A-Za-z0-9+/=]+/g,'<memory-bundle>')}`); }
}
console.log(`${tests.length - failed}/${tests.length} tests passed`);
if (failed) process.exitCode = 1;
