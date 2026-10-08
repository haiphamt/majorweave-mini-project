import { createRoadmapStore, emptyWorkspace } from '../../../src/persistence/roadmap-store';
import type { OperationResult, Workspace } from '../../../src/domain/contracts';

function element<T extends HTMLElement>(id: string): T {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Thiếu ${id}`);
  return value as T;
}
function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function unwrap(result: OperationResult<Workspace>): Workspace { assert(result.ok, JSON.stringify(result)); return result.value; }
function timeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout: thao tác không trả kết quả trong 8 giây')), 8000);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
function openDb(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
async function readRaw(name: string): Promise<unknown> {
  const db = await openDb(name);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('workspace', 'readonly');
    const request = tx.objectStore('workspace').get('local');
    let value: unknown;
    request.onsuccess = () => { value = request.result; };
    tx.oncomplete = () => { db.close(); resolve(value); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}

// Each page has its own RAM snapshot; BroadcastChannel carries observations only.
const url = new URL(location.href);
let session = url.searchParams.get('session');
if (!session || !/^[a-f0-9-]{36}$/i.test(session)) session = crypto.randomUUID();
const role = url.searchParams.get('role') === 'B' ? 'B' : 'A';
url.searchParams.set('session', session); url.searchParams.set('role', role);
history.replaceState(null, '', url);
const name = `majorweave.qa.team05.tabs.${session}`;
const pageId = crypto.randomUUID();
const peerLink = element<HTMLAnchorElement>('peer');
const peerUrl = new URL(url); peerUrl.searchParams.set('role', 'B');
peerLink.href = peerUrl.href;
if (role === 'B') peerLink.hidden = true;
element('identity').textContent = `Tab ${role} · page ${pageId} · database ${name}`;
const tabOutput = element<HTMLPreElement>('tab-output');
const loadButton = element<HTMLButtonElement>('load');
const saveButton = element<HTMLButtonElement>('save');
const channel = new BroadcastChannel(`team05.${session}`);
const store = createRoadmapStore({ databaseName: name, timeZone: 'Asia/Ho_Chi_Minh' });
let snapshot: Workspace | null = null;
let peerSaved: { base: number; workspace: Workspace } | null = null;
const tabLines: string[] = [];
function logTab(text: string) { tabLines.push(text); tabOutput.textContent = tabLines.join('\n'); }
type Observation = { page: string; role: 'A' | 'B'; kind: 'loaded'; revision: number }
  | { page: string; role: 'A' | 'B'; kind: 'saved'; base: number; workspace: Workspace };
channel.onmessage = (event: MessageEvent<Observation>) => {
  const message = event.data;
  if (message.page === pageId || message.role === role) return;
  if (message.kind === 'loaded') logTab(`Quan sát tab ${message.role} (${message.page}) tải revision ${message.revision}`);
  if (message.kind === 'saved') {
    peerSaved = { base: message.base, workspace: message.workspace };
    logTab(`Quan sát tab ${message.role} save revision ${message.base} → ${message.workspace.revision}`);
  }
};
loadButton.onclick = async () => {
  loadButton.disabled = true;
  try {
    snapshot = unwrap(await timeout(store.loadWorkspace()));
    logTab(`Tải snapshot revision ${snapshot.revision}. ${snapshot.revision === 0 ? 'Sẵn sàng thử cùng revision 0.' : 'Phiên này đã có dữ liệu; dùng phiên mới để lặp test từ revision 0.'}`);
    channel.postMessage({ page: pageId, role, kind: 'loaded', revision: snapshot.revision } satisfies Observation);
    saveButton.disabled = false;
  } catch (error) { logTab(`FAIL tải: ${String(error)}`); }
  finally { loadButton.disabled = false; }
};
saveButton.onclick = async () => {
  if (!snapshot) return;
  saveButton.disabled = true;
  const candidate = structuredClone(snapshot); candidate.profile.displayName = `Tab ${role} — ${pageId}`;
  const before = JSON.stringify(candidate);
  try {
    const result = await timeout(store.saveWorkspace(candidate, candidate.revision));
    assert(JSON.stringify(candidate) === before, 'Candidate bị sửa');
    if (result.ok) {
      logTab(`SUCCESS tab ${role}: revision ${candidate.revision} → ${result.value.revision}; input giữ nguyên.`);
      channel.postMessage({ page: pageId, role, kind: 'saved', base: candidate.revision, workspace: result.value } satisfies Observation);
    } else {
      logTab(`Kết quả: ${result.code} / ${result.issues.map(issue => issue.code).join(', ')}`);
      if (result.code === 'conflict') {
        const disk = unwrap(await timeout(store.loadWorkspace()));
        assert(peerSaved && peerSaved.base === candidate.revision, 'Chưa có quan sát save của tab khác cùng revision; xem lại đúng thứ tự A/B.');
        assert(JSON.stringify(disk) === JSON.stringify(peerSaved.workspace), 'Conflict đã đổi dữ liệu disk của tab thắng');
        assert(JSON.stringify(candidate) === before, 'Bản chưa lưu không còn nguyên');
        logTab('PASS hai tab thật: tab thắng được giữ trên disk; tab stale conflict; candidate chưa lưu còn nguyên.');
      }
    }
  } catch (error) { logTab(`FAIL/CHƯA ĐỦ BẰNG CHỨNG: ${String(error)}`); }
};

const runButton = element<HTMLButtonElement>('run');
const suiteOutput = element<HTMLPreElement>('suite-output');
runButton.onclick = async () => {
  runButton.disabled = true;
  const prefix = `majorweave.qa.team05.failures.${crypto.randomUUID()}`;
  const lines = [`DB QA prefix: ${prefix}`];
  let passed = 0, failed = 0;
  const test = async (label: string, run: () => Promise<void>) => {
    try { await run(); passed++; lines.push(`PASS ${label}`); }
    catch (error) { failed++; lines.push(`FAIL ${label}: ${String(error)}`); }
    suiteOutput.textContent = lines.join('\n');
  };
  await test('Không resolve success trước transaction.complete (native)', async () => {
    const dbName = `${prefix}.complete`;
    const store = createRoadmapStore({ databaseName: dbName, timeZone: 'UTC' });
    await store.loadWorkspace();
    const original = IDBDatabase.prototype.transaction;
    let completed = false, observed = false, early = false;
    const trace: string[] = [];
    IDBDatabase.prototype.transaction = function (storeNames, mode, options) {
      const tx = original.call(this, storeNames, mode, options);
      if (this.name === dbName && mode === 'readwrite') {
        observed = true;
        tx.addEventListener('complete', () => { completed = true; trace.push('transaction.complete'); });
      }
      return tx;
    };
    try {
      const result = await timeout(store.saveWorkspace(emptyWorkspace('UTC'), 0).then(value => {
        if (value.ok && !completed) early = true;
        trace.push('save.promise.resolved'); return value;
      }));
      assert(result.ok && observed && completed && !early, `Resolve quá sớm hoặc không quan sát transaction: ${trace}`);
      assert((await readRaw(dbName) as Workspace).revision === 1, 'Không có bản commit trên disk');
      lines.push(`TRACE ${trace.join(' → ')}`);
    } finally { IDBDatabase.prototype.transaction = original; }
  });
  await test('Abort transaction native sau put.success: rollback, input giữ, retry được', async () => {
    const dbName = `${prefix}.abort`;
    const store = createRoadmapStore({ databaseName: dbName, timeZone: 'UTC' });
    const base = unwrap(await store.saveWorkspace(emptyWorkspace('UTC'), 0));
    const candidate = structuredClone(base); candidate.profile.displayName = 'Bản chưa lưu';
    const before = JSON.stringify(candidate);
    const original = IDBObjectStore.prototype.put;
    let aborted = false;
    IDBObjectStore.prototype.put = function (value, key) {
      const request = original.call(this, value, key);
      if (this.transaction.db.name === dbName) {
        const tx = this.transaction;
        request.addEventListener('success', () => { aborted = true; tx.abort(); });
      }
      return request;
    };
    try {
      const result = await timeout(store.saveWorkspace(candidate, base.revision));
      assert(aborted && !result.ok && result.issues[0].code === 'INDEXEDDB_ABORTED', JSON.stringify(result));
    } finally { IDBObjectStore.prototype.put = original; }
    assert(JSON.stringify(await readRaw(dbName)) === JSON.stringify(base), 'Abort không rollback disk');
    assert(JSON.stringify(candidate) === before, 'Candidate bị mất/sửa');
    const retry = unwrap(await timeout(store.saveWorkspace(candidate, base.revision)));
    assert(retry.revision === base.revision + 1 && retry.profile.displayName === candidate.profile.displayName, 'Retry không giữ đúng candidate');
  });
  await test('QuotaExceededError injected: lỗi rõ, disk/input giữ, retry được (không phải disk đầy thật)', async () => {
    const dbName = `${prefix}.quota`;
    const store = createRoadmapStore({ databaseName: dbName, timeZone: 'UTC' });
    const base = unwrap(await store.saveWorkspace(emptyWorkspace('UTC'), 0));
    const candidate = structuredClone(base); candidate.profile.displayName = 'Bản quota chưa lưu';
    const before = JSON.stringify(candidate);
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (value, key) {
      if (this.transaction.db.name === dbName) throw new DOMException('QA controlled quota failure', 'QuotaExceededError');
      return original.call(this, value, key);
    };
    try {
      const result = await timeout(store.saveWorkspace(candidate, base.revision));
      assert(!result.ok && result.issues[0].code === 'INDEXEDDB_QUOTA', JSON.stringify(result));
    } finally { IDBObjectStore.prototype.put = original; }
    assert(JSON.stringify(await readRaw(dbName)) === JSON.stringify(base), 'Quota làm đổi disk');
    assert(JSON.stringify(candidate) === before, 'Quota làm đổi input');
    const retry = unwrap(await timeout(store.saveWorkspace(candidate, base.revision)));
    assert(retry.profile.displayName === candidate.profile.displayName, 'Retry mất bản chưa lưu');
  });
  await test('Blocked event native với upgrade QA 1→2; mở muộn không reset/ghi DB', async () => {
    const dbName = `${prefix}.blocked`;
    const store = createRoadmapStore({ databaseName: dbName, timeZone: 'UTC' });
    const base = unwrap(await store.saveWorkspace(emptyWorkspace('UTC'), 0));
    const held = await openDb(dbName); // Intentionally keep the old connection open.
    const original = indexedDB.open;
    let nativeBlocked = false;
    let pending: Promise<void> | null = null;
    indexedDB.open = function (databaseName, version) {
      // Production adapter remains v1. Test redirects only this QA open to v2
      // to obtain a real blocked upgrade event, since an existing v1 DB does not upgrade.
      const request = original.call(this, databaseName, databaseName === dbName ? 2 : version);
      if (databaseName === dbName) {
        request.addEventListener('blocked', () => { nativeBlocked = true; });
        pending = new Promise<void>(resolve => {
          request.addEventListener('error', () => resolve());
          request.addEventListener('success', () => { request.result.close(); resolve(); });
        });
      }
      return request;
    };
    try {
      const result = await timeout(store.loadWorkspace());
      assert(nativeBlocked && !result.ok && result.issues[0].code === 'INDEXEDDB_BLOCKED', JSON.stringify(result));
    } finally { indexedDB.open = original; held.close(); }
    if (pending) await timeout(pending);
    assert(JSON.stringify(await readRaw(dbName)) === JSON.stringify(base), 'Blocked/mở muộn thay dữ liệu gốc');
    const check = await openDb(dbName); assert(check.version === 1, 'Upgrade muộn không được hủy'); check.close();
  });
  lines.push(`\n${passed} PASS / ${failed} FAIL`);
  lines.push('Quota là fault injection; blocked dùng upgrade native trên DB QA. Không coi các kết quả này là nghiệm thu quota đầy disk thực hoặc toàn bộ UI.');
  lines.push('Hai tab thật có kết quả riêng ở mục 1. Migration/backup/validator semantic/content chưa nằm trong suite.');
  suiteOutput.textContent = lines.join('\n');
  runButton.disabled = false;
};
