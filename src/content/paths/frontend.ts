import type { ContentPack, LearningStage, LearningResource, CredentialGoal, LearningTrack } from '../../domain/contracts';

// Các chặng nền tảng riêng của Frontend (cs.git và language.javascript dùng chung từ backendPack)
const frontendStages: LearningStage[] = [
  {
    id: 'frontend.web-standards',
    title: 'HTML5 ngữ nghĩa & CSS3 căn bản',
    phase: 'foundation',
    description: 'Xây dựng cấu trúc trang chuẩn Semantic HTML5, tiếp cận tính năng trợ năng (a11y) và tạo kiểu CSS.',
    outcome: 'Viết được trang web có bố cục chuẩn ngữ nghĩa, thẻ meta chuẩn SEO, và tuân thủ các quy tắc trợ năng cơ bản.',
    prerequisiteIds: ['cs.git'],
    resourceIds: ['resource.fe.html-mdn', 'resource.fe.html-freecodecamp'],
    defaultResourceId: 'resource.fe.html-mdn',
    optional: false,
    work: [
      {
        id: 'frontend.web-standards.work-semantic',
        revision: 1,
        title: 'Xây dựng trang đích cá nhân với Semantic HTML5',
        minutes: 90,
        acceptance: ['Sử dụng đúng các thẻ header, nav, main, section, article, footer.', 'Kiểm tra điểm tiếp cận (accessibility) bằng Lighthouse đạt trên 90.']
      },
      {
        id: 'frontend.web-standards.work-form',
        revision: 1,
        title: 'Xây dựng biểu mẫu liên hệ có ràng buộc dữ liệu HTML5',
        minutes: 60,
        acceptance: ['Sử dụng đúng input type, label kết nối với id, thuộc tính required và pattern validation.']
      }
    ]
  },
  {
    id: 'frontend.responsive-css',
    title: 'CSS Bố cục: Flexbox, Grid & Responsive',
    phase: 'foundation',
    description: 'Làm chủ các mô hình bố cục hiện đại Flexbox và CSS Grid, kết hợp Media Queries để tương thích di động.',
    outcome: 'Xây dựng giao diện web đa thiết bị (mobile, tablet, desktop) mượt mà mà không bị vỡ khung hình.',
    prerequisiteIds: ['frontend.web-standards'],
    resourceIds: ['resource.fe.flexbox-css-tricks', 'resource.fe.grid-mdn'],
    defaultResourceId: 'resource.fe.flexbox-css-tricks',
    optional: false,
    work: [
      {
        id: 'frontend.responsive-css.work-layout',
        revision: 1,
        title: 'Thiết kế bố cục lưới sản phẩm phản hồi nhanh (Responsive Grid)',
        minutes: 90,
        acceptance: ['Hiển thị 1 cột trên mobile, 2 cột trên tablet và 3-4 cột trên desktop.', 'Không dùng JavaScript để tính toán khoảng cách hoặc số cột.']
      },
      {
        id: 'frontend.responsive-css.work-nav',
        revision: 1,
        title: 'Xây dựng thanh điều hướng đa tầng với Flexbox',
        minutes: 60,
        acceptance: ['Menu hiển thị dạng hàng ngang trên desktop và thu gọn thành menu di động.', 'Căn chỉnh khoảng cách linh hoạt bằng gap và space-between.']
      }
    ]
  },
  {
    id: 'frontend.dom-apis',
    title: 'Thao tác DOM & Bất đồng bộ trong Web',
    phase: 'foundation',
    description: 'Tương tác với DOM, bắt sự kiện người dùng, Promise, async/await và gọi API bằng Fetch.',
    outcome: 'Tạo được các trang web tương tác động, gửi và nhận dữ liệu JSON từ API ngoài.',
    prerequisiteIds: ['language.javascript', 'frontend.responsive-css'],
    resourceIds: ['resource.fe.dom-mdn', 'resource.fe.async-mdn'],
    defaultResourceId: 'resource.fe.dom-mdn',
    optional: false,
    work: [
      {
        id: 'frontend.dom-apis.work-events',
        revision: 1,
        title: 'Xây dựng ứng dụng Todo List tương tác trực tiếp trên DOM',
        minutes: 90,
        acceptance: ['Thêm, sửa, xóa việc cần làm có cập nhật DOM mượt mà.', 'Ủy quyền sự kiện (Event Delegation) cho danh sách phần tử động.']
      },
      {
        id: 'frontend.dom-apis.work-fetch',
        revision: 1,
        title: 'Lấy dữ liệu thời tiết qua REST API với Fetch & async/await',
        minutes: 90,
        acceptance: ['Gọi API ngoài, hiển thị dữ liệu lên giao diện, xử lý trạng thái đang tải (loading) và hiển thị thông báo lỗi khi mạng gián đoạn.']
      }
    ]
  },
  {
    id: 'frontend.typescript',
    title: 'TypeScript cho Lập trình Web',
    phase: 'foundation',
    description: 'Hệ thống kiểu tĩnh trong TypeScript: Interfaces, Types, Generics, Union types và thiết lập tsconfig.',
    outcome: 'Viết mã nguồn an toàn kiểu (type-safe), hạn chế lỗi runtime và tăng năng suất phát triển dự án.',
    prerequisiteIds: ['language.javascript'],
    resourceIds: ['resource.fe.ts-handbook', 'resource.fe.ts-learn-x'],
    defaultResourceId: 'resource.fe.ts-handbook',
    optional: false,
    work: [
      {
        id: 'frontend.typescript.work-types',
        revision: 1,
        title: 'Định nghĩa Type/Interface cho mô hình dữ liệu ứng dụng',
        minutes: 90,
        acceptance: ['Khai báo kiểu cho thực thể người dùng, bài viết và phản hồi API (API Response envelope).', 'Sử dụng Generics cho hàm fetch bọc dữ liệu.']
      }
    ]
  },

  // --- Nhánh React ---
  {
    id: 'frontend.react.core',
    title: 'React Cốt lõi & JSX',
    phase: 'build',
    description: 'Kiến trúc Component-based, JSX, Props, State và vòng đời hiển thị trong React.',
    outcome: 'Xây dựng cấu trúc ứng dụng từ các component tái sử dụng, quản lý trạng thái cục bộ mượt mà.',
    prerequisiteIds: ['frontend.dom-apis', 'cs.git', 'frontend.typescript'],
    resourceIds: ['resource.fe.react-dev', 'resource.fe.react-fcc'],
    defaultResourceId: 'resource.fe.react-dev',
    optional: false,
    work: [
      {
        id: 'frontend.react.core.work-components',
        revision: 1,
        title: 'Tạo ứng dụng chia sẻ giao diện với React và TypeScript',
        minutes: 100,
        acceptance: ['Tách ứng dụng thành ít nhất 4 component có trách nhiệm độc lập.', 'Truyền props chặt chẽ có định kiểu TypeScript.']
      }
    ]
  },
  {
    id: 'frontend.react.hooks',
    title: 'React Hooks & State Management',
    phase: 'build',
    description: 'Làm chủ useState, useEffect, useRef, useMemo, useCallback và xây dựng Custom Hooks.',
    outcome: 'Quản lý logic phức tạp, gọi API an toàn và tối ưu hóa số lần re-render của component.',
    prerequisiteIds: ['frontend.react.core'],
    resourceIds: ['resource.fe.react-dev-hooks'],
    defaultResourceId: 'resource.fe.react-dev-hooks',
    optional: false,
    work: [
      {
        id: 'frontend.react.hooks.work-custom-hook',
        revision: 1,
        title: 'Xây dựng Custom Hook useFetch có xử lý Cache và AbortController',
        minutes: 110,
        acceptance: ['Trả về data, loading, error.', 'Hủy request mạng khi component bị unmount để tránh rò rỉ bộ nhớ.']
      }
    ]
  },
  {
    id: 'frontend.react.routing-state',
    title: 'React Router & Quản lý State Toàn cục',
    phase: 'build',
    description: 'Định tuyến SPA đa trang với React Router và chia sẻ dữ liệu toàn cục bằng Context API hoặc Zustand.',
    outcome: 'Xây dựng ứng dụng đơn trang (SPA) có nhiều trang, bảo vệ route riêng tư và quản lý giỏ hàng/phiên đăng nhập.',
    prerequisiteIds: ['frontend.react.hooks'],
    resourceIds: ['resource.fe.react-router-docs'],
    defaultResourceId: 'resource.fe.react-router-docs',
    optional: false,
    work: [
      {
        id: 'frontend.react.routing-state.work-spa',
        revision: 1,
        title: 'Xây dựng ứng dụng Mini E-Commerce với giỏ hàng toàn cục',
        minutes: 120,
        acceptance: ['Có ít nhất 3 route: Trang chủ, Chi tiết sản phẩm, Giỏ hàng.', 'Giỏ hàng được cập nhật tức thì trên toàn bộ các trang.']
      }
    ]
  },

  // --- Nhánh Angular ---
  {
    id: 'frontend.angular.core',
    title: 'Angular Cốt lõi & Standalone Components',
    phase: 'build',
    description: 'Kiến trúc Angular, Standalone Components, Data Binding, Directives và Signals.',
    outcome: 'Hiểu kiến trúc Angular hiện đại, ràng buộc dữ liệu 2 chiều và quản lý phản ứng trạng thái với Signals.',
    prerequisiteIds: ['frontend.dom-apis', 'cs.git', 'frontend.typescript'],
    resourceIds: ['resource.fe.angular-dev', 'resource.fe.angular-tour'],
    defaultResourceId: 'resource.fe.angular-dev',
    optional: false,
    work: [
      {
        id: 'frontend.angular.core.work-signals',
        revision: 1,
        title: 'Tạo ứng dụng Dashboard với Angular Signals',
        minutes: 110,
        acceptance: ['Sử dụng signal() và computed() để tính toán số liệu thống kê.', 'Hiển thị dữ liệu dùng *ngFor hoặc cú pháp @for mới.']
      }
    ]
  },
  {
    id: 'frontend.angular.services-routing',
    title: 'Angular Dependency Injection & Services',
    phase: 'build',
    description: 'Cơ chế Dependency Injection (DI), HttpClient, RxJS căn bản và Angular Router.',
    outcome: 'Tách biệt tầng dữ liệu vào Service, gọi API có chặn lỗi (HttpInterceptor) và định tuyến giao diện.',
    prerequisiteIds: ['frontend.angular.core'],
    resourceIds: ['resource.fe.angular-di-docs'],
    defaultResourceId: 'resource.fe.angular-di-docs',
    optional: false,
    work: [
      {
        id: 'frontend.angular.services-routing.work-service',
        revision: 1,
        title: 'Xây dựng ProductService kết nối REST API có Dependency Injection',
        minutes: 110,
        acceptance: ['Tạo Injectable Service xử lý CRUD sản phẩm.', 'Định tuyến điều hướng giữa danh sách và chi tiết.']
      }
    ]
  },
  {
    id: 'frontend.angular.forms',
    title: 'Angular Reactive Forms & Validation',
    phase: 'build',
    description: 'Quản lý biểu mẫu phức tạp với Reactive Forms, Custom Validators và xử lý trạng thái kiểm thử.',
    outcome: 'Tạo các form nhiều bước, kiểm tra hợp lệ thời gian thực và hiển thị thông báo lỗi chi tiết.',
    prerequisiteIds: ['frontend.angular.services-routing'],
    resourceIds: ['resource.fe.angular-forms-docs'],
    defaultResourceId: 'resource.fe.angular-forms-docs',
    optional: false,
    work: [
      {
        id: 'frontend.angular.forms.work-form',
        revision: 1,
        title: 'Xây dựng form đăng ký thành viên nhiều bước với Reactive Forms',
        minutes: 100,
        acceptance: ['FormGroup có lồng nhau, kiểm tra định dạng email và mật khẩu.', 'Hiển thị trạng thái lỗi rõ ràng bên dưới từng trường.']
      }
    ]
  },

  // --- Nhánh Vue ---
  {
    id: 'frontend.vue.core',
    title: 'Vue 3 Cốt lõi & Composition API',
    phase: 'build',
    description: 'Single-File Components (.vue), cú pháp mẫu (Template syntax), Composition API với ref() và reactive().',
    outcome: 'Xây dựng component với Vue 3 theo phong cách Composition API, tận dụng tính phản ứng nhanh.',
    prerequisiteIds: ['frontend.dom-apis', 'cs.git', 'frontend.typescript'],
    resourceIds: ['resource.fe.vue-dev', 'resource.fe.vue-tutorial'],
    defaultResourceId: 'resource.fe.vue-dev',
    optional: false,
    work: [
      {
        id: 'frontend.vue.core.work-component',
        revision: 1,
        title: 'Xây dựng ứng dụng quản lý ghi chú bằng Vue 3 SFC',
        minutes: 100,
        acceptance: ['Sử dụng <script setup lang="ts"> và ref/computed.', 'Component tái sử dụng có props và emit sự kiện lên component cha.']
      }
    ]
  },
  {
    id: 'frontend.vue.router-pinia',
    title: 'Vue Router & Pinia State Management',
    phase: 'build',
    description: 'Quản lý định tuyến với Vue Router 4 và quản lý trạng thái tập trung với Pinia.',
    outcome: 'Xây dựng ứng dụng Vue SPA đầy đủ có điều hướng trang và chia sẻ trạng thái tin cậy.',
    prerequisiteIds: ['frontend.vue.core'],
    resourceIds: ['resource.fe.vue-router-docs', 'resource.fe.pinia-docs'],
    defaultResourceId: 'resource.fe.pinia-docs',
    optional: false,
    work: [
      {
        id: 'frontend.vue.router-pinia.work-store',
        revision: 1,
        title: 'Tổ chức Pinia Store cho ứng dụng đa người dùng',
        minutes: 110,
        acceptance: ['Tạo store với state, getters và actions bất đồng bộ gọi API.', 'Chuyển trang lưu giữ dữ liệu giỏ hàng/người dùng.']
      }
    ]
  },

  // --- Chặng Hoàn thiện chung (Ship & Expand) ---
  {
    id: 'frontend.testing-performance',
    title: 'Kiểm thử Frontend & Tối ưu hiệu năng',
    phase: 'ship',
    description: 'Kiểm thử đơn vị với Vitest/Jest, kiểm thử component với React/Vue/Angular Testing Library, tối ưu Lighthouse.',
    outcome: 'Đảm bảo ứng dụng chạy ổn định, hạn chế hồi quy (regression) và tải trang dưới 2 giây trên mạng 4G.',
    prerequisiteIds: ['language.javascript'],
    resourceIds: ['resource.fe.testing-library-docs', 'resource.fe.web-dev-performance'],
    defaultResourceId: 'resource.fe.web-dev-performance',
    optional: false,
    work: [
      {
        id: 'frontend.testing-performance.work-tests',
        revision: 1,
        title: 'Viết bộ kiểm thử Component và đo đạc Web Vitals',
        minutes: 100,
        acceptance: ['Viết ít nhất 3 test case kiểm tra hành vi tương tác người dùng.', 'Tối ưu hình ảnh và code splitting để đạt điểm Lighthouse Performance trên 85.']
      }
    ]
  },
  {
    id: 'frontend.deploy',
    title: 'Đóng gói & Triển khai Web lên Production',
    phase: 'ship',
    description: 'Quy trình build Vite/Angular CLI, thiết lập biến môi trường và triển khai tự động lên Vercel/Netlify/GitHub Pages.',
    outcome: 'Đưa ứng dụng thực tế lên Internet với tên miền HTTPS miễn phí, có CI/CD tự động khi push code.',
    prerequisiteIds: ['frontend.testing-performance', 'cs.git'],
    resourceIds: ['resource.fe.vite-docs', 'resource.fe.vercel-docs'],
    defaultResourceId: 'resource.fe.vite-docs',
    optional: false,
    work: [
      {
        id: 'frontend.deploy.work-deployment',
        revision: 1,
        title: 'Triển khai ứng dụng sản phẩm lên nền tảng đám mây',
        minutes: 90,
        acceptance: ['Build thành công file tĩnh không có lỗi TypeScript.', 'Website chạy công khai trên Internet qua giao thức HTTPS.']
      }
    ]
  }
];

// Danh mục tài nguyên tham khảo
const frontendResources: LearningResource[] = [
  {
    id: 'resource.fe.git-w3schools',
    title: 'Git Tutorial for Beginners',
    provider: 'W3Schools',
    url: 'https://www.w3schools.com/git/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu hướng dẫn trực tuyến có ví dụ lệnh minh họa.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.git-github-docs',
    title: 'GitHub Getting Started Documentation',
    provider: 'GitHub Docs',
    url: 'https://docs.github.com/en/get-started',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu hướng dẫn chính thức từ GitHub.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.html-mdn',
    title: 'HTML: HyperText Markup Language Guides',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu tiêu chuẩn vàng về Semantic HTML và các thẻ ngữ nghĩa.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.html-freecodecamp',
    title: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Khóa học tương tác thực hành trực tiếp trên trình duyệt, miễn phí 100%.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.flexbox-css-tricks',
    title: 'A Complete Guide to Flexbox',
    provider: 'CSS-Tricks',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Sơ đồ hình ảnh trực quan về tất cả các thuộc tính Flexbox.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.grid-mdn',
    title: 'CSS Grid Layout Guides',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu chi tiết về bố cục hai chiều CSS Grid từ MDN.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.js-javascript-info',
    title: 'The Modern JavaScript Tutorial',
    provider: 'JavaScript.info',
    url: 'https://javascript.info/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'mixed',
    accessNote: 'Giáo trình chi tiết từ cơ bản đến nâng cao về JavaScript hiện đại.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.js-mdn',
    title: 'JavaScript Technologies & References',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'mixed',
    accessNote: 'Tra cứu chuẩn cú pháp và API của JavaScript.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.dom-mdn',
    title: 'Introduction to the DOM',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn chuẩn về kiến trúc cây DOM và thao tác sự kiện.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.async-mdn',
    title: 'Asynchronous JavaScript: Promises & async/await',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Giải thích chi tiết về xử lý bất đồng bộ và Fetch API.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.ts-handbook',
    title: 'The TypeScript Handbook',
    provider: 'Microsoft TypeScript Docs',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Cẩm nang chính thức về ngôn ngữ TypeScript từ đội ngũ Microsoft.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.ts-learn-x',
    title: 'Learn TypeScript in Y Minutes',
    provider: 'Learn X in Y Minutes',
    url: 'https://learnxinyminutes.com/typescript/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Bản tóm tắt cú pháp TypeScript nhanh chóng, dễ tra cứu.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.react-dev',
    title: 'React Documentation: Learn React',
    provider: 'React.dev',
    url: 'https://react.dev/learn',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu tương tác chính thức của React với kiến trúc hiện đại.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.react-fcc',
    title: 'React Tutorial: Tic-Tac-Toe',
    provider: 'React documentation',
    url: 'https://react.dev/learn/tutorial-tic-tac-toe',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Bài thực hành React chính thức: component, props, state và tương tác. Cần nền tảng JavaScript.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.react-dev-hooks',
    title: 'Built-in React Hooks Reference',
    provider: 'React.dev',
    url: 'https://react.dev/reference/react/hooks',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Đặc tả chi tiết cách dùng và lưu ý của từng Hook.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.react-router-docs',
    title: 'React Router Documentation',
    provider: 'React Router',
    url: 'https://reactrouter.com/start/declarative/installation',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tài liệu hướng dẫn thiết lập SPA Routing cho React.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.angular-dev',
    title: 'Angular Official Documentation',
    provider: 'Angular.dev',
    url: 'https://angular.dev/overview',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Cổng thông tin và hướng dẫn chính thức phiên bản Angular mới.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.angular-tour',
    title: 'Angular Tutorial: First App',
    provider: 'Angular.dev',
    url: 'https://angular.dev/tutorials/first-app',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Khóa hướng dẫn từng bước tạo ứng dụng đầu tiên với Standalone Components.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.angular-di-docs',
    title: 'Dependency Injection in Angular',
    provider: 'Angular.dev',
    url: 'https://angular.dev/guide/di',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn kiến trúc DI và quản lý Service trong Angular.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.angular-forms-docs',
    title: 'Angular Reactive Forms Guide',
    provider: 'Angular.dev',
    url: 'https://angular.dev/guide/forms/reactive-forms',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Cẩm nang xây dựng và xác thực biểu mẫu với Reactive Forms.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.vue-dev',
    title: 'Vue.js Documentation - The Progressive Framework',
    provider: 'Vuejs.org',
    url: 'https://vuejs.org/guide/introduction.html',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Tài liệu chính thức của Vue 3 với phong cách Composition API.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.vue-tutorial',
    title: 'Vue 3 Interactive Tutorial',
    provider: 'Vuejs.org',
    url: 'https://vuejs.org/tutorial/',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Trình thực hành tương tác trực tiếp từng tính năng của Vue 3.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.vue-router-docs',
    title: 'Vue Router 4 Official Guide',
    provider: 'Vue Router',
    url: 'https://router.vuejs.org/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tài liệu hướng dẫn điều hướng cho ứng dụng Vue.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.pinia-docs',
    title: 'Pinia - The Intuitive Store for Vue.js',
    provider: 'Pinia Vuejs',
    url: 'https://pinia.vuejs.org/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Thư viện quản lý trạng thái chuẩn khuyến nghị cho Vue 3.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.testing-library-docs',
    title: 'DOM Testing Library Documentation',
    provider: 'Testing Library',
    url: 'https://testing-library.com/docs/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Bộ công cụ kiểm thử giao diện theo góc nhìn trải nghiệm người dùng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.web-dev-performance',
    title: 'Web Vitals & Performance Optimization',
    provider: 'web.dev by Google',
    url: 'https://web.dev/articles/vitals',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Hướng dẫn đo lường và tối ưu LCP, FID, CLS, INP từ các kỹ sư Google.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.vite-docs',
    title: 'Vite: Next Generation Frontend Tooling',
    provider: 'Vitejs.dev',
    url: 'https://vite.dev/guide/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn cấu hình build và đóng gói tài nguyên web hiện đại.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.fe.vercel-docs',
    title: 'Deploying Frontend Projects to Vercel',
    provider: 'Vercel Docs',
    url: 'https://vercel.com/docs',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn triển khai dự án frontend với CI/CD tự động.',
    checkedAt: '2026-10-08'
  }
];

// Danh mục chứng nhận mục tiêu
const frontendCredentials: CredentialGoal[] = [
  {
    id: 'credential.fe.freecodecamp-rwd',
    name: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    kind: 'skill_assessment',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    cost: 'free',
    prerequisites: 'Hoàn thành 5 dự án giao diện bắt buộc trên freeCodeCamp.',
    requirements: 'Đạt đầy đủ các bài kiểm tra tự động về bố cục HTML/CSS và khả năng phản hồi di động.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'credential.fe.freecodecamp-js',
    name: 'JavaScript Algorithms and Data Structures',
    provider: 'freeCodeCamp',
    kind: 'skill_assessment',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    cost: 'free',
    prerequisites: 'Hoàn thành các bài tập thuật toán và thao tác dữ liệu JavaScript.',
    requirements: 'Giải quyết 5 bài toán thực tế kiểm tra tư duy lập trình và thao tác chuỗi/mảng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'credential.fe.meta-frontend',
    name: 'Meta Front-End Developer Professional Certificate',
    provider: 'Coursera / Meta',
    kind: 'program_certificate',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    cost: 'paid',
    prerequisites: 'Hoàn thành chuỗi 9 khóa học về HTML/CSS, JavaScript, React và Capstone Project.',
    requirements: 'Vượt qua các bài kiểm tra trắc nghiệm và nộp dự án Capstone được chấm điểm ngang hàng.',
    checkedAt: '2026-10-08'
  }
];

// Định nghĩa 3 track của Frontend
const frontendTracks: LearningTrack[] = [
  {
    id: 'frontend.react',
    pathId: 'frontend',
    label: 'React / TypeScript',
    stageIds: [
      'cs.git',
      'frontend.web-standards',
      'frontend.responsive-css',
      'language.javascript',
      'frontend.dom-apis',
      'frontend.typescript',
      'frontend.react.core',
      'frontend.react.hooks',
      'frontend.react.routing-state',
      'frontend.testing-performance',
      'frontend.deploy'
    ],
    credentialIds: [
      'credential.fe.freecodecamp-rwd',
      'credential.fe.freecodecamp-js',
      'credential.fe.meta-frontend'
    ],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'React Roadmap', url: 'https://roadmap.sh/react' }
    ],
    portfolio: {
      title: 'Ứng dụng Web Dashboard tương tác với React & TypeScript',
      acceptance: [
        'Có đầy đủ các trang Danh sách, Chi tiết, và Biểu mẫu lọc/tìm kiếm.',
        'Quản lý trạng thái bằng Hooks và Context/State manager mà không bị lag giật.',
        'Được triển khai lên hosting công khai (Vercel/Netlify) có mã nguồn trên GitHub.'
      ]
    }
  },
  {
    id: 'frontend.angular',
    pathId: 'frontend',
    label: 'Angular / TypeScript',
    stageIds: [
      'cs.git',
      'frontend.web-standards',
      'frontend.responsive-css',
      'language.javascript',
      'frontend.dom-apis',
      'frontend.typescript',
      'frontend.angular.core',
      'frontend.angular.services-routing',
      'frontend.angular.forms',
      'frontend.testing-performance',
      'frontend.deploy'
    ],
    credentialIds: [
      'credential.fe.freecodecamp-rwd',
      'credential.fe.freecodecamp-js'
    ],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'Angular Roadmap', url: 'https://roadmap.sh/angular' }
    ],
    portfolio: {
      title: 'Hệ thống Quản lý Đơn hàng Doanh nghiệp với Angular',
      acceptance: [
        'Tách biệt Service logic và Component giao diện rõ ràng qua Dependency Injection.',
        'Sử dụng Reactive Forms có ràng buộc kiểm tra hợp lệ dữ liệu thời gian thực.',
        'Ứng dụng chạy mượt mà, định tuyến có bảo vệ route và xử lý lỗi mạng tập trung.'
      ]
    }
  },
  {
    id: 'frontend.vue',
    pathId: 'frontend',
    label: 'Vue 3 / Pinia',
    stageIds: [
      'cs.git',
      'frontend.web-standards',
      'frontend.responsive-css',
      'language.javascript',
      'frontend.dom-apis',
      'frontend.typescript',
      'frontend.vue.core',
      'frontend.vue.router-pinia',
      'frontend.testing-performance',
      'frontend.deploy'
    ],
    credentialIds: [
      'credential.fe.freecodecamp-rwd',
      'credential.fe.freecodecamp-js'
    ],
    roadmapLinks: [
      { label: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' },
      { label: 'Vue Roadmap', url: 'https://roadmap.sh/vue' }
    ],
    portfolio: {
      title: 'Cổng thông tin Truyền thông Tương tác với Vue 3 & Pinia',
      acceptance: [
        'Xây dựng bằng Composition API với cú pháp Single-File Components sạch sẽ.',
        'Quản lý dữ liệu giỏ hàng hoặc bộ lọc bài viết thông qua Pinia Store.',
        'Có kiểm thử đơn vị cơ bản và triển khai trên máy chủ đám mây.'
      ]
    }
  }
];

export const frontendPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-08.frontend-v2',
  pathId: 'frontend',
  reviewStatus: 'review',
  stages: frontendStages,
  resources: frontendResources,
  credentials: frontendCredentials,
  tracks: frontendTracks
};
