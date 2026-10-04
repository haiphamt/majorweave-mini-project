// Hợp đồng đề xuất để Hải duyệt; chưa được import vào ứng dụng đang chạy.
// ID nội dung ổn định qua các bản biên soạn; ID dữ liệu người dùng là UUID.
export type ISODate = string; // YYYY-MM-DD; phải kiểm tra cả ngày thực tế.
export type Instant = string; // ISO 8601 có timezone.
export type ReviewStatus = 'draft' | 'review' | 'ready';
export type RoadmapLink = { label: string; url: string };

export type LearningResource = {
  id: string;
  title: string;
  provider: string;
  url: string;
  language: 'vi' | 'en';
  format: 'article' | 'video' | 'course' | 'exercise' | 'lab';
  cost: 'free' | 'mixed' | 'paid' | 'unknown';
  level: 'introductory' | 'intermediate' | 'advanced' | 'mixed';
  accessNote: string;
  checkedAt: ISODate | null;
};
export type CredentialGoal = {
  id: string;
  name: string;
  provider: string;
  kind: 'course_certificate' | 'program_certificate' | 'exam_certificate' | 'skill_assessment';
  url: string;
  cost: 'free' | 'paid' | 'unknown';
  prerequisites: string;
  requirements: string;
  checkedAt: ISODate | null;
};
export type WorkTemplate = {
  id: string;
  revision: number; // Tăng khi thay yêu cầu hoặc lượng công việc.
  title: string;
  minutes: number; // Ước lượng cho bài này; không phải thời lượng toàn khóa.
  acceptance: string[];
};
export type LearningStage = {
  id: string;
  title: string;
  phase: 'foundation' | 'build' | 'ship' | 'expand';
  description: string;
  outcome: string;
  prerequisiteIds: string[];
  resourceIds: string[];
  defaultResourceId: string;
  optional: boolean;
  work: WorkTemplate[];
};
export type LearningTrack = {
  id: string; // Toàn cục: backend.node, frontend.react, fullstack.react-node...
  pathId: string;
  label: string;
  stageIds: string[]; // Thứ tự mong muốn; vẫn kiểm tra tiên quyết.
  credentialIds: string[];
  roadmapLinks: RoadmapLink[];
  portfolio: { title: string; acceptance: string[] };
};
export type ContentPack = {
  schemaVersion: 1;
  contentVersion: string;
  pathId: string;
  reviewStatus: ReviewStatus;
  stages: LearningStage[];
  resources: LearningResource[];
  credentials: CredentialGoal[];
  tracks: LearningTrack[];
};
export type RoadmapDraft = {
  trackId: string;
  selectedStageIds: string[];
  knownStageIds: string[];
  resourceByStage: Record<string, string>;
  goal: string;
  hoursPerWeek: number;
  startDate: ISODate; // Thứ Hai; UI giải thích nếu người dùng chọn ngày khác.
};
export type ResourceSnapshot = Pick<LearningResource, 'id' | 'title' | 'provider' | 'url'>;
export type PlanTask = {
  id: string; // UUID của một việc học; dời tuần không đổi ID.
  stageId: string;
  workId: string | null; // null cho việc tự thêm.
  workRevision: number | null;
  segment: { fromMinute: number; toMinute: number } | null;
  title: string;
  minutes: number;
  acceptance: string[];
  source: ResourceSnapshot | null;
  weekIndex: number | null; // 0-based; null = backlog.
  dayIndex: number | null; // 0 = Thứ Hai; null = chưa chọn ngày.
  status: 'todo' | 'done' | 'skipped';
  customized: boolean; // Đã sửa yêu cầu/thời lượng; tạo lại không ghi đè template.
  completionId: string | null;
  notes: string;
};
export type StudyCompletion = {
  id: string;
  taskId: string;
  completedAt: Instant | null; // null cho việc cũ thiếu ngày.
  localDate: ISODate | null;
  timeZone: string | null; // Timezone tại lần ghi nhận, giữ nguyên sau đó.
  estimatedMinutes: number;
  revertedAt: Instant | null;
};
export type ClosedWeek = {
  weekIndex: number;
  closedAt: Instant;
  tasks: PlanTask[]; // Snapshot trước khi dời/bỏ việc chưa xong.
  total: number;
  done: number;
  estimatedCompletedMinutes: number;
};
export type PlanGeneration = {
  id: string;
  createdAt: Instant;
  trackId: string;
  contentVersion: string;
  selectedStageIds: string[];
  knownStageIds: string[];
  resourceByStage: Record<string, string>;
  tasks: PlanTask[];
  closedWeeks: ClosedWeek[];
  goal: string;
  hoursPerWeek: number;
  startDate: ISODate;
};
export type LearningPlan = {
  id: string;
  name: string;
  pathId: string;
  trackId: string;
  contentVersion: string;
  createdAt: Instant;
  status: 'active' | 'archived';
  current: PlanGeneration;
  history: PlanGeneration[];
  completions: StudyCompletion[]; // Một sổ ghi nhận cho cả các lần tạo lại.
};
export type Workspace = {
  schemaVersion: 2;
  revision: number;
  profile: { displayName: string; majorId: string | null; timeZone: string };
  preferences: { resourceLanguage: 'all' | 'vi' | 'en'; preferFree: boolean };
  activePlanId: string | null;
  plans: LearningPlan[];
  drafts: Record<string, RoadmapDraft>; // key = trackId.
  savedCredentialIds: string[];
  imports: { fingerprint: string; importedAt: Instant; planIds: string[] }[];
};
export type BackupFile = {
  format: 'majorweave-backup';
  formatVersion: 1;
  exportedAt: Instant;
  workspace: Workspace;
};
export type ValidationIssue = { code: string; field: string; message: string };
export type OperationResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: 'validation' | 'storage' | 'conflict' | 'unsupported_version'; issues: ValidationIssue[] };

// Chữ ký hàm cần triển khai sau khi duyệt, không phải hàm đã có.
export type PlannerFunction = (
  track: LearningTrack, stages: LearningStage[], resources: LearningResource[],
  draft: RoadmapDraft, context: { contentVersion: string; planId: string; generationId: string; nextTaskId: () => string; now: Instant }
) => OperationResult<LearningPlan>;
export type LoadWorkspaceFunction = () => Promise<OperationResult<Workspace>>;
export type SaveWorkspaceFunction = (
  next: Workspace, expectedRevision: number
) => Promise<OperationResult<Workspace>>;
