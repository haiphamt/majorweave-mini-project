# Nguồn quyết định thiết kế — Prototype 02

Ngày: 04/10/2026. Dự án: MajorWeave, tiếp nối prototype trong cùng repository.

## Cơ sở tiếp tục hướng đã chọn

Lời người dùng trong cuộc thảo luận:

> Mình muốn làm giao diện, style, phong cách như beaverplans luôn.

Sau khi xem bản trước:

> Cũng được đó. Nhưng không thấy chỗ coi roadmap ví dụ backend thì nó sẽ có đường link sang roadmap sh chẳng hạn. Và đảm bảo giống beaverplans chưa.

Yêu cầu triển khai:

> Bạn triển khai luôn nhé. Commit lên github hay gì đó cũng được. Nhưng đừng cập nhật Notion vội. Xong phần nào thì bảo mình check trước khi lmà sang công việc mới.

Lượt này:

> tiếp tục sang phần mới

Đây là **lượt chỉnh và mở rộng prototype đã có trong cùng dự án**, giữ hướng nền giấy kem, màu đất, bố cục kế hoạch tuần từ tham khảo BeaverPlans. Áp dụng ngoại lệ “iteration after a selected direction” của skill huashu-design; không coi câu “tiếp tục” là quyền bỏ qua bước duyệt một hướng thiết kế mới.

## Phạm vi được triển khai trong lượt này

- Prototype tương tác năm trang, các trạng thái và style chung.
- Mở bộ chọn nhánh theo bảng phạm vi phần 1 để thử giao diện.
- Google login ở mức giao diện; khách vẫn khám phá được.
- Nhiều kế hoạch; chọn một kế hoạch đang xem.
- Dừng sau khi giao prototype cho Hải xem. Chưa xem đây là phê duyệt giao diện mới, kiến trúc hay hợp đồng triển khai cho năm bạn.

## Tài liệu và hình đối chiếu

- Bản trước: `index.html`, `src/main.tsx`, `src/styles.css` tại commit `5c0eb3f`.
- Ảnh BeaverPlans do Hải gửi: các màn PLAN, STATS, WEEKS trong cuộc thảo luận.
- Tham khảo trực tiếp: https://beaverplans.com/ ngày 04/10/2026, chế độ khách; chỉ đọc giao diện.
- Ảnh đối chiếu lưu tại `screenshots/beaver-reference.png`.
- Ảnh bản mới: `screenshots/explore-desktop.png`, `screenshots/plan-desktop.png`, `screenshots/profile-mobile.png`.

## Giả định cần kiểm tra khi duyệt

1. Tên trang tiếng Anh, nội dung hướng dẫn và form tiếng Việt.
2. Điều hướng ngang cho năm trang; My plan có nhóm Plan / Stats / Weeks bên trong.
3. Nhịp học tổng hợp nằm ở Profile; Stats theo từng kế hoạch nằm ở My plan.
4. Không dùng bài quiz để kết luận năng lực hoặc khóa quyền khám phá ngành khác.
5. Màn prototype ghi rõ nội dung mẫu và chưa đồng bộ tài khoản; dữ liệu thật của website học bên ngoài chưa được tích hợp.

Các giả định này dựa vào yêu cầu đã có, đang giao Hải kiểm tra; không ghi chúng là quyết định mới đã được duyệt.
