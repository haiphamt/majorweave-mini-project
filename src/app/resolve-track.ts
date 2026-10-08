import type { ContentPack, OperationResult } from '../domain/contracts';
import type { ResolvedTrack } from './workspace-api';

// Integration adapter until MW-TEAM-01's resolver passes missing-reference/order tests.
export function resolveRegisteredTrack(packs: readonly ContentPack[], trackId: string): OperationResult<ResolvedTrack> {
  const tracks = packs.flatMap(pack => pack.tracks);
  const stages = packs.flatMap(pack => pack.stages);
  const resources = packs.flatMap(pack => pack.resources);
  const credentials = packs.flatMap(pack => pack.credentials);
  const invalid = (code: string, field: string, message: string): OperationResult<ResolvedTrack> =>
    ({ ok: false, code: 'validation', issues: [{ code, field, message }] });
  for (const [label, items] of [['track', tracks], ['stage', stages], ['resource', resources], ['credential', credentials]] as const) {
    if (new Set(items.map(item => item.id)).size !== items.length) return invalid('DUPLICATE_CONTENT_ID', label, `ID ${label} bị trùng trong registry.`);
  }
  const track = tracks.find(item => item.id === trackId);
  if (!track) return invalid('TRACK_NOT_FOUND', 'trackId', `Nhánh ${trackId} chưa có nội dung được đăng ký.`);
  const orderedStages = [];
  const seen = new Set<string>();
  for (const id of track.stageIds) {
    const stage = stages.find(item => item.id === id);
    if (!stage || seen.has(id)) return invalid('INVALID_STAGE_REFERENCE', 'stageIds', `Chặng ${id} bị thiếu hoặc trùng.`);
    if (stage.prerequisiteIds.some(prerequisite => !seen.has(prerequisite))) return invalid('INVALID_PREREQUISITE_ORDER', id, `Tiên quyết của ${id} bị thiếu hoặc sai thứ tự.`);
    if (!stage.resourceIds.includes(stage.defaultResourceId) || stage.resourceIds.some(resourceId => !resources.some(resource => resource.id === resourceId))) return invalid('INVALID_RESOURCE_REFERENCE', id, `Nguồn của ${id} bị thiếu hoặc không phù hợp.`);
    orderedStages.push(stage);
    seen.add(id);
  }
  if (track.credentialIds.some(id => !credentials.some(item => item.id === id))) return invalid('INVALID_CREDENTIAL_REFERENCE', 'credentialIds', 'Thiếu mục tiêu chứng nhận được tham chiếu.');
  const resourceIds = new Set(orderedStages.flatMap(stage => stage.resourceIds));
  const contributingPacks = packs.filter(pack => pack.tracks.includes(track) || pack.stages.some(stage => seen.has(stage.id)));
  return { ok: true, value: structuredClone({
    track, stages: orderedStages, resources: resources.filter(resource => resourceIds.has(resource.id)),
    credentials: credentials.filter(credential => track.credentialIds.includes(credential.id)),
    contentVersion: contributingPacks.map(pack => `${pack.pathId}:${pack.contentVersion}`).sort().join('|'),
  }) };
}
