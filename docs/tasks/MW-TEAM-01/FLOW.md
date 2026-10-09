# Luồng thực tế — MW-TEAM-01

Các luồng áp dụng app gốc với sidebar hiện có. Liên kết test TC tương ứng trong QA_AI_LOG.md. Workspace v2 và state hồ sơ v1 hiện cùng được giữ; feature không gọi storage trực tiếp.

| Flow / story / AC | Trước và đầu vào | Luồng chính / sau thành công | Thay thế / lỗi / hủy | Test |
|---|---|---|---|---|
| FL-01 Chọn ngành; US-01 / AC-01 | Explore đã tải; 6 khoa se/cs/is/ise/nc/ce và 12 ngành | Chọn khoa hiện tại → ngành → gợi ý theo nền tảng. Khoa khám phá chỉ đổi browseFaculty; plan không thay | Bỏ qua ngành được phép; Vi mạch giữ ngành và ghi rõ phạm vi phần mềm mở rộng, không thay VLSI. Không có bước hủy riêng cho dropdown | TC-01 |
| FL-02 Tìm/lọc; US-01 / AC-01 | Explore; query/category/nearOnly độc lập | Lọc danh mục 18 hướng → mở hướng đã đăng ký; hướng chưa đăng ký mở tổng quan | 0 kết quả có nút Xóa bộ lọc. Hủy tổng quan/Escape không đổi draft hay plan | TC-08/09 |
| FL-03 Chọn track; US-02 / AC-02/04/05 | Path detail; pathId và trackId phải phù hợp | Chọn Hướng/Nhánh → resolver chung → tạo draft riêng. Lưu lựa chọn ghi v2; query giữ nhánh khi reload. Tùy chỉnh roadmap chuyển đúng track | Không tồn tại hoặc sai path trả lỗi rõ; không fallback Backend. Khám phá không thay activePlan. UI loading/saving chặn thao tác; lỗi giữ bản chưa lưu để thử lại | TC-02/03/05/07 |
| FL-04 Chọn nguồn/chặng; US-01 / AC-03/05 | Drawer dùng bản chọn local, nguồn phải thuộc stage | Mở chặng → chọn nguồn/thêm chặng/đã biết → Áp dụng và lưu cập nhật draft rồi await save; success đóng drawer | Bộ lọc vi/en/free không đổi ngôn ngữ lập trình hay nguồn draft. Rỗng có Nới bộ lọc. Hủy/Đóng/Escape trước Apply không ghi. Lỗi save giữ candidate và hiện Thử lưu lại | TC-04/07/09 |
| FL-05 Mở nguồn; US-02 / AC-03 | URL HTTP(S) chính thức/provider rõ | Link roadmap/nguồn/chứng nhận mở tab mới qua External; plan nguồn là snapshot đúng lựa chọn lúc tạo | Đóng tab ngoài không thay workspace; không báo đã học hoặc cấp chứng nhận chỉ vì mở link | TC-03/10 |
| FL-06 Mục tiêu và plan; US-01 / AC-03/05 | Track đã resolve; credential ID có trong registry | Lưu/bỏ lưu bookmark qua callback, success sau save → Profile hiển thị mục tiêu. My roadmap đặt goal/hours/date → tạo plan → My plan hoàn thành → reload giữ kết quả | Date chưa Monday cần xác nhận; tạo lại plan có preview và Hủy giữ lịch sử. Quota/conflict không kích hoạt candidate sớm; retry. Mọi plan khác giữ nguyên khi đổi track | TC-05/06/07 |

Nguồn/phút của plan chốt tại thời điểm tạo; sửa draft không tự viết lại kế hoạch đang học. Dữ liệu v1 vẫn truy cập được qua My plan legacy khi có kế hoạch cũ. Review cuối của Hải là bước độc lập với kiểm thử kỹ thuật.
## Bổ sung FL-06 — hủy bản chưa lưu / giữ ngày (09/10/2026)

US-01 / AC-05 / TC-11: mutation save thất bại giữ plan committed và candidate local/shared. Bấm Bỏ hoặc đóng editor có pending mở xác nhận; Giữ thay đổi để thử lưu lại / Escape chỉ đóng xác nhận, pending vẫn còn. Xác nhận bỏ → callback Context đọc committed thành công → dọn shared/local → banner biến mất, sửa task khác được. Retry sau bỏ không ghi (`NO_PENDING_SAVE`). Nếu đọc lại lỗi, giữ candidate và báo lỗi; không báo đã bỏ thành công. Khi saving/loading, callback hủy bị từ chối; UI saving/discarding chặn thao tác. Conflict → xác nhận bỏ tải revision đã commit mới nhất của writer khác và giữ history. Không reset database.

Fail → retry từ feature hoặc banner → commit thành công mới kích hoạt plan; cả hai tầng pending hết. Banner retry thành công cũng dọn editor local; không để thao tác khóa bởi candidate cũ.

TC-12: sửa ngày Thứ Ba / tuần 1 → xóa tuần tạm → nhập 2 vẫn Thứ Ba; Hủy không ghi, tuần không hợp lệ không ghi. Chỉ khi submit tuần trống (backlog) mới chuẩn hóa dayIndex=null; reload giữ kết quả. Patch kế thừa Chung Hiếu 1ce77b1. Chi tiết bằng chứng theo SHA trong FEEDBACK_20261009.md.
