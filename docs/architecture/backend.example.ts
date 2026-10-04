// Mẫu chuyển cấu trúc từ nội dung Backend hiện có; KHÔNG thay app đang chạy.
// Dùng cả 3 nhánh, không cắt thư viện nguồn/chứng nhận của bản cũ.
import { checkedAt, resources, sourcesForModule, defaultSource, modulesForStack, credentials, credentialsForStack, stacks } from '../../src/data';
import type { BackendStack } from '../../src/data';
import type { ContentPack, LearningStage, LearningResource, CredentialGoal } from './contracts';

const stageId = (legacyId: string, stack: BackendStack) => {
  const shared: Record<string, string> = {
    js: 'language.javascript', python: 'language.python', java: 'language.java',
    git: 'cs.git', network: 'cs.networking', os: 'cs.os-linux', systems: 'cs.computer-systems', http: 'web.http',
  };
  return shared[legacyId] ?? `backend.${stack}.${legacyId}`;
};
const dependencies = (legacyId: string, stack: BackendStack): string[] => {
  const branch = stacks[stack];
  const map: Record<string, string[]> = {
    oop: [branch.languageModule], dsa: [branch.languageModule],
    systems: ['network', 'os'], http: ['network'],
    [branch.runtimeModule]: [branch.languageModule, 'git'],
    [branch.apiModule]: [branch.runtimeModule, 'http', 'oop', 'dsa'],
    sql: [branch.apiModule], auth: [branch.apiModule, 'sql'],
    [branch.testModule]: ['auth'], deploy: [branch.testModule, 'systems'], design: ['deploy'],
  };
  return (map[legacyId] ?? []).map(id => stageId(id, stack));
};
const resourceId = (legacyId: string) => `resource.${legacyId}`;
const credentialId = (legacyId: string) => `credential.${legacyId}`;
const [day, month, year] = checkedAt.split('/');
const inheritedCheckDate = `${year}-${month}-${day}`;
const formats: Record<string, LearningResource['format']> = {
  Video: 'video', 'Bài đọc': 'article', 'Khóa học': 'course', 'Thực hành': 'exercise',
};
const kinds: Record<string, CredentialGoal['kind']> = {
  'Chứng nhận khóa học': 'course_certificate', 'Chứng nhận chương trình': 'program_certificate',
  'Chứng chỉ thi': 'exam_certificate', 'Chứng nhận thực hành': 'skill_assessment',
};
export const legacyStageMap: Record<string, Record<string, string>> = {};
export const legacyWorkMap: Record<string, Record<string, string>> = {};
const stageRegistry = new Map<string, LearningStage>();
const trackList: ContentPack['tracks'] = [];
for (const stack of ['node', 'python', 'java'] as const) {
  legacyStageMap[stack] = {};
  legacyWorkMap[stack] = {};
  const oldStages = modulesForStack(stack);
  for (const stage of oldStages) {
    const id = stageId(stage.id, stack);
    legacyStageMap[stack][stage.id] = id;
    stageRegistry.set(id, {
      id, title: stage.title, phase: stage.phase.toLowerCase() as LearningStage['phase'],
      description: stage.description, outcome: stage.outcome,
      prerequisiteIds: dependencies(stage.id, stack),
      resourceIds: sourcesForModule(stage.id, stack).map(r => resourceId(r.id)),
      defaultResourceId: resourceId(defaultSource(stage, stack)), optional: stage.optional ?? false,
      work: stage.tasks.map((task, index) => {
        const workId = `${id}.legacy-work-${index}`;
        const prefix = stack !== 'node' && ['oop', 'sql', 'auth', 'deploy'].includes(stage.id) ? `${stack}-` : '';
        legacyWorkMap[stack][`${prefix}${stage.id}-${index}`] = workId;
        return { id: workId, revision: 1, title: task.title, minutes: task.minutes, acceptance: [stage.outcome] };
      }),
    });
  }
  trackList.push({
    id: `backend.${stack}`, pathId: 'backend', label: `${stacks[stack].name} / ${stacks[stack].framework}`,
    stageIds: oldStages.map(stage => stageId(stage.id, stack)),
    credentialIds: credentialsForStack(stack).map(c => credentialId(c.id)),
    roadmapLinks: [{ label: 'Backend', url: 'https://roadmap.sh/backend' }, { label: stacks[stack].name, url: stacks[stack].roadmap }],
    portfolio: { title: 'API quản lý công việc', acceptance: [
      'CRUD có kiểm tra đầu vào và lưu dữ liệu bền vững.', 'Dữ liệu được bảo vệ theo tài khoản.',
      'Có kiểm thử, hướng dẫn chạy và đường dẫn demo.',
    ] },
  });
}
export const backendExample: ContentPack = {
  schemaVersion: 1, contentVersion: '2026-10-04.architecture-example', pathId: 'backend', reviewStatus: 'review',
  stages: [...stageRegistry.values()], tracks: trackList,
  resources: resources.map(r => ({
    id: resourceId(r.id), title: r.title, provider: r.provider, url: r.url,
    language: r.language, format: formats[r.format], cost: r.cost, level: 'mixed',
    accessNote: r.note, checkedAt: inheritedCheckDate,
  })),
  credentials: credentials.map(c => ({
    id: credentialId(c.id), name: c.name, provider: c.provider, kind: kinds[c.type], url: c.url,
    cost: c.price === 'Miễn phí' ? 'free' : 'unknown',
    prerequisites: c.stage, requirements: c.note, checkedAt: inheritedCheckDate,
  })),
};
