import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';

import { useApp, useWorkspace } from '../../app/context';
import { faculties } from '../../content/catalog';
import { contentPacks } from '../../content';

import { summarizeActivity } from '../../domain/activity';
import { validateProfile } from '../../domain/validate';
import type { BackupFile, OperationResult, Workspace } from '../../domain/contracts';
import { StudyActivity } from '../../components/StudyActivity';
import { Dialog, External } from '../../components/ui';
import type { PlanMeta } from '../../state';

function download(name:string,text:string){
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function ProfileV2(){
  const {workspace,status,error,dirty,unsavedWorkspace,transfer,actions}=useWorkspace();
  const {toast}=useApp();
  const [form,setForm]=useState<Workspace['profile']>({displayName:'',majorId:null,timeZone:'UTC'});
  const [message,setMessage]=useState('');
  const [file,setFile]=useState<{raw:string;file:BackupFile;name:string}|null>(null);
  const [planActions,setPlanActions]=useState<Record<string,'skip'|'copy'>>({});
  const [importProfile,setImportProfile]=useState(false),[importPreferences,setImportPreferences]=useState(false),[importDrafts,setImportDrafts]=useState(false),[importCredentials,setImportCredentials]=useState(false);
  const [useMetadata,setUseMetadata]=useState(false);
  const [metadata,setMetadata]=useState<PlanMeta>({stack:'node',goal:'Kế hoạch cũ',hours:5,startDate:'2026-10-05'});
  const [discardOpen,setDiscardOpen]=useState(false);
  const [section,setSection]=useState<'activity'|'profile'|'data'>('activity');
  useEffect(()=>{if(workspace)setForm({...workspace.profile});},[workspace?.profile.displayName,workspace?.profile.majorId,workspace?.profile.timeZone]);
  const busy=status==='loading'||status==='saving';
  const blocked=busy||!!transfer||!!unsavedWorkspace;
  function report<T>(result:OperationResult<T>):boolean{setMessage(result.ok?'':result.issues.map(i=>i.message).join(' '));return result.ok;}
  if(!workspace)return <div className="page"><h1>Profile</h1><p role="alert">{error?.issues.map(i=>i.message).join(' ')||'Đang tải hồ sơ…'}</p><button className="secondary-button" disabled={busy} onClick={()=>void actions.reloadWorkspace()}>Thử tải lại</button></div>;
  const activity=summarizeActivity(workspace.plans);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:workspace.profile.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part=(name:string)=>today.find(p=>p.type===name)?.value;
  const todayKey=`${part('year')}-${part('month')}-${part('day')}`;
  async function save(){
    const checked=validateProfile({...form,displayName:form.displayName.trim()},faculties.flatMap(f=>f.majors.map(m=>m.id)));
    if(!report(checked)||!checked.ok)return;
    const result=await actions.saveProfile(checked.value);if(report(result)&&result.ok)toast('Đã lưu hồ sơ trên thiết bị');
  }
  function exportFile(){const result=actions.exportBackupFile();if(report(result)&&result.ok){download(`uitplans-${todayKey}.json`,result.value.json);toast(result.value.containsUnsavedChanges?'Đã xuất bản sao gồm thay đổi chưa lưu':'Đã xuất bản sao workspace');}}
  function exportLegacy(){const result=actions.getLegacyRaw();if(report(result)&&result.ok){if(result.value===null){setMessage('Không có dữ liệu v1 trên trình duyệt này.');return;}download(`uitplans-v1-${todayKey}.json`,result.value);}}
  async function chooseFile(selected:File|undefined){
    setFile(null);setPlanActions({});setMessage('');if(!selected)return;
    if(selected.size>10*1024*1024){setMessage('File lớn hơn 10 MB; chọn bản sao lưu nhỏ hơn.');return;}
    try{const raw=await selected.text(),parsed=actions.inspectBackup(raw);if(report(parsed)&&parsed.ok)setFile({raw,file:parsed.value,name:selected.name});}
    catch{setMessage('Không đọc được file; dữ liệu hiện tại vẫn được giữ.');}
  }
  async function migrate(){const result=await actions.prepareMigration({mode:'append',importProfile,importPreferences,importDraft:importDrafts,importCredentials},useMetadata?metadata:undefined);if(report(result)&&result.ok&&result.value.kind==='already-imported')toast('Bản dữ liệu v1 này đã được chuyển; không nhập trùng');}
  async function previewImport(){if(file)report(await actions.prepareImport(file.raw,{planActions,importProfile,importPreferences,importDrafts,importCredentials}));}
  const candidate=transfer?.value.candidate;
  const legacy=actions.getLegacyRaw();
  const knownCredentials=new Map(contentPacks.flatMap(p=>p.credentials).map(c=>[c.id,c]));
  const choices=[{checked:importProfile,set:setImportProfile,label:'Nhập hồ sơ từ nguồn'},{checked:importPreferences,set:setImportPreferences,label:'Nhập tùy chọn nguồn học'},{checked:importDrafts,set:setImportDrafts,label:'Nhập lựa chọn lộ trình'},{checked:importCredentials,set:setImportCredentials,label:'Nhập mục tiêu chứng nhận'}];
  return <div className="page profile-page">
    <div className="page-heading"><div><h1>Profile<span className="rust-text">.</span></h1><p>Nhìn lại nhịp học, chuẩn bị cho bước tiếp theo.</p></div><Link className="secondary-button" to="/plan">Mở My plan<ArrowRight size={16}/></Link></div>
    <nav className="profile-section-nav" aria-label="Các mục hồ sơ">{([{id:'activity',label:'Activity'},{id:'profile',label:'Profile'},{id:'data',label:'Data'}] as const).map(item=><button key={item.id} type="button" aria-pressed={section===item.id} aria-controls={`profile-${item.id}`} onClick={()=>setSection(item.id)}>{item.label}</button>)}</nav>
    {(message||error)&&<p className="form-error" role="alert">{message||error?.issues.map(i=>i.message).join(' ')}</p>}
    {(dirty||unsavedWorkspace)&&<div className="soft-note"><p>Có thay đổi chưa lưu. Xuất bản sao trước khi bỏ hoặc tải lại.</p><button className="secondary-button" disabled={busy||!!transfer} onClick={()=>{void(unsavedWorkspace?actions.retrySave():actions.saveDraft()).then(report);}}>Thử lưu lại thay đổi</button>{' '}<button className="secondary-button" onClick={exportFile}>Xuất bản đang sửa</button>{' '}<button className="secondary-button" disabled={busy} onClick={()=>setDiscardOpen(true)}>Bỏ thay đổi và tải lại</button></div>}
    <section id="profile-activity" className="profile-panel" aria-label="Activity" hidden={section!=='activity'}><StudyActivity tasks={[]} completionDays={activity.days} undatedCount={activity.undatedTasks} todayKey={todayKey}/><p className="profile-history-note">Tổng hợp từ tất cả kế hoạch. Bỏ đánh dấu hoàn thành sẽ cập nhật lại nhịp học.</p></section>
    <section id="profile-profile" className="profile-panel" aria-label="Profile" hidden={section!=='profile'}><div className="profile-layout"><form className="profile-paper" onSubmit={e=>{e.preventDefault();void save();}}><h2>Hồ sơ học tập</h2><p className="source-note">Ngành học giúp ưu tiên gợi ý. Tên hiển thị là tùy chọn.</p><fieldset disabled={blocked} style={{border:0,padding:0,margin:0}}>
      <label>Tên hiển thị<input maxLength={60} placeholder="Bạn muốn được gọi là gì?" value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})}/></label>
      <label>Ngành đang theo học<select aria-label="Ngành đang theo học" value={form.majorId??''} onChange={e=>setForm({...form,majorId:e.target.value||null})}><option value="">Chưa chọn ngành</option>{form.majorId&&!faculties.some(f=>f.majors.some(m=>m.id===form.majorId))&&<option value={form.majorId}>{form.majorId} (từ bản cũ)</option>}{faculties.map(f=><optgroup key={f.id} label={f.name}>{f.majors.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>)}</select></label>
      <details className="profile-options"><summary>Tùy chọn nâng cao</summary><label>Múi giờ<input aria-label="Múi giờ" value={form.timeZone} onChange={e=>setForm({...form,timeZone:e.target.value})} list="profile-zones"/><datalist id="profile-zones">{['Asia/Ho_Chi_Minh','Asia/Bangkok','Asia/Tokyo','UTC','America/New_York'].map(z=><option key={z} value={z}/>)}</datalist></label><p className="source-note">Múi giờ áp dụng cho lần ghi nhận mới; ngày hoàn thành cũ giữ nguyên.</p></details>
      <div className="profile-form-actions"><button className="primary-button" type="submit">Lưu hồ sơ</button><button className="quiet-button" type="button" onClick={()=>{setForm({...workspace.profile});setMessage('');}}>Hủy thay đổi</button></div></fieldset>
    </form>
    <section className="profile-credentials"><div className="profile-section-heading"><h2>Mục tiêu chứng nhận</h2><span className="catalog-total">{workspace.savedCredentialIds.length} đã lưu</span></div>{workspace.savedCredentialIds.length?<ul className="profile-credential-list">{workspace.savedCredentialIds.map(id=>{const c=knownCredentials.get(id);return <li key={id}>{c?<External href={c.url}>{c.name}<small>{c.provider}</small></External>:`${id} — nguồn không còn trong danh mục; mục tiêu vẫn được giữ.`}</li>})}</ul>:<p className="profile-credential-empty">Chưa lưu chứng nhận. Xem điều kiện và chọn mục tiêu phù hợp với hướng học của bạn.</p>}<Link className="text-link" to="/path">Khám phá chứng nhận<ArrowRight size={16}/></Link></section>
    </div></section>
    <section id="profile-data" className="profile-panel profile-backup" aria-label="Data" hidden={section!=='data'}><header className="profile-data-heading"><h2>Sao lưu & chuyển thiết bị</h2><p>Dữ liệu lưu trên trình duyệt này. Giữ một bản sao để tiếp tục ở nơi khác.</p></header><div className="backup-body"><section className="backup-export"><Download size={22} aria-hidden="true"/><h3>Giữ một bản sao</h3><p>Tải hồ sơ và kế hoạch hiện tại thành file JSON.</p><button className="secondary-button" onClick={exportFile}>Xuất file sao lưu</button></section>
      <fieldset className="backup-import" disabled={blocked} style={{border:0,padding:0}}><legend>Nhập bản sao lưu</legend><p>Chọn file, xem trước rồi xác nhận. Kế hoạch hiện tại được giữ.</p>
      <label>File sao lưu JSON<input aria-label="File sao lưu JSON" type="file" accept="application/json,.json" onChange={e=>void chooseFile(e.target.files?.[0])}/></label>
      {file&&<><p>{file.name}: {file.file.workspace.plans.length} kế hoạch.</p>{file.file.workspace.plans.map(p=><label key={p.id}>{p.name}<select aria-label={`Cách nhập ${p.name}`} value={planActions[p.id]??''} onChange={e=>{const next={...planActions};if(e.target.value)next[p.id]=e.target.value==='copy'?'copy':'skip';else delete next[p.id];setPlanActions(next);}}><option value="">Mặc định: thêm mới, bỏ qua ID trùng</option><option value="copy">Nhập thành bản sao với ID mới</option><option value="skip">Bỏ qua kế hoạch này</option></select></label>)}<button className="secondary-button" onClick={()=>void previewImport()}>Xem trước nhập file</button></>}
      {file&&<details className="import-options"><summary>Tùy chọn nhập thêm</summary><p>Kế hoạch luôn được xem trước. Các thông tin dưới đây chỉ nhập khi bạn chọn.</p>{choices.map(choice=><label key={choice.label} className="checkbox-label"><input type="checkbox" checked={choice.checked} onChange={e=>choice.set(e.target.checked)}/>{choice.label}</label>)}</details>}
      {(!legacy.ok||legacy.value!==null)&&<details className="legacy-transfer"><summary>Khôi phục từ phiên bản cũ</summary><p>{!legacy.ok?'Không đọc được dữ liệu cũ; hãy thử lại.':'Tìm thấy kế hoạch từ phiên bản trước. Bản gốc vẫn được giữ sau khi chuyển.'}</p><button className="secondary-button" onClick={()=>void migrate()}>Xem trước kế hoạch cũ</button>{' '}<button className="quiet-button" onClick={exportLegacy}>Tải bản gốc</button>
      <label className="checkbox-label"><input type="checkbox" checked={useMetadata} onChange={e=>setUseMetadata(e.target.checked)}/>Cung cấp bối cảnh nếu plan cũ chưa có thông tin</label>{useMetadata&&<><label>Stack của plan cũ<select value={metadata.stack} onChange={e=>setMetadata({...metadata,stack:e.target.value==='python'?'python':e.target.value==='java'?'java':'node'})}><option value="node">Node.js</option><option value="python">Python</option><option value="java">Java</option></select></label><label>Mục tiêu plan cũ<input value={metadata.goal} onChange={e=>setMetadata({...metadata,goal:e.target.value})}/></label><label>Giờ/tuần plan cũ<input type="number" min={2} max={20} value={metadata.hours} onChange={e=>setMetadata({...metadata,hours:Number(e.target.value)})}/></label><label>Ngày bắt đầu plan cũ<input type="date" value={metadata.startDate} onChange={e=>setMetadata({...metadata,startDate:e.target.value})}/></label></>}
      </details>}</fieldset></div></section>
    {discardOpen&&<Dialog title="Bỏ thay đổi chưa lưu?" onClose={()=>setDiscardOpen(false)}><div className="dialog-body"><p>Tải bản đã lưu sẽ bỏ bản đang sửa. Bạn có thể xuất bản sao trước.</p><button className="secondary-button" disabled={busy} onClick={()=>setDiscardOpen(false)}>Giữ thay đổi</button>{' '}<button className="primary-button" disabled={busy} onClick={()=>{void actions.reloadWorkspace(true).then(r=>{if(report(r)&&r.ok)setDiscardOpen(false);});}}>Xác nhận bỏ thay đổi</button></div></Dialog>}
    {transfer&&candidate&&<Dialog title={transfer.kind==='migration'?'Chuyển dữ liệu v1?':'Nhập bản sao lưu?'} onClose={()=>{report(actions.cancelTransfer());}}><div className="dialog-body"><p>Trước: {workspace.plans.length} kế hoạch. Sau xác nhận: {candidate.plans.length} kế hoạch. Hồ sơ sau nhập: {candidate.profile.displayName||'Chưa đặt tên'}.</p>
      {transfer.kind==='migration'?<><p>{transfer.value.preview.summary.taskCount} việc, {transfer.value.preview.summary.doneCount} việc hoàn thành; nguồn v1 vẫn nguyên trạng.</p>{transfer.value.preview.warnings.map((w,i)=><p key={i} className="source-note">{w.message}</p>)}</>:<><p>Thêm {transfer.value.addedPlanIds.length}, bỏ qua {transfer.value.skippedPlanIds.length}, sao chép {transfer.value.copiedPlans.length} kế hoạch.</p>{transfer.value.skippedDraftTrackIds.length>0&&<p>Giữ các draft đang có: {transfer.value.skippedDraftTrackIds.join(', ')}.</p>}</>}
      {(message||error)&&<p role="alert">{message||error?.issues.map(i=>i.message).join(' ')}</p>}<p>Chỉ ghi sau khi xác nhận. Nếu lỗi, bản đề xuất và các ID được giữ để thử lại hoặc xuất.</p><div className="dialog-actions"><button className="secondary-button" disabled={busy} onClick={()=>report(actions.cancelTransfer())}>Hủy nhập dữ liệu</button><button className="secondary-button" onClick={exportFile}>Xuất bản đề xuất</button><button className="primary-button" disabled={busy} onClick={()=>{void actions.confirmTransfer().then(r=>{if(report(r)&&r.ok){setFile(null);toast('Đã lưu dữ liệu nhập trên thiết bị');}});}}>{status==='saving'?'Đang lưu…':'Xác nhận nhập dữ liệu'}</button></div></div></Dialog>}
  </div>;
}
