import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, X, Plus, Route as RouteIcon, BookOpen, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { modules, stacks, modulesForStack, sourcesForModule, sourceForModule, type Module } from '../../data';
import { generatePlan, hoursText } from '../../state';
import { useApp } from '../../app/context';
import { Dialog } from '../../components/ui';
import { isMonday, isValidDate, nextMonday } from '../../domain/planner';
export function MyRoadmap() {
  const { state, update, openModule, toast } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [confirmRebuild, setConfirmRebuild] = useState(false);
  const [proposedMonday, setProposedMonday] = useState<string | null>(null);
  const selected = state.selected.map(id => modulesForStack(state.stack).find(m => m.id === id)).filter((m): m is Module => !!m);
  const active = selected.filter(m => !state.known.includes(m.id));
  const minutes = active.reduce((sum, m) => sum + m.tasks.reduce((s, t) => s + t.minutes, 0), 0);
  const weeks = generatePlan({ ...state, tasks: [] });
  const weekCount = weeks.length ? Math.max(...weeks.map(t => t.week)) + 1 : 0;
  const move = (id: string, delta: number) => { const next = [...state.selected]; const index = next.indexOf(id); const dest = index + delta; if (dest < 0 || dest >= next.length) return; [next[index], next[dest]] = [next[dest], next[index]]; update({ selected: next }); };
  const validateForm = () => {
    if (!active.length) { setError('Chọn ít nhất một chặng chưa biết để tạo kế hoạch.'); return; }
    if (!state.goal.trim()) { setError('Bạn hãy đặt một mục tiêu cho kế hoạch.'); return; }
    if (!Number.isInteger(state.hours) || state.hours < 2 || state.hours > 20) { setError('Số giờ mỗi tuần phải là số nguyên từ 2 đến 20.'); return; }
    if (!isValidDate(state.startDate)) { setError('Chọn ngày bắt đầu có thật, đúng định dạng năm-tháng-ngày.'); return; }
    return true;
  };
  const build = (startDate = state.startDate) => {
    if (!validateForm()) return;
    if (!isMonday(startDate)) { setError('Xác nhận ngày Thứ Hai trước khi tạo kế hoạch.'); return; }
    update({ startDate, tasks: generatePlan({ ...state, startDate }), planMeta: { stack: state.stack, goal: state.goal, hours: state.hours, startDate } });
    toast('Kế hoạch của bạn đã sẵn sàng'); navigate('/plan');
  };
  const requestBuild = () => {
    setError('');
    if (!validateForm()) return;
    if (!isMonday(state.startDate)) {
      const monday = nextMonday(state.startDate);
      if (!monday) { setError('Không thể quy đổi ngày này; hãy chọn một ngày Thứ Hai hợp lệ.'); return; }
      setProposedMonday(monday);
    } else if (state.tasks.length) setConfirmRebuild(true);
    else build();
  };
  return <div className="page"><div className="eyebrow page-eyebrow">MAKE IT YOUR OWN</div><div className="page-heading"><div><h1>Your path.<br /><em>Your pace.</em></h1><p>Giữ những điều muốn học, bỏ qua kỹ năng đã biết.<br />Một lộ trình vừa sức bắt đầu từ đây.</p></div><div className="heading-tag"><RouteIcon size={16} /> Backend · {stacks[state.stack].name}</div></div>
    <div className="roadmap-editor"><section className="roadmap-paper"><div className="paper-heading"><div><span className="eyebrow">MY LEARNING PATH</span><h2>Small steps, in order.</h2></div><Link to="/path" className="text-link"><Plus size={16} />Thêm chặng</Link></div><div className="selected-modules">{selected.map((m, index) => { const known = state.known.includes(m.id); return <article key={m.id} className={`selected-module ${known ? 'is-known' : ''}`}><div className="selected-module-top"><span className="list-number">{String(index + 1).padStart(2, '0')}</span><div><button className="module-title-button" onClick={() => openModule(m.id)}>{m.title}<ArrowUpRight size={15} /></button><span className="module-duration">{known ? 'Bỏ qua trong kế hoạch' : `${hoursText(m.tasks.reduce((s, t) => s + t.minutes, 0))} · ${m.tasks.length} việc thực hành`}</span></div><div className="order-buttons"><button aria-label={`Đưa ${m.title} lên`} className="icon-button" disabled={index === 0} onClick={() => move(m.id, -1)}><ChevronUp size={15} /></button><button aria-label={`Đưa ${m.title} xuống`} className="icon-button" disabled={index === selected.length - 1} onClick={() => move(m.id, 1)}><ChevronDown size={15} /></button><button aria-label={`Bỏ ${m.title}`} className="icon-button" onClick={() => { update({ selected: state.selected.filter(id => id !== m.id) }); toast('Đã bỏ chặng khỏi roadmap'); }}><X size={15} /></button></div></div><div className="selected-module-bottom"><label className="checkbox-label"><input type="checkbox" checked={known} onChange={e => update({ known: e.target.checked ? [...state.known, m.id] : state.known.filter(id => id !== m.id) })} />Đã biết</label><label className="source-select"><BookOpen size={14} /><select aria-label={`Nguồn học cho ${m.title}`} value={sourceForModule(m.id, state.stack, state.sourceByModule)} onChange={e => update({ sourceByModule: { ...state.sourceByModule, [m.id]: e.target.value } })}>{sourcesForModule(m.id, state.stack).map(r => <option key={r.id} value={r.id}>{r.provider} · {r.title}</option>)}</select></label></div></article>; })}</div>{selected.length === 0 && <div className="empty-inline">Roadmap đang trống.<Link className="text-link" to="/path">Chọn chặng muốn học <ArrowRight size={15} /></Link></div>}<div className="paper-footnote"><CheckCheck size={16} />Các kỹ năng đã biết được bỏ qua khi tạo kế hoạch.</div></section>
    <aside className="plan-builder"><span className="eyebrow">MAKE A LITTLE ROOM</span><h2>Turn curiosity<br /><em>into a habit.</em></h2><label>Mục tiêu của bạn<input maxLength={120} value={state.goal} onChange={e => update({ goal: e.target.value })} placeholder="Ví dụ: Xây API quản lý công việc" /></label><label className="hours-label">Thời gian mỗi tuần<span><strong>{state.hours}</strong> giờ</span><input type="range" min="2" max="20" step="1" value={state.hours} aria-label="Số giờ học mỗi tuần" onChange={e => update({ hours: Number(e.target.value) })} /><span className="range-labels"><small>2 giờ</small><small>20 giờ</small></span></label><label>Ngày bắt đầu<input type="date" value={state.startDate} onChange={e => update({ startDate: e.target.value })} /></label><div className="plan-estimate"><div><span>{active.length}</span><small>chặng học</small></div><div><span>{hoursText(minutes)}</span><small>thực hành dự kiến</small></div><div><span>{weekCount}</span><small>tuần dự kiến</small></div></div><p className="builder-note">Lịch chia bài học và thực hành theo quỹ thời gian của bạn. Bạn có thể sửa từng việc sau khi tạo.</p>{error && <p role="alert" className="form-error">{error}</p>}<button className="primary-button full-width" onClick={requestBuild}>Tạo kế hoạch của tôi <ArrowRight size={17} /></button><span className="estimate-caption">Đây là kế hoạch cho dự án đầu tiên.<br />Thời gian học thực tế có thể khác.</span></aside></div>
    {proposedMonday && <Dialog title="Bắt đầu vào Thứ Hai?" eyebrow="MY ROADMAP" onClose={() => setProposedMonday(null)}><div className="dialog-body"><p>Bạn chọn {state.startDate}. Mỗi tuần học bắt đầu vào Thứ Hai. Đề xuất chuyển ngày bắt đầu sang {proposedMonday} (Thứ Hai kế tiếp).</p><p>Chỉ áp dụng khi bạn xác nhận; kế hoạch đang học chưa thay đổi.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setProposedMonday(null)}>Giữ ngày đã chọn</button><button className="primary-button" onClick={() => { const date = proposedMonday; setProposedMonday(null); update({ startDate: date }); if (state.tasks.length) setConfirmRebuild(true); else build(date); }}>Dùng ngày {proposedMonday}</button></div></div></Dialog>}
    {confirmRebuild && <Dialog title="Tạo lại kế hoạch?" eyebrow="MY PLAN" onClose={() => setConfirmRebuild(false)}><div className="dialog-body"><p>Kế hoạch sẽ được sắp lại theo roadmap, nguồn học và thời gian mới. Việc đã hoàn thành và ghi chú của các bài còn trong roadmap được giữ lại.</p><p>Các việc tự thêm và chỉnh sửa tiêu đề, thời lượng trong kế hoạch cũ sẽ được thay bằng kế hoạch mới. Khi đổi nhánh, các bài triển khai theo ngôn ngữ cũ sẽ được thay; ngày hoàn thành của bài được giữ lại vẫn giữ nguyên.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setConfirmRebuild(false)}>Giữ kế hoạch hiện tại</button><button className="primary-button" onClick={() => build()}>Tạo lại kế hoạch <ArrowRight size={16} /></button></div></div></Dialog>}
  </div>;
}
