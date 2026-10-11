import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MyPlanV2 } from '../../../../src/features/my-plan/MyPlanV2';
import { contentPacks } from '../../../../src/content';
import { generatePlan } from '../../../../src/domain/planner';
import type { LearningPlan, OperationResult } from '../../../../src/domain/contracts';
import '../../../../src/styles.css';

// Test-only host: real component/domain, controlled save errors; no storage/auth.
const stages = contentPacks.flatMap(p => p.stages);
const resources = contentPacks.flatMap(p => p.resources);
const track = contentPacks.flatMap(p => p.tracks).find(t => t.id === 'backend.node')!;
const result = generatePlan(track, stages, resources, { trackId: track.id, selectedStageIds: [...track.stageIds], knownStageIds: [], resourceByStage: {}, goal: 'My Plan QA', hoursPerWeek: 5, startDate: '2026-10-12' }, { contentVersion: 'qa-20261011', planId: crypto.randomUUID(), generationId: crypto.randomUUID(), nextTaskId: () => crypto.randomUUID(), now: '2026-10-11T05:00:00Z' });
if (!result.ok) throw Error(result.issues.map(i => i.message).join(' '));
const initial = result.value;
function Host() {
  const [plan, setPlan] = useState<LearningPlan>(initial);
  const [mode, setMode] = useState<'ready'|'loading'|'error'|'empty'>('ready');
  const [commits, setCommits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const failure = useRef<'none'|'return'|'throw'|'conflict'|'delay'>('none');
  const pending = useRef<LearningPlan|null>(null);
  const [armed, setArmed] = useState('none');
  function arm(next: typeof failure.current) { failure.current=next; setArmed(next); }
  async function save(next: LearningPlan, expected: LearningPlan): Promise<OperationResult<void>> {
    setAttempts(n=>n+1); pending.current=next;
    const action=failure.current; failure.current='none'; setArmed('none');
    if (action==='delay') await new Promise(resolve=>setTimeout(resolve,1500));
    if (action==='throw') throw Error('QA simulated transport failure');
    if (action==='return' || action==='conflict') return {ok:false,code:action==='conflict'?'conflict':'storage',issues:[{code:'QA_SAVE_FAILED',field:'plan',message:action==='conflict'?'QA: dữ liệu ở nơi khác đã thay đổi.':'QA: lưu thất bại; bản cũ còn nguyên.'}]};
    if (expected!==plan) return {ok:false,code:'conflict',issues:[{code:'STALE',field:'plan',message:'QA: bản thao tác đã cũ.'}]};
    setPlan(next); setCommits(n=>n+1); pending.current=null;
    return {ok:true,value:undefined};
  }
  return <><aside className="page" aria-label="Điều khiển QA"><h1>My Plan QA</h1><p>Dữ liệu giả lập trong RAM. Không ghi vào tài khoản hoặc Guest.</p><output aria-label="Kết quả QA">{`commits=${commits}; attempts=${attempts}; armed=${armed}; tasks=${plan.current.tasks.length}; blocked=${blocked}`}</output><div className="dialog-actions">{(['return','throw','conflict','delay'] as const).map(m=><button key={m} onClick={()=>arm(m)}>{`QA ${m}`}</button>)}<button onClick={()=>setMode('loading')}>QA loading</button><button onClick={()=>setMode('error')}>QA load error</button><button onClick={()=>setMode('empty')}>QA empty</button><button onClick={()=>setMode('ready')}>QA ready</button><button onClick={()=>setPlan({...plan,status:plan.status==='active'?'archived':'active'})}>QA archive</button><button onClick={()=>setPlan({...plan,history:[{...structuredClone(plan.current),id:crypto.randomUUID()}]})}>QA history</button><button onClick={()=>{if(pending.current){setPlan(pending.current);pending.current=null;setCommits(n=>n+1);}}}>QA shared retry</button></div></aside><MyPlanV2 plans={mode==='empty'?[]:[plan]} activePlanId={plan.id} stages={stages} loading={mode==='loading'} loadError={mode==='error'?'QA: tải dữ liệu thất bại.':undefined} onReload={()=>setMode('ready')} onSelectPlan={async()=>({ok:true,value:undefined})} onSavePlan={save} onDiscardPendingPlan={async()=>{pending.current=null;return {ok:true,value:undefined};}} onDraftStateChange={setBlocked} getProgressContext={()=>({now:'2026-10-11T05:00:00Z',today:'2026-10-11',timeZone:'Asia/Bangkok',nextCompletionId:()=>crypto.randomUUID()})} nextTaskId={()=>crypto.randomUUID()}/></>;
}
createRoot(document.getElementById('qa-root')!).render(<Host/>);
