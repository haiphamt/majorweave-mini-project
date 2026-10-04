# Kiểm thử và AI log — MW-SETUP-04

**Ngày:** 04/10/2026. **Môi trường:** Windows, Node runtime sẵn có, Chrome, Vite local `http://127.0.0.1:5173`. **Baseline:** `601a4ec`. **Bản sau:** nội dung code trong commit bàn giao task này. Không xóa/ghi đè browser storage để chuẩn bị test.

## Kết quả đã chạy

| Mã | Mục tiêu và bước | Kết quả thực | Trạng thái / minh chứng |
|---|---|---|---|
| TC-01 | Ghi DOM `.app-shell` năm route trước sửa; reload và mở lại sau sửa; so nội dung HTML | Cả Explore/Path detail/My roadmap/My plan/Profile giống baseline ở cùng trạng thái | Pass; [so sánh](evidence/page-comparison.json), [ảnh](evidence/sidebar.png) |
| TC-02 | Bundle registry/mẫu Backend, kiểm tra ID, tiên quyết, nguồn mặc định, legacy maps | 1 pack review; 3 Backend × 15 chặng; 35 chặng, 40 nguồn, 8 mục tiêu; không mất thư viện | Pass; `scripts/check-project.mjs` và check-example |
| TC-03 | Đọc luật/quy trình/template/PR và trạng thái bước 4 | Có phạm vi file, mẫu story/flow/test/AI log; chưa gắn tên/giao task cho năm bạn | Pass qua review file; chưa xác minh tự nạp luật trên từng máy Antigravity |
| TC-04 | Chạy kiểm tra ranh giới/module/data trên bản cuối | 21 module, không lỗi tham chiếu/tiên quyết/vòng import; storage/CSS đúng phạm vi kiểm tra | Pass; `node scripts/check-project.mjs` |
| TC-05 | Chạy prebuild, TypeScript `-b` và Vite `build` | Sinh catalog 12 ngành/16 hướng và 28 luồng prototype; build cả entry thành công | Pass; môi trường này không có npm executable, chạy trực tiếp ba bước tương ứng script build qua Node |
| TC-06 | Mock storage chỉ trong process test Node; ghi thành công rồi ném lỗi quota | Đúng key v1 và JSON; trả true khi ghi, false khi ném lỗi, input không đổi | Pass; check-project; không thao tác dữ liệu trình duyệt thật |
| TC-07 | Chrome: mở tab nguồn Java, chứng nhận, Java foundations, đóng drawer | 22 thẻ nguồn, 6 chứng nhận, dialog mở/đóng; không có lỗi console từ lần reload kiểm tra cuối | Pass; file so sánh và thao tác được quan sát |

Lỗi dev server xuất hiện trong lúc chuyển file đã được sửa trước lần reload cuối; không gọi log cả phiên là “không có lỗi”. Không thay đổi CSS/HTML thiết kế. Chưa chạy lại toàn bộ bộ test v1 hoặc ma trận mobile; so DOM năm trang và kiểm tra các thành phần được tách là phạm vi kiểm thử bước này.

**Chưa chạy/chưa tích hợp:** planner v2, IndexedDB, migration/import, nhiều plan/lịch sử v2, toàn bộ hướng mới. Check/build xanh không chứng minh các phần đó đã xong. Workflow GitHub được thêm, kết quả run trên GitHub cần đọc sau push; chưa bật branch protection.

## BUG-MW-SETUP-04-01 — Import chưa đổi đúng sau chuyển file

- TypeScript lần đầu báo `TS2307` ở `src/content/paths/backend.ts` (`../../src/data`) và import StudyActivity của Prototype 02. Dev server cũng báo lỗi reload trong giai đoạn file đang chuyển.
- Nguyên nhân: phép thay chuỗi đầu tiên chỉ đổi một trong hai import data; StudyActivity được chuyển mà consumer lịch sử chưa đổi đường dẫn.
- Sửa: đổi import type BackendStack về `../../data`; đặt StudyActivity ở components dùng chung và sửa import Profile/Prototype 02.
- Kiểm tra lại: TypeScript/build pass; năm trang DOM giống baseline; drawer mở/đóng; không lỗi console sau reload cuối.

## AI Development Log

| Vòng | Công cụ | Mục tiêu / prompt đã nhận | Output / review | Điều chỉnh / kiểm tra |
|---|---|---|---|---|
| 1 | Codex | “tiếp tục đi” sau kiến trúc; giữ sidebar, guest trước, không Notion, kiểm tra từng phần | Đọc repo/luật/kiến trúc; chọn tách module giữ JSX/CSS | Không dựng lại layout hoặc fake backend |
| 2 | Codex | Dựng bộ khung theo hợp đồng và chuẩn Antigravity | Tách qua cấu trúc TypeScript; compiler phát hiện import lỗi thực tế | Sửa nguồn lỗi, chạy build lại; giữ contracts một bản và docs re-export |
| 3 | Codex | Chuẩn bị review và bằng chứng | Thêm luật/templates, check/CI; kiểm tra DOM năm trang và UI liên quan | Ghi rõ v1/v2, test thật/chưa chạy; dừng trước giao việc |

Đối chiếu với tài liệu chính thức Antigravity để dùng AGENTS.md; không áp dụng một skill thiết kế để thay UI. Không thực hiện so sánh hai công cụ AI trong task này; nhóm cần chọn một bài nhỏ ở task riêng theo yêu cầu môn.
