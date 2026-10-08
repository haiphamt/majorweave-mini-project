import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { build } from 'esbuild';

// Kiểm tra nội dung đã đăng ký và các ranh giới code thực sự có trong repo.
const output = await build({ entryPoints: ['src/content/index.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { contentPacks } = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
const unique = (items, label) => {
  const result = new Map();
  for (const item of items) {
    assert.ok(typeof item.id === 'string' && item.id.trim(), `${label}: missing ID`);
    assert.ok(!result.has(item.id), `${label}: duplicate ${item.id}`);
    result.set(item.id, item);
  }
  return result;
};
const stages = unique(contentPacks.flatMap(p => p.stages), 'stage');
const resources = unique(contentPacks.flatMap(p => p.resources), 'resource');
const credentials = unique(contentPacks.flatMap(p => p.credentials), 'credential');
unique(contentPacks.flatMap(p => p.tracks), 'track');
unique(contentPacks.map(p => ({ id: p.pathId })), 'path');
unique([...stages.values()].flatMap(s => s.work), 'work');
for (const resource of resources.values()) {
  assert.equal(new URL(resource.url).protocol, 'https:', resource.id);
  assert.ok(['vi', 'en'].includes(resource.language), resource.id);
  assert.ok(['article', 'video', 'course', 'exercise', 'lab'].includes(resource.format), resource.id);
  assert.ok(['free', 'mixed', 'paid', 'unknown'].includes(resource.cost), resource.id);
}
for (const credential of credentials.values()) {
  assert.equal(new URL(credential.url).protocol, 'https:', credential.id);
  assert.ok(['course_certificate', 'program_certificate', 'exam_certificate', 'skill_assessment'].includes(credential.kind), credential.id);
  assert.ok(['free', 'paid', 'unknown'].includes(credential.cost), credential.id);
}
const visited = new Set(), visiting = new Set();
function visitStage(id) {
  assert.ok(stages.has(id), `Missing stage ${id}`);
  assert.ok(!visiting.has(id), `Prerequisite cycle at ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  stages.get(id).prerequisiteIds.forEach(visitStage);
  visiting.delete(id); visited.add(id);
}
for (const stage of stages.values()) {
  visitStage(stage.id);
  assert.ok(stage.outcome.trim() && stage.resourceIds.length && stage.work.length, stage.id);
  assert.ok(stage.resourceIds.includes(stage.defaultResourceId), `${stage.id}: default source outside stage`);
  assert.equal(new Set(stage.resourceIds).size, stage.resourceIds.length, stage.id);
  stage.resourceIds.forEach(id => assert.ok(resources.has(id), `${stage.id}: missing source ${id}`));
  for (const work of stage.work) {
    assert.ok(Number.isInteger(work.minutes) && work.minutes > 0, work.id);
    assert.ok(Number.isInteger(work.revision) && work.revision > 0, work.id);
    assert.ok(work.title.trim() && work.acceptance.length && work.acceptance.every(text => text.trim()), work.id);
  }
}
for (const pack of contentPacks) {
  assert.equal(pack.schemaVersion, 1, pack.pathId);
  assert.ok(['draft', 'review', 'ready'].includes(pack.reviewStatus), pack.pathId);
  assert.ok(pack.contentVersion && pack.tracks.length, pack.pathId);
  for (const track of pack.tracks) {
    assert.equal(track.pathId, pack.pathId, track.id);
    assert.ok(track.stageIds.length && track.portfolio.acceptance.length && track.roadmapLinks.length, track.id);
    const seen = new Set();
    for (const id of track.stageIds) {
      assert.ok(stages.has(id) && !seen.has(id), `${track.id}: missing or repeated ${id}`);
      stages.get(id).prerequisiteIds.forEach(p => assert.ok(seen.has(p), `${track.id}: prerequisite ${p} must precede ${id}`));
      seen.add(id);
    }
    assert.equal(new Set(track.credentialIds).size, track.credentialIds.length, track.id);
    track.credentialIds.forEach(id => assert.ok(credentials.has(id), `${track.id}: missing credential ${id}`));
    track.roadmapLinks.forEach(link => assert.equal(new URL(link.url).protocol, 'https:', track.id));
  }
}

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = `${dir}/${entry.name}`;
    if (file === 'src/prototype') return []; // Bản lịch sử, không phải nền của app chính.
    return entry.isDirectory() ? filesIn(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
}
const graph = new Map();
for (const file of filesIn('src')) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const dependencies = [];
  function checkNode(node) {
    if (ts.isIdentifier(node)) {
      if (file.startsWith('src/features/')) assert.ok(!['localStorage', 'sessionStorage', 'indexedDB'].includes(node.text), `${file}: storage belongs in persistence`);
      if (file.startsWith('src/domain/')) assert.ok(!['window', 'document', 'localStorage', 'sessionStorage', 'indexedDB'].includes(node.text), `${file}: domain must be independent of browser`);
    }
    ts.forEachChild(node, checkNode);
  }
  checkNode(source);
  for (const node of source.statements) {
    if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) continue;
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const specifier = node.moduleSpecifier.text;
    if (file.startsWith('src/domain/') || file.startsWith('src/content/')) {
      assert.ok(!/^(react|react-dom|react-router-dom)(\/|$)/.test(specifier), `${file}: React not allowed here`);
    }
    if (!specifier.startsWith('.')) continue;
    const base = path.resolve(path.dirname(file), specifier);
    const target = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    assert.ok(target, `${file}: unresolved ${specifier}`);
    const relative = path.relative(process.cwd(), target).replaceAll('\\', '/');
    assert.ok(!relative.startsWith('src/prototype/'), `${file}: main app cannot import historical prototype`);
    if (relative.endsWith('.css')) assert.equal(file, 'src/main.tsx', `${file}: global CSS must be loaded at the entry point`);
    if (file.startsWith('src/features/') && relative.startsWith('src/features/')) {
      assert.equal(file.split('/')[2], relative.split('/')[2], `${file}: use shared components/context, not another feature`);
    }
    if (file.startsWith('src/domain/')) assert.ok(!/^src\/(app|features|components|persistence|content)\//.test(relative), `${file}: domain must not depend on UI/storage/content implementation`);
    if (file.startsWith('src/content/')) assert.ok(!/^src\/(app|features|components|persistence)\//.test(relative), `${file}: content must not depend on UI/storage`);
    if (!node.isTypeOnly && !node.importClause?.isTypeOnly && /\.tsx?$/.test(relative)) dependencies.push(relative);
  }
  graph.set(file, dependencies);
}
const done = new Set(), active = new Set();
function visitModule(file) {
  if (!graph.has(file) || done.has(file)) return;
  assert.ok(!active.has(file), `Circular module import at ${file}`);
  active.add(file); graph.get(file).forEach(visitModule); active.delete(file); done.add(file);
}
for (const file of graph.keys()) visitModule(file);
console.log(`PASS: ${contentPacks.length} registered content pack(s), ${graph.size} modules; content references, prerequisites, storage/CSS boundaries and import cycles checked.`);
const legacyBundle = await build({ entryPoints: ['src/persistence/legacy.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { saveLegacyState } = await import(`data:text/javascript;base64,${Buffer.from(legacyBundle.outputFiles[0].text).toString('base64')}`);
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
try {
  const sample = { version: 1, goal: 'Storage check', tasks: [] };
  let saved;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem: (key, value) => { saved = { key, value }; } } });
  assert.equal(saveLegacyState(sample), true);
  assert.deepEqual(saved, { key: 'majorweave.prototype.v1', value: JSON.stringify(sample) });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem: () => { throw new Error('Simulated quota failure'); } } });
  assert.equal(saveLegacyState(sample), false, 'Storage failure must not report success');
  assert.deepEqual(sample, { version: 1, goal: 'Storage check', tasks: [] });
} finally {
  if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
  else delete globalThis.localStorage;
}
console.log('PASS: legacy save uses the existing key and returns failure without mutating input when storage throws.');
await import('../docs/architecture/check-example.mjs'); // Kiểm tra giữ nguồn/nhánh và legacy maps của Backend.
await import('./tasks/MW-CONTEXT-V2.mjs'); // Context/callback regressions also run in CI.

await import('./tasks/MW-TEAM-01.mjs'); // Own resolver/content regressions must run in CI.
