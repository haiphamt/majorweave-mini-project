// src/domain/planner.ts
// Pure domain logic — không import React, feature, persistence hoặc registry.
// Clock và ID được truyền vào qua context để dễ test.

import type {
  LearningTrack,
  LearningStage,
  LearningResource,
  LearningPlan,
  PlanGeneration,
  PlanTask,
  RoadmapDraft,
  OperationResult,
  ValidationIssue,
  PlannerFunction,
  ISODate,
  Instant,
} from './contracts';

// ─── Hằng số ─────────────────────────────────────────────────────────────────

const MIN_HOURS = 2;
const MAX_HOURS = 20;
const MAX_SEGMENT_MINUTES = 120;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Trả về true nếu chuỗi là ngày hợp lệ định dạng YYYY-MM-DD.
 * Kiểm tra cả rollover (vd: 2024-02-30 sẽ bị roll sang 03-01).
 */
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  // Dùng Date.UTC để tránh phụ thuộc timezone cục bộ.
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(utc.getTime())) return false;
  // Nếu JS tự điều chỉnh ngày (rollover) thì UTC components sẽ không còn match.
  return utc.getUTCFullYear() === y && utc.getUTCMonth() === m - 1 && utc.getUTCDate() === d;
}

/**
 * Trả về true nếu ngày là Thứ Hai (getDay() === 1).
 * Yêu cầu value đã là ngày hợp lệ.
 */
export function isMonday(isoDate: ISODate): boolean {
  // Dùng UTC để tránh phụ thuộc timezone cục bộ.
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1;
}

/** Tên ngày trong tuần tiếng Việt, theo getDay() (0=CN). */
const DAY_NAMES_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

// ─── Validate ─────────────────────────────────────────────────────────────────

/**
 * Kiểm tra toàn bộ đầu vào trước khi sinh kế hoạch.
 * Trả về mảng ValidationIssue rỗng nếu tất cả hợp lệ.
 *
 * Pure function — không có side effect.
 */
export function validateDraft(
  draft: RoadmapDraft,
  track: LearningTrack,
  stages: LearningStage[],
  resources: LearningResource[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // ── 1. hoursPerWeek: số nguyên, 2–20 ────────────────────────────────────
  if (
    !Number.isInteger(draft.hoursPerWeek) ||
    draft.hoursPerWeek < MIN_HOURS ||
    draft.hoursPerWeek > MAX_HOURS
  ) {
    issues.push({
      code: 'INVALID_HOURS_PER_WEEK',
      field: 'hoursPerWeek',
      message: `Số giờ học mỗi tuần phải là số nguyên từ ${MIN_HOURS} đến ${MAX_HOURS}. Nhận được: ${draft.hoursPerWeek}.`,
    });
  }

  // ── 2. startDate: ngày thực tế và phải là Thứ Hai ────────────────────────
  if (!isValidDate(draft.startDate)) {
    issues.push({
      code: 'INVALID_START_DATE',
      field: 'startDate',
      message: `Ngày bắt đầu "${draft.startDate}" không hợp lệ. Phải là định dạng YYYY-MM-DD và là ngày có thật.`,
    });
  } else if (!isMonday(draft.startDate)) {
    const dayName = DAY_NAMES_VI[new Date(draft.startDate + 'T00:00:00').getDay()];
    issues.push({
      code: 'START_DATE_NOT_MONDAY',
      field: 'startDate',
      message: `Ngày bắt đầu phải là Thứ Hai. "${draft.startDate}" là ${dayName}.`,
    });
  }

  // ── 3. trackId phải khớp với track truyền vào ─────────────────────────────
  if (draft.trackId !== track.id) {
    issues.push({
      code: 'TRACK_ID_MISMATCH',
      field: 'trackId',
      message: `Draft trackId "${draft.trackId}" không khớp với track "${track.id}".`,
    });
  }

  // Xây index để tra nhanh
  const stageMap = new Map(stages.map(s => [s.id, s]));
  const trackStageSet = new Set(track.stageIds);

  // ── 4. selectedStageIds: không rỗng, mọi ID phải tồn tại trong track ──────
  if (draft.selectedStageIds.length === 0) {
    issues.push({
      code: 'NO_STAGES_SELECTED',
      field: 'selectedStageIds',
      message: 'Phải chọn ít nhất một chặng học.',
    });
  }

  for (const sid of draft.selectedStageIds) {
    if (!stageMap.has(sid)) {
      issues.push({
        code: 'UNKNOWN_STAGE_ID',
        field: 'selectedStageIds',
        message: `Chặng "${sid}" không tồn tại trong nội dung.`,
      });
    } else if (!trackStageSet.has(sid)) {
      issues.push({
        code: 'STAGE_NOT_IN_TRACK',
        field: 'selectedStageIds',
        message: `Chặng "${sid}" không thuộc track "${track.id}".`,
      });
    }
  }

  // ── 4a. Kiểm tra trùng lặp và thứ tự trong selectedStageIds ──────────────
  const selectedSet = new Set<string>();
  let lastTrackIndex = -1;
  let hasOrderOrDuplicateIssue = false;

  for (const sid of draft.selectedStageIds) {
    if (selectedSet.has(sid)) {
      issues.push({
        code: 'DUPLICATE_STAGE_SELECTION',
        field: 'selectedStageIds',
        message: `Chặng "${sid}" được chọn nhiều lần.`,
      });
      hasOrderOrDuplicateIssue = true;
      break;
    }
    selectedSet.add(sid);

    const trackIndex = track.stageIds.indexOf(sid);
    if (trackIndex !== -1) {
      if (trackIndex < lastTrackIndex) {
        issues.push({
          code: 'INVALID_STAGE_ORDER',
          field: 'selectedStageIds',
          message: `Thứ tự chặng được chọn không hợp lệ. Phải tuân theo thứ tự trong track.`,
        });
        hasOrderOrDuplicateIssue = true;
        break;
      }
      lastTrackIndex = trackIndex;
    }
  }

  // ── 5. knownStageIds: mọi ID phải tồn tại ────────────────────────────────
  for (const kid of draft.knownStageIds) {
    if (!stageMap.has(kid)) {
      issues.push({
        code: 'UNKNOWN_KNOWN_STAGE_ID',
        field: 'knownStageIds',
        message: `Chặng đã biết "${kid}" không tồn tại trong nội dung.`,
      });
    }
  }

  // ── 6. Tiên quyết (prerequisites) ────────────────────────────────────────
  // Tập "có sẵn" = đã chọn ∪ đã biết
  const available = new Set([...draft.selectedStageIds, ...draft.knownStageIds]);

  for (const sid of draft.selectedStageIds) {
    const stage = stageMap.get(sid);
    if (!stage) continue; // đã báo lỗi ở trên
    for (const prereqId of stage.prerequisiteIds) {
      if (!available.has(prereqId)) {
        issues.push({
          code: 'MISSING_PREREQUISITE',
          field: 'selectedStageIds',
          message: `Chặng "${sid}" yêu cầu tiên quyết "${prereqId}" nhưng chặng này không được chọn và không có trong danh sách đã biết.`,
        });
      }
    }
  }

  // ── 7. Không còn việc (tất cả đã biết) → không tạo plan ──────────────────
  const toLearnIds = draft.selectedStageIds.filter(
    sid => !draft.knownStageIds.includes(sid),
  );
  if (draft.selectedStageIds.length > 0 && toLearnIds.length === 0) {
    issues.push({
      code: 'NOTHING_TO_PLAN',
      field: 'selectedStageIds',
      message:
        'Tất cả chặng đã được đánh dấu là đã biết. Không có việc để lên kế hoạch.',
    });
  }

  // ── 8. resourceByStage: chặng cần học phải có nguồn hợp lệ ───────────────
  const resourceMap = new Map(resources.map(r => [r.id, r]));

  for (const sid of toLearnIds) {
    const stage = stageMap.get(sid);
    if (!stage) continue;
    const chosenId = draft.resourceByStage[sid] ?? stage.defaultResourceId;
    if (!chosenId || !resourceMap.has(chosenId)) {
      issues.push({
        code: 'MISSING_RESOURCE',
        field: `resourceByStage.${sid}`,
        message: `Chặng "${sid}" không có tài nguyên hợp lệ. Đã chọn: "${chosenId ?? 'không có'}".`,
      });
    } else if (!stage.resourceIds.includes(chosenId)) {
      issues.push({
        code: 'RESOURCE_NOT_IN_STAGE',
        field: `resourceByStage.${sid}`,
        message: `Tài nguyên "${chosenId}" không thuộc danh sách tài nguyên của chặng "${sid}".`,
      });
    }
  }

  // ── 9. goal không được rỗng ───────────────────────────────────────────────
  if (!draft.goal || draft.goal.trim().length === 0) {
    issues.push({
      code: 'MISSING_GOAL',
      field: 'goal',
      message: 'Mục tiêu học không được để trống.',
    });
  }

  return issues;
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

type Chunk = { index: number; fromMinute: number; toMinute: number; minutes: number };

/**
 * Chia một bài học thành các đoạn ≤ MAX_SEGMENT_MINUTES phút.
 * Nếu bài vừa đúng (≤ 120 phút), trả về 1 chunk duy nhất.
 */
function chunkWork(totalMinutes: number): Chunk[] {
  const chunks: Chunk[] = [];
  let remaining = totalMinutes;
  let cursor = 0;
  let index = 0;
  while (remaining > 0) {
    const size = Math.min(remaining, MAX_SEGMENT_MINUTES);
    chunks.push({ index, fromMinute: cursor, toMinute: cursor + size, minutes: size });
    cursor += size;
    remaining -= size;
    index++;
  }
  return chunks;
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

/**
 * Gán weekIndex cho từng task dựa trên quỹ hoursPerWeek × 60 phút/tuần.
 * dayIndex luôn là null (UI chọn ngày sau).
 * Task có minutes > budgetPerWeek được đưa vào backlog (weekIndex = null).
 */
function scheduleIntoWeeks(tasks: PlanTask[], hoursPerWeek: number): PlanTask[] {
  const budgetPerWeek = hoursPerWeek * 60;
  let weekIndex = 0;
  let usedThisWeek = 0;

  return tasks.map(task => {
    if (task.minutes > budgetPerWeek) {
      // Bài vượt cả quỹ tuần → backlog, không block lịch
      return { ...task, weekIndex: null };
    }
    if (usedThisWeek + task.minutes > budgetPerWeek) {
      weekIndex++;
      usedThisWeek = 0;
    }
    usedThisWeek += task.minutes;
    return { ...task, weekIndex };
  });
}

// ─── generatePlan ─────────────────────────────────────────────────────────────

/**
 * Triển khai PlannerFunction từ contracts.ts.
 *
 * - track, stages, resources đã được resolve từ registry/resolver bên ngoài.
 * - draft từ UI (RoadmapDraft).
 * - context cung cấp clock, planId, generationId và hàm nextTaskId() để testable.
 * - Trả OperationResult<LearningPlan> — không ghi storage, không dispatch event.
 *
 * TODO: Viết thêm regeneratePlan (giữ lịch sử, khớp định danh, backlog customized).
 */
export const generatePlan: PlannerFunction = (
  track,
  stages,
  resources,
  draft,
  context,
) => {
  // ── Bước 1: Validate ─────────────────────────────────────────────────────
  const issues = validateDraft(draft, track, stages, resources);
  if (issues.length > 0) {
    return { ok: false, code: 'validation', issues };
  }

  const stageMap = new Map(stages.map(s => [s.id, s]));
  const resourceMap = new Map(resources.map(r => [r.id, r]));
  const toLearnIds = draft.selectedStageIds.filter(
    sid => !draft.knownStageIds.includes(sid),
  );

  // ── Bước 2: Build danh sách task thô ────────────────────────────────────
  const rawTasks: PlanTask[] = [];

  for (const sid of toLearnIds) {
    const stage = stageMap.get(sid)!;
    const chosenResourceId = draft.resourceByStage[sid] ?? stage.defaultResourceId;
    const resource = resourceMap.get(chosenResourceId) ?? null;
    const resourceSnapshot = resource
      ? { id: resource.id, title: resource.title, provider: resource.provider, url: resource.url }
      : null;

    for (const work of stage.work) {
      const chunks = chunkWork(work.minutes);
      const isMultiChunk = chunks.length > 1;

      for (const chunk of chunks) {
        rawTasks.push({
          id: context.nextTaskId(),
          stageId: sid,
          workId: work.id,
          workRevision: work.revision,
          segment: isMultiChunk
            ? { fromMinute: chunk.fromMinute, toMinute: chunk.toMinute }
            : null,
          title: isMultiChunk
            ? `${work.title} (phần ${chunk.index + 1}/${chunks.length})`
            : work.title,
          minutes: chunk.minutes,
          acceptance: work.acceptance,
          source: resourceSnapshot,
          weekIndex: null,   // Sẽ được gán ở bước schedule
          dayIndex: null,
          status: 'todo',
          customized: false,
          completionId: null,
          notes: '',
        });
      }
    }
  }

  // ── Bước 3: Xếp lịch vào tuần ───────────────────────────────────────────
  const scheduledTasks = scheduleIntoWeeks(rawTasks, draft.hoursPerWeek);

  // ── Bước 4: Build PlanGeneration ────────────────────────────────────────
  const generation: PlanGeneration = {
    id: context.generationId,
    createdAt: context.now,
    trackId: draft.trackId,
    contentVersion: context.contentVersion,
    selectedStageIds: [...draft.selectedStageIds],
    knownStageIds: [...draft.knownStageIds],
    resourceByStage: { ...draft.resourceByStage },
    tasks: scheduledTasks,
    closedWeeks: [],
    goal: draft.goal,
    hoursPerWeek: draft.hoursPerWeek,
    startDate: draft.startDate,
  };

  // ── Bước 5: Build LearningPlan ───────────────────────────────────────────
  const plan: LearningPlan = {
    id: context.planId,
    name: `${track.label} — ${draft.goal.slice(0, 40)}`,
    pathId: track.pathId,
    trackId: track.id,
    contentVersion: context.contentVersion,
    createdAt: context.now,
    status: 'active',
    current: generation,
    history: [],
    completions: [],
  };

  return { ok: true, value: plan };
};

// ─── regeneratePlan ───────────────────────────────────────────────────────────

/**
 * Tạo lại kế hoạch từ draft mới, giữ lại lịch sử và completion của các task cũ khớp định danh.
 * Các bài tự thêm/sửa (customized) được giữ lại ở backlog.
 */
export const regeneratePlan = (
  oldPlan: LearningPlan,
  track: LearningTrack,
  stages: LearningStage[],
  resources: LearningResource[],
  draft: RoadmapDraft,
  context: { contentVersion: string; generationId: string; nextTaskId: () => string; now: Instant }
): OperationResult<LearningPlan> => {
  // ── Bước 1: Validate ─────────────────────────────────────────────────────
  const issues = validateDraft(draft, track, stages, resources);
  if (issues.length > 0) {
    return { ok: false, code: 'validation', issues };
  }

  const stageMap = new Map(stages.map(s => [s.id, s]));
  const resourceMap = new Map(resources.map(r => [r.id, r]));
  const toLearnIds = draft.selectedStageIds.filter(
    sid => !draft.knownStageIds.includes(sid),
  );

  // ── Bước 2: Build danh sách task thô ────────────────────────────────────
  const rawTasks: PlanTask[] = [];

  for (const sid of toLearnIds) {
    const stage = stageMap.get(sid)!;
    const chosenResourceId = draft.resourceByStage[sid] ?? stage.defaultResourceId;
    const resource = resourceMap.get(chosenResourceId) ?? null;
    const resourceSnapshot = resource
      ? { id: resource.id, title: resource.title, provider: resource.provider, url: resource.url }
      : null;

    for (const work of stage.work) {
      const chunks = chunkWork(work.minutes);
      const isMultiChunk = chunks.length > 1;

      for (const chunk of chunks) {
        rawTasks.push({
          id: context.nextTaskId(),
          stageId: sid,
          workId: work.id,
          workRevision: work.revision,
          segment: isMultiChunk
            ? { fromMinute: chunk.fromMinute, toMinute: chunk.toMinute }
            : null,
          title: isMultiChunk
            ? `${work.title} (phần ${chunk.index + 1}/${chunks.length})`
            : work.title,
          minutes: chunk.minutes,
          acceptance: work.acceptance,
          source: resourceSnapshot,
          weekIndex: null,
          dayIndex: null,
          status: 'todo',
          customized: false,
          completionId: null,
          notes: '',
        });
      }
    }
  }

  // ── Bước 3: Khớp với task cũ ─────────────────────────────────────────────
  const oldTasks = oldPlan.current.tasks;
  const isSameTrack = oldPlan.trackId === draft.trackId;
  
  const retainedTasks: PlanTask[] = [];

  for (const newTask of rawTasks) {
    const old = oldTasks.find(o => 
      !o.customized &&
      o.workId === newTask.workId &&
      o.workRevision === newTask.workRevision &&
      o.segment?.fromMinute === newTask.segment?.fromMinute &&
      o.segment?.toMinute === newTask.segment?.toMinute
    );

    if (old) {
      retainedTasks.push({
        ...newTask,
        id: old.id,
        status: old.status,
        completionId: old.completionId,
        notes: old.notes,
      });
    } else {
      retainedTasks.push(newTask);
    }
  }

  // ── Bước 4: Xếp lịch vào tuần ───────────────────────────────────────────
  const scheduledTasks = scheduleIntoWeeks(retainedTasks, draft.hoursPerWeek);

  // ── Bước 5: Giữ việc tự thêm/sửa ở backlog ──────────────────────────────
  const finalTasks = [...scheduledTasks];
  if (isSameTrack) {
    const customizedTasks = oldTasks.filter(t => t.customized);
    for (const cTask of customizedTasks) {
      finalTasks.push({
        ...cTask,
        weekIndex: null,
        dayIndex: null,
      });
    }
  }

  // ── Bước 6: Build PlanGeneration & LearningPlan ────────────────────────
  const generation: PlanGeneration = {
    id: context.generationId,
    createdAt: context.now,
    trackId: draft.trackId,
    contentVersion: context.contentVersion,
    selectedStageIds: [...draft.selectedStageIds],
    knownStageIds: [...draft.knownStageIds],
    resourceByStage: { ...draft.resourceByStage },
    tasks: finalTasks,
    closedWeeks: [],
    goal: draft.goal,
    hoursPerWeek: draft.hoursPerWeek,
    startDate: draft.startDate,
  };

  const newPlan: LearningPlan = {
    ...oldPlan,
    name: `${track.label} — ${draft.goal.slice(0, 40)}`,
    trackId: track.id,
    pathId: track.pathId,
    contentVersion: context.contentVersion,
    current: generation,
    history: [...oldPlan.history, oldPlan.current],
  };

  return { ok: true, value: newPlan };
};
