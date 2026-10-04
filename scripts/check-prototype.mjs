// Data integrity for the review fixtures. This does not certify curriculum quality.
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const output = await build({ entryPoints: ['src/prototype/fixtures.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { paths, tracks, stagesFor, faculties } = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
assert.equal(paths.length,18);
assert.equal(faculties.flatMap(f=>f.majors).length,12);
assert.equal(new Set(paths.map(p=>p.id)).size,paths.length);
let configurations=0;
for (const path of paths) {
  assert.ok(tracks[path.id]?.length,`${path.id}: missing branches`);
  assert.equal(new Set(tracks[path.id].map(t=>t.id)).size,tracks[path.id].length);
  for (const branch of tracks[path.id]) {
    const stages=stagesFor(path.id,branch.id);
    assert.ok(stages.length,`${path.id}/${branch.id}: empty stages`);
    assert.equal(new Set(stages.map(s=>s.id)).size,stages.length,`${path.id}/${branch.id}: duplicate stages`);
    for (const stage of stages) {
      assert.ok(stage.title && stage.outcome && stage.tasks.length && stage.sources.length,stage.id);
      assert.ok(stage.tasks.every(t=>t.title && Number.isFinite(t.minutes) && t.minutes>0),stage.id);
      assert.equal(new Set(stage.sources.map(s=>s.id)).size,stage.sources.length,stage.id);
      for (const source of stage.sources) assert.ok(/^https:\/\//.test(new URL(source.url).href),source.id);
    }
    configurations++;
  }
}
assert.equal(configurations,50);
console.log(`PASS: ${paths.length} directions, 12 majors, ${configurations} non-empty configurations; unique identifiers and valid source URLs.`);
