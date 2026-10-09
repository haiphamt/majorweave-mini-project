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

- Tên hiển thị mới: UIT - Path.
- Explore bỏ nhãn “Bản trải nghiệm” và cách tô nổi bật riêng cho Backend. Nút mở đầu dẫn xuống danh sách hướng học.
- Profile giữ tên/ngành học, đổi tiêu đề thành “Hồ sơ học tập”; tên là tùy chọn. Bỏ khối “Đang khám phá” và thông tin kế hoạch lặp với My Plan.
- Múi giờ nằm trong “Tùy chọn nâng cao”, mặc định thu gọn. Giữ thao tác lưu/hủy, nhịp học, chứng nhận và sao lưu.
