import { contentPacks } from '../../content';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, X, Search, ChevronDown, Leaf } from 'lucide-react';
import { majorName } from '../../data';
import { faculties, paths } from '../../content/catalog';
import { catalogCheckedAt, catalogScopeNote, majorCoverageNotes, majorProfiles, majorPaths, relationRank } from '../../content/catalog';
import { ArrowDownRight as ArrowDownRightIcon } from 'lucide-react';
import { useApp } from '../../app/context';
import { Badge, External, RoadmapLinks, Dialog } from '../../components/ui';
export function Explore() {
  const { state, update } = useApp();
  const [preview, setPreview] = useState<(typeof paths)[number] | null>(null);
  const [pathQuery, setPathQuery] = useState('');
  const [pathCategory, setPathCategory] = useState('all');
  const [nearOnly, setNearOnly] = useState(false);
  useEffect(() => { if (!state.major) setNearOnly(false); }, [state.major]);
  const currentFaculty = faculties.find(f => f.majors.some(m => m.id === state.major));
  const browseMajors = faculties.find(f => f.id === state.browseFaculty)?.majors.map(m => m.id);
  const categoryNames: Record<string, string> = { SOFTWARE: 'Phần mềm', DATA: 'Dữ liệu', AI: 'Trí tuệ nhân tạo', BUSINESS: 'Nghiệp vụ & kinh doanh', INFRASTRUCTURE: 'Hạ tầng', SECURITY: 'An toàn thông tin', HARDWARE: 'Phần cứng', DESIGN: 'Thiết kế & truyền thông', RESEARCH: 'Nghiên cứu' };
  const visiblePaths = paths.filter(p => !browseMajors || [...p.majors, ...p.relatedMajors].some(m => browseMajors.includes(m))).filter(p => !nearOnly || relationRank(p, state.major) > 0).filter(p => pathCategory === 'all' || p.category === pathCategory).filter(p => `${p.name} ${p.summary} ${p.tags.join(' ')} ${p.foundations}`.toLocaleLowerCase().includes(pathQuery.trim().toLocaleLowerCase())).sort((a, b) => relationRank(b, state.major) - relationRank(a, state.major));
  const clearFilters = () => { setPathQuery(''); setPathCategory('all'); setNearOnly(false); update({ browseFaculty: 'all' }); };
  return <div className="page explore-page">
    <section className="explore-hero" aria-label="Bắt đầu khám phá">
      <header className="explore-intro">
        <h1>Tìm hướng của bạn.<br/><span>Học theo cách của bạn.</span></h1>
        <p>Từ điều bạn muốn làm đến những gì cần học. Khám phá hướng nghề nghiệp, chọn kỹ năng và biến lộ trình thành kế hoạch từng tuần.</p>
        <div className="explore-hero-actions"><button className="primary-button" onClick={() => document.getElementById('directions')?.scrollIntoView({behavior:'smooth'})}>Khám phá hướng học<ArrowRight size={18}/></button><Link className="text-link" to="/plan">Kế hoạch của tôi<ArrowUpRight size={16}/></Link></div>
        <p className="explore-scope">12 ngành <span>·</span> {paths.length} hướng học <span>·</span> {contentPacks.reduce((total,pack)=>total+pack.tracks.length,0)} nhánh lựa chọn</p>
      </header>
      <div className="explore-start">
        <section className="profile-strip" aria-label="Hồ sơ ngành hiện tại">
          <div className="profile-intro"><span className="explore-step" aria-hidden="true">1</span><div><h2>Bạn đang học ngành nào?</h2><p>Để gợi ý gần với nền tảng của bạn. Bạn vẫn có thể khám phá mọi hướng.</p></div></div>
          <div className="profile-fields"><label>Khoa hiện tại<select value={currentFaculty?.id || ''} onChange={e => update({ major: faculties.find(f => f.id === e.target.value)?.majors[0].id || '' })}><option value="">Chưa chọn / Bỏ qua</option>{faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label><label>Ngành đang học<select aria-label="Ngành đang học" value={state.major} onChange={e => update({ major: e.target.value })}><option value="">Chưa chọn ngành</option>{(currentFaculty?.majors || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label></div>
        </section>
        <ol className="explore-next-steps" start={2} aria-label="Các bước tiếp theo"><li><span>Chọn hướng & kỹ năng</span><small>Giữ những gì cần học, bỏ qua điều đã biết.</small></li><li><span>Lên kế hoạch mỗi tuần</span><small>Học theo thời gian bạn có, theo dõi việc đã xong.</small></li></ol>
      </div>
    </section>
    {majorCoverageNotes[state.major] && <div className="soft-note coverage-note"><strong>Phạm vi ngành đang học</strong><p>{majorCoverageNotes[state.major]}</p></div>}

    <div id="directions" className="section-heading catalog-heading"><div><h2>Hướng học</h2><p>Tìm một hướng bạn muốn khám phá. Ngành học không giới hạn lựa chọn của bạn.</p></div><span className="catalog-total">{paths.length} hướng</span></div>
    <div className="path-catalog-toolbar" role="search" aria-label="Lọc hướng học">
      <label className="search-field"><Search size={18} aria-hidden="true"/><input aria-label="Tìm hướng học" placeholder="Bạn muốn học gì? Backend, Data Scientist, UI/UX…" value={pathQuery} onChange={e => setPathQuery(e.target.value)}/></label>
      <label className="browse-select">Khám phá theo khoa<select value={state.browseFaculty} onChange={e => update({ browseFaculty:e.target.value })}><option value="all">Tất cả các khoa</option>{faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
      <label className="category-select">Nhóm hướng học<select aria-label="Nhóm hướng học" value={pathCategory} onChange={e => setPathCategory(e.target.value)}><option value="all">Tất cả nhóm</option>{Object.entries(categoryNames).filter(([id]) => paths.some(p => p.category===id)).map(([id,name]) => <option value={id} key={id}>{name}</option>)}</select></label>
      <label className="checkbox-label catalog-near"><input type="checkbox" checked={nearOnly} disabled={!state.major} onChange={e => setNearOnly(e.target.checked)}/><span>Liên quan tới ngành của tôi<small>{state.major ? majorName(state.major) : 'Chọn ngành ở phần đầu để dùng bộ lọc này'}</small></span></label>
    </div>
    <div className="catalog-caption"><span><strong>{visiblePaths.length}</strong> hướng phù hợp{visiblePaths.length!==paths.length && ` / ${paths.length} hướng`}</span>{!!visiblePaths.length && (pathQuery || pathCategory!=='all' || nearOnly || state.browseFaculty!=='all') ? <button className="quiet-button" onClick={clearFilters}>Xóa bộ lọc hướng học<X size={14}/></button> : <span>Mở một hướng để xem kỹ năng, nguồn học và chứng nhận.</span>}</div>
    <div className="path-grid">{visiblePaths.map((path,index) => {
      const pack=contentPacks.find(item=>item.pathId===path.id);
      return <article key={path.id} className="path-card">
        <span className="path-frame-number" aria-hidden="true">{index+1}</span>
        <div className="path-frame-content">
          <h3>{path.name}</h3><p>{path.summary}</p>
          <div className="card-top"><span className="card-category">{categoryNames[path.category]}</span>{pack && <Badge tone="green-badge">{pack.tracks.length} nhánh học</Badge>}{path.tags.map(tag=><span className="path-topic" key={tag}>{tag}</span>)}</div>
          <div className="card-reference-links" aria-label={`Nguồn tham khảo cho ${path.name}`}><span>Tham khảo</span>{path.roadmaps.map(link=><External key={link.url} href={link.url}>{link.label}</External>)}</div>
        </div>
        {pack ? <Link className="card-action" aria-label={`Xem lộ trình ${path.name}`} to={`/path?id=${path.id}`}>Xem lộ trình<ArrowRight size={18}/></Link> : <button className="card-action" onClick={()=>setPreview(path)}>Xem tổng quan<ArrowRight size={18}/></button>}
      </article>;
    })}</div>
    {!visiblePaths.length && <div className="empty-inline">{nearOnly && majorCoverageNotes[state.major] ? majorCoverageNotes[state.major] : 'Chưa có hướng học khớp các bộ lọc.'}<button className="text-link" onClick={clearFilters}>Xóa bộ lọc hướng học <ArrowRight size={15} /></button></div>}
    <details className="major-matrix"><summary><span className="matrix-summary-copy"><strong>Bảng ngành → hướng học</strong><small>Đối chiếu nền tảng ngành với hướng bạn muốn theo.</small></span><span className="matrix-count">12 ngành</span><ChevronDown size={20}/></summary><div className="matrix-intro"><dl className="matrix-legend"><div><dt>Gần nền tảng ngành</dt><dd>Có nhiều kiến thức chung với ngành đang học.</dd></div><div><dt>Hướng mở rộng</dt><dd>Cần bổ sung nền tảng chuyên môn trước khi đi sâu.</dd></div></dl><p>Mối liên hệ là gợi ý do nhóm biên soạn, không phải kết luận về khả năng của từng sinh viên hoặc danh sách chuyên ngành chính thức.</p><p>{catalogScopeNote}</p><small>Đối chiếu ngành và roadmap: {catalogCheckedAt}. Gộp các biến thể chương trình về ngành gốc.</small></div><div className="matrix-scroll" tabIndex={0} role="region" aria-label="Bảng ngành và hướng học"><table><thead><tr><th>Khoa / ngành</th><th>Gần nền tảng ngành</th><th>Hướng mở rộng</th></tr></thead><tbody>{faculties.flatMap(f => f.majors.map(m => { const related = majorPaths(m.id); return <tr key={m.id}><th><span>{f.name}</span><button onClick={() => { update({ major: m.id, browseFaculty: 'all' }); setNearOnly(true); setPathQuery(''); setPathCategory('all'); document.getElementById('directions')?.scrollIntoView({behavior:'smooth'}); }} aria-label={`Xem hướng của ${m.name}`}>{m.name}<ArrowDownRightIcon /></button><External href={majorProfiles[m.id].sourceUrl}>Thông tin ngành tại UIT</External></th><td>{related.primary.map(p => p.name).join(' · ') || majorCoverageNotes[m.id] || 'Chưa có hướng gần nền tảng trong phạm vi đã chọn.'}</td><td>{related.related.map(p => p.name).join(' · ') || 'Mọi hướng khác vẫn có thể khám phá; xem nền tảng cần bổ sung.'}</td></tr>; }))}</tbody></table></div></details>
    <section className="explore-note"><div className="explore-note-copy"><Leaf size={26} aria-hidden="true"/><div><h2>Điều chỉnh lộ trình theo bạn.</h2><p>Các gợi ý giúp bạn khám phá hướng tự học. Nền tảng thực tế của bạn sẽ được điều chỉnh ở bước tạo roadmap.</p></div></div><button className="secondary-button" onClick={()=>document.getElementById('directions')?.scrollIntoView({behavior:'smooth'})}>Quay lại hướng học<ArrowRight size={17}/></button></section>
    {preview && <Dialog title={preview.name} eyebrow="EXPLORE A DIRECTION" onClose={() => setPreview(null)}><div className="dialog-body path-overview-body"><p>{preview.summary}</p><div className="tag-list">{preview.tags.map(t => <span key={t}>{t}</span>)}</div><h4>Nền tảng cần chuẩn bị</h4><p>{preview.foundations}</p><RoadmapLinks links={preview.roadmaps} /><h4>Ngành có nhiều nền tảng chung</h4><p>{preview.majors.map(majorName).join(' · ')}</p>{preview.relatedMajors.length > 0 && <><h4>Ngành có thể mở rộng sang hướng này</h4><p>{preview.relatedMajors.map(majorName).join(' · ')}</p></>}{state.major && <div className="soft-note"><strong>Ngành hiện tại: {majorName(state.major)}</strong><p>{majorProfiles[state.major].foundation} Bạn có thể đối chiếu với phần nền tảng của hướng này và học thêm các kiến thức còn thiếu.</p><External href={majorProfiles[state.major].sourceUrl}>Xem thông tin ngành tại UIT</External></div>}<div className="soft-note">Hướng này đang có phần tổng quan để bạn kiểm tra. Các hướng có lộ trình chi tiết được đánh dấu trong danh mục.</div><button className="secondary-button" onClick={() => setPreview(null)}>Tiếp tục khám phá <ArrowRight size={17} /></button></div></Dialog>}
  </div>;
}
