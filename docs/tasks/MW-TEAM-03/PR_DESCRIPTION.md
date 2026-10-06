# Đề xuất PR: MW-TEAM-03 — Tiến độ, tám track AI và My Plan v2 có kiểm thử

Hoàn thiện module tiến độ thuần theo contracts, bốn content pack/tám track ở trạng thái review, và MyPlanV2 nhận Workspace plan/callback. UI cho chọn plan, Plan/Stats/Weeks, done/undo, thêm/sửa/dời/backlog, preview/hủy/xác nhận chốt tuần và history chỉ đọc. Snapshot được chụp trước xử lý unfinished; stats bỏ skipped, không đếm trùng completion. Lỗi lưu không báo thành công và retry dùng lại cùng candidate.

Context/persistence sản phẩm vẫn v1. Giữ MyPlan v1, sidebar/CSS/component dùng chung; không thêm store hoặc dependency, không sửa registry/contracts/app chung. MyPlanV2 chạy trong trang fixture test-only; cần adapter transaction/persistence/migration và registry trước tích hợp. Điểm nối, trách nhiệm expectedRevision, demo và test còn thiếu ở DEMO_INTEGRATION.md.

Validation ngày 06/10/2026: 38/38 task tests (20 progress, 10 content, 8 view model/SSR); TypeScript riêng preview; npm run check/build; browser fixture tám plan với done/undo/redo/close, cả ba xử lý unfinished, snapshot Stats, form/error/retry/cancel, history/archive/empty/loading, keyboard Tab/Escape và 390×844. Smoke app v1 Explore/My Plan không lỗi console. Chưa chạy chọn nguồn/tạo plan bằng planner/reload persistence thật hoặc migration đa tab. Nguồn đã mở kiểm tra ở SOURCES.json; chưa thực hiện các bài học hoặc đạt chứng nhận. Cả bốn pack giữ reviewStatus=review.

Người làm: Chung Minh Hiếu. Deadline 22:00 10/10/2026 Việt Nam. Đây là mô tả để review; chưa tạo PR, commit hoặc push. QA_AI_LOG.md ghi kết quả/giới hạn, FLOW.md có sáu flow. Reviewer cần duyệt content/workload và adapter chung trước nghiệm thu.
