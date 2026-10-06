/**
 * Content pack: UX Design (ux.research, ux.product)
 * Người biên soạn: Nguyễn Thị Quỳnh Hân (MW-TEAM-01)
 * Ngày kiểm tra nguồn: 2026-10-06
 *
 * Quy ước:
 *  - Chỉ ghi URL đã xác minh trực tiếp (✅). Nguồn ⚠️ không đưa vào.
 *  - University of Michigan UX Specialization trên Coursera (⚠️) CHƯA được đưa vào.
 *  - cost:'paid' cho IxDF vì ghi nhận cần membership.
 *  - KHÔNG import registry/implementation vào file domain.
 */
import type { ContentPack, LearningStage, LearningResource, CredentialGoal, LearningTrack } from '../../domain/contracts';

const CHECKED = '2026-10-06';

// ─────────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────────
const resources: LearningResource[] = [
  // UX Research
  {
    id: 'resource.ixdf-user-research',
    title: 'User Research – Methods and Best Practices',
    provider: 'Interaction Design Foundation (IxDF)',
    url: 'https://www.interaction-design.org/courses/user-research-methods-and-best-practices',
    language: 'en',
    format: 'course',
    cost: 'paid',
    level: 'intermediate',
    accessNote: 'Yêu cầu membership IxDF. Giá tham khảo ~$22/tháng nhưng cần xem giá chính thức tại trang IxDF. CheckedAt: 2026-10-06.',
    checkedAt: CHECKED,
  },
  // UI / Figma
  {
    id: 'resource.figma-beginners',
    title: 'Figma Design for Beginners – Build a Website Portfolio',
    provider: 'Figma (help.figma.com)',
    url: 'https://help.figma.com/hc/en-us/articles/30848209492887',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Hướng dẫn xây một website portfolio từ đầu. Gói Starter của Figma là đủ để thực hành (miễn phí).',
    checkedAt: CHECKED,
  },
  {
    id: 'resource.figma-learn-design',
    title: 'Learn Design – Figma',
    provider: 'Figma (figma.com)',
    url: 'https://www.figma.com/resources/learn-design/',
    language: 'en',
    format: 'course',
    cost: 'free',
    level: 'introductory',
    accessNote: 'Khóa học về nguyên tắc thiết kế từ Figma. Miễn phí.',
    checkedAt: CHECKED,
  },
];

// ─────────────────────────────────────────────
// CREDENTIALS
// ─────────────────────────────────────────────
const credentials: CredentialGoal[] = [
  {
    id: 'credential.google-ux-design',
    name: 'Google UX Design Certificate',
    provider: 'Google / Coursera',
    kind: 'program_certificate',
    url: 'https://grow.google/certificates/en_ca/ux-design/',
    cost: 'paid',
    prerequisites: 'Không yêu cầu kinh nghiệm thiết kế trước.',
    requirements: '7 khóa, 243 giờ. Giá ~$49/tháng (trang Canada) sau 7 ngày thử; giá tại Việt Nam cần xem trên Coursera. Có hỗ trợ tài chính qua Coursera. Chỉ có tiếng Anh. Kiểm tra: 2026-10-06.',
    checkedAt: CHECKED,
  },
];

// ─────────────────────────────────────────────
// STAGES
// ─────────────────────────────────────────────
const researchStages: LearningStage[] = [
  {
    id: 'ux.research.foundations',
    title: 'Nền tảng UX Research',
    phase: 'foundation',
    description: 'Hiểu user-centered design, phương pháp nghiên cứu (interview, survey, usability test), phân tích kết quả.',
    outcome: 'Thiết kế được kế hoạch nghiên cứu người dùng và tổng hợp được insight.',
    prerequisiteIds: [],
    resourceIds: ['resource.ixdf-user-research'],
    defaultResourceId: 'resource.ixdf-user-research',
    optional: false,
    work: [
      {
        id: 'ux.research.foundations.w1', revision: 1,
        title: 'Lập kế hoạch phỏng vấn người dùng (5 đối tượng)',
        minutes: 120,
        acceptance: ['Có mục tiêu nghiên cứu rõ.', 'Có bộ câu hỏi phỏng vấn.', 'Có affinity map từ kết quả.'],
      },
    ],
  },
  {
    id: 'ux.research.usability',
    title: 'Kiểm thử khả năng sử dụng',
    phase: 'build',
    description: 'Thiết kế kịch bản test, điều hành moderated/unmoderated session, phân tích kết quả và báo cáo.',
    outcome: 'Thực hiện được một buổi usability test và đưa ra đề xuất cải thiện.',
    prerequisiteIds: ['ux.research.foundations'],
    resourceIds: ['resource.ixdf-user-research'],
    defaultResourceId: 'resource.ixdf-user-research',
    optional: false,
    work: [
      {
        id: 'ux.research.usability.w1', revision: 1,
        title: 'Báo cáo usability test một ứng dụng thực tế',
        minutes: 150,
        acceptance: ['Có 3+ vấn đề phát hiện.', 'Phân loại theo mức độ nghiêm trọng.', 'Có đề xuất giải pháp.'],
      },
    ],
  },
];

const productStages: LearningStage[] = [
  {
    id: 'ux.product.figma-basics',
    title: 'Figma cơ bản',
    phase: 'foundation',
    description: 'Giao diện Figma, frames, auto layout, components, styles, prototyping.',
    outcome: 'Tạo được mockup trang web với Figma và liên kết prototype cơ bản.',
    prerequisiteIds: [],
    resourceIds: ['resource.figma-learn-design', 'resource.figma-beginners'],
    defaultResourceId: 'resource.figma-learn-design',
    optional: false,
    work: [
      {
        id: 'ux.product.figma-basics.w1', revision: 1,
        title: 'Xây dựng website portfolio theo hướng dẫn Figma',
        minutes: 180,
        acceptance: ['Dùng components và auto layout.', 'Có ít nhất 3 màn hình.', 'Có prototype click-through.'],
      },
    ],
  },
  {
    id: 'ux.product.design-principles',
    title: 'Nguyên tắc thiết kế giao diện',
    phase: 'build',
    description: 'Gestalt, hierarchy, color theory, typography, spacing, accessibility cơ bản.',
    outcome: 'Áp dụng được các nguyên tắc thiết kế để phê bình và cải thiện UI.',
    prerequisiteIds: ['ux.product.figma-basics'],
    resourceIds: ['resource.figma-learn-design'],
    defaultResourceId: 'resource.figma-learn-design',
    optional: false,
    work: [
      {
        id: 'ux.product.design-principles.w1', revision: 1,
        title: 'Redesign một màn hình app thực tế',
        minutes: 150,
        acceptance: ['Giải thích lý do thay đổi dựa trên nguyên tắc.', 'So sánh before/after.'],
      },
    ],
  },
  {
    id: 'ux.product.design-system',
    title: 'Design System & Handoff',
    phase: 'ship',
    description: 'Xây design system nhỏ, inspect, export assets, chú thích developer handoff.',
    outcome: 'Bàn giao được file Figma sẵn sàng cho developer implement.',
    prerequisiteIds: ['ux.product.design-principles'],
    resourceIds: ['resource.figma-beginners'],
    defaultResourceId: 'resource.figma-beginners',
    optional: false,
    work: [
      {
        id: 'ux.product.design-system.w1', revision: 1,
        title: 'Xây design system nhỏ (colors, typography, components)',
        minutes: 180,
        acceptance: ['Có token màu và typography nhất quán.', 'Có component library tái sử dụng được.'],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// TRACKS
// ─────────────────────────────────────────────
const tracks: LearningTrack[] = [
  {
    id: 'ux.research',
    pathId: 'ux',
    label: 'UX Research / Interaction Design',
    stageIds: ['ux.research.foundations', 'ux.research.usability'],
    credentialIds: ['credential.google-ux-design'],
    roadmapLinks: [
      { label: 'UX Design Roadmap', url: 'https://roadmap.sh/ux-design' },
    ],
    portfolio: {
      title: 'Báo cáo nghiên cứu người dùng cho một ứng dụng thực tế',
      acceptance: [
        'Có kế hoạch nghiên cứu, kết quả phỏng vấn, affinity map.',
        'Có báo cáo usability test kèm đề xuất cải thiện.',
        'Bằng chứng nghiên cứu thực tế (ghi âm/ảnh với sự đồng ý của đối tượng).',
      ],
    },
  },
  {
    id: 'ux.product',
    pathId: 'ux',
    label: 'UI / Product Design',
    stageIds: ['ux.product.figma-basics', 'ux.product.design-principles', 'ux.product.design-system'],
    credentialIds: ['credential.google-ux-design'],
    roadmapLinks: [
      { label: 'UX Design Roadmap', url: 'https://roadmap.sh/ux-design' },
    ],
    portfolio: {
      title: 'Design system và prototype hi-fi cho ứng dụng mobile/web',
      acceptance: [
        'Có design system (màu, chữ, components).',
        'Prototype ít nhất 5 màn hình với click-through.',
        'File Figma có chú thích developer handoff.',
      ],
    },
  },
];

// ─────────────────────────────────────────────
// PACK EXPORT
// ─────────────────────────────────────────────
export const uxPack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-06.v1',
  pathId: 'ux',
  reviewStatus: 'review',
  stages: [...researchStages, ...productStages],
  resources,
  credentials,
  tracks,
};
