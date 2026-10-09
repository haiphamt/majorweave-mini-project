import { exportBackup, parseBackup, createBackupImport } from '../../../src/persistence/backup';
import { createLegacyMigration } from '../../../src/persistence/migration';
import { createRoadmapStore, validateRoadmapWorkspace } from '../../../src/persistence/roadmap-store';
import { backendPack, legacyStageMap } from '../../../src/content/paths/backend';
import type { BackupFile, OperationResult, Workspace, WorkspacePersistence } from '../../../src/domain/contracts';

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
// Structure-only fixture validator. Inject MW-TEAM-04 semantic validators in app integration.
const validators = {
  workspace: validateRoadmapWorkspace,
  backup(value: unknown): OperationResult<BackupFile> {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('format' in value) || value.format !== 'majorweave-backup'
      || !('formatVersion' in value) || value.formatVersion !== 1 || !('exportedAt' in value) || typeof value.exportedAt !== 'string' || !Number.isFinite(Date.parse(value.exportedAt)) || !('workspace' in value))
      return { ok: false, code: 'validation', issues: [{ code: 'QA_ENVELOPE', field: 'backup', message: 'Envelope không hợp lệ' }] };
    const w = validateRoadmapWorkspace(value.workspace); if (!w.ok) return w;
    return { ok: true, value: { format: 'majorweave-backup', formatVersion: 1, exportedAt: value.exportedAt, workspace: w.value } };
  }
};
async function sample() {
  const p = unwrap(await import('../../../src/persistence/migration-preview').then(m => m.previewLegacyV1(fixture(), context())));
  assert(p?.plan, 'Không tạo được plan mẫu');
  const w = { schemaVersion: 2 as const, revision: 99, profile: { displayName: 'QA file', majorId: null, timeZone: 'Asia/Ho_Chi_Minh' }, preferences: { resourceLanguage: 'all' as const, preferFree: true }, activePlanId: p.plan.id, plans: [p.plan], drafts: { [p.draft.trackId]: p.draft }, savedCredentialIds: [], imports: [{ fingerprint: p.fingerprint, importedAt: context().now, planIds: [p.plan.id] }] };
  return unwrap(exportBackup(w, { exportedAt: context().now, unsaved: true }, validators));
}
const makeImport = (port: WorkspacePersistence) => createBackupImport({ persistence: port, validators, nextId: () => crypto.randomUUID() });
button.addEventListener('click', async () => {
  button.disabled = true; output.textContent = '';
  const prefix = `majorweave.qa.team05.backup.${crypto.randomUUID()}`;
  let pass = 0, fail = 0;
  const log = (line: string) => { output.textContent += `${line}\n`; };
  async function test(label: string, fn: (port: WorkspacePersistence) => Promise<void>) {
    const databaseName = `${prefix}.${pass + fail + 1}`;
    log(`DB: ${databaseName}`);
    const port = createRoadmapStore({ databaseName, timeZone: 'Asia/Ho_Chi_Minh', validate: validateRoadmapWorkspace });
    try { await fn(port); pass++; log(`PASS ${label}`); }
    catch (error) { fail++; log(`FAIL ${label}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  try {
    const source = await sample(), raw = source.json;
    log(`Database QA prefix: ${prefix}`);
    await test('Round trip/import/reload dùng revision thiết bị; giữ profile', async port => {
      const before = unwrap(await port.loadWorkspace()), c = makeImport(port), p = unwrap(await c.prepare(raw));
      assert(p.fileRevision === 99 && p.deviceRevision === 0 && p.candidate.revision === 0, 'Dùng revision file');
      equal(unwrap(await port.loadWorkspace()), before, 'Preview đã ghi');
      const saved = unwrap(await c.confirm(p.ticket)), disk = unwrap(await port.loadWorkspace());
      equal(disk, saved, 'Reload mất dữ liệu'); equal(disk.profile, before.profile, 'Profile bị thay');
      assert(disk.revision === 1 && disk.plans.length === 1 && disk.imports.length === 1, 'Plan/marker không được lưu');
      equal(unwrap(parseBackup(unwrap(exportBackup(disk, { exportedAt: context().now, unsaved: false }, validators)).json, validators)).workspace, disk, 'Round trip mất dữ liệu');
    });
    await test('Duplicate skip không ghi; copy đổi quan hệ completion', async port => {
      const c = makeImport(port), a = unwrap(await c.prepare(raw)); unwrap(await c.confirm(a.ticket));
      const before = unwrap(await port.loadWorkspace()), b = unwrap(await c.prepare(raw));
      assert(b.skippedPlanIds.length === 1, 'Không skip'); unwrap(await c.confirm(b.ticket));
      equal(unwrap(await port.loadWorkspace()), before, 'Skip vẫn ghi');
      const original = source.file.workspace.plans[0], p = unwrap(await c.prepare(raw, { planActions: { [original.id]: 'copy' } }));
      const disk = unwrap(await c.confirm(p.ticket)), copy = disk.plans[1];
      assert(disk.plans.length === 2 && copy.id !== original.id, 'Copy không đổi plan ID');
      assert(copy.current.tasks[0].id !== original.current.tasks[0].id, 'Copy không đổi task ID');
      assert(copy.current.tasks[0].completionId === copy.completions[0].id && copy.completions[0].taskId === copy.current.tasks[0].id, 'Copy sai quan hệ');
    });
    await test('Cancel không ghi và ticket hết hiệu lực', async port => {
      const before = unwrap(await port.loadWorkspace()), c = makeImport(port), p = unwrap(await c.prepare(raw));
      unwrap(c.cancel(p.ticket)); assert(!(await c.confirm(p.ticket)).ok, 'Ticket hủy còn dùng được');
      equal(unwrap(await port.loadWorkspace()), before, 'Cancel đã ghi');
    });
    await test('Conflict writer khác giữ candidate và dữ liệu disk', async port => {
      const c = makeImport(port), p = unwrap(await c.prepare(raw)), candidate = c.getProposal(), other = unwrap(await port.loadWorkspace());
      other.profile.displayName = 'Writer khác'; const committed = unwrap(await port.saveWorkspace(other, other.revision));
      const result = await c.confirm(p.ticket); assert(!result.ok && result.code === 'conflict', 'Không conflict');
      equal(c.getProposal(), candidate, 'Mất candidate'); equal(unwrap(await port.loadWorkspace()), committed, 'Ghi đè writer khác');
    });
    await test('Save failure injected giữ bản copy; retry native giữ IDs', async port => {
      let reject = true;
      const wrapper: WorkspacePersistence = { loadWorkspace: () => port.loadWorkspace(), saveWorkspace: (w, revision) => reject
        ? Promise.resolve<OperationResult<Workspace>>({ ok: false, code: 'storage', issues: [{ code: 'QA_INJECTED', field: 'workspace', message: 'Injected, không phải quota native' }] }) : port.saveWorkspace(w, revision) };
      const c = makeImport(wrapper), p = unwrap(await c.prepare(raw, { planActions: { [source.file.workspace.plans[0].id]: 'copy' } })), candidate = c.getProposal();
      assert(!(await c.confirm(p.ticket)).ok, 'Không báo lỗi'); equal(c.getProposal(), candidate, 'Mất candidate');
      assert(unwrap(await port.loadWorkspace()).revision === 0, 'Lỗi vẫn ghi'); reject = false;
      const saved = unwrap(await c.confirm(p.ticket)); assert(saved.plans[0].id === candidate!.plans[0].id, 'Retry đổi IDs');
    });
    await test('JSON lỗi/version tương lai không ghi defaults', async port => {
      const before = unwrap(await port.loadWorkspace()), c = makeImport(port);
      assert(!(await c.prepare('{bad')).ok, 'Nhận JSON lỗi');
      const future = JSON.parse(raw); future.formatVersion = 99;
      const result = await c.prepare(JSON.stringify(future)); assert(!result.ok && result.code === 'unsupported_version', 'Nhận future version');
      equal(unwrap(await port.loadWorkspace()), before, 'File lỗi vẫn ghi');
    });
    await test('Export candidate chưa confirm giữ nội dung, không ghi', async port => {
      const c = makeImport(port), p = unwrap(await c.prepare(raw));
      const exported = unwrap(exportBackup(c.getProposal(), { exportedAt: context().now, unsaved: true }, validators));
      assert(exported.containsUnsavedChanges, 'Thiếu nhãn chưa lưu'); equal(exported.file.workspace, p.candidate, 'Xuất nhầm snapshot');
      assert(unwrap(await port.loadWorkspace()).plans.length === 0, 'Export đã ghi'); unwrap(c.cancel(p.ticket));
    });
    log(`${pass} PASS / ${fail} FAIL — native backup/import; lỗi save là injection.`);
    log('Chưa nghiệm thu hai tab thật, semantic, quota/abort native và UI app chính. Giữ DB QA; không đọc/xóa DB thật.');
  } finally { button.disabled = false; }
});
const fileResult = document.querySelector<HTMLPreElement>('#file-result')!;
document.querySelector<HTMLButtonElement>('#download')!.addEventListener('click', async () => {
  try {
    const example = await sample(), url = URL.createObjectURL(new Blob([example.json], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'majorweave-QA-unsaved-backup.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    fileResult.textContent = 'Đã yêu cầu trình duyệt tải backup QA mẫu chứa bản chưa lưu. Chọn lại file để kiểm tra.';
  } catch (error) { fileResult.textContent = String(error); }
});
document.querySelector<HTMLButtonElement>('#inspect')!.addEventListener('click', async () => {
  const file = document.querySelector<HTMLInputElement>('#file')!.files?.[0];
  if (!file) { fileResult.textContent = 'Cần chọn file.'; return; }
  try {
    const parsed = parseBackup(await file.text(), validators);
    fileResult.textContent = parsed.ok ? `File hợp lệ (validator cấu trúc): ${parsed.value.workspace.plans.length} plan. Chỉ kiểm tra; chưa ghi DB.` : JSON.stringify(parsed, null, 2);
  } catch (error) { fileResult.textContent = `Không đọc được file: ${String(error)}`; }
});
