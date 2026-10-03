export const catalogCheckedAt = '03/10/2026';
export const faculties = [
  { id: 'se', name: 'Công nghệ Phần mềm', majors: [{ id: 'software', name: 'Kỹ thuật Phần mềm' }, { id: 'multimedia', name: 'Truyền thông Đa phương tiện' }] },
  { id: 'cs', name: 'Khoa học Máy tính', majors: [{ id: 'cs', name: 'Khoa học Máy tính' }, { id: 'ai', name: 'Trí tuệ Nhân tạo' }] },
  { id: 'is', name: 'Hệ thống Thông tin', majors: [{ id: 'is', name: 'Hệ thống Thông tin' }, { id: 'ecommerce', name: 'Thương mại Điện tử' }] },
  { id: 'ise', name: 'Khoa học & Kỹ thuật Thông tin', majors: [{ id: 'it', name: 'Công nghệ Thông tin' }, { id: 'data', name: 'Khoa học Dữ liệu' }] },
  { id: 'nc', name: 'Mạng máy tính & Truyền thông', majors: [{ id: 'networks', name: 'Mạng máy tính & Truyền thông Dữ liệu' }, { id: 'security', name: 'An toàn Thông tin' }] },
  { id: 'ce', name: 'Kỹ thuật Máy tính', majors: [{ id: 'computer', name: 'Kỹ thuật Máy tính' }, { id: 'chip', name: 'Thiết kế Vi mạch' }] },
];
export type LearningPath = {
  id: string; name: string; category: string; icon: string; summary: string;
  tags: string[]; majors: string[]; relatedMajors: string[]; foundations: string; sample: boolean; roadmaps: { label: string; url: string }[];
};
const roadmapLinks: Record<string, { label: string; url: string }[]> = {
  backend: [{ label: 'Backend', url: 'https://roadmap.sh/backend' }],
  frontend: [{ label: 'Frontend', url: 'https://roadmap.sh/frontend' }],
  fullstack: [{ label: 'Full Stack', url: 'https://roadmap.sh/full-stack' }],
  mobile: [{ label: 'Android', url: 'https://roadmap.sh/android' }, { label: 'iOS', url: 'https://roadmap.sh/ios' }],
  game: [{ label: 'Game Developer', url: 'https://roadmap.sh/game-developer' }],
  qa: [{ label: 'QA', url: 'https://roadmap.sh/qa' }],
  devops: [{ label: 'DevOps', url: 'https://roadmap.sh/devops' }],
  analyst: [{ label: 'Data Analyst', url: 'https://roadmap.sh/data-analyst' }],
  bi: [{ label: 'BI Analyst', url: 'https://roadmap.sh/bi-analyst' }],
  scientist: [{ label: 'AI and Data Scientist', url: 'https://roadmap.sh/ai-data-scientist' }],
  engineer: [{ label: 'Data Engineer', url: 'https://roadmap.sh/data-engineer' }],
  ml: [{ label: 'Machine Learning', url: 'https://roadmap.sh/machine-learning' }],
  mlops: [{ label: 'MLOps', url: 'https://roadmap.sh/mlops' }],
  network: [{ label: 'Network Engineer', url: 'https://roadmap.sh/network-engineer' }],
  security: [{ label: 'Cyber Security', url: 'https://roadmap.sh/cyber-security' }],
  ux: [{ label: 'UX Design', url: 'https://roadmap.sh/ux-design' }],
};
export const catalogScopeNote = 'Chỉ giữ các hướng có roadmap tương ứng trong danh mục chính thức của roadmap.sh. Các kỹ năng hoặc nhánh sâu được học bên trong hướng, không tách thành thẻ riêng.';
export const majorCoverageNotes: Record<string, string> = {
  chip: 'Chưa tìm thấy roadmap chuyên biệt về Thiết kế Vi mạch trong danh mục chính thức đã đối chiếu. Bạn vẫn có thể khám phá hướng khác và tham khảo thông tin ngành tại UIT.',
};
const path = (id: string, name: string, category: string, icon: string, summary: string, tags: string[], majors: string[], relatedMajors: string[], foundations: string): LearningPath => ({ id, name, category, icon, summary, tags, majors, relatedMajors, foundations, sample: id === 'backend', roadmaps: roadmapLinks[id] });

// Curated relationships for exploration, inferred from foundational subjects.
// These are not official UIT specializations or an assessment of individual suitability.
export const paths: LearningPath[] = [
  path('backend', 'Backend Developer', 'SOFTWARE', 'server', 'Xây API, xử lý dữ liệu và phát triển phần máy chủ của ứng dụng.', ['API', 'Database', 'Logic'], ['software', 'cs', 'it', 'is'], ['ai', 'data', 'ecommerce', 'networks', 'security', 'computer'], 'Lập trình, OOP, DSA, mạng, OS, nguyên lý hệ thống, Git, HTTP, cơ sở dữ liệu và kiểm thử; chọn Node.js / Express, Python / FastAPI hoặc Java / Spring Boot để làm kế hoạch thực hành.'),
  path('frontend', 'Frontend Developer', 'SOFTWARE', 'layout', 'Xây giao diện web có tương tác, dễ sử dụng và phù hợp nhiều màn hình.', ['Web', 'UI', 'Interaction'], ['software', 'cs', 'it'], ['multimedia', 'is', 'ecommerce'], 'HTML, CSS, JavaScript, khả năng truy cập và giao tiếp với API; thiết kế giao diện chưa thay cho nền tảng lập trình.'),
  path('fullstack', 'Full-stack Developer', 'SOFTWARE', 'server', 'Kết nối giao diện, API và dữ liệu thành một ứng dụng hoàn chỉnh.', ['Frontend', 'Backend', 'Database'], ['software', 'cs', 'it', 'is'], ['ecommerce', 'ai', 'data'], 'Học từng phần frontend và backend trước, sau đó tích hợp và triển khai một dự án nhỏ.'),
  path('mobile', 'Mobile Developer', 'SOFTWARE', 'layout', 'Khám phá hai lộ trình riêng cho Android và iOS; chọn một nền tảng để bắt đầu.', ['Mobile', 'UI', 'API'], ['software', 'it', 'cs', 'is'], ['ecommerce', 'multimedia', 'computer'], 'Lập trình, quản lý trạng thái, vòng đời ứng dụng, lưu dữ liệu và API.'),
  path('game', 'Game Developer', 'SOFTWARE', 'game', 'Lập trình cơ chế chơi, tương tác và các hệ thống của một trò chơi.', ['Game logic', 'Engine', '2D / 3D'], ['software', 'cs'], ['multimedia', 'it', 'ai', 'computer'], 'Lập trình, toán cho game, một game engine và tổ chức dự án; đồ họa game là một hướng riêng.'),
  path('qa', 'QA / Test Automation', 'SOFTWARE', 'shield', 'Thiết kế kiểm thử và tự động hóa việc kiểm tra chất lượng phần mềm.', ['Test cases', 'API tests', 'Automation'], ['software', 'it', 'is'], ['cs', 'ecommerce', 'security'], 'Phân tích yêu cầu, thiết kế ca kiểm thử, API, SQL và lập trình khi làm kiểm thử tự động.'),
  path('devops', 'DevOps / SRE', 'INFRASTRUCTURE', 'cloud', 'Tự động hóa triển khai, quan sát và duy trì độ tin cậy của dịch vụ.', ['CI / CD', 'Linux', 'Observability'], ['software', 'networks', 'it'], ['cs', 'computer', 'security', 'is', 'ai', 'data'], 'Linux, mạng, Git, scripting, container và triển khai; SRE mở rộng thêm vận hành và độ tin cậy.'),
  path('analyst', 'Data Analyst', 'DATA', 'chart', 'Phân tích và trực quan hóa dữ liệu để hỗ trợ quyết định.', ['SQL', 'Dashboard', 'Insights'], ['data', 'is', 'ecommerce', 'it', 'multimedia'], ['cs', 'ai', 'software', 'networks'], 'SQL, bảng tính, thống kê, làm sạch dữ liệu và diễn giải kết quả theo bối cảnh nghiệp vụ.'),
  path('bi', 'BI Analyst', 'DATA', 'chart', 'Phân tích dữ liệu kinh doanh và xây dashboard phục vụ quyết định của tổ chức.', ['Data model', 'BI', 'Reporting'], ['is', 'data', 'it', 'ecommerce'], ['software', 'cs', 'multimedia'], 'SQL, mô hình dữ liệu, ETL và một công cụ BI; chú trọng nhu cầu báo cáo của người dùng.'),
  path('scientist', 'Data Scientist', 'DATA', 'brain', 'Kết hợp thống kê, thử nghiệm và mô hình dự báo để khai thác dữ liệu.', ['Statistics', 'Experiments', 'Models'], ['data', 'cs', 'ai'], ['is', 'it', 'ecommerce', 'multimedia'], 'Python, xác suất thống kê, đại số tuyến tính, đánh giá mô hình và kiến thức của lĩnh vực ứng dụng.'),
  path('engineer', 'Data Engineer', 'DATA', 'database', 'Xây pipeline thu thập, lưu trữ và xử lý dữ liệu đáng tin cậy.', ['Python', 'SQL', 'Pipeline'], ['data', 'is', 'it', 'cs'], ['software', 'ai', 'networks', 'ecommerce'], 'Lập trình, SQL, cơ sở dữ liệu, ETL, chất lượng dữ liệu và nền tảng xử lý dữ liệu.'),
  path('ml', 'Machine Learning', 'AI', 'brain', 'Xây, đánh giá và tích hợp mô hình học máy vào ứng dụng.', ['Python', 'Math', 'Models'], ['ai', 'cs', 'data'], ['it', 'software', 'is', 'computer', 'multimedia'], 'Toán, thống kê, lập trình, xử lý dữ liệu, học máy và đánh giá mô hình; dùng API AI chưa tương đương huấn luyện mô hình.'),
  path('mlops', 'MLOps Engineer', 'AI', 'cloud', 'Đưa mô hình vào vận hành và quản lý dữ liệu, phiên bản, chất lượng mô hình.', ['Model lifecycle', 'Deployment', 'Monitoring'], ['ai', 'data', 'cs'], ['software', 'networks', 'it', 'computer'], 'Học máy cùng Linux, container, CI / CD, phục vụ mô hình và quan sát; là bước mở rộng sau nền tảng ML.'),
  path('network', 'Network Engineer', 'INFRASTRUCTURE', 'cloud', 'Thiết kế, cấu hình và xử lý sự cố kết nối, routing và dịch vụ mạng.', ['TCP / IP', 'Routing', 'Troubleshooting'], ['networks', 'it', 'computer'], ['security', 'cs', 'software'], 'Mạng máy tính, giao thức, Linux, cấu hình thiết bị và thực hành mô phỏng mạng.'),
  path('security', 'Cyber Security', 'SECURITY', 'shield', 'Xây nền tảng bảo vệ hệ thống trước khi chọn chuyên sâu phòng thủ hoặc kiểm thử.', ['Systems', 'Threats', 'Security labs'], ['security', 'networks'], ['cs', 'it', 'software', 'computer', 'is'], 'Mạng, hệ điều hành, lập trình và nguyên tắc an toàn thông tin; thực hành trong môi trường được phép.'),
  path('ux', 'UX Design', 'DESIGN', 'pen', 'Nghiên cứu người dùng, thiết kế luồng và giao diện dễ sử dụng.', ['Research', 'Prototype', 'Usability'], ['multimedia'], ['software', 'is', 'ecommerce', 'it'], 'Nghiên cứu người dùng, bố cục, tương tác, prototype và đánh giá khả năng sử dụng.'),
];

const uit = (slug: string) => `https://tuyensinh.uit.edu.vn/nganh-dao-tao/${slug}`;
export const majorProfiles: Record<string, { foundation: string; sourceUrl: string }> = {
  software: { foundation: 'Vòng đời phần mềm, lập trình, yêu cầu, thiết kế, kiểm thử và phát triển game.', sourceUrl: uit('nganh-ky-thuat-phan-mem') },
  multimedia: { foundation: 'Truyền thông, thiết kế, trải nghiệm số, dữ liệu truyền thông và công nghệ marketing.', sourceUrl: uit('nganh-truyen-thong-da-phuong-tien') },
  cs: { foundation: 'Toán, cấu trúc dữ liệu, giải thuật, hệ thống và các hướng AI / tính toán.', sourceUrl: uit('nganh-khoa-hoc-may-tinh') },
  ai: { foundation: 'Toán, lập trình, học máy, học sâu và các ứng dụng trí tuệ nhân tạo.', sourceUrl: uit('nganh-tri-tue-nhan-tao') },
  is: { foundation: 'Dữ liệu, hệ thống thông tin, quy trình nghiệp vụ và giải pháp cho tổ chức.', sourceUrl: uit('nganh-he-thong-thong-tin') },
  ecommerce: { foundation: 'Thương mại, nền tảng số, marketing, dữ liệu và trải nghiệm khách hàng.', sourceUrl: uit('nganh-thuong-mai-dien-tu') },
  it: { foundation: 'Nền tảng CNTT rộng: phần mềm, dữ liệu, hệ thống, hạ tầng và ứng dụng công nghệ.', sourceUrl: uit('nganh-cong-nghe-thong-tin') },
  data: { foundation: 'Thống kê, lập trình, xử lý dữ liệu, mô hình hóa, học máy và trực quan hóa.', sourceUrl: uit('nganh-khoa-hoc-du-lieu') },
  networks: { foundation: 'Mạng máy tính, giao thức, dịch vụ mạng, hệ thống và hạ tầng.', sourceUrl: uit('nganh-mang-may-tinh-truyen-thong-du-lieu') },
  security: { foundation: 'Mạng, hệ thống, bảo vệ dữ liệu, ứng dụng và quản trị an toàn thông tin.', sourceUrl: uit('nganh-an-toan-thong-tin') },
  computer: { foundation: 'Kiến trúc máy tính, điện tử số, hệ thống nhúng, giao tiếp và phần cứng.', sourceUrl: uit('nganh-ky-thuat-may-tinh') },
  chip: { foundation: 'Mạch điện, logic số, thiết kế, kiểm chứng và triển khai vật lý vi mạch.', sourceUrl: uit('nganh-thiet-ke-vi-mach') },
};
export const majorPaths = (id: string) => ({ primary: paths.filter(p => p.majors.includes(id)), related: paths.filter(p => p.relatedMajors.includes(id)) });
export const relationRank = (p: LearningPath, major: string) => p.majors.includes(major) ? 2 : p.relatedMajors.includes(major) ? 1 : 0;
