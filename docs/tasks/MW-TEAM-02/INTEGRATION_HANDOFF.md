# MW-TEAM-02 — Bàn giao tích hợp v2

**07/10/2026 · Chờ Hải chốt và tích hợp context, resolver, persistence chung.**

## Đã sẵn sàng trong phạm vi Định

- [Planner](../../../../src/domain/planner.ts): `generatePlan` theo `PlannerFunction`; `regeneratePlan(oldPlan, track, stages, resources, draft, context)` trả `OperationResult<LearningPlan>`. Context tạo lại gồm `contentVersion`, `generationId`, `nextTaskId`, `now`; giữ ID/createdAt của plan cũ.
- [Mobile](../../../../src/content/paths/mobile.ts) và [Game](../../../../src/content/paths/game.ts): 7 track trạng thái review, nguồn đã rà; test riêng resolve pack thật, không đòi đăng ký sớm vào registry chung.
- [MyRoadmap](../../../../src/features/my-roadmap/MyRoadmap.tsx): vẫn context v1 được giao; đã bổ sung giờ nguyên, ngày thực, đề xuất Thứ Hai kế tiếp/xác nhận/hủy. Không tự ghép một workspace/storage riêng.
- [Test](../../../../scripts/tasks/MW-TEAM-02.mjs): domain + content; `--ui` chạy regression MyRoadmap v1 trong browser context riêng.

## Đầu vào chung còn thiếu

Hiện [context](../../../../src/app/context.ts) chỉ có `State`, `update(Partial<State>): void`, `toast`, `openModule`. Không có `Workspace`, callback lưu trả kết quả, active plan, draft theo track, hoặc transaction. Vì `update` trả void, feature không thể khẳng định đã commit IndexedDB, phát hiện conflict hoặc lưu nhiều plan đúng cách.

Theo [task](TASK.md#4-phụ-thuộc-và-bàn-giao-kỹ-thuật): “Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback.” Không thay file chung hoặc tạo một callback/context thứ hai để lách quy tắc.

## Thứ tự tích hợp cụ thể

1. Hải đăng ký hai pack trong registry chuẩn; Hân resolve `track`, các `stage` theo ID và `resource` dùng cùng registry. Ngành không được chặn track.
2. Hải cung cấp workspace chung và draft theo `workspace.drafts[trackId]`; callback cập nhật draft phải giữ các track khác. Clock/UUID do app context cấp; UI không tự cấp lại ID trong lúc render.
3. Huy nối `SaveWorkspaceFunction(next, expectedRevision)` thật (transaction hoàn tất mới trả thành công), có migration giữ nguồn v1. Không dùng `LegacyAppContext.update` để giả lập kết quả lưu.
4. Định chuyển MyRoadmap sang callback đã chốt: chọn/bỏ chặng, đã biết, nguồn, mục tiêu, giờ, ngày. Hiện lỗi `ValidationIssue` theo field và thiếu prerequisite; giữ draft khi lỗi. Ngày khác Thứ Hai phải cho xem ngày đề xuất trước xác nhận.
5. **Tạo mới mặc định:** gọi planner với ID mới → thêm plan, chọn active trong bản workspace dự kiến → save với revision đã đọc → chỉ điều hướng/thông báo sau `ok`. Plan trước không bị ghi đè. Lỗi/conflict giữ bản chưa lưu và cho thử lại.
6. **Tạo lại riêng:** gọi pure function để xem preview, chưa save. Hiện track cũ/mới, số task, số giữ completion, backlog tự sửa/thêm, history; hủy bỏ preview giữ dữ liệu. Xác nhận mới save một transaction. Nếu workspace revision thay đổi khi dialog mở, từ chối preview cũ và yêu cầu dựng lại từ bản mới.
7. Chung Minh Hiếu dùng ledger chung khi hoàn thành/bỏ hoàn thành. Không tạo thêm completion cho task được giữ. Không sửa snapshot history/closed weeks.

## Quy tắc tạo lại đã thực hiện và cần review

- Cùng global `workId` + revision + khoảng phút giữ task ID, status, notes, completion. Hai nhánh thật sự dùng chung cùng work ID giữ tiến độ; hai bài chỉ trùng tiêu đề không giữ.
- `segment=null` của bài không chia tương đương `[0, minutes]` khi đối chiếu snapshot migration.
- Việc `customized=true` **hoặc** `workId=null` mặc định giữ ở backlog, kể cả khi đổi track. Các việc này giữ nội dung riêng, không áp template mới. Bài sửa khớp định danh chặn template trùng; revision mới vẫn là bài mới.
- Bài theo template không còn trong track mới chỉ ở history; ledger vẫn giữ để thống kê lịch sử. Các snapshot không chia sẻ object mutable với current hoặc input.
- Chọn đủ chặng nhưng không có work là lỗi; không tạo plan rỗng. Domain không ghi persistence, không tự chuyển ngày.

## Ma trận nghiệm thu sau tích hợp (chưa chạy)

Mỗi track Android/iOS/Flutter/RN/Unity/Unreal/Godot: chọn → đổi nguồn → tạo plan → hoàn thành → reload; kiểm tra nhãn/nội dung đúng track. Thêm: hai plan độc lập, cancel preview, same/different revision, đổi nhánh, backlog, lịch sử, save lỗi/quota, conflict hai tab, migration dữ liệu cũ, desktop/mobile/keyboard.

Các check/build hiện tại không thay thế ma trận này. Không chuyển task Done hoặc pack ready trước review chéo và Hải nghiệm thu.
