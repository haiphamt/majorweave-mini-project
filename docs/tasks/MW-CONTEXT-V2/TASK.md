# MW-CONTEXT-V2 — Context và callback Roadmap

**Chủ sở hữu:** Hải / nhóm trưởng. **Ngày:** 07/10/2026.

**User story:** Sinh viên chỉnh draft và tạo/xem trước/tạo lại kế hoạch qua một workspace chung; dữ liệu cũ và kế hoạch khác được giữ khi thao tác lỗi/hủy.

## Phạm vi

- App context/provider/controller/API, registry, port persistence trong contracts.
- Bootstrap `persistence/roadmap-store.ts` do Huy chưa làm load/save; không viết migration/backup hoặc validator semantic của các bạn.
- Dependency planner Định đã review, commit 20b38a2, ghép trên nhánh tích hợp riêng; chưa merge main.
- Hướng dẫn cho Định, kiểm tra controller và native IndexedDB/React.

## Acceptance

1. Draft riêng theo track; khám phá không đổi ngành/activePlan; tạo nhiều plan không ghi đè.
2. Preview/hủy không ghi DB; confirm kiểm tra stale token và giữ history.
3. Lỗi/abort/conflict không báo success, giữ candidate để retry; activePlan chỉ đổi sau commit thành công.
4. Callback dùng được qua React; IndexedDB compare revision+write atomic và dữ liệu đọc được sau reload.
5. UI/sidebar cũ giữ nguyên; key legacy không bị chuyển hoặc xóa, v2 chưa giả làm dữ liệu v1.
6. Check/build, 69 test planner, 16 test controller và browser native được ghi kết quả thật.

## Ngoài phạm vi

My Roadmap UI của Định; My Plan UI của Chung; profile/semantic validator của Hữu Hiếu; migration/backup của Huy; nguồn học chưa xác minh; Google login và Notion.

## Bàn giao

API: [HANDOFF_CONTEXT_V2](../../team/HANDOFF_CONTEXT_V2.md). Trạng thái code và giới hạn được ghi tại đó; không đánh Done các task thành viên.
