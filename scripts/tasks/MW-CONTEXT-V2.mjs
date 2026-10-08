import assert from 'node:assert/strict';
import { build } from 'esbuild';
const load = async entry => {
  const output = await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
};
const { createWorkspaceController } = await load('src/app/workspace-controller.ts');
const { emptyWorkspace, validateRoadmapWorkspace } = await load('src/persistence/roadmap-store.ts');
const { contentPacks } = await load('src/content/index.ts');
let count = 0;
const check = async (name, run) => { await run(); console.log(`PASS ${name}`); count++; };
const requireOk = result => { assert.equal(result.ok, true, result.ok ? '' : JSON.stringify(result)); return result.value; };
function fixture() {
  let disk = emptyWorkspace('Asia/Bangkok');
  let saves = 0;
  let failNext = false;
  let gate = null;
  let serial = 0;
  const persistence = {
    async loadWorkspace() { return { ok: true, value: structuredClone(disk) }; },
    async saveWorkspace(next, expected) {
      saves++;
      if (gate) await gate;
      if (failNext) { failNext = false; return { ok: false, code: 'storage', issues: [] }; }
      if (disk.revision !== expected) return { ok: false, code: 'conflict', issues: [] };
      disk = structuredClone({ ...next, revision: expected + 1 });
      return { ok: true, value: structuredClone(disk) };
    },
  };
  const controller = createWorkspaceController({ persistence, packs: contentPacks,
    now: () => '2026-10-07T00:00:00Z', today: () => '2026-10-07', nextId: () => `fixture-${++serial}` });
  return { controller, persistence, disk: () => disk, saves: () => saves,
    fail: () => { failNext = true; }, block: promise => { gate = promise; },
    externalEdit: () => { disk = { ...disk, revision: disk.revision + 1 }; } };
}
const prepare = async (fixture, track = 'backend.node') => {
  requireOk(await fixture.controller.initialize());
  requireOk(fixture.controller.selectTrack(track));
  requireOk(fixture.controller.updateDraft(track, { goal: 'Test learning' }));
};
await check('Initialize once and do not save defaults', async () => {
  const f = fixture(); let loads = 0;
  const original = f.persistence.loadWorkspace;
  f.persistence.loadWorkspace = async () => { loads++; return original(); };
  await Promise.all([f.controller.initialize(), f.controller.initialize()]);
  assert.equal(loads, 1); assert.equal(f.saves(), 0);
});
await check('Concurrent reload is rejected before it can overwrite later edits', async () => {
  const f = fixture(); await prepare(f);
  requireOk(await f.controller.saveDraft());
  const original = f.persistence.loadWorkspace;
  let release;
  let loads = 0;
  const gate = new Promise(resolve => { release = resolve; });
  f.persistence.loadWorkspace = async () => { loads++; await gate; return original(); };
  const loading = f.controller.reloadWorkspace();
  const concurrent = await f.controller.reloadWorkspace();
  assert.equal(concurrent.ok, false);
  assert.equal(concurrent.issues[0].code, 'LOAD_IN_PROGRESS');
  assert.equal(loads, 1);
  assert.equal(f.controller.updateDraft('backend.node', { goal: 'Too early' }).ok, false);
  release(); requireOk(await loading);
  requireOk(f.controller.updateDraft('backend.node', { goal: 'Latest draft' }));
  assert.equal(f.controller.getDraft('backend.node').goal, 'Latest draft');
});
await check('Ten registered tracks generate independent plans', async () => {
  const f = fixture(); await prepare(f);
  const ids = contentPacks.flatMap(pack => pack.tracks.map(track => track.id));
  for (const id of ids) {
    requireOk(f.controller.selectTrack(id));
    requireOk(f.controller.updateDraft(id, { goal: `Learn ${id}` }));
    requireOk(await f.controller.createPlan(id));
  }
  assert.equal(f.disk().plans.length, 10);
  assert.equal(new Set(f.disk().plans.map(plan => plan.id)).size, 10);
});
await check('Explore another track does not change profile or active plan', async () => {
  const f = fixture(); await prepare(f);
  const plan = requireOk(await f.controller.createPlan('backend.node'));
  requireOk(f.controller.selectTrack('mobile.flutter'));
  assert.equal(f.controller.getSnapshot().workspace.activePlanId, plan.id);
  assert.equal(f.controller.getSnapshot().workspace.profile.majorId, null);
});
await check('Invalid draft returns issues without storage writes', async () => {
  const f = fixture(); await prepare(f); const before = f.saves();
  requireOk(f.controller.updateDraft('backend.node', { hoursPerWeek: 21 }));
  const result = await f.controller.createPlan('backend.node');
  assert.equal(result.ok, false); assert.equal(result.code, 'validation'); assert.equal(f.saves(), before);
});
await check('Checkbox selection order is normalized to curriculum order', async () => {
  const f = fixture(); await prepare(f);
  const draft = requireOk(f.controller.updateDraft('backend.node', { selectedStageIds: [...f.controller.getDraft('backend.node').selectedStageIds].reverse() }));
  assert.deepEqual(draft.selectedStageIds, contentPacks[0].tracks[0].stageIds);
  requireOk(await f.controller.createPlan('backend.node'));
});
await check('Preview and cancel do not save or change current generation', async () => {
  const f = fixture(); await prepare(f);
  const plan = requireOk(await f.controller.createPlan('backend.node')); const before = f.saves();
  requireOk(f.controller.updateDraft('backend.node', { hoursPerWeek: 8 }));
  requireOk(f.controller.previewRegeneration(plan.id)); f.controller.cancelRegeneration();
  assert.equal(f.saves(), before); assert.equal(f.controller.getSnapshot().workspace.plans[0].current.id, plan.current.id);
  assert.equal(f.controller.getSnapshot().preview, null);
});
await check('Confirmation ignores caller tampering and preserves old history', async () => {
  const f = fixture(); await prepare(f);
  const plan = requireOk(await f.controller.createPlan('backend.node'));
  requireOk(f.controller.updateDraft('backend.node', { hoursPerWeek: 8 }));
  const preview = requireOk(f.controller.previewRegeneration(plan.id)); preview.nextPlan.name = 'Tampered';
  const saved = requireOk(await f.controller.confirmRegeneration(preview.token));
  assert.notEqual(saved.name, 'Tampered'); assert.equal(saved.history.length, 1);
  assert.equal(saved.history[0].id, plan.current.id); assert.equal(saved.current.hoursPerWeek, 8);
});
await check('Draft edit invalidates previous regeneration preview', async () => {
  const f = fixture(); await prepare(f);
  const plan = requireOk(await f.controller.createPlan('backend.node'));
  const preview = requireOk(f.controller.previewRegeneration(plan.id));
  requireOk(f.controller.updateDraft('backend.node', { hoursPerWeek: 8 }));
  const result = await f.controller.confirmRegeneration(preview.token);
  assert.equal(result.ok, false); assert.equal(result.code, 'conflict');
});
await check('Storage failure keeps proposed plan; retry creates exactly one plan', async () => {
  const f = fixture(); await prepare(f); f.fail();
  assert.equal((await f.controller.createPlan('backend.node')).ok, false);
  assert.equal(f.disk().plans.length, 0); assert.equal(f.controller.getSnapshot().workspace.activePlanId, null);
  assert.equal(f.controller.getSnapshot().unsavedWorkspace.plans.length, 1);
  assert.equal((await f.controller.reloadWorkspace()).code, 'conflict');
  requireOk(await f.controller.retrySave()); assert.equal(f.disk().plans.length, 1);
});
await check('Pending save blocks edits and double submit; no early activation', async () => {
  const f = fixture(); await prepare(f); let release;
  f.block(new Promise(resolve => { release = resolve; }));
  const saving = f.controller.createPlan('backend.node');
  assert.equal(f.controller.getSnapshot().status, 'saving');
  assert.equal(f.controller.getSnapshot().workspace.activePlanId, null);
  assert.equal((await f.controller.createPlan('backend.node')).ok, false);
  assert.equal(f.controller.updateDraft('backend.node', { goal: 'Too late' }).ok, false);
  release(); requireOk(await saving); assert.equal(f.disk().plans.length, 1);
});
await check('Revision conflict preserves proposed data and does not overwrite disk', async () => {
  const f = fixture(); await prepare(f); f.externalEdit();
  const result = await f.controller.createPlan('backend.node');
  assert.equal(result.ok, false); assert.equal(f.controller.getSnapshot().status, 'conflict');
  assert.equal(f.disk().plans.length, 0); assert.ok(f.controller.getSnapshot().unsavedWorkspace);
  requireOk(await f.controller.reloadWorkspace(true)); assert.equal(f.controller.getSnapshot().workspace.revision, 1);
});
await check('Selecting a plan persists its ID; reload keeps all plans and drafts', async () => {
  const f = fixture(); await prepare(f);
  const first = requireOk(await f.controller.createPlan('backend.node'));
  requireOk(await f.controller.createPlan('backend.node'));
  requireOk(await f.controller.selectPlan(first.id)); requireOk(await f.controller.reloadWorkspace());
  assert.equal(f.controller.getSnapshot().workspace.activePlanId, first.id);
  assert.equal(f.controller.getSnapshot().workspace.plans.length, 2);
});
await check('Exposed snapshots cannot be mutated by feature code', async () => {
  const f = fixture(); await prepare(f);
  assert.throws(() => { f.controller.getSnapshot().workspace.profile.displayName = 'Unexpected'; }, TypeError);
});
await check('Resolver fails on missing references, not partial success', async () => {
  const f = fixture(); requireOk(await f.controller.initialize());
  assert.equal(f.controller.resolveTrack('missing.track').ok, false);
  const badPacks = structuredClone(contentPacks); badPacks[0].stages = [];
  const broken = createWorkspaceController({ persistence: f.persistence, packs: badPacks, now: () => '', today: () => '2026-10-07', nextId: () => 'x' });
  assert.equal(broken.resolveTrack('backend.node').ok, false);
});
await check('Bootstrap persistence rejects malformed/future workspace', async () => {
  assert.equal(validateRoadmapWorkspace({ schemaVersion: 3 }).code, 'unsupported_version');
  const bad = emptyWorkspace('Asia/Bangkok'); bad.plans = [{}];
  assert.equal(validateRoadmapWorkspace(bad).ok, false);
  requireOk(validateRoadmapWorkspace(emptyWorkspace('Asia/Bangkok')));
});
console.log(`${count} context checks passed`);
