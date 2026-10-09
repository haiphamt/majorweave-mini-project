import { createRoadmapStore, emptyWorkspace } from '../../../../src/persistence/roadmap-store';
import type { OperationResult, Workspace } from '../../../../src/domain/contracts';

const output = document.querySelector<HTMLPreElement>('#output')!;
const button = document.querySelector<HTMLButtonElement>('#run')!;
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function unwrap(result: OperationResult<Workspace>): Workspace { assert(result.ok, JSON.stringify(result)); return result.value; }
function openDb(name: string, version = 1, createStore = true): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = () => { if (createStore) request.result.createObjectStore('workspace'); };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
async function raw(name: string, value?: unknown): Promise<unknown> {
  const db = await openDb(name);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('workspace', value === undefined ? 'readonly' : 'readwrite');
    const store = tx.objectStore('workspace');
    const request = value === undefined ? store.get('local') : store.put(value, 'local');
    let result: unknown;
    request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
button.addEventListener('click', async () => {
  button.disabled = true;
  output.textContent = '';
  const prefix = `majorweave.qa.team05.${crypto.randomUUID()}`;
  const lines: string[] = [`Database QA prefix: ${prefix}`];
  let passed = 0, failed = 0;
  const log = () => { output.textContent = lines.join('\n'); };
  const test = async (label: string, run: () => Promise<void>) => {
    try { await run(); passed++; lines.push(`PASS ${label}`); }
    catch (error) { failed++; lines.push(`FAIL ${label}: ${error instanceof Error ? error.message : String(error)}`); }
    log();
  };
  const makeStore = (suffix: string) => createRoadmapStore({ databaseName: `${prefix}.${suffix}`, timeZone: 'Asia/Ho_Chi_Minh' });
  await test('Load rỗng không ghi defaults', async () => {
    const ws = unwrap(await makeStore('empty').loadWorkspace());
    assert(ws.revision === 0 && ws.plans.length === 0, 'Workspace rỗng không đúng');
    assert(await raw(`${prefix}.empty`) === undefined, 'Load đã tự ghi defaults');
  });
  await test('Save tăng revision, reload giữ profile; không sửa object đầu vào', async () => {
    const store = makeStore('save');
    const next = emptyWorkspace('Asia/Ho_Chi_Minh'); next.profile.displayName = 'QA Huy';
    const before = JSON.stringify(next);
    const saved = unwrap(await store.saveWorkspace(next, 0));
    assert(saved.revision === 1, 'Revision không tăng');
    assert(JSON.stringify(next) === before, 'Save sửa object đầu vào');
    const read = unwrap(await store.loadWorkspace());
    assert(read.profile.displayName === 'QA Huy' && read.revision === 1, 'Reload không đúng');
  });
  await test('Hai save cùng revision chỉ một thành công', async () => {
    const a = makeStore('race'), b = makeStore('race');
    const wsA = emptyWorkspace('Asia/Ho_Chi_Minh'); wsA.profile.displayName = 'A';
    const wsB = structuredClone(wsA); wsB.profile.displayName = 'B';
    const results = await Promise.all([a.saveWorkspace(wsA, 0), b.saveWorkspace(wsB, 0)]);
    assert(results.filter(r => r.ok).length === 1, 'Phải có đúng một save thành công');
    assert(results.filter(r => !r.ok && r.code === 'conflict').length === 1, 'Save stale chưa trả conflict');
    const winner = results.find(r => r.ok)!;
    assert(JSON.stringify(unwrap(await a.loadWorkspace())) === JSON.stringify(unwrap(winner)), 'Dữ liệu disk khác bản thắng');
  });
  await test('Candidate sai revision trả conflict, không ghi đè', async () => {
    const store = makeStore('stale'); const saved = unwrap(await store.saveWorkspace(emptyWorkspace('UTC'), 0));
    const stale = structuredClone(saved); stale.revision = 0;
    const result = await store.saveWorkspace(stale, 1);
    assert(!result.ok && result.code === 'conflict', 'Không phát hiện revision của candidate');
    assert(JSON.stringify(unwrap(await store.loadWorkspace())) === JSON.stringify(saved), 'Dữ liệu gốc bị đổi');
  });
  await test('Dữ liệu hỏng trên disk được giữ nguyên, save bị từ chối', async () => {
    const name = `${prefix}.corrupt`; const corrupt = { schemaVersion: 2, revision: 0, broken: true };
    await raw(name, corrupt);
    const store = makeStore('corrupt');
    const result = await store.saveWorkspace(emptyWorkspace('UTC'), 0);
    assert(!result.ok && result.code === 'validation', 'Save không từ chối dữ liệu hỏng');
    assert(JSON.stringify(await raw(name)) === JSON.stringify(corrupt), 'Dữ liệu hỏng bị ghi đè');
  });
  await test('Schema tương lai được giữ nguyên', async () => {
    const name = `${prefix}.future`; const future = { schemaVersion: 99, revision: 0 };
    await raw(name, future);
    const result = await makeStore('future').loadWorkspace();
    assert(!result.ok && result.code === 'unsupported_version', 'Schema lạ chưa được báo đúng');
    assert(JSON.stringify(await raw(name)) === JSON.stringify(future), 'Schema lạ bị sửa');
  });
  await test('Revision đầu vào không hợp lệ không ghi dữ liệu', async () => {
    const result = await makeStore('invalid-revision').saveWorkspace(emptyWorkspace('UTC'), -1);
    assert(!result.ok && result.code === 'validation', 'Không từ chối revision âm');
    assert(await raw(`${prefix}.invalid-revision`) === undefined, 'Đã ghi dữ liệu');
  });
  await test('Validator ném lỗi trong callback đọc trả lỗi thay vì treo', async () => {
    const name = `${prefix}.validator`; await raw(name, emptyWorkspace('UTC'));
    const store = createRoadmapStore({ databaseName: name, timeZone: 'UTC', validate: () => { throw new Error('QA injected validator failure'); } });
    const result = await Promise.race([
      store.loadWorkspace(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout: promise bị treo')), 5000)),
    ]);
    assert(!result.ok && result.code === 'storage', 'Validator throw không trả lỗi');
    assert((await raw(name) as Workspace).revision === 0, 'Dữ liệu gốc bị đổi');
  });
  await test('DB version mới hơn trả INDEXEDDB_VERSION', async () => {
    const db = await openDb(`${prefix}.version`, 2); db.close();
    const result = await makeStore('version').loadWorkspace();
    assert(!result.ok && result.issues[0].code === 'INDEXEDDB_VERSION', 'Không nhận diện VersionError');
  });
  await test('Object store bị thiếu trả lỗi, không reset database', async () => {
    const db = await openDb(`${prefix}.missing-store`, 1, false); db.close();
    const result = await makeStore('missing-store').loadWorkspace();
    assert(!result.ok && result.code === 'storage', 'Không báo thiếu store');
    const check = await openDb(`${prefix}.missing-store`, 1, false);
    assert(!check.objectStoreNames.contains('workspace'), 'Đã reset/tự sửa DB'); check.close();
  });
  lines.push(`\n${passed} PASS / ${failed} FAIL`);
  lines.push('Chưa được suite này bao phủ: hai tab thực, blocked, quota, abort, xác nhận không success sớm; migration/backup và validator semantic.');
  lines.push('Database QA được giữ để kiểm tra; không xóa storage thật.');
  log(); button.disabled = false;
});
