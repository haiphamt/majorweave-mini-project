import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from '../../../src/app/WorkspaceProvider';
import { WorkspacePlan } from '../../../src/app/WorkspacePlan';
import { Context } from '../../../src/app/context';
import { defaults } from '../../../src/state';
import { createWorkspaceController } from '../../../src/app/workspace-controller';
import { createRoadmapStore, emptyWorkspace } from '../../../src/persistence/roadmap-store';
import { contentPacks } from '../../../src/content';
import { updateTask } from '../../../src/domain/progress';
import type { Workspace, WorkspacePersistence, OperationResult } from '../../../src/domain/contracts';

// Isolated test harness. Never reads/writes/deletes the application's database or v1 storage.
const url = new URL(location.href);
const mode = url.searchParams.get('mode') === 'indexeddb' ? 'IndexedDB' : 'RAM';
const database = url.searchParams.get('db') || `majorweave-mw01-feedback-${crypto.randomUUID()}`;
if(mode === 'IndexedDB') { url.searchParams.set('db',database); history.replaceState(null,'',url); }
let disk = emptyWorkspace('Asia/Ho_Chi_Minh');
const failure: OperationResult<Workspace> = {ok:false,code:'storage',issues:[{code:'SIMULATED_SAVE_FAILURE',field:'workspace',message:'Lỗi ghi giả lập trong harness; không phải quota thật.'}]};
const base: WorkspacePersistence = mode === 'IndexedDB' ? createRoadmapStore({databaseName:database,timeZone:'Asia/Ho_Chi_Minh'}) : {
  async loadWorkspace(){return {ok:true,value:structuredClone(disk)};},
  async saveWorkspace(next,revision){if(revision!==disk.revision)return {ok:false,code:'conflict',issues:[{code:'REVISION_CONFLICT',field:'revision',message:'Writer khác đã đổi dữ liệu.'}]};disk=structuredClone({...next,revision:revision+1});return {ok:true,value:structuredClone(disk)};}
};
let failNext=false, gate:Promise<void>|null=null, release:(()=>void)|null=null, writes=0, notify=()=>{};
const persistence:WorkspacePersistence={loadWorkspace:()=>base.loadWorkspace(),async saveWorkspace(next,revision){
  writes++;notify();if(gate)await gate;
  if(failNext){failNext=false;return failure;}return base.saveWorkspace(next,revision);
}};
const options={persistence,packs:contentPacks,now:()=>new Date().toISOString(),today:()=> '2026-10-09',nextId:()=>crypto.randomUUID()};
const ok=<T,>(result:OperationResult<T>):T=>{if(!result.ok)throw Error(JSON.stringify(result));return result.value;};
const setup=createWorkspaceController(options);
const loaded=ok(await setup.initialize());
if(!loaded.plans.length){
  ok(setup.updateDraft('backend.node',{goal:'MW01 feedback test',startDate:'2026-10-12'}));
  const plan=ok(await setup.createPlan('backend.node'));
  const preview=ok(setup.previewRegeneration(plan.id));ok(await setup.confirmRegeneration(preview.token));
  const expected=setup.getSnapshot().workspace!.plans[0];
  ok(await setup.savePlan(ok(updateTask(expected,expected.current.tasks[0].id,{dayIndex:1})),expected));
}
function Panel(){
  const {status,workspace,unsavedWorkspace,actions}=useWorkspace();
  const [tick,setTick]=useState(0),[message,setMessage]=useState(''),[saved,setSaved]=useState<Workspace|null>(null);
  useEffect(()=>{notify=()=>setTick(value=>value+1);return ()=>{notify=()=>{};};},[]);
  async function read(){setSaved(ok(await base.loadWorkspace()));}
  const active=workspace?.plans.find(p=>p.id===workspace.activePlanId);
  const diskActive=saved?.plans.find(p=>p.id===saved.activePlanId);
  return <section className="page"><h1>MW-TEAM-01 / kiểm thử feedback</h1><p>Storage: {mode}. {mode==='IndexedDB'?`Database thử: ${database}`:'Persistence RAM riêng; lỗi ghi được điều khiển.'} Không dùng dữ liệu app chính.</p>
    <div className="dialog-actions"><button onClick={()=>{failNext=true;setMessage('Lần ghi tiếp theo sẽ lỗi có kiểm soát.');}}>Cho lần ghi tiếp theo lỗi</button><button onClick={()=>{gate=new Promise(resolve=>{release=resolve;});setMessage('Lần ghi tiếp theo đang được giữ.');}}>Giữ lần ghi tiếp theo</button><button onClick={()=>{release?.();gate=null;release=null;setMessage('Đã cho phép ghi tiếp tục.');}}>Cho phép ghi tiếp tục</button><button onClick={()=>void read()}>Đọc dữ liệu đã lưu</button><button onClick={async()=>{const value=ok(await base.loadWorkspace());ok(await base.saveWorkspace({...value,profile:{...value.profile,displayName:'External writer'}},value.revision));setMessage('Writer khác đã tăng revision.');}}>Đổi revision từ writer khác</button><button onClick={async()=>{const result=await actions.retrySave();setMessage(result.ok?'Retry đã lưu':result.issues.map(i=>i.code).join(' '));}}>Thử retry đã hủy</button></div>
    <pre data-testid="context-probe">{JSON.stringify({storage:mode,status,pending:!!unsavedWorkspace,revision:workspace?.revision,done:active?.current.tasks.filter(t=>t.status==='done').length,history:active?.history.length,writes,tick})}</pre>
    <pre data-testid="disk-probe">{JSON.stringify({storage:mode,revision:saved?.revision,done:diskActive?.current.tasks.filter(t=>t.status==='done').length,history:diskActive?.history.length,taskStatus:diskActive?.current.tasks.map(t=>t.status),displayName:saved?.profile.displayName})}</pre><p role="status" data-testid="control-result">{message}</p>
  </section>;
}
function Harness(){const [toast,setToast]=useState('');return <Context.Provider value={{state:defaults(),update:()=>{},toast:setToast,openModule:()=>{}}}><WorkspaceProvider options={options}><Panel/><HashRouter><WorkspacePlan/></HashRouter><p role="status" className="page">{toast}</p></WorkspaceProvider></Context.Provider>;}
createRoot(document.getElementById('root')!).render(<Harness/>);