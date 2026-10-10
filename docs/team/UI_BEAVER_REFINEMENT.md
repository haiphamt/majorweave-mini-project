# Điều chỉnh giao diện theo Beaver Plans — 09/10/2026

## Quyết định của Hải

- Dùng top nav thay side nav; giữ tên MajorWeave và palette kem/gạch.
- Tham chiếu Beaver Plans: thao tác rõ, chữ vừa, ít chi tiết phụ; không tuyên bố sao chép toàn bộ chức năng.
- Profile: hồ sơ, nhịp học, chứng nhận đã lưu. Sao lưu là mục thu gọn; tùy chọn chỉ hiện sau khi chọn file. Khôi phục bản cũ chỉ hiện nếu có dữ liệu cũ hoặc lỗi đọc cần xử lý.
- Path detail: hướng/nhánh → roadmap tham khảo → hàng lưu lựa chọn → các tab. Nút lưu không nằm lẫn trong bộ chọn nhánh.
- Không hiển thị khối “Mục tiêu Portfolio” như mục tiêu bắt buộc và không tự điền mục tiêu cá nhân khi mở hướng. Không xóa mục tiêu hoặc kế hoạch người học đã lưu trước đó.
- My Plan: Plan / Stats / Weeks, các tuần ở hàng ngang, việc học có tiêu chí mở khi cần. Không thay nghiệp vụ sinh lịch/lưu/tiến độ.
- Trang luồng dùng các thao tác hiện tại, mọi hướng học. Bỏ sơ đồ và demo Backend lịch sử khỏi trang được phục vụ.

## Kiểm chứng

- Chạy kiểm tra cấu trúc/domain và build.
- Trình duyệt Chrome, database QA riêng: mở React, lưu lựa chọn, xác nhận mục tiêu mới trống; nhập mục tiêu, tạo plan, hoàn thành việc, tải lại; Profile có ngày và việc tương ứng.
- Profile mặc định đóng sao lưu; mở chỉ có xuất/chọn file, chưa có bốn checkbox nhập. Fixture dữ liệu cũ nằm trong mục khôi phục riêng.
- Desktop và 390×844: kiểm tra top nav, Path detail, My Plan, Profile và trang luồng; minh chứng trong `D:/IS207/artifacts/beaver-ui-2026-10-09`.
- Chưa kiểm thử lại upload JSON qua file picker (giới hạn extension đã ghi ở báo cáo tích hợp). Logic nhập/xuất và bảo toàn dữ liệu vẫn dùng controller hiện có.

## Công cụ hỗ trợ

- Impeccable: distill, operate, craft-floor; dùng cho hierarchy, typography, disclosure và responsive.
- Ponytail: giữ React/CSS/native details; không thêm framework hoặc dependency.
- Không dùng skill để tự thay phạm vi, nội dung học hoặc thiết kế ngoài yêu cầu của Hải.

## Bàn giao

Nhánh `fix/beaver-ui`; gửi bản local để Hải kiểm tra trước khi merge. Chưa thay bản Netlify, chưa sửa Notion.

## Điều chỉnh ngày 10/10/2026

- Tên hiển thị mới nhất: **uitplans.** — chữ thường, dấu chấm cuối, không logo biểu tượng.
- Explore bỏ nhãn “Bản trải nghiệm” và cách tô nổi bật riêng cho Backend. Nút mở đầu dẫn xuống danh sách hướng học.
- Profile giữ tên/ngành học, đổi tiêu đề thành “Hồ sơ học tập”; tên là tùy chọn. Bỏ khối “Đang khám phá” và thông tin kế hoạch lặp với My Plan.
- Múi giờ nằm trong “Tùy chọn nâng cao”, mặc định thu gọn. Giữ thao tác lưu/hủy, nhịp học, chứng nhận và sao lưu.

### Wordmark và thanh điều hướng

Theo ảnh Beaver Plans Hải cung cấp: tên dùng Be Vietnam Pro 700, 24px desktop / 22px mobile, tracking −0.03em, chữ đứng và dấu chấm cùng màu chữ. Giữ palette kem/gạch; bỏ icon của các mục điều hướng, dùng nhãn chữ gọn. Không thêm font hoặc dependency. Tên browser/tab và trang hướng dẫn thống nhất với wordmark; khóa dữ liệu/format backup cũ giữ nguyên.

Kiểm chứng: `npm run check` và `npm run build` đạt. Scan typography của Impeccable không có finding. Chrome 1280px và 390px: wordmark không có ảnh, computed font là Be Vietnam Pro 700 / normal, đúng 24px và 22px; body không tràn ngang. Ảnh thực tế nằm trong `D:/IS207/artifacts/uitplans-2026-10-10`.


### Bố cục Hướng học và Kế hoạch — bước được Hải duyệt ngày 10/10/2026

Hải yêu cầu bắt đầu theo đề xuất chỉnh phần bên trong. Bước này triển khai hai màn hình trước để duyệt; Khám phá, Lộ trình của tôi và Hồ sơ sẽ làm sau.

- Hướng học: đầu trang gọn, bộ chọn hướng/nhánh cùng nhóm; roadmap tham khảo là liên kết nhỏ; lưu lựa chọn nằm ở hàng riêng. Ba tab Lộ trình / Nguồn học / Chứng nhận giữ đầy đủ dữ liệu.
- Các chặng là hàng có số thứ tự, tiêu đề, mô tả, nguồn và thời lượng; không còn thẻ lồng trong timeline. Phần tóm tắt tính từ chặng được chọn và chưa biết, không coi tổng thời gian này là thời lượng toàn khóa.
- Trên điện thoại, tóm tắt và nút Tùy chỉnh xuất hiện trước danh sách. Trên desktop, tóm tắt nằm bên phải. Cửa sổ chặng dùng cùng kiểu chữ và vẫn có Áp dụng / Hủy.
- Kế hoạch: chọn kế hoạch ngay đầu trang; mục tiêu xuất hiện một lần. Việc học / Thống kê / Các tuần là ba chế độ xem. Thanh tuần cuộn ngang trong vùng riêng.
- Công việc nhóm theo dayIndex đang có; việc chưa gán ngày nằm trong Chưa chọn ngày. Không tự gán ngày cho lịch sinh ra. Menu dấu ba chấm chứa sửa và chuyển về chưa xếp lịch; tiêu chí mở bằng native details.
- Trạng thái chưa có kế hoạch có nút tạo kế hoạch đầu tiên. Thống kê, danh sách tuần, trạng thái chỉ đọc, lưu lỗi/thử lại và hủy chốt tuần vẫn dùng callback/controller hiện có.
- Điều hướng và tiêu đề tab trình duyệt Việt hóa. Giữ tên uitplans., palette kem/gạch, wordmark và kho dữ liệu cũ. Không thêm dependency, đổi nội dung học, reset dữ liệu hay cập nhật Notion.

#### Kiểm chứng của bước này

- Build và kiểm tra dự án đạt. Bộ kiểm tra MW-TEAM-03 đạt 41/41; fixture render được bổ sung lịch sử thật khi kiểm tra bộ chọn phiên bản, và kiểm tra mỗi việc chỉ xuất hiện một lần khi nhóm theo ngày. Không bỏ assertion.
- Impeccable layout scan trước và sau chỉnh sửa đều không có finding.
- Chrome 1280×900 và 390×844; kiểm tra thêm độ rộng 900px: body không tràn ngang. Kiểu chữ, nội dung dài, tab, menu và nút chính đã xem trực tiếp.
- Dữ liệu QA dùng database riêng `uitplans-layout-qa-20261010`, entry trong thư mục artifacts bị Git bỏ qua; không ghi vào workspace của người dùng. Tạo kế hoạch React từ nội dung thật: 17 việc, 11 chặng.
- Thử lọc nguồn không có kết quả và xóa bộ lọc; xem đủ 3 chứng nhận; đổi trạng thái trong cửa sổ chặng rồi Hủy giữ bản nháp. Sửa ngày một việc thành Thứ Hai, hoàn thành, tải lại: nhóm ngày và kết quả 1/17 vẫn được giữ.
- Xem Thống kê, mở Các tuần → tuần 2; quay lại tuần 1, mở Chốt tuần → Hủy: tuần vẫn mở. Chưa thử lại lỗi quota/hai tab trực tiếp trong bước UI; các kiểm tra domain/controller hiện có vẫn đạt.
- Ảnh bàn giao: `D:/IS207/artifacts/learning-ui-2026-10-10/path-desktop.jpg`, `plan-desktop.jpg`, `path-mobile.jpg`, `plan-mobile.jpg` và `plan-empty-desktop.jpg`. Ảnh Kế hoạch dùng dữ liệu kiểm tra riêng, không phải kế hoạch của Hải.

Nhánh bàn giao vẫn là `fix/beaver-ui`. Chờ Hải kiểm tra hai trang trước khi triển khai ba trang tiếp theo hoặc merge.
