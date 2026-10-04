import { Check, Plus } from 'lucide-react';
import { sourceForModule, type Resource } from '../../data';
import { useApp } from '../../app/context';
import { External } from '../../components/ui';
import { ProviderMark } from '../../components/ProviderMark';
export function ResourceCard({ resource, moduleId }: { resource: Resource; moduleId?: string }) {
  const { state, update, toast } = useApp();
  const selected = moduleId && sourceForModule(moduleId, state.stack, state.sourceByModule) === resource.id;
  return <article className={`resource-card ${selected ? 'chosen' : ''}`}><div className="resource-heading"><ProviderMark name={resource.provider} /><div><span className="eyebrow">{resource.provider}</span><h4><External href={resource.url}>{resource.title}</External></h4></div></div><p>{resource.note}</p><div className="resource-meta"><span>{resource.cost === 'free' ? 'Miễn phí' : 'Có miễn phí & trả phí'}</span><span>{resource.language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}</span><span>{resource.format}</span>{resource.certificate && <span>Có chứng nhận</span>}</div>{moduleId && <button className={`source-choice ${selected ? 'selected' : ''}`} onClick={() => { update({ sourceByModule: { ...state.sourceByModule, [moduleId]: resource.id } }); toast(`Đã chọn nguồn ${resource.provider}`); }}>{selected ? <Check size={15} /> : <Plus size={15} />}{selected ? 'Nguồn đã chọn' : 'Chọn nguồn này'}</button>}</article>;
}
