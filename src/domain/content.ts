import { ContentPack, LearningTrack, LearningStage, LearningResource, OperationResult, CredentialGoal } from './contracts';

export type ResolvedContent = {
  track: LearningTrack;
  stages: LearningStage[];
  resources: LearningResource[];
  credentials: CredentialGoal[];
  contentVersion: string;
};

/**
 * Resolver thuần: nhận một mảng các ContentPack và một trackId,
 * trả về nội dung đầy đủ (stages, resources, credentials) được gộp lại cho track đó.
 * Giữ nguyên thứ tự lộ trình học được định nghĩa trong track.stageIds.
 * Lưu ý: Tuyệt đối không import thư viện giao diện (React) hay storage (IndexedDB) vào file này.
 */
export function resolveTrackContent(
  packs: readonly ContentPack[] | ContentPack[],
  trackId: string
): OperationResult<ResolvedContent> {
  let targetTrack: LearningTrack | undefined;
  let targetPack: ContentPack | undefined;

  // 1. Tìm track trong tất cả các pack
  for (const pack of packs) {
    const found = pack.tracks.find(t => t.id === trackId);
    if (found) {
      targetTrack = found;
      targetPack = pack;
      break;
    }
  }

  if (!targetTrack || !targetPack) {
    return {
      ok: false,
      code: 'validation',
      issues: [{
        code: 'not_found',
        field: 'trackId',
        message: `Không tìm thấy nội dung cho track ID: ${trackId}`
      }]
    };
  }

  // 2. Thu thập mọi stage, resource, credential trong các pack vào Map để tra cứu O(1)
  const stageMap = new Map<string, LearningStage>();
  const resourceMap = new Map<string, LearningResource>();
  const credentialMap = new Map<string, CredentialGoal>();

  for (const pack of packs) {
    for (const stage of pack.stages) {
      if (!stageMap.has(stage.id)) {
        stageMap.set(stage.id, stage);
      }
    }
    for (const res of pack.resources) {
      if (!resourceMap.has(res.id)) {
        resourceMap.set(res.id, res);
      }
    }
    for (const cred of pack.credentials) {
      if (!credentialMap.has(cred.id)) {
        credentialMap.set(cred.id, cred);
      }
    }
  }

  // 3. Kiểm tra các stageIds của track có tồn tại đầy đủ và giữ đúng thứ tự học
  const missingStages: string[] = [];
  const resolvedStages: LearningStage[] = [];

  for (const sId of targetTrack.stageIds) {
    const stage = stageMap.get(sId);
    if (!stage) {
      missingStages.push(sId);
    } else {
      resolvedStages.push(stage);
    }
  }

  if (missingStages.length > 0) {
    return {
      ok: false,
      code: 'validation',
      issues: missingStages.map(id => ({
        code: 'missing_stage',
        field: 'stageIds',
        message: `Không tìm thấy định nghĩa cho chặng (stage) ID: ${id}`
      }))
    };
  }

  // 4. Lấy ra các resources thuộc các chặng đã resolve
  const requiredResourceIds = new Set<string>();
  for (const stage of resolvedStages) {
    for (const rId of stage.resourceIds) {
      requiredResourceIds.add(rId);
    }
  }

  const resolvedResources: LearningResource[] = [];
  for (const rId of requiredResourceIds) {
    const res = resourceMap.get(rId);
    if (res) {
      resolvedResources.push(res);
    }
  }

  // 5. Lấy ra các credentials liên quan đến track
  const resolvedCredentials: CredentialGoal[] = [];
  for (const cId of targetTrack.credentialIds) {
    const cred = credentialMap.get(cId);
    if (cred) {
      resolvedCredentials.push(cred);
    }
  }

  return {
    ok: true,
    value: {
      track: targetTrack,
      stages: resolvedStages,
      resources: resolvedResources,
      credentials: resolvedCredentials,
      contentVersion: targetPack.contentVersion,
    }
  };
}
