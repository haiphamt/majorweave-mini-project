# MW-TEAM-05 — backup/export/import

## Trạng thái

`src/persistence/backup.ts` là module bàn giao qua port và validators; chưa tích hợp UI/Profile app chính. Không gọi storage trực tiếp từ feature. Không tạo DB riêng cho dữ liệu app, không đăng nhập/đồng bộ online, không xóa nguồn hoặc thay defaults để né lỗi.

Ngày 09/10/2026, Codex chạy:

- `node scripts/tasks/MW-TEAM-05.mjs`: 65 PASS / 0 FAIL, giữ 49 test trước và thêm 16 test backup/import. Controller test dùng memory port và validator cấu trúc, không phải bằng chứng native/semantic.
- TypeScript strict cho module và trang QA: PASS.
- Sáu kiểm tra tương thích với `src/domain/validate.ts` từ ZIP MW-TEAM-04 do người làm cung cấp: export; round trip; copy history/closed-week/completion vào workspace hiện có; copy vào workspace rỗng và remap marker; từ chối URL javascript; từ chối completion không tồn tại. PASS. Đây là kiểm tra độc lập của Codex, chưa phải nghiệm thu tích hợp hoặc toàn bộ suite MW-TEAM-04. Không chép validator sang thư mục persistence.
- Trang `backup-tests.html`: Ngày 09/10/2026, người làm chạy trên Chrome: 7 PASS / 0 FAIL qua native IndexedDB. Đã tải backup QA mẫu, chọn lại file JSON và kiểm tra hợp lệ: 1 plan. Lỗi save dùng injection; chưa nghiệm thu semantic, hai tab thật, quota/abort native và UI app chính.

## API và phối hợp

`BackupValidators.workspace` và `.backup` bắt buộc. Khi tích hợp, Hải/Hữu Hiếu truyền `validateWorkspace` và `validateBackupFile` với catalog hiện hành. Trang QA hiện dùng validator cấu trúc và ghi rõ giới hạn này.

`exportBackup(snapshot, {exportedAt, unsaved}, validators)` xuất đúng snapshot được truyền vào, không load/save storage. `containsUnsavedChanges` là thông tin caller dùng hiển thị và đặt tên file; envelope JSON vẫn đúng `BackupFile` dùng chung. Caller phải ghi rõ file chứa bản chưa lưu nếu xuất proposal sau lỗi/conflict. Không báo đã tải xong chỉ vì đã tạo JSON.

`parseBackup(raw, validators)` parse JSON, kiểm format/version, rồi gọi validator backup. File hỏng/version không hỗ trợ trả lỗi; caller giữ file nguồn để người dùng xử lý. Không render nội dung ngoài bằng raw HTML.

`previewBackupImport(raw, current, choices, nextId, validators)` là pure preview. `createBackupImport({persistence, validators, nextId})` sở hữu preview riêng và cung cấp prepare/confirm/cancel/getProposal/isBusy cho app tích hợp.

## User story và luồng

US-05-B01: Người dùng xuất snapshot hiện tại, kể cả bản chưa lưu, để tự chuyển máy hoặc giữ bản đề xuất khi storage lỗi/conflict.

FL-05-B01: Lấy snapshot từ controller → kiểm workspace và envelope → tạo JSON → UI ghi trạng thái đã/chưa lưu → người dùng tải file. Export không ghi DB. Validator hoặc serialization lỗi không tạo file defaults. Hủy hộp thoại tải không được báo tải thành công.

US-05-B02: Người dùng xem trước backup rồi chọn nhập, copy hoặc hủy mà vẫn giữ dữ liệu thiết bị.

FL-05-B02: Chọn file → đọc text → validate JSON/version/workspace semantic → load thiết bị → preview các plan thêm/skip/copy và profile/draft/goals → confirm bằng ticket → kiểm lại workspace/revision → save qua adapter → chỉ success sau complete.

Hủy preview không ghi. Preview mới vô hiệu ticket cũ. Caller sửa candidate trả về không sửa bản riêng được confirm. Nếu mọi plan trùng đều skip và không có thay đổi khác, confirm trả workspace hiện tại mà không save/tăng revision.

## Lựa chọn nhập

| Lựa chọn | Mặc định | Hành vi |
| --- | --- | --- |
| planActions | {} | Thêm plan chưa có ID; plan trùng ID skip. `planActions[planId]='copy'` mới sinh toàn bộ ID mới; `skip` có thể chọn rõ cho plan bất kỳ |
| importProfile | false | Giữ profile thiết bị; true mới nhập profile trong file |
| importPreferences | false | Giữ preferences thiết bị |
| importDrafts | false | Không nhập draft nếu chưa chọn rõ; true thêm draft chưa có track, draft trùng track vẫn giữ bản thiết bị và báo skippedDraftTrackIds |
| importCredentials | false | Giữ mục tiêu hiện có; true hợp nhất mục tiêu đã lưu |

Giữ active plan thiết bị; nếu chưa có, chọn plan active được nhập từ file hoặc plan đầu tiên vừa thêm. Revision file chỉ dùng trong preview, không dùng ghi đè revision thiết bị.

Copy ánh xạ plan/generation/task/completion cùng liên kết taskId/completionId ở current/history/closed-week. UUID mới không được trùng nguồn hoặc thiết bị. Giữ ID nội dung/source, title/notes/minutes/status/date/timezone/acceptance/history; không tạo ngày học giả. ID task/generation/completion trùng thiết bị dù plan ID khác sẽ bị chặn và yêu cầu chọn copy rõ.

Giữ provenance thiết bị. Marker nguồn chỉ thêm nếu fingerprint chưa có và có plan thực sự vừa nhập; planIds được remap/lọc theo plan đã thêm. Không thay marker hiện có. Copy không được coi là chạy lại migration v1.

Catalog đã bỏ không phải lý do xóa plan/history. Validator và UI tích hợp phải giữ snapshot và báo hạn chế tạo lại theo catalog hiện hành.

## Lỗi và retry

Storage lỗi/throw: giữ candidate cùng UUID để retry hoặc export, không đổi port/fallback. Revision hoặc nội dung workspace đổi: conflict giữ proposal và dữ liệu disk; người dùng preview lại trên bản mới hoặc export bản chưa lưu. Không tự rebase.

Pending save chặn double confirm/prepare/cancel. Không hứa hủy transaction đang commit. Confirm chỉ success khi adapter resolve success; adapter phải tuân transaction.complete.

Hướng dẫn chạy trang QA và thử tải/chọn lại JSON: [README của task](../README.md#chạy-kiểm-tra). Kết quả thực và giới hạn: [QA log](../QA_AI_LOG.md).

## Việc còn lại

Người làm chạy check/build/native suite và tải/chọn file. Phối hợp validators/callback với Hải/Hữu Hiếu; kiểm hai tab thật, lỗi native của import, catalog bỏ và UI loading/error/cancel trên app chính. Mười track/nội dung và toàn hành trình vẫn là phần task cần hoàn thiện. Không đánh toàn bộ MW-TEAM-05 Done từ suite này.
