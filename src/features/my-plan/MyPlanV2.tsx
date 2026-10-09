import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Plus, BookOpen, CalendarDays } from 'lucide-react';
import type { LearningPlan, LearningStage, OperationResult, Workspace } from '../../domain/contracts';
import { addTask, updateTask, moveTaskToBacklog, setTaskCompletion, closeWeek, calculatePlanStats, calculateWeekStats, type ProgressContext } from '../../domain/progress';
import { Dialog, External } from '../../components/ui';
import { parseTaskForm, taskForm, weekIndices, visibleTasks, readOnly, safeSourceUrl, type TaskForm } from './viewModel';

// Controlled feature: the caller owns the workspace, persistence and revision.
// Resolve callbacks only after save/transaction success; never optimistically report a save.
export type MyPlanV2Props = Pick<Workspace, 'plans' | 'activePlanId'> & {
  stages: readonly LearningStage[];
  onSelectPlan: (id: string) => Promise<OperationResult<void>>;
  onSavePlan: (next: LearningPlan, expected: LearningPlan) => Promise<OperationResult<void>>;
  // Supply this when the caller retains a shared candidate after a failed save.
  onDiscardPendingPlan?: (candidate: LearningPlan) => Promise<OperationResult<void>>;
  getProgressContext: () => ProgressContext;
  nextTaskId: () => string;
  loading?: boolean;
  loadError?: string;
  onReload?: () => void;
};
const describe = (result: Extract<OperationResult<unknown>, { ok: false }>) => result.issues.map(i => i.message).join(' ') || 'Không thực hiện được thao tác.';
export function MyPlanV2(props: MyPlanV2Props) {
  const [selectionError, setSelectionError] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [viewBlocked, setViewBlocked] = useState(false);
  const selectionLock = useRef(false);
  if (props.loading) return <div className="page" role="status">Đang tải kế hoạch…</div>;
  if (props.loadError) return <div className="page"><p role="alert">{props.loadError}</p>{props.onReload && <button className="secondary-button" onClick={props.onReload}>Tải lại</button>}</div>;
  const plan = props.plans.find(p => p.id === props.activePlanId);
  async function select(id: string) {
    if (!id || selectionLock.current || viewBlocked) return;
    selectionLock.current = true; setSelecting(true); setSelectionError('');
    try { const result = await props.onSelectPlan(id); if (!result.ok) setSelectionError(describe(result)); }
    catch { setSelectionError('Không lưu được kế hoạch đang xem. Hãy thử lại.'); }
    finally { selectionLock.current = false; setSelecting(false); }
  }
  return <div>
    <div className="page" style={{ paddingBottom: 0 }}><label>Kế hoạch đang xem<select aria-label="Kế hoạch đang xem" value={plan?.id ?? ''} disabled={selecting || viewBlocked} onChange={e => void select(e.target.value)}><option value="" disabled>Chọn kế hoạch</option>{props.plans.map(p => <option key={p.id} value={p.id}>{p.name} · {p.trackId}{p.status === 'archived' ? ' · Lưu trữ' : ''}</option>)}</select></label>{selectionError && <p role="alert">{selectionError}</p>}</div>
    {plan ? <PlanView key={plan.id} {...props} plan={plan} selecting={selecting} onBlockedChange={setViewBlocked} /> : <div className="page empty-plan"><CalendarDays size={40}/><h1>Chưa có kế hoạch.</h1><p>{props.plans.length ? 'Chọn một kế hoạch để xem; lựa chọn cũ có thể không còn tồn tại.' : 'Chọn chặng và tạo kế hoạch từ My roadmap để bắt đầu.'}</p></div>}
  </div>;
}
type PendingSave = { next: LearningPlan; expected: LearningPlan; message: string; after: () => void };
function PlanView({ plan, selecting, onBlockedChange, ...props }: MyPlanV2Props & { plan: LearningPlan; selecting: boolean; onBlockedChange: (blocked: boolean) => void }) {
  const [tab, setTab] = useState<'Plan' | 'Stats' | 'Weeks'>('Plan');
  const [generationId, setGenerationId] = useState(plan.current.id);
  const [week, setWeek] = useState<number | null>(0);
  const [form, setForm] = useState<TaskForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formIssues, setFormIssues] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [action, setAction] = useState<'move_next' | 'move_backlog' | 'skip'>('move_next');
  const [pending, setPending] = useState<PendingSave | null>(null);
  const [saving, setSaving] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const lock = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  const generation = [plan.current, ...plan.history].find(g => g.id === generationId) ?? plan.current;
  const tasks = visibleTasks(generation, week);
  const weeks = weekIndices(generation);
  const readonly = readOnly(plan, generation, week);
  const busy = saving || selecting || discarding;
  const blocked = busy || !!pending;
  useEffect(() => { onBlockedChange(saving || discarding || !!pending); return () => onBlockedChange(false); }, [saving, discarding, pending, onBlockedChange]);
  // A retry from the shared banner can commit before this local editor retries.
  // Retire that local candidate too; never keep the UI blocked on an old object.
  useEffect(() => {
    if (!pending || pending.expected === plan || busy || lock.current) return;
    setPending(null);
    if (JSON.stringify(pending.next) === JSON.stringify(plan)) {
      pending.after(); setError(''); setNotice(pending.message);
    } else {
      setForm(null); setPreview(false); setConfirmDiscard(false);
      setError('Kế hoạch đã thay đổi; bản thao tác cũ đã được đóng.');
    }
  }, [plan, pending, busy]);
  const summary = calculatePlanStats({ ...plan, current: generation });
  const weekResult = calculateWeekStats(plan, week, generation.id);
  const weekStats = weekResult.ok ? weekResult.value : null;
  const snapshot = generation.closedWeeks.find(w => w.weekIndex === week);
  const selectableStages = props.stages.filter(s => plan.current.selectedStageIds.includes(s.id));

  async function persist(candidate: PendingSave) {
    if (lock.current) return;
    // If the caller refreshed/replaced this plan after a failed save, never replay
    // an old candidate over new data. The workspace adapter also checks revision.
    if (candidate.expected !== plan) { setPending(null); setError('Kế hoạch đã thay đổi. Hãy mở lại thao tác trên dữ liệu mới.'); return; }
    lock.current = true; setSaving(true); setError(''); setNotice('');
    try {
      const result = await props.onSavePlan(candidate.next, candidate.expected);
      if (result.ok) { setPending(null); candidate.after(); setNotice(candidate.message); }
      else { setPending(candidate); setError(describe(result)); }
    } catch { setPending(candidate); setError('Không lưu được thay đổi. Bản đang xem vẫn giữ nguyên; bạn có thể thử lưu lại.'); }
    finally { lock.current = false; setSaving(false); }
  }
  function run(operation: () => OperationResult<LearningPlan>, message: string, after = () => {}) {
    if (lock.current || blocked) return;
    try {
      const result = operation();
      if (!result.ok) { setError(describe(result)); return; }
      void persist({ next: result.value, expected: plan, message, after });
    } catch { setError('Không chuẩn bị được thao tác. Kiểm tra đồng hồ, múi giờ hoặc bộ tạo ID.'); }
  }
  function closeEditor() { setPending(null); setError(''); setForm(null); setPreview(false); setConfirmDiscard(false); }
  function dismiss() {
    if (lock.current || busy) return;
    if (pending) { setConfirmDiscard(true); return; }
    closeEditor();
  }
  async function discard() {
    if (lock.current || busy || !pending) return;
    lock.current = true; setDiscarding(true);
    try {
      const result = props.onDiscardPendingPlan ? await props.onDiscardPendingPlan(pending.next) : { ok: true as const, value: undefined };
      if (!result.ok) { setError(describe(result)); return; }
      closeEditor(); setNotice('Đã bỏ thay đổi chưa lưu; giữ bản đã lưu.');
    } catch { setError('Không bỏ được bản chưa lưu. Bản đã lưu vẫn được giữ; hãy thử lại.'); }
    finally { lock.current = false; setDiscarding(false); }
  }
  function openAdd() {
    setEditingId(null); setFormIssues([]);
    setForm({ stageId: selectableStages[0]?.id ?? '', title: '', minutes: '60', acceptance: '', notes: '', week: week === null ? '' : String(week + 1), day: '' });
  }
  function submit(e: React.FormEvent) {
    e.preventDefault(); if (!form || blocked) return;
    const parsed = parseTaskForm(form);
    if (!parsed.ok) { setFormIssues(parsed.issues.map(i => i.message)); return; }
    setFormIssues([]);
    const { stageId, ...updates } = parsed.value;
    run(() => editingId ? updateTask(plan, editingId, updates) : addTask(plan, parsed.value, { nextTaskId: props.nextTaskId }), 'Đã lưu công việc.', () => setForm(null));
  }
  const formParsed = form ? parseTaskForm(form) : null;
  const formTarget = formParsed?.ok ? formParsed.value.weekIndex : null;
  const targetTasks = formParsed?.ok ? plan.current.tasks.filter(t => t.id !== editingId && t.weekIndex === formTarget && t.status !== 'skipped') : [];
  const formOvertime = formParsed?.ok && formTarget !== null ? Math.max(0, targetTasks.reduce((n,t) => n+t.minutes,0) + formParsed.value.minutes - plan.current.hoursPerWeek * 60) : 0;
  let nextWeek = week === null ? 0 : week + 1;
  while (Number.isSafeInteger(nextWeek) && generation.closedWeeks.some(w => w.weekIndex === nextWeek)) nextWeek++;
  const movingMinutes = tasks.filter(t => t.status === 'todo').reduce((n,t) => n+t.minutes,0);
  const closeOvertime = Math.max(0, generation.tasks.filter(t => t.weekIndex === nextWeek && t.status !== 'skipped').reduce((n,t) => n+t.minutes,0) + movingMinutes - generation.hoursPerWeek*60);

  return <div className="page plan-page">
    <div className="eyebrow page-eyebrow">MY PLAN / {plan.trackId}</div>
    <div className="page-heading"><div><h1>Make room<br/><em>for progress.</em></h1><p>{generation.goal}</p></div></div>
    <label>Phiên bản kế hoạch<select aria-label="Phiên bản kế hoạch" value={generation.id} disabled={blocked} onChange={e => { setGenerationId(e.target.value); setWeek(0); setNotice(''); setError(''); }}><option value={plan.current.id}>Hiện tại · {plan.current.createdAt}</option>{plan.history.map(g => <option key={g.id} value={g.id}>Lịch sử · {g.createdAt} · {g.trackId}</option>)}</select></label>
    {readonly && <p className="capacity-note" role="status">{plan.status === 'archived' ? 'Kế hoạch đã lưu trữ: chỉ đọc.' : generation.id !== plan.current.id ? 'Phiên bản lịch sử: chỉ đọc.' : 'Tuần đã chốt: đang xem snapshot trước xử lý, chỉ đọc.'}</p>}
    {error && <p ref={errorRef} tabIndex={-1} role="alert" className="capacity-note">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {pending && !form && !preview && <div className="dialog-actions"><button className="primary-button" disabled={busy} onClick={() => void persist(pending)}>Thử lưu lại</button><button className="secondary-button" disabled={busy} onClick={dismiss}>Bỏ thay đổi chưa lưu</button></div>}
    {saving && <p role="status">Đang lưu…</p>}
    <nav className="tabs" aria-label="Chế độ xem kế hoạch">{(['Plan','Stats','Weeks'] as const).map(t => <button key={t} aria-pressed={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
    <div className="journey-progress"><div><span className="progress-kicker">{plan.name}</span><strong>{summary.done}<span> / {summary.total} việc</span></strong></div><div className="journey-progress-bar"><div className="progress-track"><span style={{ width: `${summary.percentage}%` }}/></div><span>{summary.empty ? 'Chưa có việc được tính' : `${Math.round(summary.percentage)}% hoàn thành`} · {summary.estimatedCompletedMinutes}/{summary.totalMinutes} phút dự kiến</span></div></div>
    {tab === 'Stats' && <section className="week-paper"><h2>Thống kê.</h2><p>{summary.empty ? 'Kế hoạch chưa có việc todo/done.' : `${summary.done}/${summary.total} việc đã hoàn thành.`} Bỏ skipped khỏi mẫu số; backlog vẫn thuộc tổng kế hoạch.</p><p>{generation.closedWeeks.length} tuần đã chốt. Phút là ước lượng tại phiên bản đang xem.</p>{weeks.map(index => { const result = calculateWeekStats(plan,index,generation.id); return result.ok && <p key={index}>Tuần {index+1}: {result.value.empty ? 'Chưa có việc được tính' : `${result.value.done}/${result.value.total} · ${Math.round(result.value.percentage)}%`}{result.value.closed ? ' · Snapshot đã khóa' : ''}{result.value.overtimeMinutes ? ` · Vượt ${result.value.overtimeMinutes} phút` : ''}</p>; })}</section>}
    {tab === 'Weeks' && <section className="week-paper"><h2>Các tuần.</h2><p>Tuần đã chốt giữ kết quả trước khi dời việc chưa xong.</p>{weeks.map(index => { const result = calculateWeekStats(plan,index,generation.id); return result.ok && <div className="week-summary" key={index}><span>Tuần {index+1} · {result.value.empty ? 'Trống' : `${result.value.done}/${result.value.total}`}{result.value.closed ? ' · Đã chốt' : ' · Đang mở'}</span><button className="text-link" onClick={() => { setWeek(index); setTab('Plan'); }}>Xem tuần {index+1}</button></div>; })}<button className="quiet-button" onClick={() => { setWeek(null); setTab('Plan'); }}>Xem backlog</button></section>}
    {tab === 'Plan' && <div className="planner-layout"><aside className="week-sidebar"><span className="eyebrow">ONE WEEK AT A TIME</span><div className="week-list">{weeks.map(index => <button key={index} className={`week-button ${week === index ? 'active' : ''}`} aria-pressed={week === index} disabled={blocked} onClick={() => setWeek(index)}><strong>Tuần {index+1}</strong><small>{generation.closedWeeks.some(w => w.weekIndex === index) ? 'Đã chốt' : 'Mở'}</small></button>)}<button className={`week-button ${week === null ? 'active' : ''}`} aria-pressed={week === null} disabled={blocked} onClick={() => setWeek(null)}>Backlog</button></div></aside>
      <section className="week-paper"><div className="week-heading"><h2>{week === null ? 'Backlog' : `Tuần ${week+1}`}<span className="rust-text">.</span></h2></div>
        <div className="week-summary"><span>{weekStats?.done ?? 0}/{weekStats?.total ?? 0} việc đã xong</span><span>{weekStats?.totalMinutes ?? 0} phút{week === null ? ' · Chưa xếp lịch' : ` / ${generation.hoursPerWeek*60} phút`}</span></div>
        {!!weekStats?.overtimeMinutes && <p className="capacity-note">Vượt quỹ giờ {weekStats.overtimeMinutes} phút.{readonly ? ' Đây là số liệu của bản chỉ đọc.' : ' Bạn có thể dời việc; việc vẫn được giữ.'}</p>}
        {snapshot && <p className="source-note">Chốt lúc {snapshot.closedAt}. Công việc dưới đây là snapshot trước xử lý.</p>}
        {!tasks.length && <p className="empty-inline">{week === null ? 'Backlog chưa có việc.' : 'Tuần này chưa có việc.'}</p>}
        <div className="task-list">{tasks.map(task => {
          const completion = plan.completions.find(c => c.id === task.completionId);
          return <article key={task.id} className={`task-row ${task.status === 'done' ? 'completed' : ''}`}>
            <label className="task-checkbox"><input type="checkbox" aria-label={`Hoàn thành: ${task.title}`} checked={task.status === 'done'} disabled={readonly || blocked || task.status === 'skipped'} onChange={e => { const completed=e.target.checked; run(() => setTaskCompletion(plan,task.id,completed,props.getProgressContext()), completed ? 'Đã hoàn thành công việc.' : 'Đã bỏ hoàn thành.'); }}/><span><Check size={14}/></span></label>
            <div className="task-content"><div className="task-topline"><span className="eyebrow">{props.stages.find(s => s.id === task.stageId)?.title ?? task.stageId}</span><span className="task-duration">{task.minutes} phút</span></div><h3>{task.title}</h3><ul className="practice-list">{task.acceptance.map((a,i) => <li key={i}>{a}</li>)}</ul><div className="task-bottom">{task.source && (safeSourceUrl(task.source.url) ? <External href={task.source.url}><BookOpen size={13}/>{task.source.provider} · {task.source.title}</External> : <p>Nguồn học có URL không hợp lệ.</p>)}{task.notes && <p className="task-notes">{task.notes}</p>}<p className="subtle-copy">{task.status === 'skipped' ? 'Đã bỏ qua' : task.status === 'done' ? `Hoàn thành: ${completion?.localDate ?? 'Chưa có ngày từ dữ liệu cũ'}${completion?.timeZone ? ` · ${completion.timeZone}` : ''}` : 'Cần làm'}{task.customized ? ' · Đã tùy chỉnh' : ''}{task.dayIndex === null ? '' : ` · ${['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ nhật'][task.dayIndex]}`}</p></div>
              {!readonly && <div className="dialog-actions"><button className="quiet-button" aria-label={`Sửa: ${task.title}`} disabled={blocked} onClick={() => { setEditingId(task.id); setForm(taskForm(task)); setFormIssues([]); }}><Pencil size={15}/>Sửa</button>{week !== null && <button className="quiet-button" aria-label={`Backlog: ${task.title}`} disabled={blocked} onClick={() => run(() => moveTaskToBacklog(plan,task.id),'Đã đưa việc vào backlog.')}>Đưa vào backlog</button>}</div>}
            </div>
          </article>;
        })}</div>
        {!readonly && <div className="dialog-actions"><button className="add-task-button" disabled={blocked || !selectableStages.length} onClick={openAdd}><Plus size={17}/>Thêm việc</button>{week !== null && <button className="secondary-button" disabled={blocked || !tasks.length} onClick={() => { setAction('move_next'); setPreview(true); }}>Chốt tuần</button>}</div>}
      </section></div>}
    {confirmDiscard && <Dialog title="Bỏ thay đổi chưa lưu?" eyebrow="MY PLAN" onClose={()=>{if(!lock.current&&!busy)setConfirmDiscard(false);}}><div className="dialog-body"><p>Thay đổi vừa lưu thất bại sẽ bị bỏ. Kế hoạch và lịch sử đã lưu được giữ nguyên; bản đã bỏ không thể thử lưu lại.</p><div className="dialog-actions"><button className="secondary-button" disabled={busy} onClick={()=>setConfirmDiscard(false)}>Giữ thay đổi để thử lưu lại</button><button className="primary-button" disabled={busy} onClick={()=>void discard()}>{discarding?'Đang bỏ thay đổi…':'Xác nhận bỏ thay đổi'}</button></div></div></Dialog>}
    {form && !confirmDiscard && <Dialog title={editingId ? 'Chỉnh công việc.' : 'Thêm công việc.'} eyebrow="MY PLAN" onClose={dismiss}><form className="dialog-body task-edit-form" noValidate onSubmit={submit}>
      {formIssues.length > 0 && <div role="alert" id="task-form-errors">{formIssues.map((message,i) => <p key={i}>{message}</p>)}</div>}
      {error && <p role="alert">{error}</p>}
      <fieldset disabled={blocked} style={{ border: 0, padding: 0, margin: 0 }}>
        <label>Chặng học<select aria-label="Chặng học" value={form.stageId} disabled={!!editingId} onChange={e => setForm({...form,stageId:e.target.value})}>{selectableStages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
        <label>Tiêu đề<input autoFocus aria-label="Tiêu đề" aria-describedby={formIssues.length ? 'task-form-errors' : undefined} required value={form.title} onChange={e => setForm({...form,title:e.target.value})}/></label>
        <div className="form-row"><label>Phút<input aria-label="Phút" type="number" required min={1} step={1} value={form.minutes} onChange={e => setForm({...form,minutes:e.target.value})}/></label><label>Tuần (trống = backlog)<input aria-label="Tuần đích" type="number" min={1} step={1} value={form.week} onChange={e => setForm({...form,week:e.target.value})}/></label></div>
        <label>Ngày học<select aria-label="Ngày học" value={form.day} disabled={!form.week.trim()} onChange={e => setForm({...form,day:e.target.value})}><option value="">Chưa chọn ngày</option>{['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ nhật'].map((day,i) => <option key={i} value={i}>{day}</option>)}</select></label>
        <label>Yêu cầu (mỗi dòng một yêu cầu)<textarea aria-label="Yêu cầu" required rows={3} value={form.acceptance} onChange={e => setForm({...form,acceptance:e.target.value})}/></label>
        <label>Ghi chú<textarea aria-label="Ghi chú" rows={3} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})}/></label>
      </fieldset>
      {formOvertime > 0 && <p className="capacity-note">Sau khi lưu, tuần đích vượt quỹ giờ {formOvertime} phút.</p>}
      <div className="dialog-actions"><button type="button" className="secondary-button" disabled={busy} onClick={dismiss}>Hủy</button>{pending ? <button type="button" className="primary-button" disabled={busy} onClick={() => void persist(pending)}>Thử lưu lại</button> : <button type="submit" className="primary-button" disabled={blocked}>Lưu công việc</button>}</div>
    </form></Dialog>}
    {preview && !confirmDiscard && week !== null && <Dialog title={`Chốt tuần ${week+1}?`} eyebrow="MY PLAN" onClose={dismiss}><div className="dialog-body"><p>{tasks.filter(t => t.status === 'todo').length} việc chưa xong. Snapshot sẽ giữ {weekStats?.done}/{weekStats?.total} trước xử lý.</p><ul className="practice-list">{tasks.filter(t => t.status === 'todo').map(t => <li key={t.id}>{t.title} · {t.minutes} phút</li>)}</ul><fieldset disabled={blocked} style={{ border: 0, padding: 0 }}>{(['move_next','move_backlog','skip'] as const).map(value => <label key={value} className="checkbox-label"><input type="radio" name="unfinished" value={value} checked={action===value} onChange={() => setAction(value)}/>{value==='move_next' ? 'Dời đến tuần mở tiếp theo' : value==='move_backlog' ? 'Đưa vào backlog' : 'Bỏ qua (skipped)'}</label>)}</fieldset>{error && <p role="alert">{error}</p>}<p className="source-note">{action === 'move_next' && movingMinutes > 0 ? Number.isSafeInteger(nextWeek) ? `Đích: tuần ${nextWeek+1}. ${movingMinutes} phút được dời; vượt quỹ giờ tại đích ${closeOvertime} phút.` : 'Không còn tuần đích hợp lệ; thao tác sẽ bị từ chối.' : action === 'move_backlog' ? 'Việc chưa xong trở về backlog, chưa xếp ngày.' : 'Việc chưa xong giữ vị trí với trạng thái skipped.'} Tuần đã chốt sẽ chỉ đọc. Hủy giữ nguyên kế hoạch.</p><div className="dialog-actions"><button className="secondary-button" disabled={busy} onClick={dismiss}>Hủy</button>{pending ? <button className="primary-button" disabled={busy} onClick={() => void persist(pending)}>Thử lưu lại</button> : <button className="primary-button" disabled={blocked} onClick={() => run(() => closeWeek(plan,week,action,props.getProgressContext()),'Đã chốt tuần.',() => setPreview(false))}>Xác nhận chốt tuần</button>}</div></div></Dialog>}
  </div>;
}
