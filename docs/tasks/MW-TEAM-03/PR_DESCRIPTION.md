# MW-TEAM-03 — Tiến độ, tám track AI và My Plan v2 độc lập

Đã bàn giao commit `30d67122d94aa9784fb688f5e3eb7ade112c5c9a` qua [PR #2](https://github.com/haiphamt/majorweave-mini-project/pull/2). Module progress thuần, bốn pack/tám track ở trạng thái review và MyPlanV2 controlled hỗ trợ Plan/Stats/Weeks, done/undo, thêm/sửa/dời/backlog, chốt tuần và history chỉ đọc. Snapshot trước xử lý; lỗi lưu cho retry đúng candidate.

**Bổ sung bugfix, bàn giao 08/10 qua PR #2:** fixture thiếu font loader nên font dự phòng hiển thị sai dấu tiếng Việt; thêm đúng ba link font của index.html, giữ CSS/style. Form từng xóa day ngay khi week tạm rỗng; giữ day trong draft khi đổi tuần và chỉ clear ở payload backlog khi submit.

Validation thực 07/10: **41/41 task tests** (20 progress, 10 content, 11 UI model/SSR/font), TypeScript preview, npm run check và npm --ignore-scripts run build pass. Bỏ prebuild để bảo toàn ba file generated đang modified. Browser tái hiện trước sửa và kiểm sau: Thứ Ba tuần 1 → xóa tạm → tuần 2 vẫn Thứ Ba; cancel, tuần 0 invalid, save backlog day=null; Tuần/Thống kê font đúng. Screenshot/log trong evidence; không coi đây là persistence end-to-end.

Chạy lại ngày 08/10 trên code bàn giao: 41/41 task tests, TypeScript preview, check và build không prebuild pass; log ở evidence/bugfix-2026-10-08-verification.txt. Không chạy lại browser ngày 08/10; các ảnh trước/sau là phiên 07/10.

Nhánh này vẫn app v1 và fixture v2 độc lập. PR #3 có provider/bootstrap; PR #5 đã có savePlan/WorkspacePlan adapter theo diff đọc 08/10, chưa được kiểm thử tích hợp tại đây. Phối hợp Hải chọn bản tích hợp và kiểm revision/retry/hủy pending, registry AI. Chưa full tám track nguồn → planner → done → chốt → reload, migration/conflict/semantic validator hoặc nghiệm thu content.

Người làm Chung Minh Hiếu; deadline **20:00 10/10/2026 Việt Nam**. Huy review chéo, Hải review/tích hợp cuối. Nội dung chuẩn bị để cập nhật PR; chưa sửa description trên GitHub trong lượt 07/10.
