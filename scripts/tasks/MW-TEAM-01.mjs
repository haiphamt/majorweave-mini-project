import { randomUUID } from 'node:crypto';
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


// Strict resolver diagnostics: malformed content must fail before UI/planning.
for (const [name, mutate, expectedCode] of [
  ['missing resource', p=>{p[0].resources=p[0].resources.filter(r=>r.id!==p[0].stages[0].defaultResourceId);},'missing_resource'],
  ['missing credential', p=>{p[0].tracks[0].credentialIds=['missing'];},'missing_credential'],
  ['duplicate ID', p=>{p[0].stages.push(structuredClone(p[0].stages[0]));},'duplicate_id'],
  ['bad default', p=>{p[0].stages[0].defaultResourceId='missing';},'invalid_default_resource'],
  ['missing prerequisite', p=>{p[0].stages[0].prerequisiteIds=['missing'];},'missing_prerequisite'],
  ['cycle', p=>{const [a,b]=p[0].tracks[0].stageIds;p[0].stages.find(s=>s.id===a).prerequisiteIds=[b];p[0].stages.find(s=>s.id===b).prerequisiteIds=[a];},'prerequisite_cycle'],
  ['reversed order', p=>{p[0].tracks[0].stageIds.reverse();},'prerequisite_order'],
  ['duplicate stage reference', p=>{p[0].tracks[0].stageIds.push(p[0].tracks[0].stageIds[0]);},'duplicate_stage'],
  ['wrong path', p=>{p[0].tracks[0].pathId='wrong';},'path_mismatch'],
]) {
  const changed=structuredClone(packs);mutate(changed);
  const result=resolveTrackContent(changed,'backend.node');
  assert.equal(result.ok,false,name);assert.ok(result.issues.some(i=>i.code===expectedCode),JSON.stringify(result));
  console.log('PASS resolver '+name);
}
const initialContent=JSON.stringify(packs);
const detached=resolveTrackContent(packs,'fullstack.react-node').value;
detached.stages[0].title='Changed caller copy';assert.equal(JSON.stringify(packs),initialContent);
const changedVersion=structuredClone(packs);changedVersion[0].contentVersion+='-updated';
assert.notEqual(resolveTrackContent(packs,'fullstack.react-node').value.contentVersion,resolveTrackContent(changedVersion,'fullstack.react-node').value.contentVersion);
assert.equal(resolveTrackContent(packs,'ux.product').value.contentVersion,resolveTrackContent(changedVersion,'ux.product').value.contentVersion);
for(const id of expected17Tracks.filter(id=>id.startsWith('fullstack.'))){
  const [fe,be]=id.slice('fullstack.'.length).split('-');const resolved=resolveTrackContent(packs,id).value;
  assert.ok(resolved.stages.some(s=>s.id.startsWith('frontend.'+fe+'.')));
  for(const other of ['react','angular','vue'].filter(x=>x!==fe))assert.ok(!resolved.stages.some(s=>s.id.startsWith('frontend.'+other+'.')));
  for(const other of ['node','python','java'].filter(x=>x!==be))assert.ok(!resolved.stages.some(s=>s.id.startsWith('backend.'+other+'.')));
  if(id!=='fullstack.react-node')assert.ok(!resolved.track.credentialIds.includes('credential.fs.fullstack-open-cert'));
  assert.equal(resolved.stages.find(s=>s.id==='fullstack.api-client').defaultResourceId,'resource.fs.fetch-mdn');
}
console.log('PASS detached resolver, dependency version and nine FE/BE source/credential pairs');
const loadIntegration=async entry=>{const b=await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',write:false});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));};
const {createWorkspaceController}=await loadIntegration('src/app/workspace-controller.ts');
const {emptyWorkspace,validateRoadmapWorkspace}=await loadIntegration('src/persistence/roadmap-store.ts');
const {setTaskCompletion,calculatePlanStats}=await loadIntegration('src/domain/progress.ts');
let disk=emptyWorkspace('Asia/Ho_Chi_Minh'),serial=0,failSave=false;
const ok=r=>{assert.equal(r.ok,true,r.ok?'':JSON.stringify(r));return r.value;};
const persistence={loadWorkspace:async()=>({ok:true,value:structuredClone(disk)}),saveWorkspace:async(candidate,revision)=>{
  if(failSave){failSave=false;return {ok:false,code:'storage',issues:[{code:'QUOTA',field:'workspace',message:'Test quota'}]};}
  assert.equal(revision,disk.revision);ok(validateRoadmapWorkspace(candidate));disk=structuredClone({...candidate,revision:revision+1});return {ok:true,value:structuredClone(disk)};
}};
const controller=createWorkspaceController({persistence,packs,now:()=> '2026-10-08T03:00:00Z',today:()=> '2026-10-08',nextId:randomUUID});
ok(await controller.initialize());
for(const trackId of expected17Tracks){
  ok(controller.selectTrack(trackId));const resolved=ok(controller.resolveTrack(trackId));const draft=controller.getDraft(trackId);
  const stage=resolved.stages.find(s=>s.resourceIds.length>1);assert.ok(stage,trackId+' needs source choice');
  const source=stage.resourceIds.find(id=>id!==stage.defaultResourceId);
  ok(controller.updateDraft(trackId,{goal:'MW01 test '+trackId,resourceByStage:{...draft.resourceByStage,[stage.id]:source}}));
  ok(await controller.saveDraft());const plan=ok(await controller.createPlan(trackId));
  assert.ok(plan.current.tasks.filter(t=>t.stageId===stage.id).every(t=>t.source.id===source));
  const persisted=controller.getSnapshot().workspace.plans.find(p=>p.id===plan.id);
  const next=ok(setTaskCompletion(persisted,persisted.current.tasks[0].id,true,{now:'2026-10-08T04:00:00Z',today:'2026-10-08',timeZone:'Asia/Ho_Chi_Minh',nextCompletionId:randomUUID}));
  ok(await controller.savePlan(next,persisted));ok(await controller.reloadWorkspace());
  const reloaded=controller.getSnapshot().workspace.plans.find(p=>p.id===plan.id);
  assert.equal(reloaded.current.tasks[0].status,'done');assert.equal(reloaded.completions.length,1);
  const before=JSON.stringify(reloaded);ok(controller.selectTrack(trackId==='ux.product'?'frontend.react':'ux.product'));
  assert.equal(JSON.stringify(controller.getSnapshot().workspace.plans.find(p=>p.id===plan.id)),before);
  console.log('PASS integration source/create/complete/reload/independent '+trackId);
}
assert.equal(disk.plans.length,17);
const before=structuredClone(disk), expected=controller.getSnapshot().workspace.plans[0];
const updated=ok(setTaskCompletion(expected,expected.current.tasks[1].id,true,{now:'2026-10-08T05:00:00Z',today:'2026-10-08',timeZone:'Asia/Ho_Chi_Minh',nextCompletionId:randomUUID}));
failSave=true;assert.equal((await controller.savePlan(updated,expected)).ok,false);
assert.deepEqual(disk,before);assert.equal(controller.getSnapshot().dirty,true);assert.ok(controller.getSnapshot().unsavedWorkspace);
ok(await controller.retrySave());assert.equal(disk.plans[0].completions.length,2);
assert.equal((await controller.savePlan(updated,expected)).ok,false,'stale plan must be rejected');
assert.equal((await controller.toggleCredential('missing')).ok,false);
const credential=packs[0].tracks[0].credentialIds[0];ok(await controller.toggleCredential(credential));ok(await controller.reloadWorkspace());assert.ok(disk.savedCredentialIds.includes(credential));
ok(await controller.toggleCredential(credential));assert.ok(!disk.savedCredentialIds.includes(credential));
console.log('PASS failed save preserves old plan, retry, stale plan and credential persistence');
// 09/10 review regressions: shared discard, saving guard and conflict refresh.
const {parseTaskForm,taskForm}=await loadIntegration('src/features/my-plan/viewModel.ts');
for(let day=0;day<7;day++){
  const form={stageId:'test',title:'Study',minutes:'60',acceptance:'One output',notes:'',week:'1',day:String(day)};
  const temporary={...form,week:''};
  assert.equal(temporary.day,String(day));
  assert.equal(ok(parseTaskForm({...temporary,week:'2'})).dayIndex,day);
  assert.equal(ok(parseTaskForm(temporary)).dayIndex,null);
  assert.equal(temporary.day,String(day));
}
assert.equal(parseTaskForm({stageId:'test',title:'Study',minutes:'60',acceptance:'Output',notes:'',week:'',day:'7'}).ok,false);
console.log('PASS Chung Hieu 1ce77b1: all seven days retained while week is blank; only backlog submit clears day');
async function feedbackFixture(){
  let committed=emptyWorkspace('Asia/Ho_Chi_Minh'),writes=0,fail=false,gate=null;
  const store={loadWorkspace:async()=>({ok:true,value:structuredClone(committed)}),saveWorkspace:async(next,revision)=>{
    writes++;if(gate)await gate;
    if(fail){fail=false;return {ok:false,code:'storage',issues:[{code:'TEST_SAVE_FAILED',field:'workspace',message:'Controlled failure'}]};}
    if(revision!==committed.revision)return {ok:false,code:'conflict',issues:[{code:'REVISION_CONFLICT',field:'revision',message:'Another writer'}]};
    committed=structuredClone({...next,revision:revision+1});return {ok:true,value:structuredClone(committed)};
  }};
  const c=createWorkspaceController({persistence:store,packs,now:()=> '2026-10-09T03:00:00Z',today:()=> '2026-10-09',nextId:randomUUID});
  ok(await c.initialize());ok(c.updateDraft('backend.node',{goal:'Review regression'}));const plan=ok(await c.createPlan('backend.node'));
  const preview=ok(c.previewRegeneration(plan.id));ok(await c.confirmRegeneration(preview.token));
  const complete=(index)=>{const expected=c.getSnapshot().workspace.plans[0];return {expected,next:ok(setTaskCompletion(expected,expected.current.tasks[index].id,true,{now:'2026-10-09T04:00:00Z',today:'2026-10-09',timeZone:'Asia/Ho_Chi_Minh',nextCompletionId:randomUUID}))};};
  return {c,complete,disk:()=>structuredClone(committed),writes:()=>writes,fail:()=>{fail=true;},gate:p=>{gate=p;},external:()=>{committed={...committed,revision:committed.revision+1,profile:{...committed.profile,displayName:'External writer'}};}};
}
{
  const f=await feedbackFixture(),before=f.disk(),a=f.complete(0);f.fail();assert.equal((await f.c.savePlan(a.next,a.expected)).ok,false);
  const candidate=f.c.getSnapshot().unsavedWorkspace,writes=f.writes();
  assert.equal((await f.c.discardPendingSave(structuredClone(candidate))).ok,false,'stale confirmation must not discard current candidate');
  assert.ok(f.c.getSnapshot().unsavedWorkspace);ok(await f.c.discardPendingSave(candidate));
  assert.equal(f.c.getSnapshot().unsavedWorkspace,null);assert.equal(f.c.getSnapshot().dirty,false);assert.equal(f.c.getSnapshot().status,'ready');
  assert.deepEqual(f.disk(),before);assert.equal(f.writes(),writes,'discard is read-only');
  assert.equal((await f.c.retrySave()).ok,false);assert.equal(f.writes(),writes,'banner cannot revive discarded change');
  const b=f.complete(1);ok(await f.c.savePlan(b.next,b.expected));
  assert.equal(f.disk().plans[0].current.tasks[0].status,'todo');assert.equal(f.disk().plans[0].current.tasks[1].status,'done');
  assert.deepEqual(f.disk().plans[0].history,before.plans[0].history);
  console.log('PASS save fail → shared discard → no retry resurrection → edit other task; history retained');
}
{
  const f=await feedbackFixture(),a=f.complete(0);f.fail();assert.equal((await f.c.savePlan(a.next,a.expected)).ok,false);
  const pending=f.c.getSnapshot().unsavedWorkspace;let release;f.gate(new Promise(resolve=>{release=resolve;}));
  const retry=f.c.retrySave();assert.equal(f.c.getSnapshot().status,'saving');
  assert.equal((await f.c.discardPendingSave(pending)).ok,false,'cannot cancel in-flight transaction');
  assert.ok(f.c.getSnapshot().unsavedWorkspace);release();ok(await retry);
  assert.equal(f.disk().plans[0].current.tasks[0].status,'done');assert.equal(f.disk().plans[0].completions.length,1);
  assert.equal(f.c.getSnapshot().unsavedWorkspace,null);
  console.log('PASS failed save retry once, discard during saving rejected');
}
{
  const f=await feedbackFixture(),a=f.complete(0);f.external();const external=f.disk();
  const conflict=await f.c.savePlan(a.next,a.expected);assert.equal(conflict.code,'conflict');
  assert.equal(f.c.getSnapshot().status,'conflict');assert.ok(f.c.getSnapshot().unsavedWorkspace);
  assert.equal((await f.c.reloadWorkspace()).ok,false,'requires confirmed discard');
  ok(await f.c.discardPendingSave(f.c.getSnapshot().unsavedWorkspace));
  assert.equal(f.c.getSnapshot().unsavedWorkspace,null);assert.deepEqual(f.c.getSnapshot().workspace,external);
  assert.deepEqual(f.disk(),external);assert.equal((await f.c.retrySave()).ok,false);
  const b=f.complete(1);ok(await f.c.savePlan(b.next,b.expected));
  assert.equal(f.disk().profile.displayName,'External writer');assert.equal(f.disk().plans[0].current.tasks[0].status,'todo');
  console.log('PASS revision conflict → confirm discard → latest committed revision → new edit');
}