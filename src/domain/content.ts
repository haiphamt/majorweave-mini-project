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
 * Lưu ý: Tuyệt đối không import thư viện giao diện (React) hay storage (IndexedDB) vào file này.
 */
export function resolveTrackContent(
  packs: ContentPack[],
  trackId: string
): OperationResult<ResolvedContent> {
  let targetTrack: LearningTrack | undefined;
  let targetPack: ContentPack | undefined;

  // Tìm track trong tất cả các pack
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

  // Thu thập mọi resource và stage có trong tất cả các pack
  const allStages = packs.flatMap(p => p.stages);
  const allResources = packs.flatMap(p => p.resources);
  const allCredentials = packs.flatMap(p => p.credentials);
  
  const resolvedStages = allStages.filter(s => targetTrack!.stageIds.includes(s.id));
  
  // Lấy ra các resource liên quan
  const requiredResourceIds = new Set<string>();
  resolvedStages.forEach(stage => {
    stage.resourceIds.forEach(rId => requiredResourceIds.add(rId));
  });

  const resolvedResources = allResources.filter(r => requiredResourceIds.has(r.id));
  
  // Lấy ra các credentials liên quan
  const resolvedCredentials = allCredentials.filter(c => targetTrack!.credentialIds.includes(c.id));

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
