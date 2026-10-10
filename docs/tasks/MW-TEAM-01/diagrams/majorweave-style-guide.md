<!-- diagram-design-profile
name: MajorWeave
slug: majorweave
source-url: none
created: 2026-10-10
updated: 2026-10-10
notes: Source src/styles.css and index.html; task document figures only
-->
# Style Guide — MajorWeave

Profile tường minh cho sơ đồ MW-TEAM-01; không thay CSS, font hoặc thiết kế app. Chỉ dùng skin light.

### Semantic roles

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `paper` | Nền chính | `#f4f1ea` | `#1c1a17` |
| `paper-2` | Nền node | `#fbfaf6` | `#393e53` |
| `ink` | Chữ chính | `#1c1a17` | `#f4f1ea` |
| `ink-strong` | Chữ nhấn tương phản | `#111111` | `#111111` |
| `muted` | Chữ phụ / đường nối | `#736d64` | `#ded9cf` |
| `soft` | Nhãn phụ | `#736d64` | `#949eb2` |
| `rule` | Đường trang trí | `#ded9cf` | `rgba(245,245,245,0.12)` |
| `rule-solid` | Phân cách | `#ded9cf` | `rgba(191,192,192,0.25)` |
| `accent` | Một kết quả chính mỗi hình | `#a74127` | `#f08a59` |
| `accent-tint` | Nền kết quả chính | `#f0e1d7` | `rgba(240,138,89,0.10)` |
| `link` | Link / marker external | `#2e5aa8` | `#739fdf` |

### Series palette

Giữ schema mặc định của skill để validator đọc profile. Không dùng các màu này trong flowchart.

| Token | Light | Dark |
|---|---|---|
| `series-1` | `#7c8f6f` | `#9caf8f` |
| `series-2` | `#5e7a9b` | `#82a0c0` |
| `series-3` | `#b8915a` | `#d3ad7a` |
| `series-4` | `#9c6b50` | `#b88670` |
| `series-5` | `#6e6479` | `#8d8298` |

### Terminal skin

Các token terminal mặc định chỉ giữ cho schema, không dùng trong bộ hình này.

| Token | Hex | Purpose |
|---|---|---|
| `terminal-page` | `#0a0a0a` | Background |
| `terminal-paper` | `#141414` | Node |
| `terminal-bar` | `#1b1b1b` | Bar |
| `terminal-border` | `#2b2b2b` | Border |
| `terminal-ink` | `#f5f5f5` | Text |
| `terminal-muted` | `#9a9a9a` | Secondary |
| `terminal-soft` | `#5c5c5c` | Inactive |
| `terminal-accent` | `#ff5a36` | Accent |
| `terminal-accent-tint` | `rgba(255,90,54,0.12)` | Tint |

## Typography

| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Newsreader, Georgia, serif | 28px | 400 | Tiêu đề hình |
| `node-name` | Be Vietnam Pro (sans) | 12px | 600 | Nhãn node tiếng Việt |
| `sublabel` | monospace | 9px | 400 | SHA / mã kỹ thuật |
| `eyebrow` | monospace | 8px | 500 | Mã luồng |
| `arrow-label` | monospace | 8px | 400 | CÓ / KHÔNG / CHƯA |
| `callout` | Newsreader italic | 14px | 400 | Chú thích nếu cần |

### Font source

Font source: `web`

HTML tải Newsreader và Be Vietnam Pro từ Google Fonts; stack fallback là Georgia/serif và system-ui/sans-serif. Mã kỹ thuật dùng system monospace, khác JetBrains Mono trong app theo quy tắc skill. SVG offline có thể thay font; PNG đã cố định hình với font tải thành công.

## Layout

Flowchart static, doc-wide 1280×720, PNG 2×. Tối đa 9 node / 12 cạnh, một node nhấn; hình thoi cho điều kiện, oval cho bắt đầu/kết quả, chữ nhật cho xử lý. Đường nối ngang/dọc; nhánh điều kiện có nhãn và khoảng hở. Legend ngoài vùng node, dưới hình. Wrapper cuộn ngang cục bộ trên mobile; bản in bỏ min-width để không cắt hình.
