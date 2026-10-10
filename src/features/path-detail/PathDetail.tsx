import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, Search } from 'lucide-react';
import { useApp, useWorkspace } from '../../app/context';
import { Badge, External } from '../../components/ui';
import { contentPacks } from '../../content';
import { paths } from '../../content/catalog';
import { hoursText } from '../../state';
import { StageDrawer } from './StageDrawer';

export function PathDetail() {
  const { state, toast } = useApp();
  const { workspace, selectedTrackId, status, dirty, error, unsavedWorkspace, actions } = useWorkspace();
  const [params, setParams] = useSearchParams();
  const pathId = params.get('id') || selectedTrackId?.split('.')[0] || 'backend';
  const pack = contentPacks.find(p => p.pathId === pathId);
  const remembered = workspace && Object.keys(workspace.drafts).reverse().find(id => id.startsWith(`${pathId}.`));
  const trackId = params.get('track') || (selectedTrackId?.startsWith(`${pathId}.`) ? selectedTrackId : remembered) || (pathId === 'backend' ? `backend.${state.stack}` : pack?.tracks[0]?.id) || '';
  const result = actions.resolveTrack(trackId);
  const resolved = result.ok && result.value.track.pathId === pathId ? result.value : null;
  const draft = actions.getDraft(trackId);
  const [tab, setTab] = useState('roadmap');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [inspect, setInspect] = useState<string | null>(null);
  const busy = status === 'loading' || status === 'saving' || !!unsavedWorkspace;
  useEffect(() => {
    if (status === 'loading' || !workspace || !resolved || unsavedWorkspace) return;
    actions.selectTrack(trackId);
  }, [actions, trackId, status === 'loading']);
  if (status === 'loading') return <div className="page" role="status">Đang tải lựa chọn đã lưu…</div>;
  if (!workspace) return <div className="page"><p role="alert">{error?.issues.map(i => i.message).join(' ') || 'Không tải được dữ liệu.'}</p><button className="secondary-button" onClick={() => void actions.reloadWorkspace()}>Thử tải lại</button></div>;
  if (!pack || !resolved || !draft) return <div className="page"><Link className="back-link" to="/explore"><ArrowLeft size={14}/> Explore paths</Link><h1>Chưa mở được nhánh này.</h1><p role="alert">{result.ok ? 'Nhánh không thuộc hướng đang xem.' : result.issues.map(i => i.message).join(' ')}</p><p>Chọn một hướng và nhánh có nội dung trong Explore.</p></div>;
  const path = paths.find(p => p.id === pathId)!;
  const plannedStages = resolved.stages.filter(s => draft.selectedStageIds.includes(s.id) && !draft.knownStageIds.includes(s.id));
  const plannedMinutes = plannedStages.reduce((total, stage) => total + stage.work.reduce((n, work) => n + work.minutes, 0), 0);
  const phaseLabels = { foundation: 'Nền tảng', build: 'Thực hành', ship: 'Ứng dụng', expand: 'Mở rộng' };
  const resources = resolved.resources.filter(r => `${r.title} ${r.provider} ${r.accessNote}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && (language === 'all' || r.language === language) && (!freeOnly || r.cost === 'free'));
  async function save() {
    const saved = unsavedWorkspace ? await actions.retrySave() : await actions.saveDraft();
    if (saved.ok) toast('Đã lưu lựa chọn');
  }
  function choose(id: string, nextPath = pathId) {
    if (busy) return;
    setParams({ id: nextPath, track: id }); setInspect(null); setTab('roadmap');
  }
  return <div className="page path-page learning-path">
    <Link className="back-link" to="/explore"><ArrowLeft size={16}/> Tất cả hướng học</Link>
    <header className="learning-page-heading"><div><h1>{path.name}</h1><p>{path.summary}</p></div></header>
    <section className="path-controls" aria-label="Lựa chọn lộ trình">
      <label>Hướng nghề nghiệp<select aria-label="Hướng nghề nghiệp" value={pathId} disabled={busy} onChange={e => { const next=contentPacks.find(p=>p.pathId===e.target.value)!; choose(next.tracks[0].id,next.pathId); }}>{contentPacks.map(p=><option key={p.pathId} value={p.pathId}>{paths.find(path=>path.id===p.pathId)?.name || p.pathId}</option>)}</select></label>
      <label>Nhánh học<select aria-label="Nhánh học" value={trackId} disabled={busy} onChange={e=>choose(e.target.value)}>{pack.tracks.map(t=><option value={t.id} key={t.id}>{t.label}</option>)}</select></label>
    </section>
    {error && <div className="soft-note" role="alert">{error.issues.map(i=>i.message).join(' ')} {status==='conflict' && <p>Dữ liệu ở tab khác đã thay đổi. Bản chưa lưu vẫn được giữ; tải lại chỉ sau khi bạn xác nhận bỏ bản đó.</p>}</div>}
    <div className="path-reference-row"><div className="path-references" aria-label="Roadmap tham khảo"><span>Tham khảo</span>{resolved.track.roadmapLinks.map(link=><External key={link.url} href={link.url}>{link.label}</External>)}</div><div className="path-save-action"><span role="status">{dirty?'Có thay đổi chưa lưu':'Đã lưu lựa chọn'}</span><button className="secondary-button" disabled={status==='saving'} onClick={()=>void save()}>{status==='saving'?'Đang lưu…':unsavedWorkspace?'Thử lưu lại':'Lưu lựa chọn'}</button></div></div>
    <div className="tabs" role="tablist" aria-label="Thông tin lộ trình">{[{id:'roadmap',label:'Lộ trình',count:resolved.stages.length},{id:'resources',label:'Nguồn học',count:resolved.resources.length},{id:'credentials',label:'Chứng nhận',count:resolved.credentials.length}].map(t=><button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab===t.id} aria-controls="path-information" className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}>{t.label}<span>{t.count}</span></button>)}</div>
    <div role="tabpanel" id="path-information" aria-labelledby={`tab-${tab}`}>
      {tab==='roadmap' && <div className="path-curriculum"><aside className="path-plan-summary"><h2>Lộ trình của bạn</h2><p>{resolved.track.label}</p><dl><div><dt>Chặng cần học</dt><dd>{plannedStages.length}</dd></div><div><dt>Thực hành dự kiến</dt><dd>{hoursText(plannedMinutes)}</dd></div></dl><Link className="primary-button" to={`/roadmap?track=${encodeURIComponent(trackId)}`}>Tùy chỉnh lộ trình<ArrowRight size={17}/></Link><p className="path-summary-note"><BookOpen size={16}/>Chọn nội dung phù hợp và bỏ qua những gì bạn đã biết.</p></aside><div className="stage-list">{resolved.stages.map((stage,index)=><button key={stage.id} className={`stage-row ${draft.knownStageIds.includes(stage.id)?'known':''}`} onClick={()=>setInspect(stage.id)}><span className="stage-number">{draft.knownStageIds.includes(stage.id)?<Check size={18}/>:String(index+1).padStart(2,'0')}</span><div className="stage-content"><div className="stage-title"><h2>{stage.title}</h2>{draft.knownStageIds.includes(stage.id)?<Badge tone="green-badge">Đã biết</Badge>:!draft.selectedStageIds.includes(stage.id)?<Badge>Chưa chọn</Badge>:stage.optional?<Badge>Chọn thêm</Badge>:null}</div><p>{stage.description}</p><div className="stage-meta"><span>{phaseLabels[stage.phase]}</span><span>{stage.resourceIds.length} nguồn học</span><span>{hoursText(stage.work.reduce((n,w)=>n+w.minutes,0))} thực hành</span></div></div><ArrowRight size={18} aria-hidden="true"/></button>)}</div></div>}
      {tab==='resources' && <><div className="resource-toolbar"><label className="search-field"><Search size={17}/><input aria-label="Tìm nguồn học" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm chủ đề, nhà cung cấp…"/></label><select aria-label="Ngôn ngữ tài liệu" value={language} onChange={e=>setLanguage(e.target.value)}><option value="all">Mọi ngôn ngữ</option><option value="vi">Tiếng Việt</option><option value="en">Tiếng Anh</option></select><label className="checkbox-label"><input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/>Chỉ nguồn miễn phí</label></div><p className="catalog-caption">{resources.length} nguồn học · Bộ lọc không thay đổi nguồn trong lựa chọn học đã lưu.</p><div className="resource-grid">{resources.map(r=><article key={r.id} className="resource-card"><h3><External href={r.url}>{r.title}</External></h3><p>{r.accessNote}</p><div className="tag-list"><span>{{article:'Bài viết',video:'Video',course:'Khóa học',exercise:'Bài tập',lab:'Thực hành'}[r.format]}</span><span>{r.language==='vi'?'Tiếng Việt':'Tiếng Anh'}</span><span>{r.cost==='free'?'Miễn phí':r.cost==='mixed'?'Có phần cần trả phí':r.cost==='paid'?'Có phí':'Phí chưa xác minh'}</span></div><p className="source-note">Nguồn: <strong>{r.provider}</strong></p></article>)}</div>{!resources.length&&<div className="empty-inline">Chưa có nguồn học khớp các bộ lọc.<button className="text-link" onClick={()=>{setQuery('');setLanguage('all');setFreeOnly(false);}}>Xóa bộ lọc</button></div>}</>}
      {tab==='credentials' && <section className="credential-catalog" aria-label="Mục tiêu chứng nhận">
        <div className="credential-intro"><div><h2>Chọn mục tiêu tiếp theo.</h2><p>Lưu chứng nhận bạn muốn theo đuổi để xem lại trong Profile.</p></div><p className="source-note">Mỗi đơn vị có yêu cầu cấp riêng. Hoàn thành roadmap không tự cấp chứng nhận.</p></div>
        <div className="credential-grid">{resolved.credentials.map(c => {
          const saved = workspace.savedCredentialIds.includes(c.id);
          return <article className={`credential-card ${saved ? 'is-saved' : ''}`} key={c.id}>
            <div className="credential-labels"><span>{{course_certificate:'Chứng nhận khóa học',program_certificate:'Chứng nhận chương trình',exam_certificate:'Chứng chỉ thi',skill_assessment:'Đánh giá kỹ năng'}[c.kind]}</span><span className={c.cost==='free'?'credential-free':''}>{c.cost==='free'?'Miễn phí':c.cost==='paid'?'Có phí':'Xem phí tại nguồn'}</span></div>
            <h3>{c.name}</h3>
            <p className="credential-provider">Đơn vị cấp: <strong>{c.provider}</strong></p>
            <dl className="credential-requirements"><div><dt>Nền tảng cần có</dt><dd>{c.prerequisites}</dd></div><div><dt>Yêu cầu để nhận</dt><dd>{c.requirements}</dd></div></dl>
            <div className="credential-actions"><External href={c.url}>Xem chương trình & điều kiện</External><button className={`secondary-button credential-save ${saved?'is-saved':''}`} disabled={busy} aria-pressed={saved} aria-label={`${saved?'Bỏ lưu':'Lưu mục tiêu'} ${c.name}`} onClick={async()=>{const result=await actions.toggleCredential(c.id);if(result.ok)toast(saved?'Đã bỏ mục tiêu chứng nhận':'Đã lưu mục tiêu chứng nhận');}}><Bookmark size={17} fill={saved?'currentColor':'none'} aria-hidden="true"/>{saved?'Đã lưu mục tiêu':'Lưu mục tiêu'}</button></div>
          </article>;
        })}</div>
        {!resolved.credentials.length && <div className="empty-inline">Chưa có chứng nhận riêng được chọn cho nhánh này. Bạn vẫn có thể học và xây kế hoạch.</div>}
      </section>}
    </div>
    {inspect && resolved.stages.find(s=>s.id===inspect) && <StageDrawer key={`${trackId}/${inspect}`} trackId={trackId} stage={resolved.stages.find(s=>s.id===inspect)!} onClose={()=>setInspect(null)}/>}
  </div>;
}
