import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, X, Plus, Route as RouteIcon, BookOpen, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { hoursText } from '../../state';
import { useApp, useWorkspace } from '../../app/context';
import type { ValidationIssue } from '../../domain/contracts';
import { Dialog } from '../../components/ui';
import { isMonday, isValidDate, nextMonday } from '../../domain/planner';

export function MyRoadmap() {
  const { workspace, selectedTrackId, activePlan, status, preview, actions } = useWorkspace();
  const { openModule, toast } = useApp();
  const navigate = useNavigate();

  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [proposedDate, setProposedDate] = useState<{ original: string; monday: string } | null>(null);

  if (!workspace || !selectedTrackId || status === 'loading') {
    return (
      <div className="page">
        <div className="empty-inline">Đang tải...</div>
      </div>
    );
  }

  const resolvedResult = actions.resolveTrack(selectedTrackId);
  const draft = actions.getDraft(selectedTrackId);

  if (!resolvedResult.ok || !draft) {
    return (
      <div className="page">
        <div className="empty-inline">Lỗi tải dữ liệu nhánh học.</div>
      </div>
    );
  }

  const { track, stages, resources } = resolvedResult.value;

  const selectedStages = draft.selectedStageIds
    .map(id => stages.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const activeStages = selectedStages.filter(s => !draft.knownStageIds.includes(s.id));
  const minutes = activeStages.reduce(
    (sum, s) => sum + s.work.reduce((ws, w) => ws + w.minutes, 0),
    0
  );

  const budget = draft.hoursPerWeek * 60;
  const weekCount = budget > 0 ? Math.ceil(minutes / budget) : 0;

  const move = (id: string, delta: number) => {
    const next = [...draft.selectedStageIds];
    const index = next.indexOf(id);
    const dest = index + delta;
    if (dest < 0 || dest >= next.length) return;
    [next[index], next[dest]] = [next[dest], next[index]];
    actions.updateDraft(selectedTrackId, { selectedStageIds: next });
  };

  const toggleKnown = (id: string, checked: boolean) => {
    const d = actions.getDraft(selectedTrackId);
    if (!d) return;
    const knownStageIds = checked
      ? [...d.knownStageIds, id]
      : d.knownStageIds.filter(x => x !== id);
    actions.updateDraft(selectedTrackId, { knownStageIds });
  };

  const updateResource = (stageId: string, resourceId: string) => {
    const d = actions.getDraft(selectedTrackId);
    if (!d) return;
    actions.updateDraft(selectedTrackId, {
      resourceByStage: { ...d.resourceByStage, [stageId]: resourceId },
    });
  };

  const build = async (dateOverride?: string) => {
    if (dateOverride) {
      const updateResult = actions.updateDraft(selectedTrackId, { startDate: dateOverride });
      if (!updateResult.ok) {
        setIssues(updateResult.issues);
        return;
      }
    }
    const result = await actions.createPlan(selectedTrackId);
    if (!result.ok) {
      setIssues(result.issues);
      return;
    }
    setIssues([]);
    toast('Kế hoạch của bạn đã sẵn sàng');
    navigate('/plan');
  };

  const requestBuild = () => {
    setIssues([]);
    if (!draft.selectedStageIds.filter(id => !draft.knownStageIds.includes(id)).length) {
      setIssues([{ code: 'validation', field: 'stages', message: 'Chọn ít nhất một chặng chưa biết để tạo kế hoạch.' }]);
      return;
    }
    if (!draft.goal.trim()) {
      setIssues([{ code: 'validation', field: 'goal', message: 'Bạn hãy đặt một mục tiêu cho kế hoạch.' }]);
      return;
    }
    if (!Number.isInteger(draft.hoursPerWeek) || draft.hoursPerWeek < 2 || draft.hoursPerWeek > 20) {
      setIssues([{ code: 'validation', field: 'hoursPerWeek', message: 'Số giờ mỗi tuần phải là số nguyên từ 2 đến 20.' }]);
      return;
    }
    if (!isValidDate(draft.startDate)) {
      setIssues([{ code: 'validation', field: 'startDate', message: 'Chọn ngày bắt đầu có thật, đúng định dạng năm-tháng-ngày.' }]);
      return;
    }

    if (!isMonday(draft.startDate)) {
      const monday = nextMonday(draft.startDate);
      if (!monday) {
        setIssues([{ code: 'validation', field: 'startDate', message: 'Không thể quy đổi ngày này; hãy chọn một ngày Thứ Hai hợp lệ.' }]);
        return;
      }
      setProposedDate({ original: draft.startDate, monday });
    } else if (activePlan && activePlan.trackId === selectedTrackId) {
      const result = actions.previewRegeneration(activePlan.id);
      if (!result.ok) setIssues(result.issues);
    } else {
      build();
    }
  };

  const confirmDateAndBuild = () => {
    const date = proposedDate!.monday;
    setProposedDate(null);
    if (activePlan && activePlan.trackId === selectedTrackId) {
      const updateResult = actions.updateDraft(selectedTrackId, { startDate: date });
      if (updateResult.ok) {
        const result = actions.previewRegeneration(activePlan.id);
        if (!result.ok) setIssues(result.issues);
      } else {
        setIssues(updateResult.issues);
      }
    } else {
      build(date);
    }
  };

  const confirmRebuildAction = async () => {
    if (!preview) return;
    const confirmed = await actions.confirmRegeneration(preview.token);
    if (!confirmed.ok) {
      setIssues(confirmed.issues);
    } else {
      setIssues([]);
      toast('Kế hoạch của bạn đã được cập nhật');
      navigate('/plan');
    }
  };

  return (
    <div className="page">
      <div className="eyebrow page-eyebrow">MAKE IT YOUR OWN</div>
      <div className="page-heading">
        <div>
          <h1>Your path.<br /><em>Your pace.</em></h1>
          <p>Giữ những điều muốn học, bỏ qua kỹ năng đã biết.<br />Một lộ trình vừa sức bắt đầu từ đây.</p>
        </div>
        <div className="heading-tag">
          <RouteIcon size={16} /> Backend · {track.label}
        </div>
      </div>
      <div className="roadmap-editor">
        <section className="roadmap-paper">
          <div className="paper-heading">
            <div>
              <span className="eyebrow">MY LEARNING PATH</span>
              <h2>Small steps, in order.</h2>
            </div>
            <Link to="/path" className="text-link">
              <Plus size={16} />Thêm chặng
            </Link>
          </div>
          <div className="selected-modules">
            {selectedStages.map((stage, index) => {
              const known = draft.knownStageIds.includes(stage.id);
              return (
                <article key={stage.id} className={`selected-module ${known ? 'is-known' : ''}`}>
                  <div className="selected-module-top">
                    <span className="list-number">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <button className="module-title-button" onClick={() => openModule(stage.id)}>
                        {stage.title}
                        <ArrowUpRight size={15} />
                      </button>
                      <span className="module-duration">
                        {known ? 'Bỏ qua trong kế hoạch' : `${hoursText(stage.work.reduce((s, w) => s + w.minutes, 0))} · ${stage.work.length} việc thực hành`}
                      </span>
                    </div>
                    <div className="order-buttons">
                      <button aria-label={`Đưa ${stage.title} lên`} className="icon-button" disabled={index === 0 || status === 'saving'} onClick={() => move(stage.id, -1)}>
                        <ChevronUp size={15} />
                      </button>
                      <button aria-label={`Đưa ${stage.title} xuống`} className="icon-button" disabled={index === selectedStages.length - 1 || status === 'saving'} onClick={() => move(stage.id, 1)}>
                        <ChevronDown size={15} />
                      </button>
                      <button aria-label={`Bỏ ${stage.title}`} className="icon-button" disabled={status === 'saving'} onClick={() => {
                        actions.updateDraft(selectedTrackId, { selectedStageIds: draft.selectedStageIds.filter(id => id !== stage.id) });
                        toast('Đã bỏ chặng khỏi roadmap');
                      }}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="selected-module-bottom">
                    <label className="checkbox-label">
                      <input type="checkbox" disabled={status === 'saving'} checked={known} onChange={e => toggleKnown(stage.id, e.target.checked)} />
                      Đã biết
                    </label>
                    <label className="source-select">
                      <BookOpen size={14} />
                      <select aria-label={`Nguồn học cho ${stage.title}`} disabled={status === 'saving'} value={draft.resourceByStage[stage.id] || stage.defaultResourceId} onChange={e => updateResource(stage.id, e.target.value)}>
                        {stage.resourceIds.map(rid => {
                          const r = resources.find(x => x.id === rid);
                          return r ? <option key={r.id} value={r.id}>{r.provider} · {r.title}</option> : null;
                        })}
                      </select>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
          {selectedStages.length === 0 && (
            <div className="empty-inline">
              Roadmap đang trống.
              <Link className="text-link" to="/path">Chọn chặng muốn học <ArrowRight size={15} /></Link>
            </div>
          )}
          <div className="paper-footnote">
            <CheckCheck size={16} />Các kỹ năng đã biết được bỏ qua khi tạo kế hoạch.
          </div>
        </section>
        <aside className="plan-builder">
          <span className="eyebrow">MAKE A LITTLE ROOM</span>
          <h2>Turn curiosity<br /><em>into a habit.</em></h2>
          <label>
            Mục tiêu của bạn
            <input disabled={status === 'saving'} maxLength={120} value={draft.goal} onChange={e => actions.updateDraft(selectedTrackId, { goal: e.target.value })} placeholder="Ví dụ: Xây API quản lý công việc" />
          </label>
          <label className="hours-label">
            Thời gian mỗi tuần
            <span><strong>{draft.hoursPerWeek}</strong> giờ</span>
            <input type="range" disabled={status === 'saving'} min="2" max="20" step="1" value={draft.hoursPerWeek} aria-label="Số giờ học mỗi tuần" onChange={e => actions.updateDraft(selectedTrackId, { hoursPerWeek: Number(e.target.value) })} />
            <span className="range-labels"><small>2 giờ</small><small>20 giờ</small></span>
          </label>
          <label>
            Ngày bắt đầu
            <input type="date" disabled={status === 'saving'} value={draft.startDate} onChange={e => actions.updateDraft(selectedTrackId, { startDate: e.target.value })} />
          </label>
          <div className="plan-estimate">
            <div><span>{activeStages.length}</span><small>chặng học</small></div>
            <div><span>{hoursText(minutes)}</span><small>thực hành dự kiến</small></div>
            <div><span>{weekCount}</span><small>tuần dự kiến</small></div>
          </div>
          <p className="builder-note">Lịch chia bài học và thực hành theo quỹ thời gian của bạn. Bạn có thể sửa từng việc sau khi tạo.</p>
          {issues.length > 0 && (
            <div role="alert" className="form-error">
              {issues.map((err, i) => <p key={i}>{err.message}</p>)}
            </div>
          )}
          <button className="primary-button full-width" disabled={status === 'saving'} onClick={requestBuild}>
            {status === 'saving' ? 'Đang xử lý...' : 'Tạo kế hoạch của tôi'} <ArrowRight size={17} />
          </button>
          <span className="estimate-caption">Đây là kế hoạch cho dự án đầu tiên.<br />Thời gian học thực tế có thể khác.</span>
        </aside>
      </div>
      {proposedDate && (
        <Dialog title="Bắt đầu vào Thứ Hai?" eyebrow="MY ROADMAP" onClose={() => setProposedDate(null)}>
          <div className="dialog-body">
            <p>Bạn chọn {proposedDate.original}. Mỗi tuần học bắt đầu vào Thứ Hai. Đề xuất chuyển ngày bắt đầu sang {proposedDate.monday} (Thứ Hai kế tiếp).</p>
            <p>Chỉ áp dụng khi bạn xác nhận; kế hoạch đang học chưa thay đổi.</p>
            <div className="dialog-actions">
              <button className="secondary-button" disabled={status === 'saving'} onClick={() => setProposedDate(null)}>Giữ ngày đã chọn</button>
              <button className="primary-button" disabled={status === 'saving'} onClick={confirmDateAndBuild}>Dùng ngày {proposedDate.monday}</button>
            </div>
          </div>
        </Dialog>
      )}
      {preview && (
        <Dialog title="Tạo lại kế hoạch?" eyebrow="MY PLAN" onClose={() => actions.cancelRegeneration()}>
          <div className="dialog-body">
            <p>Kế hoạch sẽ được sắp lại theo roadmap, nguồn học và thời gian mới. Việc đã hoàn thành và ghi chú của các bài còn trong roadmap được giữ lại.</p>
            <p>Các việc tự thêm và chỉnh sửa tiêu đề, thời lượng trong kế hoạch cũ sẽ được thay bằng kế hoạch mới. Khi đổi nhánh, các bài triển khai theo ngôn ngữ cũ sẽ được thay; ngày hoàn thành của bài được giữ lại vẫn giữ nguyên.</p>
            <p className="builder-note" style={{ marginTop: '1rem' }}>
              Dự kiến thay đổi: {preview.previousTaskCount} việc hiện tại → {preview.nextPlan.current.tasks.length} việc sau khi tạo lại.
            </p>
            {issues.length > 0 && (
              <div role="alert" className="form-error">
                {issues.map((err, i) => <p key={i}>{err.message}</p>)}
              </div>
            )}
            <div className="dialog-actions">
              <button className="secondary-button" disabled={status === 'saving'} onClick={() => actions.cancelRegeneration()}>Giữ kế hoạch hiện tại</button>
              <button className="primary-button" disabled={status === 'saving'} onClick={confirmRebuildAction}>
                {status === 'saving' ? 'Đang xử lý...' : 'Tạo lại kế hoạch'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
