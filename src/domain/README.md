# Domain

`contracts.ts` là nguồn chuẩn cho dữ liệu v2, đã chuyển từ tài liệu bước 3. Chưa thay `State` v1 của UI đang chạy.

Các task sau sẽ tạo `content.ts`, `planner.ts`, `progress.ts`, `validate.ts` theo [kiến trúc](../../docs/KIEN_TRUC_MAJORWEAVE.md). Chưa có hàm giả trả thành công hoặc plan mẫu cho những phần ấy.

Quy tắc: hàm xử lý thuần; không import React, feature, persistence hoặc Prototype 02. Clock/ID truyền vào khi cần; kiểm tra dữ liệu ngoài app ở runtime. Thay chữ ký/kiểu cần ghi change request trong task và được nhóm trưởng thống nhất trước khi tích hợp.
