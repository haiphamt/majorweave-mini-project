# MajorWeave — quy ước giao diện Prototype 02

Ngày: 04/10/2026. Đây là quy ước để duyệt prototype, chưa phải design system sản xuất.

## Tài sản và nguồn tham khảo

| Tài sản | Vị trí / nguồn | Cách sử dụng |
|---|---|---|
| Dấu MajorWeave | `../../public/favicon.svg` tính từ thư mục docs; file thật là `public/favicon.svg` | SVG có sẵn của dự án, dùng ở header, tab và màn tài khoản |
| Giao diện bản trước | `src/main.tsx`, `src/styles.css` tại commit `5c0eb3f` | Giữ cảm giác giấy, chữ serif và màu đất |
| Tham khảo kế hoạch tuần | https://beaverplans.com/; ảnh Hải gửi và `screenshots/beaver-reference.png` | Tham khảo nền kem, đường kẻ mảnh, nhóm việc, chuyển tuần, Plan / Stats / Weeks |
| Giao diện bản mới | `screenshots/explore-desktop.png`, `screenshots/plan-desktop.png`, `screenshots/profile-mobile.png` | Ảnh chụp thật để duyệt bố cục và khả năng đọc |

Không có sản phẩm vật lý hoặc bộ ảnh minh họa cần bổ sung. Provider của nguồn học hiển thị bằng tên chữ; không tạo logo giả của các đơn vị.

## Màu và chữ

| Token | Giá trị | Vai trò |
|---|---|---|
| Background | `#f4f1ea` | Nền giấy kem |
| Paper | `#fbfaf6` | Thẻ, form, nội dung |
| Ink | `#1c1a17` | Chữ chính |
| Muted | `#696259` | Chữ phụ |
| Line | `#dcd6cb` | Đường chia và viền |
| Rust | `#a74127` | Hành động chính, lựa chọn, tiến độ |
| Rust soft | `#f0e1d9` | Nền lựa chọn |
| Sage | `#53654b` | Trạng thái nền tảng/đã biết |
| Sage soft | `#e8ede2` | Nền trạng thái |

- **Newsreader**: tiêu đề lớn, chữ nghiêng tạo nhấn, giữ từ bản trước.
- **Be Vietnam Pro**: nội dung, form và hành động tiếng Việt.
- **JetBrains Mono**: nhãn ngắn, tuần và số liệu.
- Có font hệ thống dự phòng; Google Fonts cần mạng. Font của MajorWeave không được gọi là font đã xác minh của BeaverPlans.

## Bố cục và tương tác

- Header có dấu dự án, năm trang, tài khoản khách; menu thu gọn trên điện thoại.
- Hero của Explore dùng ngành hiện tại làm điểm bắt đầu; danh mục hướng không bị khóa theo ngành.
- Path detail có liên kết roadmap dễ thấy, bộ chọn nhánh, các chặng và nguồn học.
- My roadmap dùng chặng học bên trái, form mục tiêu/quỹ giờ bên phải. Form dài không ghim cố định để nút cuối vẫn bấm được trên laptop thấp.
- My plan: nhóm việc bên trái, lịch theo ngày bên phải; chuyển tuần, thanh tiến độ; Stats và Weeks là hai view riêng.
- Profile: thông tin học tập, kế hoạch đang xem, giao diện Google login, nhịp học 12 tuần.
- Viền mảnh, bóng nhẹ chỉ ở hộp thoại; tránh gradient trang trí và biểu đồ không có dữ liệu.
- Link ngoài mở tab mới. Dialog dùng `<dialog>` của trình duyệt, đóng bằng Escape; form có label và giới hạn nhập liệu.
- Focus bàn phím có viền rõ. Nhịp học đi được bằng phím mũi tên. Giảm chuyển động theo tùy chọn hệ thống.

## Trạng thái cần duyệt

Chính, rỗng, không khớp bộ lọc, form sai dữ liệu, đã biết, đã chọn, đã hoàn thành, tuần đã kết thúc, xác nhận thay kế hoạch, tài khoản chưa kết nối. Thanh duyệt phía trên cho xem loading/error **giả lập**, không nằm trong trải nghiệm sản xuất.

## Giới hạn của tham khảo

Bản này giữ cảm giác tối giản và mô hình kế hoạch tuần từ BeaverPlans. MajorWeave bổ sung khám phá ngành/hướng, chọn nguồn, chọn nhánh và roadmap cá nhân. Chưa sao chép đầy đủ các tương tác Copy/Paste plan hoặc Move work của BeaverPlans; không mô tả prototype là bản giống tuyệt đối.
