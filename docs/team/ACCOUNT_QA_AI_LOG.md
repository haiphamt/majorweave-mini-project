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

- Tạo Supabase project, migration trên hosted project, SMTP/Gmail thật, CAPTCHA nếu bật, xác nhận email thật, đổi mật khẩu thật: **CHƯA CHẠY — chưa có project**.
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
