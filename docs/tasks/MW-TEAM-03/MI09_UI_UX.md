# MI09 — Tài liệu UI/UX và nguồn thiết kế
Người phụ trách: Chung Minh Hiếu. Rà ngày 08/10/2026, code nền 1ce77b1491d09c2134fe4cd9ebf652fe3b7582fc. Deadline 20:00 10/10/2026 Việt Nam. MI09 được xác nhận từ ảnh bảng phân công Notion do Hiếu cung cấp; reviewer trên bảng là Lê Nguyễn Hữu Hiếu. Đây là tài liệu gửi review, chưa phải nghiệm thu.

## Bố cục và điều hướng
App thật dùng AppShell và src/styles.css: sidebar desktop rộng 225px, sticky theo chiều cao màn hình; vùng nội dung tối đa 1320px, topbar 73px. Sidebar gồm Explore, Path detail, My roadmap, My plan và Profile. Thứ tự này giúp người học chọn hướng, nguồn và lịch trước khi theo dõi tiến độ. Nhãn phụ tiếng Việt giải thích mục đích, số thứ tự giúp nhận diện vị trí.
Ở breakpoint 760px, CSS hiện có chuyển sidebar thành điều hướng gọn theo chiều ngang; đây là hành vi responsive của app gốc. Kiểm tra 390×844 cho năm trang không thấy tràn ngang. Không thay sidebar hoặc tạo hệ điều hướng mới trong MyPlanV2.
MyPlanV2 đặt bộ chọn plan trước Plan/Stats/Weeks. Plan có danh sách tuần/backlog, công việc và thao tác; Stats có tỷ lệ/phút; Weeks đọc tuần chốt. Lịch sử và archived chỉ đọc. Fixture dùng CSS thật nhưng sidebar giả và dữ liệu RAM; không chứng minh điều hướng/persistence v2 đã tích hợp.

## Màu, chữ và khoảng cách
| Token đang có | Giá trị | Vai trò / lý do ghi nhận |
|---|---|---|
| bg / paper | #f4f1ea / #fbfaf6 | Nền ấm, phân biệt trang và thẻ |
| ink / muted | #1c1a17 / #736d64 | Nội dung chính và thông tin phụ |
| line | #ded9cf | Ranh giới thẻ/form |
| rust / rust-soft | #a74127 / #f0e1d7 | Hành động chính, focus và điểm nhấn |
| green / green-soft | #61715a / #e9ede2 | Trạng thái tiến độ |
| Body | Be Vietnam Pro | Chữ giao diện tiếng Việt; fixture phải tải cùng font entry |
| Heading | Newsreader | Tiêu đề tạo nhịp đọc khác với nội dung |
| Số / eyebrow | JetBrains Mono | Nhận diện số liệu và nhãn nhỏ |
| Focus | Outline rust 2px, offset 4px | Bàn phím nhìn thấy vị trí thao tác |
Page padding desktop 42px 46px 54px; nút chính tối thiểu 42px. Đây là số đo CSS hiện có, không phải một thiết kế mới do Hiếu phê duyệt. Icon button 32px và checkbox 16px cần reviewer đánh giá vùng bấm thực tế; chưa kết luận đạt toàn bộ WCAG.

## Component và hành vi
| Component | Dùng ở đâu | Quyết định |
|---|---|---|
| Button, input, select, textarea | Chọn plan, form, thao tác task | Tái dùng lớp CSS và điều khiển native, label rõ |
| Dialog chung | Thêm/sửa, preview chốt tuần | Native showModal, Escape, trả focus; không lưu khi hủy |
| Task card / checkbox | Plan và backlog | Gửi trạng thái đích; khóa khi pending |
| Status / alert | Loading, lỗi, save/retry | Chỉ báo đã lưu sau callback thành công |
| Form yêu cầu từng dòng | Thêm/sửa | title/acceptance/phút bắt buộc; báo lỗi cạnh form |
| Preview chốt | Ba cách xử lý unfinished | Cho thấy snapshot, đích và phút vượt trước xác nhận |
| Readonly view | History, archived, tuần đóng | Không cung cấp thao tác sửa |
Plan/Stats/Weeks dùng button aria-pressed; chưa phải ARIA tablist. Không mô tả phím mũi tên chuyển tab khi code chưa hỗ trợ. Candidate sau save lỗi được giữ để retry; adapter phải xử lý pending/conflict chung.

## Nguồn đã mở ngày 08/10/2026
| Nguồn chính thức | Kết quả / giới hạn sử dụng |
|---|---|
| https://beaverplans.com/ | App About ghi nguồn cảm hứng; trang mở được với tiêu đề planner, không trích xuất được nội dung chi tiết. Không nhận đã kiểm chứng mọi bố cục hoặc quyền sao chép asset. |
| https://fonts.google.com/specimen/Be+Vietnam+Pro | Mở được trang family; dùng tên font từ CSS/entry, chưa xác nhận license bằng nội dung trang này. |
| https://github.com/productiontype/Newsreader | README mô tả đọc trên màn hình, hỗ trợ Vietnamese trong Latin Plus và OFL 1.1. |
| https://www.jetbrains.com/lp/mono/ | Trang font chính thức, free/open source; không tự thêm font mới. |
| https://lucide.dev/guide/ | Hướng dẫn SVG icon và ISC license; repo đã dùng lucide-react. |
| https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | Đối chiếu Tab/Shift+Tab, Escape, focus vào/ra dialog. Chỉ là chuẩn tham khảo, chưa chứng nhận accessibility. |
| https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | Nguồn tiêu chí tương phản; chưa đo toàn bộ cặp màu/trạng thái nên chưa ký Pass WCAG. |
Một URL GitHub dự kiến cho Be Vietnam Pro trả 404; không dùng làm bằng chứng license. Không lấy nguồn khóa học thay cho nguồn thiết kế.

## Kết quả và việc cần review
Bằng chứng desktop/mobile và trạng thái ở MI07_MI08_REVIEW_2026-10-08.md. Hai bugfix giữ phong cách hiện có: bổ sung font links cho fixture; giữ day draft khi tuần tạm trống. Chưa đo đủ contrast, screen reader, mọi đường Tab/Shift+Tab, kích thước mục tiêu hoặc các trình duyệt khác. Lý do lựa chọn trên là phân tích từ UI/code hiện có, không gán là quyết định gốc của người thiết kế.
Đề nghị Hữu Hiếu review MI09 và Hải nghiệm thu việc giữ thiết kế chung.
