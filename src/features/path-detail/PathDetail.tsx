import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookOpen, Check, Search } from 'lucide-react';
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
    if (!workspace.drafts[trackId]) actions.updateDraft(trackId, { goal: resolved.track.portfolio.title });
  }, [actions, trackId, status === 'loading']);
  if (status === 'loading') return <div className="page" role="status">Đang tải lựa chọn đã lưu…</div>;
  if (!workspace) return <div className="page"><p role="alert">{error?.issues.map(i => i.message).join(' ') || 'Không tải được dữ liệu.'}</p><button className="secondary-button" onClick={() => void actions.reloadWorkspace()}>Thử tải lại</button></div>;
  if (!pack || !resolved || !draft) return <div className="page"><Link className="back-link" to="/explore"><ArrowLeft size={14}/> Explore paths</Link><h1>Chưa mở được nhánh này.</h1><p role="alert">{result.ok ? 'Nhánh không thuộc hướng đang xem.' : result.issues.map(i => i.message).join(' ')}</p><p>Chọn một hướng và nhánh có nội dung trong Explore.</p></div>;
  const path = paths.find(p => p.id === pathId)!;
  const resources = resolved.resources.filter(r => `${r.title} ${r.provider} ${r.accessNote}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && (language === 'all' || r.language === language) && (!freeOnly || r.cost === 'free'));
  async function save() {
    const saved = unsavedWorkspace ? await actions.retrySave() : await actions.saveDraft();
    if (saved.ok) toast('Đã lưu lựa chọn trên thiết bị');
  }
  function choose(id: string, nextPath = pathId) {
    if (busy) return;
    setParams({ id: nextPath, track: id }); setInspect(null); setTab('roadmap');
  }
  return <div className="page path-page">
    <Link className="back-link" to="/explore"><ArrowLeft size={14}/> Explore paths</Link>
    <div className="path-heading"><div><div className="eyebrow">YOUR NEXT CHAPTER</div><h1>{path.name}<em>.</em></h1><p>{path.summary}<br/>Lộ trình đang xem: <strong>{resolved.track.label}</strong></p></div></div>
    <section className="preference-strip" aria-label="Lựa chọn lộ trình">
      <label>Hướng nghề nghiệp<select aria-label="Hướng nghề nghiệp" value={pathId} disabled={busy} onChange={e => { const next=contentPacks.find(p=>p.pathId===e.target.value)!; choose(next.tracks[0].id,next.pathId); }}>{contentPacks.map(p=><option key={p.pathId} value={p.pathId}>{paths.find(path=>path.id===p.pathId)?.name || p.pathId}</option>)}</select></label>
      <label>Nhánh học<select aria-label="Nhánh học" value={trackId} disabled={busy} onChange={e=>choose(e.target.value)}>{pack.tracks.map(t=><option value={t.id} key={t.id}>{t.label}</option>)}</select></label>
      <button className="secondary-button" disabled={status==='saving'} onClick={()=>void save()}>{status==='saving'?'Đang lưu…':unsavedWorkspace?'Thử lưu lại':'Lưu lựa chọn'}</button>
      <span role="status" className="subtle-copy">{dirty?'Có thay đổi chưa lưu':'Lựa chọn đã lưu trên thiết bị'}</span>
    </section>
    {error && <div className="soft-note" role="alert">{error.issues.map(i=>i.message).join(' ')} {status==='conflict' && <p>Dữ liệu ở tab khác đã thay đổi. Bản chưa lưu vẫn được giữ; tải lại chỉ sau khi bạn xác nhận bỏ bản đó.</p>}</div>}
    <section className="reference-roadmaps" aria-label="Roadmap tham khảo"><div><span className="eyebrow">THE BIGGER PICTURE</span><h2>Roadmap tham khảo</h2><p>Mở nguồn chính thức ở tab mới.</p></div><div className="reference-roadmap-links">{resolved.track.roadmapLinks.map(link=><External key={link.url} href={link.url} className="secondary-button">{link.label}<ArrowUpRight size={14}/></External>)}</div></section>
    <div className="curriculum-note"><strong>Mục tiêu Portfolio: {resolved.track.portfolio.title}</strong><ul>{resolved.track.portfolio.acceptance.map(a=><li key={a}>{a}</li>)}</ul></div>
    <div className="tabs" role="tablist" aria-label="Thông tin lộ trình">{[{id:'roadmap',label:'Roadmap',count:resolved.stages.length},{id:'resources',label:'Nguồn học',count:resolved.resources.length},{id:'credentials',label:'Chứng nhận',count:resolved.credentials.length}].map(t=><button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab===t.id} aria-controls="path-information" className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}>{t.label}<span>{t.count}</span></button>)}</div>
    <div role="tabpanel" id="path-information" aria-labelledby={`tab-${tab}`}>
      {tab==='roadmap' && <div className="roadmap-layout"><div className="module-timeline">{resolved.stages.map((stage,index)=><button key={stage.id} className={`module-node ${draft.knownStageIds.includes(stage.id)?'known':''}`} onClick={()=>setInspect(stage.id)}><span className="node-number">{draft.knownStageIds.includes(stage.id)?<Check size={17}/>:String(index+1).padStart(2,'0')}</span><div className="node-content"><div className="node-title"><h3>{stage.title}</h3>{stage.optional&&<Badge>Chọn thêm</Badge>}{!draft.selectedStageIds.includes(stage.id)&&<Badge>Chưa thêm</Badge>}</div><p>{stage.description}</p><div className="node-meta"><span>{stage.phase}</span><span>{stage.resourceIds.length} nguồn học</span><span>{hoursText(stage.work.reduce((n,w)=>n+w.minutes,0))}</span></div></div><ArrowUpRight size={18}/></button>)}</div><aside className="roadmap-aside"><span className="eyebrow">A PLACE TO START</span><h2>{resolved.track.label}</h2><p>Chọn chặng, nguồn và kỹ năng đã biết trước khi tạo lịch.</p><Link className="primary-button" to={`/roadmap?track=${encodeURIComponent(trackId)}`}>Tùy chỉnh roadmap<ArrowRight size={17}/></Link><p className="aside-tip"><BookOpen size={15}/> Khám phá hướng khác giữ nguyên kế hoạch đang học.</p></aside></div>}
      {tab==='resources' && <><div className="resource-toolbar"><label className="search-field"><Search size={17}/><input aria-label="Tìm nguồn học" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm chủ đề, nhà cung cấp…"/></label><select aria-label="Ngôn ngữ tài liệu" value={language} onChange={e=>setLanguage(e.target.value)}><option value="all">Mọi ngôn ngữ</option><option value="vi">Tiếng Việt</option><option value="en">Tiếng Anh</option></select><label className="checkbox-label"><input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/>Chỉ nguồn miễn phí</label></div><p className="catalog-caption">{resources.length} nguồn học · Bộ lọc không tự đổi nguồn trong draft.</p><div className="resource-grid">{resources.map(r=><article key={r.id} className="resource-card"><span className="eyebrow">{r.provider}</span><h3><External href={r.url}>{r.title}</External></h3><p>{r.accessNote}</p><div className="tag-list"><span>{r.language==='vi'?'Tiếng Việt':'Tiếng Anh'}</span><span>{r.cost==='free'?'Miễn phí':r.cost==='mixed'?'Có phần cần trả phí':r.cost==='paid'?'Có phí':'Phí chưa xác minh'}</span></div><p className="source-note">{r.checkedAt?`Ngày đối chiếu: ${r.checkedAt}`:'Chưa xác minh lại thông tin; kiểm tra điều kiện tại nguồn.'}</p></article>)}</div>{!resources.length&&<div className="empty-inline">Chưa có nguồn học khớp các bộ lọc.<button className="text-link" onClick={()=>{setQuery('');setLanguage('all');setFreeOnly(false);}}>Xóa bộ lọc</button></div>}</>}
      {tab==='credentials' && <><p className="source-note">Mục tiêu bổ trợ, không đồng nghĩa hoàn thành roadmap sẽ được cấp chứng nhận. Xem chương trình và chi phí tại đơn vị cung cấp.</p><div className="credential-grid">{resolved.credentials.map(c=>{const saved=workspace.savedCredentialIds.includes(c.id);return <article className="credential-card" key={c.id}><div className="card-top"><span className="eyebrow">{c.provider}</span><button className={`icon-button ${saved?'bookmarked':''}`} disabled={busy} aria-label={`${saved?'Bỏ lưu':'Lưu'} ${c.name}`} onClick={async()=>{const result=await actions.toggleCredential(c.id);if(result.ok)toast(saved?'Đã bỏ mục tiêu chứng nhận':'Đã lưu mục tiêu chứng nhận');}}><Bookmark size={19} fill={saved?'currentColor':'none'}/></button></div><h3>{c.name}</h3><p>{c.prerequisites}</p><p>{c.requirements}</p><div className="tag-list"><span>{c.cost==='free'?'Miễn phí':c.cost==='paid'?'Có phí':'Phí chưa xác minh'}</span></div><External href={c.url}>Xem điều kiện</External><p className="source-note">{c.checkedAt?`Ngày đối chiếu: ${c.checkedAt}`:'Chưa xác minh lại thông tin.'}</p></article>;})}</div>{!resolved.credentials.length&&<div className="empty-inline">Portfolio là đầu ra chính của nhánh này; không yêu cầu chứng nhận riêng cho đúng cặp công nghệ.</div>}</>}
    </div>
    {inspect && resolved.stages.find(s=>s.id===inspect) && <StageDrawer key={`${trackId}/${inspect}`} trackId={trackId} stage={resolved.stages.find(s=>s.id===inspect)!} onClose={()=>setInspect(null)}/>}
  </div>;
}