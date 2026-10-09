// Disposable UI fixture only. No storage, app registry or production plan builder.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../../src/styles.css';
import type { LearningPlan, PlanTask, OperationResult } from '../../../src/domain/contracts';
import { MyPlanV2 } from '../../../src/features/my-plan/MyPlanV2';
import { scientistPack } from '../../../src/content/paths/scientist';
import { mlPack } from '../../../src/content/paths/ml';
import { mlopsPack } from '../../../src/content/paths/mlops';
import { aiEngineerPack } from '../../../src/content/paths/ai-engineer';
const packs = [scientistPack, mlPack, mlopsPack, aiEngineerPack];
const stages = packs.flatMap(p => p.stages);
const resources = packs.flatMap(p => p.resources);
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const now = '2026-10-06T10:00:00Z';
function fixtures(): LearningPlan[] {
  return packs.flatMap(p => p.tracks).map((track,index) => {
    const tasks: PlanTask[] = [0,1,2].map((offset) => {
      const stage = stages.find(s => s.id === track.stageIds[offset === 2 ? 1 : 0])!;
      const work = stage.work[offset === 1 ? 1 : 0];
      const source = resources.find(r => r.id === stage.defaultResourceId)!;
      return {id:id(index*100+offset+1),stageId:stage.id,workId:work.id,workRevision:work.revision,segment:null,title:work.title,minutes:work.minutes,acceptance:[...work.acceptance],source:{id:source.id,title:source.title,provider:source.provider,url:source.url},weekIndex:offset===2?null:0,dayIndex:null,status:'todo',customized:false,completionId:null,notes:''};
    });
    const current = {id:id(index*100+90),createdAt:now,trackId:track.id,contentVersion:'2026-10-06.mw-team-03.2',selectedStageIds:[...track.stageIds],knownStageIds:[],resourceByStage:Object.fromEntries(track.stageIds.map(stageId => [stageId, stages.find(s => s.id===stageId)!.defaultResourceId])),tasks,closedWeeks:[],goal:track.portfolio.title,hoursPerWeek:2,startDate:'2026-10-05'};
    return {id:id(index*100+91),name:`Fixture ${track.id}`,pathId:track.pathId,trackId:track.id,contentVersion:current.contentVersion,createdAt:now,status:'active',current,history:[{...structuredClone(current),id:id(index*100+80),createdAt:'2026-10-05T10:00:00Z'}],completions:[]};
  });
}
function Preview() {
  const [plans,setPlans] = useState(fixtures);
  const [activePlanId,setActive] = useState<string|null>(id(91));
  const [fail,setFail] = useState(false);
  const [scenario,setScenario] = useState('normal');
  const [saves,setSaves] = useState(0);
  const failure = (): OperationResult<void> => ({ok:false,code:'storage',issues:[{code:'fixture_failure',field:'',message:'Lỗi lưu giả lập. Dữ liệu chưa thay đổi.'}]});
  async function save(next: LearningPlan, expected: LearningPlan): Promise<OperationResult<void>> {
    await new Promise(resolve => setTimeout(resolve,100));
    if (fail) {setFail(false);return failure();}
    if (plans.find(p => p.id===expected.id)!==expected) return {ok:false,code:'conflict',issues:[{code:'conflict',field:'',message:'Fixture conflict: dữ liệu đã đổi.'}]};
    setPlans(current => current.map(p => p.id===next.id?next:p)); setSaves(n=>n+1);return {ok:true,value:undefined};
  }
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span>MajorWeave</span></div><p>My Plan · fixture UI</p><p className="source-note">Dữ liệu giả, chỉ nằm trong bộ nhớ trang này. Reload khởi tạo lại fixture. App thật vẫn v1.</p><button className="quiet-button" onClick={() => {setPlans(fixtures());setActive(id(91));setScenario('normal');setFail(false);setSaves(0);}}>Reset fixture</button></aside><main className="workspace"><div className="topbar"><span>MW-TEAM-03 · TEST ONLY</span><span role="status">Saves: {saves}</span></div><div className="page" style={{paddingBottom:0}}><label className="checkbox-label"><input aria-label="Giả lập lỗi lưu tiếp theo" type="checkbox" checked={fail} onChange={e=>setFail(e.target.checked)}/>Giả lập lỗi lưu tiếp theo</label><label>Kịch bản fixture<select aria-label="Kịch bản fixture" value={scenario} onChange={e=>setScenario(e.target.value)}><option value="normal">Bình thường</option><option value="empty">Workspace rỗng</option><option value="load-error">Lỗi tải</option><option value="loading">Đang tải</option><option value="archived">Plan archived</option></select></label></div><MyPlanV2 plans={scenario==='empty'?[]:scenario==='archived'?plans.map(p=>({...p,status:'archived'})):plans} activePlanId={activePlanId} stages={stages} onSelectPlan={async selected=>{if(fail){setFail(false);return failure();}setActive(selected);return {ok:true,value:undefined};}} onSavePlan={save} getProgressContext={()=>({now,today:'2026-10-06',timeZone:'Asia/Ho_Chi_Minh',nextCompletionId:()=>crypto.randomUUID()})} nextTaskId={()=>crypto.randomUUID()} loading={scenario==='loading'} loadError={scenario==='load-error'?'Lỗi tải giả lập.':undefined} onReload={()=>setScenario('normal')}/></main></div>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
