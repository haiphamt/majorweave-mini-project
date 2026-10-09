import { createLegacyMigration } from '../../../src/persistence/migration';
import { createRoadmapStore, validateRoadmapWorkspace } from '../../../src/persistence/roadmap-store';
import { backendPack, legacyStageMap } from '../../../src/content/paths/backend';
import type { OperationResult, Workspace, WorkspacePersistence } from '../../../src/domain/contracts';

const output = document.querySelector<HTMLPreElement>('#output')!;
const button = document.querySelector<HTMLButtonElement>('#run')!;
const assert: (value: unknown, message: string) => asserts value = (value, message) => {
  if (!value) throw new Error(message);
};
const equal = (a: unknown, b: unknown, message: string) => assert(JSON.stringify(a) === JSON.stringify(b), message);
function unwrap<T>(result: OperationResult<T>): T {
  assert(result.ok, JSON.stringify(result));
  return result.value;
}
const context = () => ({ now: new Date().toISOString(), timeZone: 'Asia/Ho_Chi_Minh', nextId: () => crypto.randomUUID() });
function fixture() {
  const stage = backendPack.stages.find(s => s.id === legacyStageMap.node.js)!;
  const work = stage.work[0];
  return JSON.stringify({ version: 1, stack: 'node', profileName: 'QA migration', major: 'software', browseFaculty: 'all', level: 'basic', preferFree: true, language: 'all',
    selected: ['js'], known: [], sourceByModule: { js: stage.defaultResourceId.replace(/^resource\./, '') }, goal: 'Nháp QA', hours: 2, startDate: '2026-10-05', credentials: [],
    planMeta: { stack: 'node', goal: 'Plan QA', hours: 5, startDate: '2026-10-05' },
    tasks: [{ id: 'js-0', moduleId: 'js', title: work.title, minutes: work.minutes, sourceId: stage.defaultResourceId.replace(/^resource\./, ''), week: 3, completed: true, notes: 'Giữ ghi chú gốc' }] });
}
function setup(databaseName: string) {
  const source = { raw: fixture() };
  const port = createRoadmapStore({ databaseName, timeZone: 'Asia/Ho_Chi_Minh', validate: validateRoadmapWorkspace });
  const make = (persistence: WorkspacePersistence = port) => createLegacyMigration({ persistence, readLegacy: () => source.raw, validate: validateRoadmapWorkspace, context });
  return { source, port, make };
}
async function prepare(controller: ReturnType<typeof createLegacyMigration>) {
  const result = unwrap(await controller.prepare());
  assert(result.kind === 'preview', 'Cần preview');
  return result;
}
button.addEventListener('click', async () => {
  button.disabled = true;
  output.textContent = '';
  const prefix = `majorweave.qa.team05.migration.${crypto.randomUUID()}`;
  let pass = 0, fail = 0;
  const log = (text: string) => { output.textContent += `${text}\n`; };
  async function test(label: string, fn: (database: string) => Promise<void>) {
    const database = `${prefix}.${pass + fail + 1}`;
    log(`DB: ${database}`);
    try { await fn(database); pass++; log(`PASS ${label}`); }
    catch (error) { fail++; log(`FAIL ${label}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  try {
    log(`Database QA prefix: ${prefix}`);
    await test('Preview/cancel không ghi default, marker hay plan', async database => {
      const h = setup(database), c = h.make(), initial = unwrap(await h.port.loadWorkspace()), p = await prepare(c);
      equal(unwrap(await h.port.loadWorkspace()), initial, 'Preview đã ghi');
      unwrap(c.cancel(p.ticket));
      equal(unwrap(await h.port.loadWorkspace()), initial, 'Cancel đã ghi');
      assert(!(await c.confirm(p.ticket)).ok, 'Ticket hủy vẫn confirm được');
    });
    await test('Confirm/reload giữ plan, completion, draft và marker; nguồn nguyên trạng', async database => {
      const h = setup(database), c = h.make(), raw = h.source.raw, p = await prepare(c), saved = unwrap(await c.confirm(p.ticket));
      const fresh = createRoadmapStore({ databaseName: database, timeZone: 'Asia/Ho_Chi_Minh' });
      const disk = unwrap(await fresh.loadWorkspace());
      equal(disk, saved.workspace, 'Reload không giữ kết quả');
      assert(disk.revision === 1 && disk.plans.length === 1 && disk.imports.length === 1, 'Plan/marker không cùng commit');
      assert(disk.plans[0].completions.length === 1 && Object.keys(disk.drafts).length === 1, 'Mất completion/draft');
      equal(h.source.raw, raw, 'Nguồn đã đổi');
    });
    await test('Caller sửa candidate không sửa bản confirm riêng', async database => {
      const h = setup(database), c = h.make(), p = await prepare(c), expected = p.candidate.plans[0].current.tasks[0].title;
      p.candidate.plans[0].current.tasks[0].title = 'Tampered';
      const disk = unwrap(await c.confirm(p.ticket)).workspace;
      equal(disk.plans[0].current.tasks[0].title, expected, 'Đã nhận caller tamper');
    });
    await test('Hai controller cùng trang xác nhận đồng thời: không tạo hai bản nhập', async database => {
      const h = setup(database), a = h.make(), b = h.make(), pa = await prepare(a), pb = await prepare(b);
      const results = await Promise.all([a.confirm(pa.ticket), b.confirm(pb.ticket)]);
      assert(results.some(r => r.ok), 'Không có writer thành công');
      for (const r of results) if (!r.ok) assert(r.code === 'conflict', 'Lỗi không phải conflict');
      const disk = unwrap(await h.port.loadWorkspace());
      assert(disk.revision === 1 && disk.plans.length === 1 && disk.imports.length === 1, 'Nhập trùng');
      const again = unwrap(await h.make().prepare());
      assert(again.kind === 'already-imported', 'Không nhận fingerprint đã nhập');
    });
    await test('Writer khác thay workspace: conflict giữ proposal, không ghi đè', async database => {
      const h = setup(database), c = h.make(), p = await prepare(c), proposal = c.getProposal(), other = unwrap(await h.port.loadWorkspace());
      other.profile.displayName = 'Writer khác';
      const saved = unwrap(await h.port.saveWorkspace(other, other.revision));
      const result = await c.confirm(p.ticket);
      assert(!result.ok && result.code === 'conflict', 'Không conflict');
      equal(c.getProposal(), proposal, 'Mất đề xuất');
      equal(unwrap(await h.port.loadWorkspace()), saved, 'Ghi đè writer khác');
    });
    await test('Lỗi save injected: giữ IDs và retry qua adapter native chỉ nhập một lần', async database => {
      const h = setup(database); let rejectSave = true;
      const wrapped: WorkspacePersistence = { loadWorkspace: () => h.port.loadWorkspace(), saveWorkspace: (value, revision) => rejectSave
        ? Promise.resolve<OperationResult<Workspace>>({ ok: false, code: 'storage', issues: [{ code: 'QA_INJECTED_FAILURE', field: 'workspace', message: 'Injected, không phải quota/abort native' }] })
        : h.port.saveWorkspace(value, revision) };
      const c = h.make(wrapped), p = await prepare(c), proposal = c.getProposal();
      assert(!(await c.confirm(p.ticket)).ok, 'Lỗi injected không được trả');
      equal(c.getProposal(), proposal, 'Mất IDs đề xuất');
      assert(unwrap(await h.port.loadWorkspace()).revision === 0, 'Lỗi vẫn ghi');
      rejectSave = false;
      const saved = unwrap(await c.confirm(p.ticket)).workspace;
      assert(saved.plans[0].id === proposal!.plans[0].id && saved.imports.length === 1, 'Retry sinh bản khác');
    });
    await test('Nguồn đổi trước confirm: không ghi migration', async database => {
      const h = setup(database), c = h.make(), p = await prepare(c);
      h.source.raw += ' ';
      const result = await c.confirm(p.ticket);
      assert(!result.ok && result.code === 'conflict', 'Nguồn đổi không bị chặn');
      const disk = unwrap(await h.port.loadWorkspace());
      assert(disk.revision === 0 && disk.imports.length === 0 && disk.plans.length === 0, 'Đã ghi nguồn stale');
    });
    log(`${pass} PASS / ${fail} FAIL — migration qua native IndexedDB; lỗi save là injection; hai controller cùng trang.`);
    log('Chưa bao phủ: hai tab thật, native quota/abort của migration, validator semantic và UI app chính.');
    log('DB QA được giữ để kiểm tra. Không đọc/xóa DB hoặc localStorage thật.');
  } finally { button.disabled = false; }
});
