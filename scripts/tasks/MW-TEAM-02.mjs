/**
 * scripts/tasks/MW-TEAM-02.mjs
 * Kiem thu module va noi dung cua task MW-TEAM-02:
 *   - Invariant planner: tong phut, thu tu, quy tuan, doan on dinh
 *   - regeneratePlan: history, identity, customized backlog, completion giu nguyen
 *   - Cau truc noi dung 7 track Mobile/Game
 *
 * Dung esbuild de compile TypeScript -> bundle ESM roi import trong Node.
 */

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { build } from 'esbuild';

async function bundleAndImport(entryPoint) {
  const output = await build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  });
  const b64 = Buffer.from(output.outputFiles[0].text).toString('base64');
  return import(`data:text/javascript;base64,${b64}`);
}

let pass = 0;
let fail = 0;

function ok(label, fn) {
  try {
    fn();
    console.log(`  PASS: ${label}`);
    pass++;
  } catch (e) {
    console.error(`  FAIL: ${label}`);
    console.error(`        ${e.message}`);
    fail++;
  }
}

console.log('\n=== MW-TEAM-02 Test Script ===\n');

const plannerModule = await bundleAndImport('src/domain/planner.ts');
const { generatePlan, regeneratePlan, validateDraft, isValidDate, isMonday } = plannerModule;

const mobileModule = await bundleAndImport('src/content/paths/mobile.ts');
const { mobilePack } = mobileModule;

const gameModule = await bundleAndImport('src/content/paths/game.ts');
const { gamePack } = gameModule;

function makeFixture() {
  const resources = [{
    id: 'resource.test.r1', title: 'Test Resource', provider: 'Test',
    url: 'https://example.com', language: 'en', format: 'article', cost: 'free',
    level: 'introductory', accessNote: '', checkedAt: null,
  }];
  const stages = [
    {
      id: 'test.stage.a', title: 'Stage A', phase: 'foundation',
      description: 'desc', outcome: 'outcome', prerequisiteIds: [],
      resourceIds: ['resource.test.r1'], defaultResourceId: 'resource.test.r1',
      optional: false,
      work: [
        { id: 'test.stage.a.w01', revision: 1, title: 'Work 1', minutes: 60, acceptance: ['AC1'] },
        { id: 'test.stage.a.w02', revision: 1, title: 'Work 2', minutes: 90, acceptance: ['AC2'] },
      ],
    },
    {
      id: 'test.stage.b', title: 'Stage B', phase: 'build',
      description: 'desc', outcome: 'outcome', prerequisiteIds: ['test.stage.a'],
      resourceIds: ['resource.test.r1'], defaultResourceId: 'resource.test.r1',
      optional: false,
      work: [
        { id: 'test.stage.b.w01', revision: 1, title: 'Work 3', minutes: 200, acceptance: ['AC3'] },
      ],
    },
  ];
  const track = {
    id: 'test.track', pathId: 'test', label: 'Test Track',
    stageIds: ['test.stage.a', 'test.stage.b'], credentialIds: [],
    roadmapLinks: [{ label: 'Test', url: 'https://example.com' }],
    portfolio: { title: 'Portfolio', acceptance: ['AC'] },
  };
  return { track, stages, resources };
}

function makeContext(overrides = {}) {
  let counter = 0;
  return {
    contentVersion: '2026-test', planId: 'plan-001', generationId: 'gen-001',
    nextTaskId: () => `task-${++counter}`,
    now: '2026-10-06T00:00:00+07:00',
    ...overrides,
  };
}

function makeRegenContext(overrides = {}) {
  let counter = 0;
  return {
    contentVersion: '2026-test', generationId: 'gen-002',
    nextTaskId: () => `task-regen-${++counter}`,
    now: '2026-10-07T00:00:00+07:00',
    ...overrides,
  };
}

const MONDAY_DATE = '2026-10-05';
const TUESDAY_DATE = '2026-10-06';

const BASE_DRAFT = {
  trackId: 'test.track',
  selectedStageIds: ['test.stage.a', 'test.stage.b'],
  knownStageIds: [],
  resourceByStage: {},
  goal: 'Become a developer',
  hoursPerWeek: 4,
  startDate: MONDAY_DATE,
};

// --- Section 1: isValidDate & isMonday ---
console.log('--- Section 1: isValidDate va isMonday ---');
ok('2026-10-05 la ngay hop le', () => assert.equal(isValidDate('2026-10-05'), true));
ok('2024-02-30 khong hop le (rollover)', () => assert.equal(isValidDate('2024-02-30'), false));
ok('2024-13-01 khong hop le (thang 13)', () => assert.equal(isValidDate('2024-13-01'), false));
ok('khong dung format khong hop le', () => assert.equal(isValidDate('20261006'), false));
ok('2026-10-05 la Thu Hai', () => assert.equal(isMonday('2026-10-05'), true));
ok('2026-10-06 khong phai Thu Hai', () => assert.equal(isMonday('2026-10-06'), false));

// --- Section 2: validateDraft ---
console.log('\n--- Section 2: validateDraft ---');
const { track, stages, resources } = makeFixture();

ok('Draft hop le khong co issue', () => {
  assert.equal(validateDraft(BASE_DRAFT, track, stages, resources).length, 0);
});
ok('hoursPerWeek = 1 -> INVALID_HOURS_PER_WEEK', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, hoursPerWeek: 1 }, track, stages, resources).some(i => i.code === 'INVALID_HOURS_PER_WEEK'));
});
ok('hoursPerWeek = 21 -> INVALID_HOURS_PER_WEEK', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, hoursPerWeek: 21 }, track, stages, resources).some(i => i.code === 'INVALID_HOURS_PER_WEEK'));
});
ok('hoursPerWeek = 2 hop le', () => {
  assert.ok(!validateDraft({ ...BASE_DRAFT, hoursPerWeek: 2 }, track, stages, resources).some(i => i.code === 'INVALID_HOURS_PER_WEEK'));
});
ok('hoursPerWeek = 20 hop le', () => {
  assert.ok(!validateDraft({ ...BASE_DRAFT, hoursPerWeek: 20 }, track, stages, resources).some(i => i.code === 'INVALID_HOURS_PER_WEEK'));
});
ok('startDate khong that -> INVALID_START_DATE', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, startDate: '2026-02-30' }, track, stages, resources).some(i => i.code === 'INVALID_START_DATE'));
});
ok('startDate la Thu Ba -> START_DATE_NOT_MONDAY', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, startDate: TUESDAY_DATE }, track, stages, resources).some(i => i.code === 'START_DATE_NOT_MONDAY'));
});
ok('selectedStageIds rong -> NO_STAGES_SELECTED', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: [] }, track, stages, resources).some(i => i.code === 'NO_STAGES_SELECTED'));
});
ok('ID khong ton tai -> UNKNOWN_STAGE_ID', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: ['no.such.stage'] }, track, stages, resources).some(i => i.code === 'UNKNOWN_STAGE_ID'));
});
ok('chon B ma khong chon A -> MISSING_PREREQUISITE', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: ['test.stage.b'] }, track, stages, resources).some(i => i.code === 'MISSING_PREREQUISITE'));
});
ok('chon B nhung da biet A -> hop le', () => {
  assert.ok(!validateDraft({ ...BASE_DRAFT, selectedStageIds: ['test.stage.b'], knownStageIds: ['test.stage.a'] }, track, stages, resources).some(i => i.code === 'MISSING_PREREQUISITE'));
});
ok('tat ca da biet -> NOTHING_TO_PLAN', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, knownStageIds: ['test.stage.a', 'test.stage.b'] }, track, stages, resources).some(i => i.code === 'NOTHING_TO_PLAN'));
});
ok('goal rong -> MISSING_GOAL', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, goal: '' }, track, stages, resources).some(i => i.code === 'MISSING_GOAL'));
});

// Cac loi moi fix theo review
ok('Thu tu dao nguoc [B, A] -> INVALID_STAGE_ORDER', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: ['test.stage.b', 'test.stage.a'] }, track, stages, resources).some(i => i.code === 'INVALID_STAGE_ORDER'));
});
ok('Chon trung [A, A, B] -> DUPLICATE_STAGE_SELECTION', () => {
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: ['test.stage.a', 'test.stage.a', 'test.stage.b'] }, track, stages, resources).some(i => i.code === 'DUPLICATE_STAGE_SELECTION'));
});
ok('Chon nguon r2 khong thuoc chang A -> RESOURCE_NOT_IN_STAGE', () => {
  const extraResource = { id: 'resource.test.r2', title: 'R2', provider: 'Test', url: 'https://ex.com', language: 'en', format: 'article', cost: 'free', level: 'introductory', accessNote: '', checkedAt: null };
  const allRes = [...resources, extraResource];
  const draftWithWrongResource = { ...BASE_DRAFT, resourceByStage: { 'test.stage.a': 'resource.test.r2' } };
  assert.ok(validateDraft(draftWithWrongResource, track, stages, allRes).some(i => i.code === 'RESOURCE_NOT_IN_STAGE'));
});

// --- Section 3: generatePlan invariants ---
console.log('\n--- Section 3: generatePlan invariants ---');

ok('generatePlan tra ok: true voi draft hop le', () => {
  assert.equal(generatePlan(track, stages, resources, BASE_DRAFT, makeContext()).ok, true);
});
ok('Tong phut tasks bang tong phut tat ca work', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.equal(r.value.current.tasks.reduce((s, t) => s + t.minutes, 0), 350);
});
ok('Doan <= 120 phut (work 200 phut bi chia)', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.ok(r.value.current.tasks.every(t => t.minutes <= 120));
});
ok('work 200 phut tao ra 2 chunks voi segment dung', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  const chunked = r.value.current.tasks.filter(t => t.workId === 'test.stage.b.w01');
  assert.equal(chunked.length, 2);
  assert.deepEqual(chunked[0].segment, { fromMinute: 0, toMinute: 120 });
  assert.deepEqual(chunked[1].segment, { fromMinute: 120, toMinute: 200 });
  assert.equal(chunked[0].minutes, 120);
  assert.equal(chunked[1].minutes, 80);
});
ok('work <= 120 phut -> segment = null', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.ok(r.value.current.tasks.filter(t => t.workId !== 'test.stage.b.w01').every(t => t.segment === null));
});
ok('hoursPerWeek = 20 -> tat ca task vao tuan 0', () => {
  const r = generatePlan(track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 20 }, makeContext());
  assert.equal(r.ok, true);
  assert.ok(r.value.current.tasks.every(t => t.weekIndex === 0));
});
ok('dayIndex luon la null', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.ok(r.value.current.tasks.every(t => t.dayIndex === null));
});
ok('Thu tu task: stage A truoc B', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  const tasks = r.value.current.tasks;
  const firstBIdx = tasks.findIndex(t => t.stageId === 'test.stage.b');
  const lastAIdx = tasks.map(t => t.stageId).lastIndexOf('test.stage.a');
  assert.ok(lastAIdx < firstBIdx);
});
ok('Tat ca task status = todo', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.ok(r.value.current.tasks.every(t => t.status === 'todo'));
});
ok('generatePlan that bai voi draft loi -> ok: false', () => {
  const r = generatePlan(track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 25 }, makeContext());
  assert.equal(r.ok, false);
  assert.equal(r.code, 'validation');
});
ok('Plan.history = [] khi moi tao', () => {
  const r = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
  assert.equal(r.ok, true);
  assert.deepEqual(r.value.history, []);
});

// --- Section 4: regeneratePlan ---
console.log('\n--- Section 4: regeneratePlan ---');

const planResult = generatePlan(track, stages, resources, BASE_DRAFT, makeContext());
assert.equal(planResult.ok, true);
const oldPlan = planResult.value;

ok('regeneratePlan giu task ID neu workId/revision/segment khop', () => {
  const oldIds = oldPlan.current.tasks.map(t => t.id);
  const r = regeneratePlan(oldPlan, track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 8 }, makeRegenContext());
  assert.equal(r.ok, true);
  const newIds = r.value.current.tasks.map(t => t.id);
  assert.ok(oldIds.every(id => newIds.includes(id)));
});
ok('regeneratePlan day oldPlan.current vao history', () => {
  const r = regeneratePlan(oldPlan, track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 8 }, makeRegenContext());
  assert.equal(r.ok, true);
  assert.equal(r.value.history.length, 1);
  assert.equal(r.value.history[0].id, oldPlan.current.id);
});
ok('regeneratePlan giu status/completionId/notes cua task da khop', () => {
  const donePlan = {
    ...oldPlan,
    current: {
      ...oldPlan.current,
      tasks: oldPlan.current.tasks.map((t, i) =>
        i === 0 ? { ...t, status: 'done', completionId: 'completion-001', notes: 'Test note' } : t
      ),
    },
  };
  const r = regeneratePlan(donePlan, track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 6 }, makeRegenContext());
  assert.equal(r.ok, true);
  const retained = r.value.current.tasks.find(t => t.id === donePlan.current.tasks[0].id);
  assert.ok(retained);
  assert.equal(retained.status, 'done');
  assert.equal(retained.completionId, 'completion-001');
  assert.equal(retained.notes, 'Test note');
});
ok('regeneratePlan dua customized task vao backlog', () => {
  const customTask = {
    ...oldPlan.current.tasks[0], id: 'task-custom-01',
    workId: null, customized: true, title: 'Bai tu them', weekIndex: 0,
  };
  const planWithCustom = {
    ...oldPlan,
    current: { ...oldPlan.current, tasks: [...oldPlan.current.tasks, customTask] },
  };
  const r = regeneratePlan(planWithCustom, track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 6 }, makeRegenContext());
  assert.equal(r.ok, true);
  const found = r.value.current.tasks.find(t => t.id === 'task-custom-01');
  assert.ok(found);
  assert.equal(found.weekIndex, null);
});
ok('regeneratePlan that bai voi draft loi', () => {
  const r = regeneratePlan(oldPlan, track, stages, resources, { ...BASE_DRAFT, startDate: TUESDAY_DATE }, makeRegenContext());
  assert.equal(r.ok, false);
  assert.equal(r.code, 'validation');
});
ok('regeneratePlan khong mutate plan cu (pure function)', () => {
  regeneratePlan(oldPlan, track, stages, resources, { ...BASE_DRAFT, startDate: TUESDAY_DATE }, makeRegenContext());
  assert.equal(oldPlan.history.length, 0);
  assert.equal(oldPlan.current.id, 'gen-001');
});
ok('generatePlan va regeneratePlan tao snapshot doc lap cho selectedStageIds/knownStageIds', () => {
  const draft = { ...BASE_DRAFT, selectedStageIds: [...BASE_DRAFT.selectedStageIds], knownStageIds: ['test.stage.a'] };
  const g1 = generatePlan(track, stages, resources, draft, makeContext());
  assert.equal(g1.ok, true);
  const plan = g1.value;
  draft.selectedStageIds.splice(0, 1); // Thay doi draft goc
  assert.equal(plan.current.selectedStageIds.length, 2); // Plan khong bi thay doi

  const draft2 = { ...BASE_DRAFT, selectedStageIds: [...BASE_DRAFT.selectedStageIds], knownStageIds: ['test.stage.a'] };
  const g2 = regeneratePlan(plan, track, stages, resources, draft2, makeRegenContext());
  assert.equal(g2.ok, true);
  draft2.selectedStageIds.splice(0, 1);
  assert.equal(g2.value.current.selectedStageIds.length, 2);
});

// --- Section 5: Noi dung Mobile ---
console.log('\n--- Section 5: Cau truc noi dung Mobile ---');

ok('mobilePack schemaVersion = 1', () => assert.equal(mobilePack.schemaVersion, 1));
ok('mobilePack co 4 tracks', () => assert.equal(mobilePack.tracks.length, 4));
ok('Co track mobile.android', () => assert.ok(mobilePack.tracks.some(t => t.id === 'mobile.android')));
ok('Co track mobile.ios', () => assert.ok(mobilePack.tracks.some(t => t.id === 'mobile.ios')));
ok('Co track mobile.flutter', () => assert.ok(mobilePack.tracks.some(t => t.id === 'mobile.flutter')));
ok('Co track mobile.react-native', () => assert.ok(mobilePack.tracks.some(t => t.id === 'mobile.react-native')));
ok('Moi stageId trong track ton tai trong stages', () => {
  const ids = new Set(mobilePack.stages.map(s => s.id));
  mobilePack.tracks.forEach(tr => tr.stageIds.forEach(id => assert.ok(ids.has(id), `mobile: stage ${id} thieu`)));
});
ok('Moi defaultResourceId thuoc resourceIds', () => {
  mobilePack.stages.forEach(s => assert.ok(s.resourceIds.includes(s.defaultResourceId), `mobile: ${s.id}`));
});
ok('Moi resourceId ton tai trong resources', () => {
  const ids = new Set(mobilePack.resources.map(r => r.id));
  mobilePack.stages.forEach(s => s.resourceIds.forEach(rid => assert.ok(ids.has(rid), `mobile: resource ${rid} thieu`)));
});
ok('Moi prerequisite cua stage ton tai', () => {
  const ids = new Set(mobilePack.stages.map(s => s.id));
  mobilePack.stages.forEach(s => s.prerequisiteIds.forEach(p => assert.ok(ids.has(p), `mobile: prereq ${p} thieu`)));
});
ok('Prerequisite xep truoc trong moi track mobile', () => {
  const stageMap = new Map(mobilePack.stages.map(s => [s.id, s]));
  mobilePack.tracks.forEach(tr => {
    const seen = new Set();
    tr.stageIds.forEach(id => {
      const s = stageMap.get(id);
      if (s) s.prerequisiteIds.forEach(p => assert.ok(seen.has(p), `mobile ${tr.id}: ${p} phai truoc ${id}`));
      seen.add(id);
    });
  });
});
ok('Moi work co minutes > 0 va revision > 0', () => {
  mobilePack.stages.forEach(s => s.work.forEach(w => {
    assert.ok(Number.isInteger(w.minutes) && w.minutes > 0, `mobile: ${w.id} minutes`);
    assert.ok(Number.isInteger(w.revision) && w.revision > 0, `mobile: ${w.id} revision`);
  }));
});
ok('Moi resource URL dung https', () => {
  mobilePack.resources.forEach(r => assert.equal(new URL(r.url).protocol, 'https:', r.id));
});
ok('Moi track co portfolio va roadmapLinks', () => {
  mobilePack.tracks.forEach(tr => {
    assert.ok(tr.portfolio.acceptance.length > 0, `mobile: ${tr.id} portfolio`);
    assert.ok(tr.roadmapLinks.length > 0, `mobile: ${tr.id} roadmapLinks`);
  });
});
ok('generatePlan chay duoc voi mobile.android (2 chang dau khong tien quyet)', () => {
  const androidTrack = mobilePack.tracks.find(t => t.id === 'mobile.android');
  const androidStages = mobilePack.stages.filter(s => androidTrack.stageIds.includes(s.id));
  const draft = {
    trackId: 'mobile.android',
    selectedStageIds: ['mobile.shared.git', 'mobile.shared.kotlin-basics'],
    knownStageIds: [], resourceByStage: {},
    goal: 'Become Android developer', hoursPerWeek: 10, startDate: MONDAY_DATE,
  };
  const r = generatePlan(androidTrack, androidStages, mobilePack.resources, draft, makeContext());
  assert.equal(r.ok, true, r.ok ? '' : JSON.stringify(r.issues));
});

// --- Section 6: Noi dung Game ---
console.log('\n--- Section 6: Cau truc noi dung Game ---');

ok('gamePack schemaVersion = 1', () => assert.equal(gamePack.schemaVersion, 1));
ok('gamePack co 3 tracks', () => assert.equal(gamePack.tracks.length, 3));
ok('Co track game.unity', () => assert.ok(gamePack.tracks.some(t => t.id === 'game.unity')));
ok('Co track game.unreal', () => assert.ok(gamePack.tracks.some(t => t.id === 'game.unreal')));
ok('Co track game.godot', () => assert.ok(gamePack.tracks.some(t => t.id === 'game.godot')));
ok('Moi stageId trong track ton tai', () => {
  const ids = new Set(gamePack.stages.map(s => s.id));
  gamePack.tracks.forEach(tr => tr.stageIds.forEach(id => assert.ok(ids.has(id), `game: stage ${id} thieu`)));
});
ok('Moi defaultResourceId thuoc resourceIds', () => {
  gamePack.stages.forEach(s => assert.ok(s.resourceIds.includes(s.defaultResourceId), `game: ${s.id}`));
});
ok('Moi resourceId ton tai trong resources', () => {
  const ids = new Set(gamePack.resources.map(r => r.id));
  gamePack.stages.forEach(s => s.resourceIds.forEach(rid => assert.ok(ids.has(rid), `game: resource ${rid} thieu`)));
});
ok('Moi prerequisite cua stage ton tai', () => {
  const ids = new Set(gamePack.stages.map(s => s.id));
  gamePack.stages.forEach(s => s.prerequisiteIds.forEach(p => assert.ok(ids.has(p), `game: prereq ${p} thieu`)));
});
ok('Prerequisite xep truoc trong moi track game', () => {
  const stageMap = new Map(gamePack.stages.map(s => [s.id, s]));
  gamePack.tracks.forEach(tr => {
    const seen = new Set();
    tr.stageIds.forEach(id => {
      const s = stageMap.get(id);
      if (s) s.prerequisiteIds.forEach(p => assert.ok(seen.has(p), `game ${tr.id}: ${p} phai truoc ${id}`));
      seen.add(id);
    });
  });
});
ok('Moi work co minutes > 0 va revision > 0', () => {
  gamePack.stages.forEach(s => s.work.forEach(w => {
    assert.ok(Number.isInteger(w.minutes) && w.minutes > 0, `game: ${w.id} minutes`);
    assert.ok(Number.isInteger(w.revision) && w.revision > 0, `game: ${w.id} revision`);
  }));
});
ok('Moi resource URL dung https', () => {
  gamePack.resources.forEach(r => assert.equal(new URL(r.url).protocol, 'https:', r.id));
});
ok('Moi track co portfolio va roadmapLinks', () => {
  gamePack.tracks.forEach(tr => {
    assert.ok(tr.portfolio.acceptance.length > 0, `game: ${tr.id} portfolio`);
    assert.ok(tr.roadmapLinks.length > 0, `game: ${tr.id} roadmapLinks`);
  });
});
ok('generatePlan chay duoc voi game.godot (git + gdscript)', () => {
  const godotTrack = gamePack.tracks.find(t => t.id === 'game.godot');
  const godotStages = gamePack.stages.filter(s => godotTrack.stageIds.includes(s.id));
  const draft = {
    trackId: 'game.godot',
    selectedStageIds: ['game.shared.git', 'game.godot.gdscript'],
    knownStageIds: [], resourceByStage: {},
    goal: 'Make a Godot game', hoursPerWeek: 6, startDate: MONDAY_DATE,
  };
  const r = generatePlan(godotTrack, godotStages, gamePack.resources, draft, makeContext());
  assert.equal(r.ok, true, r.ok ? '' : JSON.stringify(r.issues));
});

// Regression and complete-track acceptance, independent of the shared registry.
const { backendPack } = await bundleAndImport('src/content/paths/backend.ts');
const packs = [backendPack, mobilePack, gamePack];
const success = result => { assert.equal(result.ok, true, JSON.stringify(result)); return result.value; };
const totals = tasks => tasks.reduce((sum, task) => sum + task.minutes, 0);
function assertSchedule(plan, expectedMinutes, budget) {
  const tasks = plan.current.tasks;
  assert.equal(totals(tasks), expectedMinutes);
  assert.equal(new Set(tasks.map(t => t.id)).size, tasks.length);
  const weeks = new Map();
  for (const task of tasks) {
    assert.ok(Number.isInteger(task.minutes) && task.minutes > 0 && task.minutes <= 120);
    assert.ok(Number.isInteger(task.weekIndex) && task.weekIndex >= 0);
    assert.equal(task.dayIndex, null);
    weeks.set(task.weekIndex, (weeks.get(task.weekIndex) ?? 0) + task.minutes);
  }
  for (const minutes of weeks.values()) assert.ok(minutes <= budget);
}
ok('30/120/121/300 minutes preserve exact segments at 2 and 20 hours', () => {
  const sample = structuredClone(stages);
  sample[0].work = [30, 120, 121, 300].map(minutes => ({ id: `boundary-${minutes}`, revision: 1, title: 'Boundary', minutes, acceptance: ['Done'] }));
  const draft = { ...BASE_DRAFT, selectedStageIds: [sample[0].id] };
  for (const hoursPerWeek of [2, 20]) {
    const plan = success(generatePlan(track, sample, resources, { ...draft, hoursPerWeek }, makeContext()));
    assertSchedule(plan, 571, hoursPerWeek * 60);
    assert.deepEqual(plan.current.tasks.map(t => t.minutes), [30, 120, 120, 1, 120, 120, 60]);
    assert.deepEqual(plan.current.tasks.filter(t => t.workId === 'boundary-300').map(t => t.segment), [
      { fromMinute: 0, toMinute: 120 }, { fromMinute: 120, toMinute: 240 }, { fromMinute: 240, toMinute: 300 },
    ]);
  }
});
ok('Empty work and invalid minutes fail without allocating IDs', () => {
  for (const minutes of [null, 0, -1, 1.5, Infinity, NaN]) {
    const sample = structuredClone(stages);
    sample[0].work = minutes === null ? [] : [{ ...sample[0].work[0], minutes }];
    const result = generatePlan(track, sample, resources, { ...BASE_DRAFT, selectedStageIds: [sample[0].id] }, { ...makeContext(), nextTaskId: () => { throw Error('Must validate before allocating'); } });
    assert.equal(result.ok, false);
  }
});
ok('Fractional/NaN hours, foreign known IDs and stale sources fail', () => {
  for (const hoursPerWeek of [2.5, NaN, Infinity]) assert.ok(validateDraft({ ...BASE_DRAFT, hoursPerWeek }, track, stages, resources).length);
  assert.ok(validateDraft({ ...BASE_DRAFT, knownStageIds: ['foreign'] }, track, stages, resources).length);
  assert.ok(validateDraft({ ...BASE_DRAFT, resourceByStage: { foreign: resources[0].id } }, track, stages, resources).length);
});
ok('Prerequisite order is checked independently of track ordering', () => {
  const reversed = { ...track, stageIds: [...track.stageIds].reverse() };
  assert.ok(validateDraft({ ...BASE_DRAFT, selectedStageIds: [...reversed.stageIds] }, reversed, stages, resources).some(i => i.code === 'INVALID_PREREQUISITE_ORDER'));
});
ok('Already-known prerequisites do not need their own prerequisites selected', () => {
  const sample = structuredClone(stages);
  sample[0].prerequisiteIds = ['earlier-known-course'];
  assert.deepEqual(validateDraft({ ...BASE_DRAFT, knownStageIds: [sample[0].id] }, track, sample, resources), []);
});
ok('Monday proposal handles leap dates, year boundaries and invalid input', () => {
  assert.equal(plannerModule.nextMonday('2026-10-06'), '2026-10-12');
  assert.equal(plannerModule.nextMonday('2026-10-05'), '2026-10-05');
  assert.equal(plannerModule.nextMonday('2026-12-31'), '2027-01-04');
  assert.equal(plannerModule.nextMonday('2024-02-29'), '2024-03-04');
  assert.equal(plannerModule.nextMonday('2026-02-30'), null);
  assert.equal(plannerModule.nextMonday('9999-12-31'), null);
  assert.equal(isValidDate('0099-01-01'), true);
  assert.equal(isValidDate('0000-01-01'), false);
});
ok('Generated tasks and content have independent nested snapshots', () => {
  const sample = structuredClone(stages);
  const plan = success(generatePlan(track, sample, resources, BASE_DRAFT, makeContext()));
  plan.current.tasks[0].acceptance.push('changed');
  plan.current.tasks[0].source.title = 'changed';
  assert.ok(!sample[0].work[0].acceptance.includes('changed'));
  assert.notEqual(plan.current.tasks[1].source.title, 'changed');
});
ok('Regeneration preserves ledger once, closed weeks, notes and snapshot isolation', () => {
  const original = structuredClone(oldPlan);
  const first = original.current.tasks[0];
  Object.assign(first, { status: 'done', completionId: 'completion-real', notes: 'keep me' });
  original.completions = [{ id: 'completion-real', taskId: first.id, completedAt: '2026-10-06T01:00:00Z', localDate: '2026-10-06', timeZone: 'Asia/Bangkok', estimatedMinutes: first.minutes, revertedAt: null }];
  original.current.closedWeeks = [{ weekIndex: 0, closedAt: '2026-10-07T01:00:00Z', tasks: structuredClone(original.current.tasks), total: original.current.tasks.length, done: 1, estimatedCompletedMinutes: first.minutes }];
  const before = structuredClone(original);
  const next = success(regeneratePlan(original, track, stages, resources, { ...BASE_DRAFT, hoursPerWeek: 2 }, makeRegenContext()));
  assert.deepEqual(next.completions, original.completions);
  assert.deepEqual(next.history[0], original.current);
  assert.equal(next.current.tasks[0].completionId, first.completionId);
  assert.equal(next.current.tasks[0].notes, 'keep me');
  next.current.tasks[0].acceptance.push('edited');
  next.completions[0].revertedAt = '2026-10-08T00:00:00Z';
  assert.deepEqual(original, before);
  assert.deepEqual(next.history[0], before.current);
});
ok('Changed revision or work identity does not inherit completion', () => {
  const original = structuredClone(oldPlan);
  Object.assign(original.current.tasks[0], { status: 'done', completionId: 'c1' });
  for (const mode of ['revision', 'identity']) {
    const sample = structuredClone(stages);
    if (mode === 'revision') sample[0].work[0].revision++;
    else sample[0].work[0].id = 'different-meaning';
    const next = success(regeneratePlan(original, track, sample, resources, BASE_DRAFT, makeRegenContext()));
    assert.equal(next.current.tasks[0].status, 'todo');
    assert.equal(next.current.tasks[0].completionId, null);
    assert.notEqual(next.current.tasks[0].id, original.current.tasks[0].id);
  }
});
ok('Customized and manually added work survive a track change without duplicate template', () => {
  const original = structuredClone(oldPlan);
  original.current.tasks[0].customized = true;
  original.current.tasks[0].notes = 'custom note';
  original.current.tasks.push({ ...structuredClone(original.current.tasks[1]), id: 'manual', workId: null, workRevision: null, customized: false });
  const other = { ...track, id: 'test.other' };
  const next = success(regeneratePlan(original, other, stages, resources, { ...BASE_DRAFT, trackId: other.id }, makeRegenContext()));
  for (const id of [original.current.tasks[0].id, 'manual']) {
    const retained = next.current.tasks.filter(t => t.id === id);
    assert.equal(retained.length, 1);
    assert.equal(retained[0].weekIndex, null);
    assert.equal(retained[0].dayIndex, null);
  }
  assert.equal(next.current.tasks.filter(t => t.workId === original.current.tasks[0].workId).length, 1);
  next.current.tasks.find(t => t.id === original.current.tasks[0].id).acceptance.push('new edit');
  assert.ok(!next.history[0].tasks[0].acceptance.includes('new edit'));
});
ok('Migrated [0, minutes] segments match unsegmented unchanged template', () => {
  const original = structuredClone(oldPlan);
  Object.assign(original.current.tasks[0], { segment: { fromMinute: 0, toMinute: 60 }, notes: 'legacy note' });
  const next = success(regeneratePlan(original, track, stages, resources, BASE_DRAFT, makeRegenContext()));
  assert.equal(next.current.tasks[0].id, original.current.tasks[0].id);
  assert.equal(next.current.tasks[0].notes, 'legacy note');
});
ok('Two generated plans do not overwrite or share mutable data', () => {
  const a = success(generatePlan(track, stages, resources, BASE_DRAFT, makeContext()));
  const before = structuredClone(a);
  const b = success(generatePlan(track, stages, resources, BASE_DRAFT, makeContext({ planId: 'second', generationId: 'second-generation' })));
  b.current.tasks[0].acceptance.push('edit');
  assert.notEqual(a.id, b.id);
  assert.deepEqual(a, before);
});
ok('Backend + Mobile + Game IDs are globally unique and references resolve', () => {
  for (const kind of ['stages', 'resources', 'credentials', 'tracks']) {
    const ids = packs.flatMap(p => p[kind].map(v => v.id));
    assert.equal(new Set(ids).size, ids.length, kind);
  }
  const workIds = packs.flatMap(p => p.stages.flatMap(s => s.work.map(w => w.id)));
  assert.equal(new Set(workIds).size, workIds.length);
  for (const pack of packs) for (const tr of pack.tracks) for (const id of tr.credentialIds) assert.ok(pack.credentials.some(c => c.id === id));
});
for (const pack of packs) for (const tr of pack.tracks) {
  const resolved = pack.stages.filter(stage => tr.stageIds.includes(stage.id));
  const draft = { ...BASE_DRAFT, trackId: tr.id, selectedStageIds: [...tr.stageIds], knownStageIds: [], resourceByStage: {} };
  for (const hoursPerWeek of [2, 20]) ok(`${tr.id}: full track, ${hoursPerWeek} hours, ordering/minutes/identity`, () => {
    const plan = success(generatePlan(tr, resolved, pack.resources, { ...draft, hoursPerWeek }, makeContext()));
    assertSchedule(plan, resolved.flatMap(s => s.work).reduce((sum, w) => sum + w.minutes, 0), hoursPerWeek * 60);
    assert.deepEqual([...new Set(plan.current.tasks.map(t => t.stageId))], tr.stageIds);
    const again = success(regeneratePlan(plan, tr, resolved, pack.resources, { ...draft, hoursPerWeek: hoursPerWeek === 2 ? 20 : 2 }, makeRegenContext()));
    assert.deepEqual(again.current.tasks.map(t => [t.id, t.segment]), plan.current.tasks.map(t => [t.id, t.segment]));
  });
  ok(`${tr.id}: every offered source generates a full plan with the correct snapshot`, () => {
    for (const stage of resolved) for (const id of stage.resourceIds) {
      const plan = success(generatePlan(tr, resolved, pack.resources, { ...draft, resourceByStage: { [stage.id]: id } }, makeContext()));
      assert.ok(plan.current.tasks.filter(t => t.stageId === stage.id).every(t => t.source.id === id));
    }
  });
  ok(`${tr.id}: required-only draft is valid; all-known draft is rejected`, () => {
    const required = tr.stageIds.filter(id => !resolved.find(s => s.id === id).optional);
    success(generatePlan(tr, resolved, pack.resources, { ...draft, selectedStageIds: required }, makeContext()));
    assert.equal(generatePlan(tr, resolved, pack.resources, { ...draft, knownStageIds: tr.stageIds }, makeContext()).ok, false);
  });
}
ok('Reviewed Mobile/Game sources have real review dates; retired/fake credentials are not offered', () => {
  for (const pack of [mobilePack, gamePack]) {
    assert.equal(pack.reviewStatus, 'review');
    for (const source of [...pack.resources, ...pack.credentials]) {
      assert.ok(isValidDate(source.checkedAt), source.id);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
    for (const stage of pack.stages) assert.ok(pack.tracks.some(tr => tr.stageIds.includes(stage.id)), stage.id);
  }
  assert.equal(mobilePack.credentials.length, 0);
  assert.deepEqual(gamePack.credentials.map(c => c.id), ['credential.game.unity-associate']);
});

if (process.argv.includes('--ui')) {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.MAJORWEAVE_PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.MAJORWEAVE_BROWSER_CHANNEL ? { channel: process.env.MAJORWEAVE_BROWSER_CHANNEL } : {}) });
  // An isolated context never opens or clears the learner's browser profile.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const baseUrl = process.env.MAJORWEAVE_TEST_URL || 'http://127.0.0.1:5174';
  const evidence = 'docs/tasks/MW-TEAM-02/evidence';
  fs.mkdirSync(evidence, { recursive: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const results = [];
  const checkUI = async (name, fn) => {
    try { await fn(); pass++; results.push({ name, status: 'pass' }); console.log(`  PASS UI: ${name}`); }
    catch (e) { fail++; results.push({ name, status: 'fail', error: e.message }); console.error(`  FAIL UI: ${name}: ${e.message}`); throw e; }
  };
  try {
    await page.goto(`${baseUrl}/#/roadmap`);
    const create = () => page.getByRole('button', { name: 'Tạo kế hoạch của tôi', exact: true });
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('majorweave.prototype.v1')));
    await checkUI('Required goal error keeps draft', async () => {
      await page.getByLabel('Mục tiêu của bạn').fill(''); await create().click();
      assert.match(await page.getByRole('alert').innerText(), /mục tiêu/);
      assert.equal(await page.getByLabel('Mục tiêu của bạn').inputValue(), '');
      await page.getByLabel('Mục tiêu của bạn').fill('MW-TEAM-02 verification');
    });
    await checkUI('Tuesday proposal: cancel and Escape preserve date and restore keyboard focus', async () => {
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-06'); await create().click();
      await page.getByRole('heading', { name: 'Bắt đầu vào Thứ Hai?' }).waitFor();
      await page.screenshot({ path: `${evidence}/monday-desktop.png` });
      await page.getByRole('button', { name: 'Giữ ngày đã chọn' }).click();
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-06');
      await create().click(); await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(), 0);
      assert.ok(await create().evaluate(el => el === document.activeElement));
    });
    await checkUI('Confirm Monday, create plan and reload', async () => {
      await create().click(); await page.getByRole('button', { name: 'Dùng ngày 2026-10-12' }).click();
      await page.waitForURL('**/#/plan'); await page.reload();
      await page.getByRole('link', { name: 'My roadmap Lộ trình của bạn 03' }).click();
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-12');
      assert.ok((await stored()).tasks.length > 0);
    });
    await checkUI('Cancel rebuild preserves current plan and tasks', async () => {
      const before = await stored();
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-13'); await create().click();
      await page.getByRole('button', { name: 'Dùng ngày 2026-10-19' }).click();
      await page.getByRole('heading', { name: 'Tạo lại kế hoạch?' }).waitFor();
      await page.getByRole('button', { name: 'Giữ kế hoạch hiện tại' }).click();
      const after = await stored();
      assert.deepEqual(after.tasks, before.tasks); assert.deepEqual(after.planMeta, before.planMeta);
    });
    await checkUI('Source selection and known toggle persist without changing active plan', async () => {
      const before = await stored();
      const source = page.getByLabel('Nguồn học cho JavaScript foundations');
      const choices = await source.locator('option').evaluateAll(items => items.map(item => item.value));
      await source.selectOption(choices[1]);
      const known = page.getByRole('checkbox', { name: 'Đã biết', exact: true }).first();
      const previous = await known.isChecked(); await known.setChecked(!previous); await page.reload();
      assert.equal(await source.inputValue(), choices[1]);
      assert.equal(await known.isChecked(), !previous);
      assert.deepEqual((await stored()).tasks, before.tasks);
    });
    await checkUI('Mobile dialog fits viewport and keyboard confirms proposed date', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-20'); await create().click();
      const dialog = page.getByRole('dialog'); await dialog.waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const bounds = await dialog.boundingBox(); assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
      await page.screenshot({ path: `${evidence}/monday-mobile.png` });
      const confirm = page.getByRole('button', { name: 'Dùng ngày 2026-10-26' });
      await confirm.focus(); await page.keyboard.press('Enter');
      await page.getByRole('heading', { name: 'Tạo lại kế hoạch?' }).waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-26');
    });
    await checkUI('All-known selection rejects empty plan; no browser errors', async () => {
      const before = await stored();
      for (const checkbox of await page.getByRole('checkbox', { name: 'Đã biết', exact: true }).all()) await checkbox.check();
      await create().click(); assert.match(await page.getByRole('alert').innerText(), /chặng chưa biết/);
      assert.deepEqual((await stored()).tasks, before.tasks); assert.deepEqual(errors, []);
    });
  } finally {
    fs.writeFileSync(`${evidence}/ui-results.json`, JSON.stringify({ date: '2026-10-07', browser: browser.version(), baseUrl, isolatedContext: true, results, errors, scope: 'Legacy MyRoadmap only; v2 registry/context/persistence not integrated.' }, null, 2) + '\n');
    await context.close(); await browser.close();
  }
}

console.log(`\n=== Ket qua: ${pass} PASS, ${fail} FAIL ===\n`);
if (fail > 0) process.exit(1);
