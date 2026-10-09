import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({entryPoints:['src/persistence/migration-source.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {inspectLegacyV1,readLegacyV1,LEGACY_V1_KEY}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const fixture=()=>({version:1,stack:'node',profileName:'Huy QA',planMeta:{stack:'node',goal:'Plan cũ',hours:5,startDate:'2026-10-05'},major:'software',browseFaculty:'all',level:'basic',preferFree:true,language:'all',selected:['js','unknown-stage'],known:[],sourceByModule:{js:'unknown-source'},goal:'Nháp mới',hours:2,startDate:'2026-10-05',tasks:[{id:'unknown-work',moduleId:'unknown-stage',title:'Việc tự sửa',minutes:1500,sourceId:'unknown-source',week:1001,completed:true,notes:'Gốc'}],credentials:['unknown-credential']});
async function good(raw){const r=await inspectLegacyV1(raw);assert.equal(r.ok,true,JSON.stringify(r));return r.value;}
let pass=0,fail=0;
async function test(name,run){try{await run();pass++;console.log(`PASS ${name}`);}catch(e){fail++;console.error(`FAIL ${name}: ${e.message}`);}}
await test('Không có nguồn: null, không defaults',async()=>assert.equal(await good(null),null));
await test('Raw/unknown work/source/credential và phút/tuần giữ nguyên',async()=>{const f=fixture(),raw=JSON.stringify(f),s=await good(raw);assert.equal(s.raw,raw);assert.deepEqual(s.state,f);});
await test('Done thiếu timestamp: cảnh báo, không bịa ngày',async()=>{const s=await good(JSON.stringify(fixture()));assert.ok(s.warnings.some(x=>x.code==='LEGACY_UNKNOWN_COMPLETION_DATE'));assert.equal(s.state.tasks[0].completedAt,undefined);});
await test('Timestamp thực giữ nguyên',async()=>{const f=fixture();f.tasks[0].completedAt='2026-10-07T23:00:00+07:00';assert.equal((await good(JSON.stringify(f))).state.tasks[0].completedAt,f.tasks[0].completedAt);});
await test('SHA256 ổn định theo raw, đổi khi raw đổi',async()=>{const raw=JSON.stringify(fixture()),a=await good(raw),b=await good(raw),c=await good(raw+' ');assert.match(a.fingerprint,/^legacy-v1:sha256:[a-f0-9]{64}$/);assert.equal(a.fingerprint,b.fingerprint);assert.notEqual(a.fingerprint,c.fingerprint);});
await test('JSON lỗi không thay defaults',async()=>{const r=await inspectLegacyV1('{bad');assert.equal(r.ok,false);assert.equal(r.issues[0].code,'LEGACY_JSON');});
await test('Version tương lai bị từ chối',async()=>{const r=await inspectLegacyV1(JSON.stringify({...fixture(),version:99}));assert.equal(r.ok,false);assert.equal(r.code,'unsupported_version');});
await test('Null/mảng/object thiếu trường/empty bị từ chối',async()=>{for(const raw of ['null','[]','{}',''])assert.equal((await inspectLegacyV1(raw)).ok,false);});
await test('Task lỗi: từ chối cả nguồn, không lọc',async()=>{const f=fixture();f.tasks.push({...f.tasks[0],id:'bad',minutes:-1});assert.equal((await inspectLegacyV1(JSON.stringify(f))).ok,false);});
await test('ID task trùng bị từ chối',async()=>{const f=fixture();f.tasks.push({...f.tasks[0]});assert.equal((await inspectLegacyV1(JSON.stringify(f))).ok,false);});
await test('Ngày sai và timestamp thiếu timezone bị từ chối',async()=>{const f=fixture();f.startDate='2026-02-30';assert.equal((await inspectLegacyV1(JSON.stringify(f))).ok,false);f.startDate='2026-10-05';f.tasks[0].completedAt='2026-10-07T10:00:00';assert.equal((await inspectLegacyV1(JSON.stringify(f))).ok,false);});
await test('PlanMeta độc lập với draft',async()=>{const f=fixture();f.stack='python';const s=await good(JSON.stringify(f));assert.equal(s.state.stack,'python');assert.equal(s.state.planMeta.stack,'node');});
await test('PlanMeta chưa có: giữ nguyên, cảnh báo',async()=>{const f=fixture();delete f.planMeta;const s=await good(JSON.stringify(f));assert.equal(s.state.planMeta,undefined);assert.ok(s.warnings.some(x=>x.code==='LEGACY_NO_PLAN_META'));});
await test('Extra fields không bị xóa',async()=>{const f=fixture();f.extraHistory={keep:true};assert.deepEqual((await good(JSON.stringify(f))).state.extraHistory,f.extraHistory);});
await test('Reader chỉ đọc đúng key v1',async()=>{const keys=[];const r=await readLegacyV1(k=>{keys.push(k);return JSON.stringify(fixture());});assert.equal(r.ok,true);assert.deepEqual(keys,[LEGACY_V1_KEY]);});
await test('Reader throw trả storage, không defaults',async()=>{const r=await readLegacyV1(()=>{throw Error('denied');});assert.equal(r.ok,false);assert.equal(r.code,'storage');});
console.log(`${pass} PASS / ${fail} FAIL — read/validate/fingerprint only; chưa kiểm preview/confirm/IndexedDB.`);
if(fail)process.exitCode=1;
