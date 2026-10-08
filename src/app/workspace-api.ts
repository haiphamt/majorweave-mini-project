import type {
  ContentPack, CredentialGoal, LearningPlan, LearningResource, LearningStage, LearningTrack,
  OperationResult, RoadmapDraft, Workspace, WorkspacePersistence,
} from '../domain/contracts';

export type { WorkspacePersistence } from '../domain/contracts';

export type ResolvedTrack = {
  track: LearningTrack;
  stages: LearningStage[];
  resources: LearningResource[];
  credentials: CredentialGoal[];
  contentVersion: string;
};

export type RegenerationPreview = {
  token: string;
  planId: string;
  previousTaskCount: number;
  nextPlan: LearningPlan;
};

export type WorkspaceSnapshot = {
  workspace: Workspace | null;
  selectedTrackId: string | null;
  status: 'loading' | 'ready' | 'saving' | 'error' | 'conflict';
  dirty: boolean;
  error: Extract<OperationResult<never>, { ok: false }> | null;
  preview: RegenerationPreview | null;
  unsavedWorkspace: Workspace | null;
};

/** Shared UI contract. Features never access storage directly. */
export type WorkspaceActions = {
  selectTrack(trackId: string): OperationResult<RoadmapDraft>;
  updateDraft(trackId: string, patch: Partial<Omit<RoadmapDraft, 'trackId'>>): OperationResult<RoadmapDraft>;
  getDraft(trackId: string): RoadmapDraft | null;
  resolveTrack(trackId: string): OperationResult<ResolvedTrack>;
  saveDraft(): Promise<OperationResult<Workspace>>;
  createPlan(trackId: string): Promise<OperationResult<LearningPlan>>;
  selectPlan(planId: string): Promise<OperationResult<Workspace>>;
  previewRegeneration(planId: string): OperationResult<RegenerationPreview>;
  confirmRegeneration(token: string): Promise<OperationResult<LearningPlan>>;
  cancelRegeneration(): void;
  retrySave(): Promise<OperationResult<Workspace>>;
  reloadWorkspace(discardUnsaved?: boolean): Promise<OperationResult<Workspace>>;
};

export type WorkspaceController = WorkspaceActions & {
  initialize(): Promise<OperationResult<Workspace>>;
  getSnapshot(): WorkspaceSnapshot;
  subscribe(listener: () => void): () => void;
};

export type WorkspaceOptions = {
  persistence: WorkspacePersistence;
  packs: readonly ContentPack[];
  now: () => string;
  today: () => string;
  nextId: () => string;
};
