import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useAccountDraftProtection } from './AccountWorkspace';
import { useApp, useWorkspace } from './context';
import { MyPlan } from '../features/my-plan/MyPlan';
import { MyPlanV2 } from '../features/my-plan/MyPlanV2';
import { contentPacks } from '../content';

export function WorkspacePlan() {
  const [editing, setEditing] = useState(false);
  useAccountDraftProtection(editing);
  const {workspace,status,error,actions,unsavedWorkspace}=useWorkspace();
  const {state,toast}=useApp();
  const [params]=useSearchParams();
  if(params.get('legacy')==='1') return <><div className="page"><p>Bản v1 chỉ đọc; dữ liệu nguồn được giữ nguyên. Chuyển dữ liệu ở Profile để tiếp tục học.</p><Link to="/profile" className="secondary-button">Chuyển dữ liệu cũ</Link></div><fieldset disabled style={{border:0,padding:0}}><MyPlan/></fieldset></>;
  return <>{unsavedWorkspace && <div className="page soft-note" role="alert"><p>{error?.issues.map(i=>i.message).join(' ') || 'Có thay đổi chưa lưu; bản đang xem vẫn được giữ.'}</p><button className="secondary-button" disabled={status==='saving'} onClick={()=>void actions.retrySave()}>Thử lưu dữ liệu đang chờ</button></div>}{state.tasks.length>0&&<div className="page"><Link className="text-link" to="/plan?legacy=1">Mở kế hoạch cũ (v1)</Link></div>}<MyPlanV2 onDraftStateChange={setEditing} plans={workspace?.plans||[]} activePlanId={workspace?.activePlanId||null} stages={contentPacks.flatMap(p=>p.stages)} loading={status==='loading'} loadError={!workspace?error?.issues.map(i=>i.message).join(' '):undefined} onReload={()=>void actions.reloadWorkspace()} nextTaskId={()=>crypto.randomUUID()} getProgressContext={()=>{
    const now=new Date();const timeZone=workspace?.profile.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parts=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const part=(type:string)=>parts.find(p=>p.type===type)?.value;
    return {now:now.toISOString(),today:`${part('year')}-${part('month')}-${part('day')}`,timeZone,nextCompletionId:()=>crypto.randomUUID()};
  }} onSelectPlan={async id=>{const result=await actions.selectPlan(id);return result.ok?{ok:true,value:undefined}:result;}} onSavePlan={async(next,expected)=>{
    const pending=unsavedWorkspace?.plans.find(p=>p.id===next.id);
    const result=pending&&JSON.stringify(pending)===JSON.stringify(next)?await actions.retrySave():await actions.savePlan(next,expected);
    return result.ok?{ok:true,value:undefined}:result;
  }} onDiscardPendingPlan={async candidate=>{
    const pending=unsavedWorkspace?.plans.find(p=>p.id===candidate.id);
    if(!unsavedWorkspace || !pending || JSON.stringify(pending)!==JSON.stringify(candidate))
      return {ok:false,code:'conflict',issues:[{code:'STALE_PENDING_PLAN',field:'planId',message:'Bản chưa lưu đã thay đổi; mở lại thao tác trên dữ liệu hiện tại.'}]};
    const result=await actions.discardPendingSave(unsavedWorkspace);
    if(result.ok){toast('Đã bỏ thay đổi chưa lưu; giữ dữ liệu đã lưu');return {ok:true,value:undefined};}
    return result;
  }}/></>;
}
