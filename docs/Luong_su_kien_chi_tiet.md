# uitplans. — 44 luồng thao tác hiện tại

Cập nhật 11/10/2026. Áp dụng cho mọi hướng học đã tích hợp.

## Hệ thống hiện tại và quy tắc dữ liệu

- Bản nội dung 11/10/2026: Guest + Google + Supabase, triển khai tại https://uitplans.netlify.app/. Flowchart cũ được giữ để đối chiếu; bộ 15 Activity và 8 Sequence được bổ sung theo nghiệp vụ và trao đổi thành phần.
- Guest không cần đăng nhập và không phải Supabase Anonymous Auth. Workspace học lưu bằng IndexedDB theo origin trình duyệt; đổi máy/trình duyệt/domain không tự có dữ liệu Guest.
- Google OAuth qua Supabase Auth chỉ dùng nhận diện cơ bản. Guest và từng tài khoản có kho riêng; đăng nhập không tự nhập Guest. Form email mặc định ẩn, SMTP/Resend chưa dùng cho phương án hiện tại.
- Tài khoản đọc workspace v2 từ bảng uitplans_workspaces. RLS chỉ cho đọc row của chính user; ghi qua RPC save_uitplans_workspace kiểm tra auth.uid(), owner và expected revision. Google Client Secret không nằm trong frontend.
- Đồng bộ dùng kiểm tra revision mỗi 15 giây khi trang hiển thị, khi focus/online và nút tải mới. Chỉ tự tải khi không có phần đang sửa. Không dùng Realtime/WebSocket hoặc hợp nhất xung đột tự động.
- Mọi lần ghi chỉ thành công sau xác nhận IndexedDB transaction hoặc cloud commit. Lỗi giữ candidate; retry cloud cùng candidate/revision giữ request ID. Candidate chưa lưu trên màn hình không phải hàng đợi offline bền vững.
- Lưu lựa chọn học khác tạo kế hoạch. Tạo lại và nhập dữ liệu có preview/xác nhận; hủy không ghi. Tuần đã chốt và lịch sử chỉ đọc. Phút học là dự kiến, completion do người dùng tự ghi nhận.
- Minh chứng: Google thật + cloud save/reload đã chạy ngày 11/10. RLS/CAS có kiểm tra SQL hosted và PGlite; nhánh lỗi UI có fixture RAM/gateway riêng. Chưa thử hai thiết bị vật lý; mô tả luồng không đồng nghĩa mọi luồng đã kiểm thử online.
- Đối chiếu code: src/auth/{google,supabase,AuthProvider,AccountControls}; src/app/{AccountWorkspace,workspace-controller}; src/persistence/{cloud-workspace,roadmap-store,guest-backup,backup,migration}; supabase/migrations/. Backend Node.js/Express trong danh mục là nội dung học, không phải server riêng của uitplans.

Xem [kiểm thử](testing.md), [cấu hình tài khoản](deployment.md) và [kiến trúc](architecture.md).

Các mã EF01–EF36 được giữ để đối chiếu tài liệu cũ. EF37–EF44 bổ sung Guest, Google, tải/lưu cloud, nhập Guest, đồng bộ và chuyển kho. Các hình trong tài liệu này vẫn là flowchart tuyến tính; xem [bộ Activity và Sequence](diagrams/uml-20261011/README.md) để đọc nghiệp vụ và trao đổi giữa các thành phần.

## EF01 — Chọn ngành học

**Trang:** Explore

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn khoa và ngành

### Luồng chính

1. Cập nhật ngành trong hồ sơ. Bước xử lý.
2. Ưu tiên hướng liên quan. Bước tiếp theo.
3. Lưu ngành đã chọn. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Bỏ ngành vẫn giữ khoa đang chọn trong phiên Explore; khoa riêng này chưa lưu qua reload. Chủ động bỏ khoa mới xóa ngành. Lưu lỗi: giữ lựa chọn và báo lỗi.

## EF02 — Khám phá khoa khác

**Trang:** Explore

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Đổi bộ lọc khoa

### Luồng chính

1. Giữ ngành trong hồ sơ. Bước xử lý.
2. Lọc hướng theo khoa. Bước tiếp theo.
3. Mở hướng muốn tìm hiểu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Bộ lọc không thay kế hoạch đang học.

## EF03 — Tìm hướng học

**Trang:** Explore

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Tìm kiếm hoặc đổi nhóm

### Luồng chính

1. Kết hợp các bộ lọc. Bước xử lý.
2. Hiển thị hướng phù hợp. Bước tiếp theo.
3. Mở chi tiết hướng. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không có kết quả: xóa hoặc nới bộ lọc.

## EF04 — Xem bảng ngành và hướng

**Trang:** Explore

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở bảng ngành → hướng

### Luồng chính

1. Xem 12 ngành và liên hệ. Bước xử lý.
2. Chọn ngành để khám phá. Bước tiếp theo.
3. Danh sách được ưu tiên. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đóng bảng giữ các lựa chọn.

## EF05 — Mở hướng học

**Trang:** Explore → Path detail

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở một hướng

### Luồng chính

1. Tìm nội dung của hướng. Bước xử lý.
2. Mở nhánh đang nhớ hoặc đầu tiên. Bước tiếp theo.
3. Hiển thị chặng và nguồn. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Nhánh lỗi: báo lỗi, có thể về Khám phá.

## EF06 — Đổi hướng và nhánh

**Trang:** Path detail

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn hướng hoặc nhánh

### Luồng chính

1. Tìm nhánh thuộc hướng. Bước xử lý.
2. Mở bản nháp riêng. Bước tiếp theo.
3. Giữ kế hoạch đang học. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đổi nhánh không tự tạo hoặc thay kế hoạch.

## EF07 — Mở roadmap tham khảo

**Trang:** Path detail

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở link roadmap

### Luồng chính

1. Đọc liên kết của nhánh. Bước xử lý.
2. Mở nguồn ở tab mới. Bước tiếp theo.
3. Quay lại với lựa chọn giữ nguyên. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- BA dùng nguồn nghề ngoài roadmap.sh.

## EF08 — Xem một chặng

**Trang:** Path detail

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở chặng trong Lộ trình

### Luồng chính

1. Hiện kỹ năng và kết quả. Bước xử lý.
2. Xem nguồn và bài thực hành. Bước tiếp theo.
3. Chờ áp dụng hoặc hủy. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đóng hoặc Hủy không áp dụng thay đổi.

## EF09 — Lọc nguồn của chặng

**Trang:** Chi tiết chặng

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Đổi ngôn ngữ hoặc miễn phí

### Luồng chính

1. Lọc danh sách nguồn. Bước xử lý.
2. Giữ nguồn đang chọn. Bước tiếp theo.
3. Xem nguồn phù hợp. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Danh sách trống không xóa nguồn đã chọn.

## EF10 — Chọn nguồn học

**Trang:** Chi tiết chặng

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn nguồn này

### Luồng chính

1. Đổi lựa chọn trong cửa sổ. Bước xử lý.
2. Kiểm tra chặng đang chỉnh. Bước tiếp theo.
3. Chờ Áp dụng và lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Mở link không tự chọn nguồn đó.

## EF11 — Lưu lựa chọn chặng

**Trang:** Chi tiết chặng

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Áp dụng và lưu

### Luồng chính

1. Áp dụng chặng, nguồn, đã biết. Bước xử lý.
2. Lưu lựa chọn và chờ kết quả. Bước tiếp theo.
3. Đóng sau khi lưu thành công. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: giữ bản đang sửa để thử lại.

## EF12 — Lưu lựa chọn nhánh

**Trang:** Path detail

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Lưu lựa chọn

### Luồng chính

1. Giữ bản nháp của nhánh. Bước xử lý.
2. Lưu và đợi hoàn tất. Bước tiếp theo.
3. Thông báo đã lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: giữ bản đang sửa, không báo thành công.

## EF13 — Tìm nguồn học

**Trang:** Path detail · Nguồn học

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Tìm kiếm và lọc nguồn

### Luồng chính

1. Kết hợp từ khóa và ngôn ngữ. Bước xử lý.
2. Lọc miễn phí nếu được chọn. Bước tiếp theo.
3. Mở tài liệu ở tab mới. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Bộ lọc không tự đổi nguồn trong bản nháp.

## EF14 — Lưu mục tiêu chứng nhận

**Trang:** Path detail · Chứng nhận

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Lưu hoặc bỏ lưu chứng nhận

### Luồng chính

1. Đổi trạng thái mục tiêu. Bước xử lý.
2. Lưu vào kho đang sử dụng. Bước tiếp theo.
3. Cập nhật mục đã lưu ở Hồ sơ. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lưu mục tiêu không có nghĩa đã được cấp chứng nhận. Guest lưu IndexedDB; tài khoản lưu Supabase.

## EF15 — Tùy chỉnh roadmap

**Trang:** My roadmap

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn chặng cần học

### Luồng chính

1. Cập nhật bản nháp riêng. Bước xử lý.
2. Kiểm tra chặng tiên quyết. Bước tiếp theo.
3. Chờ lưu hoặc tạo kế hoạch. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Thiếu nền tảng: chọn chặng cần học hoặc xác nhận đã biết.

## EF16 — Đánh dấu kỹ năng đã biết

**Trang:** My roadmap

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Đổi dấu Đã biết

### Luồng chính

1. Giữ kỹ năng trong nền tảng. Bước xử lý.
2. Bỏ bài tương ứng khi sinh lịch. Bước tiếp theo.
3. Cập nhật giờ thực hành. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đã biết không tạo lịch sử hoàn thành giả.

## EF17 — Lưu lựa chọn học

**Trang:** My roadmap

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Lưu lựa chọn

### Luồng chính

1. Kiểm tra lựa chọn đang sửa. Bước xử lý.
2. Lưu vào kho đang sử dụng. Bước tiếp theo.
3. Giữ kế hoạch đã tạo. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: thử lại hoặc bỏ bản chưa lưu có xác nhận. Lưu lựa chọn không tự tạo hoặc thay kế hoạch.

## EF18 — Chọn ngày bắt đầu

**Trang:** My roadmap

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn ngày và tạo lịch

### Luồng chính

1. Kiểm tra ngày bắt đầu. Bước xử lý.
2. Đề nghị Thứ Hai nếu cần. Bước tiếp theo.
3. Chờ đồng ý hoặc quay lại. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Hủy đề nghị không tạo kế hoạch.

## EF19 — Chọn kế hoạch đang xem

**Trang:** My plan

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Đổi Kế hoạch đang xem

### Luồng chính

1. Tìm kế hoạch đã lưu. Bước xử lý.
2. Lưu lựa chọn đang xem. Bước tiếp theo.
3. Hiển thị việc của kế hoạch. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Có bản lưu lỗi: xử lý trước khi đổi.

## EF20 — Xem tuần hoặc việc chưa xếp lịch

**Trang:** My plan · Việc học

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Chọn tuần, mũi tên, Today hoặc Chưa xếp lịch

### Luồng chính

1. Đọc khoảng ngày và tiến độ của tuần. Bước xử lý.
2. Lọc theo chặng rồi nhóm theo ngày. Bước tiếp theo.
3. Hiển thị việc và nguồn tương ứng. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Today chỉ dùng khi ngày hiện tại thuộc kế hoạch; bộ lọc chặng không thay dữ liệu hoặc phạm vi chốt tuần. Tuần chốt hoặc phiên bản cũ chỉ đọc.

## EF21 — Thêm công việc

**Trang:** My plan · Việc học

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Thêm việc học

### Luồng chính

1. Nhập tiêu đề, chặng và phút. Bước xử lý.
2. Chọn tuần hoặc chưa xếp. Bước tiếp theo.
3. Kiểm tra rồi lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Hủy không thêm; nhập sai giữ form và hiện lỗi.

## EF22 — Chỉnh công việc

**Trang:** My plan · Việc học

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở menu công việc → Sửa

### Luồng chính

1. Mở nội dung hiện có. Bước xử lý.
2. Sửa thời gian, ghi chú, vị trí. Bước tiếp theo.
3. Kiểm tra rồi lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lưu lỗi giữ bản sửa; tuần chốt không sửa.

## EF23 — Chuyển việc về chưa xếp lịch

**Trang:** My plan · Việc học

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở menu → Chuyển về chưa xếp lịch

### Luồng chính

1. Giữ công việc và nguồn. Bước xử lý.
2. Bỏ vị trí tuần và ngày. Bước tiếp theo.
3. Lưu kế hoạch đã chỉnh. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi không làm mất việc; có thể thử lại.

## EF24 — Xem thống kê

**Trang:** My plan · Thống kê

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở Thống kê

### Luồng chính

1. Đọc kế hoạch đang xem. Bước xử lý.
2. Tổng hợp việc và tuần. Bước tiếp theo.
3. Hiển thị tiến độ. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Thời gian là dự kiến, không phải bộ đếm học thực tế.

## EF25 — Xem tuần và lịch sử

**Trang:** My plan · Các tuần

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở Các tuần hoặc phiên bản cũ

### Luồng chính

1. Chọn tuần muốn xem. Bước xử lý.
2. Đọc kết quả phiên bản. Bước tiếp theo.
3. Quay lại bản hiện tại. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Phiên bản lịch sử không được sửa.

## EF26 — Xem nhịp học

**Trang:** Profile

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở nhịp học

### Luồng chính

1. Đọc lần hoàn thành mọi plan. Bước xử lý.
2. Tổng hợp theo ngày ghi nhận. Bước tiếp theo.
3. Xem ngày đã học. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không đếm lại bản lịch sử; dữ liệu thiếu ngày không bịa ngày.

## EF27 — Hủy chỉnh hồ sơ

**Trang:** Profile

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Hủy thay đổi

### Luồng chính

1. Bỏ chỉnh sửa trong form. Bước xử lý.
2. Đọc hồ sơ đã lưu. Bước tiếp theo.
3. Khôi phục tên, ngành, múi giờ. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không xóa kế hoạch hoặc nhịp học.

## EF28 — Mở sao lưu và khôi phục

**Trang:** Profile · Data

**Điều kiện:** Workspace đang mở là Guest hoặc tài khoản. Các thao tác ghi cần dữ liệu đã tải, không có lần lưu hay bản chờ xử lý; chỉ báo thành công sau khi kho đang dùng xác nhận.

**Bắt đầu:** Mở phần dữ liệu

### Luồng chính

1. Chọn xuất hoặc file để nhập. Bước xử lý.
2. Hiện tùy chọn khi có file. Bước tiếp theo.
3. Xem trước rồi xác nhận. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Xuất/nhập dùng workspace đang mở. Dữ liệu v1 chỉ được đọc trong kho Guest; tài khoản không tự đọc dữ liệu cũ của Guest.

## EF29 — Chọn nhánh và tạo plan v2

**Trang:** My roadmap

**Điều kiện:** Workspace đã tải; draft hợp lệ.

**Bắt đầu:** Tạo kế hoạch mới

### Luồng chính

1. Chọn nhánh, chặng và nguồn. 18 hướng / 50 cấu hình.
2. Kiểm tra draft và sinh lịch. Tiên quyết, giờ/tuần, ngày.
3. Chờ kho dữ liệu xác nhận. ID mới; IndexedDB hoặc Supabase.
4. Plan mới được lưu. Mở My plan để tiếp tục.

### Hủy, thay thế và lỗi

- Draft lỗi: hiển thị lỗi, không ghi.
- Save lỗi: giữ candidate để retry hoặc xuất.
- Tạo plan mới giữ plan cũ; khám phá nhánh khác không tự thay plan.

## EF30 — Tạo lại có preview/history

**Trang:** My roadmap

**Điều kiện:** Có active plan và draft hợp lệ.

**Bắt đầu:** Mở Điều chỉnh kế hoạch đã tạo → Xem trước tạo lại

### Luồng chính

1. Sinh preview và đối chiếu. Chưa sửa plan đã lưu.
2. Chọn xác nhận hoặc hủy. Hủy không ghi.
3. Lưu bản mới và history. Chỉ cập nhật sau commit.
4. Plan được tạo lại. Giữ completion phù hợp.

### Hủy, thay thế và lỗi

- Plan/draft thay đổi: báo conflict, xem lại preview.
- Lưu lỗi: giữ proposal, không báo success.

## EF31 — Hoàn thành và undo v2

**Trang:** My plan

**Điều kiện:** Plan đang xem và tuần còn mở.

**Bắt đầu:** Đổi dấu hoàn thành

### Luồng chính

1. Tạo completion hoặc undo. Giữ ngày/timezone lần ghi.
2. Lưu với expected revision. Không ghi đè tab mới.
3. Cập nhật plan và nhịp học. Chờ lưu xong trước reload.
4. Tiến độ được cập nhật. Completion ledger giữ lịch sử.

### Hủy, thay thế và lỗi

- Save lỗi: giữ candidate, retry hoặc bỏ có xác nhận.
- Snapshot tuần chốt chỉ đọc.

## EF32 — Chốt tuần và giữ snapshot

**Trang:** My plan

**Điều kiện:** Tuần mở, chưa có candidate chờ.

**Bắt đầu:** Chốt tuần

### Luồng chính

1. Xem việc xong/chưa xong. Snapshot trước xử lý.
2. Chọn xử lý việc chưa xong. Dời tuần / backlog / skip.
3. Xác nhận và lưu plan. Hủy giữ tuần mở.
4. Tuần đã chốt chỉ đọc. Thống kê / Các tuần đọc kết quả chốt.

### Hủy, thay thế và lỗi

- Lỗi/conflict: không chốt âm thầm.
- Không có tuần đích hợp lệ: từ chối.

## EF33 — Lưu Profile và timezone

**Trang:** Profile

**Điều kiện:** Workspace đã tải.

**Bắt đầu:** Lưu hồ sơ

### Luồng chính

1. Sửa tên, ngành, múi giờ. Validate IANA và tên.
2. Lưu qua callback chung. Chờ kho đang sử dụng xác nhận.
3. Cập nhật hồ sơ/nhịp học. Ngày completion cũ giữ.
4. Hồ sơ được giữ khi reload. Guest cục bộ; tài khoản online.

### Hủy, thay thế và lỗi

- Hủy: trả form về profile đã lưu.
- Giá trị sai/lưu lỗi: giữ form và báo lỗi.
- Tên hiển thị là tùy chọn; sửa hồ sơ không đổi danh tính Google.

## EF34 — Xuất và nhập backup v2

**Trang:** Profile

**Điều kiện:** Workspace đã tải; chọn JSON hợp lệ.

**Bắt đầu:** Xem trước nhập file

### Luồng chính

1. Kiểm tra file và phiên bản. Không lọc bỏ lỗi âm thầm.
2. Chọn skip hoặc copy. Preview chưa ghi dữ liệu.
3. Xác nhận rồi chờ commit. Giữ proposal nếu lỗi.
4. Nhập giữ plan hiện có. Có thể xuất JSON để chuyển máy.

### Hủy, thay thế và lỗi

- Cancel không ghi; ID trùng mặc định skip.
- File lỗi/version lạ: từ chối toàn bộ.
- Save lỗi: retry cùng ID hoặc xuất proposal.

## EF35 — Chuyển dữ liệu v1 an toàn

**Trang:** Profile · Data (Guest)

**Điều kiện:** Kho Guest đọc được raw v1; draft đã lưu/bỏ. Tài khoản không tự đọc key v1.

**Bắt đầu:** Xem trước chuyển v1

### Luồng chính

1. Đọc raw và fingerprint. Không sửa key nguồn.
2. Xem preview và cảnh báo. Thiếu bối cảnh: cần bổ sung.
3. Xác nhận append vào v2. Ghi migration fingerprint.
4. Dữ liệu v1 được giữ. Chuyển lại không nhập trùng.

### Hủy, thay thế và lỗi

- Cancel không ghi.
- Unknown IDs và completion thiếu ngày được giữ.
- Lỗi/conflict giữ proposal để retry.

## EF36 — Lưu lỗi và xung đột phiên bản

**Trang:** Workspace

**Điều kiện:** Hai tab Guest cùng DB hoặc hai phiên cùng tài khoản; cùng revision ban đầu.

**Bắt đầu:** Phiên cũ lưu thay đổi

### Luồng chính

1. Phiên A lưu dữ liệu mới. Revision kho dữ liệu tăng.
2. Phiên B lưu với revision cũ. IndexedDB hoặc RPC từ chối.
3. Giữ bản đang sửa của B. Xuất hoặc bỏ rồi tải bản mới.
4. Không ghi đè phiên A. Không báo lưu thành công giả.

### Hủy, thay thế và lỗi

- Abort/quota Guest hoặc lỗi mạng cloud: giữ candidate.
- Retry cùng dữ liệu cloud dùng cùng request ID, tránh lưu hai lần khi mất phản hồi.
- Retry đơn thuần không tự hòa trộn conflict. Xuất bản sửa; xác nhận bỏ trước khi tải bản mới.
- Load lỗi không thay defaults rồi ghi đè.

## EF37 — Bắt đầu với Guest

**Trang:** Toàn ứng dụng

**Điều kiện:** Không có phiên tài khoản; IndexedDB khả dụng.

**Bắt đầu:** Mở website hoặc tiếp tục Guest

### Luồng chính

1. Khôi phục trạng thái phiên. Không tạo tài khoản Guest online.
2. Mở workspace Guest. IndexedDB theo origin trình duyệt.
3. Hiển thị dữ liệu đã lưu. Kho trống cho bắt đầu kế hoạch.
4. Dùng Guest ngay. Không cần email hoặc mật khẩu.

### Hủy, thay thế và lỗi

- Guest khác origin/trình duyệt/thiết bị có kho khác.
- Load lỗi: hiện lỗi và thử tải lại, không tự ghi defaults đè dữ liệu.
- Dùng backup để chuyển Guest sang origin hoặc thiết bị khác.

## EF38 — Bắt đầu đăng nhập Google

**Trang:** Sign in

**Điều kiện:** Project cấu hình; provider Google bật; không có form/draft/proposal/preview đang chờ.

**Bắt đầu:** Continue with Google

### Luồng chính

1. Kiểm tra phần chưa lưu. Người dùng lưu hoặc xử lý trước.
2. Xin URL OAuth từ Supabase. Callback về origin ứng dụng.
3. Chuyển tới Google. Người dùng tự chọn tài khoản.
4. Google nhận yêu cầu đăng nhập. Chỉ quyền nhận diện cơ bản.

### Hủy, thay thế và lỗi

- Provider tắt hoặc không kiểm tra được: không giả báo đăng nhập.
- Còn phần đang sửa: chặn chuyển trang, giữ dữ liệu.
- Mạng/API lỗi: hiện thông báo, có thể tiếp tục Guest.
- Đăng nhập Google không yêu cầu SMTP hoặc quyền Gmail/Drive.

## EF39 — Nhận callback Google

**Trang:** Google → Supabase Auth → website

**Điều kiện:** Người dùng tự chọn tài khoản và xác nhận nếu Google hỏi.

**Bắt đầu:** Google trả kết quả OAuth

### Luồng chính

1. Supabase Auth xử lý callback. Website không giữ Google Secret.
2. SDK khôi phục phiên. Trước khi mở HashRouter.
3. Chọn workspace theo user ID. Không tự nhập dữ liệu Guest.
4. Mở website với phiên tài khoản. Dữ liệu học tải riêng sau xác thực.

### Hủy, thay thế và lỗi

- Hủy hoặc access_denied: thông báo an toàn, có thể thử lại/Guest.
- Có phiên không đồng nghĩa đã tải hoặc lưu kế hoạch online thành công.
- Phiên đổi khi còn chỉnh sửa: giữ kho cũ và yêu cầu xử lý trước (EF43).

## EF40 — Tải workspace tài khoản

**Trang:** AccountWorkspace

**Điều kiện:** Có phiên hợp lệ khớp user ID của kho đang mở.

**Bắt đầu:** Đăng nhập hoặc tải lại website

### Luồng chính

1. Kiểm tra phiên và user ID. Không dùng email làm khóa owner.
2. Đọc workspace qua Data API. RLS chỉ cho đọc dữ liệu của mình.
3. Kiểm tra schema và revision. Workspace v2 hợp lệ mới hiển thị.
4. Hiển thị kế hoạch tài khoản. Có thể tải trên thiết bị khác.

### Hủy, thay thế và lỗi

- Chưa có row: hiển thị workspace trống, không tự ghi lên server.
- Lỗi đọc/schema/revision: báo lỗi, không dùng defaults để ghi đè.
- Phiên đổi/hết hạn: không đọc hoặc ghi vào tài khoản khác.
- Hai thiết bị vật lý chưa được nghiệm thu; đây là mô tả code hiện hành.

## EF41 — Đưa dữ liệu Guest vào tài khoản

**Trang:** Menu tài khoản

**Điều kiện:** Đã đăng nhập; kho cloud đúng user; không có phần đang sửa hoặc lưu.

**Bắt đầu:** Xem trước dữ liệu Guest

### Luồng chính

1. Đọc và xuất kho Guest. Bản gốc giữ trên trình duyệt.
2. Tạo preview nhập bản sao. Hồ sơ/lựa chọn là tùy chọn.
3. Xác nhận rồi chờ lưu. Qua importer và kho Supabase.
4. Thêm kế hoạch vào tài khoản. Giữ các plan online đang có.

### Hủy, thay thế và lỗi

- Guest trống: thông báo, không ghi dữ liệu.
- Hủy/đóng preview: không nhập; bản Guest giữ nguyên.
- Lỗi đọc/lưu hoặc revision đổi: giữ dữ liệu/preview và báo lỗi.
- Không tự nhập Guest ngay sau đăng nhập; plan nhập dùng ID bản sao.

## EF42 — Tải cập nhật từ phiên khác

**Trang:** Tài khoản online

**Điều kiện:** Kho cloud đang mở; trang hiển thị; không có lần kiểm tra đang chạy hoặc load/save.

**Bắt đầu:** Đến chu kỳ 15 giây, focus hoặc online

### Luồng chính

1. Đọc revision online. Chỉ kho thuộc tài khoản đang mở.
2. Đối chiếu với revision đang xem. Có thay đổi mới hay không.
3. Tải khi màn hình sạch. Giữ form/draft/preview đang sửa.
4. Nhận bản mới hoặc thông báo. Có nút Tải kế hoạch mới nhất.

### Hủy, thay thế và lỗi

- Có form/draft/proposal/preview: chỉ báo đã đổi, không tự tải đè.
- Mạng/phiên lỗi: thông báo, giữ workspace đang xem.
- Không dùng Supabase Realtime/WebSocket; đồng bộ bằng kiểm tra revision.
- Không có hàng đợi offline bền vững; pending trên màn hình không bảo đảm giữ sau đóng tab/reload.

## EF43 — Đăng xuất và bảo vệ chuyển kho

**Trang:** Menu tài khoản / AccountWorkspace

**Điều kiện:** Phiên tài khoản có thể thay đổi từ tab này hoặc tab khác.

**Bắt đầu:** Sign out hoặc sự kiện đổi phiên

### Luồng chính

1. Kiểm tra form và phần chưa lưu. Chặn Sign out nếu còn pending.
2. Đăng xuất phiên cục bộ. Dữ liệu cloud không bị xóa.
3. Mở lại kho Guest khi an toàn. Kho của từng tài khoản tách riêng.
4. Tiếp tục với Guest hoặc kho mới. Không trộn dữ liệu các tài khoản.

### Hủy, thay thế và lỗi

- Sign out API lỗi: không giả xác nhận thành công. SDK có thể đã bỏ phiên local; mở kho theo sự kiện phiên thực tế.
- Tab khác làm đổi phiên khi đang sửa: giữ kho cũ, hiện cảnh báo chuyển kho.
- Chỉ chuyển sau khi người dùng tích xác nhận đã giữ dữ liệu và đồng ý bỏ phần chưa lưu.
- Export không chứa nội dung form chưa gửi; cần giữ riêng trước khi xác nhận.

## EF44 — Lưu workspace tài khoản

**Trang:** Shared controller → Supabase

**Điều kiện:** Workspace v2 hợp lệ; phiên khớp owner; expected revision hợp lệ.

**Bắt đầu:** Lưu hồ sơ, lựa chọn hoặc kế hoạch

### Luồng chính

1. Controller giữ candidate. UI chưa báo thành công.
2. RPC kiểm tra owner và revision. CAS trong transaction server.
3. Kiểm tra phản hồi đã lưu. Revision tăng đúng một lần.
4. Cập nhật UI từ bản đã commit. Hiển thị Đã lưu online.

### Hủy, thay thế và lỗi

- RLS cho SELECT own row; client không có quyền INSERT/UPDATE trực tiếp.
- PT409: conflict, giữ candidate, không tự ghi đè.
- Sai owner/hết phiên: từ chối ghi; cùng tài khoản đăng nhập lại hoặc xuất bản sửa.
- Mất mạng/phản hồi: giữ candidate để thử lại; adapter giữ request ID cho cùng candidate/revision.
- Đây là Supabase backend của ứng dụng; Node.js/Express trong danh mục là hướng học.