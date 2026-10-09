import { useEffect, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Check, Compass, Route as RouteIcon, CalendarDays, BookOpen, Sprout, CircleHelp, UserRound } from 'lucide-react';
import { checkedAt, paths, modules, stacks } from '../data';
import { loadState, type State } from '../state';
import { Context, useWorkspace } from './context';
import { WorkspacePlan } from './WorkspacePlan';
import { WorkspaceProfile } from './WorkspaceProfile';
import { StageDrawer } from '../features/path-detail/StageDrawer';
import { contentPacks } from '../content';
import { External, Dialog } from '../components/ui';
import { Explore } from '../features/explore/Explore';
import { PathDetail } from '../features/path-detail/PathDetail';
import { ModuleDrawer } from '../features/path-detail/ModuleDrawer';
import { MyRoadmap } from '../features/my-roadmap/MyRoadmap';
import { MyPlan } from '../features/my-plan/MyPlan';
import { Profile } from '../features/profile/Profile';
import { saveLegacyState } from '../persistence/legacy';
import { WorkspaceProvider } from './WorkspaceProvider';

export function AppShell() { return <WorkspaceProvider><AppContent/></WorkspaceProvider>; }

function AppContent() {
  const { activePlan, selectedTrackId, status, dirty } = useWorkspace();
  const [state, setState] = useState<State>(loadState);
  const [message, setMessage] = useState('');
  const [storageOkay, setStorageOkay] = useState(true);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const location = useLocation();
  const update = (patch: Partial<State>) => setState(s => ({ ...s, ...patch }));
  const toast = (m: string) => setMessage(m);
  useEffect(() => { setStorageOkay(saveLegacyState(state)); }, [state]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 3500); return () => clearTimeout(timer); }, [message]);
  useEffect(() => { window.scrollTo({ top: 0 }); document.title = `MajorWeave — ${location.pathname === '/profile' ? 'Profile' : location.pathname === '/plan' ? 'My plan' : location.pathname === '/roadmap' ? 'My roadmap' : location.pathname === '/path' ? 'Path detail' : 'Explore paths'}`; }, [location.pathname]);
  const steps = [{ to: '/explore', label: 'Explore', desc: 'Khám phá hướng học', icon: Compass }, { to: '/path', label: 'Path detail', desc: 'Kỹ năng & nguồn học', icon: BookOpen }, { to: '/roadmap', label: 'My roadmap', desc: 'Lộ trình của bạn', icon: RouteIcon }, { to: '/plan', label: 'My plan', desc: 'Một tuần một bước', icon: CalendarDays }, { to: '/profile', label: 'Profile', desc: 'Hồ sơ & nhịp học', icon: UserRound }];
  const finished = activePlan ? activePlan.current.tasks.filter(t=>t.status==='done').length : state.tasks.filter(t=>t.completed).length;
  const taskCount = activePlan?.current.tasks.length ?? state.tasks.length;
  const activeLabel = activePlan ? (contentPacks.flatMap(p=>p.tracks).find(t=>t.id===activePlan.trackId)?.label ?? activePlan.trackId) : ('Backend · ' + stacks[state.stack].name);
  const newStage = moduleId ? contentPacks.flatMap(p=>p.stages).find(s=>s.id===moduleId) : undefined;
  const oldModule = moduleId ? modules.find(m=>m.id===moduleId) : undefined;
  const currentStack = state.tasks.length && state.planMeta ? state.planMeta.stack : state.stack;
  return <Context.Provider value={{ state, update, toast, openModule: setModuleId }}><div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/explore"><img src="/favicon.svg" alt="" /><span>Major<span className="brand-italic">Weave</span><small>EXPLORE. LEARN. GROW.</small></span></Link>
      <div className="sidebar-label">YOUR JOURNEY</div>
      <nav aria-label="Các trang chính">{steps.map((step, i) => <NavLink key={step.to} to={step.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><step.icon size={19} strokeWidth={1.6} /><span><strong>{step.label}</strong><small>{step.desc}</small></span><span className="nav-number">0{i + 1}</span></NavLink>)}</nav>
      <div className="sidebar-project"><span className="eyebrow">CURRENT PATH</span><div><span className="project-dot" />{activeLabel}</div><p>{taskCount ? `${finished}/${taskCount} việc đã hoàn thành` : 'Bắt đầu từ một dự án nhỏ.'}</p>{taskCount > 0 && <div className="progress-track"><span style={{ width: `${finished / taskCount * 100}%` }} /></div>}</div>
      <div className="sidebar-bottom"><div className="tiny-seed"><Sprout size={23} strokeWidth={1.4} /><p>A little progress,<br /><em>every week.</em></p></div><button className="quiet-button" onClick={() => setShowAbout(true)}><CircleHelp size={15} /> Về bản thử này</button></div>
    </aside>
    <div className="workspace"><header className="topbar"><span className="topbar-context">UIT STUDENT SPACE <span>/</span> {steps.find(s => s.to === location.pathname)?.label || 'Explore'}</span><div className="topbar-right"><span className="save-state"><span className={storageOkay ? 'status-dot' : 'status-dot warning'} />{!storageOkay || status==='error' || status==='conflict' ? 'Chưa lưu được' : status==='loading' ? 'Đang tải' : status==='saving' ? 'Đang lưu…' : dirty ? 'Có thay đổi chưa lưu' : 'Đã lưu'}</span><Link className="avatar" to="/profile" aria-label="Mở hồ sơ học tập">{state.profileName.trim().charAt(0).toUpperCase() || <UserRound size={15} />}</Link></div></header>
      <main id="main-content"><Routes><Route path="/explore" element={<Explore />} /><Route path="/path" element={<PathDetail />} /><Route path="/roadmap" element={<MyRoadmap />} /><Route path="/plan" element={<WorkspacePlan />} /><Route path="/profile" element={<WorkspaceProfile />} /><Route path="*" element={<Navigate to="/explore" replace />} /></Routes></main>
      <footer className="app-footer"><span>MajorWeave <span className="footer-dot">·</span> Explore paths. Build your plan.</span><External className="event-flow-link" href="/events.html">Luồng sự kiện minh họa</External><span>Mini project <span className="footer-dot">·</span> {activeLabel}</span></footer>
    </div>
  </div>{newStage && selectedTrackId ? <StageDrawer key={`${selectedTrackId}/${moduleId}`} stage={newStage} trackId={selectedTrackId} onClose={()=>setModuleId(null)}/> : oldModule ? <ModuleDrawer module={oldModule} onClose={()=>setModuleId(null)}/> : null}
    {showAbout && <Dialog title="A small beginning." eyebrow="MAJORWEAVE · MINI PROJECT" onClose={() => setShowAbout(false)}><div className="dialog-body"><p>Bản thử có lộ trình Backend, Frontend, Full-stack, UX, Mobile và Game. Bạn có thể chọn nhánh, nguồn học, chỉnh roadmap, tạo kế hoạch tuần và lưu tiến độ.</p><p>Các hướng khác hiện có phần tổng quan. Danh sách ngành được gộp theo ngành gốc; liên hệ với hướng học là gợi ý để khám phá.</p><p>Dữ liệu của bạn được lưu trên trình duyệt này. Sau khi học ở nguồn bên ngoài, bạn tự đánh dấu hoàn thành tại My plan.</p><div className="source-note">Ngày đối chiếu và điều kiện truy cập được ghi ở từng nguồn học. Thời gian học là ước lượng do nhóm biên soạn cho một dự án nhỏ.</div><div className="about-links"><External href="https://tuyensinh.uit.edu.vn/nganh-dao-tao/">Ngành đào tạo UIT</External><External href="https://roadmap.sh/backend">Tham khảo roadmap.sh</External><External href="https://beaverplans.com/">Cảm hứng giao diện Beaver Plans</External></div></div></Dialog>}
    <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">{message && <><Check size={16} />{message}</>}</div>
  </Context.Provider>;
}
