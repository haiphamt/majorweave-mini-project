# MW-TEAM-05 — tài liệu bàn giao

**Người làm:** Triệu Quang Huy (`1can5ez`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Lê Nguyễn Hữu Hiếu.

**Trạng thái:** đã triển khai và kiểm thử độc lập lưu dữ liệu, migration, backup/import và 10 track. Còn tích hợp semantic/UI/registry, kiểm tra app chính và nghiệm thu cuối; chưa Done.

## Đọc theo thứ tự

1. [TASK.md](TASK.md): phạm vi, acceptance và việc cần phối hợp.
2. [FLOW.md](FLOW.md): luồng chính, lỗi, thay thế và hủy.
3. [QA_AI_LOG.md](QA_AI_LOG.md): test cases, kết quả thực, SHA và AI log.

Chi tiết API: [migration](technical/MIGRATION.md), [backup/import](technical/BACKUP_IMPORT.md). Nội dung học: [bàn giao 10 track](technical/CONTENT_HANDOFF.md), [inventory nguồn](technical/CONTENT_SOURCE_INVENTORY.md). Log nằm trong [evidence/](evidence/); trang kiểm thử nằm trong [tests/](tests/).

## Chạy kiểm tra

Tại thư mục chứa `package.json`:

```powershell
node scripts/tasks/MW-TEAM-05.mjs
npm run check
npm run build
npm run dev -- --port 5174
```

Script task hiện có 91 test. Check chung chỉ bao phủ các pack đã đăng ký; bốn pack mới có test riêng. Giữ server chạy và mở terminal thứ hai để dùng Git.

Mở URL Local Vite hiện, rồi thêm đường dẫn sau:

| Kiểm tra | Đường dẫn |
| --- | --- |
| Load/save | `/docs/tasks/MW-TEAM-05/tests/indexeddb-tests.html` |
| Transaction và hai tab | `/docs/tasks/MW-TEAM-05/tests/indexeddb-extra.html` |
| Migration | `/docs/tasks/MW-TEAM-05/tests/migration-tests.html` |
| Backup/import | `/docs/tasks/MW-TEAM-05/tests/backup-tests.html` |
| Nội dung 10 track | `/docs/tasks/MW-TEAM-05/tests/content-preview.html` |
| Context/React chung | `/tests/context-v2-browser.html` |

Trang QA import TypeScript nên phải mở qua **dev server HTTP**. Không mở bằng `file://` hoặc preview `dist`. Nếu cổng 5174 bận, đổi cổng và dùng URL thực tế. Suite dùng DB QA có UUID; không xóa dữ liệu học thật.

**Hai tab:** mở B bằng link trang A; tải snapshot ở cả hai để cùng revision 0; lưu A, đợi success rồi lưu B. B phải conflict và giữ candidate; disk giữ bản A. Suite bốn lỗi/transaction chạy ở một tab. Quota dùng injection, không chứng minh disk đầy thật.

**Nội dung:** chọn track/nguồn/quỹ giờ để xem preview; bấm chạy 10 track QA. Completion trong harness là fixture, không thay callback progress thật của app.

## Sau tích hợp

Hải nối registry/Context/UI và Hữu Hiếu phối hợp semantic validator. Chạy lại migration/import và đủ 10 track qua chọn → đổi nguồn → tạo plan → hoàn thành → reload trên app chính. Ghi kết quả tại QA log, bổ sung SHA đang review và chờ reviewer nghiệm thu.

Các hướng dẫn cũ đã gom/xóa khỏi bản hiện hành. Link cũ trong PR cần đổi sang đường dẫn mới; file ở commit lịch sử vẫn giữ nguyên trong Git.
