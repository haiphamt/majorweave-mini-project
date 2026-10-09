# Kiểm thử và AI log — MW-TEAM-02

## Cập nhật 08/10/2026 — My Roadmap dùng Context v2

- Đối chiếu hai file leader gửi: `TIN_NHAN_GUI_DINH_CONTEXT_V2.md` và `HANDOFF_CONTEXT_V2.md`. Context đã ghép trong branch; My Plan v1 là dependency đã được ghi rõ, không chép plan sang v1 để né tích hợp.
- Base SHA: `5ff66ba66ee094c5af388885a109578bf1c96ace`; kết quả áp dụng cho working tree mới, hash ở [manifest v2](evidence/v2-manifest.json), chưa commit/push.
- `node scripts/tasks/MW-TEAM-02.mjs --ui`: **140 Pass, 0 Fail** (123 domain/content + 17 UI). Playwright từ runtime có sẵn; Edge headless, context cô lập; desktop 1440×1000 và mobile 390×844.
- UI: goal/giờ/all-known lỗi; ngày Monday confirm/cancel/Escape/focus; hai plan cùng track độc lập; preview không ghi; cancel giữ plan; confirm giữ history; prerequisite/bỏ/thêm chặng; nguồn/known lưu draft và reload; từng Android/iOS/Flutter/RN/Unity/Unreal/Godot chọn–nguồn–tạo–reload; mobile/keyboard; lỗi lưu giữ candidate/retry đúng một plan; conflict hai tab và xác nhận bỏ candidate.
- `npm run check`: Pass, gồm 16 context checks. `npm run build`: Pass.
- Theo yêu cầu typography tiếp theo của Định: tiêu đề chặng 15–16px/600, chữ phụ/nguồn 13px, form/dialog 14px; chỉ scope My Roadmap trong CSS chung. Đã xem trang hiện đang mở mà không reload/bỏ draft; chạy lại 140 checks, check/build và ảnh mobile/desktop Pass sau điều chỉnh.
- [Log task](evidence/v2-test-output.txt), [UI JSON](evidence/v2-ui-results.json), [check](evidence/v2-check-output.txt), [build](evidence/v2-build-output.txt), [desktop](evidence/v2-roadmap-desktop.png), [mobile](evidence/v2-roadmap-mobile.png), [dialog mobile](evidence/v2-monday-mobile.png). Ảnh đã xem trực tiếp; không tràn ngang.
- AI log: Codex đọc review/code, bỏ copy trang trí/reorder vô hiệu/link drawer v1, dùng callbacks chung, thêm save/recovery và test. Không sửa provider/controller/types/CSS chung hoặc feature bạn khác. Test UI v1 cũ được chuyển sang v2 vì storage/hành vi đã đổi; giữ và mở rộng coverage, không bỏ assertion domain.
- Lần đầu Edge bị sandbox chặn, sau đó server trong sandbox không truy cập được từ Edge ngoài sandbox. Chạy server/test ngoài sandbox với approval. Các lượt trung gian phát hiện thiếu accessible label cho track; test chọn nhầm chặng chỉ có một nguồn; assertion reload đọc trước lúc tải xong. Đã sửa và chạy lại toàn suite thành công.
- Giới hạn: chưa kiểm tra hoàn thành/bỏ hoàn thành ở My Plan v2, migration/import/upgrade/quota thật, hoặc native toolchain. Lỗi lưu là fault injection; conflict dùng hai trang thật trên IndexedDB riêng của context thử. Nội dung không được khảo sát lại ngày 08/10; ngày rà nguồn vẫn 07/10. Chưa ký review/Done thay nhóm.

## Bằng chứng lịch sử 07/10/2026

## Môi trường và phạm vi

- Ngày chạy: 07/10/2026. Người yêu cầu: Phạm Công Định; thực hiện kiểm tra: Codex.
- Branch: `feat/mw-team-02`; base commit: `20b38a2f6a0640aff8e9f6d8de2426cf26e1515c`. Kết quả dưới đây áp dụng cho working tree đã sửa, không phải riêng base commit. [Manifest](evidence/manifest.json) ghi hash các file được kiểm tra.
- Windows, Node 24.21.0, Microsoft Edge 154.0.4258.62; viewport 1440×1000 và 390×844. App kiểm thử tại `http://127.0.0.1:5174`.
- Domain dùng dữ liệu giả; UI dùng browser context cô lập, không đọc/sửa dữ liệu học thật. Chưa kiểm thử IndexedDB vì shared context vẫn là v1.
- Không tạo commit, push hoặc đổi trạng thái PR trong đợt kiểm tra này.

## Kết quả đã chạy

| Lệnh / phép kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| `node scripts/tasks/MW-TEAM-02.mjs` | 123 PASS, 0 FAIL | Planner v2; Backend và cả 7 track Mobile/Game |
| `node scripts/tasks/MW-TEAM-02.mjs --ui` | 130 PASS, 0 FAIL (123 domain/content + 7 UI) | Thêm form My Roadmap v1 hiện có |
| `npm run check` | PASS | Boundary + content checker hiện tại; registry mới đăng ký Backend |
| `npm run build` | PASS | TypeScript và production Vite build |
| Kiểm tra nguồn chính thức | Hoàn thành | URL, nội dung nguồn, chi phí/credential; xem [content review](CONTENT_REVIEW.md) |

[Log đầy đủ](evidence/test-output.txt), [kết quả browser](evidence/ui-results.json), [build log](evidence/build-output.txt), [check log](evidence/check-output.txt).

## Test cases

| Mã | AC / nhánh | Input và thao tác | Kết quả thực |
|---|---|---|---|
| TC-02-01 | AC-01 / validate | Giờ ngoài 2–20, số lẻ; date sai; ID/source/prerequisite sai | Từ chối draft sai; không cấp ID trước khi validate xong |
| TC-02-02 | AC-01 / rỗng | All-known, không còn work; phút 0/âm/lẻ/Infinity/NaN | Không sinh plan rỗng hoặc task không hợp lệ |
| TC-02-03 | AC-02 / chia bài | 30/120/121/300 phút; ngân sách 2 và 20 giờ | Giữ đúng 571 phút; đoạn ≤120 phút; tuần không vượt ngân sách |
| TC-02-04 | AC-03/04 / regen | Work cùng/khác revision, ID và segment | Cùng identity giữ trạng thái/notes/completion; revision mới tạo task mới |
| TC-02-05 | AC-04 / bảo toàn | Custom task và workId=null; đổi track; history/closedWeeks/ledger | Custom vào backlog; giữ lịch sử và ledger; không alias dữ liệu cũ; không nhân template cùng identity |
| TC-02-06 | AC-03 / hai plan | Sinh hai plan độc lập rồi sửa một plan | Không rò snapshot sang plan còn lại (domain; chưa phải UI đa kế hoạch) |
| TC-02-07 | Content | Mọi track, mọi source được phép; required-only, all-known; budget 2/20 | 7 track Mobile/Game và 3 Backend hợp lệ; ID/ref/reachability kiểm tra trực tiếp |
| TC-02-08 | AC-01 / form | Goal rỗng; chọn Thứ Ba; Cancel/Escape/Confirm Monday | Lỗi goal; đề xuất Thứ Hai rõ ràng; hủy giữ ngày; focus trở lại; confirm tạo plan và reload giữ dữ liệu |
| TC-02-09 | AC-04 / hủy tạo lại | Có plan, mở xác nhận rồi hủy | Tasks và planMeta cũ không đổi |
| TC-02-10 | Draft / source-known | Chọn source, toggle known, reload | Draft được giữ; active plan không tự đổi |
| TC-02-11 | Responsive / keyboard | 390×844, dùng Enter và kiểm tra bounds | Không tràn ngang; dialog thao tác được; all-known không tạo plan; không có page error |

Minh chứng: [dialog desktop](evidence/monday-desktop.png), [dialog mobile](evidence/monday-mobile.png).

## Chạy lại

Chạy Vite tại port 5174 rồi chạy task script với `--ui`. Có thể đổi URL bằng `MAJORWEAVE_TEST_URL` theo script. Nếu Playwright không nằm trong dependencies dự án, đặt `MAJORWEAVE_PLAYWRIGHT_MODULE` tới module Playwright đã cài; đặt `MAJORWEAVE_BROWSER_CHANNEL=msedge` để dùng Edge. Lần chạy này dùng Playwright từ Codex runtime; không thêm package hay sửa lockfile. Chromium bundled chưa được cài nên lần launch đầu thất bại; chạy lại với Edge thành công.

## Lỗi đã sửa và giới hạn

- Sửa kiểm tra ngày thật, ngày nhuận, năm biên; đề xuất Monday có xác nhận.
- Sửa prerequisite/source cũ, input work không hợp lệ, snapshot dùng chung reference và bảo toàn custom/history khi regenerate.
- Bổ sung test boundary thực tế. Mô tả cũ nói bài 150 phút vào backlog là sai: bài được chia 120+30 rồi xếp vào tuần theo ngân sách.
- Sửa nguồn hỏng/lỗi thời và credential đã ngừng; bổ sung bài portfolio cho cả 7 track. Pack ở `review`, chưa tự phê duyệt `ready`.
- Chưa chạy bài tập bằng Android/iOS/Flutter/RN/Unity/Unreal/Godot toolchain; kiểm tra nguồn và planner không chứng minh build native thành công.
- Chưa có UI v2 end-to-end cho 7 track, nhiều plan, transaction thất bại/quota/conflict, migration IndexedDB. Cần shared context và callback của Hải trước; xem [handoff](INTEGRATION_HANDOFF.md).
- Cross-review và phê duyệt nội dung cuối vẫn cần nhóm thực hiện.

## AI Development Log — đợt hiện tại

| Công cụ | Công việc | Cách kiểm chứng |
|---|---|---|
| Codex | Review Mobile/Game, sửa domain + form date, thêm test và tài liệu handoff | Diff, 130 checks, check/build, browser screenshots |
| Web/browser | Đọc nguồn chính thức; render Apple docs khi trang cần JavaScript | Bảng URL và ngày trong content review |
| Node/Playwright + Edge | Chạy assertions, UI desktop/mobile, thu evidence | Log và UI JSON liên kết ở trên |

[AI log trước đây](AI_LOG_PREVIOUS.md) được giữ riêng; các tuyên bố cũ không được tính là kiểm chứng mới.
