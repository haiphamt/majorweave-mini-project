# Persistence

`legacy.ts` tập trung thao tác ghi v1 đang chạy; thao tác đọc/chuẩn hóa v1 còn nằm trong `src/state.ts`. Hai vị trí này là ngoại lệ chuyển đổi đã ghi nhận, không phải mẫu để feature mới gọi storage trực tiếp.

Task persistence sẽ triển khai `workspace.ts`, `migration.ts`, `backup.ts` theo [kiến trúc](../../docs/KIEN_TRUC_MAJORWEAVE.md), rồi nhóm trưởng nối vào AppShell. IndexedDB v2, xuất/nhập và migration hiện chưa chạy. Giữ nguyên `majorweave.prototype.v1` và `majorweave.design.v2`; không xóa kho cũ khi phát triển.

Chỉ báo đã lưu sau transaction complete; lỗi/conflict phải giữ bản chưa lưu và dữ liệu nguồn. Không thêm Supabase/OAuth trong giai đoạn không đăng nhập.
