# MajorWeave — 36 luồng sự kiện chức năng

Cập nhật 03/10/2026. Danh mục hướng là gợi ý khám phá; luồng roadmap / plan hoàn chỉnh hiện dành cho Backend.

| Mã | Chức năng | Trang |
|---|---|---|
| EF01 | Chọn khoa và ngành hiện tại | Explore |
| EF02 | Khám phá hướng thuộc khoa khác | Explore |
| EF03 | Tìm và lọc hướng học | Explore |
| EF04 | Đọc bảng ngành → hướng học | Explore |
| EF05 | Mở chi tiết hoặc tổng quan hướng | Explore → Path Detail / hộp thoại |
| EF06 | Mở roadmap tham khảo trên roadmap.sh | Explore / Path Detail |
| EF07 | Mở và đóng một chặng học | Path Detail / My Roadmap |
| EF08 | Lọc nguồn học trong một chặng | Khung chi tiết chặng |
| EF09 | Chọn hoặc đổi nguồn cho một chặng | Khung chặng / My Roadmap |
| EF10 | Tìm trong thư viện tài nguyên | Path Detail → Nguồn học |
| EF11 | Đánh dấu kỹ năng đã biết / cần học | Path Detail / My Roadmap |
| EF12 | Thêm / bỏ / sắp xếp chặng | Khung chặng / My Roadmap |
| EF13 | Nhập mục tiêu, giờ học và ngày bắt đầu | My Roadmap |
| EF14 | Tạo kế hoạch lần đầu | My Roadmap → My Plan |
| EF15 | Tạo lại kế hoạch đã có | My Roadmap → My Plan |
| EF16 | Chọn tuần và chuyển tuần | My Plan |
| EF17 | Mở nguồn học từ công việc | My Plan |
| EF18 | Hoàn thành / bỏ hoàn thành một việc | My Plan |
| EF19 | Sửa việc, ghi chú và chuyển tuần | My Plan → hộp thoại chỉnh việc |
| EF20 | Thêm công việc cá nhân | My Plan |
| EF21 | Lưu / bỏ lưu mục tiêu chứng nhận | Path Detail → Chứng nhận |
| EF22 | Xem điều kiện chứng nhận ở nguồn chính thức | Path Detail / My Plan |
| EF23 | Tải lại và khôi phục dữ liệu | Toàn website |
| EF24 | Lưu thay đổi và xử lý lỗi lưu | Toàn website |
| EF25 | Xem nhịp học trong 12 tuần | Profile |
| EF26 | Chọn / đổi nhánh Backend | Path Detail |
| EF27 | Sửa hồ sơ học tập | Profile |
| EF28 | Thêm các chặng nền tảng còn thiếu | Path Detail |
| EF29 | Chọn nhánh và tạo plan v2 | My roadmap |
| EF30 | Tạo lại có preview/history | My roadmap |
| EF31 | Hoàn thành và undo v2 | My Plan |
| EF32 | Chốt tuần và giữ snapshot | My Plan |
| EF33 | Lưu Profile và timezone | Profile |
| EF34 | Xuất và nhập backup v2 | Profile |
| EF35 | Chuyển dữ liệu v1 an toàn | Profile |
| EF36 | Lưu lỗi và hai tab | Workspace |

## EF01 — Chọn khoa và ngành hiện tại

**Trang:** Explore.

**Điều kiện:** Đang ở Explore; có thể chưa chọn ngành.

**Sự kiện:** Đổi khoa / ngành trong hồ sơ.

### Luồng chính

1. Sinh viên chọn khoa, rồi chọn ngành. Đổi khoa chọn ngành đầu tiên của khoa mới.
2. Website ưu tiên các hướng liên quan. Gần nền tảng → mở rộng → hướng khác.
3. Lưu ngành hiện tại. Bộ lọc khám phá khoa khác vẫn độc lập.
4. Hồ sơ và danh sách được cập nhật. Mọi hướng vẫn có thể khám phá.

### Thay thế / lỗi

- Chọn “Chưa chọn / Bỏ qua”: không ưu tiên ngành; checkbox chỉ hướng gần ngành bị vô hiệu.
- Chương trình tiếng Anh, tài năng, Việt–Nhật được gộp về ngành gốc trong danh mục.

## EF02 — Khám phá hướng thuộc khoa khác

**Trang:** Explore.

**Điều kiện:** Explore đang mở; hồ sơ ngành hiện tại đã chọn hoặc bỏ qua.

**Sự kiện:** Đổi “Khám phá theo khoa”.

### Luồng chính

1. Chọn khoa muốn tìm hiểu. Ví dụ: từ Phần mềm sang Kỹ thuật Máy tính.
2. Website lọc các hướng liên quan khoa. Có nền tảng chung hoặc có thể mở rộng.
3. Giữ nguyên ngành đang theo học. Không thay hồ sơ khi đổi bộ lọc.
4. Có danh sách để khám phá chéo khoa. Có thể trở về “Tất cả các khoa”.

### Thay thế / lỗi

- Bộ lọc khoa kết hợp nhóm / tìm kiếm / chỉ hướng gần ngành có thể cho danh sách trống; dùng “Xóa bộ lọc hướng học”.

## EF03 — Tìm và lọc hướng học

**Trang:** Explore.

**Điều kiện:** Danh mục hướng học đã tải.

**Sự kiện:** Nhập từ khóa hoặc đổi nhóm.

### Luồng chính

1. Website áp dụng các bộ lọc. Khoa · nhóm · từ khóa · liên hệ ngành.
2. Hiển thị các thẻ hướng học. Ưu tiên liên hệ với ngành hiện tại.
3. Sinh viên mở hướng muốn tìm hiểu. Chỉ Backend có trải nghiệm đầy đủ.

### Thay thế / lỗi

- Hiển thị trạng thái trống — Bấm xóa bộ lọc để xem lại toàn bộ.

## EF04 — Đọc bảng ngành → hướng học

**Trang:** Explore.

**Điều kiện:** Explore đang mở.

**Sự kiện:** Mở “Xem bảng ngành → hướng học”.

### Luồng chính

1. Mở bảng 12 ngành. Có nhóm gần nền tảng và hướng mở rộng.
2. Bấm tên ngành muốn kiểm tra. Đặt hồ sơ ngành và xóa lọc khoa / nhóm.
3. Website bật lọc hướng liên quan ngành. Tìm kiếm được xóa để thấy danh sách.
4. Đối chiếu danh mục ngay trên website. Có liên kết thông tin ngành tại UIT.

### Thay thế / lỗi

- Đóng bảng: giữ các lựa chọn hiện tại.
- Những nhãn liên hệ do nhóm biên soạn, không phải kết quả đánh giá phù hợp cá nhân.
- Ngành Thiết kế Vi mạch có thông báo chưa có roadmap chuyên biệt trong danh mục đã đối chiếu; có thể khám phá ngành khác.

## EF05 — Mở chi tiết hoặc tổng quan hướng

**Trang:** Explore → Path Detail / hộp thoại.

**Điều kiện:** Có ít nhất một hướng trong kết quả.

**Sự kiện:** Bấm nút trên thẻ hướng học.

### Luồng chính

1. Website nhận hướng đã bấm. Phân biệt hướng hoàn chỉnh và tổng quan.
2. Đi đến Path Detail. Kỹ năng · nguồn học · chứng nhận.
3. Có thể tùy chỉnh roadmap Backend. Luồng chi tiết tiếp tục tại đây.

### Thay thế / lỗi

- Mở tổng quan của đúng hướng — Nền tảng và ngành liên quan; có thể đóng.

## EF06 — Mở roadmap tham khảo trên roadmap.sh

**Trang:** Explore / Path Detail.

**Điều kiện:** Đã mở tổng quan hướng hoặc đang xem Backend; liên kết ngoài hiển thị.

**Sự kiện:** Bấm một nút roadmap.sh.

### Luồng chính

1. Website mở đúng liên kết ở tab mới. Đúng hướng theo nút đã chọn.
2. Sinh viên xem bản đồ trên roadmap.sh. Tương tác diễn ra ở website nguồn.
3. Quay lại tab MajorWeave. Giữ hồ sơ, kỹ năng và nguồn đã chọn.
4. Tiếp tục khám phá hoặc học Backend. Không tự đồng bộ tiến độ từ roadmap.sh.

### Thay thế / lỗi

- Mạng hoặc website ngoài không truy cập được: MajorWeave vẫn giữ trạng thái; có thể mở lại link sau.
- Nếu trình duyệt chặn tab mới, sinh viên có thể mở liên kết bằng thao tác của trình duyệt.

## EF07 — Mở và đóng một chặng học

**Trang:** Path Detail / My Roadmap.

**Điều kiện:** Chặng nằm trong danh mục Backend.

**Sự kiện:** Bấm tên hoặc thẻ kỹ năng.

### Luồng chính

1. Website mở khung chi tiết chặng. Mục tiêu · nguồn học · bài thực hành.
2. Sinh viên xem nguồn và kỹ năng. Có thể đổi nguồn hoặc đánh dấu đã biết.
3. Đóng bằng nút, Escape hoặc ngoài khung. Quay lại trang trước; giữ thay đổi đã chọn.
4. Tiếp tục xem roadmap. Đóng khung không hủy các thay đổi đã lưu.

### Thay thế / lỗi

- Khung nguồn học cuộn riêng trên điện thoại.

## EF08 — Lọc nguồn học trong một chặng

**Trang:** Khung chi tiết chặng.

**Điều kiện:** Đã mở một chặng Backend.

**Sự kiện:** Chọn miễn phí / tiếng Việt / chứng nhận.

### Luồng chính

1. Website lọc nguồn của chặng hiện tại. Không trộn tài liệu từ chặng khác.
2. Hiển thị các nguồn phù hợp bộ lọc. Có thể mở hoặc chọn một nguồn.
3. Sinh viên chọn nguồn để học. Ưu tiên chỉ giới hạn cách hiển thị.

### Thay thế / lỗi

- Thông báo không có nguồn khớp — Bấm “Xem tất cả nguồn” để đổi lọc.

## EF09 — Chọn hoặc đổi nguồn cho một chặng

**Trang:** Khung chặng / My Roadmap.

**Điều kiện:** Có nguồn thuộc đúng chặng đang chỉnh.

**Sự kiện:** Bấm “Chọn nguồn này” hoặc đổi nguồn.

### Luồng chính

1. Ghi nhận nguồn của đúng chặng. Mỗi chặng dùng một nguồn chính.
2. Hiển thị trạng thái nguồn đã chọn. My Roadmap phản ánh lựa chọn này.
3. Lưu lựa chọn trên trình duyệt. Kế hoạch đã tạo chưa đổi tự động.
4. Nguồn được dùng khi tạo kế hoạch. Tạo lại lịch nếu muốn cập nhật lịch cũ.

### Thay thế / lỗi

- Chọn nguồn khác thay nguồn chính của chặng; không xóa kỹ năng khác.
- Mở đường dẫn tài liệu chỉ để xem; việc đó không đồng nghĩa đã chọn nguồn.

## EF10 — Tìm trong thư viện tài nguyên

**Trang:** Path Detail → Nguồn học.

**Điều kiện:** Đang ở tab Nguồn học.

**Sự kiện:** Nhập từ khóa hoặc chọn bộ lọc.

### Luồng chính

1. Tìm trong tiêu đề, nền tảng và mô tả. Kết hợp bộ lọc tài nguyên.
2. Hiển thị danh sách tài nguyên. Có thông tin phí, ngôn ngữ, định dạng.
3. Mở tài liệu trên trang của nguồn. Muốn chọn nguồn: mở chặng tương ứng.

### Thay thế / lỗi

- Thông báo tìm kiếm không có kết quả — Bấm “Xóa bộ lọc” để xem lại.

## EF11 — Đánh dấu kỹ năng đã biết / cần học

**Trang:** Path Detail / My Roadmap.

**Điều kiện:** Có chặng muốn điều chỉnh; trình độ là một mẫu khởi đầu.

**Sự kiện:** Đổi trình độ hoặc checkbox “Đã biết”.

### Luồng chính

1. Ghi nhận kỹ năng đã biết. Có thể sửa từng chặng sau khi đổi trình độ.
2. Cập nhật số chặng và thời gian dự kiến. Chặng đã biết được bỏ qua khi sinh lịch.
3. Lưu trạng thái kỹ năng. Kế hoạch hiện tại chưa đổi tự động.
4. Roadmap phù hợp nền tảng tự khai báo. Bỏ dấu đã biết để học lại chặng.

### Thay thế / lỗi

- Tất cả chặng đã biết: tạo kế hoạch bị chặn; cần chọn ít nhất một chặng chưa biết.
- Đổi trình độ thay mẫu kỹ năng đã biết; sinh viên có thể chỉnh lại từng mục.

## EF12 — Thêm / bỏ / sắp xếp chặng

**Trang:** Khung chặng / My Roadmap.

**Điều kiện:** Đang tùy chỉnh roadmap Backend.

**Sự kiện:** Thêm chặng, bấm bỏ hoặc di chuyển lên / xuống.

### Luồng chính

1. Cập nhật chặng và thứ tự đã chọn. Thêm ở khung chặng; đổi thứ tự ở roadmap.
2. Website tính lại thời lượng và số tuần. Dựa trên những chặng chưa biết.
3. Lưu roadmap cá nhân. Chưa thay lịch học cũ cho đến khi tạo lại.
4. Có danh sách chặng theo lựa chọn. Nguồn từng chặng vẫn được giữ.

### Thay thế / lỗi

- Chặng đầu không đi lên, chặng cuối không đi xuống: nút tương ứng bị vô hiệu.
- Bỏ tất cả chặng: hiện roadmap trống và link chọn chặng; không thể tạo kế hoạch.

## EF13 — Nhập mục tiêu, giờ học và ngày bắt đầu

**Trang:** My Roadmap.

**Điều kiện:** Có thể chỉnh các giá trị trước hoặc sau khi có lịch.

**Sự kiện:** Đổi mục tiêu, giờ / tuần, ngày.

### Luồng chính

1. Sinh viên chỉnh ba thông tin kế hoạch. Mục tiêu · 2–20 giờ/tuần · ngày bắt đầu.
2. Website tính lại ước lượng lịch. Thời lượng bài thực hành là ước lượng.
3. Lưu lựa chọn để chuẩn bị tạo lịch. Không tự tạo hoặc thay thế lịch cũ.
4. Bấm tạo kế hoạch khi đã sẵn sàng. Thông tin đầu vào được kiểm tra khi tạo.

### Thay thế / lỗi

- Mục tiêu trống, ngày không hợp lệ hoặc không có chặng cần học: luồng EF14 báo lỗi.

## EF14 — Tạo kế hoạch lần đầu

**Trang:** My Roadmap → My Plan.

**Điều kiện:** Chưa có kế hoạch; đang ở My Roadmap.

**Sự kiện:** Bấm “Tạo kế hoạch của tôi”.

### Luồng chính

1. Website kiểm tra dữ liệu đầu vào. Mục tiêu · ngày hợp lệ · chặng chưa biết.
2. Chia bài thực hành theo giờ mỗi tuần. Bỏ qua đã biết, giữ thứ tự và nguồn.
3. Lưu lịch và chuyển sang My Plan. Xem tuần đầu và bắt đầu học.

### Thay thế / lỗi

- Báo lỗi ngay tại My Roadmap — Giữ lựa chọn để sửa rồi tạo lại.

## EF15 — Tạo lại kế hoạch đã có

**Trang:** My Roadmap → My Plan.

**Điều kiện:** Đã có việc trong kế hoạch; đầu vào mới hợp lệ.

**Sự kiện:** Bấm tạo khi đã có kế hoạch.

### Luồng chính

1. Website mở hộp thoại giải thích. Nêu dữ liệu giữ lại và dữ liệu thay thế.
2. Tạo lịch mới theo roadmap hiện tại. Giữ hoàn thành / ghi chú bài còn tồn tại.
3. Lưu và mở kế hoạch mới. Sử dụng nguồn và quỹ thời gian mới.

### Thay thế / lỗi

- Giữ nguyên kế hoạch hiện tại — Hủy hoặc đóng khung không thay lịch.

## EF16 — Chọn tuần và chuyển tuần

**Trang:** My Plan.

**Điều kiện:** Kế hoạch có ít nhất một việc.

**Sự kiện:** Chọn tuần hoặc nút trước / sau.

### Luồng chính

1. Sinh viên chọn tuần muốn xem. Danh sách tuần hoặc nút điều hướng.
2. Website hiển thị việc của tuần. Ngày, tổng giờ và số việc đã hoàn thành.
3. Kiểm tra quỹ thời gian của tuần. Hiện cảnh báo nếu chỉnh sửa làm vượt giờ.
4. Có danh sách việc của tuần đã chọn. Đổi tuần không tự đánh dấu hoàn thành.

### Thay thế / lỗi

- Tuần đầu / cuối: vô hiệu nút đi ra ngoài kế hoạch.
- Tuần trống: hiện thông báo và cho phép thêm việc.

## EF17 — Mở nguồn học từ công việc

**Trang:** My Plan.

**Điều kiện:** Công việc có nguồn học trong danh mục.

**Sự kiện:** Bấm “Mở nguồn học” dưới công việc.

### Luồng chính

1. Mở nguồn đúng với chặng của công việc. Liên kết dùng nguồn khi kế hoạch được tạo.
2. Sinh viên học trên website nguồn. Tab MajorWeave giữ kế hoạch hiện tại.
3. Quay lại và tự đánh dấu hoàn thành. Website không quan sát tiến độ bên ngoài.
4. Tiếp tục theo dõi học tại My Plan. Chỉ mở tài liệu chưa làm tiến độ tăng.

### Thay thế / lỗi

- Việc tự thêm không có nguồn mặc định: không hiển thị link nguồn học.
- Nguồn ngoài không truy cập được: lịch và tiến độ MajorWeave vẫn được giữ.

## EF18 — Hoàn thành / bỏ hoàn thành một việc

**Trang:** My Plan.

**Điều kiện:** Kế hoạch có việc cần cập nhật.

**Sự kiện:** Bấm checkbox của công việc.

### Luồng chính

1. Ghi nhận hoàn thành hoặc cần làm lại. Thêm ngày hoàn thành; bỏ dấu thì xóa ngày.
2. Cập nhật tiến độ và lịch hoạt động. Số việc, phần trăm và ngày có hoạt động.
3. Lưu trạng thái và hiện thông báo. Việc và ghi chú khác vẫn giữ nguyên.
4. Tải lại vẫn thấy tiến độ đã lưu. Bỏ dấu để tiếp tục việc chưa xong.

### Thay thế / lỗi

- Nếu mọi việc trong tuần hoàn thành: hiển thị thông báo tuần đã xong.
- Lỗi lưu trên thiết bị: trạng thái “Chưa lưu được” theo EF24; có thể mất thay đổi khi tải lại.

## EF19 — Sửa việc, ghi chú và chuyển tuần

**Trang:** My Plan → hộp thoại chỉnh việc.

**Điều kiện:** Có công việc cần chỉnh; bản nháp chỉnh sửa chưa ảnh hưởng lịch.

**Sự kiện:** Bấm biểu tượng sửa của công việc.

### Luồng chính

1. Chỉnh tên, phút, ghi chú và tuần đích. Tên có nội dung; 15–1200 phút, bước 15.
2. Lưu việc và mở tuần đích. Giữ trạng thái hoàn thành của công việc.
3. Hiển thị lịch và tiến độ cập nhật. Cảnh báo nếu tuần vượt quỹ giờ.

### Thay thế / lỗi

- Chưa áp dụng thay đổi vào lịch — Sửa dữ liệu; hủy / đóng để bỏ bản nháp.

## EF20 — Thêm công việc cá nhân

**Trang:** My Plan.

**Điều kiện:** Đang xem một tuần; việc mới được thêm vào tuần đó.

**Sự kiện:** Bấm “Thêm một việc nhỏ”.

### Luồng chính

1. Nhập việc và chọn thời lượng. 30, 60, 90 hoặc 120 phút.
2. Thêm việc mới vào tuần đang xem. Việc chưa hoàn thành và chưa có nguồn.
3. Lưu và cập nhật tổng giờ của tuần. Cảnh báo khi tổng giờ vượt quỹ tuần.

### Thay thế / lỗi

- Giữ form để nhập tên công việc — Có thể hủy; chưa thêm việc vào lịch.

## EF21 — Lưu / bỏ lưu mục tiêu chứng nhận

**Trang:** Path Detail → Chứng nhận.

**Điều kiện:** Đang xem danh mục chứng nhận Backend.

**Sự kiện:** Bấm biểu tượng bookmark của thẻ.

### Luồng chính

1. Đổi trạng thái mục tiêu chứng nhận. Lưu nếu chưa lưu; bỏ lưu nếu đã lưu.
2. Website cập nhật biểu tượng và thông báo. Không cấp hoặc xác minh chứng nhận.
3. Lưu lựa chọn trên trình duyệt. Khi có My Plan: hiện mục tiêu đã lưu.
4. Có danh sách mục tiêu bổ trợ. Bỏ lưu không thay đổi lịch kỹ năng.

### Thay thế / lỗi

- Chưa tạo kế hoạch: mục tiêu vẫn lưu ở tab Chứng nhận, My Plan hiện lời mời tạo lịch.

## EF22 — Xem điều kiện chứng nhận ở nguồn chính thức

**Trang:** Path Detail / My Plan.

**Điều kiện:** Thẻ chứng nhận có liên kết chính thức.

**Sự kiện:** Bấm “Xem điều kiện” hoặc mục tiêu đã lưu.

### Luồng chính

1. Website mở trang của đơn vị cấp. Liên kết mở tab mới.
2. Sinh viên xem phí và yêu cầu hiện hành. Đăng ký / thi diễn ra tại đơn vị cấp.
3. Quay lại MajorWeave. Không tự đổi trạng thái chứng nhận.
4. Có thông tin để quyết định học bổ trợ. Ứng dụng không thu phí hoặc đăng ký thi.

### Thay thế / lỗi

- Hoàn thành roadmap mẫu không đồng nghĩa đạt điều kiện hoặc đạt chứng chỉ.

## EF23 — Tải lại và khôi phục dữ liệu

**Trang:** Toàn website.

**Điều kiện:** Trình duyệt hỗ trợ đọc dữ liệu trên thiết bị.

**Sự kiện:** Mở lại website hoặc tải lại trang.

### Luồng chính

1. Đọc dữ liệu MajorWeave đã lưu. Kiểm tra phiên bản, kiểu dữ liệu và ID.
2. Khôi phục các lựa chọn và kế hoạch. Chuẩn hóa giá trị theo danh mục hiện tại.
3. Hiển thị tiến độ đã lưu trên thiết bị. Không đồng bộ sang thiết bị khác.

### Thay thế / lỗi

- Khởi tạo trạng thái mặc định — Chưa có hoặc hỏng dữ liệu thì bắt đầu mới.

## EF24 — Lưu thay đổi và xử lý lỗi lưu

**Trang:** Toàn website.

**Điều kiện:** Có thay đổi hồ sơ, roadmap, công việc hoặc chứng nhận.

**Sự kiện:** Website tự lưu sau thay đổi.

### Luồng chính

1. Thử ghi dữ liệu trên trình duyệt. Dùng cùng một bộ dữ liệu của bản thử.
2. Hiển thị trạng thái “Đã lưu”. Thay đổi có thể khôi phục khi tải lại.
3. Tiếp tục thao tác trên website. Không cần nút lưu chung cho mọi thay đổi.

### Thay thế / lỗi

- Hiển thị “Chưa lưu được” — Tạm giữ trong trang; tải lại có thể mất.

## EF25 — Xem nhịp học trong 12 tuần

**Trang:** Profile.

**Điều kiện:** Profile đã mở; có thể chưa tạo kế hoạch hoặc chưa hoàn thành việc.

**Sự kiện:** Xem bảng hoặc bấm một ô ngày.

### Luồng chính

1. Đọc ngày hoàn thành của công việc. Dùng ngày ghi nhận, không dùng tuần dự kiến.
2. Đếm số việc cho từng ngày. Chỉ đếm việc hoàn thành và có ngày hợp lệ.
3. Hiện màu và chi tiết ngày được chọn. Xem ngày bằng chuột hoặc phím mũi tên.
4. Sinh viên xem nhịp học đã tự ghi nhận. Chuyển tuần không đổi ngày hoàn thành.

### Thay thế / lỗi

- Chưa có việc hoàn thành có ngày: hiển thị bảng trống cùng gợi ý bắt đầu.
- Việc từ bản cũ chưa có ngày: giữ tiến độ và ghi rõ chưa được đưa vào biểu đồ.
- Ngày sắp tới bị vô hiệu; bỏ hoàn thành làm cập nhật lại số việc của ngày tương ứng.
- Biểu đồ tính các việc được giữ trong kế hoạch hiện tại; việc bị bỏ khi tạo lại không còn được tính.

## EF26 — Chọn / đổi nhánh Backend

**Trang:** Path Detail.

**Điều kiện:** Đang xem Backend; có ba lựa chọn Node.js, Python và Java.

**Sự kiện:** Bấm một nhánh Backend.

### Luồng chính

1. Đổi ngôn ngữ và framework. Express · FastAPI · Spring Boot.
2. Cập nhật chặng và nguồn phù hợp. Giữ lựa chọn nền tảng chung.
3. Giữ kế hoạch đang học. Chỉ thay lịch sau khi xác nhận tạo lại.
4. Roadmap dùng nhánh mới được chọn. My Plan vẫn ghi đúng nhánh đã tạo.

### Thay thế / lỗi

- Bấm nhánh đang chọn không thay dữ liệu.
- Khi đổi nhánh, không suy đoán rằng sinh viên đã biết ngôn ngữ mới; có thể sửa từng chặng đã biết.
- Nguồn chỉ dùng cho nhánh cũ được thay bằng nguồn phù hợp. Ngôn ngữ tài liệu Việt/Anh là lựa chọn độc lập.
- Các bài OOP, SQL, xác thực và triển khai theo nhánh khác được tạo mới, không tự nhận hoàn thành từ nhánh cũ.

## EF27 — Sửa hồ sơ học tập

**Trang:** Profile.

**Điều kiện:** Profile đã mở; hồ sơ được lưu trên trình duyệt này.

**Sự kiện:** Nhập tên / ngành rồi bấm lưu.

### Luồng chính

1. Chỉnh tên hiển thị và ngành. Có thể để trống tên hoặc bỏ qua ngành.
2. Website lưu hồ sơ học tập. Tên cập nhật ở avatar và Profile.
3. Ưu tiên hướng theo ngành mới. Explore vẫn cho khám phá chéo khoa.
4. Hiển thị thông báo đã lưu hồ sơ. Kế hoạch đang học được giữ nguyên.

### Thay thế / lỗi

- Tên tối đa 60 ký tự; ngành chỉ chọn từ danh mục.
- Đi sang trang khác trước khi lưu: phần sửa hồ sơ chưa được áp dụng.
- Profile hiện chưa phải tài khoản Google; dữ liệu chưa được đồng bộ qua thiết bị.
- Lỗi lưu trên thiết bị được báo theo EF24.

## EF28 — Thêm các chặng nền tảng còn thiếu

**Trang:** Path Detail.

**Điều kiện:** Có OOP, DSA, mạng, OS hoặc hệ thống chưa nằm trong My Roadmap.

**Sự kiện:** Bấm thêm nền tảng vào roadmap.

### Luồng chính

1. Xác định chặng nền tảng chưa thêm. Không thêm chặng đã có lần thứ hai.
2. Chèn các chặng vào roadmap. Theo thứ tự gợi ý, giữ chặng đang chọn.
3. Giữ việc và tiến độ của lịch cũ. Lịch chỉ đổi khi chủ động tạo lại.
4. Có thể chỉnh từng kỹ năng đã biết. Nguồn phù hợp nhánh hiện tại.

### Thay thế / lỗi

- Nếu đủ năm chặng, nút thêm nền tảng không hiển thị.
- System Design là chặng mở rộng: chỉ thêm riêng khi muốn học, không thêm mặc định.
- Bản cũ giữ nguyên lựa chọn và kế hoạch khi tải lại; sinh viên tự bấm để bổ sung.

## EF29 — Chọn nhánh và tạo plan v2

**Trang:** My roadmap.

**Điều kiện:** Workspace đã tải; draft hợp lệ.

**Sự kiện:** Tạo kế hoạch mới.

### Luồng chính

1. Chọn nhánh, chặng và nguồn. 18 hướng / 50 cấu hình.
2. Kiểm tra draft và sinh lịch. Tiên quyết, giờ/tuần, ngày.
3. Chờ transaction hoàn tất. Tạo ID mới, giữ plan cũ.
4. Plan mới được lưu. Mở My Plan để tiếp tục.

### Thay thế / lỗi

- Draft lỗi: hiển thị lỗi, không ghi.
- Save lỗi: giữ candidate để retry hoặc xuất.

## EF30 — Tạo lại có preview/history

**Trang:** My roadmap.

**Điều kiện:** Có active plan và draft hợp lệ.

**Sự kiện:** Xem trước tạo lại.

### Luồng chính

1. Sinh preview và đối chiếu. Chưa sửa plan đã lưu.
2. Chọn xác nhận hoặc hủy. Hủy không ghi.
3. Lưu bản mới và history. Chỉ cập nhật sau commit.
4. Plan được tạo lại. Giữ completion phù hợp.

### Thay thế / lỗi

- Plan/draft thay đổi: báo conflict, xem lại preview.
- Lưu lỗi: giữ proposal, không báo success.

## EF31 — Hoàn thành và undo v2

**Trang:** My Plan.

**Điều kiện:** Plan đang xem và tuần còn mở.

**Sự kiện:** Đổi dấu hoàn thành.

### Luồng chính

1. Tạo completion hoặc undo. Giữ ngày/timezone lần ghi.
2. Lưu với expected revision. Không ghi đè tab mới.
3. Cập nhật plan và nhịp học. Chờ lưu xong trước reload.
4. Tiến độ được cập nhật. Completion ledger giữ lịch sử.

### Thay thế / lỗi

- Save lỗi: giữ candidate, retry hoặc bỏ có xác nhận.
- Snapshot tuần chốt chỉ đọc.

## EF32 — Chốt tuần và giữ snapshot

**Trang:** My Plan.

**Điều kiện:** Tuần mở, chưa có candidate chờ.

**Sự kiện:** Chốt tuần.

### Luồng chính

1. Xem việc xong/chưa xong. Snapshot trước xử lý.
2. Chọn xử lý việc chưa xong. Dời tuần / backlog / skip.
3. Xác nhận và lưu plan. Hủy giữ tuần mở.
4. Tuần đã chốt chỉ đọc. Stats/Weeks đọc snapshot.

### Thay thế / lỗi

- Lỗi/conflict: không chốt âm thầm.
- Không có tuần đích hợp lệ: từ chối.

## EF33 — Lưu Profile và timezone

**Trang:** Profile.

**Điều kiện:** Workspace đã tải.

**Sự kiện:** Lưu hồ sơ.

### Luồng chính

1. Sửa tên, ngành, múi giờ. Validate IANA và tên.
2. Lưu qua callback chung. Chờ transaction complete.
3. Cập nhật hồ sơ/nhịp học. Ngày completion cũ giữ.
4. Hồ sơ được giữ khi reload. Không cần đăng nhập.

### Thay thế / lỗi

- Hủy: trả form về profile đã lưu.
- Giá trị sai/lưu lỗi: giữ form và báo lỗi.

## EF34 — Xuất và nhập backup v2

**Trang:** Profile.

**Điều kiện:** Workspace đã tải; chọn JSON hợp lệ.

**Sự kiện:** Xem trước nhập file.

### Luồng chính

1. Kiểm tra file và phiên bản. Không lọc bỏ lỗi âm thầm.
2. Chọn skip hoặc copy. Preview chưa ghi dữ liệu.
3. Xác nhận rồi chờ commit. Giữ proposal nếu lỗi.
4. Nhập giữ plan hiện có. Có thể xuất JSON để chuyển máy.

### Thay thế / lỗi

- Cancel không ghi; ID trùng mặc định skip.
- File lỗi/version lạ: từ chối toàn bộ.
- Save lỗi: retry cùng ID hoặc xuất proposal.

## EF35 — Chuyển dữ liệu v1 an toàn

**Trang:** Profile.

**Điều kiện:** Đọc được raw v1; draft đã lưu/bỏ.

**Sự kiện:** Xem trước chuyển v1.

### Luồng chính

1. Đọc raw và fingerprint. Không sửa key nguồn.
2. Xem preview và cảnh báo. Thiếu bối cảnh: cần bổ sung.
3. Xác nhận append vào v2. Ghi migration fingerprint.
4. Dữ liệu v1 được giữ. Chuyển lại không nhập trùng.

### Thay thế / lỗi

- Cancel không ghi.
- Unknown IDs và completion thiếu ngày được giữ.
- Lỗi/conflict giữ proposal để retry.

## EF36 — Lưu lỗi và hai tab

**Trang:** Workspace.

**Điều kiện:** Hai tab cùng DB, cùng revision ban đầu.

**Sự kiện:** Tab cũ lưu thay đổi.

### Luồng chính

1. Tab A commit dữ liệu mới. Revision trên disk tăng.
2. Tab B lưu với revision cũ. Phát hiện conflict.
3. Giữ bản đang sửa của B. Retry / xuất / bỏ có xác nhận.
4. Không ghi đè tab A. Không báo lưu thành công giả.

### Thay thế / lỗi

- Abort/quota: giữ candidate, disk nguyên.
- Load lỗi không thay defaults rồi ghi đè.