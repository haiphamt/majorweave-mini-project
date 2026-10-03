# Google login và Profile — đề xuất cho bản mini

Cập nhật 03/10/2026. **Trạng thái:** Profile và kế hoạch trên thiết bị đã chạy; đăng nhập Google và lưu trên server chưa triển khai.

## Cách chia trang

| Trang | Nội dung |
|---|---|
| Profile | Tên, ngành, nhánh đang khám phá, nhịp học 12 tuần, thông tin tài khoản khi có xác thực thật |
| My Plan | Mục tiêu, lịch từng tuần, công việc, nguồn học, ghi chú và tiến độ tuần |
| My Roadmap | Chọn / bỏ / sắp chặng, kỹ năng đã biết, nguồn học, quỹ thời gian và tạo lịch |

Hiện có 5 trang chính. Không cần một trang đăng nhập riêng: có thể mở hộp thoại từ avatar khi bổ sung tài khoản thật. My Plan có liên kết sang nhịp học tại Profile.

## Đăng nhập Google

Nên có nếu nhóm muốn sinh viên lưu kế hoạch trên nhiều thiết bị. Đề xuất dùng **Supabase Auth với Google OAuth** cho React hiện tại, kèm database và chính sách truy cập theo người dùng. Đây là công nghệ của website MajorWeave; Python / Java / Node.js trong roadmap là ngôn ngữ sinh viên chọn học.

Tài liệu chính thức: [Supabase — Sign in with Google](https://supabase.com/docs/guides/auth/social-login/auth-google).

### Luồng dự kiến, chưa có trong bản chạy

1. Khách mở Explore và xem nguồn học.
2. Bấm đăng nhập bằng Google → chuyển sang trang xác thực Google.
3. Google trả về callback cho Supabase → ứng dụng nhận phiên đăng nhập hợp lệ.
4. Tải hồ sơ và kế hoạch thuộc người dùng đó; nếu chưa có, tạo hồ sơ ban đầu.
5. Nếu có kế hoạch khách trên máy, hỏi “Nhập kế hoạch đang có vào tài khoản?” và cho xem mục tiêu / nhánh / số việc trước khi xác nhận. Không tự ghi đè kế hoạch đã lưu trên tài khoản.
6. Khi người dùng sửa kế hoạch, ghi vào server với quyền của tài khoản đang đăng nhập; Profile báo rõ trạng thái đồng bộ.
7. Nếu hủy / lỗi xác thực, quay về chế độ khách và giữ nguyên dữ liệu. Nếu lỗi đồng bộ, giữ thay đổi cục bộ và cho thử lại; không báo “Đã đồng bộ”.
8. Khi đăng xuất, tách dữ liệu tài khoản khỏi chế độ khách, để tài khoản kế tiếp trên máy không nhìn thấy kế hoạch của người trước.

### Điều kiện để triển khai thật

- Có dự án Supabase và Google Cloud do nhóm quản lý; cấu hình Google provider, Client ID / Secret, domain và callback URL.
- Secret đặt trong cấu hình phía dịch vụ; không đưa vào mã frontend hoặc Git.
- Chỉ cần quyền nhận diện cơ bản `openid`, email, profile cho chức năng đăng nhập.
- Mỗi bản ghi hồ sơ / kế hoạch có `user_id`; bật Row Level Security để tài khoản chỉ đọc / sửa dữ liệu của mình. Xem [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Kiểm tra bằng hai tài khoản khác nhau, hủy đăng nhập, tải lại, đăng xuất và lỗi mạng trước khi demo.

## Nhịp học

Bản hiện tại đếm việc được tự đánh dấu hoàn thành theo ngày ghi nhận, không đo thời gian học ở website bên ngoài. Dữ liệu cũ thiếu ngày vẫn giữ tiến độ nhưng không tự gán ngày. Biểu đồ hiện chỉ tính các việc được giữ trong kế hoạch hiện tại; nếu muốn lịch sử xuyên nhiều kế hoạch, bước tiếp theo là bảng sự kiện học riêng trên server.

## Quan hệ với Beaver Plans

Tham chiếu màu giấy, màu gạch, khoảng trống và kế hoạch theo tuần. Bản hiện tại có tuần → công việc → nguồn học / ghi chú. Các chức năng project → task → subtask → ngày, End week và thống kê tuần đã chốt trong ảnh Beaver Plans chưa được triển khai đầy đủ. Không mô tả bản mẫu là bản sao tính năng của Beaver Plans.
