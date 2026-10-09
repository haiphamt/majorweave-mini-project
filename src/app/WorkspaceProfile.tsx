import { useApp, useWorkspace } from './context';
import { Profile } from '../features/profile/Profile';
import { External } from '../components/ui';
import { contentPacks } from '../content';

export function WorkspaceProfile() {
  const {state,update,toast}=useApp();
  const {workspace}=useWorkspace();
  const saved=contentPacks.flatMap(p=>p.credentials).filter(c=>workspace?.savedCredentialIds.includes(c.id));
  return <><Profile state={state} update={update} toast={toast}/>{saved.length>0&&<section className="page saved-credentials"><div className="section-heading"><h2>Mục tiêu chứng nhận đã lưu</h2></div><div className="saved-credential-list">{saved.map(c=><External key={c.id} href={c.url}><span>{c.name}<small>{c.provider} · {c.cost==='free'?'Miễn phí':c.cost==='paid'?'Có phí':'Kiểm tra phí tại nguồn'}</small></span></External>)}</div></section>}</>;
}