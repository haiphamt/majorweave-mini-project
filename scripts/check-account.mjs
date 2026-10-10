import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { build } from 'esbuild';
import { PGlite } from '@electric-sql/pglite';

const built = await build({ stdin: { contents: `
  export { createCloudWorkspace } from './src/persistence/cloud-workspace';
  export { createWorkspaceController } from './src/app/workspace-controller';
  export { contentPacks } from './src/content';
`, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, platform: 'node', format: 'esm' });
const { createCloudWorkspace, createWorkspaceController, contentPacks } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`);
const db = new PGlite();
const uidA = '11111111-1111-4111-8111-111111111111';
const uidB = '22222222-2222-4222-8222-222222222222';
await db.exec(`create role anon; create role authenticated; create schema auth;
  create table auth.users(id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  $$;
  grant usage on schema auth to anon, authenticated;
  insert into auth.users values ('${uidA}'), ('${uidB}');`);
const migration = fs.readFileSync('supabase/migrations/202610100001_account_workspaces.sql', 'utf8');
await db.exec(migration);
await db.exec(migration); // Safe to re-apply the documented setup.
async function asUser(uid, fn) {
  return db.transaction(async tx => {
    await tx.exec(`set local role ${uid ? 'authenticated' : 'anon'}`);
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [uid ?? '']);
    return fn(tx);
  });
}
// Supabase-shaped transport, with the production SQL and a real Postgres engine.
// This does not simulate Supabase Auth/email delivery or its hosted HTTP gateway.
function client(uid) {
  const state = { uid, offline: false, loseAck: false, switchOnRpc: null, holdSession: null, calls: 0 };
  return {
    test: state,
    auth: { async getSession() {
      if (state.holdSession) { const hold = state.holdSession; state.holdSession = null; await hold; }
      return { data: { session: state.uid ? { user: { id: state.uid } } : null }, error: null };
    } },
    from(table) {
      assert.equal(table, 'uitplans_workspaces');
      return { select(columns) { return { eq(field, owner) {
        assert.equal(field, 'user_id');
        assert.ok(['revision', 'workspace, revision'].includes(columns));
        return { async maybeSingle() {
          if (state.offline) return { data: null, error: { code: 'FETCH_FAILED' } };
          const result = await asUser(state.uid, tx => tx.query(`select ${columns} from public.uitplans_workspaces where user_id=$1`, [owner]));
          const row = result.rows[0];
          return { data: row ? { ...row, revision: Number(row.revision) } : null, error: null };
        } };
      } }; } };
    },
    async rpc(name, args) {
      assert.equal(name, 'save_uitplans_workspace');
      state.calls++;
      if (state.offline) return { data: null, error: { code: 'FETCH_FAILED' } };
      if (state.switchOnRpc) { state.uid = state.switchOnRpc; state.switchOnRpc = null; }
      try {
        const result = await asUser(state.uid, tx => tx.query('select public.save_uitplans_workspace($1,$2::jsonb,$3,$4) as workspace',
          [args.p_user_id, JSON.stringify(args.p_workspace), args.p_expected_revision, args.p_request_id]));
        if (state.loseAck) { state.loseAck = false; return { data: null, error: { code: 'FETCH_FAILED' } }; }
        return { data: result.rows[0].workspace, error: null };
      } catch (error) { return { data: null, error: { code: error.code } }; }
    },
  };
}
const config = { timeZone: 'Asia/Bangkok', nextId: randomUUID };
function controller(transport, uid) {
  return createWorkspaceController({ packs: contentPacks, persistence: createCloudWorkspace(transport, uid, config),
    nextId: randomUUID, now: () => '2026-10-10T05:00:00.000Z', today: () => '2026-10-10', readLegacy: () => null });
}
try {
  const transport = client(uidA);
  const deviceA = controller(transport, uidA);
  const deviceB = controller(client(uidA), uidA);
  await deviceA.initialize(); await deviceB.initialize();
  assert.equal((await db.query('select count(*) as n from public.uitplans_workspaces')).rows[0].n, 0);
  console.log('PASS account: loading a new account does not write default data');

  assert.equal(deviceA.updateDraft('backend.node', { goal: 'Build an API' }).ok, true);
  assert.equal((await deviceA.saveDraft()).ok, true);
  assert.equal(deviceB.updateDraft('backend.node', { goal: 'Stale edit' }).ok, true);
  const stale = await deviceB.saveDraft();
  assert.equal(stale.ok, false); assert.equal(stale.code, 'conflict');
  assert.equal(deviceB.getSnapshot().unsavedWorkspace.drafts['backend.node'].goal, 'Stale edit');
  const backup = deviceB.exportBackupFile();
  assert.equal(backup.ok, true); assert.equal(backup.value.containsUnsavedChanges, true);
  const pending = deviceB.getSnapshot().unsavedWorkspace;
  assert.equal((await deviceB.discardPendingSave(pending)).ok, true);
  assert.equal(deviceB.getSnapshot().workspace.drafts['backend.node'].goal, 'Build an API');
  console.log('PASS account: stale second device cannot overwrite; proposal exports and reloads safely');

  const other = createCloudWorkspace(client(uidB), uidB, config);
  assert.equal((await other.loadWorkspace()).value.plans.length, 0);
  assert.equal((await asUser(uidB, tx => tx.query('select * from public.uitplans_workspaces where user_id=$1', [uidA]))).rows.length, 0);
  await assert.rejects(asUser(uidB, tx => tx.query('update public.uitplans_workspaces set revision=99 where user_id=$1', [uidA])), e => e.code === '42501');
  await assert.rejects(asUser(null, tx => tx.query('select public.save_uitplans_workspace($1,$2::jsonb,0,$3)', [uidA, '{}', randomUUID()])), e => e.code === '42501');
  console.log('PASS account SQL: RLS hides other accounts; direct writes and Guest RPC are denied');

  transport.test.loseAck = true;
  const failedAck = await deviceA.saveProfile({ ...deviceA.getSnapshot().workspace.profile, displayName: 'Lost acknowledgement' });
  assert.equal(failedAck.ok, false);
  assert.equal(deviceA.getSnapshot().workspace.revision, 1);
  const retried = await deviceA.retrySave();
  assert.equal(retried.ok, true); assert.equal(retried.value.revision, 2);
  assert.equal((await db.query('select revision from public.uitplans_workspaces where user_id=$1', [uidA])).rows[0].revision, 2);
  console.log('PASS account SQL: lost response retries exactly once with the same request ID');

  transport.test.offline = true;
  const offline = await deviceA.saveProfile({ ...retried.value.profile, displayName: 'Pending offline' });
  assert.equal(offline.ok, false);
  assert.equal(deviceA.getSnapshot().unsavedWorkspace.profile.displayName, 'Pending offline');
  assert.equal((await db.query('select revision from public.uitplans_workspaces where user_id=$1', [uidA])).rows[0].revision, 2);
  transport.test.offline = false;
  assert.equal((await deviceA.retrySave()).ok, true);
  console.log('PASS account: failed network save keeps candidate; retry persists without fallback storage');

  const port = createCloudWorkspace(transport, uidA, config);
  const original = (await port.loadWorkspace()).value;
  let release; transport.test.holdSession = new Promise(resolve => { release = resolve; });
  const save = port.saveWorkspace(original, original.revision);
  original.profile.displayName = 'Mutated by caller';
  release();
  const detached = await save;
  assert.equal(detached.ok, true); assert.equal(detached.value.profile.displayName, 'Pending offline');
  console.log('PASS account: caller cannot mutate an in-flight save');

  transport.test.switchOnRpc = uidB;
  const swapped = await port.saveWorkspace(detached.value, detached.value.revision);
  assert.equal(swapped.ok, false);
  assert.equal((await db.query('select count(*) as n from public.uitplans_workspaces where user_id=$1', [uidB])).rows[0].n, 0);
  const mismatch = await port.loadWorkspace(); assert.equal(mismatch.ok, false);
  console.log('PASS account SQL: account change between authorization and RPC cannot upload old data to new account');

  transport.test.uid = uidA;
  await assert.rejects(asUser(uidA, tx => tx.query('select public.save_uitplans_workspace($1,$2::jsonb,0,$3)', [uidB, '{}', randomUUID()])), e => e.code === 'PT401');
  await assert.rejects(asUser(uidA, tx => tx.query('select public.save_uitplans_workspace($1,$2::jsonb,0,$3)', [uidA, '{"schemaVersion":99}', randomUUID()])), e => e.code === 'PT422');
  const calls = transport.test.calls;
  assert.equal((await port.saveWorkspace({ ...detached.value, schemaVersion: 99 }, detached.value.revision)).ok, false);
  assert.equal(transport.test.calls, calls);
  console.log('PASS account: invalid data, forged owner and revision are rejected before any overwrite');
} finally { await db.close(); }
