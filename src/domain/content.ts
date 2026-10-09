import type { ContentPack, LearningTrack, LearningStage, LearningResource, OperationResult, CredentialGoal, ValidationIssue } from './contracts';

export type ResolvedContent = { track: LearningTrack; stages: LearningStage[]; resources: LearningResource[]; credentials: CredentialGoal[]; contentVersion: string };

/** Resolve one track against all supplied packs. Never import the registry or mutate inputs. */
export function resolveTrackContent(packs: readonly ContentPack[], trackId: string): OperationResult<ResolvedContent> {
  const issues: ValidationIssue[] = [];
  const add = (code: string, field: string, message: string) => issues.push({ code, field, message });
  function index<T extends { id: string }>(items: readonly T[], kind: string): Map<string, T> {
    const map = new Map<string, T>();
    for (const item of items) {
      if (!item.id.trim()) add('invalid_id', kind, `ID ${kind} không được rỗng.`);
      if (map.has(item.id)) add('duplicate_id', kind, `ID ${kind} bị trùng: ${item.id}.`);
      map.set(item.id, item);
    }
    return map;
  }
  const tracks = index(packs.flatMap(p => p.tracks), 'track');
  const stageMap = index(packs.flatMap(p => p.stages), 'stage');
  const resourceMap = index(packs.flatMap(p => p.resources), 'resource');
  const credentialMap = index(packs.flatMap(p => p.credentials), 'credential');
  const track = tracks.get(trackId);
  if (!track) add('not_found', 'trackId', `Không tìm thấy nội dung cho track ID: ${trackId}`);
  if (!track || issues.length) return { ok: false, code: 'validation', issues };
  const pack = packs.find(p => p.tracks.includes(track))!;
  if (track.pathId !== pack.pathId) add('path_mismatch', 'pathId', 'Track không thuộc hướng chứa nó.');
  const stageIds = new Set(track.stageIds);
  if (stageIds.size !== track.stageIds.length) add('duplicate_stage', 'stageIds', 'Track tham chiếu một chặng nhiều lần.');
  if (!track.stageIds.length) add('empty_track', 'stageIds', 'Track cần ít nhất một chặng.');
  const stages: LearningStage[] = [];
  for (const id of track.stageIds) {
    const stage = stageMap.get(id);
    if (!stage) add('missing_stage', 'stageIds', `Không tìm thấy định nghĩa cho chặng: ${id}`);
    else stages.push(stage);
  }
  // Detect cycles separately from missing prerequisites/order to return useful diagnostics.
  const visiting = new Set<string>(), visited = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) { add('prerequisite_cycle', id, `Vòng tiên quyết tại ${id}.`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const stage = stageMap.get(id);
    for (const prerequisite of stage?.prerequisiteIds ?? []) {
      if (!stageIds.has(prerequisite)) add('missing_prerequisite', id, `Thiếu tiên quyết ${prerequisite} trong track.`);
      else visit(prerequisite);
    }
    visiting.delete(id); visited.add(id);
  }
  track.stageIds.forEach(visit);
  const seen = new Set<string>(), resourceIds = new Set<string>();
  for (const stage of stages) {
    for (const prerequisite of stage.prerequisiteIds) if (!seen.has(prerequisite)) add('prerequisite_order', stage.id, `Tiên quyết ${prerequisite} phải đứng trước ${stage.id}.`);
    seen.add(stage.id);
    if (!stage.resourceIds.length || !stage.resourceIds.includes(stage.defaultResourceId)) add('invalid_default_resource', stage.id, 'Nguồn mặc định phải thuộc chặng.');
    if (new Set(stage.resourceIds).size !== stage.resourceIds.length) add('duplicate_resource', stage.id, 'Nguồn tham chiếu bị trùng.');
    for (const id of stage.resourceIds) {
      if (!resourceMap.has(id)) add('missing_resource', stage.id, `Thiếu nguồn ${id}.`);
      resourceIds.add(id);
    }
  }
  if (new Set(track.credentialIds).size !== track.credentialIds.length) add('duplicate_credential', 'credentialIds', 'Mục tiêu chứng nhận bị trùng.');
  for (const id of track.credentialIds) if (!credentialMap.has(id)) add('missing_credential', 'credentialIds', `Thiếu mục tiêu ${id}.`);
  if (issues.length) return { ok: false, code: 'validation', issues };
  const contributingPacks = packs.filter(p => p === pack || p.stages.some(s => seen.has(s.id)) || p.resources.some(r => resourceIds.has(r.id)) || p.credentials.some(c => track.credentialIds.includes(c.id)));
  return { ok: true, value: structuredClone({ track, stages, resources: [...resourceIds].map(id => resourceMap.get(id)!), credentials: track.credentialIds.map(id => credentialMap.get(id)!), contentVersion: contributingPacks.map(p => `${p.pathId}:${p.contentVersion}`).sort().join('|') }) };
}