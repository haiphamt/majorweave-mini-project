import { useEffect, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Check, Compass, Route as RouteIcon, CalendarDays, BookOpen, CircleHelp, UserRound } from 'lucide-react';
import { modules } from '../data';
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
import { WorkspaceProvider } from './WorkspaceProvider';
import type { WorkspaceOptions } from './workspace-api';

export function AppShell({options}:{options?:WorkspaceOptions}={}) { return <WorkspaceProvider options={options}><AppContent/></WorkspaceProvider>; }

function AppContent() {
  const { workspace, selectedTrackId, status, dirty, actions } = useWorkspace();
  const [state, setState] = useState<State>(loadState);
  const [message, setMessage] = useState('');
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const location = useLocation();
  const update = (patch: Partial<State>) => {
    const apply=()=>setState(s=>({...s,...patch}));
    if(workspace&&(patch.major!==undefined||patch.profileName!==undefined)){
      void actions.saveProfile({...workspace.profile,majorId:patch.major===undefined?workspace.profile.majorId:patch.major||null,displayName:patch.profileName??workspace.profile.displayName}).then(r=>{if(r.ok)apply();else setMessage(r.issues.map(i=>i.message).join(' '));});
    }else if(workspace&&(patch.language!==undefined||patch.preferFree!==undefined)){
      const language=patch.language??workspace.preferences.resourceLanguage;
      void actions.savePreferences({resourceLanguage:language==='vi'?'vi':language==='en'?'en':'all',preferFree:patch.preferFree??workspace.preferences.preferFree}).then(r=>{if(r.ok)apply();else setMessage(r.issues.map(i=>i.message).join(' '));});
    }else apply();
  };
  const toast = (m: string) => setMessage(m);
  // v1 remains an immutable migration source. Only the v2 persistence port writes.
  useEffect(()=>{if(workspace)setState(s=>({...s,profileName:workspace.profile.displayName,major:workspace.profile.majorId??'',language:workspace.preferences.resourceLanguage,preferFree:workspace.preferences.preferFree}));},[workspace?.profile.displayName,workspace?.profile.majorId,workspace?.preferences.resourceLanguage,workspace?.preferences.preferFree]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 3500); return () => clearTimeout(timer); }, [message]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const pageTitles: Record<string, string> = {
      '/explore': 'Find your path. Plan your week.',
      '/path': 'Path detail — Discover what to learn.',
      '/roadmap': 'My roadmap — Turn goals into steps.',
      '/plan': 'My plan — Make this week count.',
      '/profile': 'Profile — See how far you’ve come.',
    };
    document.title = `uitplans. — ${pageTitles[location.pathname] || pageTitles['/explore']}`;
  }, [location.pathname]);
  const steps = [{ to: '/explore', label: 'Explore', desc: 'Khám phá hướng học', icon: Compass }, { to: '/path', label: 'Path detail', desc: 'Kỹ năng & nguồn học', icon: BookOpen }, { to: '/roadmap', label: 'My roadmap', desc: 'Lộ trình của bạn', icon: RouteIcon }, { to: '/plan', label: 'My plan', desc: 'Một tuần một bước', icon: CalendarDays }, { to: '/profile', label: 'Profile', desc: 'Hồ sơ & nhịp học', icon: UserRound }];
  const newStage = moduleId ? contentPacks.flatMap(p=>p.stages).find(s=>s.id===moduleId) : undefined;
  const oldModule = moduleId ? modules.find(m=>m.id===moduleId) : undefined;
  return <Context.Provider value={{ state, update, toast, openModule: setModuleId }}><div className="app-shell beaver-app">
    <header className="sidebar top-nav">
      <Link className="brand brand-wordmark" to="/explore"><span>uitplans<span className="brand-dot">.</span></span></Link>
      <nav aria-label="Các trang chính">{steps.map((step, i) => <NavLink key={step.to} to={step.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><step.icon size={19} strokeWidth={1.6} /><span><strong>{step.label}</strong><small>{step.desc}</small></span><span className="nav-number">0{i + 1}</span></NavLink>)}</nav>
      <div className="nav-actions"><span className="save-state" role="status"><span className={status==='error'||status==='conflict' ? 'status-dot warning' : 'status-dot'} />{status==='error' || status==='conflict' ? 'Chưa lưu được' : status==='loading' ? 'Đang tải' : status==='saving' ? 'Đang lưu…' : dirty ? 'Chưa lưu' : 'Đã lưu'}</span><button className="icon-button" aria-label="Về uitplans." onClick={()=>setShowAbout(true)}><CircleHelp size={17}/></button><Link className="avatar" to="/profile" aria-label="Mở hồ sơ học tập">{state.profileName.trim().charAt(0).toUpperCase()||<UserRound size={15}/>}</Link></div>
    </header>
    <div className="workspace">
      <main id="main-content"><Routes><Route path="/explore" element={<Explore />} /><Route path="/path" element={<PathDetail />} /><Route path="/roadmap" element={<MyRoadmap />} /><Route path="/plan" element={<WorkspacePlan />} /><Route path="/profile" element={<WorkspaceProfile />} /><Route path="*" element={<Navigate to="/explore" replace />} /></Routes></main>
      <footer className="app-footer"><span className="footer-brand"><strong>uitplans<span className="brand-dot">.</span></strong><span>Explore paths. Build your plan.</span></span><External className="event-flow-link" href="/events.html">Hướng dẫn thao tác</External><span className="footer-storage">Kế hoạch được lưu trên trình duyệt này.</span></footer>
    </div>
  </div>{newStage && selectedTrackId ? <StageDrawer key={`${selectedTrackId}/${moduleId}`} stage={newStage} trackId={selectedTrackId} onClose={()=>setModuleId(null)}/> : oldModule ? <ModuleDrawer module={oldModule} onClose={()=>setModuleId(null)}/> : null}
    {showAbout && <Dialog title="A small beginning." eyebrow="uitplans. · MINI PROJECT" onClose={() => setShowAbout(false)}><div className="dialog-body"><p>Danh mục có 18 hướng và 50 cấu hình kế hoạch. Bạn có thể chọn nhánh, nguồn học, chỉnh roadmap, tạo kế hoạch tuần và lưu tiến độ.</p><p>Mỗi hướng có chặng, nguồn học và bài thực hành trong danh mục. Danh sách ngành được gộp theo ngành gốc; liên hệ với hướng học là gợi ý để khám phá.</p><p>Dữ liệu của bạn được lưu trên trình duyệt này. Sau khi học ở nguồn bên ngoài, bạn tự đánh dấu hoàn thành tại My plan.</p><div className="source-note">Ngày đối chiếu và điều kiện truy cập được ghi ở từng nguồn học. Thời gian học là ước lượng do nhóm biên soạn cho một dự án nhỏ.</div><div className="about-links"><External href="https://tuyensinh.uit.edu.vn/nganh-dao-tao/">Ngành đào tạo UIT</External><External href="https://roadmap.sh/backend">Tham khảo roadmap.sh</External><External href="https://beaverplans.com/">Cảm hứng giao diện Beaver Plans</External></div></div></Dialog>}
    <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">{message && <><Check size={16} />{message}</>}</div>
  </Context.Provider>;
}
