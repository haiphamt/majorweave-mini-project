/**
 * Content pack: Full-stack Developer (9 cấu hình = 3 FE × 3 BE)
 * Người biên soạn: Nguyễn Thị Quỳnh Hân (MW-TEAM-01)
 * Ngày kiểm tra nguồn: 2026-10-06
 *
 * Chiến lược:
 *  - Chặng FE (frontend.foundation.*, frontend.react.*, v.v.) và BE (backend.*) đã định nghĩa
 *    trong các pack tương ứng; Full-stack KHÔNG chép lại mà tham chiếu qua stageId.
 *  - Mỗi cấu hình thêm duy nhất một stage "integration" đặc trưng cho cặp FE×BE đó
 *    (gọi REST API từ FE sang BE, CORS, auth token, deploy cùng).
 *  - Resources: một bộ chung về tích hợp FE-BE (CORS, REST, JWT, Docker Compose).
 *  - KHÔNG import registry, KHÔNG gọi storage. Domain độc lập.
 *
 * Lưu ý resolver (src/domain/content.ts): resolver đã được cập nhật để tìm kiếm
 * stage/resource chéo qua tất cả các pack (packs.flatMap). Khi nhóm trưởng đăng ký
 * cả 3 pack (backend, frontend, fullstack) vào registry, stageIds tham chiếu sẽ được
 * resolve đúng.
 */
import type { ContentPack, LearningStage, LearningResource, LearningTrack } from '../../domain/contracts';

const CHECKED = '2026-10-06';

// ─────────────────────────────────────────────
// RESOURCES tích hợp FE-BE (dùng chung cho 9 cấu hình)
// ─────────────────────────────────────────────
const resources: LearningResource[] = [
  {
    id: 'resource.mdn-cors',
    title: 'Cross-Origin Resource Sharing (CORS) – MDN',
    provider: 'Mozilla MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tài liệu CORS chính thức từ MDN. Không cần đăng ký.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.mdn-fetch',
    title: 'Fetch API – MDN',
    provider: 'Mozilla MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn sử dụng Fetch API để gọi REST từ FE.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.jwt-intro',
    title: 'Introduction to JSON Web Tokens – jwt.io',
    provider: 'Auth0 / jwt.io',
    url: 'https://jwt.io/introduction',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Giải thích cấu trúc JWT và cách dùng trong xác thực API.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.docker-compose-docs',
    title: 'Docker Compose – Getting Started',
    provider: 'Docker Docs (docs.docker.com)',
    url: 'https://docs.docker.com/compose/gettingstarted/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn chính thức Docker Compose để deploy FE+BE cùng nhau.',
    checkedAt: CHECKED,
  },
];

// ─────────────────────────────────────────────
// STAGES tích hợp (integration stages) – mỗi cặp FE×BE một stage
// ─────────────────────────────────────────────

/**
 * Tạo stage tích hợp cho một cặp FE × BE cụ thể.
 * stageId dạng: fullstack.<fe>-<be>.integration
 * prerequisiteIds tham chiếu stage cuối của FE pack và BE pack tương ứng.
 */
function makeIntegrationStage(
  fe: 'react' | 'angular' | 'vue',
  be: 'node' | 'python' | 'java',
  feLastStage: string,
  beLastStage: string,
): LearningStage {
  const id = `fullstack.${fe}-${be}.integration`;
  const feLabel: Record<string, string> = { react: 'React', angular: 'Angular', vue: 'Vue' };
  const beLabel: Record<string, string> = { node: 'Node/Express', python: 'Python/FastAPI', java: 'Java/Spring Boot' };
  return {
    id,
    title: `Tích hợp ${feLabel[fe]} ↔ ${beLabel[be]}`,
    phase: 'ship',
    description: `Kết nối ứng dụng ${feLabel[fe]} gọi REST API ${beLabel[be]}: cấu hình CORS, xác thực JWT, xử lý lỗi HTTP và deploy bằng Docker Compose.`,
    outcome: `Ứng dụng Full-stack ${feLabel[fe]}+${beLabel[be]} chạy được end-to-end: đăng nhập, CRUD, bảo vệ route.`,
    prerequisiteIds: [feLastStage, beLastStage],
    resourceIds: ['resource.mdn-cors', 'resource.mdn-fetch', 'resource.jwt-intro', 'resource.docker-compose-docs'],
    defaultResourceId: 'resource.mdn-cors',
    optional: false,
    work: [
      {
        id: `${id}.w1`, revision: 1,
        title: `Dự án: Todo App ${feLabel[fe]}+${beLabel[be]} với JWT Auth`,
        minutes: 300,
        acceptance: [
          `FE ${feLabel[fe]} gọi REST API ${beLabel[be]} thành công (CORS đúng).`,
          'Đăng nhập trả JWT; route được bảo vệ từ chối unauthorized.',
          'CRUD hoạt động end-to-end.',
          'Deploy bằng Docker Compose; có README hướng dẫn chạy.',
        ],
      },
    ],
  };
}

// Chặng cuối của từng FE track (prerequisite)
const FE_LAST: Record<string, string> = {
  react: 'frontend.react.routing',
  angular: 'frontend.angular.core',
  vue: 'frontend.vue.routing',
};
// Chặng cuối của từng BE track (dùng stage 'deploy' từ backend pack)
const BE_LAST: Record<string, string> = {
  node: 'backend.node.deploy',
  python: 'backend.python.deploy',
  java: 'backend.java.deploy',
};

type FE = 'react' | 'angular' | 'vue';
type BE = 'node' | 'python' | 'java';
const FE_LIST: FE[] = ['react', 'angular', 'vue'];
const BE_LIST: BE[] = ['node', 'python', 'java'];

const integrationStages: LearningStage[] = FE_LIST.flatMap(fe =>
  BE_LIST.map(be => makeIntegrationStage(fe, be, FE_LAST[fe], BE_LAST[be]))
);

// ─────────────────────────────────────────────
// TRACKS (9 cấu hình)
// ─────────────────────────────────────────────
const feStages: Record<FE, string[]> = {
  react: ['frontend.foundation.html-css', 'frontend.foundation.javascript', 'frontend.react.core', 'frontend.react.routing'],
  angular: ['frontend.foundation.html-css', 'frontend.foundation.javascript', 'frontend.angular.typescript', 'frontend.angular.core'],
  vue: ['frontend.foundation.html-css', 'frontend.foundation.javascript', 'frontend.vue.core', 'frontend.vue.routing'],
};

const beStagesByTrack: Record<BE, string[]> = {
  node: [
    'language.javascript', 'cs.git', 'cs.networking', 'cs.os-linux', 'cs.computer-systems', 'web.http',
    'backend.node.oop', 'backend.node.dsa', 'backend.node.runtime',
    'backend.node.api', 'backend.node.sql', 'backend.node.auth',
    'backend.node.test', 'backend.node.deploy',
  ],
  python: [
    'language.python', 'cs.git', 'cs.networking', 'cs.os-linux', 'cs.computer-systems', 'web.http',
    'backend.python.oop', 'backend.python.dsa', 'backend.python.runtime',
    'backend.python.api', 'backend.python.sql', 'backend.python.auth',
    'backend.python.test', 'backend.python.deploy',
  ],
  java: [
    'language.java', 'cs.git', 'cs.networking', 'cs.os-linux', 'cs.computer-systems', 'web.http',
    'backend.java.oop', 'backend.java.dsa', 'backend.java.runtime',
    'backend.java.api', 'backend.java.sql', 'backend.java.auth',
    'backend.java.test', 'backend.java.deploy',
  ],
};

const beLabel: Record<BE, string> = { node: 'Node.js / Express', python: 'Python / FastAPI', java: 'Java / Spring Boot' };
const feLabel: Record<FE, string> = { react: 'React', angular: 'Angular', vue: 'Vue' };

const tracks: LearningTrack[] = FE_LIST.flatMap(fe =>
  BE_LIST.map(be => ({
    id: `fullstack.${fe}-${be}` as const,
    pathId: 'fullstack',
    label: `${feLabel[fe]} + ${beLabel[be]}`,
    stageIds: [
      // BE foundation → BE specialization (tham chiếu ID từ backend pack)
      ...beStagesByTrack[be],
      // FE foundation → FE specialization (tham chiếu ID từ frontend pack)
      ...feStages[fe].filter(s => !beStagesByTrack[be].includes(s)), // không lặp chặng chung
      // Integration stage đặc trưng cho cặp này
      `fullstack.${fe}-${be}.integration`,
    ],
    credentialIds: [],
    roadmapLinks: [
      { label: 'Full-stack Roadmap', url: 'https://roadmap.sh/full-stack' },
      { label: `${feLabel[fe]} Roadmap`, url: `https://roadmap.sh/${fe}` },
      { label: 'Backend Roadmap', url: 'https://roadmap.sh/backend' },
    ],
    portfolio: {
      title: `Ứng dụng Full-stack: ${feLabel[fe]} + ${beLabel[be]}`,
      acceptance: [
        `Frontend ${feLabel[fe]} gọi API ${beLabel[be]} thành công.`,
        'Có JWT auth, CRUD và xử lý lỗi HTTP.',
        'Deploy bằng Docker Compose; README đầy đủ.',
        'Có hướng dẫn chạy local và đường dẫn demo.',
      ],
    },
  }))
);

// ─────────────────────────────────────────────
// PACK EXPORT
// ─────────────────────────────────────────────
export const fullstackPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-06.v1',
  pathId: 'fullstack',
  reviewStatus: 'review',
  stages: integrationStages, // Chỉ chứa integration stages; FE/BE stages nằm trong pack riêng
  resources,
  credentials: [],           // Chứng nhận chuyên biệt nằm ở FE/BE pack; Full-stack dùng combo
  tracks,
};
