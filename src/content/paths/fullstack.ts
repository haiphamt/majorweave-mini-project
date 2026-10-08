import type { ContentPack, LearningStage, LearningResource, CredentialGoal, LearningTrack } from '../../domain/contracts';

// Các chặng tích hợp chuyên biệt cho Full-stack
const integrationStages: LearningStage[] = [
  {
    id: 'fullstack.api-client',
    title: 'Tích hợp Giao diện với REST API & Xử lý Trạng thái Mạng',
    phase: 'build',
    description: 'Kết nối ứng dụng Frontend với Backend qua REST API, cấu hình CORS, xử lý Request/Response Interceptors và đồng bộ kiểu dữ liệu.',
    outcome: 'Xây dựng tầng dịch vụ kết nối mạng ổn định giữa FE và BE, quản lý trạng thái loading, caching và thông báo lỗi tập trung.',
    prerequisiteIds: ['frontend.dom-apis', 'web.http'],
    resourceIds: ['resource.fs.fetch-mdn', 'resource.fs.cors-mdn'],
    defaultResourceId: 'resource.fs.fetch-mdn',
    optional: false,
    work: [
      {
        id: 'fullstack.api-client.work-service-layer',
        revision: 1,
        title: 'Xây dựng HTTP Client tập trung có gắn Interceptors',
        minutes: 100,
        acceptance: [
          'Tự động gắn Base URL và xử lý chuyển đổi kiểu dữ liệu TypeScript.',
          'Bắt lỗi mã HTTP (400, 401, 403, 500) và hiển thị thông báo thân thiện cho người dùng.'
        ]
      }
    ]
  },
  {
    id: 'fullstack.monorepo-auth',
    title: 'Xác thực & Phân quyền Toàn diện Full-stack',
    phase: 'build',
    description: 'Thiết lập luồng đăng nhập an toàn: Lưu JWT trong HttpOnly Cookie, bảo vệ route tại Frontend và kiểm tra quyền tại Backend Middleware.',
    outcome: 'Ứng dụng có cơ chế bảo mật hoàn chỉnh, chống tấn công XSS và CSRF, tự động làm mới phiên đăng nhập (Refresh Token).',
    prerequisiteIds: ['fullstack.api-client'],
    resourceIds: ['resource.fs.jwt-auth-guide', 'resource.fs.owasp-csrf'],
    defaultResourceId: 'resource.fs.jwt-auth-guide',
    optional: false,
    work: [
      {
        id: 'fullstack.monorepo-auth.work-auth-flow',
        revision: 1,
        title: 'Triển khai luồng Đăng nhập, Đăng ký và Làm mới Token',
        minutes: 120,
        acceptance: [
          'Đăng nhập thành công trả về Cookie bảo mật, Frontend cập nhật trạng thái người dùng tức thì.',
          'Tự động chuyển hướng về trang Login khi truy cập vào trang riêng tư chưa có quyền.'
        ]
      }
    ]
  },
  {
    id: 'fullstack.full-deployment',
    title: 'Đóng gói Docker & Triển khai Hệ thống Full-stack',
    phase: 'ship',
    description: 'Sử dụng Docker Compose để đóng gói đồng thời Frontend, Backend và Cơ sở dữ liệu, triển khai hệ thống hoàn chỉnh lên Internet.',
    outcome: 'Triển khai hệ thống đa dịch vụ hoạt động đồng bộ trên máy chủ đám mây với cấu hình bảo mật production.',
    prerequisiteIds: ['fullstack.monorepo-auth'],
    resourceIds: ['resource.fs.docker-compose', 'resource.fs.fullstack-deploy-guide'],
    defaultResourceId: 'resource.fs.docker-compose',
    optional: false,
    work: [
      {
        id: 'fullstack.full-deployment.work-docker-compose',
        revision: 1,
        title: 'Cấu hình Docker Compose và triển khai máy chủ',
        minutes: 120,
        acceptance: [
          'File docker-compose.yml khởi chạy thành công 3 dịch vụ: Web FE, API BE và Database.',
          'Ứng dụng chạy thực tế và truy cập được qua Internet.'
        ]
      }
    ]
  }
];

const fullstackResources: LearningResource[] = [
  { id: 'resource.fs.fetch-mdn', title: 'Using the Fetch API', provider: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', language: 'en', format: 'article', cost: 'free', level: 'intermediate', accessNote: 'HTTP client, Request/Response, trạng thái lỗi và xử lý JSON; áp dụng cho mọi cặp FE/BE REST API.', checkedAt: '2026-10-08' },
  {
    id: 'resource.fs.fullstack-open',
    title: 'Full Stack Open - Deep Dive Into Modern Web Development',
    provider: 'University of Helsinki',
    url: 'https://fullstackopen.com/en/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Khóa miễn phí về React và Node.js. Không dùng thay khóa Angular/Vue/FastAPI/Spring Boot; cần nền tảng lập trình, web, database và Git.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fs.cors-mdn',
    title: 'Cross-Origin Resource Sharing (CORS) Documentation',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Giải thích nguyên lý và cấu hình tiêu chuẩn cho cơ chế CORS giữa FE và BE.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fs.jwt-auth-guide',
    title: 'REST Security Cheat Sheet',
    provider: 'OWASP Foundation',
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Hướng dẫn bảo mật REST/JWT chung cho nhiều ngôn ngữ; chống CSRF xem nguồn riêng bên cạnh.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fs.owasp-csrf',
    title: 'Cross-Site Request Forgery (CSRF) Prevention',
    provider: 'OWASP Foundation',
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Các phương thức phòng chống tấn công CSRF trong ứng dụng web.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fs.docker-compose',
    title: 'Docker Compose Overview & Quickstart',
    provider: 'Docker Documentation',
    url: 'https://docs.docker.com/compose/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tài liệu hướng dẫn quản lý cụm ứng dụng đa container bằng Docker Compose.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fs.fullstack-deploy-guide',
    title: 'Deploy a Docker Image on Render',
    provider: 'Render Docs',
    url: 'https://docs.render.com/deploy-an-image',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tài liệu triển khai Docker miễn phí để đọc; tài nguyên hosting/database có điều kiện và có thể cần trả phí.',
    checkedAt: '2026-10-08'
  }
];

const fullstackCredentials: CredentialGoal[] = [
  {
    id: 'credential.fs.fullstack-open-cert',
    name: 'Full Stack Open Certificate of Completion',
    provider: 'University of Helsinki',
    kind: 'course_certificate',
    url: 'https://fullstackopen.com/en/part0/general_info/',
    cost: 'free',
    prerequisites: 'Có kỹ năng lập trình, nền tảng web/database/Git; khóa tập trung React và Node.js.',
    requirements: 'Nộp bài đạt mức hoàn thành do khóa quy định; tải chứng nhận qua hệ thống bài nộp. Thi để lấy tín chỉ là yêu cầu riêng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'credential.fs.ibm-fullstack',
    name: 'IBM Full Stack Software Developer Professional Certificate',
    provider: 'Coursera / IBM',
    kind: 'program_certificate',
    url: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
    cost: 'paid',
    prerequisites: 'Chuỗi nền tảng Full-stack React/Node.js/Python; bổ trợ React + Node hoặc React + Python, không xác nhận riêng FastAPI.',
    requirements: 'Vượt qua các bài kiểm tra thực hành và nộp dự án Capstone.',
    checkedAt: '2026-10-08'
  }
];

// Định nghĩa 9 cặp Full-stack kết hợp
type FeKey = 'react' | 'angular' | 'vue';
type BeKey = 'node' | 'python' | 'java';

const feLabels: Record<FeKey, string> = {
  react: 'React',
  angular: 'Angular',
  vue: 'Vue'
};

const beLabels: Record<BeKey, string> = {
  node: 'Node.js',
  python: 'Python',
  java: 'Java'
};

// Chặng riêng theo FE
const feSpecificStages: Record<FeKey, string[]> = {
  react: ['frontend.react.core', 'frontend.react.hooks', 'frontend.react.routing-state'],
  angular: ['frontend.angular.core', 'frontend.angular.services-routing', 'frontend.angular.forms'],
  vue: ['frontend.vue.core', 'frontend.vue.router-pinia']
};

// Chặng riêng theo BE
const beSpecificStages: Record<BeKey, string[]> = {
  node: [
    'backend.node.oop',
    'backend.node.dsa',
    'backend.node.node',
    'backend.node.express',
    'backend.node.sql',
    'backend.node.auth',
    'backend.node.test',
    'backend.node.deploy',
    'backend.node.design'
  ],
  python: [
    'language.python',
    'backend.python.oop',
    'backend.python.dsa',
    'backend.python.python-runtime',
    'backend.python.fastapi',
    'backend.python.sql',
    'backend.python.auth',
    'backend.python.pytest',
    'backend.python.deploy',
    'backend.python.design'
  ],
  java: [
    'language.java',
    'backend.java.oop',
    'backend.java.dsa',
    'backend.java.java-runtime',
    'backend.java.spring',
    'backend.java.sql',
    'backend.java.auth',
    'backend.java.junit',
    'backend.java.deploy',
    'backend.java.design'
  ]
};

// Xây dựng danh sách 9 track Full-stack đảm bảo thứ tự tiên quyết hợp lệ:
// 1. Git (cs.git)
// 2. Mạng & Hệ điều hành (cs.networking, cs.os-linux, cs.computer-systems, web.http)
// 3. Tiêu chuẩn Web & CSS (frontend.web-standards, frontend.responsive-css)
// 4. Ngôn ngữ JavaScript (language.javascript)
// 5. Nền tảng Web động (frontend.dom-apis, frontend.typescript)
// 6. Chặng Frontend Framework (React / Angular / Vue)
// 7. Chặng Backend Framework & Cơ sở dữ liệu (Node / Python / Java)
// 8. Chặng Tích hợp Full-stack (fullstack.api-client, fullstack.monorepo-auth, fullstack.full-deployment)
function buildFullstackTrack(fe: FeKey, be: BeKey): LearningTrack {
  const stageIds: string[] = [
    'cs.git',
    'cs.networking',
    'cs.os-linux',
    'cs.computer-systems',
    'web.http',
    'frontend.web-standards',
    'frontend.responsive-css',
    'language.javascript',
    'frontend.dom-apis',
    'frontend.typescript',
    ...feSpecificStages[fe],
    ...beSpecificStages[be],
    'fullstack.api-client',
    'fullstack.monorepo-auth',
    'fullstack.full-deployment'
  ];

  // Khử trùng ID nếu có
  const uniqueStageIds = Array.from(new Set(stageIds));

  return {
    id: `fullstack.${fe}-${be}`,
    pathId: 'fullstack',
    label: `${feLabels[fe]} + ${beLabels[be]}`,
    stageIds: uniqueStageIds,
    credentialIds: fe === 'react' && be === 'node' ? ['credential.fs.fullstack-open-cert', 'credential.fs.ibm-fullstack'] : fe === 'react' && be === 'python' ? ['credential.fe.freecodecamp-rwd', 'credential.fs.ibm-fullstack'] : ['credential.fe.freecodecamp-rwd', 'credential.fe.freecodecamp-js'],
    roadmapLinks: [
      { label: 'Full Stack Roadmap', url: 'https://roadmap.sh/full-stack' },
      { label: `${feLabels[fe]} Roadmap`, url: `https://roadmap.sh/${fe}` },
      { label: `${beLabels[be]} Roadmap`, url: be === 'node' ? 'https://roadmap.sh/nodejs' : be === 'python' ? 'https://roadmap.sh/python' : 'https://roadmap.sh/java' }
    ],
    portfolio: {
      title: `Hệ thống Ứng dụng Quản lý Doanh nghiệp Toàn diện (${feLabels[fe]} + ${beLabels[be]})`,
      acceptance: [
        'Frontend tương tác động, quản lý trạng thái mượt mà và giao diện phản hồi nhanh.',
        'Backend cung cấp RESTful API có xác thực bằng JWT, phân quyền và lưu trữ dữ liệu an toàn.',
        'Hệ thống được đóng gói bằng Docker Compose và triển khai hoạt động trên máy chủ công khai.'
      ]
    }
  };
}

const fullstackPairs: Array<[FeKey, BeKey]> = [
  ['react', 'node'],
  ['react', 'python'],
  ['react', 'java'],
  ['angular', 'node'],
  ['angular', 'python'],
  ['angular', 'java'],
  ['vue', 'node'],
  ['vue', 'python'],
  ['vue', 'java']
];

const fullstackTracks: LearningTrack[] = fullstackPairs.map(([fe, be]) => buildFullstackTrack(fe, be));

export const fullstackPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-08.fullstack-v2',
  pathId: 'fullstack',
  reviewStatus: 'review',
  stages: integrationStages,
  resources: fullstackResources,
  credentials: fullstackCredentials,
  tracks: fullstackTracks
};
