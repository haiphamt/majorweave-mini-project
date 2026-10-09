# MW-TEAM-04 — Bàn giao review cá nhân

Người làm: Lê Nguyễn Hữu Hiếu (`hiuanhutiu`). Branch: `feat/mw-team-04`. Reviewer cuối: Phạm Tuấn Hải; review chéo: Nguyễn Thị Quỳnh Hân.

## Phần đã triển khai

- Runtime validation Workspace/BackupFile/Profile theo contracts chung; kiểm tra cấu trúc, ngày/timezone, UUID, quan hệ completion và snapshot; giữ dữ liệu lịch sử khi thiếu catalog.
- Activity thuần: đọc completion ledger trên tất cả plan, kể cả archived; bỏ reverted; tách legacy không có ngày.
- Profile hiện hành: kiểm tra tên/ngành, hủy thay đổi và phản hồi trung thực khi persistence v1 thất bại. Giữ sidebar/style cũ.
- Bốn content pack ở `review`: tám track DA/BI/DE/BA, 29 chặng mới, 43 bài có acceptance, 24 nguồn và sáu mục tiêu chứng nhận đã khảo sát. Tham chiếu chặng Python chung từ Backend.
- User story, bảy flow, test case, nguồn khảo sát, AI log và minh chứng trong thư mục task.

## Kết quả kiểm tra

**Sửa review 09/10:** [Hai lỗi validator và chính sách draft](REVIEW_RESPONSE_2026-10-09.md) đã sửa trong working tree, 30 nhóm test/check/build pass. Chưa commit/push; mô tả PR được chuẩn bị local. Những kết quả dưới đây là của lượt bàn giao trước.

Lượt chạy ngày 07/10/2026: 28 nhóm module/content và 14 kiểm tra UI pass; `npm run check` và `npm run build` pass. Build 1613 module, 17.68s. Các lượt lỗi ban đầu được ghi trong QA log. Không chạy test tích hợp v2 khi dependency chưa tồn tại.

- [QA và AI log](QA_AI_LOG.md)
- [Nguồn và dependency nội dung](SOURCE_INVENTORY.md)
- [Kết quả module/content](evidence/unit-content.json)
- [Kết quả UI](evidence/profile-ui.json)
- [Check](evidence/check.log), [build](evidence/build.log)
- [Manifest code đã kiểm tra](evidence/source-hashes.json)

## Cần chốt và tích hợp

1. Hải/Huy chốt chữ ký validator và callback lưu/profile/import/export trong hợp đồng/context chung. Chữ ký hiện thực hiện ở mục 8 TASK.md; chưa coi là đã được liên nhóm duyệt.
2. Hải nối Workspace v2, timezone lưu/reload, activity adapter và trạng thái save/conflict. Hiện StudyActivity vẫn dùng v1; không đưa timestamp giả vào component để mô phỏng v2.
3. Huy cung cấp preview/confirm/cancel/export và chính sách skip/copy; sau khi chốt hợp đồng, Hiếu hoàn thiện UI Profile tương ứng trong allowlist.
4. Hải đăng ký bốn pack; Hân xác nhận shared IDs/resolver và `language.python`; Định/Chung Minh Hiếu tích hợp planner/progress.
5. Hiếu chạy lại TC-I01–I05 và đủ tám hành trình chọn track → đổi nguồn → tạo plan → hoàn thành → reload sau tích hợp. Hải review/tích hợp trước khi nghiệm thu Done.

## Giới hạn bàn giao

Đây là phần độc lập sẵn sàng review, **chưa hoàn tất toàn task**. Không có login, sửa shared types/context/CSS/registry/package hay phần sở hữu của thành viên khác. Chưa có kết quả nghiệm thu của Hải/Hân. Baseline local `6854350`; fetch trước đó bị từ chối nên chưa đối chiếu main remote mới nhất. Không tự merge hoặc force push.
