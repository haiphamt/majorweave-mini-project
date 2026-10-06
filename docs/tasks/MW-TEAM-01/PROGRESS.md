# PROGRESS - MW-TEAM-01 (Nguyễn Thị Quỳnh Hân)

## 1. Hiện trạng ban đầu
- Nhánh hiện tại: `feat/mw-team-01`
- File đã thay đổi: `src/content/catalog.ts`, `src/domain/content.ts`, `.vscode/launch.json`
- Mẫu FLOW và QA_AI_LOG đã được copy.

## 2. Checklist (dựa trên AC và Nội dung yêu cầu)

### Giai đoạn 1: Dữ liệu và Resolver
- [x] 1. Khai báo 12 ngành / 6 khoa và danh mục hướng v2 vào `src/content/catalog.ts` (đã có sẵn trong file hiện tại).
- [x] 2. Hoàn thiện hàm resolver trong `src/domain/content.ts` (đã update: sử dụng `packs.flatMap` để lấy stage/resource chéo cho các Full-stack tracks).
- [ ] 3. Viết `src/content/paths/backend.ts`: Bị chặn (Cần thời gian kiểm chứng URL và thông tin các khoá học nền tảng/chuyên sâu thực tế).
- [ ] 4. Viết `src/content/paths/frontend.ts`: Bị chặn (Cần thông tin kiểm chứng thực tế).
- [ ] 5. Viết `src/content/paths/ux.ts`: Bị chặn (Cần thông tin kiểm chứng thực tế).
- [ ] 6. Viết `src/content/paths/fullstack.ts`: Bị chặn (Phụ thuộc vào 3 file trên).

### Giai đoạn 2: UI (Giao diện Khám phá & Chi tiết)
- [ ] 7. Xây dựng `src/features/explore`: Bị chặn (Đợi API Callback Context từ nhóm trưởng).
- [ ] 8. Xây dựng `src/features/path-detail`: Bị chặn (Cần dữ liệu content mock để hiển thị 3 tab).
- [ ] 9. Tích hợp UI Explore/Path detail đọc nội dung đã resolve qua props/context v2.

### Giai đoạn 3: Tài liệu và Kiểm thử
- [ ] 10. Điền luồng vào `FLOW.md`.
- [ ] 11. Điền test case vào `QA_AI_LOG.md`.
- [ ] 12. Chạy `npm run check`, `npm run build` và kiểm thử trình duyệt thực tế.

## 3. Nhật ký chặn (Blockers)
- **Thiếu URL gốc đã kiểm chứng:** Nội dung khóa học (Resources, Stages) cho 17 hướng đòi hỏi phải truy cập và lấy bằng chứng thực từ các trang web (chi phí, độ dài). Tác vụ này cần sự hỗ trợ của các chuyên gia nội dung để cung cấp thư viện URL chính xác, không được fake URL. Tác động: Chặn tiến độ code các file `src/content/paths/*.ts`. Người giải quyết: Quỳnh Hân / Team BA.
- **Thiếu Context v2/Callback:** UI Explore và Path Detail phụ thuộc vào các helpers từ `src/app/context.ts` và `registry`. Theo yêu cầu của dự án, UI chỉ được nối vào v2 sau khi Hải tích hợp context/registry. Tác động: Chặn tiến độ code UI ở `src/features/`. Người giải quyết: Nhóm trưởng (Phạm Tuấn Hải).
