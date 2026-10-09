import { useState } from 'react';
import { useWorkspace } from '../../app/context';
import { contentPacks } from '../../content';
import type { OperationResult, RoadmapDraft } from '../../domain/contracts';
import { isMonday, isValidDate, nextMonday } from '../../domain/planner';
import { Dialog, External } from '../../components/ui';
import { hoursText } from '../../state';

type PlanAction = 'create' | 'regenerate';

export function MyRoadmap() {
  const { workspace, selectedTrackId, activePlan, status, dirty, error, preview, unsavedWorkspace, actions } = useWorkspace();
  const [issues, setIssues] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [proposedDate, setProposedDate] = useState<{ original: string; monday: string; action: PlanAction } | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const busy = status === 'loading' || status === 'saving';
  const blocked = busy || !!unsavedWorkspace;
  const report = <T,>(result: OperationResult<T>): boolean => {
    setIssues(result.ok ? [] : result.issues.map(issue => issue.message));
    return result.ok;
  };
  const messages = [...new Set([...issues, ...(error?.issues.map(issue => issue.message) ?? [])])];

  async function reload(discard = false) {
    setConfirmDiscard(false);
    setNotice('');
    report(await actions.reloadWorkspace(discard));
  }

  if (!workspace || !selectedTrackId) {
    return <div className="page roadmap-page">
      <div className="page-heading"><h1>My roadmap</h1></div>
      {status === 'loading' ? <p role="status">Đang tải lộ trình…</p> : <div className="form-error" role="alert">
        <p>{messages.join(' ') || 'Không tải được lộ trình trên thiết bị này.'}</p>
        <button className="secondary-button" onClick={() => reload()}>Thử tải lại</button>
      </div>}
    </div>;
  }

  const resolved = actions.resolveTrack(selectedTrackId);
  const draftResult = actions.getDraft(selectedTrackId);
  if (!resolved.ok || !draftResult) {
    return <div className="page roadmap-page"><div className="form-error" role="alert">
      {!resolved.ok ? resolved.issues.map(issue => <p key={issue.code}>{issue.message}</p>) : <p>Không tìm thấy bản nháp lộ trình.</p>}
      <button className="secondary-button" disabled={busy} onClick={() => reload()}>Thử tải lại</button>
    </div></div>;
  }

  const draft = draftResult;
  const { track, stages, resources } = resolved.value;
  const activeStages = stages.filter(stage => draft.selectedStageIds.includes(stage.id) && !draft.knownStageIds.includes(stage.id));
  const minutes = activeStages.reduce((sum, stage) => sum + stage.work.reduce((total, work) => total + work.minutes, 0), 0);
  const sameTrackPlan = activePlan?.trackId === selectedTrackId ? activePlan : null;

  function edit(patch: Partial<Omit<RoadmapDraft, 'trackId'>>) {
    setNotice('');
    report(actions.updateDraft(track.id, patch));
  }

  async function saveDraft() {
    setNotice('');
    if (!Number.isInteger(draft.hoursPerWeek) || draft.hoursPerWeek < 2 || draft.hoursPerWeek > 20) {
      setIssues(['Số giờ mỗi tuần phải là số nguyên từ 2 đến 20.']);
      return;
    }
    if (!isValidDate(draft.startDate)) {
      setIssues(['Chọn ngày bắt đầu có thật.']);
      return;
    }
    if (report(await actions.saveDraft())) setNotice('Đã lưu bản nháp lộ trình.');
  }

  async function perform(action: PlanAction) {
    if (action === 'regenerate') {
      if (sameTrackPlan) report(actions.previewRegeneration(sameTrackPlan.id));
      return;
    }
    const result = await actions.createPlan(track.id);
    if (report(result) && result.ok) {
      setNotice(`Đã lưu kế hoạch mới “${result.value.name}” với ${result.value.current.tasks.length} việc. Các kế hoạch trước được giữ nguyên.`);
    }
  }

  function request(action: PlanAction) {
    setIssues([]);
    setNotice('');
    if (!activeStages.length) {
      setIssues(['Chọn ít nhất một chặng chưa biết để tạo kế hoạch.']);
      return;
    }
    if (!draft.goal.trim()) {
      setIssues(['Bạn hãy đặt một mục tiêu cho kế hoạch.']);
      return;
    }
    if (!Number.isInteger(draft.hoursPerWeek) || draft.hoursPerWeek < 2 || draft.hoursPerWeek > 20) {
      setIssues(['Số giờ mỗi tuần phải là số nguyên từ 2 đến 20.']);
      return;
    }
    if (!isValidDate(draft.startDate)) {
      setIssues(['Chọn ngày bắt đầu có thật.']);
      return;
    }
    if (!isMonday(draft.startDate)) {
      const monday = nextMonday(draft.startDate);
      if (!monday) {
        setIssues(['Hãy chọn một ngày Thứ Hai hợp lệ.']);
        return;
      }
      setProposedDate({ original: draft.startDate, monday, action });
      return;
    }
    void perform(action);
  }

  async function confirmMonday() {
    if (!proposedDate || blocked) return;
    const proposal = proposedDate;
    setProposedDate(null);
    if (report(actions.updateDraft(track.id, { startDate: proposal.monday }))) await perform(proposal.action);
  }

  async function confirmRegeneration() {
    if (!preview) return;
    if (report(await actions.confirmRegeneration(preview.token))) setNotice('Đã lưu kế hoạch tạo lại và lịch sử trước đó.');
  }

  async function retry() {
    if (report(await actions.retrySave())) setNotice('Đã lưu lại các thay đổi.');
  }

  return <div className="page roadmap-page">
    <div className="page-heading">
      <div><h1>My roadmap</h1><p>Chọn nội dung muốn học và thời gian dành cho kế hoạch.</p></div>
      <label className="browse-select">Nhánh học
        <select aria-label="Nhánh học" disabled={blocked} value={track.id} onChange={event => { setNotice(''); report(actions.selectTrack(event.target.value)); }}>
          {contentPacks.map(pack => <optgroup key={pack.pathId} label={pack.pathId === 'mobile' ? 'Mobile' : pack.pathId === 'game' ? 'Game' : 'Backend'}>
            {pack.tracks.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </optgroup>)}
        </select>
      </label>
    </div>
    {notice && <p className="soft-note" role="status">{notice}</p>}
    {messages.length > 0 && <div className="form-error" role="alert">{messages.map(message => <p key={message}>{message}</p>)}</div>}
    {unsavedWorkspace && <div className="soft-note">
      <p>{status === 'conflict' ? 'Dữ liệu đã thay đổi ở nơi khác. Bản chưa lưu vẫn được giữ.' : 'Thay đổi chưa lưu được. Thử lưu lại đúng bản này.'}</p>
      <div className="dialog-actions">
        {status !== 'conflict' && <button className="primary-button" disabled={busy} onClick={retry}>Thử lưu lại</button>}
        <button className="secondary-button" disabled={busy} onClick={() => setConfirmDiscard(true)}>Tải bản đã lưu…</button>
      </div>
    </div>}
    <div className="roadmap-editor">
      <section className="roadmap-paper" aria-label="Chặng học">
        <div className="paper-heading"><h2>Chặng học</h2></div>
        <p className="builder-note">Chọn chặng để học; đánh dấu “Đã biết” để bỏ qua. Các chặng giữ thứ tự nền tảng trước, chuyên sâu sau.</p>
        <div className="selected-modules">
          {stages.map(stage => {
            const selected = draft.selectedStageIds.includes(stage.id);
            const known = draft.knownStageIds.includes(stage.id);
            const source = resources.find(resource => resource.id === (draft.resourceByStage[stage.id] || stage.defaultResourceId));
            const missing = stage.prerequisiteIds.filter(id => !draft.selectedStageIds.includes(id) && !draft.knownStageIds.includes(id));
            return <article key={stage.id} className={`selected-module ${known ? 'is-known' : ''}`}>
              <label className="checkbox-label">
                <input type="checkbox" aria-label={`Học: ${stage.title}`} disabled={blocked} checked={selected} onChange={event => edit({ selectedStageIds: event.target.checked ? [...draft.selectedStageIds, stage.id] : draft.selectedStageIds.filter(id => id !== stage.id) })} />
                <span className="roadmap-course-title">{stage.title}</span>
              </label>
              {selected && <>
                <div className="selected-module-bottom" style={{ paddingLeft: 0 }}>
                  <label className="checkbox-label">
                    <input type="checkbox" aria-label={`Đã biết: ${stage.title}`} disabled={blocked} checked={known} onChange={event => edit({ knownStageIds: event.target.checked ? [...draft.knownStageIds, stage.id] : draft.knownStageIds.filter(id => id !== stage.id) })} />
                    Đã biết
                  </label>
                  {!known && stage.resourceIds.length > 1 && <label className="source-select">
                    <select aria-label={`Nguồn học cho ${stage.title}`} disabled={blocked} value={draft.resourceByStage[stage.id] || stage.defaultResourceId} onChange={event => edit({ resourceByStage: { ...draft.resourceByStage, [stage.id]: event.target.value } })}>
                      {stage.resourceIds.map(id => {
                        const resource = resources.find(item => item.id === id);
                        return resource && <option key={id} value={id}>{resource.provider} · {resource.title}</option>;
                      })}
                    </select>
                  </label>}
                </div>
                {!known && missing.length > 0 && <p className="form-error">Cần chọn hoặc xác nhận đã biết: {missing.map(id => stages.find(item => item.id === id)?.title ?? id).join(', ')}.</p>}
                <details>
                  <summary className="module-duration">Nội dung & bài thực hành · {hoursText(stage.work.reduce((total, work) => total + work.minutes, 0))}</summary>
                  <p className="builder-note">{stage.description}</p>
                  <p className="builder-note">{stage.outcome}</p>
                  {source && <p className="builder-note"><External href={source.url}>Mở nguồn: <strong>{source.title}</strong></External>{source.accessNote && <span> · {source.accessNote}</span>}</p>}
                  <ul>{stage.work.map(work => <li key={work.id} className="builder-note">{work.title} · {work.minutes} phút</li>)}</ul>
                </details>
              </>}
            </article>;
          })}
        </div>
      </section>
      <aside className="plan-builder" style={{ display: 'block' }} aria-label="Thiết lập kế hoạch">
        <h2>Kế hoạch học</h2>
        <label>Mục tiêu của bạn
          <input disabled={blocked} maxLength={120} value={draft.goal} onChange={event => edit({ goal: event.target.value })} placeholder="Bạn muốn làm được điều gì?" />
        </label>
        <label>Số giờ học mỗi tuần
          <input type="number" min="2" max="20" step="1" disabled={blocked} value={Number.isFinite(draft.hoursPerWeek) ? draft.hoursPerWeek : ''} onChange={event => edit({ hoursPerWeek: event.target.value === '' ? NaN : Number(event.target.value) })} />
        </label>
        <label>Ngày bắt đầu
          <input type="date" disabled={blocked} value={draft.startDate} onChange={event => edit({ startDate: event.target.value })} />
        </label>
        <p className="builder-note">{activeStages.length} chặng · {hoursText(minutes)} thực hành. Mỗi tuần bắt đầu vào Thứ Hai.</p>
        <button className="primary-button full-width" disabled={blocked} onClick={() => request('create')}>{status === 'saving' ? 'Đang lưu…' : 'Tạo kế hoạch mới'}</button>
        <div className="dialog-actions">
          <button className="secondary-button" disabled={blocked || !dirty} onClick={saveDraft}>Lưu bản nháp</button>
          {sameTrackPlan && <button className="secondary-button" disabled={blocked} onClick={() => request('regenerate')}>Xem trước tạo lại</button>}
        </div>
        <p className="builder-note" role="status">{status === 'saving' ? 'Đang lưu thay đổi…' : unsavedWorkspace ? 'Có thay đổi chưa lưu được.' : dirty ? 'Bản nháp có thay đổi chưa lưu.' : 'Bản nháp không có thay đổi chưa lưu.'}</p>
        {sameTrackPlan && <p className="builder-note">Tạo lại áp dụng cho “{sameTrackPlan.name}”.</p>}
      </aside>
    </div>
    {proposedDate && <Dialog className="roadmap-dialog" title="Bắt đầu vào Thứ Hai?" onClose={() => { if (!busy) setProposedDate(null); }}>
      <div className="dialog-body">
        <p>Bạn chọn {proposedDate.original}. Chuyển sang {proposedDate.monday}, Thứ Hai kế tiếp?</p>
        <div className="dialog-actions">
          <button className="secondary-button" disabled={busy} onClick={() => setProposedDate(null)}>Giữ ngày đã chọn</button>
          <button className="primary-button" disabled={blocked} onClick={confirmMonday}>Dùng ngày {proposedDate.monday}</button>
        </div>
      </div>
    </Dialog>}
    {preview && <Dialog className="roadmap-dialog" title="Tạo lại kế hoạch?" onClose={() => { if (!busy) actions.cancelRegeneration(); }}>
      <div className="dialog-body">
        <p>{preview.nextPlan.name}: {preview.previousTaskCount} việc hiện tại → {preview.nextPlan.current.tasks.length} việc sau khi tạo lại.</p>
        <p>{preview.nextPlan.current.tasks.filter(task => task.status === 'done').length} việc đã hoàn thành được giữ; {preview.nextPlan.current.tasks.filter(task => task.weekIndex === null).length} việc trong backlog. Việc tự thêm/sửa được giữ trong backlog; lịch sử và ghi chú được giữ.</p>
        <p>Chỉ các bài khớp định danh và phiên bản mới giữ tiến độ.</p>
        {messages.length > 0 && <div className="form-error" role="alert">{messages.map(message => <p key={message}>{message}</p>)}</div>}
        {unsavedWorkspace && <p>Đóng bản xem trước để xử lý bản chưa lưu.</p>}
        <div className="dialog-actions">
          <button className="secondary-button" disabled={busy} onClick={() => actions.cancelRegeneration()}>Đóng bản xem trước</button>
          <button className="primary-button" disabled={blocked} onClick={confirmRegeneration}>{status === 'saving' ? 'Đang lưu…' : 'Xác nhận tạo lại'}</button>
        </div>
      </div>
    </Dialog>}
    {confirmDiscard && <Dialog className="roadmap-dialog" title="Bỏ thay đổi chưa lưu?" onClose={() => { if (!busy) setConfirmDiscard(false); }}>
      <div className="dialog-body">
        <p>Tải bản đã lưu sẽ bỏ bản nháp và kế hoạch chưa lưu trên màn này.</p>
        <div className="dialog-actions">
          <button className="secondary-button" disabled={busy} onClick={() => setConfirmDiscard(false)}>Giữ thay đổi</button>
          <button className="primary-button" disabled={busy} onClick={() => reload(true)}>Bỏ thay đổi và tải lại</button>
        </div>
      </div>
    </Dialog>}
  </div>;
}
