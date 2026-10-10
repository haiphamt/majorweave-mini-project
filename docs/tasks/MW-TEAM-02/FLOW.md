# Luồng chi tiết — MW-TEAM-02

**Sơ đồ cập nhật 10/10/2026:** [Bộ tám sơ đồ trực quan](diagrams/flows.html) và [nguồn Mermaid có thể chỉnh sửa](FLOW_DIAGRAMS.md), đối chiếu main tích hợp `1e9bff4`. My Plan v2 và migration đã được ghép; bảy nhánh Mobile/Game đã thử đến hoàn thành → tải lại. Các trạng thái “chờ ghép” ngày 08/10 bên dưới được giữ làm lịch sử; xem [kết quả sau tích hợp](MAIN_REVIEW_2026-10-10.md).

**Cập nhật 08/10/2026:** planner và My Roadmap hiện dùng shared Context v2 của Hải. UI không gọi storage, không ghi shadow plan v1, không chuyển tới My Plan cũ sau lưu. Các luồng tạo/lưu/preview/recovery dưới đây đã có browser test; completion/My Plan/migration vẫn chờ ghép. Xem [handoff](INTEGRATION_HANDOFF.md), [QA](QA_AI_LOG.md) và [review UI](UI_REVIEW_2026-10-08.md).

## FL-02-01 — Chọn chặng và prerequisite (AC-01; TC-02-01/07)

- Trước: có pack, track và draft. Người học chọn/bỏ chặng.
- Chính: kiểm tra ID thuộc track, đủ prerequisite được chọn hoặc đã biết; prerequisite cần học đứng trước chặng phụ thuộc. Chặng đã biết không yêu cầu học lại prerequisite.
- Lỗi: báo prerequisite/ID không hợp lệ; không generate/save plan.
- Hủy: không thay plan đang học. Sau: draft hợp lệ mới được generate.
- Trạng thái: đã kiểm thử domain + UI v2 bỏ/thêm bằng checkbox; thứ tự do controller chuẩn hóa; báo thiếu tiên quyết bằng tên chặng.

## FL-02-02 — Đã biết và nguồn học (AC-01/02; TC-02-07/10)

- Trước: draft cho track hiện hành; người học đánh dấu đã biết hoặc chọn source.
- Chính: source phải nằm trong resourceIds của stage; knownStageIds phải thuộc track. Dùng source mặc định nếu chưa chọn thay thế. Task giữ snapshot source/acceptance độc lập.
- Nhánh: all-known dẫn tới lỗi không còn nội dung để lập kế hoạch. Đổi track lấy draft riêng theo trackId; giữ draft của track trước.
- Lỗi/hủy: active plan không đổi. Sau: draft có thể reload, plan chỉ đổi khi xác nhận generate/regenerate.
- Trạng thái: source/known qua callbacks v2; bấm Lưu bản nháp để reload giữ thay đổi mà không sửa active plan. Domain và UI cả 7 track đã kiểm thử.

## FL-02-03 — Mục tiêu, giờ và ngày bắt đầu (AC-01; TC-02-01/08/11)

- Trước: form My Roadmap; người học nhập goal, giờ, ngày rồi tạo kế hoạch.
- Chính: goal không rỗng; số giờ nguyên 2–20; ngày lịch hợp lệ. Ngày Thứ Hai có thể tiếp tục.
- Nhánh: ngày khác Thứ Hai mở dialog đề xuất Thứ Hai kế tiếp; chỉ áp dụng ngày khi người học xác nhận.
- Hủy/Escape: giữ nguyên ngày cũ và plan cũ; trả focus về trigger. Nếu có plan thì xác nhận ngày vẫn phải đi qua xác nhận tạo lại.
- Lỗi: hiển thị validation, không tạo plan. Sau: generate hoặc mở xác nhận rebuild.
- Trạng thái: đã thực hiện và kiểm thử UI desktop/mobile, keyboard, reload.

## FL-02-04 — Tạo kế hoạch độc lập (AC-02/03; TC-02-02/03/06/07)

- Trước: draft hợp lệ và generator ID độc lập.
- Chính domain: loại stage đã biết; chia work thành đoạn ≤120 phút; xếp tuần theo giờ; tạo snapshot riêng. Không cấp ID trước khi validate hoàn tất.
- Hợp đồng UI v2: append plan vào workspace; gọi shared save với revision hiện tại; chỉ activate/thông báo thành công sau save thành công.
- Lỗi save/quota/conflict: giữ draft và plan cũ, hiển thị lỗi có thể thử lại; không tự ghi đè workspace mới hơn. Hủy: không append plan.
- Sau: hai plan độc lập, sửa plan A không làm đổi B.
- Trạng thái: tạo mới mặc định luôn append plan; đã thử hai plan cùng track và save failure/retry/conflict. Chỉ báo đã lưu sau callback ok; ở lại My Roadmap khi My Plan v2 chưa tích hợp.

## FL-02-05 — Preview và xác nhận tạo lại (AC-04; TC-02-04/09)

- Trước: có plan, draft thay đổi. UI v2 cần preview số task giữ/mới/backlog trước khi ghi.
- Chính: generate preview; xác nhận kiểm tra lại revision; regenerate bằng draft hiện tại; save transaction rồi cập nhật active plan.
- Nhánh: cùng workId/revision/segment giữ task ID/status/notes/completion. Revision mới là bài mới, không tự kế thừa completion.
- Lỗi: draft sai hoặc conflict thì không commit preview; giữ plan cũ. Hủy/Escape: không thay tasks, planMeta hoặc workspace.
- Sau: lịch sử generation cũ được lưu, ledger không nhân đôi.
- Trạng thái: nút Xem trước tạo lại tách khỏi Tạo kế hoạch mới, chỉ áp dụng active plan cùng track. Dialog có số task/completion/backlog; confirm/cancel/Escape/history đã thử. Đổi track tạo plan mới theo handoff leader.

## FL-02-06 — Custom task và lịch sử khi tạo lại (AC-04; TC-02-05)

- Trước: plan có task tùy chỉnh hoặc workId=null, có thể đổi track.
- Chính: giữ mọi custom/user-created task trong backlog; không ghi đè bằng template cùng identity. Work revision mới vẫn tạo template mới.
- Nhánh: task thuần template chỉ được giữ trạng thái khi identity còn khớp. Task cũ không còn trong lịch mới vẫn có trong history.
- Lỗi/hủy: input plan, nested source/acceptance/history và ledger không bị mutate. Sau: giữ notes/completion, closedWeeks của generation cũ và ledger lịch sử.
- Trạng thái: domain đã kiểm thử đổi track và snapshot isolation. Preview UI hiển thị số backlog/completion và giải thích giữ custom/history; màn thao tác backlog/completion/history đầy đủ thuộc My Plan v2 của Hiếu.
