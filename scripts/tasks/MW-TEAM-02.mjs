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

console.log(`\n=== Ket qua: ${pass} PASS, ${fail} FAIL ===\n`);
if (fail > 0) process.exit(1);
