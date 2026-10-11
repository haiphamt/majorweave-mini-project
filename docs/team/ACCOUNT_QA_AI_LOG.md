# Kiểm thử và AI Log — tài khoản uitplans.

## Yêu cầu và quyết định

- Người yêu cầu: Phạm Tuấn Hải, 10/10/2026.
- Yêu cầu: “Làm giống như Beaverplans đi.” sau khi xác nhận website dùng Guest, email/mật khẩu, xác nhận email và dữ liệu online.
- Hải trả lời chưa có project Supabase. Triển khai phần code/config/SQL; không tạo tài khoản hoặc giả nhận thư Gmail.
- Dùng Impeccable cho form/dialog/nav trong thiết kế kem/gạch đã duyệt. Dùng SDK Supabase chính thức; tái sử dụng WorkspacePersistence, controller, validation và backup/import v2.

## Kiểm thử đã chạy

`scripts/check-account.mjs` dùng production migration SQL trên Postgres/PGlite trong bộ nhớ, cùng controller/cloud adapter thật. Transport mang hình dạng SDK để mô phỏng phiên/lỗi mạng; không giả database bằng một assertion phản chiếu implementation.

| Trường hợp | Kết quả |
|---|---|
| Tải tài khoản mới không tự ghi defaults | PASS |
| Hai controller cùng revision: lần ghi cũ bị từ chối, giữ đề xuất và xuất backup | PASS |
| Bỏ đề xuất rồi tải bản online mới | PASS |
| RLS không cho tài khoản B đọc A | PASS |
| Không cho client ghi trực tiếp; Guest không gọi RPC ghi | PASS |
| Mất phản hồi sau commit: retry cùng request ID không lưu hai lần | PASS |
| Lỗi mạng trước ghi: dữ liệu server giữ nguyên, đề xuất retry được | PASS |
| Thay đổi object của caller trong khi lưu không làm đổi candidate | PASS |
| Đổi phiên ngay trước RPC không đưa dữ liệu A vào tài khoản B | PASS |
| Giả owner/schema/revision sai bị từ chối | PASS |

## Kiểm tra trình duyệt

- Bản chính: `http://127.0.0.1:5195/`, chưa cấu hình Supabase, tiếp tục Guest. Form đăng nhập/đăng ký có trạng thái chưa bật và trường nhận mật khẩu bị khóa.
- QA: `http://127.0.0.1:5196/`, gateway loopback 5317 với tài khoản tổng hợp `qa.a@example.test`/`qa.b@example.test`. SDK Supabase thật gọi transport QA; ghi/đọc dùng production SQL trên PGlite. Hai origin khác nhau nên không chạm dữ liệu học ở 5195.
- Tạo một kế hoạch Guest QA → đăng ký → màn hình chờ xác nhận email: PASS. Không có email thật được gửi.
- Đăng nhập A → Guest không tự nhập → xem trước/hủy/xác nhận nhập → kế hoạch online → tải lại vẫn còn: PASS.
- Hồ sơ đang sửa chặn đăng xuất; hủy form rồi đăng xuất → kế hoạch Guest gốc còn: PASS.
- Đăng nhập B → kho riêng chưa có kế hoạch A: PASS.
- Callback recovery mở trong tab mới trước HashRouter → màn hình mật khẩu mới; lỗi hai mật khẩu không khớp; gửi biểu mẫu vào gateway giả và hiện kết quả: PASS. Không thay mật khẩu tài khoản thật.

## Sửa sau vòng kiểm tra

- Tách bộ đếm gửi lại email xác nhận và email đặt lại: hai thao tác không dùng nhầm bộ đếm.
- Tài khoản mới chưa có lần ghi hiển thị Online, không giả báo đã lưu online.
- Capture recovery intent trước khi SDK dọn hash callback; mounted router sau khi SDK xử lý phiên.
- Ghi rõ nơi lưu theo Guest/tài khoản; cloud không đọc legacy guest state để hiện dữ liệu riêng.
- Dialog dùng ID tiêu đề riêng, tránh trùng khi recovery xuất hiện lúc một drawer khác đang mở.

## Chưa chạy và giới hạn

- Trạng thái ngày 10/10: chưa có project. Cập nhật hosted ngày 11/10 nằm ở mục dưới; SMTP/Gmail thật, CAPTCHA nếu bật, xác nhận email thật và đổi mật khẩu thật vẫn **CHƯA CHẠY**.
- Đồng bộ giữa hai máy vật lý và kiểm tra hiệu năng tải lớn: **CHƯA CHẠY**.
- Postgres/PGlite kiểm tra RLS/SQL thực; không thay thế nghiệm thu Supabase Auth hoặc HTTP gateway hosted.
- Không thay AI Log/bằng chứng cá nhân của năm bạn trong nhóm. Không merge vào main hoặc cập nhật Notion.

## Xác nhận bổ sung trong vòng QA

- Hai tab SDK/cloud controller độc lập: lưu mục tiêu Full Stack Open ở tab A, tab B đang sạch tự tải và hiện đã lưu: PASS (gateway QA, không phải hai máy thật).
- Đăng xuất ở tab B khi tab A đang sửa hồ sơ: tab A giữ nguyên tên chưa gửi, hiển thị xác nhận chuyển kho và nút chuyển bị khóa trước khi tích xác nhận: PASS.
- Khi phiên đã đổi nhưng controller cũ được giữ, thanh trạng thái báo Cần đăng nhập; biểu mẫu đang sửa báo Chưa lưu.

- Quên mật khẩu gửi yêu cầu riêng ngay cả khi email xác nhận đang đếm chờ: PASS; hiện thông báo trung tính và giới hạn gửi lại. Chỉ gọi gateway giả, không gửi thư Gmail.
- Desktop 1280px không tràn ngang. Mobile 390 × 844: form rộng 352px, không tràn ngang, các trường 16px và thao tác chính hiện đủ/scroll được. Có ảnh desktop/mobile; đã reset viewport sau kiểm tra.
- Dependency: SDK Supabase cho auth/REST; PGlite chỉ ở devDependencies để chạy migration/RLS/Postgres thực trong kiểm thử. Docker có trên máy nhưng engine không chạy; không khởi động dịch vụ hoặc tạo project ngoài.

## Kết quả gate bàn giao

- npm run check: PASS, gồm hồi quy 50 track và 8 nhóm kiểm tra cloud/SQL/RLS.
- npm run build: PASS. SDK Supabase tách thành chunk tải khi project được bật; Guest chưa cấu hình không tải SDK. App target ES2022 cho trình duyệt hiện đại. Bundle app khoảng 516 KB (gzip 133 KB), Vite còn cảnh báo ngưỡng 500 KB; không đổi ngưỡng để che cảnh báo. Đây chưa phải báo cáo đo hiệu năng trên thiết bị thật.
- git diff --check: không có lỗi whitespace; cảnh báo chuẩn hóa LF/CRLF trên Windows không thay nội dung.
- Bản chính có ảnh signin-main-unconfigured.png; ảnh signin-qa-preview.png là bản giao diện QA có cấu hình giả. QA được cách ly và không triển khai ra ngoài.

## Nối project thật — 11/10/2026

- Hải cung cấp URL/key công khai và yêu cầu cấu hình project `uitplans` (`svhbrhzedxohgnuoopir`). Plugin xác nhận project ACTIVE_HEALTHY, Postgres 17.11, schema public/migration ban đầu trống.
- Áp dụng migration hiện có bằng Supabase plugin, tên hosted `account_workspaces`. Không thay SQL sản phẩm, không xóa dữ liệu hoặc tạo project khác.
- `.env.local` trên máy Hải chứa URL/publishable key; Git xác nhận file bị bỏ qua. Không thêm secret/service_role vào frontend. Server chính chạy lại cổng 5195.
- Dashboard: Site URL và Redirect URLs `http://127.0.0.1:5195/` đã lưu thành công. Email provider, đăng ký và Confirm email được giữ bật. Đặt minimum password length = 8; Dashboard báo lưu thành công.
- Public Auth settings trả Email=true, disable_signup=false, mailer_autoconfirm=false: PASS.
- Hosted SQL xác nhận RLS bật, authenticated chỉ SELECT bảng của mình; anon không có quyền RPC ghi, authenticated có quyền RPC: PASS.
- Kiểm tra production function trên hosted Postgres trong **transaction rollback**: lần ghi đầu revision 1, retry cùng request ID vẫn revision 1, revision cũ bị PT409, ghi bảng trực tiếp bị từ chối, tài khoản B không đọc A, owner giả bị PT401: PASS. Chỉ dùng UUID tổng hợp, không tạo mật khẩu/phiên đăng nhập, không gửi thư. Sau rollback: 0 workspace và 0 user thử còn lại.
- Hosted HTTP Data API với publishable key, chưa đăng nhập: SELECT bảng và RPC ghi đều bị 401: PASS. Đây kiểm tra quyền Guest, không phải nghiệm thu lưu bằng JWT thật.
- Browser chính: dialog Sign in bật, trường Email nhập được, không còn banner chưa cấu hình: PASS. Không nhập mật khẩu hoặc tạo tài khoản thay người dùng. Ảnh `D:/IS207/artifacts/supabase-2026-10-11/signin-configured.png` và `redirect-configured.png`.
- Security Advisor có một WARN: authenticated được gọi SECURITY DEFINER RPC. Đây là quyền có chủ đích để ghi qua CAS khi client không có INSERT/UPDATE trực tiếp. Đã kiểm tra `auth.uid()`/owner, search_path rỗng, EXECUTE chỉ authenticated, owner mismatch và RLS. Không đổi sang INVOKER để làm mất cảnh báo và mở quyền ghi trực tiếp. [Giải thích linter](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- `npm run check` và `npm run build`: PASS sau cấu hình thật; cảnh báo bundle >500 KB vẫn còn như trước.
- Dashboard xác nhận Custom SMTP **tắt**. Chưa gửi/nhận Gmail, xác nhận signup, đặt lại mật khẩu hoặc đồng bộ tài khoản trên hai máy thật. Cần SMTP và người dùng tự nhập thông tin tài khoản để nghiệm thu các bước này; không tắt Confirm email để vượt giới hạn SMTP mặc định.

## Guest + Google — 11/10/2026

- Hải chọn phương án hosting miễn phí/Guest/Google, email qua SMTP để sau. Dùng Supabase SDK/kho hiện có; không thêm SDK Google hoặc server mới.
- `prepareGoogleSignIn` từ chối OAuth khi còn phần đang sửa (bao gồm controller cloud hết phiên), chỉ yêu cầu provider Google/choose account/basic identity và truyền callback về origin app.
- Check bổ sung: phần đang sửa không gọi OAuth, URL callback truyền đúng, không xin scope dữ liệu Gmail/Drive, lỗi mạng/API trả lỗi an toàn, callback hủy có thông báo và không phản chiếu error_description: PASS.
- Kiểm tra dialog trên QA origin 5196: form email mặc định ẩn; Google provider đang tắt thì nút bị khóa/báo cấu hình; Keep planning as a guest trở lại Explore: PASS.
- Desktop và mobile 390×844: dialog 352px, không tràn ngang; Google asset lấy từ branding chính thức. Ảnh tại `D:/IS207/artifacts/google-2026-10-11/signin-desktop.png` và `signin-mobile.png`.
- Callback `access_denied` được kiểm tra ở tab QA mới, tự mở thông báo; không tạo phiên/đăng nhập thật: PASS. Không sửa dữ liệu ở origin 5195.
- `npm run check`/`npm run build`: PASS sau thay đổi Google. Bundle còn cảnh báo >500KB như trước.
- Hải tự hoàn tất điều khoản Google Cloud và onboarding Netlify. Project Google `uitplans` đã tạo riêng, không sửa project môn khác. OAuth client và deploy thực tế đang cấu hình; chưa nghiệm thu Google/đồng bộ đa thiết bị thật.

### Triển khai Netlify

- Bản source `fcd9dbba344d06f19dd8a96b9e4538856f28c9c1` đã push trước build/upload. Archive `uitplans-netlify.zip` chứa build `dist` (401914 bytes), SHA256 `87998E1D84A150DB361FD3CB59C2F9A1757E6825349311B19DE7EED720E1B536`.
- Chrome ban đầu từ chối upload vì thiếu quyền file URLs. Hải tự bật quyền, extension nối lại; upload bằng API file chooser được hỗ trợ, không dùng cách điều khiển khác để vượt chặn.
- Netlify project mới `cc498549-9113-4a2b-8348-c86977e55eb7`, deploy `6acad08f07a5512ec02306a1`, tên cuối `uitplans`, URL `https://uitplans.netlify.app`. Đã chuyển từ private mặc định sang Public theo yêu cầu mọi người dùng.
- Truy cập HTTP không có cookie/session trả 200, bundle khớp `app-BDlLdjkO.js`: PASS. Browser online mở Explore và dialog Google; provider chưa bật thì báo cấu hình/khóa nút: PASS.
- Đã lưu Supabase Site URL `https://uitplans.netlify.app/` và thêm Redirect URL đó, giữ local `http://127.0.0.1:5195/`.
- Hải đã tự tạo OAuth client Web application và lưu credentials vào Supabase. Ban đầu lưu credentials nhưng Google vẫn tắt/Skip nonce checks bật; sau khi Hải đổi và Save, endpoint `/auth/v1/settings` trả Google true, dashboard xác nhận Skip nonce checks false và Allow users without an email false: PASS cấu hình.
- Trên site online, Continue with Google bật và chuyển được tới `accounts.google.com`, màn hình Choose an account; scope của request là `email profile`, không có Gmail/Drive: PASS bước khởi tạo OAuth. Ảnh `D:/IS207/artifacts/google-2026-10-11/google-account-chooser.png`. Chờ Hải tự chọn tài khoản/xác nhận quyền; callback, tạo phiên và lưu/tải workspace thật chưa chạy.
- Google công bố ngoại lệ Testing cho scope nhận diện cơ bản; không coi chuyển Production là điều kiện bắt buộc để thử Google của uitplans. Chưa xác minh branding, Google hiển thị domain Supabase ở màn hình chọn tài khoản.
- Chưa nối Git tự deploy; đây là manual deploy. Không merge main, không mua tên miền hoặc bật gói trả phí.
