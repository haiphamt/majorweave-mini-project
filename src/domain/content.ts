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

  // Ở phiên bản nâng cao, ta có thể phải resolve tham chiếu chặng/nguồn từ các pack khác nhau (nếu dùng ID nền tảng chung).
  // Bản cơ bản này sẽ gộp toàn bộ resources, stages, credentials của pack chứa track đó và các pack dùng chung (nếu được thiết kế).
  
  // Thu thập mọi resource và stage có trong pack hiện tại
  const resolvedStages = targetPack.stages.filter(s => targetTrack!.stageIds.includes(s.id));
  
  // Lấy ra các resource liên quan
  const requiredResourceIds = new Set<string>();
  resolvedStages.forEach(stage => {
    stage.resourceIds.forEach(rId => requiredResourceIds.add(rId));
  });

  const resolvedResources = targetPack.resources.filter(r => requiredResourceIds.has(r.id));
  
  // Lấy ra các credentials liên quan
  const resolvedCredentials = targetPack.credentials.filter(c => targetTrack!.credentialIds.includes(c.id));

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
