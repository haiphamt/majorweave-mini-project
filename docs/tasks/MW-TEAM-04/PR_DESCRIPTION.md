## Task liên quan

- MW-TEAM-04 — Lê Nguyễn Hữu Hiếu (`hiuanhutiu`); reviewer cuối `haiphamt`, review chéo Nguyễn Thị Quỳnh Hân.
- [Task](TASK.md), [bàn giao](HANDOFF.md), [QA/AI log](QA_AI_LOG.md), [phản hồi review](REVIEW_RESPONSE_2026-10-09.md).
- Allowlist: Profile feature, domain activity/validate, bốn pack analyst/bi/engineer/business-analyst, script và tài liệu MW-TEAM-04.

## Thay đổi

- Validator Workspace/BackupFile/Profile và tổng hợp activity theo completion ledger.
- Profile v1 thêm hủy/validation và phản hồi lưu trung thực; giữ sidebar/style.
- Tám track DA/BI/DE/BA, 29 chặng mới, 43 bài, 24 nguồn và sáu mục tiêu chứng nhận ở trạng thái review.
- Sửa review: customized minutes độc lập segment; lưu draft không bị catalog readiness chặn; kiểm nguồn/tiên quyết ở helper trước tạo plan.

## Kiểm tra

- Bản local sửa review: 30 nhóm module/content, npm run check/build pass; log trong `docs/tasks/MW-TEAM-04/evidence/review-2026-10-09-*`.
- Baseline trước sửa: acb065d; kết quả mới áp dụng cho bản sửa review, được định danh bằng manifest SHA-256 trong evidence.
- 14 check UI v1 đã pass ở lượt 07/10; không phải bằng chứng UI v2 hoặc IndexedDB.
- R01/R02 dùng fixture và JSON round trip; E2E planner/progress/save/reload thật còn chờ bản tích hợp.
- [Nguồn đã khảo sát](SOURCE_INVENTORY.md), [flow](FLOW.md), ảnh/log trong evidence.

## Còn lại trước nghiệm thu

- Hải/Định xác nhận kiểm tra draft ở bước tạo plan; Hải/Chung Hiếu xác nhận provenance segment và completion snapshot.
- Tích hợp Profile/timezone/activity Workspace v2 và backup UI cùng Huy.
- Chạy đủ tám hành trình trên app ghép, gồm lưu/reload và dữ liệu cũ; Hải review, tích hợp và nghiệm thu. Toàn task chưa Done.

Người dùng đã cho phép tiếp tục bàn giao PR #7. Hải review/tích hợp; không tự merge main.
