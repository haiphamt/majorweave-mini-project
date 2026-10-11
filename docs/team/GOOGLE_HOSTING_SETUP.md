# Guest + Google và hosting miễn phí

## Quyết định và trạng thái

Ngày 11/10/2026, Hải chọn Guest/Google trước, email/mật khẩu qua SMTP làm sau. Không mua tên miền, không bật gói trả phí, không merge `main`.

- App đã có nút Continue with Google; dùng SDK Supabase hiện có và kho tài khoản đã cấu hình.
- Chỉ mở OAuth sau khi kiểm tra Google provider bật; nếu chưa bật/mất mạng, báo rõ và Guest vẫn dùng được.
- OAuth rời trang nên mọi phần đang sửa, kể cả tài khoản hết phiên, phải xử lý trước. Dữ liệu Guest chỉ đưa vào tài khoản qua preview/xác nhận.
- Form email mặc định ẩn (`VITE_EMAIL_AUTH_ENABLED=false`). Luồng recovery cho tài khoản email cũ vẫn giữ; SMTP chưa bật.
- **Đã triển khai công khai:** [uitplans.netlify.app](https://uitplans.netlify.app/). Netlify project `uitplans`, ID `cc498549-9113-4a2b-8348-c86977e55eb7`, deploy `6acad08f07a5512ec02306a1`. Upload bản build của commit `fcd9dbba344d06f19dd8a96b9e4538856f28c9c1`; HTTP không có phiên đăng nhập trả 200 và đúng bundle `app-BDlLdjkO.js`.
- Đã đặt Supabase Site URL/Redirect URL cho site online, giữ callback local 5195.
- **Google OAuth chưa nghiệm thu:** đã tạo project Google riêng `uitplans` (project number `557080586465`), Hải tự chấp nhận điều khoản/chính sách dữ liệu và tạo client `uitplans web`. Client ID là `557080586465-e2mequ1i7hsmpvsvd6q3e1atkk6f3vj3.apps.googleusercontent.com`. Đang chờ Hải nhập Client ID/Secret tại Supabase; kiểm tra cấu hình công khai ngày 11/10/2026 vẫn trả Google provider tắt. Không bật Free trial/gói trả phí hoặc tự nhập secret thay Hải.

## 1. Hosting Netlify

Bản đầu đang dùng **manual deploy** bằng zip chứa `dist`, chưa liên kết Git để tự deploy. Cập nhật đúng project [uitplans](https://app.netlify.com/projects/uitplans); không tạo site mới mỗi lần sửa.

Khi nối Git sau này, chọn repository `haiphamt/majorweave-mini-project`, branch `fix/beaver-ui`; không cần merge vào main để triển khai.

`netlify.toml` đã đặt build `npm run build`, thư mục `dist`, Node 22. App dùng hash route, không cần rewrite mọi request thành index.html.

Đặt biến môi trường cho build:

| Biến | Giá trị |
|---|---|
| VITE_SUPABASE_URL | `https://svhbrhzedxohgnuoopir.supabase.co` |
| VITE_SUPABASE_PUBLISHABLE_KEY | Publishable key project uitplans |
| VITE_EMAIL_AUTH_ENABLED | `false` |

Client key là public; Google Client Secret chỉ đặt ở Supabase. Không đưa Google secret hoặc service_role vào build frontend. Build lại khi đổi biến VITE.

Chỉ ghi URL bản mới sau khi deploy thành công và kiểm tra site. Link demo Netlify cũ trong README chưa phải bằng chứng đã triển khai thay đổi này.

## 2. Google Auth Platform

Người dùng tự hoàn tất điều khoản Google Cloud, không cần kích hoạt thử nghiệm có billing. Tạo hoặc chọn project riêng cho uitplans; không sửa project NT118-DemoApi đang có của môn khác.

Thiết lập ứng dụng External, tên `uitplans.`, email hỗ trợ/liên hệ do Hải chọn. Chỉ dùng quyền nhận diện `openid`, `email`, `profile`; không yêu cầu Gmail, Drive hoặc scope nhạy cảm.

Tạo OAuth client loại **Web application**:

- Authorized JavaScript origins đã chuẩn bị: `https://uitplans.netlify.app` và `http://localhost:5195`. Không có hash/path ở origins. Local app vẫn có thể quay về `127.0.0.1:5195` qua server OAuth callback của Supabase.
- Authorized redirect URI: **`https://svhbrhzedxohgnuoopir.supabase.co/auth/v1/callback`**. Đây là callback của Supabase hosted, kể cả app đang chạy local. Không dùng callback của Supabase local `:54321`.
- Người dùng tự hoàn tất bước tạo credential và giữ Client Secret tại nơi quản lý bí mật. Không gửi secret vào chat.

Trong Supabase → Authentication → Sign In / Providers → Google, nhập Client ID/Client Secret rồi bật provider. Giữ kiểm tra nonce; không bật quyền liên kết thủ công hoặc quyền khác ngoài yêu cầu.

### Nếu chỉ còn Client ID, chưa lưu Client Secret

Google chỉ hiển thị/download Secret đầy đủ tại thời điểm tạo. Nếu đã đóng hộp tạo client mà chưa lưu Secret, vào **Clients → uitplans web → Client secrets → Add secret**. Hải tự tạo và lưu Secret mới ở nơi riêng tư, rồi dán trực tiếp vào Google provider của Supabase cùng Client ID hiện có. Bật **Enable Sign in with Google**, giữ **Skip nonce checks** tắt và **Save**. Không gửi Secret qua chat, không đưa vào file frontend hoặc Git. Client ID và callback không cần tạo lại.

Sau khi đăng nhập thử thành công bằng Secret mới, có thể vô hiệu hóa Secret cũ chưa dùng; không xóa/đổi Secret đang phục vụ người dùng khi chưa kiểm tra.

Kiểm tra Audience và các scope thực tế trước nghiệm thu. Google có ngoại lệ cho ứng dụng chỉ yêu cầu `openid`, `email`, `profile`: người dùng không cần nằm trong danh sách test ngay cả khi app còn **Testing**. Vì uitplans chỉ dùng nhận diện cơ bản, không coi Publishing hoặc mua tên miền là điều kiện bắt buộc để thử đăng nhập. Nếu sau này thêm quyền ngoài nhóm này, phải kiểm tra lại giới hạn Testing và yêu cầu xác minh. Chỉ xác nhận Google dùng được sau khi đã thử callback và lưu/tải dữ liệu thành công.

## 3. URL Supabase

Site URL đã đặt `https://uitplans.netlify.app/`; Redirect URLs gồm `https://uitplans.netlify.app/` và `http://127.0.0.1:5195/`. Không có wildcard. App truyền origin/path hiện tại để người dùng quay về đúng nơi bắt đầu.

Đường dẫn quay về app khác với callback Google → Supabase ở mục 2.

## 4. Nghiệm thu

1. Người chưa đăng nhập dùng Guest, tạo/lưu/reload một kế hoạch.
2. Sign in mở Continue with Google, không hiện form mật khẩu mặc định.
3. Khi có thay đổi chưa lưu, Google không rời trang; lưu/hủy/xuất trước khi thử lại.
4. Người dùng tự chọn tài khoản và xác nhận quyền Google. Callback mở được app, có email/tên tài khoản, không còn fragment token hiển thị ở URL.
5. Kho tài khoản mới không tự lấy Guest. Preview → Hủy giữ nguyên; xác nhận chuyển mới lưu cloud.
6. Đăng nhập cùng tài khoản ở thiết bị khác; kế hoạch đã lưu tải được. Đăng xuất trở lại Guest; tài khoản khác không thấy dữ liệu trước đó.
7. Thử hủy Google hoặc callback lỗi: có thông báo an toàn, không phản chiếu nội dung error_description, Guest vẫn hoạt động.

Guest theo origin: localhost và site online là hai kho khác nhau. Muốn mang kế hoạch local sang online, xuất backup ở local rồi nhập có preview tại site. Không xóa kho cũ để demo.

## Nguồn

- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google).
- [Google button branding](https://developers.google.com/identity/branding-guidelines); `public/google-g.png` lấy từ asset chính thức trên trang này.
- [Google: quản lý OAuth client và tạo Secret mới](https://support.google.com/cloud/answer/15549257?hl=en).
- [Google: trạng thái ứng dụng và ngoại lệ cho scope nhận diện cơ bản](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview).
- [Netlify deployment](https://docs.netlify.com/deploy/create-deploys/).
