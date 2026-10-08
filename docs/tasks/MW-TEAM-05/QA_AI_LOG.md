# Kiểm thử và AI log — MW-TEAM-05

## Môi trường

- Người chạy: Triệu Quang Huy (`1can5ez`). Ngày: 08/10/2026.
- Branch: `feat/mw-team-05`.
- Commit chứa mã đã kiểm tra: `aafd1f6ece1eaa895f4e2ca41674fb8e3f5b12cf`.
- Máy: Windows, Terminal PowerShell, Antigravity. Tên/phiên bản trình duyệt và viewport: chưa ghi nhận, người chạy cần bổ sung.
- Server: `npm run dev -- --port 5174`; URL `http://127.0.0.1:5174`.
- DB load/save: `majorweave.qa.team05.ae4569a7-b490-462c-8900-81ebd8f38dbb` cùng các suffix từng test.
- DB Context: `majorweave-context-qa-aac532d4-b9ea-482d-b789-da0fc1d08ef6`.
- Trang QA dùng tên DB riêng, không xóa hoặc ghi vào database học thật/localStorage v1.
- Kết quả dưới đây do Huy chạy và gửi log trong cuộc trao đổi. Không phải mọi kiểm thử do AI chạy. Kiểm thử diễn ra trước commit, sau khi áp dụng gói mã; không ghi là đã chạy lại sau commit.

## Test cases — load/save

Trang: `/docs/tasks/MW-TEAM-05/indexeddb-tests.html`; bấm **Chạy kiểm thử**.

| Mã | AC / luồng | Điều kiện & input | Các bước | Mong đợi | Kết quả thực | Trạng thái |
|---|---|---|---|---|---|---|
| TC-MW-TEAM-05-01 | AC-01 / FL-01 | DB QA trống | Load, đọc raw key local | Workspace revision 0; key vẫn chưa có | PASS Load rỗng không ghi defaults | Pass |
| TC-MW-TEAM-05-02 | AC-02 / FL-02 | Workspace revision 0, tên QA Huy | Save expected 0, load lại, so input | Revision 1, profile còn, input không bị sửa | PASS Save tăng revision, reload giữ profile; không sửa object đầu vào | Pass |
| TC-MW-TEAM-05-03 | AC-03 / FL-03 | Hai instance cùng DB, revision 0 | Promise.all hai save, đọc disk | Một success, một conflict, disk đúng bản thắng | PASS Hai save cùng revision chỉ một thành công | Pass |
| TC-MW-TEAM-05-04 | AC-03 / FL-03 | Disk revision 1, candidate revision 0, expected 1 | Save rồi so disk | Conflict, disk không đổi | PASS Candidate sai revision trả conflict, không ghi đè | Pass |
| TC-MW-TEAM-05-05 | AC-01 / FL-01 | Raw schema 2 nhưng thiếu cấu trúc | Thử save workspace hợp lệ, đọc raw | Validation error, raw được giữ | PASS Dữ liệu hỏng trên disk được giữ nguyên, save bị từ chối | Pass |
| TC-MW-TEAM-05-06 | AC-01 / FL-01 | Raw schemaVersion 99 | Load rồi đọc raw | unsupported_version, raw không đổi | PASS Schema tương lai được giữ nguyên | Pass |
| TC-MW-TEAM-05-07 | AC-02 / FL-02 | Expected revision -1 | Save, đọc raw | Validation error, không ghi | PASS Revision đầu vào không hợp lệ không ghi dữ liệu | Pass |
| TC-MW-TEAM-05-08 | AC-01 / FL-01 | Validator cố ý throw khi đọc DB QA | Load với timeout 5 giây, đọc raw | Trả storage error, không treo/không đổi disk | PASS Validator ném lỗi trong callback đọc trả lỗi thay vì treo | Pass |
| TC-MW-TEAM-05-09 | AC-01 / FL-01 | DB QA version 2 | Adapter mở version 1 | INDEXEDDB_VERSION, không reset | PASS DB version mới hơn trả INDEXEDDB_VERSION | Pass |
| TC-MW-TEAM-05-10 | AC-01 / FL-01 | DB QA version 1 thiếu store workspace | Load, xem lại store names | Storage error, không tự sửa/reset DB | PASS Object store bị thiếu trả lỗi, không reset database | Pass |

Tổng log người chạy cung cấp: **10 PASS / 0 FAIL**. TC-03 dùng hai instance trong cùng trang; không thay bằng chứng hai tab thực. “Reload” ở suite là đọc lại qua port, không phải toàn bộ UI đã reload.

## Kiểm tra Context và React

Trang `/tests/context-v2-browser.html`; bấm **Chạy kiểm tra**, sau đó **Thử callback qua React**.

| Mục | Kết quả thực do người chạy cung cấp | Trạng thái |
|---|---|---|
| Mở DB trống | PASS: Mở IndexedDB trống, không có plan mặc định | Pass |
| Tạo hai plan | PASS: Tạo hai plan; thành công sau transaction hoàn tất | Pass |
| Controller mới | PASS: Tải lại bằng controller mới giữ hai plan và draft | Pass |
| Cùng revision | PASS: Hai writer cùng revision: một thành công, một conflict | Pass |
| Callback conflict | PASS: Conflict ở callback giữ bản chưa lưu, không kích hoạt plan mới | Pass |
| Reload/preview/cancel | PASS: Bỏ bản chưa lưu có xác nhận; preview/hủy giữ nguyên database | Pass |
| Regeneration history | PASS: Xác nhận tạo lại lưu history; reload vẫn giữ history | Pass |
| React Provider/hook | ready · 3 plans; PASS React callback: mobile.flutter saved | Pass |

Tổng: **7/7 native Context PASS**, callback React PASS. Đây là kết quả test Context có sẵn; không tự coi nó chứng minh các case abort/quota/blocked hoặc luồng migration/import.

## Lệnh kiểm tra

| Lệnh | Mã nguồn / ngày | Kết quả thực | Phạm vi |
|---|---|---|---|
| `npm run check` | Source sau áp dụng gói; được commit thành aafd1f6…; 08/10/2026 | PASS 3 content packs, 29 modules; legacy/Backend checks và 16 context checks passed | Cấu trúc/logic đã đăng ký, không thay native tests |
| `npm run build` | Cùng source; 08/10/2026 | TypeScript + Vite v6.4.3 thành công; 1621 modules transformed | Compile/build |
| Trang load/save QA | Cùng source; 08/10/2026 | 10 PASS / 0 FAIL | Các case trong bảng load/save |
| Trang Context + React | Cùng source; 08/10/2026 | 7/7 + React callback PASS | Tích hợp port với controller/provider |

## Minh chứng

- Log terminal và log browser đã được Huy cung cấp trong cuộc trao đổi.
- Ảnh/file log trong thư mục `evidence/`: chưa bổ sung; không ghi rằng đã có ảnh trong repo.
- Link draft PR: chưa có, bổ sung sau khi mở PR.

## Bug log

Chưa phát hiện lỗi trong các lần chạy đã được cung cấp ở trên. Các nguy cơ exception callback, lỗi lưu và mã lỗi chưa rõ là kết quả đọc code; không ghi thành bug đã tái hiện nếu chưa có bằng chứng chạy bản cũ.

## AI Development Log

| Ngày / vòng | Công cụ | Input / mục tiêu | Output | Kiểm tra / quyết định của người thực hiện | Verification |
|---|---|---|---|---|---|
| 08/10/2026 — chuẩn bị | ChatGPT/Codex; không ghi model chưa xác nhận | Feedback GUI_TRIEU_QUANG_HUY.md, TASK, HANDOFF_CONTEXT_V2, roadmap-store.ts, contracts | Đối chiếu scope, adapter bootstrap và dependency | Huy tạo nhánh MW-TEAM-05, ghép Context theo hướng dẫn Hải | npm ci; check/build baseline do Huy chạy |
| 08/10/2026 — contracts | ChatGPT/Codex | Kiểm tra import WorkspacePersistence | Phát hiện file contracts đính kèm ban đầu thiếu port | Huy kiểm tra file trên máy bằng Select-String, gửi contracts(1).ts mới; không tự sửa contracts chung | File hiện hành có WorkspacePersistence; check/build đạt |
| 08/10/2026 — load/save | ChatGPT/Codex | Hoàn thiện adapter trong src/persistence, giữ API/DB/key | Gói mã bổ sung issue codes, bảo vệ input, bắt callback errors, kiểm thử QA | Huy áp dụng trên nhánh cá nhân; thay đổi chưa tự merge main | TypeScript strict do AI chạy; check/build, 10 native QA, 7 Context và React callback do Huy chạy |

Code tiếp tục cần người thực hiện đọc diff và Hải review. Không coi việc chạy test là review hoàn tất.

## So sánh hai công cụ AI

Chưa thực hiện trong đợt này; làm trên bài nhỏ chung do nhóm chọn. Không bịa kết quả công cụ thứ hai.

## Phần chưa chạy / chưa triển khai

- Hai tab thật cùng revision, bằng chứng so sánh trước/sau.
- Native blocked, quota, abort, failure paths và xác nhận không resolve success trước complete trong test riêng.
- Validator semantic đầy đủ từ Hữu Hiếu.
- Migration v1: raw/schema/fingerprint/preview/confirm/cancel và giữ key cũ.
- Backup/import: round trip, phiên bản lạ, duplicate/copy/remap, cancel/conflict/quota.
- Bốn content packs / 10 tracks hạ tầng và QA; nguồn chưa được khảo sát trong đợt này.
- FLOW/TASK hoàn chỉnh, kiểm tra toàn hành trình từng track, UI desktop/mobile, nghiệm thu cuối.

## Kết luận bàn giao

Đã có bằng chứng cho nhóm load/save ban đầu và tích hợp Context; chưa hoàn thành toàn bộ MW-TEAM-05. Mở draft PR mới và gửi Hải review, không tự merge/push main. Giữ nguyên dữ liệu thật và phối hợp dependency trước tích hợp.
