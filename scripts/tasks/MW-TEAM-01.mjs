import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Build và nạp các module nội dung và domain của MW-TEAM-01
const bundle = await build({
  entryPoints: [
    'src/content/paths/backend.ts',
    'src/content/paths/frontend.ts',
    'src/content/paths/ux.ts',
    'src/content/paths/fullstack.ts',
    'src/content/catalog.ts',
    'src/domain/content.ts'
  ],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'out-test-mw01',
  write: false
});

const getModule = async (name) => {
  const file = bundle.outputFiles.find(f => f.path.endsWith(`${name}.js`));
  assert.ok(file, `Không tìm thấy module đã build: ${name}`);
  return import(`data:text/javascript;base64,${Buffer.from(file.text).toString('base64')}`);
};

const { backendPack } = await getModule('backend');
const { frontendPack } = await getModule('frontend');
const { uxPack } = await getModule('ux');
const { fullstackPack } = await getModule('fullstack');
const { DEPARTMENTS, MAJORS, CAREER_PATHS, getMajorsByDepartment } = await getModule('catalog');
const { resolveTrackContent } = await getModule('content');

console.log('--- KIỂM THỬ TASK MW-TEAM-01 (Nguyễn Thị Quỳnh Hân) ---');

// 1. Kiểm tra Catalog v2 (12 ngành gốc, 6 khoa, 18 hướng)
assert.equal(DEPARTMENTS.length, 6, 'Phải có đúng 6 khoa UIT');
assert.equal(MAJORS.length, 12, 'Phải có đúng 12 ngành đào tạo gốc');
assert.equal(CAREER_PATHS.length, 18, 'Phải có đúng 18 hướng nghề nghiệp v2');

for (const dept of DEPARTMENTS) {
  const majorsInDept = getMajorsByDepartment(dept.id);
  assert.ok(majorsInDept.length > 0, `Khoa ${dept.name} phải có ít nhất 1 ngành đào tạo`);
}
console.log('PASS: Catalog 6 khoa, 12 ngành, 18 hướng hợp lệ.');

// 2. Thu thập danh sách packs của MW-TEAM-01
const packs = [backendPack, frontendPack, fullstackPack, uxPack];

// Kiểm tra tính duy nhất của ID chặng trong từng pack
const allStages = new Map();
for (const pack of packs) {
  for (const s of pack.stages) {
    assert.ok(!allStages.has(s.id), `Trùng lặp stage ID giữa các pack: ${s.id}`);
    allStages.set(s.id, s);
  }
}

// 3. Kiểm tra danh sách 17 track của MW-TEAM-01
const expected17Tracks = [
  // Backend (3)
  'backend.node', 'backend.python', 'backend.java',
  // Frontend (3)
  'frontend.react', 'frontend.angular', 'frontend.vue',
  // Full-stack (9)
  'fullstack.react-node', 'fullstack.react-python', 'fullstack.react-java',
  'fullstack.angular-node', 'fullstack.angular-python', 'fullstack.angular-java',
  'fullstack.vue-node', 'fullstack.vue-python', 'fullstack.vue-java',
  // UX Design (2)
  'ux.research', 'ux.product'
];

assert.equal(expected17Tracks.length, 17, 'Số lượng track phải đúng 17 cấu hình');

for (const trackId of expected17Tracks) {
  const result = resolveTrackContent(packs, trackId);
  assert.ok(result.ok, `Resolve thất bại cho track ${trackId}`);
  
  const { track, stages, resources, credentials, contentVersion } = result.value;
  assert.equal(track.id, trackId, `Track ID không khớp: ${track.id}`);
  assert.ok(contentVersion, `Track ${trackId} thiếu contentVersion`);
  assert.ok(stages.length >= 6, `Track ${trackId} có ít nhất 6 chặng học (thực tế: ${stages.length})`);
  assert.ok(resources.length >= 2, `Track ${trackId} có ít nhất 2 nguồn học`);
  assert.ok(credentials.length >= 1, `Track ${trackId} có ít nhất 1 chứng nhận`);
  assert.ok(track.portfolio.acceptance.length >= 2, `Track ${trackId} có ít nhất 2 tiêu chí portfolio`);

  // Kiểm tra thứ tự tiên quyết (Prerequisites topological order)
  const seenStageIds = new Set();
  for (const stage of stages) {
    for (const prereqId of stage.prerequisiteIds) {
      assert.ok(
        seenStageIds.has(prereqId),
        `Lỗi tiên quyết tại track ${trackId}: chặng tiên quyết '${prereqId}' phải xuất hiện TRƯỚC chặng '${stage.id}'`
      );
    }
    seenStageIds.add(stage.id);

    // Kiểm tra bài tập thực hành (WorkTemplate)
    assert.ok(stage.work.length > 0, `Chặng ${stage.id} thiếu bài tập thực hành`);
    for (const work of stage.work) {
      assert.ok(work.minutes > 0, `Thời lượng bài tập ${work.id} phải dương`);
      assert.ok(work.revision >= 1, `Revision bài tập ${work.id} phải >= 1`);
      assert.ok(work.acceptance.length > 0, `Bài tập ${work.id} thiếu tiêu chí nghiệm thu`);
    }

    // Kiểm tra URL nguồn học dùng https:
    assert.ok(stage.resourceIds.length > 0, `Chặng ${stage.id} thiếu tài nguyên học`);
    for (const rId of stage.resourceIds) {
      const res = resources.find(r => r.id === rId);
      assert.ok(res, `Không tìm thấy resource ${rId} trong danh sách resolved resources`);
      assert.equal(new URL(res.url).protocol, 'https:', `URL của ${res.id} phải là HTTPS`);
    }
  }

  // Kiểm tra URL chứng nhận dùng https:
  for (const cred of credentials) {
    assert.equal(new URL(cred.url).protocol, 'https:', `URL của ${cred.id} phải là HTTPS`);
  }
}

console.log('PASS: Toàn bộ 17 cấu hình track (3 BE, 3 FE, 9 FS, 2 UX) giải quyết thành công với đầy đủ bài tập và tiên quyết.');

// 4. Kiểm tra các nhánh lỗi của resolveTrackContent
const errorResultNotFound = resolveTrackContent(packs, 'unknown.track.id');
assert.equal(errorResultNotFound.ok, false);
if (!errorResultNotFound.ok) {
  assert.equal(errorResultNotFound.code, 'validation');
  assert.equal(errorResultNotFound.issues[0].code, 'not_found');
}

const mockBrokenPack = {
  schemaVersion: 1,
  contentVersion: 'test',
  pathId: 'broken',
  reviewStatus: 'draft',
  stages: [],
  resources: [],
  credentials: [],
  tracks: [{
    id: 'broken.track',
    pathId: 'broken',
    label: 'Broken Track',
    stageIds: ['non.existent.stage'],
    credentialIds: [],
    roadmapLinks: [],
    portfolio: { title: '', acceptance: [] }
  }]
};

const errorResultMissingStage = resolveTrackContent([mockBrokenPack], 'broken.track');
assert.equal(errorResultMissingStage.ok, false);
if (!errorResultMissingStage.ok) {
  assert.equal(errorResultMissingStage.code, 'validation');
  assert.equal(errorResultMissingStage.issues[0].code, 'missing_stage');
}

console.log('PASS: Các trường hợp lỗi not_found và missing_stage được kiểm soát an toàn.');
console.log('--- TOÀN BỘ BỘ KIỂM THỬ MW-TEAM-01 THÀNH CÔNG ---');
