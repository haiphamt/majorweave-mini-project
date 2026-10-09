# MW-TEAM-05 — migration v1

Module đã triển khai độc lập, chưa nối vào UI app chính. Ba lớp dưới dùng cùng contracts/legacy maps; không xóa hoặc sửa key v1.

| Lớp | File | Vai trò |
| --- | --- | --- |
| Nguồn | `src/persistence/migration-source.ts` | Đọc raw, kiểm schema, giữ dữ liệu và fingerprint |
| Preview | `src/persistence/migration-preview.ts` | Ánh xạ dữ liệu, cảnh báo và vấn đề chặn |
| Controller | `src/persistence/migration.ts` | Giữ candidate riêng, ticket, confirm/cancel và retry |

## 1. Đọc nguồn


inspectLegacyV1(raw) nhận string hoặc null, trả OperationResult<LegacySource|null>. readLegacyV1(read) nhận hàm đọc và gọi inspectLegacyV1. Không có API ghi/reset/delete storage. Caller giữ raw lỗi để tải xuống/xử lý; không dùng loadState/defaults của v1.

Raw không có key → null. Raw JSON/schema/field lỗi → lỗi, không lọc task và không thay defaults. Một task hỏng từ chối cả nguồn. Phút/tuần nguyên dương/không âm an toàn được giữ, không áp cap 1200/1000 của loadState. PlanMeta khác draft được giữ riêng. PlanMeta thiếu ở bản cũ và done thiếu timestamp có warning; preview giải thích cách xử lý. Timestamp lỗi không tự bị xóa.

Fingerprint là raw SHA-256, giống raw cho cùng fingerprint; chỉ khác khoảng trắng cũng khác fingerprint. Không tuyên bố đây là fingerprint semantic hoặc cơ chế khử trùng plan đã chuyển: controller confirm kiểm imports và IDs; fingerprint của reader riêng không đủ chống nhập trùng.

Validator này chỉ kiểm nguồn v1 để đọc có kiểm soát, không thay validator Workspace semantic của MW-TEAM-04. Không chỉnh contracts/Context/UI của nhóm. Các trường UI v1 ngoài hợp đồng v2 vẫn còn trong raw/state, nhưng chưa chốt cách trình bày bảo toàn khi chuyển.

## 2. Preview

`previewLegacyV1(raw, {now, timeZone, nextId, missingPlanMeta?})` trả preview advisory. Không ghi DB; confirm phải dùng bản riêng của controller.


- Plan dùng planMeta cũ, draft dùng stack/goal/hours/startDate hiện hành; không lẫn hướng đang khám phá với plan đã tạo.
- Khớp work ID, module, title và minutes: giữ provenance/revision/segment [0,minutes], không chia lại hoặc xếp lại tuần.
- Đã sửa/unknown work: giữ title/phút/tuần/notes/status; customized=true, segment=null. Bài chưa khớp có workId null; stage thiếu dùng ID legacy.custom-stage-N và warning, không gán sang bài gần giống. Chưa cho tạo lại với synthetic stage trong catalog thật.
- Nguồn có snapshot an toàn: giữ ID/title/provider/URL. Nguồn thiếu: source=null, thêm ID nguồn v1 vào ghi chú, raw còn nguyên và có warning cần chọn lại.
- Done thiếu timestamp: completion có completedAt/localDate/timeZone null; không tạo ngày giả từ lịch. Có timestamp: giữ instant gốc, ngày tính theo timezone người dùng chọn trong preview vì v1 không lưu timezone riêng; hiển thị warning.
- PlanMeta thiếu: blocking issue, chưa dựng plan; cần chọn rõ stack/goal/hours/startDate trong missingPlanMeta. Không âm thầm lấy draft làm plan metadata.
- Ngày v1 không Thứ Hai giữ nguyên và blocking issue; chưa tự chuẩn hóa lịch.
- Draft thiếu prerequisite có blocking issue, không tự thêm chặng hoặc đánh dấu đã biết.
- Selection/source/credential chưa ánh xạ có inventory unresolved và raw đầy đủ. Không được bỏ chúng rồi coi migration hoàn tất. Cách xử lý phải được chốt ở bước confirm.
- Raw/extra fields/history ngoài mô hình v1 chuẩn vẫn trong raw; chưa tuyên bố đã biểu diễn hết các trường đó trong Workspace v2.

## 3. Confirm/cancel và tích hợp


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

## 4. Kiểm tra và giới hạn

Ngày 09/10/2026, Huy cung cấp kết quả 49 PASS / 0 FAIL cho source + preview + controller memory port; suite này hiện nằm trong script task 91 test. Trang migration native: Huy đã chạy 7 PASS / 0 FAIL qua IndexedDB. Xem [QA log](../QA_AI_LOG.md), [luồng FL-04](../FLOW.md#fl-mw-team-05-04--migration-v1) và [cách chạy chung](../README.md#chạy-kiểm-tra).

Native suite dùng nguồn fixture trong bộ nhớ, validator cấu trúc, hai controller cùng trang và lỗi save injection. Chưa nghiệm thu migration trên hai tab thật, quota/abort native riêng cho migration, semantic validator đầy đủ hoặc UI app chính. Raw giữ được không đồng nghĩa mọi trường v1 đã có màn hình hiển thị trong v2.
