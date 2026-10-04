// UI review fixtures. The production curriculum/data contract will be decided in phase 3.
// Backend reuses the existing curated content; other paths illustrate the approved scope.
import { paths as existingPaths, faculties, majorProfiles, type LearningPath } from '../catalog';
import { modulesForStack, sourcesForModule, defaultSource, credentialsForStack, type BackendStack } from '../data';

export { faculties, majorProfiles };
export type Source = { id: string; title: string; provider: string; url: string; language: 'vi' | 'en'; cost: string; format: string; note: string };
export type Stage = { id: string; title: string; phase: string; outcome: string; sources: Source[]; tasks: { title: string; minutes: number }[]; optional?: boolean };
export type Track = { id: string; name: string; tools: string; reference?: string };
export type Credential = { id: string; name: string; provider: string; type: string; url: string; note: string };

export const paths: LearningPath[] = [...existingPaths,
  { id: 'ai-engineer', name: 'AI Engineer', category: 'AI', icon: 'brain', summary: 'Xây ứng dụng dùng AI, kết nối dữ liệu và đánh giá kết quả.', tags: ['LLM', 'RAG', 'Applications'], majors: ['ai', 'cs'], relatedMajors: ['software', 'it', 'data', 'is', 'multimedia', 'networks', 'security', 'computer', 'chip', 'ecommerce'], foundations: 'Python, API, dữ liệu, LLM, retrieval, đánh giá và triển khai.', sample: false, roadmaps: [{ label: 'AI Engineer', url: 'https://roadmap.sh/ai-engineer' }] },
  { id: 'business-analyst', name: 'Business Analyst', category: 'BUSINESS', icon: 'briefcase', summary: 'Hiểu nhu cầu, phân tích quy trình và xác định yêu cầu cho giải pháp.', tags: ['Requirements', 'Processes', 'Value'], majors: ['is', 'ecommerce', 'it'], relatedMajors: ['software', 'data', 'cs'], foundations: 'Stakeholder, yêu cầu, quy trình, tiêu chí nghiệm thu và đánh giá giải pháp.', sample: false, roadmaps: [{ label: 'Khung nghề BA · IIBA', url: 'https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/' }] },
];

const track = (id: string, name: string, tools: string, reference?: string): Track => ({ id, name, tools, reference });
const frontend = [track('react', 'React', 'TypeScript · React · Vite', 'https://roadmap.sh/react'), track('angular', 'Angular', 'TypeScript · Angular', 'https://roadmap.sh/angular'), track('vue', 'Vue', 'TypeScript · Vue · Vite', 'https://roadmap.sh/vue')];
const backend = [track('node', 'Node.js', 'JavaScript / TypeScript · Express · SQL', 'https://roadmap.sh/nodejs'), track('python', 'Python', 'FastAPI · SQL', 'https://roadmap.sh/python'), track('java', 'Java', 'Spring Boot · SQL', 'https://roadmap.sh/spring-boot')];
export const tracks: Record<string, Track[]> = {
  backend, frontend,
  fullstack: frontend.flatMap(fe => backend.map(be => track(`${fe.id}-${be.id}`, `${fe.name} + ${be.name}`, `${fe.tools} + ${be.tools}`))),
  mobile: [track('android', 'Android', 'Kotlin · Android'), track('ios', 'iOS', 'Swift · iOS'), track('flutter', 'Flutter', 'Dart · Flutter'), track('react-native', 'React Native', 'TypeScript · React Native')],
  game: [track('unity', 'Unity', 'C# · Unity'), track('unreal', 'Unreal Engine', 'C++ · Blueprint'), track('godot', 'Godot', 'GDScript · Godot')],
  qa: [track('manual', 'Manual QA', 'Test design · Bug reports'), track('playwright', 'Web Automation', 'TypeScript · Playwright'), track('postman', 'API Testing', 'JavaScript · Postman')],
  devops: [track('devops', 'DevOps', 'Linux · CI/CD · Docker · AWS'), track('sre', 'SRE', 'SLI/SLO · Monitoring · Incidents')],
  analyst: [track('spreadsheet', 'SQL + bảng tính', 'SQL · Excel / Sheets'), track('pandas', 'SQL + Python', 'SQL · pandas')],
  bi: [track('powerbi', 'Power BI', 'SQL · Power Query · DAX'), track('tableau', 'Tableau', 'SQL · Tableau')],
  scientist: [track('python', 'Python', 'Statistics · Experiments · Models')],
  engineer: [track('batch', 'Batch pipelines', 'Python · SQL · Orchestration'), track('streaming', 'Streaming', 'Batch foundations · Kafka · Events')],
  ml: [track('classical', 'Machine Learning', 'Python · scikit-learn'), track('cv', 'Computer Vision', 'Python · PyTorch'), track('nlp', 'NLP', 'Python · Transformers')],
  mlops: [track('serving', 'Serving & monitoring', 'API · Docker · Metrics'), track('pipeline', 'Model lifecycle', 'Versioning · Pipelines · CI/CD')],
  network: [track('network', 'Network fundamentals', 'Protocols · Routing · Network labs'), track('automation', 'Network Automation', 'Networking · Python · APIs')],
  security: [track('soc', 'Defensive Security', 'SOC · Logs · Incidents'), track('appsec', 'Web Application Security', 'HTTP · Security labs'), track('devsecops', 'DevSecOps', 'CI/CD · Security controls', 'https://roadmap.sh/devsecops')],
  ux: [track('research', 'UX Research', 'Research · Interaction · Usability'), track('product', 'UI / Product Design', 'Typography · Components · Design system')],
  'ai-engineer': [track('rag', 'LLM / RAG applications', 'Python · Retrieval · Evaluation'), track('agents', 'AI with tools / agents', 'Python · Tools · Evaluation')],
  'business-analyst': [track('software-ba', 'IT / Software BA', 'Requirements · Processes · Acceptance'), track('data-ba', 'Data / BI BA', 'Data requirements · KPI · Value')],
};

export function relation(path: LearningPath, major: string) {
  if (major === 'chip') return ['network', 'backend', 'mobile', 'game', 'devops', 'security', 'ml', 'mlops', 'ai-engineer'].includes(path.id) ? 1 : 0;
  return path.majors.includes(major) ? 2 : path.relatedMajors.includes(major) ? 1 : 0;
}
export const majorLabel = (id: string) => faculties.flatMap(f => f.majors).find(m => m.id === id)?.name || 'Chưa chọn ngành';
export const configKey = (pathId: string, trackId: string) => `${pathId}/${trackId}`;
export const pathById = (id: string) => paths.find(p => p.id === id)!;
export const trackById = (pathId: string, id: string) => tracks[pathId].find(t => t.id === id) || tracks[pathId][0];

const source = (id: string, title: string, provider: string, url: string, note = 'Nguồn mẫu để xem giao diện; mở trang của đơn vị cung cấp để đọc nội dung.'): Source => ({ id, title, provider, url, note, language: 'en', cost: 'Miễn phí', format: 'Bài đọc' });
const mdn = source('mdn-learn', 'Learn web development', 'MDN', 'https://developer.mozilla.org/en-US/docs/Learn_web_development', 'Bài học nền tảng HTML, CSS, JavaScript và các bài thực hành.');
const iiba = source('iiba-ba', 'What is Business Analysis?', 'IIBA', 'https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/', 'Khung nghề, nhu cầu, giải pháp và giá trị cho stakeholder.');
const feSource = (id: string) => ({ react: source('react-learn', 'Quick Start', 'React', 'https://react.dev/learn'), angular: source('angular-learn', 'Learn Angular', 'Angular', 'https://angular.dev/tutorials'), vue: source('vue-guide', 'Vue Guide', 'Vue', 'https://vuejs.org/guide/introduction.html') })[id]!;
const stage = (id: string, title: string, outcome: string, sources: Source[], phase = 'BUILD'): Stage => ({ id, title, phase, outcome, sources, tasks: [{ title: `Tìm hiểu: ${title}`, minutes: 60 }, { title: `Thực hành: ${outcome}`, minutes: 60 }] });

function frontendStages(id: string): Stage[] {
  const name = trackById('frontend', id).name;
  return [
    stage('html', 'HTML · Structure with meaning', 'Tạo cấu trúc trang, form và heading có ngữ nghĩa', [mdn], 'FOUNDATION'),
    stage('css', 'CSS · Layout & responsive', 'Dựng bố cục hoạt động trên điện thoại và máy tính', [mdn], 'FOUNDATION'),
    stage('javascript', 'JavaScript · Make it interactive', 'Dùng DOM, sự kiện, dữ liệu và async/await', [mdn], 'FOUNDATION'),
    stage('git', 'Git & your workspace', 'Lưu thay đổi và làm việc trên nhánh Git', [source('git', 'Pro Git', 'Git', 'https://git-scm.com/book/en/v2')], 'FOUNDATION'),
    stage('typescript', 'TypeScript · Describe your data', 'Khai báo kiểu cho dữ liệu giao diện', [source('ts', 'The TypeScript Handbook', 'TypeScript', 'https://www.typescriptlang.org/docs/handbook/intro.html')], 'FOUNDATION'),
    stage(`${id}-components`, `${name} · Components & routing`, 'Tổ chức giao diện và điều hướng bằng nhánh đã chọn', [feSource(id)]),
    stage(`${id}-state`, `${name} · State & forms`, 'Xử lý form, validation và trạng thái giao diện', [feSource(id)]),
    stage('api', 'Connect to an API', 'Hiển thị loading, dữ liệu rỗng và lỗi khi gọi API', [mdn]),
    stage('accessibility', 'Accessible by design', 'Dùng bàn phím, label và cấu trúc dễ tiếp cận', [source('wai', 'Accessibility tutorials', 'W3C WAI', 'https://www.w3.org/WAI/tutorials/')]),
    stage('test', 'Test the interactions', 'Kiểm tra một luồng nhập liệu và hiển thị lỗi', [source('playwright', 'Writing tests', 'Playwright', 'https://playwright.dev/docs/writing-tests')], 'SHIP'),
    stage('deploy', 'Build & publish', 'Tạo bản build và công bố giao diện để thử', [source('vite', 'Getting Started', 'Vite', 'https://vite.dev/guide/'), feSource(id)], 'SHIP'),
  ];
}

const outlines: Record<string, [string, string][]> = {
  mobile: [['Language & workspace', 'Viết chương trình nhỏ với ngôn ngữ đã chọn'], ['UI & navigation', 'Dựng giao diện và di chuyển giữa các màn hình'], ['Lifecycle & state', 'Giữ trạng thái theo vòng đời ứng dụng'], ['API & local storage', 'Gọi API và lưu dữ liệu trên thiết bị'], ['Testing', 'Kiểm tra dữ liệu lỗi và thao tác người dùng'], ['Build a small app', 'Đóng gói ứng dụng chạy thử theo nền tảng']],
  game: [['Language, OOP & math', 'Thực hành biến, đối tượng và vector trong game'], ['Scenes & input', 'Tạo scene và điều khiển nhân vật'], ['Gameplay & collision', 'Xây cơ chế chơi và xử lý va chạm'], ['Game UI & save', 'Hiển thị trạng thái và lưu tiến độ'], ['Performance & tests', 'Kiểm tra vòng chơi và hiệu năng'], ['Build & play', 'Xuất một game có điều kiện thắng hoặc thua']],
  qa: [['Requirements & test design', 'Phân tích yêu cầu và chọn kỹ thuật kiểm thử'], ['Test cases & data', 'Viết test case cùng dữ liệu hợp lệ và lỗi'], ['HTTP, APIs & SQL', 'Quan sát API và kiểm tra dữ liệu'], ['Execute & report', 'Thực hiện ca kiểm thử và ghi bằng chứng'], ['Branch practice', 'Áp dụng công cụ đúng nhánh đã chọn'], ['Quality report', 'Báo cáo kết quả và lỗi có thể tái hiện']],
  devops: [['Linux & networking', 'Quan sát process, file và kết nối mạng'], ['Git & scripting', 'Tự động hóa một thao tác với shell'], ['CI/CD & containers', 'Chạy test và build container trong pipeline'], ['Cloud deployment', 'Triển khai dịch vụ với cấu hình tách riêng'], ['Monitoring & reliability', 'Theo dõi log, metric và mục tiêu độ tin cậy'], ['Incident & rollback', 'Thử một sự cố và khôi phục phiên bản']],
  analyst: [['Business questions', 'Xác định câu hỏi và dữ liệu cần trả lời'], ['SQL & data quality', 'Truy vấn và kiểm tra chất lượng dữ liệu'], ['Statistics & cleaning', 'Làm sạch dữ liệu và thống kê mô tả'], ['Analysis tools', 'Phân tích bằng bảng tính hoặc pandas'], ['Visualization', 'Chọn biểu đồ phù hợp với câu hỏi'], ['Tell the story', 'Viết kết luận kèm giới hạn của phân tích']],
  bi: [['Reporting needs', 'Xác định người dùng báo cáo và chỉ số'], ['SQL & ETL', 'Chuẩn bị dữ liệu phục vụ dashboard'], ['Data modeling', 'Thiết kế fact, dimension và quan hệ'], ['BI calculations', 'Tạo phép tính theo công cụ đã chọn'], ['Dashboard design', 'Dựng dashboard cho một câu hỏi nghiệp vụ'], ['Validate & hand off', 'Đối chiếu chỉ số và hướng dẫn người dùng']],
  scientist: [['Python & SQL', 'Đọc, xử lý và truy vấn dữ liệu'], ['Math & statistics', 'Áp dụng xác suất và thống kê phù hợp'], ['Explore the data', 'Tìm mẫu dữ liệu và ghi giả thuyết'], ['Experiments & baseline', 'Thiết kế thử nghiệm và mô hình cơ sở'], ['Evaluate & explain', 'Đánh giá kết quả cùng giới hạn'], ['Reproducible project', 'Tổ chức notebook và dữ liệu để chạy lại']],
  engineer: [['Python, SQL & databases', 'Xây nền tảng xử lý và lưu trữ dữ liệu'], ['Modeling & ingestion', 'Thiết kế cấu trúc và lấy dữ liệu đầu vào'], ['ETL / ELT', 'Xây bước chuyển đổi có thể chạy lại'], ['Orchestration', 'Điều phối các bước xử lý dữ liệu'], ['Batch / streaming practice', 'Thực hành pipeline theo nhánh đã chọn'], ['Quality & observability', 'Theo dõi chất lượng, lỗi và vận hành']],
  ml: [['Python, math & statistics', 'Củng cố lập trình và nền tảng toán'], ['Prepare the data', 'Làm sạch và tách train, validation, test'], ['Baseline & metrics', 'Đặt baseline và chọn thước đo'], ['Learn the model', 'Huấn luyện mô hình phù hợp với nhánh'], ['Evaluation & error analysis', 'Phân tích lỗi và tránh rò rỉ dữ liệu'], ['A small model demo', 'Đóng gói demo và mô tả giới hạn']],
  mlops: [['ML & systems foundations', 'Hiểu mô hình, Linux và cách phục vụ'], ['Version data & models', 'Quản lý phiên bản và tracking'], ['Containers & serving', 'Tạo API phục vụ mô hình'], ['Pipelines & CI/CD', 'Tự động hóa kiểm tra và triển khai'], ['Monitoring', 'Theo dõi dữ liệu và chất lượng dự đoán'], ['Rollback & lifecycle', 'Thử khôi phục một phiên bản mô hình']],
  network: [['TCP/IP & subnetting', 'Tính subnet và mô tả đường đi gói tin'], ['Switching & routing', 'Kết nối các mạng trong lab'], ['DNS, DHCP & Linux', 'Cấu hình các dịch vụ mạng nền tảng'], ['Network security', 'Áp dụng kiểm soát truy cập trong lab'], ['Troubleshooting', 'Phân tích và sửa một lỗi kết nối'], ['Configuration / automation', 'Ghi cấu hình hoặc tự động hóa bằng Python']],
  security: [['Networks, Linux & scripting', 'Củng cố nền tảng môi trường lab'], ['Threats & access control', 'Mô hình hóa rủi ro và quyền truy cập'], ['HTTP & application basics', 'Hiểu bề mặt tấn công của ứng dụng'], ['Branch security lab', 'Thực hành lab được phép đúng nhánh'], ['Evidence & remediation', 'Ghi bằng chứng và cách khắc phục'], ['A security report', 'Trình bày phạm vi, kết quả và giới hạn']],
  ux: [['Understand the problem', 'Xác định người dùng và nhu cầu'], ['Research & insights', 'Thu thập thông tin và tìm insight'], ['Information & user flows', 'Tổ chức nội dung và luồng tương tác'], ['Wireframe & prototype', 'Tạo prototype theo câu hỏi cần thử'], ['Usability & accessibility', 'Thử sử dụng và kiểm tra khả năng tiếp cận'], ['Case study & handoff', 'Giải thích quyết định và bàn giao thiết kế']],
  'ai-engineer': [['Python, API & data', 'Củng cố nền tảng xây ứng dụng'], ['LLM & prompts', 'Hiểu đầu vào, đầu ra và giới hạn mô hình'], ['Retrieval & RAG', 'Kết nối dữ liệu và đánh giá truy xuất'], ['Application / tools', 'Xây ứng dụng hoặc tools đúng nhánh'], ['Evaluation & safeguards', 'Kiểm tra câu trả lời, quyền hạn và lỗi'], ['Deploy & observe', 'Theo dõi hành vi và chi phí ứng dụng']],
};

export function stagesFor(pathId: string, trackId: string): Stage[] {
  if (pathId === 'backend') {
    const stack = trackId as BackendStack;
    return modulesForStack(stack).map(m => ({ id: m.id, title: m.title, phase: m.phase, outcome: m.outcome, optional: m.optional, tasks: m.tasks, sources: sourcesForModule(m.id, stack).map(r => ({ ...r, cost: r.cost === 'free' ? 'Miễn phí' : 'Xem nguồn' })).sort((a,b) => Number(b.id === defaultSource(m, stack)) - Number(a.id === defaultSource(m, stack))) }));
  }
  if (pathId === 'frontend') return frontendStages(trackId);
  if (pathId === 'fullstack') {
    const [fe, be] = trackId.split('-');
    const stages = [...frontendStages(fe).map(s => ({ ...s, id: `fe-${s.id}` })), ...stagesFor('backend', be).filter(s => !['git', 'http'].includes(s.id)).map(s => ({ ...s, id: `be-${s.id}` }))];
    return [...stages, stage('integration', 'Connect the whole application', 'Nối giao diện, API, dữ liệu và kiểm thử xuyên suốt', [mdn], 'SHIP')];
  }
  if (pathId === 'business-analyst') {
    const data = trackId === 'data-ba';
    return [
      stage('context', 'Start with the business need', 'Mô tả vấn đề, nhu cầu và giá trị cần tạo', [iiba], 'FOUNDATION'),
      stage('stakeholders', 'Stakeholders & discovery', 'Xác định stakeholder và câu hỏi khảo sát', [iiba], 'FOUNDATION'),
      stage('process', 'Understand the process', 'Mô hình hóa quy trình hiện tại và đề xuất', [iiba]),
      stage('requirements', 'Requirements that can be tested', 'Viết yêu cầu, user story và tiêu chí nghiệm thu', [iiba]),
      stage(data ? 'kpi' : 'software-flows', data ? 'Data needs & KPI' : 'Software flows & exceptions', data ? 'Định nghĩa KPI, dữ liệu và yêu cầu báo cáo' : 'Mô tả luồng chính, luồng thay thế và lỗi', [iiba]),
      stage('traceability', 'Priorities & traceability', 'Liên kết nhu cầu, yêu cầu và các ca kiểm thử', [iiba]),
      stage('validation', 'Validate the solution', 'Đối chiếu giải pháp với tiêu chí và giá trị', [iiba], 'SHIP'),
      stage('portfolio', 'Your first BA case study', 'Bàn giao hồ sơ yêu cầu cho một bài toán cụ thể', [iiba], 'SHIP'),
    ];
  }
  const reference = pathById(pathId).roadmaps[0];
  const src = source(`reference-${pathId}`, reference.label, 'roadmap.sh', reference.url, 'Khung tham khảo tổng quan. Nguồn học chi tiết từng chặng sẽ được nhóm biên soạn sau khi duyệt prototype.');
  return outlines[pathId].map(([title,outcome],i,rows) => stage(`stage-${i}`, title, outcome, [src], i < 2 ? 'FOUNDATION' : i === rows.length - 1 ? 'SHIP' : 'BUILD'));
}

export function credentialsFor(pathId: string, trackId: string): Credential[] {
  if (pathId === 'backend') return credentialsForStack(trackId as BackendStack).map(c => ({ ...c }));
  return [];
}
export const contentNote = (id: string) => id === 'backend' ? 'Nội dung Backend kế thừa bản đã biên soạn.' : ['frontend','business-analyst','fullstack'].includes(id) ? 'Nội dung mẫu để duyệt giao diện; thư viện nguồn và chứng nhận sẽ được bổ sung, rà soát.' : 'Khung chặng mẫu để duyệt giao diện. Nguồn chi tiết và bài học riêng từng nhánh chưa hoàn thiện.';
