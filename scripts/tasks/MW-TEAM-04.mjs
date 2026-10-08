import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

// The task modules only import types. Transpile with the existing TypeScript
// dependency, without generated files, a second registry, or a test framework.
async function load(file) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`);
}
const { validateWorkspace, validateBackupFile, validateProfile } = await load('src/domain/validate.ts');
const { summarizeActivity } = await load('src/domain/activity.ts');
const packs = [];
for (const name of ['analyst', 'bi', 'engineer', 'business-analyst']) {
  const exports = await load(`src/content/paths/${name}.ts`);
  packs.push(Object.values(exports)[0]);
}
const tests = [];
function test(name, run) { run(); tests.push(name); console.log(`PASS ${name}`); }
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const now = '2026-10-07T00:00:00Z';
const clone = value => structuredClone(value);
function freeze(value) {
  if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze); }
  return value;
}
function fixture() {
  return {
    schemaVersion: 2, revision: 0,
    profile: { displayName: 'Người học thử', majorId: 'is', timeZone: 'Asia/Ho_Chi_Minh' },
    preferences: { resourceLanguage: 'all', preferFree: true }, activePlanId: uid(1),
    plans: [{ id: uid(1), name: 'Kế hoạch thử', pathId: 'analyst', trackId: 'analyst.spreadsheet', contentVersion: 'old', createdAt: now, status: 'active',
      current: { id: uid(2), createdAt: now, trackId: 'analyst.spreadsheet', contentVersion: 'old', selectedStageIds: ['data.quality'], knownStageIds: [], resourceByStage: { 'data.quality': 'resource.data-quality' }, goal: 'Thử', hoursPerWeek: 2, startDate: '2026-10-05', closedWeeks: [],
        tasks: [{ id: uid(3), stageId: 'data.quality', workId: 'data.quality.dictionary', workRevision: 1, segment: { fromMinute: 0, toMinute: 60 }, title: 'Bài thử', minutes: 60, acceptance: ['Kiểm tra dữ liệu'], source: { id: 'resource.data-quality', title: 'Dữ liệu', provider: 'Nguồn thử', url: 'https://example.org/data' }, weekIndex: 0, dayIndex: null, status: 'done', customized: false, completionId: uid(4), notes: '' }] },
      history: [], completions: [{ id: uid(4), taskId: uid(3), completedAt: now, localDate: '2026-10-07', timeZone: 'Asia/Ho_Chi_Minh', estimatedMinutes: 60, revertedAt: null }],
    }], drafts: {}, savedCredentialIds: [], imports: [],
  };
}
function valid(value, options) { const result = validateWorkspace(value, options); assert.equal(result.ok, true, JSON.stringify(result)); return result.value; }
function invalid(mutate, field, code) {
  const value = fixture(); mutate(value);
  const before = clone(value), result = validateWorkspace(value);
  assert.equal(result.ok, false, `Accepted invalid ${field}`);
  assert.ok(result.issues.some(i => i.field.includes(field) && (!code || i.code === code)), JSON.stringify(result));
  assert.deepEqual(value, before, 'Invalid input was mutated');
}
test('TC-V01 malformed unknown and sparse arrays', () => {
  for (const value of [null, undefined, [], 1, 'x', true, {}, new Date()]) {
    assert.equal(validateWorkspace(value).ok, false); assert.equal(validateBackupFile(value).ok, false);
  }
  invalid(v => { v.plans = Array(1); }, 'plans[0]');
  valid(fixture());
});
test('TC-V02 schema and backup versions', () => {
  const v = fixture(); v.schemaVersion = 3; assert.equal(validateWorkspace(v).code, 'unsupported_version');
  assert.equal(validateBackupFile({ format: 'majorweave-backup', formatVersion: 2, exportedAt: now, workspace: fixture() }).code, 'unsupported_version');
});
test('TC-V03 types, enums and numeric boundaries', () => {
  for (const hours of [1, 21, 2.5, NaN, Infinity, '2']) invalid(v => { v.plans[0].current.hoursPerWeek = hours; }, 'hoursPerWeek');
  for (const hours of [2, 20]) { const v = fixture(); v.plans[0].current.hoursPerWeek = hours; valid(v); }
  invalid(v => { v.revision = -1; }, 'revision');
  invalid(v => { v.preferences.preferFree = 'true'; }, 'preferFree');
  invalid(v => { v.plans[0].status = 'deleted'; }, 'status');
  invalid(v => { v.plans[0].current.tasks[0].minutes = 0; }, 'minutes');
  invalid(v => { v.plans[0].current.tasks[0].dayIndex = 7; }, 'dayIndex');
});
test('TC-V04 real dates, Monday, timezone and localDate', () => {
  for (const date of ['2026-02-29', '2026-04-31', '2026-10-06']) invalid(v => { v.plans[0].current.startDate = date; }, 'startDate');
  const leap = fixture(); leap.plans[0].current.startDate = '2016-02-29'; valid(leap);
  for (const time of ['2026-10-07T00:00:00', '2026-02-30T00:00:00Z', '2026-10-07T24:00:00Z', '2026-10-07T00:00:00+99:00']) invalid(v => { v.plans[0].createdAt = time; }, 'createdAt');
  invalid(v => { v.profile.timeZone = 'Not/AZone'; }, 'timeZone');
  invalid(v => { v.plans[0].completions[0].localDate = '2026-10-06'; }, 'localDate');
  invalid(v => { v.plans[0].completions[0].completedAt = null; }, 'completions[0]');
  invalid(v => { v.plans[0].completions[0].revertedAt = '2026-10-06T00:00:00Z'; }, 'revertedAt');
});
test('TC-V05 UUID uniqueness and active plan', () => {
  invalid(v => { v.plans[0].id = 'not-uuid'; }, '.id');
  invalid(v => { v.activePlanId = uid(99); }, 'activePlanId');
  invalid(v => { v.plans.push(clone(v.plans[0])); }, 'plans');
  invalid(v => { v.plans[0].current.tasks.push(clone(v.plans[0].current.tasks[0])); }, 'tasks');
  invalid(v => { v.plans[0].completions.push(clone(v.plans[0].completions[0])); }, 'completions');
  invalid(v => { v.plans[0].current.id = v.plans[0].id; }, 'current.id');
});
test('TC-V06 safe source URLs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'file:///tmp/x', '/relative', 'https://user:pass@example.org']) invalid(v => { v.plans[0].current.tasks[0].source.url = url; }, 'source.url');
  for (const url of ['https://example.org/path', 'http://localhost:8000/lesson']) { const v = fixture(); v.plans[0].current.tasks[0].source.url = url; valid(v); }
});
test('TC-V07 current task and ledger relations', () => {
  invalid(v => { v.plans[0].current.tasks[0].status = 'todo'; v.plans[0].current.tasks[0].completionId = null; }, 'completionId');
  invalid(v => { v.plans[0].current.tasks[0].completionId = null; }, 'completionId');
  invalid(v => { v.plans[0].current.tasks[0].status = 'todo'; }, 'completionId');
  invalid(v => { v.plans[0].completions[0].taskId = uid(99); }, 'taskId');
  invalid(v => { v.plans[0].completions[0].revertedAt = now; }, 'completionId');
  invalid(v => { v.plans[0].completions.push({ ...v.plans[0].completions[0], id: uid(9) }); }, 'completions[1]');
});
function historyFixture() {
  const v = fixture(), p = v.plans[0];
  p.current.closedWeeks = [{ weekIndex: 0, closedAt: '2026-10-08T00:00:00Z', tasks: clone(p.current.tasks), total: 1, done: 1, estimatedCompletedMinutes: 60 }];
  p.history = [clone(p.current)];
  p.current = { ...clone(p.current), id: uid(5), createdAt: '2026-10-09T00:00:00Z', closedWeeks: [] };
  p.current.tasks[0].status = 'todo'; p.current.tasks[0].completionId = null;
  p.completions[0].revertedAt = '2026-10-10T00:00:00Z';
  return v;
}
test('TC-V08 immutable historical done survives later undo', () => {
  const v = historyFixture(); valid(v);
  v.plans[0].completions[0].revertedAt = '2026-10-07T01:00:00Z';
  assert.equal(validateWorkspace(v).ok, false, 'Undo before snapshot must fail');
});
test('TC-V09 closed week totals and duplicate indices', () => {
  for (const field of ['total', 'done', 'estimatedCompletedMinutes']) {
    const v = historyFixture(); v.plans[0].history[0].closedWeeks[0][field]++;
    const result = validateWorkspace(v); assert.equal(result.ok, false); assert.ok(result.issues.some(i => i.field.endsWith(field)));
  }
  const v = historyFixture(); v.plans[0].history[0].closedWeeks.push(clone(v.plans[0].history[0].closedWeeks[0]));
  assert.equal(validateWorkspace(v).ok, false);
});
test('TC-V10 generation, segment, backlog and import relations', () => {
  invalid(v => { v.plans[0].current.trackId = 'analyst.pandas'; }, 'current');
  invalid(v => { v.plans[0].current.contentVersion = 'different'; }, 'current');
  invalid(v => { v.plans[0].current.tasks[0].segment.toMinute = 59; }, 'segment');
  invalid(v => { v.plans[0].current.tasks[0].workRevision = null; }, 'workRevision');
  invalid(v => { v.plans[0].current.tasks[0].weekIndex = null; v.plans[0].current.tasks[0].dayIndex = 1; }, 'dayIndex');
  invalid(v => { v.imports = [{ fingerprint: 'fixture', importedAt: now, planIds: [uid(999)] }]; }, 'planIds');
});
test('TC-V11 removed catalog preserves plan/history and draft', () => {
  const v = historyFixture(); v.drafts['retired.track'] = { ...clone(v.plans[0].current), trackId: 'retired.track' };
  const before = clone(v); valid(freeze(v), { contentPacks: [] }); assert.deepEqual(v, before);
});
test('TC-V12 backup round trip, frozen data and known catalog errors', () => {
  const backup = { format: 'majorweave-backup', formatVersion: 1, exportedAt: now, workspace: fixture() };
  assert.deepEqual(validateBackupFile(freeze(JSON.parse(JSON.stringify(backup)))).value, backup);
  const v = fixture(); v.drafts['analyst.spreadsheet'] = clone(v.plans[0].current);
  valid(v, { contentPacks: packs });
  v.drafts['analyst.spreadsheet'].resourceByStage['data.quality'] = 'resource.bi-dax';
  assert.equal(validateWorkspace(v, { contentPacks: packs }).ok, false);
  v.drafts['analyst.spreadsheet'].resourceByStage = {}; v.drafts['analyst.spreadsheet'].selectedStageIds = ['data.sql'];
  assert.equal(validateWorkspace(v, { contentPacks: packs }).ok, false);
});
test('TC-A01 empty activity', () => assert.deepEqual(summarizeActivity([]), { days: [], completedTasks: 0, estimatedMinutes: 0, undatedTasks: 0, undatedEstimatedMinutes: 0 }));
test('TC-A02 archived and repeated snapshots count ledger once', () => {
  const v = fixture(), p = v.plans[0]; p.history = [clone(p.current)];
  const archived = clone(p); archived.id = uid(10); archived.status = 'archived';
  const result = summarizeActivity([p, archived]); assert.equal(result.completedTasks, 2); assert.equal(result.estimatedMinutes, 120);
});
test('TC-A03 done undo done again', () => {
  const p = fixture().plans[0]; p.completions[0].revertedAt = now;
  assert.equal(summarizeActivity([p]).completedTasks, 0);
  p.completions.push({ ...p.completions[0], id: uid(9), revertedAt: null });
  assert.equal(summarizeActivity([p]).completedTasks, 1);
});
test('TC-A04 legacy completion has no fabricated date', () => {
  const v = fixture(); Object.assign(v.plans[0].completions[0], { completedAt: null, localDate: null, timeZone: null }); valid(v);
  const result = summarizeActivity(v.plans); assert.equal(result.days.length, 0); assert.equal(result.undatedTasks, 1); assert.equal(result.undatedEstimatedMinutes, 60);
});
test('TC-A05 original timezone survives profile change', () => {
  const v = fixture(); Object.assign(v.plans[0].completions[0], { localDate: '2026-10-06', timeZone: 'America/Los_Angeles' }); valid(v);
  const before = summarizeActivity(v.plans); v.profile.timeZone = 'Pacific/Auckland'; valid(v);
  assert.deepEqual(summarizeActivity(v.plans), before); assert.equal(before.days[0].date, '2026-10-06');
});
test('TC-A06 no input mutation and sorted days', () => {
  const p = fixture().plans[0]; p.completions.push({ ...p.completions[0], id: uid(8), localDate: '2026-10-05' });
  const before = clone(p); const result = summarizeActivity(freeze([p])); assert.deepEqual(p, before);
  assert.deepEqual(result.days.map(d => d.date), ['2026-10-05', '2026-10-07']);
});
test('TC-P02 profile validation and empty name policy', () => {
  const profile = fixture().profile;
  assert.equal(validateProfile({ ...profile, displayName: '' }, ['is']).ok, true);
  assert.equal(validateProfile({ ...profile, majorId: null }, ['is']).ok, true);
  assert.equal(validateProfile({ ...profile, displayName: 'x'.repeat(61) }).ok, false);
  assert.equal(validateProfile({ ...profile, majorId: 'unknown' }, ['is']).ok, false);
  assert.equal(validateProfile({ ...profile, timeZone: 'Mars/Zone' }).ok, false);
});

const unique = (values, label) => { const map = new Map(); for (const value of values) { assert.ok(!map.has(value.id), `${label} duplicate ${value.id}`); map.set(value.id, value); } return map; };
const bundled = await build({ entryPoints: ['src/content/paths/backend.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { backendPack } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const allPacks = [backendPack, ...packs];
const stages = unique(allPacks.flatMap(p => p.stages), 'stage');
const resources = unique(allPacks.flatMap(p => p.resources), 'resource');
const credentials = unique(packs.flatMap(p => p.credentials), 'credential');
const tracks = unique(packs.flatMap(p => p.tracks), 'track');
unique([...stages.values()].flatMap(s => s.work), 'work');
const expected = ['analyst.spreadsheet', 'analyst.pandas', 'bi.powerbi', 'bi.tableau', 'engineer.batch', 'engineer.streaming', 'business-analyst.software-ba', 'business-analyst.data-ba'];
assert.deepEqual([...tracks.keys()], expected);
for (const [index, id] of expected.entries()) test(`TC-C0${index + 1} ${id} content/dependencies`, () => {
  const t = tracks.get(id), seen = new Set();
  assert.ok(t.stageIds.length >= 5 && t.portfolio.acceptance.length >= 3 && t.portfolio.title);
  for (const sid of t.stageIds) {
    const s = stages.get(sid); assert.ok(s, `Missing ${sid}`); assert.ok(!seen.has(sid));
    for (const prerequisite of s.prerequisiteIds) assert.ok(seen.has(prerequisite), `${id}: prerequisite ${prerequisite}`);
    seen.add(sid); assert.ok(s.resourceIds.includes(s.defaultResourceId));
    for (const rid of s.resourceIds) assert.ok(resources.has(rid), `${sid}: ${rid}`);
    assert.ok(s.description && s.outcome && s.work.length);
    for (const work of s.work) {
      assert.ok(Number.isInteger(work.minutes) && work.minutes > 0 && work.minutes <= 120);
      assert.ok(work.revision > 0 && work.acceptance.length >= (sid === 'language.python' ? 1 : 2) && work.acceptance.every(a => a.trim()));
      assert.ok(!/placeholder|TODO|chưa biên soạn/i.test(JSON.stringify(work)));
    }
  }
  for (const cid of t.credentialIds) assert.ok(credentials.has(cid));
  for (const link of t.roadmapLinks) assert.equal(new URL(link.url).protocol, 'https:');
});
test('Content metadata and track-specific coverage', () => {
  for (const p of packs) assert.equal(p.reviewStatus, 'review');
  for (const source of [...packs.flatMap(p => p.resources), ...credentials.values()]) {
    assert.equal(new URL(source.url).protocol, 'https:'); assert.equal(source.checkedAt, '2026-10-07'); assert.ok(source.provider);
    assert.ok(source.accessNote || (source.prerequisites && source.requirements));
  }
  assert.equal(new Set([...resources.values()].map(r => r.url)).size, resources.size, 'Repeated URL definitions');
  assert.ok(tracks.get('engineer.batch').stageIds.every(id => tracks.get('engineer.streaming').stageIds.includes(id)));
  assert.ok(!tracks.get('business-analyst.software-ba').stageIds.some(id => /python|sql|dsa|os-linux/.test(id)));
});
const report = { executedAt: new Date().toISOString(), baseline: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), node: process.version, passed: tests.length, tests,
  content: { tracks: tracks.size, stages: packs.flatMap(p => p.stages).length, work: packs.flatMap(p => p.stages).reduce((n, s) => n + s.work.length, 0), resources: packs.flatMap(p => p.resources).length, credentials: credentials.size, reusedStages: ['language.python'] },
  limitation: 'Pure module/content tests only; no claim about registry, planner, persistence or v2 UI integration.' };
fs.mkdirSync('docs/tasks/MW-TEAM-04/evidence', { recursive: true });
fs.writeFileSync('docs/tasks/MW-TEAM-04/evidence/unit-content.json', JSON.stringify(report, null, 2) + '\n');
console.log(`PASS ${tests.length} groups; ${tracks.size} tracks, ${report.content.stages} owned stages, ${report.content.work} exercises. V2 integration is not tested.`);

if (process.argv.includes('--ui')) {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.MAJORWEAVE_PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [], pageErrors = [];
  const check = (name, condition) => { assert.ok(condition, name); checks.push(name); console.log(`PASS UI ${name}`); };
  try {
    // A fresh incognito context; never open or clear the learner's existing profile.
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', e => pageErrors.push(e.message));
    await page.goto(process.env.MAJORWEAVE_APP_URL || 'http://127.0.0.1:5173/#/profile', { waitUntil: 'domcontentloaded' });
    const name = page.getByLabel('Tên hiển thị', { exact: true });
    const major = page.getByLabel('Ngành đang theo học', { exact: true });
    await name.waitFor();
    const initialName = await name.inputValue(), initialMajor = await major.inputValue();
    await name.fill('Chưa lưu'); await major.selectOption('data');
    await page.getByRole('button', { name: 'Hủy thay đổi', exact: true }).focus();
    await page.keyboard.press('Enter');
    check('TC-P03 keyboard cancel restores name and major', await name.inputValue() === initialName && await major.inputValue() === initialMajor);
    await name.fill('  Hiếu kiểm thử  '); await major.selectOption('is');
    await page.getByRole('button', { name: 'Lưu hồ sơ', exact: true }).click();
    await page.locator('.toast.visible').filter({ hasText: 'Đã cập nhật hồ sơ' }).waitFor();
    check('TC-P01 no premature persistence success toast', !(await page.locator('.toast').innerText()).includes('Đã lưu'));
    await page.reload({ waitUntil: 'domcontentloaded' }); await name.waitFor();
    check('TC-P01 trimmed name and major survive reload', await name.inputValue() === 'Hiếu kiểm thử' && await major.inputValue() === 'is');
    await page.getByRole('link', { name: /Explore Khám phá hướng học/ }).click();
    await page.getByLabel('Khám phá theo khoa').selectOption('ce');
    await page.getByRole('link', { name: /Profile Hồ sơ/ }).click();
    check('TC-P05 legacy browsing filter does not change profile major', await major.inputValue() === 'is');
    await name.fill(''); await page.getByRole('button', { name: 'Lưu hồ sơ', exact: true }).click();
    await page.reload({ waitUntil: 'domcontentloaded' }); await name.waitFor();
    check('TC-P01 empty name uses fallback', await name.inputValue() === '' && (await page.locator('.heading-tag').innerText()).includes('Người học'));
    check('TC-P06 empty activity and sidebar retained', await page.locator('button.activity-cell[data-date]').count() === 84 && await page.locator('.sidebar').isVisible());
    await page.locator('button.activity-cell.selected').focus();
    const selectedDate = await page.locator('button.activity-cell.selected').getAttribute('data-date');
    await page.keyboard.press('ArrowLeft');
    check('TC-P06 activity keyboard navigation', await page.locator('button.activity-cell.selected').getAttribute('data-date') !== selectedDate);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'docs/tasks/MW-TEAM-04/evidence/profile-desktop.png', fullPage: true });
    await page.getByRole('link', { name: 'Mở My Plan', exact: true }).click();
    await page.getByRole('link', { name: 'Tạo kế hoạch đầu tiên' }).waitFor();
    check('TC-P06 open empty plan', page.url().endsWith('#/plan'));
    await page.getByRole('link', { name: /Profile Hồ sơ/ }).click();
    await name.waitFor();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      check(`TC-P06 mobile ${width}px without horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      check(`TC-P06 mobile ${width}px actions visible`, await page.getByRole('button', { name: 'Hủy thay đổi', exact: true }).isVisible() && await page.getByRole('button', { name: 'Lưu hồ sơ', exact: true }).isVisible());
    }
    await page.screenshot({ path: 'docs/tasks/MW-TEAM-04/evidence/profile-mobile.png', fullPage: true });
    // Simulate a real v1 quota failure only in another isolated browser context.
    const failing = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await failing.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Fixture quota', 'QuotaExceededError'); }; });
    const failedPage = await failing.newPage();
    await failedPage.goto('http://127.0.0.1:5173/#/profile', { waitUntil: 'domcontentloaded' });
    await failedPage.getByLabel('Tên hiển thị', { exact: true }).fill('Bản chưa lưu');
    await failedPage.getByRole('button', { name: 'Lưu hồ sơ', exact: true }).click();
    await failedPage.locator('.save-state').filter({ hasText: 'Chưa lưu được' }).waitFor();
    check('TC-P04 v1 quota failure keeps unsaved state without success claim', await failedPage.getByLabel('Tên hiển thị', { exact: true }).inputValue() === 'Bản chưa lưu' && !(await failedPage.locator('.toast').innerText()).includes('Đã lưu'));
    await failedPage.screenshot({ path: 'docs/tasks/MW-TEAM-04/evidence/profile-save-error.png', fullPage: true });
    check('No page errors', pageErrors.length === 0);
    fs.writeFileSync('docs/tasks/MW-TEAM-04/evidence/profile-ui.json', JSON.stringify({ executedAt: new Date().toISOString(), browser: await browser.version(), passed: checks.length, checks, pageErrors, scope: 'Actual v1 Profile only; v2 callbacks, timezone and backup remain unintegrated.' }, null, 2) + '\n');
  } finally { await browser.close(); }
}
