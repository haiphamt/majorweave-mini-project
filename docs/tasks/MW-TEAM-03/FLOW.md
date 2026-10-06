# Luồng chi tiết — MW-TEAM-03

Người làm: Chung Minh Hiếu. Deadline: **20:00 ngày 10/10/2026, giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7)**.
Đợt 1 ngày 06/10/2026 triển khai domain và test. Các bước UI/persistence dưới đây là hợp đồng tích hợp cần làm tiếp, chưa phải giao diện v2 đang chạy. Khi lưu thất bại, giữ plan cũ, hiển thị lỗi và cho thử lại; không thông báo đã lưu trước khi persistence thành công.

## FL-MW-TEAM-03-01 — Chọn plan và chuyển tuần

- Story: US-03-P1; AC-01. Actor: sinh viên tại My plan, chọn plan/tuần.
- Trước: workspace đã được validator kiểm tra; plan ID tồn tại; không có plan thì hiện empty state và đường dẫn tạo kế hoạch.
- Chính: (1) UI chọn plan ID hợp lệ; (2) context lưu activePlanId theo revision; (3) UI đọc generation hiện tại; (4) gọi calculateWeekStats cho tuần được chọn, chỉ đổi tuần đang xem.
- Thay thế: chọn archived/history cho chế độ chỉ đọc; chọn backlog dùng weekIndex=null. Đổi tuần không đổi draft, nguồn, task hay completion của bất kỳ plan nào.
- Lỗi: ID plan mất sau reload thì thông báo và cho chọn lại; generation không tồn tại trả generation_not_found; chỉ số tuần sai trả invalid_week. Lỗi lưu activePlanId không được báo thành công.
- Hủy: đóng bộ chọn giữ plan/tuần đang xem.
- Trước → sau: workspace.activePlanId=A → B nếu lưu thành công; dữ liệu A/B giữ nguyên. Trong đợt 1, domain nhận trực tiếp plan và không sửa workspace.
- Test: TC15/TC16/TC17 kiểm tra đọc tuần/backlog/history. Chọn nhiều plan, lưu activePlanId và empty UI: **chưa chạy, đợt tích hợp**.

## FL-MW-TEAM-03-02 — Hoàn thành, bỏ hoàn thành và làm lại

- Story: US-03-P2; AC-02. Actor: sinh viên bấm trạng thái task trong tuần mở/backlog của plan active.
- Trước: task thuộc current; task không skipped; quan hệ task/completion hợp lệ. Clock có now/today/timeZone nhất quán; ID factory cung cấp UUID chưa dùng.
- Chính: (1) UI gửi desired completed=true; (2) setTaskCompletion kiểm tra input; (3) tạo một StudyCompletion, gắn completionId và status=done; (4) context lưu kết quả thành công rồi cập nhật màn hình.
- Thay thế: completed=false đặt revertedAt, bỏ link và đưa về todo; hoàn thành lại tạo ID mới, giữ bản reverted cũ. Gửi true hai lần liên tiếp chỉ có một completion; false hai lần không đổi revertedAt. Không dùng toggle cho sự kiện có thể gửi lặp.
- Lỗi: tuần đã chốt/archived, ID thiếu/trùng, ledger mâu thuẫn, timezone/ngày sai hoặc undo trước completedAt → OperationResult lỗi; giữ toàn bộ input.
- Hủy: chưa gửi command thì không thay đổi. Nếu cần xác nhận undo, đóng dialog không gọi domain.
- Trước → sau: todo/null → done/C1 → todo/null (C1 reverted) → done/C2; không xóa C1. Ngày legacy null giữ null.
- Test: TC01–TC05, TC09, TC13, TC16, TC17. Reload và lỗi lưu thật: **chưa chạy**.

## FL-MW-TEAM-03-03 — Thêm việc, sửa tiêu đề/yêu cầu/phút/ghi chú

- Story: US-03-P3; AC-03. Actor: sinh viên mở form thêm/sửa ở My plan.
- Trước: active plan, tuần mở hoặc backlog; việc tự thêm thuộc selectedStageIds của generation hiện tại.
- Chính: (1) nhập title, acceptance, minutes, notes và lịch; (2) addTask hoặc updateTask xác thực; (3) trả bản plan độc lập; (4) đọc lại thống kê tuần/vượt giờ; (5) context lưu rồi đóng form.
- Kiểm tra: title không trắng; acceptance là mảng có ít nhất một chuỗi không trắng; minutes nguyên dương an toàn; notes là chuỗi; tuần null hoặc nguyên không âm; ngày null hoặc 0..6 và backlog phải null. Không cho patch ID, source, completion, status.
- Thay thế: chỉnh title/acceptance/minutes đặt customized=true và giữ cờ này; sửa cùng giá trị, notes hoặc lịch không tự bật cờ. Task tự thêm customized=true, workId/workRevision/segment/source=null. Sửa phút của task done không viết lại estimatedMinutes của completion cũ.
- Lỗi: field sai, stage không thuộc plan, factory lỗi/trùng UUID, tuần đóng → giữ form/input để sửa; không lưu.
- Hủy: đóng form bỏ bản nháp; không gọi domain.
- Trước → sau: task mẫu giữ ID và provenance, chỉ đổi các field cho phép; task tự thêm có UUID mới. Source/segment gốc được giữ khi tùy chỉnh để nhận diện nguồn.
- Test: TC06–TC08, TC10, TC18. Form/keyboard/hủy UI: **chưa chạy**.

## FL-MW-TEAM-03-04 — Dời việc, backlog và vượt ngân sách

- Story: US-03-P4; AC-03. Actor: sinh viên chọn lịch mới hoặc đưa vào backlog.
- Trước: task current thuộc tuần mở/backlog, plan active; đích không được đóng.
- Chính: (1) chọn tuần/ngày; (2) updateTask với weekIndex/dayIndex; (3) tính calculateWeekStats tại đích; (4) UI hiện overtimeMinutes khi >0, cho lưu bình thường; (5) persistence lưu plan mới.
- Thay thế: moveTaskToBacklog đặt cả weekIndex và dayIndex=null. Dời từ backlog về tuần nếu chưa chọn ngày vẫn null. Dời task done vẫn done.
- Lỗi: tuần âm/lẻ, ngày ngoài 0..6, đích đã đóng, nguồn đã đóng → lỗi và giữ task.
- Hủy: thoát chọn lịch không gọi mutation.
- Trước → sau: chỉ thay lịch; ID, workId/revision/segment, nguồn, notes, status, completionId và mọi completion date/timezone giữ nguyên. Backlog không có ngân sách tuần.
- Test: TC07, TC09, TC13, TC15. Cảnh báo vượt giờ và drag/drop trên UI: **chưa chạy**.

## FL-MW-TEAM-03-05 — Preview và chốt tuần

- Story: US-03-P5; AC-04. Actor: sinh viên chọn Kết thúc tuần.
- Trước: active plan, chỉ số tuần hợp lệ, tuần có task. Preview đọc task hiện tại và stats, không gọi closeWeek.
- Chính: (1) UI liệt kê done/todo/skipped và số phút; (2) chọn cách xử lý todo; (3) xác nhận; (4) closeWeek lưu snapshot độc lập TRƯỚC xử lý; (5) xử lý todo; (6) context lưu rồi hiển thị tuần đã khóa.
- Ba nhánh: move_next tìm tuần mở tiếp theo, bỏ qua tuần đóng, đặt dayIndex=null; move_backlog đặt tuần/ngày=null; skip giữ vị trí và đặt status=skipped. Done/skipped sẵn có không dời.
- Thay thế: tuần đã đóng gửi lại trả bản sao không đổi; quyết định lần đầu được giữ, kể cả retry mang action khác. Tuần chỉ có skipped có thể chốt, stats empty=true/0%.
- Lỗi: tuần hoàn toàn không có task, action sai, clock sai, không còn chỉ số tuần an toàn → không đổi plan. Lỗi lưu cần retry với revision, không tự xóa dữ liệu.
- Hủy: đóng preview không gọi closeWeek, không có snapshot mới.
- Trước → sau: closedWeeks tăng một snapshot gồm task trước xử lý, total/done/phút; task todo có thể chuyển lịch/trạng thái nhưng snapshot không đổi. Sau đó khóa sửa/add/move/done ở tuần đóng.
- Test: TC11, cả ba TC12, TC13, TC14, TC16. Preview/confirm/cancel và persistence UI: **chưa chạy**.

## FL-MW-TEAM-03-06 — Weeks, Stats và generation lịch sử

- Story: US-03-P6; AC-04. Actor: sinh viên mở Weeks/Stats hoặc chọn lịch sử.
- Trước: plan hợp lệ; generationId mặc định current, ID lịch sử phải tồn tại.
- Chính: (1) calculatePlanStats đọc inventory current; (2) calculateWeekStats đọc tuần; (3) nếu tuần đã chốt đọc snapshot/count đã lưu; (4) khi chọn generation lịch sử, đọc đúng generation đó; (5) UI hiển thị chỉ đọc.
- Công thức: done/(todo+done), không tính skipped. Không cộng snapshot/history vào plan hiện tại; việc backlog vẫn thuộc tổng plan. Mẫu số 0 trả empty=true và percentage=0; UI hiển thị “Chưa có việc được tính”, không 100%.
- Thay thế: đọc backlog với null, budgetMinutes=null/overtimeMinutes=0; tuần mở có budget=hoursPerWeek*60, overtime=max(0,totalMinutes-budget). Phút trong stats là ước lượng task tại bản đang xem, ledger giữ ước lượng ở lúc hoàn thành cho heatmap.
- Lỗi: generation/tuần không hợp lệ trả lỗi, không tự dùng current thay lịch sử.
- Hủy: quay lại view trước, không đổi dữ liệu.
- Trước → sau: chỉ đọc, không mutation. Sửa hoặc hoàn thành task được dời không làm thay tỷ lệ tuần chốt/history.
- Test: TC10–TC17. Tab Stats/Weeks, desktop/mobile và bàn phím: **chưa chạy**.

## Cập nhật đợt 3 — Mapping sáu flow UI (06/10/2026)

Các kết quả “chưa chạy UI” phía trên là lịch sử đợt 1; kết quả hiện tại dưới đây dùng MyPlanV2 controlled trong fixture, không phải app persistence v2 đã tích hợp. Callback thành công mới publish plan/activePlanId; lỗi giữ props cũ và candidate retry. Không có storage trong feature. Adapter phải kiểm Workspace expectedRevision theo DEMO_INTEGRATION.md.

| Flow / AC | UI chính, thay thế, lỗi, hủy | Bằng chứng và giới hạn |
|---|---|---|
| FL01 / AC01 | Dropdown chọn plan gọi onSelectPlan; chọn tuần/backlog chỉ đổi view. Loading/load-error/empty/missing selection có state riêng; lỗi chọn giữ props/hiện issues. | Browser chọn đủ 8 plan, empty/loading/load-error/reload callback. UI05/06. Không chứng minh activePlanId durable reload. |
| FL02 / AC02 | Checkbox gửi setTaskCompletion(completed), khóa lúc lưu; done/undo/redo, hiện localDate/timezone. Lỗi lưu không báo done; retry candidate hoặc bỏ thay đổi. | Browser 8/8 plan done/undo/redo, tuần đóng/history disabled; TC01–05 và UI03/04. Storage thật/command giữa tab chưa chạy. |
| FL03 / AC03 | Add/edit Dialog dùng component chung; title/phút/yêu cầu bắt buộc, textarea một yêu cầu/dòng; source không cho chỉnh. Lỗi validation giữ form, lỗi save cho retry cùng result; Hủy/Escape không lưu. | Browser form trống, add60/180 phút, save fail/retry chỉ 1 việc; sửa title/phút/tuần, tùy chỉnh/notes; UI01/04. TC06–08. Chưa thử giới hạn runtime storage thật. |
| FL04 / AC03 | Sửa tuần/ngày, để trống về backlog, nút Đưa vào backlog; cảnh báo vượt giờ trong form và tuần. Tuần đích đã đóng trả lỗi domain, giữ bản cũ; cancel không mutation. | Browser sửa từ tuần1→2→backlog, tuần2 rỗng 0/0, cảnh báo210 phút; TC09/13/15, UI02/04. Không có drag/drop, thao tác lịch qua form. |
| FL05 / AC04 | Chốt tuần mở Dialog liệt kê unfinished, snapshot ratio và đích/overtime; ba radio next/backlog/skipped; Hủy không gọi domain. Confirm chuẩn bị result, await callback; lỗi retry same result, khóa tuần chỉ sau save success. | Browser hủy preview giữ nút chốt, cả3 action trên8plan, đích/backlog đúng; snapshot1/2 và checkbox khóa. TC11–14. Transaction save fail cho close/reload thật chưa chạy. |
| FL06 / AC04 | Plan/Stats/Weeks, Xem tuần/backlog, chọn generation. Snapshot/history/archive readonly, empty rõ; skipped loại khỏi tổng, source snapshot safe protocol. Navigation không sửa plan. | Browser Stats tuần1 giữ1/2 ở cả8plan, Weeks, history readonly, archived, mobile390×844; UI02/03/07/08 và TC15–17. History regenerate/planner thật chưa chạy. |

Input invariant/history immutability/ID/date được assert tại domain; browser chỉ kiểm hành vi hiển thị/tương tác. Sau tích hợp chạy full hành trình và cập nhật actual theo checklist demo, không đổi các ca chưa chạy thành Pass bằng fixture.
