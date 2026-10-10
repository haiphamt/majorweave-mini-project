# Bộ sơ đồ MW-TEAM-01

**16 flowchart**: 14 hành động của 6 nhóm FL trong TASK.md và 2 hành động retry/discard theo feedback 09/10. [FLOW.md](../FLOW.md) là đặc tả nghiệp vụ: điều kiện, dữ liệu trước/sau, bảng S/A/E/C, Mermaid và test liên kết. [TASK.md](../TASK.md) giữ mã nhóm gốc, có story cụ thể. [DIAGRAMS_20261010.md](../DIAGRAMS_20261010.md) ghi validation và giới hạn.

| Mã | Hành động | Nguồn chỉnh sửa | Vector | Ảnh GitHub/báo cáo |
|---|---|---|---|---|
| FL-MW-TEAM-01-01-A | Chọn ngành đang học | [HTML](fl-01-a.html) | [SVG](fl-01-a.svg) | [PNG](fl-01-a.png) |
| FL-MW-TEAM-01-01-B | Khám phá theo khoa khác | [HTML](fl-01-b.html) | [SVG](fl-01-b.svg) | [PNG](fl-01-b.png) |
| FL-MW-TEAM-01-02-A | Tìm và lọc hướng học | [HTML](fl-02-a.html) | [SVG](fl-02-a.svg) | [PNG](fl-02-a.png) |
| FL-MW-TEAM-01-02-B | Mở hướng học hoặc tổng quan | [HTML](fl-02-b.html) | [SVG](fl-02-b.svg) | [PNG](fl-02-b.png) |
| FL-MW-TEAM-01-03-A | Chọn hoặc đổi track | [HTML](fl-03-a.html) | [SVG](fl-03-a.svg) | [PNG](fl-03-a.png) |
| FL-MW-TEAM-01-03-B | Lưu lựa chọn roadmap draft | [HTML](fl-03-b.html) | [SVG](fl-03-b.svg) | [PNG](fl-03-b.png) |
| FL-MW-TEAM-01-04-A | Mở thông tin một chặng | [HTML](fl-04-a.html) | [SVG](fl-04-a.svg) | [PNG](fl-04-a.png) |
| FL-MW-TEAM-01-04-B | Lọc nguồn học và xử lý rỗng | [HTML](fl-04-b.html) | [SVG](fl-04-b.svg) | [PNG](fl-04-b.png) |
| FL-MW-TEAM-01-04-C | Chọn nguồn và áp dụng chặng | [HTML](fl-04-c.html) | [SVG](fl-04-c.svg) | [PNG](fl-04-c.png) |
| FL-MW-TEAM-01-04-D | Hủy hoặc đóng drawer chặng | [HTML](fl-04-d.html) | [SVG](fl-04-d.svg) | [PNG](fl-04-d.png) |
| FL-MW-TEAM-01-05 | Mở roadmap hoặc nguồn ở tab mới | [HTML](fl-05.html) | [SVG](fl-05.svg) | [PNG](fl-05.png) |
| FL-MW-TEAM-01-06-A | Lưu mục tiêu chứng nhận | [HTML](fl-06-a.html) | [SVG](fl-06-a.svg) | [PNG](fl-06-a.png) |
| FL-MW-TEAM-01-06-B | Bỏ lưu mục tiêu chứng nhận | [HTML](fl-06-b.html) | [SVG](fl-06-b.svg) | [PNG](fl-06-b.png) |
| FL-MW-TEAM-01-06-C | Chuyển sang My roadmap | [HTML](fl-06-c.html) | [SVG](fl-06-c.svg) | [PNG](fl-06-c.png) |
| FL-MW-TEAM-01-07-A | Thử lưu lại candidate đang chờ | [HTML](fl-07-a.html) | [SVG](fl-07-a.svg) | [PNG](fl-07-a.png) |
| FL-MW-TEAM-01-07-B | Xác nhận bỏ candidate My Plan | [HTML](fl-07-b.html) | [SVG](fl-07-b.svg) | [PNG](fl-07-b.png) |

HTML tự chứa CSS + SVG, static, không thực thi app hoặc đọc storage. SVG xuất từ HTML bằng helper gốc; PNG 2× chụp phần SVG từ HTML đã render. Khổ doc-wide 1280×720; PNG 2560×1440. GitHub xem trực tiếp ảnh trong FLOW.md; tải HTML để mở trình duyệt và dùng SVG khi cần vector. Mermaid là cách review logic trên GitHub, không dùng bố cục Mermaid để vẽ lại hình.

## Phạm vi và cách chỉnh

Baseline main `1e9bff4db59e75a6b90aa44f6b614a6ca5b73ee3`, PR #5 đã merge bởi Hải. Không đưa repo công cụ hoặc skill vào repo dự án. Không đổi giao diện app và không tự merge main. Hai sequence cũ chưa commit đã được thay bằng FL-07-B bao phủ xác nhận, hủy, guard, read failure và conflict.

Đọc luồng tương ứng trong FLOW.md và code trước khi chỉnh HTML; xuất lại SVG/PNG và cập nhật Mermaid/bảng khi ý nghĩa thay đổi. Mã hành động + bước phải thống nhất. [flows.json](flows.json) lưu nội dung và cạnh từng hình để đối chiếu.

Màu/font từ src/styles.css và index.html: Newsreader (tiêu đề), Be Vietnam Pro (nhãn), system monospace (mã kỹ thuật). Profile [majorweave-style-guide.md](majorweave-style-guide.md); không thay CSS app. HTML/SVG tải Google Fonts khi có mạng; công cụ offline có thể thay font. PNG cố định hình đã kiểm tra. Renderer dùng Node Playwright có sẵn và Chrome headless, không cài dependency vào dự án.

Nhánh không áp dụng được ghi rõ: ví dụ filter/đóng select không có save, mở link không biết trang ngoài tải thành công, đóng drawer sau save lỗi không tự discard shared pending. Không thêm confirmation không tồn tại trong code. Test lịch sử vẫn ghi ngày/SHA gốc; kiểm tra hình không thay kiểm thử nghiệp vụ hoặc nghiệm thu của nhóm trưởng.
