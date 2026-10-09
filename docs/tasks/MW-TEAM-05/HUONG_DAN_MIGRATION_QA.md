# MW-TEAM-05 — chạy kiểm thử migration native

## Chuẩn bị

Nhánh `feat/mw-team-05-migration` phải có `migration-source.ts`, `migration-preview.ts`, `migration.ts` và adapter `roadmap-store.ts` đã bàn giao. Chép hai file `migration-tests.html` và `migration-tests.ts` vào `docs/tasks/MW-TEAM-05/`.

Chạy ở thư mục project:

```powershell
npm run dev -- --port 5174
```

Dùng URL Local mà Vite hiện. Mở đường dẫn `/docs/tasks/MW-TEAM-05/migration-tests.html` trên URL đó. Nếu Vite chọn cổng khác, dùng cổng thực tế. Không dùng preview của dist cho trang QA TypeScript này.

Bấm **Chạy kiểm thử migration** và giữ lại toàn bộ output, prefix DB QA và phiên bản Chrome. Để terminal chạy server; dùng terminal thứ hai cho Git hoặc Ctrl+C khi đã xong.

## Phạm vi 7 kiểm thử

1. Preview/cancel không đổi workspace; ticket đã hủy không confirm được.
2. Confirm rồi adapter mới reload giữ plan/completion/draft và marker cùng revision; fixture nguồn còn nguyên.
3. Caller sửa candidate không thay bản confirm riêng.
4. Hai controller cùng trang confirm đồng thời không tạo hai bản nhập; controller mới nhận fingerprint đã nhập.
5. Writer khác thay workspace: conflict, giữ đề xuất, không ghi đè.
6. Lỗi save injected giữ IDs; retry qua adapter native chỉ nhập một lần.
7. Fixture nguồn thay đổi trước confirm chặn migration.

Mỗi kiểm thử có DB riêng dưới prefix `majorweave.qa.team05.migration.<UUID>`. DB được giữ để kiểm tra; không có thao tác xóa DB. Nguồn v1 là fixture trong bộ nhớ, không đọc/sửa localStorage thật.

## Trạng thái minh chứng

Ngày 09/10/2026, Codex kiểm tra TypeScript strict: PASS. Ngày 09/10/2026, người làm chạy trên Chrome: 7 PASS / 0 FAIL qua native IndexedDB. Lỗi save dùng injection; hai controller chạy cùng trang. Chưa nghiệm thu hai tab thật, validator semantic và UI app chính.

Validator dùng trong suite là validator cấu trúc của adapter, không phải validator semantic MW-TEAM-04. Hai controller cùng trang chưa thay cho hai tab thật. Lỗi save là injection trước adapter; không chứng minh native quota/abort. Chưa nghiệm thu UI app chính hoặc toàn bộ MW-TEAM-05.
