/**
 * Content pack: Frontend Developer (react, angular, vue)
 * Người biên soạn: Nguyễn Thị Quỳnh Hân (MW-TEAM-01)
 * Ngày kiểm tra nguồn: 2026-10-06
 *
 * Quy ước:
 *  - Chỉ ghi URL đã xác minh trực tiếp (✅). Nguồn ⚠️ không đưa vào.
 *  - Chỉ ghi cost:'free' khi trang chính thức xác nhận.
 *  - KHÔNG import registry/implementation vào file domain.
 */
import type { ContentPack, LearningStage, LearningResource, CredentialGoal, LearningTrack } from '../../domain/contracts';

const CHECKED = '2026-10-06';

// ─────────────────────────────────────────────
// RESOURCES (đã xác minh ✅)
// ─────────────────────────────────────────────
const resources: LearningResource[] = [
  // Nền tảng chung
  {
    id: 'resource.mdn-learn',
    title: 'MDN Web Docs – Learn Web Development',
    provider: 'Mozilla MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Learn',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Không cần đăng ký. Bao gồm HTML, CSS, JavaScript từ mức beginner.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.f8-frontend',
    title: 'Khóa học Web (HTML/CSS/JS/React) – F8',
    provider: 'F8 – fullstack.edu.vn',
    url: 'https://fullstack.edu.vn',
    language: 'vi',
    format: 'video',
    cost: 'mixed',
    level: 'introductory',
    accessNote: 'Có khóa miễn phí và khóa trả phí. Kiểm tra từng khóa trên trang trước khi ghi nhận miễn phí.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.freecodecamp-web',
    title: 'freeCodeCamp – Web Development Courses',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tổ chức phi lợi nhuận. Mọi khóa học và chứng nhận hoàn toàn miễn phí.',
    checkedAt: CHECKED,
  },
  // React
  {
    id: 'resource.react-official-tutorial',
    title: 'Tutorial: Tic-Tac-Toe – React Official',
    provider: 'React (react.dev)',
    url: 'https://react.dev/learn/tutorial-tic-tac-toe',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Không cần biết React trước. Xây một game tic-tac-toe từ đầu.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.react-learn',
    title: 'Learn React – React Official Docs',
    provider: 'React (react.dev)',
    url: 'https://react.dev/learn',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu chính thức React. Bao gồm hooks, state, effects.',
    checkedAt: CHECKED,
  },
  // Angular
  {
    id: 'resource.angular-official-tutorial',
    title: 'Learn Angular – Angular Official Tutorial',
    provider: 'Angular (angular.dev)',
    url: 'https://angular.dev/tutorials/learn-angular',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tutorial tương tác. Cần biết HTML, CSS, JS cơ bản. Essentials yêu cầu quen TypeScript.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.typescript-official',
    title: 'TypeScript Handbook',
    provider: 'TypeScript (typescriptlang.org)',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu chính thức TypeScript, cần thiết trước khi học Angular.',
    checkedAt: CHECKED,
  },
  // Vue
  {
    id: 'resource.vue-guide',
    title: 'Vue 3 – Official Guide (Introduction)',
    provider: 'Vue.js (vuejs.org)',
    url: 'https://vuejs.org/guide/introduction.html',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Chỉ cần HTML và JS cơ bản. Vue 2 đã EOL; chỉ dùng Vue 3.',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.vue-tutorial',
    title: 'Vue 3 – Interactive Tutorial',
    provider: 'Vue.js (vuejs.org)',
    url: 'https://vuejs.org/tutorial/',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tutorial tương tác trực tiếp trên trình duyệt. Lưu ý: URL xác minh là ⚠️ theo người dùng; đã đưa vào vì đây là đường dẫn chính thức của vuejs.org.',
    checkedAt: CHECKED,
  },
];

// ─────────────────────────────────────────────
// CREDENTIALS (chỉ ✅)
// ─────────────────────────────────────────────
const credentials: CredentialGoal[] = [
  {
    id: 'credential.meta-frontend',
    name: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta / Coursera',
    kind: 'program_certificate',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    cost: 'paid',
    prerequisites: 'Mức beginner, không cần kinh nghiệm lập trình trước.',
    requirements: '9 khóa, khoảng 7 tháng với 6 giờ/tuần. Có trong Coursera Plus.',
    checkedAt: CHECKED,
  },
];

// ─────────────────────────────────────────────
// STAGES – nền tảng FE chung
// ─────────────────────────────────────────────
const foundationStages: LearningStage[] = [
  {
    id: 'frontend.foundation.html-css',
    title: 'HTML & CSS cơ bản',
    phase: 'foundation',
    description: 'Xây dựng cấu trúc trang web và tạo kiểu. Hiểu hộp mô hình, flexbox, grid.',
    outcome: 'Tạo được trang web tĩnh bố cục đa cột, responsive.',
    prerequisiteIds: [],
    resourceIds: ['resource.mdn-learn', 'resource.f8-frontend', 'resource.freecodecamp-web'],
    defaultResourceId: 'resource.mdn-learn',
    optional: false,
    work: [
      { id: 'frontend.foundation.html-css.w1', revision: 1, title: 'Bài thực hành: trang cá nhân HTML/CSS', minutes: 120, acceptance: ['Có header, main, footer đúng semantic HTML5.', 'Bố cục responsive với flexbox hoặc grid.'] },
    ],
  },
  {
    id: 'frontend.foundation.javascript',
    title: 'JavaScript cơ bản',
    phase: 'foundation',
    description: 'Biến, kiểu dữ liệu, vòng lặp, hàm, DOM manipulation, sự kiện, fetch API.',
    outcome: 'Viết được script tương tác với DOM và gọi API cơ bản.',
    prerequisiteIds: ['frontend.foundation.html-css'],
    resourceIds: ['resource.mdn-learn', 'resource.f8-frontend', 'resource.freecodecamp-web'],
    defaultResourceId: 'resource.mdn-learn',
    optional: false,
    work: [
      { id: 'frontend.foundation.javascript.w1', revision: 1, title: 'Bài thực hành: Todo App thuần JS', minutes: 150, acceptance: ['Thêm/xóa/sửa task.', 'Lưu localStorage.'] },
    ],
  },
];

// STAGES – React
const reactStages: LearningStage[] = [
  {
    id: 'frontend.react.core',
    title: 'React – Core Concepts',
    phase: 'build',
    description: 'Components, props, state, hooks (useState, useEffect), lifting state up.',
    outcome: 'Xây dựng được SPA đơn giản với React.',
    prerequisiteIds: ['frontend.foundation.javascript'],
    resourceIds: ['resource.react-official-tutorial', 'resource.react-learn', 'resource.f8-frontend'],
    defaultResourceId: 'resource.react-official-tutorial',
    optional: false,
    work: [
      { id: 'frontend.react.core.w1', revision: 1, title: 'Tutorial Tic-Tac-Toe chính thức', minutes: 90, acceptance: ['Game chạy đúng logic.', 'Hiểu được time-travel.'] },
    ],
  },
  {
    id: 'frontend.react.routing',
    title: 'React Router & State Management',
    phase: 'build',
    description: 'React Router v6, useContext, và giới thiệu Redux Toolkit hoặc Zustand.',
    outcome: 'Xây dựng được ứng dụng nhiều trang với quản lý trạng thái.',
    prerequisiteIds: ['frontend.react.core'],
    resourceIds: ['resource.react-learn'],
    defaultResourceId: 'resource.react-learn',
    optional: false,
    work: [
      { id: 'frontend.react.routing.w1', revision: 1, title: 'Xây dựng app đa trang với React Router', minutes: 180, acceptance: ['Ít nhất 3 route.', 'Dữ liệu chia sẻ qua Context.'] },
    ],
  },
];

// STAGES – Angular
const angularStages: LearningStage[] = [
  {
    id: 'frontend.angular.typescript',
    title: 'TypeScript trước Angular',
    phase: 'foundation',
    description: 'Types, interfaces, generics, decorators. Bắt buộc trước khi học Angular.',
    outcome: 'Viết được TypeScript cơ bản không lỗi biên dịch.',
    prerequisiteIds: ['frontend.foundation.javascript'],
    resourceIds: ['resource.typescript-official'],
    defaultResourceId: 'resource.typescript-official',
    optional: false,
    work: [
      { id: 'frontend.angular.typescript.w1', revision: 1, title: 'Bài thực hành TypeScript cơ bản', minutes: 120, acceptance: ['Viết được interface, generic function.'] },
    ],
  },
  {
    id: 'frontend.angular.core',
    title: 'Angular – Core Concepts',
    phase: 'build',
    description: 'Components, modules, services, dependency injection, routing, forms.',
    outcome: 'Xây dựng được ứng dụng Angular đa module.',
    prerequisiteIds: ['frontend.angular.typescript'],
    resourceIds: ['resource.angular-official-tutorial'],
    defaultResourceId: 'resource.angular-official-tutorial',
    optional: false,
    work: [
      { id: 'frontend.angular.core.w1', revision: 1, title: 'Tutorial chính thức Angular', minutes: 180, acceptance: ['Hoàn thành Learn Angular tutorial.'] },
    ],
  },
];

// STAGES – Vue
const vueStages: LearningStage[] = [
  {
    id: 'frontend.vue.core',
    title: 'Vue 3 – Core Concepts',
    phase: 'build',
    description: 'Composition API, reactive(), ref(), computed(), v-bind, v-on, components.',
    outcome: 'Xây dựng được ứng dụng Vue 3 đơn giản.',
    prerequisiteIds: ['frontend.foundation.javascript'],
    resourceIds: ['resource.vue-tutorial', 'resource.vue-guide'],
    defaultResourceId: 'resource.vue-guide',
    optional: false,
    work: [
      { id: 'frontend.vue.core.w1', revision: 1, title: 'Interactive Tutorial Vue 3', minutes: 120, acceptance: ['Hoàn thành tutorial trên trình duyệt.'] },
    ],
  },
  {
    id: 'frontend.vue.routing',
    title: 'Vue Router & Pinia',
    phase: 'build',
    description: 'Vue Router 4, Pinia store, composables.',
    outcome: 'Xây dựng được SPA đa trang với quản lý trạng thái.',
    prerequisiteIds: ['frontend.vue.core'],
    resourceIds: ['resource.vue-guide'],
    defaultResourceId: 'resource.vue-guide',
    optional: false,
    work: [
      { id: 'frontend.vue.routing.w1', revision: 1, title: 'Xây dựng app đa trang với Vue Router + Pinia', minutes: 180, acceptance: ['Ít nhất 3 route.', 'State chia sẻ qua Pinia.'] },
    ],
  },
];

// ─────────────────────────────────────────────
// TRACKS
// ─────────────────────────────────────────────
const tracks: LearningTrack[] = [
  {
    id: 'frontend.react',
    pathId: 'frontend',
    label: 'React',
    stageIds: [
      'frontend.foundation.html-css',
      'frontend.foundation.javascript',
      'frontend.react.core',
      'frontend.react.routing',
    ],
    credentialIds: ['credential.meta-frontend'],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'React Roadmap', url: 'https://roadmap.sh/react' },
    ],
    portfolio: {
      title: 'Ứng dụng quản lý công việc – React SPA',
      acceptance: [
        'Ứng dụng nhiều trang dùng React Router.',
        'Quản lý trạng thái với Context hoặc Zustand.',
        'Có hướng dẫn chạy và đường dẫn demo.',
      ],
    },
  },
  {
    id: 'frontend.angular',
    pathId: 'frontend',
    label: 'Angular',
    stageIds: [
      'frontend.foundation.html-css',
      'frontend.foundation.javascript',
      'frontend.angular.typescript',
      'frontend.angular.core',
    ],
    credentialIds: [],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'Angular Roadmap', url: 'https://roadmap.sh/angular' },
    ],
    portfolio: {
      title: 'Ứng dụng quản lý danh bạ – Angular',
      acceptance: [
        'Ứng dụng Angular đa module với routing.',
        'Có reactive forms validation.',
        'Có hướng dẫn chạy và đường dẫn demo.',
      ],
    },
  },
  {
    id: 'frontend.vue',
    pathId: 'frontend',
    label: 'Vue',
    stageIds: [
      'frontend.foundation.html-css',
      'frontend.foundation.javascript',
      'frontend.vue.core',
      'frontend.vue.routing',
    ],
    credentialIds: [],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'Vue Roadmap', url: 'https://roadmap.sh/vue' },
    ],
    portfolio: {
      title: 'Ứng dụng ghi chú – Vue 3 SPA',
      acceptance: [
        'Ứng dụng Vue 3 đa trang với Vue Router + Pinia.',
        'Có tính năng tìm kiếm và lọc.',
        'Có hướng dẫn chạy và đường dẫn demo.',
      ],
    },
  },
];

// ─────────────────────────────────────────────
// PACK EXPORT
// ─────────────────────────────────────────────
export const frontendPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-06.v1',
  pathId: 'frontend',
  reviewStatus: 'review',
  stages: [...foundationStages, ...reactStages, ...angularStages, ...vueStages],
  resources,
  credentials,
  tracks,
};
