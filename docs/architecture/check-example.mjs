// Kiểm tra hợp đồng và việc chuyển dữ liệu, không xác nhận chất lượng khóa học hoặc OAuth.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const output = await build({entryPoints:['docs/architecture/backend.example.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {backendExample: pack, legacyStageMap, legacyWorkMap} = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
const unique = items => { assert.equal(new Set(items.map(x=>x.id)).size,items.length,'Duplicate IDs'); return new Map(items.map(x=>[x.id,x])); };
const stages = unique(pack.stages), resources = unique(pack.resources), credentials = unique(pack.credentials);
unique(pack.tracks);
assert.equal(pack.reviewStatus,'review');
assert.deepEqual(pack.tracks.map(t=>t.id),['backend.node','backend.python','backend.java']);
for (const r of [...pack.resources,...pack.credentials]) {
  assert.equal(new URL(r.url).protocol,'https:');
  assert.equal(r.checkedAt,'2026-10-03'); // Ngày kế thừa, không phải kiểm tra web hôm nay.
}
for (const r of pack.resources) {
  assert.ok(['vi','en'].includes(r.language),r.id);
  assert.ok(['article','video','course','exercise','lab'].includes(r.format),r.id);
  assert.ok(['free','mixed','paid','unknown'].includes(r.cost),r.id);
}
for (const c of pack.credentials) {
  assert.ok(['course_certificate','program_certificate','exam_certificate','skill_assessment'].includes(c.kind),c.id);
  assert.ok(['free','paid','unknown'].includes(c.cost),c.id);
}
const visited = new Set(), visiting = new Set();
function visit(id) {
  assert.ok(stages.has(id),`Missing stage ${id}`);
  assert.ok(!visiting.has(id),`Prerequisite cycle at ${id}`);
  if (visited.has(id)) return;
  visiting.add(id); stages.get(id).prerequisiteIds.forEach(visit); visiting.delete(id); visited.add(id);
}
pack.stages.forEach(s=>visit(s.id));
unique(pack.stages.flatMap(s=>s.work));
for (const s of pack.stages) {
  assert.ok(s.resourceIds.length && s.work.length && s.outcome,s.id);
  assert.ok(s.resourceIds.includes(s.defaultResourceId),`${s.id}: default not applicable`);
  s.resourceIds.forEach(id=>assert.ok(resources.has(id),id));
  s.work.forEach(w=>assert.ok(Number.isInteger(w.minutes) && w.minutes>0 && w.revision>0 && w.acceptance.length,w.id));
}
for (const track of pack.tracks) {
  const seen = new Set();
  assert.equal(track.stageIds.length,15);
  for (const id of track.stageIds) {
    const s=stages.get(id); assert.ok(s,id);
    s.prerequisiteIds.forEach(p=>assert.ok(seen.has(p),`${track.id}: ${p} must precede ${id}`)); seen.add(id);
  }
  track.credentialIds.forEach(id=>assert.ok(credentials.has(id),id));
  assert.equal(new Set(track.credentialIds).size,track.credentialIds.length);
  const branch=track.id.split('.')[1];
  assert.equal(Object.keys(legacyStageMap[branch]).length,15);
  assert.ok(Object.keys(legacyWorkMap[branch]).length>15);
  const oop=stages.get(`backend.${branch}.oop`);
  assert.ok(oop.resourceIds.includes(`resource.${branch==='node'?'oop-js':branch==='python'?'python-oop':'java-mooc'}`));
}
console.log(`PASS: 3 Backend tracks, 15 stages/track; ${pack.stages.length} shared/contextual stages, ${pack.resources.length} resources, ${pack.credentials.length} credential goals; prerequisites, source applicability and legacy maps checked.`);
