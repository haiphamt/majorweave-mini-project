import type { LearningPlan, OperationResult, RoadmapDraft, Workspace } from '../domain/contracts';
import { generatePlan, regeneratePlan } from '../domain/planner';
import { resolveRegisteredTrack } from './resolve-track';
import type { RegenerationPreview, WorkspaceController, WorkspaceOptions, WorkspaceSnapshot } from './workspace-api';

type Failure = Extract<OperationResult<never>, { ok: false }>;
const failure = (code: Failure['code'], issue: string, field: string, message: string): Failure =>
  ({ ok: false, code, issues: [{ code: issue, field, message }] });
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

export function createWorkspaceController(options: WorkspaceOptions): WorkspaceController {
  let snapshot: WorkspaceSnapshot = freeze({ workspace: null, selectedTrackId: null, status: 'loading', dirty: false, error: null, preview: null, unsavedWorkspace: null });
  const listeners = new Set<() => void>();
  let initialization: Promise<OperationResult<Workspace>> | null = null;
  let loading = false;
  let pendingPreview: { public: RegenerationPreview; revision: number; generationId: string; draft: RoadmapDraft; version: number } | null = null;
  let editVersion = 0;
  const emit = (patch: Partial<WorkspaceSnapshot>) => {
    snapshot = freeze({ ...snapshot, ...patch });
    listeners.forEach(listener => listener());
  };
  const guard = (): Failure | null => {
    if (!snapshot.workspace || snapshot.status === 'loading') return failure('storage', 'WORKSPACE_NOT_READY', 'workspace', 'Workspace chưa được tải.');
    if (snapshot.status === 'saving') return failure('conflict', 'SAVE_IN_PROGRESS', 'workspace', 'Đang lưu, vui lòng chờ.');
    if (snapshot.unsavedWorkspace) return failure('conflict', 'PENDING_SAVE', 'workspace', 'Cần thử lưu lại hoặc xử lý bản chưa lưu trước khi tiếp tục.');
    return null;
  };
  const resolveTrack = (trackId: string) => resolveRegisteredTrack(options.packs, trackId);
  const getDraft = (trackId: string): RoadmapDraft | null => {
    if (!snapshot.workspace) return null;
    const saved = snapshot.workspace.drafts[trackId];
    if (saved) return structuredClone(saved);
    const resolved = resolveTrack(trackId);
    if (!resolved.ok) return null;
    const monday = new Date(`${options.today()}T00:00:00Z`);
    monday.setUTCDate(monday.getUTCDate() + (8 - monday.getUTCDay()) % 7);
    return { trackId, selectedStageIds: [...resolved.value.track.stageIds], knownStageIds: [],
      resourceByStage: Object.fromEntries(resolved.value.stages.map(stage => [stage.id, stage.defaultResourceId])),
      goal: '', hoursPerWeek: 5, startDate: monday.toISOString().slice(0, 10) };
  };
  async function load(discardUnsaved = false): Promise<OperationResult<Workspace>> {
    if (loading) return failure('conflict', 'LOAD_IN_PROGRESS', 'workspace', 'Đang tải dữ liệu, vui lòng chờ.');
    if (snapshot.status === 'saving') return failure('conflict', 'SAVE_IN_PROGRESS', 'workspace', 'Đang lưu, vui lòng chờ.');
    if ((snapshot.dirty || snapshot.unsavedWorkspace) && !discardUnsaved) return failure('conflict', 'UNSAVED_CHANGES', 'workspace', 'Chỉ tải lại sau khi xác nhận bỏ bản chưa lưu.');
    loading = true;
    emit({ status: 'loading' });
    try {
      const result = await options.persistence.loadWorkspace();
      if (result.ok) {
        pendingPreview = null; editVersion++;
        const selectedTrackId = result.value.plans.find(plan => plan.id === result.value.activePlanId)?.trackId ?? Object.keys(result.value.drafts)[0] ?? options.packs[0]?.tracks[0]?.id ?? null;
        emit({ workspace: structuredClone(result.value), selectedTrackId, status: 'ready', dirty: false, error: null, preview: null, unsavedWorkspace: null });
      } else emit({ status: 'error', error: result });
      return result;
    } catch {
      const error = failure('storage', 'LOAD_FAILED', 'workspace', 'Không tải được dữ liệu trên thiết bị.');
      emit({ status: 'error', error }); return error;
    } finally { loading = false; }
  }
  async function commit(next: Workspace): Promise<OperationResult<Workspace>> {
    const existing = snapshot.workspace;
    if (!existing || snapshot.status === 'saving' || snapshot.status === 'loading') return failure('conflict', 'WORKSPACE_BUSY', 'workspace', 'Workspace chưa sẵn sàng để lưu.');
    const candidate = structuredClone(next);
    emit({ status: 'saving', error: null });
    let result: OperationResult<Workspace>;
    try { result = await options.persistence.saveWorkspace(candidate, existing.revision); }
    catch { result = failure('storage', 'SAVE_FAILED', 'workspace', 'Không lưu được dữ liệu. Bản chưa lưu vẫn được giữ.'); }
    if (result.ok) {
      pendingPreview = null; editVersion++;
      emit({ workspace: structuredClone(result.value), status: 'ready', dirty: false, error: null, preview: null, unsavedWorkspace: null });
      return { ok: true, value: structuredClone(result.value) };
    }
    emit({ status: result.code === 'conflict' ? 'conflict' : 'error', dirty: true, error: result, unsavedWorkspace: candidate });
    return result;
  }
  const actions: WorkspaceController = {
    initialize: () => initialization ??= load(),
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    resolveTrack, getDraft,
    selectTrack(trackId) {
      const blocked = guard(); if (blocked) return blocked;
      const resolved = resolveTrack(trackId); if (!resolved.ok) return resolved;
      const draft = getDraft(trackId)!;
      emit({ selectedTrackId: trackId });
      return { ok: true, value: draft };
    },
    updateDraft(trackId, patch) {
      const blocked = guard(); if (blocked) return blocked;
      const resolved = resolveTrack(trackId); if (!resolved.ok) return resolved;
      const draft = getDraft(trackId)!;
      const next = { ...draft, ...structuredClone(patch), trackId };
      // Checkbox click order is not curriculum order. Preserve unknown IDs for validation.
      const selected = new Set(next.selectedStageIds);
      next.selectedStageIds = [...resolved.value.track.stageIds.filter(id => selected.has(id)), ...next.selectedStageIds.filter(id => !resolved.value.track.stageIds.includes(id))];
      pendingPreview = null; editVersion++;
      emit({ workspace: { ...snapshot.workspace!, drafts: { ...snapshot.workspace!.drafts, [trackId]: next } }, dirty: true, preview: null, error: null, status: 'ready' });
      return { ok: true, value: structuredClone(next) };
    },
    saveDraft() {
      const blocked = guard(); if (blocked) return Promise.resolve(blocked);
      return commit(snapshot.workspace!);
    },
    async createPlan(trackId) {
      const blocked = guard(); if (blocked) return blocked;
      const resolved = resolveTrack(trackId); if (!resolved.ok) return resolved;
      const draft = getDraft(trackId)!;
      const generated = generatePlan(resolved.value.track, resolved.value.stages, resolved.value.resources, draft,
        { contentVersion: resolved.value.contentVersion, planId: options.nextId(), generationId: options.nextId(), nextTaskId: options.nextId, now: options.now() });
      if (!generated.ok) return generated;
      const result = await commit({ ...snapshot.workspace!, drafts: { ...snapshot.workspace!.drafts, [trackId]: draft },
        plans: [...snapshot.workspace!.plans, generated.value], activePlanId: generated.value.id });
      return result.ok ? { ok: true, value: structuredClone(generated.value) } : result;
    },
    selectPlan(planId) {
      const blocked = guard(); if (blocked) return Promise.resolve(blocked);
      if (!snapshot.workspace!.plans.some(plan => plan.id === planId)) return Promise.resolve(failure('validation', 'PLAN_NOT_FOUND', 'planId', 'Không tìm thấy kế hoạch.'));
      return commit({ ...snapshot.workspace!, activePlanId: planId });
    },
    previewRegeneration(planId) {
      const blocked = guard(); if (blocked) return blocked;
      const plan = snapshot.workspace!.plans.find(item => item.id === planId);
      if (!plan || plan.status === 'archived') return failure('validation', 'PLAN_UNAVAILABLE', 'planId', 'Không thể tạo lại kế hoạch không tồn tại hoặc đã lưu trữ.');
      const draft = getDraft(plan.trackId)!;
      const resolved = resolveTrack(plan.trackId); if (!resolved.ok) return resolved;
      const generated = regeneratePlan(structuredClone(plan), resolved.value.track, resolved.value.stages, resolved.value.resources, draft,
        { contentVersion: resolved.value.contentVersion, generationId: options.nextId(), nextTaskId: options.nextId, now: options.now() });
      if (!generated.ok) return generated;
      const preview = { token: options.nextId(), planId, previousTaskCount: plan.current.tasks.length, nextPlan: generated.value };
      pendingPreview = { public: structuredClone(preview), revision: snapshot.workspace!.revision, generationId: plan.current.id, draft: structuredClone(draft), version: editVersion };
      emit({ preview: structuredClone(preview) });
      return { ok: true, value: structuredClone(preview) };
    },
    async confirmRegeneration(token) {
      const blocked = guard(); if (blocked) return blocked;
      const preview = pendingPreview;
      const current = preview && snapshot.workspace!.plans.find(plan => plan.id === preview.public.planId);
      if (!preview || preview.public.token !== token || preview.revision !== snapshot.workspace!.revision || preview.version !== editVersion || current?.current.id !== preview.generationId)
        return failure('conflict', 'STALE_PREVIEW', 'preview', 'Bản xem trước đã thay đổi; cần xem trước lại.');
      const result = await commit({ ...snapshot.workspace!, drafts: { ...snapshot.workspace!.drafts, [preview.draft.trackId]: preview.draft },
        plans: snapshot.workspace!.plans.map(plan => plan.id === preview.public.planId ? structuredClone(preview.public.nextPlan) : plan) });
      return result.ok ? { ok: true, value: structuredClone(preview.public.nextPlan) } : result;
    },
    cancelRegeneration() { if (snapshot.status === 'saving') return; pendingPreview = null; emit({ preview: null }); },
    retrySave() {
      if (!snapshot.unsavedWorkspace) return Promise.resolve(failure('validation', 'NO_PENDING_SAVE', 'workspace', 'Không có bản đang chờ lưu.'));
      return commit(snapshot.unsavedWorkspace);
    },
    reloadWorkspace: load,
  };
  return actions;
}
