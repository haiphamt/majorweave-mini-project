import { useState } from 'react';
import { Check, BookOpen } from 'lucide-react';
import type { LearningStage } from '../../domain/contracts';
import { useApp, useWorkspace } from '../../app/context';
import { Dialog, External } from '../../components/ui';
import { hoursText } from '../../state';

/** A cancelable editor. Only Apply updates the shared draft, then persists it. */
export function StageDrawer({stage,trackId,onClose}:{stage:LearningStage;trackId:string;onClose:()=>void}) {
  const { actions, status, unsavedWorkspace }=useWorkspace();
  const {toast}=useApp();
  const draft=actions.getDraft(trackId);
  const resolved=actions.resolveTrack(trackId);
  const [source,setSource]=useState(draft?.resourceByStage[stage.id]||stage.defaultResourceId);
  const [selected,setSelected]=useState(draft?.selectedStageIds.includes(stage.id)||false);
  const [known,setKnown]=useState(draft?.knownStageIds.includes(stage.id)||false);
  const [language,setLanguage]=useState('all');
  const [freeOnly,setFreeOnly]=useState(false);
  const [message,setMessage]=useState('');
  const busy=status==='saving';
  const locked=busy||!!unsavedWorkspace;
  const resources=resolved.ok?resolved.value.resources.filter(r=>stage.resourceIds.includes(r.id)):[];
  const visible=resources.filter(r=>(language==='all'||r.language===language)&&(!freeOnly||r.cost==='free'));
  async function apply() {
    if (!draft) return;
    if (!unsavedWorkspace) {
      const next=actions.getDraft(trackId)!;
      const updated=actions.updateDraft(trackId,{ selectedStageIds:selected?[...new Set([...next.selectedStageIds,stage.id])]:next.selectedStageIds.filter(id=>id!==stage.id), knownStageIds:known?[...new Set([...next.knownStageIds,stage.id])]:next.knownStageIds.filter(id=>id!==stage.id), resourceByStage:{...next.resourceByStage,[stage.id]:source} });
      if(!updated.ok){setMessage(updated.issues.map(i=>i.message).join(' '));return;}
    }
    const saved=unsavedWorkspace?await actions.retrySave():await actions.saveDraft();
    if(saved.ok){toast('Đã lưu lựa chọn chặng và nguồn học');onClose();}else setMessage(saved.issues.map(i=>i.message).join(' '));
  }
  return <Dialog title={stage.title} eyebrow={`${({foundation:'Nền tảng',build:'Thực hành',ship:'Ứng dụng',expand:'Mở rộng'})[stage.phase]} · ${hoursText(stage.work.reduce((n,w)=>n+w.minutes,0))}`} className="module-drawer learning-stage" onClose={()=>{if(!busy)onClose();}}><div className="dialog-body"><p className="lead-description">{stage.description}</p><div className="outcome-box"><div><span className="eyebrow">SAU CHẶNG NÀY</span><p>{stage.outcome}</p></div></div><h3>Nguồn học</h3><div className="resource-toolbar"><select aria-label="Ngôn ngữ nguồn cho chặng" value={language} onChange={e=>setLanguage(e.target.value)}><option value="all">Mọi ngôn ngữ</option><option value="vi">Tiếng Việt</option><option value="en">Tiếng Anh</option></select><label className="checkbox-label"><input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/>Chỉ nguồn miễn phí</label></div>{visible.map(r=><article key={r.id} className="resource-card"><span className="eyebrow">{r.provider}</span><h3><External href={r.url}>{r.title}</External></h3><p>{r.accessNote}</p><button type="button" className="secondary-button" aria-pressed={source===r.id} disabled={locked} onClick={()=>setSource(r.id)}>{source===r.id?<><Check size={15}/>Nguồn đã chọn</>:'Chọn nguồn này'}</button></article>)}{!visible.length&&<div className="empty-inline">Chưa có nguồn khớp bộ lọc. Nguồn đang chọn vẫn được giữ.<button className="text-link" onClick={()=>{setLanguage('all');setFreeOnly(false);}}>Nới bộ lọc</button></div>}<h3 className="practice-heading">Bài thực hành</h3><ul className="practice-list">{stage.work.map(w=><li key={w.id}><div><strong>{w.title}</strong><ul>{w.acceptance.map(a=><li key={a}>{a}</li>)}</ul></div><small>{hoursText(w.minutes)}</small></li>)}</ul><label className="checkbox-label"><input type="checkbox" disabled={locked} checked={selected} onChange={e=>setSelected(e.target.checked)}/>Thêm chặng vào roadmap</label><label className="checkbox-label"><input type="checkbox" disabled={locked} checked={known} onChange={e=>setKnown(e.target.checked)}/>Tôi đã biết kỹ năng này</label>{message&&<p role="alert">{message}</p>}<div className="dialog-actions"><button className="secondary-button" disabled={busy} onClick={onClose}>Hủy</button><button className="primary-button" disabled={busy} onClick={()=>void apply()}><BookOpen size={16}/>{busy?'Đang lưu…':unsavedWorkspace?'Thử lưu lại':'Áp dụng và lưu'}</button></div></div></Dialog>;
}