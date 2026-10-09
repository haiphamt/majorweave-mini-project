# Nhật ký AI trước đợt rà 07/10

Giữ nguyên nội dung người làm đã ghi trước đó; không phải kết quả xác minh lại các công cụ/model hoặc các lần chạy cũ. Bằng chứng hiện tại nằm trong QA_AI_LOG.md.

## AI Development Log

| Ngày / vòng | Công cụ / model thực dùng | Mục tiêu & prompt chính | Output ban đầu | Người kiểm tra phát hiện gì | Chỉnh prompt/code thế nào | Test / SHA sau chỉnh |
|---|---|---|---|---|---|---|
| 05/10/2026 | Claude 3.5 Sonnet | Code `planner.ts` framework | Tạo file validate và logic schedule tuần. | AI thiếu helper `isMonday` ban đầu. | Yêu cầu thêm logic validate khắt khe theo docs. | Code biên dịch tốt. |
| 05/10/2026 | Claude 3.5 Sonnet | Tạo dữ liệu cho `mobile.ts` và `game.ts` | File `mobile.ts` ban đầu quá dài bị lỗi write. | AI chia nhỏ nội dung khi ghi file. | Code chia phase viết nội dung ra làm nhiều luồng. | Typescript Check OK. |

| 06/10/2026 | Gemini 3.1 Pro / Sonnet | Implement `regeneratePlan` | `regeneratePlan` test logic pass | Fix logic bug `Date` (UTC) | Cập nhật hàm `isValidDate` & `isMonday` sang UTC để chạy đúng ngày | 65 PASS tests |

