import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft, Check, Plus, BookOpen, Server, Search, GraduationCap, Bookmark, Layout, Layers, PenTool, ExternalLink } from 'lucide-react';
import { checkedAt, stacks, modulesForStack, sourcesForModule } from '../../data';
import { hoursText, stackPatch } from '../../state';
import { StackChooser } from '../../components/StackChooser';
import { useApp } from '../../app/context';
import { Badge, External, Dialog } from '../../components/ui';
import { ResourceCard } from './ResourceCard';

import { backendPack, legacyStageMap } from '../../content/paths/backend';
import { frontendPack } from '../../content/paths/frontend';
import { fullstackPack } from '../../content/paths/fullstack';
import { uxPack } from '../../content/paths/ux';
import { resolveTrackContent } from '../../domain/content';
import type { LearningStage } from '../../domain/contracts';

const allPacks = [backendPack, frontendPack, fullstackPack, uxPack];

type PathInfo = {
  id: string;
  title: string;
  italicTitle: string;
  eyebrow: string;
  description: string;
  stampWord: string;
  icon: typeof Server;
};

const pathMeta: Record<string, PathInfo> = {
  backend: {
    id: 'backend',
    title: 'Backend',
    italicTitle: 'Developer.',
    eyebrow: 'BUILD THE THINGS BEHIND THE SCENES',
    description: 'Xây API, xử lý dữ liệu và đưa một ứng dụng nhỏ lên mạng.',
    stampWord: 'useful.',
    icon: Server
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend',
    italicTitle: 'Developer.',
    eyebrow: 'BRING INTERFACES TO LIFE',
    description: 'Xây dựng giao diện web phản hồi nhanh, mượt mà và trực quan trên mọi màn hình.',
    stampWord: 'interactive.',
    icon: Layout
  },
  fullstack: {
    id: 'fullstack',
    title: 'Full-stack',
    italicTitle: 'Developer.',
    eyebrow: 'CONNECT INTERFACES & SERVERS',
    description: 'Làm chủ toàn bộ ứng dụng từ giao diện người dùng, API mạng đến cơ sở dữ liệu và triển khai.',
    stampWord: 'complete.',
    icon: Layers
  },
  ux: {
    id: 'ux',
    title: 'UX',
    italicTitle: 'Design.',
    eyebrow: 'DESIGN FOR HUMAN EXPERIENCES',
    description: 'Nghiên cứu nhu cầu người dùng, thiết kế luồng thao tác và tạo bản mẫu giao diện trực quan.',
    stampWord: 'empathy.',
    icon: PenTool
  }
};

export function PathDetail() {
  const { state, update, openModule, toast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const pathId = searchParams.get('id') || 'backend';
  const info = pathMeta[pathId] || pathMeta.backend;
  const IconComponent = info.icon;

  // Quản lý track đang chọn cho từng hướng
  const [selectedBackendTrack, setSelectedBackendTrack] = useState<string>(`backend.${state.stack}`);
  const [selectedFrontendTrack, setSelectedFrontendTrack] = useState<string>('frontend.react');
  const [selectedFullstackTrack, setSelectedFullstackTrack] = useState<string>('fullstack.react-node');
  const [selectedUxTrack, setSelectedUxTrack] = useState<string>('ux.research');

  const currentTrackId = useMemo(() => {
    if (pathId === 'backend') return `backend.${state.stack}`;
    if (pathId === 'frontend') return selectedFrontendTrack;
    if (pathId === 'fullstack') return selectedFullstackTrack;
    if (pathId === 'ux') return selectedUxTrack;
    return `backend.${state.stack}`;
  }, [pathId, state.stack, selectedFrontendTrack, selectedFullstackTrack, selectedUxTrack]);

  // Giải quyết nội dung từ Content Resolver
  const resolvedResult = useMemo(() => {
    return resolveTrackContent(allPacks, currentTrackId);
  }, [currentTrackId]);

  const resolved = resolvedResult.ok ? resolvedResult.value : null;

  const [tab, setTab] = useState<'roadmap' | 'resources' | 'credentials'>('roadmap');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [inspectStage, setInspectStage] = useState<LearningStage | null>(null);

  // Danh sách tài nguyên đã lọc
  const filteredResources = useMemo(() => {
    if (!resolved) return [];
    return resolved.resources.filter(r => {
      const matchQuery = `${r.title} ${r.provider} ${r.accessNote}`.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === 'all'
        || (filter === 'free' && r.cost === 'free')
        || (filter === 'vi' && r.language === 'vi')
        || (filter === 'en' && r.language === 'en');
      return matchQuery && matchFilter;
    });
  }, [resolved, query, filter]);

  // Chuyển hướng khác
  const switchPath = (newPathId: string) => {
    setSearchParams({ id: newPathId });
    setTab('roadmap');
    setQuery('');
    setFilter('all');
  };

  const currentTrackLabel = resolved?.track.label || '';
  const totalStages = resolved?.stages.length || 0;
  const totalResources = resolved?.resources.length || 0;
  const totalCredentials = resolved?.credentials.length || 0;

  return (
    <div className="page path-page">
      <Link className="back-link" to="/explore">
        <ArrowLeft size={14} /> Explore paths
      </Link>

      <div className="path-heading">
        <div>
          <div className="eyebrow">{info.eyebrow}</div>
          <h1>{info.title} <em>{info.italicTitle}</em></h1>
          <p>{info.description}<br />Lộ trình đang xem: <strong>{currentTrackLabel}</strong></p>
        </div>
        <div className="path-stamp">
          <IconComponent size={36} strokeWidth={1.1} />
          <span>BUILD<br />SOMETHING<br /><em>{info.stampWord}</em></span>
        </div>
      </div>

      {/* Điều hướng nhanh giữa 4 hướng thuộc phạm vi */}
      <div className="preference-strip" style={{ marginBottom: 20 }}>
        <label>
          Hướng nghề nghiệp
          <select value={pathId} onChange={e => switchPath(e.target.value)}>
            <option value="backend">Backend Developer (3 nhánh)</option>
            <option value="frontend">Frontend Developer (3 nhánh)</option>
            <option value="fullstack">Full-stack Developer (9 cấu hình)</option>
            <option value="ux">UX Design (2 nhánh)</option>
          </select>
        </label>
        <span className="subtle-copy">Bạn có thể chuyển đổi linh hoạt để xem cấu trúc lộ trình và nguồn học.</span>
      </div>

      {/* Bộ chọn nhánh theo từng hướng */}
      {pathId === 'backend' && (
        <>
          <StackChooser
            value={state.stack}
            onChange={stack => {
              update(stackPatch(state, stack));
              setSelectedBackendTrack(`backend.${stack}`);
              toast(`Đã chọn ${stacks[stack].name} cho roadmap`);
            }}
          />
          {state.tasks.length > 0 && state.planMeta?.stack !== state.stack && (
            <div className="soft-note stack-plan-note">
              Roadmap đang chọn {stacks[state.stack].name}. My Plan vẫn giữ kế hoạch {stacks[state.planMeta?.stack || 'node'].name}; chỉ đổi khi bạn xác nhận tạo lại tại My Roadmap.
            </div>
          )}
        </>
      )}

      {pathId === 'frontend' && (
        <section className="stack-chooser" aria-label="Chọn nền tảng Frontend">
          <div className="stack-intro">
            <span className="eyebrow">CHỌN NỀN TẢNG KHỞI ĐẦU</span>
            <h2>Chọn Framework Frontend</h2>
            <p>Mỗi framework mang đến trải nghiệm phát triển và hệ sinh thái thư viện riêng.</p>
          </div>
          <div className="stack-options">
            {[
              { id: 'frontend.react', name: 'React / TypeScript', desc: 'Thư viện phổ biến nhất, hệ sinh thái phong phú' },
              { id: 'frontend.angular', name: 'Angular / TypeScript', desc: 'Khung kiến trúc toàn diện cho ứng dụng doanh nghiệp' },
              { id: 'frontend.vue', name: 'Vue 3 / Pinia', desc: 'Cú pháp nhẹ nhàng, Composition API trực quan' }
            ].map(opt => (
              <button
                key={opt.id}
                className={`stack-option ${selectedFrontendTrack === opt.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedFrontendTrack(opt.id);
                  toast(`Đã chuyển sang lộ trình ${opt.name}`);
                }}
              >
                <strong>{opt.name}</strong>
                <small>{opt.desc}</small>
                {selectedFrontendTrack === opt.id && <span className="stack-indicator">✓</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {pathId === 'ux' && (
        <section className="stack-chooser" aria-label="Chọn nhánh UX Design">
          <div className="stack-intro">
            <span className="eyebrow">CHỌN HƯỚNG CHUYÊN MÔN</span>
            <h2>Chọn Nhánh UX Design</h2>
            <p>Nghiên cứu hành vi người dùng hoặc thiết kế giao diện tương tác và hệ thống thiết kế.</p>
          </div>
          <div className="stack-options" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {[
              { id: 'ux.research', name: 'UX Research & Interaction', desc: 'Tập trung vào phỏng vấn, kiểm thử tính khả dụng và luồng trải nghiệm' },
              { id: 'ux.product', name: 'UI & Product Design', desc: 'Tập trung vào thẩm mỹ thị giác, Figma Prototyping và Design Systems' }
            ].map(opt => (
              <button
                key={opt.id}
                className={`stack-option ${selectedUxTrack === opt.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedUxTrack(opt.id);
                  toast(`Đã chuyển sang lộ trình ${opt.name}`);
                }}
              >
                <strong>{opt.name}</strong>
                <small>{opt.desc}</small>
                {selectedUxTrack === opt.id && <span className="stack-indicator">✓</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {pathId === 'fullstack' && (
        <section className="stack-chooser" aria-label="Chọn cặp Full-stack">
          <div className="stack-intro">
            <span className="eyebrow">KẾT HỢP FRONTEND × BACKEND</span>
            <h2>Chọn Cấu hình Full-stack (3 FE × 3 BE)</h2>
            <p>Ghép nối các chặng học của Frontend và Backend kèm các chặng tích hợp mạng và triển khai.</p>
          </div>
          <div className="stack-options">
            {[
              { id: 'fullstack.react-node', name: 'React + Node.js', desc: 'Cặp phổ biến nhất với ngôn ngữ JavaScript/TypeScript xuyên suốt' },
              { id: 'fullstack.react-python', name: 'React + Python', desc: 'Giao diện hiện đại kết hợp backend FastAPI nhanh chóng' },
              { id: 'fullstack.react-java', name: 'React + Java', desc: 'Giao diện linh hoạt kết hợp Spring Boot chuẩn doanh nghiệp' },
              { id: 'fullstack.angular-node', name: 'Angular + Node.js', desc: 'Cấu trúc định kiểu chặt chẽ từ máy khách đến máy chủ' },
              { id: 'fullstack.angular-python', name: 'Angular + Python', desc: 'Hệ thống doanh nghiệp kết hợp xử lý dữ liệu mạnh mẽ' },
              { id: 'fullstack.angular-java', name: 'Angular + Java', desc: 'Kiến trúc quy chuẩn quy mô lớn tiêu chuẩn tập đoàn' },
              { id: 'fullstack.vue-node', name: 'Vue + Node.js', desc: 'Quy trình phát triển nhanh, phản hồi linh hoạt' },
              { id: 'fullstack.vue-python', name: 'Vue + Python', desc: 'Giao diện trực quan kết hợp API Python tinh gọn' },
              { id: 'fullstack.vue-java', name: 'Vue + Java', desc: 'Phát triển giao diện mượt mà trên nền tảng Java vững chắc' }
            ].map(opt => (
              <button
                key={opt.id}
                className={`stack-option ${selectedFullstackTrack === opt.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedFullstackTrack(opt.id);
                  toast(`Đã chọn cấu hình ${opt.name}`);
                }}
              >
                <strong>{opt.name}</strong>
                <small>{opt.desc}</small>
                {selectedFullstackTrack === opt.id && <span className="stack-indicator">✓</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Roadmap tham khảo chính thức */}
      {resolved && resolved.track.roadmapLinks.length > 0 && (
        <section className="reference-roadmaps" aria-label="Roadmap tham khảo">
          <div>
            <span className="eyebrow">THE BIGGER PICTURE</span>
            <h2>Roadmap tham khảo</h2>
            <p>Mở bản đồ tổng quan chính thức trên roadmap.sh ở tab mới.</p>
          </div>
          <div className="reference-roadmap-links">
            {resolved.track.roadmapLinks.map(link => (
              <External key={link.url} href={link.url} className="secondary-button">
                {link.label} <ExternalLink size={14} style={{ marginLeft: 6 }} />
              </External>
            ))}
          </div>
        </section>
      )}

      {/* Mục tiêu Portfolio của track */}
      {resolved && (
        <div className="curriculum-note">
          <strong>Mục tiêu Dự án Đầu ra (Portfolio Capstone): {resolved.track.portfolio.title}</strong>
          <p>
            Tiêu chí nghiệm thu:<br />
            {resolved.track.portfolio.acceptance.map((acc, idx) => (
              <span key={idx} style={{ display: 'block', marginTop: 4 }}>
                • {acc}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Bộ 3 Tabs: Roadmap / Nguồn học / Chứng nhận */}
      <div className="tabs" role="tablist" aria-label="Thông tin lộ trình">
        <button
          role="tab"
          id="tab-roadmap"
          aria-selected={tab === 'roadmap'}
          className={tab === 'roadmap' ? 'active' : ''}
          onClick={() => setTab('roadmap')}
        >
          Roadmap <span>{totalStages}</span>
        </button>
        <button
          role="tab"
          id="tab-resources"
          aria-selected={tab === 'resources'}
          className={tab === 'resources' ? 'active' : ''}
          onClick={() => setTab('resources')}
        >
          Nguồn học <span>{totalResources}</span>
        </button>
        <button
          role="tab"
          id="tab-credentials"
          aria-selected={tab === 'credentials'}
          className={tab === 'credentials' ? 'active' : ''}
          onClick={() => setTab('credentials')}
        >
          Chứng nhận <span>{totalCredentials}</span>
        </button>
      </div>

      <div role="tabpanel" id="path-information">
        {/* TAB 1: ROADMAP TIMELINE */}
        {tab === 'roadmap' && resolved && (
          <div className="roadmap-layout">
            <div className="module-timeline">
              {resolved.stages.map((stage, index) => {
                const totalMinutes = stage.work.reduce((sum, w) => sum + w.minutes, 0);
                const legacyModuleId = pathId === 'backend' ? Object.entries(legacyStageMap[state.stack]).find(([, id]) => id === stage.id)?.[0] : undefined;
                const isKnown = !!legacyModuleId && state.known.includes(legacyModuleId);
                return (
                  <button
                    className={`module-node ${isKnown ? 'known' : ''}`}
                    key={stage.id}
                    onClick={() => {
                      if (legacyModuleId) {
                        openModule(legacyModuleId);
                      } else {
                        setInspectStage(stage);
                      }
                    }}
                  >
                    <span className="node-number">
                      {isKnown ? <Check size={17} /> : String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="node-content">
                      <div className="node-title">
                        <h3>{stage.title}</h3>
                        <Badge tone={stage.phase === 'foundation' ? 'green-badge' : 'rust-badge'}>
                          {stage.phase === 'foundation' ? 'Nền tảng' : stage.phase === 'build' ? 'Xây dựng' : 'Triển khai'}
                        </Badge>
                        {stage.optional && <Badge>Tự chọn</Badge>}
                      </div>
                      <p>{stage.description}</p>
                      <div className="node-meta">
                        <span>{stage.phase.toUpperCase()}</span>
                        <span>{stage.resourceIds.length} nguồn học</span>
                        <span>{stage.work.length} bài thực hành ({hoursText(totalMinutes)})</span>
                      </div>
                    </div>
                    <ArrowUpRight size={18} />
                  </button>
                );
              })}
            </div>

            <aside className="roadmap-aside">
              <span className="eyebrow">OVERVIEW</span>
              <h2>{resolved.track.label}</h2>
              <p>Lộ trình thực hành tuần tự từng bước, từ nền tảng cốt lõi đến dự án hoàn chỉnh.</p>
              <div className="aside-stats">
                <div>
                  <span>{resolved.stages.length}</span>
                  <small>chặng học</small>
                </div>
                <div>
                  <span>{resolved.resources.length}</span>
                  <small>tài liệu & khóa học</small>
                </div>
              </div>
              {pathId === 'backend' ? (
                <Link className="primary-button" to="/roadmap">
                  Tùy chỉnh roadmap <ArrowRight size={17} />
                </Link>
              ) : (
                <div className="soft-note" style={{ margin: '14px 0', fontSize: 11 }}>
                  Lộ trình chi tiết sẵn sàng để sinh viên tự học và thực hành. Hành trình My Roadmap hiện ưu tiên nhánh Backend đã chọn.
                </div>
              )}
              <p className="aside-tip">
                <BookOpen size={15} /> Bấm vào từng chặng để xem mục tiêu đầu ra và các bài thực hành có đo đạc thời lượng.
              </p>
            </aside>
          </div>
        )}

        {/* TAB 2: NGUỒN HỌC */}
        {tab === 'resources' && resolved && (
          <>
            <div className="resource-toolbar">
              <label className="search-field">
                <Search size={17} />
                <input
                  aria-label="Tìm nguồn học"
                  placeholder="Tìm khóa học, chủ đề, nhà cung cấp..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </label>
              <select
                aria-label="Lọc thư viện"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">Tất cả nguồn học</option>
                <option value="free">Miễn phí</option>
                <option value="vi">Tiếng Việt</option>
                <option value="en">Tiếng Anh</option>
              </select>
            </div>

            <p className="catalog-caption">
              {filteredResources.length} tài nguyên học tập đã được đối chiếu thông tin chính thức.
            </p>

            <div className="resource-grid">
              {filteredResources.map(r => (
                <article key={r.id} className="resource-card">
                  <div className="resource-heading">
                    <div>
                      <span className="eyebrow">{r.provider}</span>
                      <h4>
                        <External href={r.url}>{r.title}</External>
                      </h4>
                    </div>
                  </div>
                  <p>{r.accessNote}</p>
                  <div className="resource-meta">
                    <span>{r.cost === 'free' ? 'Miễn phí' : r.cost === 'mixed' ? 'Có bản miễn phí' : 'Trả phí'}</span>
                    <span>{r.language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}</span>
                    <span>{r.format}</span>
                    <span>Trình độ: {r.level}</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="empty-inline">
                Chưa có nguồn học khớp với tìm kiếm.
                <button className="text-link" onClick={() => { setFilter('all'); setQuery(''); }}>
                  Xóa bộ lọc <ArrowRight size={15} />
                </button>
              </div>
            )}
            <p className="source-note">Liên kết mở trực tiếp trên website của đơn vị cung cấp.</p>
          </>
        )}

        {/* TAB 3: CHỨNG NHẬN */}
        {tab === 'credentials' && resolved && (
          <>
            <div className="credentials-intro">
              <GraduationCap size={25} />
              <div>
                <h3>Mục tiêu Chứng nhận Nghề nghiệp</h3>
                <p>Chứng nhận uy tín từ các đơn vị đào tạo hàng đầu (Coursera, freeCodeCamp, Meta, Google, University of Helsinki) giúp khẳng định năng lực thực tế.</p>
              </div>
            </div>

            <div className="credential-grid">
              {resolved.credentials.map(c => {
                const isSaved = state.credentials.includes(c.id);
                return (
                  <article className="credential-card" key={c.id}>
                    <div className="card-top">
                      <span className="eyebrow">{c.provider}</span>
                      <button
                        className={`icon-button ${isSaved ? 'bookmarked' : ''}`}
                        aria-label={`${isSaved ? 'Bỏ lưu' : 'Lưu'} ${c.name}`}
                        onClick={() => {
                          update({
                            credentials: isSaved
                              ? state.credentials.filter(id => id !== c.id)
                              : [...state.credentials, c.id]
                          });
                          toast(isSaved ? 'Đã bỏ mục tiêu chứng nhận' : 'Đã lưu mục tiêu chứng nhận');
                        }}
                      >
                        <Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <h3>{c.name}</h3>
                    <div className="tag-list">
                      <span>{c.kind.replace('_', ' ')}</span>
                      <span>{c.cost === 'free' ? 'Miễn phí' : 'Có phí'}</span>
                    </div>
                    <p><strong>Yêu cầu:</strong> {c.requirements}</p>
                    <div className="credential-bottom">
                      <Badge>{c.prerequisites || 'Tự do đăng ký'}</Badge>
                      <External className="text-link" href={c.url}>
                        Xem điều kiện
                      </External>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="source-note">Kiểm tra thông tin chi tiết và điều kiện tham gia tại website chính thức trước khi đăng ký.</p>
          </>
        )}
      </div>

      {/* Dialog xem chi tiết chặng khi bấm ở Roadmap */}
      {inspectStage && (
        <Dialog
          title={inspectStage.title}
          eyebrow={`${inspectStage.phase.toUpperCase()} · ${hoursText(inspectStage.work.reduce((s, w) => s + w.minutes, 0))}`}
          onClose={() => setInspectStage(null)}
          className="module-drawer"
        >
          <div className="dialog-body">
            <p className="lead-description">{inspectStage.description}</p>
            <div className="outcome-box">
              <div>
                <span className="eyebrow">SAU CHẶNG NÀY</span>
                <p>{inspectStage.outcome}</p>
              </div>
            </div>
            <h3 className="practice-heading">Bài tập thực hành ({inspectStage.work.length} bài)</h3>
            <ul className="practice-list">
              {inspectStage.work.map(w => (
                <li key={w.id} style={{ display: 'block', padding: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{w.title}</strong>
                    <small>{hoursText(w.minutes)}</small>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>
                    Tiêu chí nghiệm thu:<br />
                    {w.acceptance.map((acc, aIdx) => (
                      <span key={aIdx} style={{ display: 'block', marginLeft: 8 }}>• {acc}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div className="dialog-actions">
              <button className="primary-button" onClick={() => setInspectStage(null)}>
                Đóng
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
