import type {
  ContentPack, CredentialGoal, LearningPlan, LearningResource, LearningStage, LearningTrack,
  OperationResult, RoadmapDraft, Workspace, WorkspacePersistence, BackupFile,
} from '../domain/contracts';
import type { MigrationChoices, MigrationPreparation } from '../persistence/migration';
import type { BackupPreview, ImportChoices, exportBackup } from '../persistence/backup';
import type { PlanMeta } from '../state';

export type TransferReview = { kind: 'migration'; value: Extract<MigrationPreparation, {kind:'preview'}> }
  | { kind: 'backup'; value: BackupPreview & {ticket:string} };

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
  transfer: TransferReview | null;
};

/** Shared UI contract. Features never access storage directly. */
export type WorkspaceActions = {
  selectTrack(trackId: string): OperationResult<RoadmapDraft>;
  updateDraft(trackId: string, patch: Partial<Omit<RoadmapDraft, 'trackId'>>): OperationResult<RoadmapDraft>;
  getDraft(trackId: string): RoadmapDraft | null;
  resolveTrack(trackId: string): OperationResult<ResolvedTrack>;
  saveDraft(): Promise<OperationResult<Workspace>>;
  savePlan(next: LearningPlan, expected: LearningPlan): Promise<OperationResult<Workspace>>;
  toggleCredential(id: string): Promise<OperationResult<Workspace>>;
  createPlan(trackId: string): Promise<OperationResult<LearningPlan>>;
  selectPlan(planId: string): Promise<OperationResult<Workspace>>;
  previewRegeneration(planId: string): OperationResult<RegenerationPreview>;
  confirmRegeneration(token: string): Promise<OperationResult<LearningPlan>>;
  cancelRegeneration(): void;
  retrySave(): Promise<OperationResult<Workspace>>;
  /** Confirm discarding this exact pending snapshot; reload committed data, never write. */
  discardPendingSave(expected: Workspace): Promise<OperationResult<Workspace>>;
  reloadWorkspace(discardUnsaved?: boolean): Promise<OperationResult<Workspace>>;
  saveProfile(profile: Workspace['profile']): Promise<OperationResult<Workspace>>;
  savePreferences(preferences: Workspace['preferences']): Promise<OperationResult<Workspace>>;
  inspectBackup(raw: string): OperationResult<BackupFile>;
  exportBackupFile(): ReturnType<typeof exportBackup>;
  getLegacyRaw(): OperationResult<string | null>;
  prepareMigration(choices: Partial<MigrationChoices>, metadata?: PlanMeta): Promise<OperationResult<MigrationPreparation>>;
  prepareImport(raw: string, choices: Partial<ImportChoices>): Promise<OperationResult<BackupPreview & {ticket:string}>>;
  confirmTransfer(): Promise<OperationResult<Workspace>>;
  cancelTransfer(): OperationResult<void>;
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
  readLegacy?: () => string | null;
};
