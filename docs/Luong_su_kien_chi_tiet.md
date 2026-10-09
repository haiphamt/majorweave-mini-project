# UIT - Path — 36 luồng thao tác hiện tại

Cập nhật 09/10/2026. Áp dụng cho mọi hướng học đã tích hợp.

## EF01 — Chọn ngành học

**Trang:** Explore

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn khoa và ngành

### Luồng chính

1. Cập nhật hồ sơ. Thao tác của người học.
2. Ưu tiên hướng liên quan. Phản hồi của hệ thống.
3. Lưu ngành đã chọn. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lưu lỗi: giữ lựa chọn và báo lỗi.

## EF02 — Khám phá khoa khác

**Trang:** Explore

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Đổi bộ lọc khoa

### Luồng chính

1. Giữ ngành trong hồ sơ. Thao tác của người học.
2. Lọc hướng theo khoa. Phản hồi của hệ thống.
3. Mở hướng muốn tìm hiểu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Bộ lọc không thay kế hoạch đang học.

## EF03 — Tìm hướng học

**Trang:** Explore

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Tìm kiếm hoặc đổi nhóm

### Luồng chính

1. Kết hợp các bộ lọc. Thao tác của người học.
2. Hiển thị hướng phù hợp. Phản hồi của hệ thống.
3. Mở chi tiết hướng. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không có kết quả: xóa hoặc nới bộ lọc.

## EF04 — Xem bảng ngành và hướng

**Trang:** Explore

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở bảng ngành → hướng

### Luồng chính

1. Xem 12 ngành và liên hệ. Thao tác của người học.
2. Chọn ngành để khám phá. Phản hồi của hệ thống.
3. Danh sách được ưu tiên. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đóng bảng giữ các lựa chọn.

## EF05 — Mở hướng học

**Trang:** Explore → Path detail

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở một hướng

### Luồng chính

1. Tìm nội dung của hướng. Thao tác của người học.
2. Mở nhánh đang nhớ hoặc đầu tiên. Phản hồi của hệ thống.
3. Hiển thị chặng và nguồn. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Nhánh lỗi: báo lỗi, có thể về Explore.

## EF06 — Đổi hướng và nhánh

**Trang:** Path detail

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn hướng hoặc nhánh

### Luồng chính

1. Tìm nhánh thuộc hướng. Thao tác của người học.
2. Mở bản nháp riêng. Phản hồi của hệ thống.
3. Giữ kế hoạch đang học. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đổi nhánh không tự tạo hoặc thay kế hoạch.

## EF07 — Mở roadmap tham khảo

**Trang:** Path detail

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở link roadmap

### Luồng chính

1. Đọc liên kết của nhánh. Thao tác của người học.
2. Mở nguồn ở tab mới. Phản hồi của hệ thống.
3. Quay lại với lựa chọn giữ nguyên. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- BA dùng nguồn nghề ngoài roadmap.sh.

## EF08 — Xem một chặng

**Trang:** Path detail

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở chặng trong Roadmap

### Luồng chính

1. Hiện kỹ năng và kết quả. Thao tác của người học.
2. Xem nguồn và bài thực hành. Phản hồi của hệ thống.
3. Chờ áp dụng hoặc hủy. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đóng hoặc Hủy không áp dụng thay đổi.

## EF09 — Lọc nguồn của chặng

**Trang:** Chi tiết chặng

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Đổi ngôn ngữ hoặc miễn phí

### Luồng chính

1. Lọc danh sách nguồn. Thao tác của người học.
2. Giữ nguồn đang chọn. Phản hồi của hệ thống.
3. Xem nguồn phù hợp. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Danh sách trống không xóa nguồn đã chọn.

## EF10 — Chọn nguồn học

**Trang:** Chi tiết chặng

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn nguồn này

### Luồng chính

1. Đổi lựa chọn trong cửa sổ. Thao tác của người học.
2. Kiểm tra chặng đang chỉnh. Phản hồi của hệ thống.
3. Chờ Áp dụng và lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Mở link không tự chọn nguồn đó.

## EF11 — Lưu lựa chọn chặng

**Trang:** Chi tiết chặng

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Áp dụng và lưu

### Luồng chính

1. Áp dụng chặng, nguồn, đã biết. Thao tác của người học.
2. Lưu bản nháp và chờ kết quả. Phản hồi của hệ thống.
3. Đóng sau khi lưu thành công. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: giữ bản đang sửa để thử lại.

## EF12 — Lưu lựa chọn nhánh

**Trang:** Path detail

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Lưu lựa chọn

### Luồng chính

1. Giữ bản nháp của nhánh. Thao tác của người học.
2. Lưu và đợi hoàn tất. Phản hồi của hệ thống.
3. Thông báo đã lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: giữ bản đang sửa, không báo thành công.

## EF13 — Tìm nguồn học

**Trang:** Path detail · Nguồn học

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Tìm kiếm và lọc nguồn

### Luồng chính

1. Kết hợp từ khóa và ngôn ngữ. Thao tác của người học.
2. Lọc miễn phí nếu được chọn. Phản hồi của hệ thống.
3. Mở tài liệu ở tab mới. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Bộ lọc không tự đổi nguồn trong bản nháp.

## EF14 — Lưu mục tiêu chứng nhận

**Trang:** Path detail · Chứng nhận

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Lưu hoặc bỏ lưu chứng nhận

### Luồng chính

1. Đổi trạng thái mục tiêu. Thao tác của người học.
2. Lưu trên thiết bị. Phản hồi của hệ thống.
3. Cập nhật mục đã lưu ở Profile. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lưu mục tiêu không có nghĩa đã được cấp chứng nhận.

## EF15 — Tùy chỉnh roadmap

**Trang:** My roadmap

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn chặng cần học

### Luồng chính

1. Cập nhật bản nháp riêng. Thao tác của người học.
2. Kiểm tra chặng tiên quyết. Phản hồi của hệ thống.
3. Chờ lưu hoặc tạo kế hoạch. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Thiếu nền tảng: chọn chặng cần học hoặc xác nhận đã biết.

## EF16 — Đánh dấu kỹ năng đã biết

**Trang:** My roadmap

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Đổi dấu Đã biết

### Luồng chính

1. Giữ kỹ năng trong nền tảng. Thao tác của người học.
2. Bỏ bài tương ứng khi sinh lịch. Phản hồi của hệ thống.
3. Cập nhật giờ thực hành. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Đã biết không tạo lịch sử hoàn thành giả.

## EF17 — Lưu bản nháp

**Trang:** My roadmap

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Lưu bản nháp

### Luồng chính

1. Kiểm tra lựa chọn đang sửa. Thao tác của người học.
2. Lưu trên thiết bị. Phản hồi của hệ thống.
3. Giữ kế hoạch đã tạo. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi: thử lại hoặc bỏ bản chưa lưu có xác nhận.

## EF18 — Chọn ngày bắt đầu

**Trang:** My roadmap

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn ngày và tạo lịch

### Luồng chính

1. Kiểm tra ngày bắt đầu. Thao tác của người học.
2. Đề nghị Thứ Hai nếu cần. Phản hồi của hệ thống.
3. Chờ đồng ý hoặc quay lại. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Hủy đề nghị không tạo kế hoạch.

## EF19 — Chọn kế hoạch đang xem

**Trang:** My Plan

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Đổi Kế hoạch đang xem

### Luồng chính

1. Tìm kế hoạch đã lưu. Thao tác của người học.
2. Lưu lựa chọn đang xem. Phản hồi của hệ thống.
3. Hiển thị việc của kế hoạch. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Có bản lưu lỗi: xử lý trước khi đổi.

## EF20 — Xem tuần hoặc Backlog

**Trang:** My Plan · Plan

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Chọn tuần hoặc Backlog

### Luồng chính

1. Đọc việc của tuần. Thao tác của người học.
2. Đọc bản chốt nếu có. Phản hồi của hệ thống.
3. Hiển thị tiến độ và nguồn. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Tuần chốt hoặc phiên bản cũ chỉ đọc.

## EF21 — Thêm công việc

**Trang:** My Plan · Plan

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Thêm việc

### Luồng chính

1. Nhập tiêu đề, chặng và phút. Thao tác của người học.
2. Chọn tuần hoặc chưa xếp. Phản hồi của hệ thống.
3. Kiểm tra rồi lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Hủy không thêm; nhập sai giữ form và hiện lỗi.

## EF22 — Chỉnh công việc

**Trang:** My Plan · Plan

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Sửa một công việc

### Luồng chính

1. Mở nội dung hiện có. Thao tác của người học.
2. Sửa thời gian, ghi chú, vị trí. Phản hồi của hệ thống.
3. Kiểm tra rồi lưu. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lưu lỗi giữ bản sửa; tuần chốt không sửa.

## EF23 — Đưa việc vào Backlog

**Trang:** My Plan · Plan

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Đưa vào backlog

### Luồng chính

1. Giữ công việc và nguồn. Thao tác của người học.
2. Bỏ vị trí tuần và ngày. Phản hồi của hệ thống.
3. Lưu kế hoạch đã chỉnh. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Lỗi không làm mất việc; có thể thử lại.

## EF24 — Xem thống kê

**Trang:** My Plan · Stats

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở Stats

### Luồng chính

1. Đọc kế hoạch đang xem. Thao tác của người học.
2. Tổng hợp việc và tuần. Phản hồi của hệ thống.
3. Hiển thị tiến độ. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Thời gian là dự kiến, không phải bộ đếm học thực tế.

## EF25 — Xem tuần và lịch sử

**Trang:** My Plan · Weeks

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở Weeks hoặc bản cũ

### Luồng chính

1. Chọn tuần muốn xem. Thao tác của người học.
2. Đọc kết quả phiên bản. Phản hồi của hệ thống.
3. Quay lại bản hiện tại. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Phiên bản lịch sử không được sửa.

## EF26 — Xem nhịp học

**Trang:** Profile

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở nhịp học

### Luồng chính

1. Đọc lần hoàn thành mọi plan. Thao tác của người học.
2. Tổng hợp theo ngày ghi nhận. Phản hồi của hệ thống.
3. Xem ngày đã học. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không đếm lại bản lịch sử; dữ liệu thiếu ngày không bịa ngày.

## EF27 — Hủy chỉnh hồ sơ

**Trang:** Profile

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Hủy thay đổi

### Luồng chính

1. Bỏ chỉnh sửa trong form. Thao tác của người học.
2. Đọc hồ sơ đã lưu. Phản hồi của hệ thống.
3. Khôi phục tên, ngành, múi giờ. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không xóa kế hoạch hoặc nhịp học.

## EF28 — Mở sao lưu và khôi phục

**Trang:** Profile

**Điều kiện:** Trang đã tải dữ liệu; thao tác ghi cần bản hiện tại và không có lần lưu đang chờ.

**Bắt đầu:** Mở Sao lưu & chuyển thiết bị

### Luồng chính

1. Chọn xuất hoặc file để nhập. Thao tác của người học.
2. Hiện tùy chọn khi có file. Phản hồi của hệ thống.
3. Xem trước rồi xác nhận. Kết quả có thể quan sát trên giao diện.

### Hủy, thay thế và lỗi

- Không có dữ liệu cũ thì ẩn khôi phục bản cũ.

## EF29 — Chọn nhánh và tạo plan v2

**Trang:** My roadmap

**Điều kiện:** Workspace đã tải; draft hợp lệ.

**Bắt đầu:** Tạo kế hoạch mới

### Luồng chính

1. Chọn nhánh, chặng và nguồn. 18 hướng / 50 cấu hình.
2. Kiểm tra draft và sinh lịch. Tiên quyết, giờ/tuần, ngày.
3. Chờ transaction hoàn tất. Tạo ID mới, giữ plan cũ.
4. Plan mới được lưu. Mở My Plan để tiếp tục.

### Hủy, thay thế và lỗi

- Draft lỗi: hiển thị lỗi, không ghi.
- Save lỗi: giữ candidate để retry hoặc xuất.

## EF30 — Tạo lại có preview/history

**Trang:** My roadmap

**Điều kiện:** Có active plan và draft hợp lệ.

**Bắt đầu:** Xem trước tạo lại

### Luồng chính

1. Sinh preview và đối chiếu. Chưa sửa plan đã lưu.
2. Chọn xác nhận hoặc hủy. Hủy không ghi.
3. Lưu bản mới và history. Chỉ cập nhật sau commit.
4. Plan được tạo lại. Giữ completion phù hợp.

### Hủy, thay thế và lỗi

- Plan/draft thay đổi: báo conflict, xem lại preview.
- Lưu lỗi: giữ proposal, không báo success.

## EF31 — Hoàn thành và undo v2

**Trang:** My Plan

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

**Trang:** My Plan

**Điều kiện:** Tuần mở, chưa có candidate chờ.

**Bắt đầu:** Chốt tuần

### Luồng chính

1. Xem việc xong/chưa xong. Snapshot trước xử lý.
2. Chọn xử lý việc chưa xong. Dời tuần / backlog / skip.
3. Xác nhận và lưu plan. Hủy giữ tuần mở.
4. Tuần đã chốt chỉ đọc. Stats/Weeks đọc snapshot.

### Hủy, thay thế và lỗi

- Lỗi/conflict: không chốt âm thầm.
- Không có tuần đích hợp lệ: từ chối.

## EF33 — Lưu Profile và timezone

**Trang:** Profile

**Điều kiện:** Workspace đã tải.

**Bắt đầu:** Lưu hồ sơ

### Luồng chính

1. Sửa tên, ngành, múi giờ. Validate IANA và tên.
2. Lưu qua callback chung. Chờ transaction complete.
3. Cập nhật hồ sơ/nhịp học. Ngày completion cũ giữ.
4. Hồ sơ được giữ khi reload. Không cần đăng nhập.

### Hủy, thay thế và lỗi

- Hủy: trả form về profile đã lưu.
- Giá trị sai/lưu lỗi: giữ form và báo lỗi.

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

**Trang:** Profile

**Điều kiện:** Đọc được raw v1; draft đã lưu/bỏ.

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

## EF36 — Lưu lỗi và hai tab

**Trang:** Workspace

**Điều kiện:** Hai tab cùng DB, cùng revision ban đầu.

**Bắt đầu:** Tab cũ lưu thay đổi

### Luồng chính

1. Tab A commit dữ liệu mới. Revision trên disk tăng.
2. Tab B lưu với revision cũ. Phát hiện conflict.
3. Giữ bản đang sửa của B. Retry / xuất / bỏ có xác nhận.
4. Không ghi đè tab A. Không báo lưu thành công giả.

### Hủy, thay thế và lỗi

- Abort/quota: giữ candidate, disk nguyên.
- Load lỗi không thay defaults rồi ghi đè.