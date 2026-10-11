# Style Guide

## Nguồn thiết kế đang áp dụng

Lấy từ màu của uitplans trong `src/styles.css` và thiết kế giao diện hiện hành. Giữ nền kem, giấy sáng, chữ tối và cam gạch. Đây là guide của bộ sơ đồ này; không sửa guide chung của plugin hoặc tự lưu profile toàn máy.

## Tokens

### Semantic roles

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `paper` | Canvas | `#f4f1ea` | `#1c1a17` |
| `paper-2` | Node surface | `#fbfaf6` | `#292620` |
| `ink` | Primary text | `#1c1a17` | `#f4f1ea` |
| `ink-strong` | Contrast text | `#1c1a17` | `#1c1a17` |
| `muted` | Secondary text and connectors | `#736d64` | `#c1b9ac` |
| `soft` | Supplementary labels | `#736d64` | `#c1b9ac` |
| `rule` | Decorative dividers | `#d2ccbe` | `#736d64` |
| `rule-solid` | Node boundary and lifelines | `#736d64` | `#c1b9ac` |
| `accent` | One focal outcome | `#a74127` | `#eb9573` |
| `accent-tint` | Focal surface | `#f0e1d7` | `#3c2b24` |
| `link` | Optional API emphasis | `#2e5aa8` | `#91b6e6` |

## Typography

| Role | Family | Size for 16 by 9 |
|---|---|---:|
| `title` | Segoe UI with Arial fallback | 40 |
| `node-name` | Segoe UI with Arial fallback | 16 |
| `sublabel` | Segoe UI with Arial fallback | 12 |
| `eyebrow` | Segoe UI with Arial fallback | 12 |
| `arrow-label` | Segoe UI with Arial fallback | 12 |
| `callout` | Segoe UI with Arial fallback | 16 |

### Font source

Font source: `system`

Các nhãn bằng tiếng Việt dùng sans serif dễ đọc ở mức 12px trở lên. Font system được công bố trong từng file; không tuyên bố đây là Be Vietnam Pro chính xác của UI. Không có tải font hoặc asset từ mạng khi mở bộ HTML.

## Ký hiệu và bố cục

Khung 1280 × 720, Activity tối đa 9 node và Sequence tối đa 5 lifeline, 12 thông điệp. Dùng action, initial/final, decision/merge đúng vai trò. Sequence có return nét đứt và event mũi tên rỗng; ALT/LOOP có guard. Các connector vuông góc, góc uốn 8px, nhãn có nền và cách đường nối. Chi tiết dài nằm dưới sơ đồ.
