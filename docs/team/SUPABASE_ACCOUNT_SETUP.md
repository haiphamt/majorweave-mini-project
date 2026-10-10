# Bật tài khoản và dữ liệu online cho uitplans.

Ngày 10/10/2026, Hải yêu cầu luồng tương tự Beaver Plans: **Guest → đăng ký bằng email/mật khẩu → xác nhận email → đăng nhập**, quên mật khẩu qua email và dùng kế hoạch trên nhiều thiết bị. Đây là quyết định thay phạm vi chỉ Guest trước đó.

## Trạng thái bàn giao

- Code, migration SQL và kiểm thử đã có trên nhánh `fix/beaver-ui`.
- Nhóm **chưa tạo project Supabase**. Bản chính vẫn dùng Guest; form báo đăng nhập chưa bật, không nhận mật khẩu hoặc giả báo gửi thư.
- Chưa gửi thư đến Gmail thật hoặc kiểm thử trên Supabase hosted. Các kiểm thử online hiện dùng Postgres/PGlite và gateway QA riêng với tài khoản giả.
- Không dùng project/key, dữ liệu hoặc tài khoản của Beaver Plans.

## 1. Tạo project của nhóm

1. Mở [Supabase Dashboard](https://supabase.com/dashboard), đăng nhập và tạo project cho uitplans.
2. Giữ mật khẩu database trong nơi quản lý mật khẩu của nhóm; app frontend không cần mật khẩu này.
3. Lấy **Project URL** và **publishable key** từ phần Connect/API Keys. Nếu project còn dùng legacy key, dùng **anon key**.
4. Không gửi/đưa `service_role`, secret key hoặc mật khẩu SMTP vào frontend, Git hay tin nhắn bàn giao.

## 2. Tạo kho dữ liệu

Trong **SQL Editor**, chạy toàn bộ:

`supabase/migrations/202610100001_account_workspaces.sql`

Migration tạo một workspace riêng cho mỗi `auth.users.id`, bật RLS, chỉ cho đọc dữ liệu của mình. Ghi đi qua RPC `save_uitplans_workspace` có kiểm tra tài khoản, revision và request ID. Client không được insert/update trực tiếp để bỏ qua chống ghi đè.

SQL có thể chạy lại. Nếu project đã có bảng cùng tên nhưng khác cấu trúc, kiểm tra trước khi áp dụng; không xóa dữ liệu để khắc phục.

## 3. Cấu hình email và đường dẫn quay về

Trong Authentication:

- Bật **Email**, cho phép đăng ký và giữ **Confirm email** bật.
- Đặt yêu cầu mật khẩu tối thiểu **8 ký tự**, phù hợp với form.
- Trong **URL Configuration**, đặt Site URL là địa chỉ triển khai thực tế. Thêm địa chỉ phát triển `http://127.0.0.1:5195/` vào Redirect URLs. Khi chạy ở cổng khác, thêm đúng địa chỉ đó.
- Sau khi có domain thật, thêm đúng origin/path của site; không dùng URL của Beaver Plans.
- Giữ mẫu email **Confirm signup** và **Reset password** dùng liên kết xác nhận của Supabase. App xử lý callback trước khi mở HashRouter.
- Đặt tên người gửi là **uitplans.** và cấu hình **Custom SMTP** để gửi tới người dùng ngoài nhóm Supabase.

SMTP mặc định hiện chỉ gửi tới địa chỉ thành viên trong organization và bị giới hạn thấp; không phù hợp để thử với Gmail bất kỳ. SMTP password chỉ đặt trong Dashboard Supabase. Không tắt xác nhận email để làm demo xanh. [Hướng dẫn SMTP chính thức](https://supabase.com/docs/guides/auth/auth-smtp)

Luồng này dùng email + mật khẩu, không phải Google OAuth hoặc đăng nhập OTP. [Hướng dẫn xác thực chính thức](https://supabase.com/docs/guides/auth/passwords)

## 4. Nối app

Sao chép `.env.example` thành `.env.local`, điền hai giá trị công khai:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY
```

Sau đó khởi động lại server phát triển:

```powershell
npm run dev -- --port 5195
```

Khi deploy, đặt cùng hai biến môi trường trong dịch vụ hosting và build lại. Guest vẫn dùng được khi không cấu hình. HTTP chỉ được chấp nhận cho Supabase localhost ở chế độ phát triển; môi trường triển khai dùng HTTPS.

## 5. Cách dùng và nghiệm thu thật

1. **Guest:** tạo kế hoạch, tải lại, kiểm tra vẫn còn.
2. **Create one:** nhập email/mật khẩu, thấy màn hình kiểm tra email; bấm link trong Gmail, trở về app.
3. **Sign in:** đăng nhập bằng email/mật khẩu; tài khoản mới có kho riêng, không tự lấy kế hoạch Guest.
4. Trong menu tài khoản, chọn **Xem trước dữ liệu Guest**. Có thể nhập thêm hồ sơ/lựa chọn học; xem kế hoạch sẽ thêm, thử Hủy rồi xác nhận. Dữ liệu Guest gốc vẫn còn.
5. Đăng nhập cùng tài khoản trên trình duyệt/thiết bị khác. Thấy kế hoạch, lịch sử, nguồn học và mục tiêu chứng nhận đã lưu.
6. Sửa một việc trên thiết bị A. Thiết bị B tải thay đổi khi quay lại tab hoặc sau tối đa một chu kỳ kiểm tra 15 giây khi tab đang hiển thị và có mạng.
7. Khi B có phần đang sửa, app giữ phần đó và báo dữ liệu đã đổi. Thử lưu: bản cũ không ghi đè bản mới; xuất backup, xử lý bản chờ rồi tải lại.
8. **Forgot password:** email nhận link đặt lại; mở link trong tab mới, thử hai mật khẩu không khớp rồi đặt mật khẩu mới.
9. **Sign out:** trở lại kho Guest; đăng nhập tài khoản khác không thấy dữ liệu tài khoản trước. Đăng xuất bị chặn khi có phần đang sửa.
10. Mất mạng khi lưu tài khoản: app báo chưa lưu, giữ đề xuất để retry/xuất. Không giả báo đồng bộ hoặc tự chuyển dữ liệu tài khoản vào kho Guest.

Ghi kết quả, ảnh và ngày chạy vào `ACCOUNT_QA_AI_LOG.md`. Các bước cần Supabase/Gmail thật vẫn để **Chưa chạy** cho đến khi project được nối.

## Thiết kế dữ liệu và phạm vi

- Guest giữ database IndexedDB `majorweave` hiện có, không đổi ID/backup format.
- Tài khoản tải/lưu workspace qua Supabase. Không tạo cache tài khoản trong database Guest.
- Đưa dữ liệu Guest vào tài khoản dùng bộ backup/import hiện có: preview, sao chép ID kế hoạch, giữ lịch sử, chống nhập trùng và xác nhận.
- Nếu phiên/tài khoản thay đổi khi có đề xuất chưa lưu, app giữ controller cũ và yêu cầu xử lý trước khi chuyển kho. Hồ sơ và form công việc đang sửa cũng chặn chuyển tự động/tải nền.
- Online cần mạng để tải và lưu; bản sửa thất bại được giữ trong bộ nhớ và có thể xuất. Chưa có hàng đợi đồng bộ offline bền vững.
- Kiểm tra nền 15 giây + focus/online/visibility; không dùng Realtime subscription và không tuyên bố cập nhật tức thời.
- Một workspace JSONB/tài khoản là phạm vi đồ án; chưa chuẩn hóa riêng từng công việc hoặc triển khai cộng tác nhóm.

## Cách kiểm tra code

```powershell
npm run check
npm run build
node scripts/check-account.mjs
```

`check-account` chạy production SQL bằng Postgres/PGlite: RLS, quyền ghi, revision, retry mất phản hồi, mất mạng, dữ liệu sai và đổi tài khoản giữa lần kiểm tra phiên/ghi dữ liệu. PGlite chỉ là dependency kiểm thử, không nằm trong app.

## Những thông tin Hải cần cung cấp để nối thật

- Project URL.
- Publishable/anon key.
- Địa chỉ site khi triển khai; trước mắt có thể dùng localhost.
- Xác nhận migration, Confirm email và SMTP đã được cấu hình trong project.

Không cần cung cấp password database, service_role hay SMTP secret cho cuộc trò chuyện này.
