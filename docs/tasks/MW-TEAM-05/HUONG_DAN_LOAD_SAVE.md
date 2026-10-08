# MW-TEAM-05 — đợt 1: bổ sung load/save

Đây là bản đề xuất dựa trên roadmap-store.ts và contracts.ts đã gửi ngày 08/10/2026. Giữ createRoadmapStore, validateRoadmapWorkspace, emptyWorkspace và port WorkspacePersistence; không đổi app, contracts, DB production hoặc key.

## Áp dụng

1. Đảm bảo đang ở feat/mw-team-05; chạy git status để giữ công việc hiện có.
2. Giải nén và chép src/, docs/ trong gói vào thư mục repo chứa package.json. Chỉ roadmap-store.ts được thay; ba file docs là mới. Không thay contracts.ts.
3. Xem git diff -- src/persistence/roadmap-store.ts và git status.
4. Chạy npm run check, npm run build. Build có thể tạo lại tài liệu chung; kiểm tra diff trước khi xử lý, không commit chúng vào task nếu không thuộc phạm vi.
5. Chạy npm run dev; nếu cổng 5173 bận dùng npm run dev -- --port 5174. Mở /docs/tasks/MW-TEAM-05/indexeddb-tests.html trên địa chỉ server, bấm Chạy kiểm thử và lưu output.
6. Ghi kết quả thật vào QA_AI_LOG.md của task; dùng mẫu nhóm, không ghi PASS khi chưa chạy.
7. Chạy lại test Context sẵn có /tests/context-v2-browser.html, cả kiểm tra và callback React. Ghi riêng kết quả này.

## Đã bổ sung

- Mã issue rõ cho blocked, unavailable, version, quota, abort, read/write failure.
- Bắt lỗi callback validator/clone/put; giữ input và dữ liệu gốc, không tự fallback/reset.
- Snapshot candidate trước khi mở DB, bảo vệ khỏi caller chỉnh object khi save đang chờ.
- Kiểm tra expectedRevision và giới hạn revision trước khi ghi.
- Giữ compare+put trong một transaction; success chỉ resolve ở oncomplete.
- Connection mở muộn sau blocked được đóng; versionchange đóng connection.

## Kết quả kiểm tra tại lúc chuẩn bị gói

- TypeScript strict cho adapter và test runner với contracts mới: PASS.
- Full npm run check/build trên repo Context của người dùng: chưa chạy với bản sửa này.
- IndexedDB native/browser suite: CHƯA CHẠY, cần chạy trên máy Huy.

## Giới hạn — chưa phải hoàn thành MW-TEAM-05

Suite đi kèm kiểm tra 10 tình huống: load không ghi defaults, save/reload/input bất biến, hai save cạnh tranh trong cùng trang, candidate stale, dữ liệu hỏng, schema tương lai, expectedRevision lỗi, validator throw, DB version mới và thiếu store. Hai instance trong một trang không thay bằng chứng hai tab thật.

Còn phải kiểm thử native transaction complete/abort, blocked, quota, hai tab thực và UI giữ unsavedWorkspace. Mã lỗi có trong adapter chưa phải bằng chứng các tình huống đó đã PASS. Trang QA không xóa DB hoặc localStorage thật; DB QA có prefix riêng và UUID mỗi lần chạy.

Validator đang là shape cơ bản được kế thừa; validator semantic đầy đủ từ Hữu Hiếu cần phối hợp. Migration, backup/import, 10 track, FLOW.md và QA_AI_LOG.md đầy đủ chưa nằm trong gói này. Đây là bước đầu độc lập để review, chưa tự thay UI v1/v2.

Mở PR mới cho MW-TEAM-05, ghi phần đã làm/chưa làm và dependency. Gửi Hải review; chỉ Hải merge main. Không dùng PR #4 để bàn giao code này.
