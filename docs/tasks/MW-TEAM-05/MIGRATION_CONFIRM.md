# MW-TEAM-05 — xác nhận/hủy migration v1

## Phạm vi và trạng thái

Module `src/persistence/migration.ts` điều phối preview → confirm/cancel qua `WorkspacePersistence` hiện có. Không tạo DB mới, không xóa/sửa key localStorage v1, chưa nối vào giao diện ứng dụng chính.

Nguồn đã được kiểm tra trước commit `6cf1733028edb40ba8192ba1c2efff113cc40143`: 16/16 test source, check/build PASS theo kết quả người làm cung cấp. Preview đã được kiểm tra trước commit `3f360cbc4847552636263d5ce4495fc4e622c491`: 30/30 source + preview, check/build PASS trên cùng phần code trước commit.

Ngày 09/10/2026, Codex chạy 49/49 test Node gồm 30 test cũ và 19 test controller qua memory port; kiểm tra TypeScript strict PASS. Không coi memory port là bằng chứng native IndexedDB, hai tab thật hoặc validator semantic. Người làm cần chạy lại check/build trên nhánh cá nhân sau khi chép module.

## Tích hợp

`createLegacyMigration({ persistence, readLegacy, validate, context })` yêu cầu:

- `persistence`: adapter dùng chung; success chỉ trả sau transaction hoàn tất.
- `readLegacy(key)`: đọc đúng key do module truyền vào, không fallback defaults.
- `validate(value)`: validator workspace semantic đã thống nhất với MW-TEAM-04. Dependency bắt buộc; test Node dùng validator cấu trúc của adapter và không chứng minh semantic.
- `context()`: thời điểm, timezone và factory UUID; metadata plan thiếu phải do người dùng chọn rõ.

`prepare(choices)` chỉ đọc và tạo bản riêng, trả ticket và bản preview/candidate cho UI. UI phải hiện cảnh báo và các lựa chọn trước khi gọi `confirm(ticket)`. Caller sửa candidate trả về không thay bản riêng được xác nhận. Preview mới vô hiệu ticket cũ.

`cancel(ticket)` bỏ bản đề xuất, không ghi DB. Không chấp nhận cancel khi thao tác đang chạy; không hứa hủy transaction đang commit.

`confirm(ticket)` kiểm nguồn, fingerprint, workspace/revision rồi gọi adapter. Lỗi save giữ nguyên IDs và đề xuất để retry. Conflict giữ đề xuất, cần preview lại trên workspace mới; không tự rebase. Fingerprint đã nhập không tạo plan thứ hai. Marker nhập và plan nằm trong cùng workspace save.

## Các lựa chọn phải rõ

| Lựa chọn | Mặc định | Hành vi |
| --- | --- | --- |
| mode | initial | Chỉ dùng khi revision 0 và chưa có plan; append phải được chọn rõ nếu workspace có dữ liệu |
| importProfile | false | Giữ profile hiện tại; true nhập profile v1 qua validator |
| importPreferences | false | Giữ preferences hiện tại |
| importDraft | true | Draft lỗi/chưa ánh xạ hoặc trùng track hiện tại sẽ bị chặn; false giữ draft hiện tại và giữ bản v1 nguyên trạng |
| importCredentials | true | Credential chưa ánh xạ sẽ bị chặn; false không nhập credential và giữ nguồn v1 |

Append giữ active plan, history và dữ liệu hiện có. Nếu chưa có active plan, plan nhập được chọn làm active sau save thành công. Không dựng plan mặc định khi nguồn không có tasks.

## Nguồn thay đổi trong lúc commit

localStorage và IndexedDB không cùng transaction. Module đọc lại nguồn trước save, nhưng nguồn vẫn có thể đổi trong lúc transaction chạy. Sau commit thành công, `sourceStateAfterCommit` trả `unchanged`, `changed` hoặc `unreadable`; `sourceRaw` luôn giữ bản đã chuyển để caller có thể xuất. Trạng thái changed/unreadable không được hiển thị thành rollback hoặc yêu cầu nhập lại tự động. Key v1 không bị xóa.

## Chưa nghiệm thu

- Native IndexedDB cho migration: confirm/cancel/retry, đồng thời hai tab và marker nguyên tử.
- Validator semantic thực, metadata thiếu và lựa chọn chưa ánh xạ qua UI.
- Luồng UI/app chính; backup/export/import đầy đủ; 10 track và toàn hành trình MW-TEAM-05.

Không đánh dấu toàn bộ task Done dựa trên 49 test này.
