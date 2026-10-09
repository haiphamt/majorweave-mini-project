// Mẫu chuyển cấu trúc từ nội dung Backend hiện có; KHÔNG thay app đang chạy.
// Dùng cả 3 nhánh, không cắt thư viện nguồn/chứng nhận của bản cũ.
// Resources mới (xác minh bởi Quỳnh Hân, ngày 2026-10-06) được thêm vào bên dưới.
import { checkedAt, resources, sourcesForModule, defaultSource, modulesForStack, credentials, credentialsForStack, stacks } from '../../data';
import type { BackendStack } from '../../data';
import type { ContentPack, LearningStage, LearningResource, CredentialGoal } from '../../domain/contracts';

const CHECKED_NEW = '2026-10-06';

// ─────────────────────────────────────────────
// RESOURCES MỚI – đã xác minh ✅ bởi Quỳnh Hân ngày 2026-10-06
// Nguồn ⚠️ (chưa xác minh URL) bị loại bỏ hoàn toàn.
// ─────────────────────────────────────────────
const verifiedResources: LearningResource[] = [
  // DSA
  {
    id: 'resource.verified.mit-ocw-6006',
    title: 'MIT OCW 6.006 – Introduction to Algorithms (Spring 2020)',
    provider: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Ghi chú bài giảng, video, bài tập và đề thi kèm lời giải. Mức đại học, hơi nặng với người mới. Không cần đăng ký.',
    checkedAt: CHECKED_NEW,
  },
  {
    id: 'resource.verified.fcc-dsa-49h',
    title: 'freeCodeCamp – Master DSA (49 giờ)',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/news/master-technical-interviews-by-learning-data-structures-and-algorithms/',
    language: 'en',
    format: 'video',
    cost: 'free',
    level: 'mixed',
    accessNote: 'Bao gồm Big O, mảng, linked list, cây, đồ thị, quy hoạch động.',
    checkedAt: CHECKED_NEW,
  },
  {
    id: 'resource.verified.vnoi-wiki',
    title: 'VNOI Wiki – Tài liệu thuật toán',
    provider: 'VNOI (wiki.vnoi.info)',
    url: 'https://wiki.vnoi.info/algo/basic/Tai-Lieu-Thuat-Toan',
    language: 'vi',
    format: 'article',
    cost: 'free',
    level: 'mixed',
    accessNote: 'Tổng hợp tài liệu thuật toán tiếng Việt. C/C++ chiếm ưu thế. Thiên về lập trình thi đấu hơn DSA đại cương.',
    checkedAt: CHECKED_NEW,
  },
  // OOP
  {
    id: 'resource.verified.java-mooc-helsinki',
    title: 'Java Programming MOOC – University of Helsinki [LEGACY]',
    provider: 'University of Helsinki (java-programming.mooc.fi)',
    url: 'https://java-programming.mooc.fi/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'TRẠNG THÁI LEGACY: Không còn tính tín chỉ ECTS và không được cập nhật. Không cần đăng ký. Dạy thuật toán và OOP qua Java. Vẫn dùng được để học nền tảng.',
    checkedAt: CHECKED_NEW,
  },
  // Mạng máy tính
  {
    id: 'resource.verified.stanford-cs144',
    title: 'Stanford CS144 – Introduction to Computer Networking',
    provider: 'Stanford University (cs144.github.io)',
    url: 'https://cs144.github.io/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Mức nâng cao. Tự xây ngăn xếp TCP/IP bằng C++. Cần nền tảng lập trình hệ thống.',
    checkedAt: CHECKED_NEW,
  },
  // Hệ điều hành / Linux
  {
    id: 'resource.verified.ostep',
    title: 'OSTEP – Operating Systems: Three Easy Pieces',
    provider: 'University of Wisconsin–Madison',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Sách trực tuyến miễn phí. Xoay quanh ảo hóa, đồng thời và lưu trữ bền vững.',
    checkedAt: CHECKED_NEW,
  },
  {
    id: 'resource.verified.lfs101-linux',
    title: 'Introduction to Linux (LFS101) – Linux Foundation',
    provider: 'The Linux Foundation (training.linuxfoundation.org)',
    url: 'https://training.linuxfoundation.org/training/introduction-to-linux/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Dạy Linux qua cả GUI và CLI. Bên thứ ba ghi $0 và thời hạn 90 ngày; cần xác nhận lại điều kiện trên trang gốc. checkedAt: 2026-10-06.',
    checkedAt: CHECKED_NEW,
  },
  // Node.js/Express
  {
    id: 'resource.verified.nodejs-official-learn',
    title: 'Node.js Official Learn Guide',
    provider: 'Node.js (nodejs.org)',
    url: 'https://nodejs.org/learn',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Async, file system, HTTP, bảo mật, testing. Tài liệu chính thức.',
    checkedAt: CHECKED_NEW,
  },
  {
    id: 'resource.verified.f8-nodejs',
    title: 'Khóa học NodeJS & Express – F8',
    provider: 'F8 – fullstack.edu.vn',
    url: 'https://fullstack.edu.vn',
    language: 'vi',
    format: 'video',
    cost: 'mixed',
    level: 'introductory',
    accessNote: 'F8 có khóa NodeJS & Express tiếng Việt. Kiểm tra từng khóa vì có khóa miễn phí và trả phí.',
    checkedAt: CHECKED_NEW,
  },
  // FastAPI
  {
    id: 'resource.verified.fastapi-tutorial',
    title: 'FastAPI – Official Tutorial',
    provider: 'FastAPI (fastapi.tiangolo.com)',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn từng bước, đủ để dựng ứng dụng hoàn chỉnh. Chưa xác minh có bản tiếng Việt.',
    checkedAt: CHECKED_NEW,
  },
  // Spring Boot
  {
    id: 'resource.verified.spring-gs-rest',
    title: 'Building a RESTful Web Service – Spring Guides',
    provider: 'Spring (spring.io)',
    url: 'https://spring.io/guides/gs/rest-service/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn dựng RESTful "Hello, World" với Spring Boot. Tài liệu chính thức.',
    checkedAt: CHECKED_NEW,
  },
];

// ─────────────────────────────────────────────
// CREDENTIALS MỚI – đã xác minh ✅
// ─────────────────────────────────────────────
const verifiedCredentials: CredentialGoal[] = [
  {
    id: 'credential.verified.aws-developer-associate',
    name: 'AWS Certified Developer – Associate (DVA-C02)',
    provider: 'Amazon Web Services',
    kind: 'exam_certificate',
    url: 'https://aws.amazon.com/certification/certified-developer-associate/',
    cost: 'paid',
    prerequisites: 'Khuyến nghị có 1+ năm kinh nghiệm phát triển và triển khai ứng dụng AWS.',
    requirements: '65 câu hỏi, 130 phút, hiệu lực 3 năm. Phí ~150 USD (tại Mỹ, thay đổi theo quốc gia). Ngôn ngữ thi: Anh, Nhật, Hàn, Bồ (Brazil), Trung giản thể, Tây Ban Nha. Kiểm tra: 2026-10-06.',
    checkedAt: CHECKED_NEW,
  },
  {
    id: 'credential.verified.meta-backend',
    name: 'Meta Back-End Developer Professional Certificate',
    provider: 'Meta / Coursera',
    kind: 'program_certificate',
    url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
    cost: 'paid',
    prerequisites: 'Mức beginner. Không cần kinh nghiệm trước.',
    requirements: 'Dạy Python, Django, SQL, Linux, Git và API. Lưu ý: Stack này dùng Django, KHÔNG khớp nhánh FastAPI của track python. Có trong Coursera Plus. Kiểm tra: 2026-10-06.',
    checkedAt: CHECKED_NEW,
  },
];

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
export const backendPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-06.verified-resources',
  pathId: 'backend',
  reviewStatus: 'review',
  stages: [...stageRegistry.values()],
  tracks: trackList,
  resources: [
    // Resources kế thừa từ data.ts (v1)
    ...resources.map(r => ({
      id: resourceId(r.id), title: r.title, provider: r.provider, url: r.url,
      language: r.language, format: formats[r.format], cost: r.cost, level: 'mixed' as const,
      accessNote: r.note, checkedAt: inheritedCheckDate,
    })),
    // Resources mới đã xác minh bởi Quỳnh Hân (2026-10-06)
    ...verifiedResources,
  ],
  credentials: [
    // Credentials kế thừa từ data.ts (v1)
    ...credentials.map(c => ({
      id: credentialId(c.id), name: c.name, provider: c.provider, kind: kinds[c.type], url: c.url,
      cost: (c.price === 'Miễn phí' ? 'free' : 'unknown') as 'free' | 'paid' | 'unknown',
      prerequisites: c.stage, requirements: c.note, checkedAt: inheritedCheckDate,
    })),
    // Credentials mới đã xác minh
    ...verifiedCredentials,
  ],
};
