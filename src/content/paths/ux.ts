import type { ContentPack, LearningStage, LearningResource, CredentialGoal, LearningTrack } from '../../domain/contracts';

const uxStages: LearningStage[] = [
  {
    id: 'ux.fundamentals',
    title: 'Tư duy Thiết kế (Design Thinking) & UX Căn bản',
    phase: 'foundation',
    description: 'Tìm hiểu 5 bước của quy trình Design Thinking: Thấu cảm, Xác định vấn đề, Lên ý tưởng, Tạo mẫu và Thử nghiệm.',
    outcome: 'Hiểu bản chất của trải nghiệm người dùng, phân biệt UX và UI, xây dựng tư duy lấy con người làm trung tâm.',
    prerequisiteIds: [],
    resourceIds: ['resource.ux.nngroup-ux-definition', 'resource.ux.interaction-design-dt'],
    defaultResourceId: 'resource.ux.nngroup-ux-definition',
    optional: false,
    work: [
      {
        id: 'ux.fundamentals.work-empathy',
        revision: 1,
        title: 'Lập bản đồ thấu cảm (Empathy Map) cho nhóm người dùng mục tiêu',
        minutes: 90,
        acceptance: [
          'Thu thập quan sát qua 4 góc: Says, Thinks, Does, Feels.',
          'Rút ra ít nhất 3 nhu cầu cốt lõi (User Needs) và điểm khó chịu (Pain points).'
        ]
      }
    ]
  },
  {
    id: 'ux.research-methods',
    title: 'Phương pháp Nghiên cứu Người dùng (User Research)',
    phase: 'foundation',
    description: 'Thực hiện phỏng vấn người dùng, khảo sát định lượng, xây dựng chân dung người dùng (User Personas) và Hành trình trải nghiệm (User Journey Map).',
    outcome: 'Thu thập được thông tin định tính và định lượng chính xác từ người dùng thực tế.',
    prerequisiteIds: ['ux.fundamentals'],
    resourceIds: ['resource.ux.nngroup-personas', 'resource.ux.nngroup-journey-mapping'],
    defaultResourceId: 'resource.ux.nngroup-personas',
    optional: false,
    work: [
      {
        id: 'ux.research-methods.work-persona',
        revision: 1,
        title: 'Xây dựng 2 bộ hồ sơ chân dung người dùng (User Persona) hoàn chỉnh',
        minutes: 100,
        acceptance: [
          'Bao gồm mục tiêu, khó khăn, động lực và hành vi thực tế dựa trên dữ liệu phỏng vấn.',
          'Có trích dẫn nhận định thực tế từ phỏng vấn người dùng.'
        ]
      },
      {
        id: 'ux.research-methods.work-journey',
        revision: 1,
        title: 'Vẽ sơ đồ hành trình người dùng (User Journey Map)',
        minutes: 90,
        acceptance: [
          'Xác định rõ các giai đoạn, hành động, cảm xúc và cơ hội cải tiến trải nghiệm ở từng điểm tiếp xúc.'
        ]
      }
    ]
  },
  {
    id: 'ux.information-architecture',
    title: 'Kiến trúc Thông tin & Luồng Người dùng (User Flow)',
    phase: 'foundation',
    description: 'Phân loại thông tin bằng phương pháp Card Sorting, xây dựng Sơ đồ trang web (Sitemap) và thiết kế Luồng thao tác (User Flow).',
    outcome: 'Tổ chức cấu trúc nội dung hợp lý, giúp người dùng dễ dàng tìm kiếm và hoàn thành tác vụ với số bước tối thiểu.',
    prerequisiteIds: ['ux.research-methods'],
    resourceIds: ['resource.ux.nngroup-ia', 'resource.ux.figma-flow-guide'],
    defaultResourceId: 'resource.ux.nngroup-ia',
    optional: false,
    work: [
      {
        id: 'ux.information-architecture.work-flow',
        revision: 1,
        title: 'Thiết kế biểu đồ luồng người dùng (User Flow Diagram) cho tính năng thanh toán',
        minutes: 90,
        acceptance: [
          'Vẽ sơ đồ với đầy đủ các điểm bắt đầu, quyết định rẽ nhánh, trạng thái lỗi và màn hình kết thúc.',
          'Tối ưu hóa các bước để giảm thiểu tỉ lệ bỏ dở.'
        ]
      }
    ]
  },

  // --- Nhánh UX Research / Interaction ---
  {
    id: 'ux.interaction-design',
    title: 'Thiết kế Tương tác & 10 Nguyên lý Heuristics',
    phase: 'build',
    description: 'Ứng dụng 10 nguyên lý thiết kế tương tác của Jakob Nielsen, thiết kế khung dây (Wireframing) độ trung thực thấp (Low-fi).',
    outcome: 'Đánh giá và loại bỏ các lỗi tương tác gây khó hiểu, tạo khung bố cục rõ ràng trước khi đi vào đồ họa chi tiết.',
    prerequisiteIds: ['ux.information-architecture'],
    resourceIds: ['resource.ux.nngroup-heuristics', 'resource.ux.lawsofux'],
    defaultResourceId: 'resource.ux.nngroup-heuristics',
    optional: false,
    work: [
      {
        id: 'ux.interaction-design.work-heuristics-audit',
        revision: 1,
        title: 'Đánh giá tính khả dụng (Heuristic Evaluation) cho một website hiện hữu',
        minutes: 100,
        acceptance: [
          'Phân tích đối chiếu theo 10 nguyên tắc Heuristics của Jakob Nielsen.',
          'Chỉ ra ít nhất 5 điểm bất hợp lý kèm phương án cải tiến trực quan.'
        ]
      },
      {
        id: 'ux.interaction-design.work-wireframe',
        revision: 1,
        title: 'Vẽ bộ khung dây Low-fidelity Wireframe cho 5 màn hình chính',
        minutes: 110,
        acceptance: [
          'Bố cục cân đối, phân cấp thị giác rõ ràng mà không dùng đến màu sắc trang trí.',
          'Chú thích rõ hành vi bấm, cuộn và phản hồi trạng thái.'
        ]
      }
    ]
  },
  {
    id: 'ux.usability-testing',
    title: 'Kiểm thử Tính khả dụng (Usability Testing)',
    phase: 'build',
    description: 'Lập kịch bản kiểm thử, quan sát người dùng thao tác mẫu thử, tính toán chỉ số SUS (System Usability Scale) và phân tích lỗi.',
    outcome: 'Thu được dữ liệu định lượng và phát hiện rào cản thao tác thực tế của người dùng để cải tiến sản phẩm liên tục.',
    prerequisiteIds: ['ux.interaction-design'],
    resourceIds: ['resource.ux.nngroup-usability-testing', 'resource.ux.usability-gov'],
    defaultResourceId: 'resource.ux.nngroup-usability-testing',
    optional: false,
    work: [
      {
        id: 'ux.usability-testing.work-test-session',
        revision: 1,
        title: 'Tổ chức buổi kiểm thử tính khả dụng với 5 người dùng thật',
        minutes: 120,
        acceptance: [
          'Ghi nhận tỷ lệ hoàn thành tác vụ (Task Completion Rate) và thời gian thực hiện.',
          'Tổng hợp báo cáo các vấn đề cần khắc phục kèm mức độ nghiêm trọng.'
        ]
      }
    ]
  },

  // --- Nhánh UI / Product Design ---
  {
    id: 'ux.visual-foundations',
    title: 'Nguyên lý Thiết kế Thị giác & Typography',
    phase: 'build',
    description: 'Lý thuyết màu sắc, độ tương phản WCAG, phân cấp chữ (Typographic Scale), lưới bố cục 8pt và khoảng cách (Spacing System).',
    outcome: 'Tạo ra các giao diện thẩm mỹ, sạch sẽ, dễ đọc và đạt chuẩn độ tương phản tiếp cận.',
    prerequisiteIds: ['ux.information-architecture'],
    resourceIds: ['resource.ux.material-design-3', 'resource.ux.refactoring-ui'],
    defaultResourceId: 'resource.ux.material-design-3',
    optional: false,
    work: [
      {
        id: 'ux.visual-foundations.work-style-guide',
        revision: 1,
        title: 'Xây dựng bộ hướng dẫn phong cách thị giác (Visual Style Guide)',
        minutes: 100,
        acceptance: [
          'Quy định bảng màu chính, màu phụ, màu trạng thái và kiểm tra độ tương phản đạt chuẩn WCAG AA.',
          'Quy định thang tỉ lệ phông chữ (H1-H6, Body, Caption) kèm khoảng cách dòng rõ ràng.'
        ]
      }
    ]
  },
  {
    id: 'ux.figma-prototyping',
    title: 'Figma Nâng cao & Bản mẫu Tương tác (Prototyping)',
    phase: 'build',
    description: 'Sử dụng thành thạo Figma: Auto Layout, Components, Variants, Component Properties, Variables và Smart Animate.',
    outcome: 'Tạo bản mẫu tương tác sống động như ứng dụng thật, thử nghiệm mượt mà trên điện thoại và máy tính.',
    prerequisiteIds: ['ux.visual-foundations'],
    resourceIds: ['resource.ux.figma-learn-autolayout', 'resource.ux.figma-prototype-docs'],
    defaultResourceId: 'resource.ux.figma-learn-autolayout',
    optional: false,
    work: [
      {
        id: 'ux.figma-prototyping.work-hifi-prototype',
        revision: 1,
        title: 'Thiết kế bản mẫu tương tác độ trung thực cao (Hi-fi Prototype)',
        minutes: 120,
        acceptance: [
          'Sử dụng 100% Auto Layout và Variants cho các nút bấm, input, card sản phẩm.',
          'Thiết lập hiệu ứng chuyển cảnh mượt mà giữa các màn hình với Smart Animate.'
        ]
      }
    ]
  },
  {
    id: 'ux.design-systems',
    title: 'Xây dựng Hệ thống Thiết kế (Design Systems)',
    phase: 'build',
    description: 'Thiết lập Design Tokens, quản lý thư viện thành phần đồng bộ và chuẩn bị tài liệu bàn giao cho lập trình viên (Design Handoff).',
    outcome: 'Đảm bảo tính nhất quán trên toàn bộ sản phẩm và rút ngắn thời gian bàn giao giữa Designer và Developer.',
    prerequisiteIds: ['ux.figma-prototyping'],
    resourceIds: ['resource.ux.figma-design-systems', 'resource.ux.design-system-checklist'],
    defaultResourceId: 'resource.ux.figma-design-systems',
    optional: false,
    work: [
      {
        id: 'ux.design-systems.work-system-library',
        revision: 1,
        title: 'Xây dựng bộ UI Kit & Design System hoàn chỉnh trên Figma',
        minutes: 120,
        acceptance: [
          'Bao gồm ít nhất 15 thành phần có đầy đủ các trạng thái: Default, Hover, Active, Disabled, Error.',
          'Có ghi chú đặc tả kích thước, khoảng cách và tokens cho lập trình viên.'
        ]
      }
    ]
  },

  // --- Chặng Đóng gói Portfolio chung ---
  {
    id: 'ux.portfolio',
    title: 'Đóng gói Case Study & Hồ sơ Năng lực (Portfolio)',
    phase: 'ship',
    description: 'Trình bày câu chuyện giải quyết vấn đề qua Case Study chi tiết: Vấn đề, Dữ liệu nghiên cứu, Quá trình lặp lại và Kết quả đo lường.',
    outcome: 'Sở hữu ít nhất 1 Case Study chuẩn mực để ứng tuyển thực tập hoặc việc làm UX/UI Designer.',
    prerequisiteIds: ['ux.information-architecture'],
    resourceIds: ['resource.ux.uxdesign-cc-casestudy', 'resource.ux.cofolios'],
    defaultResourceId: 'resource.ux.uxdesign-cc-casestudy',
    optional: false,
    work: [
      {
        id: 'ux.portfolio.work-casestudy',
        revision: 1,
        title: 'Hoàn thiện tài liệu Case Study UX/UI chuẩn mực',
        minutes: 120,
        acceptance: [
          'Trình bày mạch lạc từ bối cảnh, nghiên cứu, wireframe, kết quả kiểm thử đến giao diện hoàn thiện.',
          'Nêu rõ các bài học rút ra và chỉ số đo lường cải tiến cho người dùng.'
        ]
      }
    ]
  }
];

const uxResources: LearningResource[] = [
  {
    id: 'resource.ux.nngroup-ux-definition',
    title: 'The Definition of User Experience (UX)',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/definition-user-experience/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Định nghĩa chuẩn mực về UX từ Don Norman và Jakob Nielsen.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.interaction-design-dt',
    title: 'What is Design Thinking and Why Is It So Popular?',
    provider: 'Interaction Design Foundation',
    url: 'https://www.interaction-design.org/literature/article/what-is-design-thinking-and-why-is-it-so-popular',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Khái quát 5 giai đoạn cốt lõi của tư duy thiết kế.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.nngroup-personas',
    title: 'Personas Make Users Memorable for Product Teams',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/persona/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn phương pháp xây dựng Persona dựa trên dữ liệu thật.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.nngroup-journey-mapping',
    title: 'Journey Mapping 101',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/journey-mapping-101/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Cách tạo bản đồ trải nghiệm theo từng điểm chạm của người dùng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.nngroup-ia',
    title: 'Information Architecture: Study Guide',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/ia-study-guide/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tổng hợp tài liệu về cấu trúc thông tin và phân loại nội dung.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.figma-flow-guide',
    title: 'Creating User Flow Diagrams in Figma',
    provider: 'Figma Resource Library',
    url: 'https://www.figma.com/resource-library/user-flow/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn vẽ sơ đồ luồng thao tác trực quan bằng Figma/FigJam.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.nngroup-heuristics',
    title: '10 Usability Heuristics for User Interface Design',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: '10 nguyên tắc vàng đánh giá tính khả dụng giao diện của Jakob Nielsen.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.lawsofux',
    title: 'Laws of UX - Psychological Principles in Design',
    provider: 'Laws of UX by Jon Yablonski',
    url: 'https://lawsofux.com/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Tập hợp các quy luật tâm lý học ứng dụng vào thiết kế giao diện.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.nngroup-usability-testing',
    title: 'Usability Testing 101',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/usability-testing-101/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Quy trình chuẩn tổ chức một phiên thử nghiệm sản phẩm với người dùng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.usability-gov',
    title: 'Measuring Perceived Usability',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/measuring-perceived-usability/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Đo khả dụng cảm nhận bằng SUS và các thang đo; thay trang usability.gov đã chuyển sang trang tổng quan.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.material-design-3',
    title: 'Material Design 3 Design System Guidelines',
    provider: 'Google Design',
    url: 'https://m3.material.io/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn toàn diện về bảng màu động, typography và layout từ Google.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.refactoring-ui',
    title: 'Refactoring UI Book & Tips',
    provider: 'Tailwind Labs',
    url: 'https://www.refactoringui.com/',
    language: 'en',
    format: 'article',
    cost: 'paid',
    level: 'intermediate',
    accessNote: 'Sách và bộ tài liệu thiết kế UI có phí. Chỉ phần giới thiệu/preview được xem miễn phí; xem giá hiện hành tại nhà cung cấp.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.figma-learn-autolayout',
    title: 'Guide to Auto Layout in Figma',
    provider: 'Figma Help Center',
    url: 'https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn chuyên sâu làm chủ Auto Layout và căn lề linh hoạt.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.figma-prototype-docs',
    title: 'Create Smart Animations and Interactions in Figma',
    provider: 'Figma Help Center',
    url: 'https://help.figma.com/hc/en-us/articles/360039818874-Smart-animate-layers-between-frames',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Cách tạo tương tác động tinh tế giữa các khung hình Figma.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.figma-design-systems',
    title: 'Design Systems 101: What Is a Design System?',
    provider: 'Figma Blog',
    url: 'https://www.figma.com/blog/design-systems-101-what-is-a-design-system/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Thành phần, biến và thư viện dùng chung; bài đọc miễn phí. Một số tính năng cộng tác Figma cần gói trả phí.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.design-system-checklist',
    title: 'Design System Checklist',
    provider: 'Design System Checklist',
    url: 'https://designsystemchecklist.com/',
    language: 'en',
    format: 'exercise',
    cost: 'free',
    level: 'advanced',
    accessNote: 'Bảng kiểm tra đầy đủ các thành phần cần có của một Design System chuẩn.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.uxdesign-cc-casestudy',
    title: '5 Steps to Creating a UX Design Portfolio',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/ux-design-portfolios/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'intermediate',
    accessNote: 'Hướng dẫn trình bày quy trình UX, dự án và đóng góp trong portfolio; bài đọc công khai.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'resource.ux.cofolios',
    title: 'Cofolios - Design Portfolios of Recent Interns',
    provider: 'Cofolios',
    url: 'https://cofolios.com/',
    language: 'en',
    format: 'article',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Thư viện tham khảo Portfolio thiết kế sản phẩm của các thực tập sinh tại Big Tech.',
    checkedAt: '2026-10-08'
  }
];

const uxCredentials: CredentialGoal[] = [
  {
    id: 'credential.ux.google-cert',
    name: 'Google UX Design Professional Certificate',
    provider: 'Coursera / Google',
    kind: 'program_certificate',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    cost: 'paid',
    prerequisites: 'Không yêu cầu kinh nghiệm UX trước; học chuỗi khóa và xây portfolio theo chương trình hiện hành.',
    requirements: 'Vượt qua các bài kiểm tra trắc nghiệm và nộp dự án được chấm điểm ngang hàng.',
    checkedAt: '2026-10-08'
  },
  {
    id: 'credential.ux.ixdf-design-thinking',
    name: 'Design Thinking: The Beginner’s Guide Certificate',
    provider: 'Interaction Design Foundation',
    kind: 'course_certificate',
    url: 'https://www.interaction-design.org/courses/design-thinking-the-beginner-s-guide',
    cost: 'paid',
    prerequisites: 'Hoàn thành các bài học và bài kiểm tra tình huống về tư duy thiết kế.',
    requirements: 'Hoàn thành yêu cầu và đạt ngưỡng điểm chứng nhận của khóa; cần tư cách thành viên trả phí. Kiểm tra điều kiện hiện hành trước khi đăng ký.',
    checkedAt: '2026-10-08'
  }
];

const uxTracks: LearningTrack[] = [
  {
    id: 'ux.research',
    pathId: 'ux',
    label: 'UX Research & Interaction',
    stageIds: [
      'ux.fundamentals',
      'ux.research-methods',
      'ux.information-architecture',
      'ux.interaction-design',
      'ux.usability-testing',
      'ux.portfolio'
    ],
    credentialIds: [
      'credential.ux.google-cert',
      'credential.ux.ixdf-design-thinking'
    ],
    roadmapLinks: [
      { label: 'UX Design Roadmap', url: 'https://roadmap.sh/ux-design' },
      { label: 'Nielsen Norman Group Research', url: 'https://www.nngroup.com/' }
    ],
    portfolio: {
      title: 'Báo cáo Nghiên cứu & Cải tiến Trải nghiệm Sản phẩm Số',
      acceptance: [
        'Có chân dung người dùng (Personas) và bản đồ hành trình (User Journey Map) dựa trên dữ liệu thật.',
        'Thực hiện đánh giá Heuristics và kiểm thử tính khả dụng với ít nhất 5 người dùng.',
        'Đưa ra đề xuất cải tiến có khung dây minh họa và chỉ số đo lường cải thiện.'
      ]
    }
  },
  {
    id: 'ux.product',
    pathId: 'ux',
    label: 'UI & Product Design',
    stageIds: [
      'ux.fundamentals',
      'ux.research-methods',
      'ux.information-architecture',
      'ux.visual-foundations',
      'ux.figma-prototyping',
      'ux.design-systems',
      'ux.portfolio'
    ],
    credentialIds: [
      'credential.ux.google-cert'
    ],
    roadmapLinks: [
      { label: 'UX Design Roadmap', url: 'https://roadmap.sh/ux-design' },
      { label: 'Figma Best Practices', url: 'https://help.figma.com/' }
    ],
    portfolio: {
      title: 'Hệ thống Thiết kế Ứng dụng Di động & Bản mẫu Figma Hoàn chỉnh',
      acceptance: [
        'Bộ UI Kit có đầy đủ Typography, Bảng màu WCAG AA và ít nhất 15 thành phần tái sử dụng.',
        'Bản mẫu tương tác độ trung thực cao (Hi-fi Prototype) có Smart Animate mượt mà.',
        'Case Study trình bày rõ ràng quy trình giải quyết vấn đề từ khung dây đến sản phẩm cuối.'
      ]
    }
  }
];

export const uxPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-08.ux-v2',
  pathId: 'ux',
  reviewStatus: 'review',
  stages: uxStages,
  resources: uxResources,
  credentials: uxCredentials,
  tracks: uxTracks
};
