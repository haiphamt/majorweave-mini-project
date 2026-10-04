# Kiểm tra Prototype 02

Ngày: 04/10/2026. Môi trường: Windows, Chrome, Vite tại localhost. Thao tác UI qua trình duyệt thật, dữ liệu thử lưu riêng của Prototype 02.

## Kết quả đã thực hiện

| ID | Thao tác / điều cần giữ | Kết quả quan sát |
|---|---|---|
| P02-01 | Backend Node.js → Python → Java → Node.js | **Pass** — chặng ngôn ngữ/framework đổi đúng, các nền tảng CS vẫn có |
| P02-02 | Chọn nguồn freeCodeCamp cho JavaScript; đánh dấu đã biết | **Pass** — My roadmap giữ nguồn chọn và checkbox; không sinh việc học lại JavaScript |
| P02-03 | Đổi thứ tự Git/DSA; đặt mục tiêu và 5 giờ/tuần; tạo lịch | **Pass** — tuần đầu có OOP/Git theo thứ tự đã chỉnh; nút tạo bấm được trên màn hình thấp |
| P02-04 | Frontend React → Angular → Vue → React | **Pass** — chặng riêng đổi theo framework, chuỗi HTML/CSS/JS giữ nguyên |
| P02-05 | Tạo kế hoạch Frontend thứ hai; đổi lại Backend | **Pass** — có hai lựa chọn; Backend giữ mục tiêu, việc hoàn thành và kết quả tuần |
| P02-06 | Đánh dấu OOP hoàn thành; sửa ghi chú và dời việc OOP khác sang tuần 2 | **Pass** — một việc được dời, ghi chú giữ; tỷ lệ tuần 1 còn 1/3 |
| P02-07 | Kết thúc tuần 1, chuyển việc chưa xong | **Pass** — Weeks và Stats giữ **1/3**; tuần 2 nhận hai việc còn lại, không tạo bản sao từ thao tác này |
| P02-08 | Tải lại trình duyệt | **Pass** — hai kế hoạch, ghi chú và tổng kết được giữ; các tab/tuần đang xem có thể quay về mặc định |
| P02-09 | Đọc lại tuần đã kết thúc | **Pass** — sửa công việc bị vô hiệu hóa; thanh tổng kết vẫn 1/3 |
| P02-10 | Thêm việc với tiêu đề trống; sau đó nhập tiêu đề/ghi chú | **Pass** — validation chặn tiêu đề trống; việc hợp lệ xuất hiện đúng tuần và giữ ghi chú |
| P02-11 | Dời/thêm làm tuần vượt 5 giờ | **Pass** — có thông báo vượt quỹ giờ; không tự xóa việc |
| P02-12 | Tìm nguồn và hướng bằng chuỗi không tồn tại; xóa bộ lọc | **Pass** — có màn rỗng, xóa bộ lọc trả lại nội dung |
| P02-13 | Full-stack mặc định React + Node.js → Vue + Java | **Pass** — hiện Vue Components và Spring Boot; ID chặng không trùng trong kiểm tra dữ liệu |
| P02-14 | Yêu cầu thay kế hoạch đang xem rồi hủy | **Pass** — có xác nhận ghi rõ ảnh hưởng; kế hoạch Backend vẫn giữ |
| P02-15 | BA IT / Software → Data / BI | **Pass** — chặng riêng đổi sang Data needs & KPI; liên kết IIBA hiện rõ |
| P02-16 | Profile lưu ngành Hệ thống Thông tin | **Pass** — thông tin ngành được cập nhật |
| P02-17 | Nhịp học sau một lần đánh dấu hoàn thành; phím ArrowLeft | **Pass** — 1 việc tại 04/10/2026; đi sang 27/09/2026 với 0 việc, không tạo lịch sử giả |
| P02-18 | Mở Google login; tiếp tục khách | **Pass cho giao diện** — nút Google chưa kết nối, có giải thích; khách quay lại được. OAuth chưa kiểm thử |
| P02-19 | Mở hộp chặng; đóng bằng Escape | **Pass** — hộp thoại đóng, quay lại nội dung |
| P02-20 | Loading/error giả lập ở thanh duyệt; thử lại | **Pass cho trạng thái mẫu** — hiện màn tương ứng và quay về dữ liệu; không phải thử lỗi mạng thật |
| P02-21 | Menu ở điện thoại 390px | **Pass** — mở menu và chọn My plan được; menu thu gọn sau chọn |
| P02-22 | Responsive: 320px Plan/Profile, 390px Plan/Profile, 834px Explore, 1440px Explore/Plan | **Pass trong các màn đã thử** — không tràn ngang tài liệu sau sửa; không khẳng định đã kiểm tra mọi page ở mọi kích thước |
| P02-23 | Kiểm tra fixture bằng `npm run check:prototype` | **Pass** — 18 hướng / 12 ngành / 50 cấu hình; chặng/task/source không rỗng, ID duy nhất, thời lượng dương, URL HTTPS đúng cú pháp |
| P02-24 | TypeScript và build Vite hai entry | **Pass** — có `dist/index.html` và `dist/prototype.html` |
| P02-25 | Tải mới và một lượt cập nhật mã sau sửa khởi tạo React | **Pass** — không có log error/warn mới trong lượt kiểm tra này |

## Lỗi tìm được và đã sửa

1. Form cài đặt ghim bên phải quá cao trên laptop thấp, khiến nút tạo khó bấm: bỏ ghim form dài.
2. Lịch tuần tràn ngang điện thoại do kích thước tối thiểu của grid: đặt `min-width: 0` và giữ vùng lọc ngày cuộn riêng.
3. Nút tài khoản mất tên khi ẩn chữ trên điện thoại: thêm tên truy cập “Tài khoản khách”.
4. Khởi tạo lại React root khi cập nhật mã: tách entry `main.tsx` khỏi component prototype, thử lại reload và cập nhật mã.
5. Ước lượng tuần bằng phép chia tổng thời gian chưa khớp cách xếp bài: ước lượng theo cùng cách đóng gói thời lượng như lịch mẫu.
6. Chuyển việc vào tuần đã đóng: tìm tuần mở tiếp theo; mẫu số tổng kết được lưu riêng trước khi chuyển việc.

## Chưa kiểm tra hoặc chưa triển khai

- UI của từng cấu hình trong toàn bộ 50 cấu hình; mới kiểm tra dữ liệu tất cả và UI các trường hợp đại diện nêu trên.
- Các nhánh còn lại có nội dung mẫu; chưa nghiệm thu nguồn học hoặc bài thực hành chuyên sâu.
- Thực hiện thay kế hoạch, chính sách phục hồi lịch sử và xóa dữ liệu người dùng.
- Lỗi dung lượng/quyền localStorage thật, dữ liệu lưu bị hỏng, nhiều tab cùng ghi.
- Google OAuth, cloud sync, quyền dữ liệu, migrate dữ liệu khách và dữ liệu Prototype 01.
- Chuyển/bỏ việc vào tuần mở khi các tuần tương lai đã đóng: đã có xử lý trong mã, chưa chạy trường hợp UI đó.
- Nhánh kết thúc tuần “bỏ khỏi lịch sắp tới”: có giao diện và xử lý, chưa chạy UI trong lượt này.
- Bàn phím cho mọi control, screen reader đầy đủ, đo tương phản tự động và kiểm tra Safari/Firefox.
- Trạng thái My plan ban đầu không có kế hoạch, mọi chặng đã biết, ngân sách 0,5 giờ và 40 giờ: có xử lý, chưa ghi Pass khi chưa chạy đầy đủ.
- Toàn bộ URL trả HTTP thành công, điều kiện/chi phí chứng nhận hiện hành và tiến độ học từ website bên ngoài. Kiểm tra cú pháp URL không thay thế kiểm tra nguồn thực tế.

Ảnh trong thư mục `screenshots/` là ảnh chụp thật của lượt thử. Một việc hoàn thành trong nhịp học là thao tác kiểm tra giao diện, không phải chứng nhận người dùng đã học xong kiến thức đó.
