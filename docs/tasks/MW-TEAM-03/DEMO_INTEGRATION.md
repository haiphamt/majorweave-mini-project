# My Plan v2 — Demo và điểm tích hợp đợt 3

Chung Minh Hiếu · 06/10/2026 · deadline **20:00 10/10/2026, giờ Việt Nam**.

## Trạng thái thực tế

**Cập nhật 08/10/2026:** PR #5 đã có `savePlan(next, expected)` và WorkspacePlan adapter theo diff đã đọc; không viết callback thứ hai dựa trên phần đề xuất cũ. Nhánh Hiếu vẫn chưa tích hợp adapter này. Phối hợp Hải kiểm retry/hủy pending/conflict, registry AI và kiểm thử tám track qua planner/lưu/reload. Bản sửa font/day được bàn giao riêng trong PR #2; xem [NEXT_STEPS_2026-10-08.md](NEXT_STEPS_2026-10-08.md).

**Cập nhật 07/10/2026:** Nhánh Hiếu và origin/main vẫn v1. PR #3 (`feat/mw-context-v2`, head f3462986ce49b10875338d50836d841a587d9e66) đã có WorkspaceProvider/useWorkspace/IndexedDB bootstrap, nhưng đang open. WorkspaceActions có selectPlan/retrySave, chưa có mutation callback lưu plan của MyPlanV2 và chưa registry bốn pack AI. Cần xử lý cả retry/cancel pending của controller, không chỉ nối props vào hook. Xem [đối chiếu code/điểm nối mới](PROGRESS_REVIEW_2026-10-07.md). Các ví dụ phía dưới vẫn là đề xuất adapter, không phải API đã triển khai. Bugfix font/day được kiểm lại độc lập, chưa tích hợp PR #3.

`src/app/context.ts` vẫn dùng LegacyAppContext/State v1; `src/persistence` có legacy adapter và README, chưa có load/save Workspace v2. `MyPlan.tsx` đang nối context v1 được giữ nguyên. Registry hiện chỉ Backend. **MyPlanV2 đã chạy trong fixture, chưa được nối app sản phẩm hoặc persistence v2.** Không có kho plan/storage riêng ở feature. Fixture dưới docs chỉ giữ dữ liệu giả trong bộ nhớ, reload là reset, không chứng minh lưu bền.

## Demo độc lập

Từ thư mục repo chạy:

```powershell
npx --no-install vite --host 127.0.0.1 --port 5183 --strictPort
```

Mở `http://127.0.0.1:5183/docs/tasks/MW-TEAM-03/ui-preview.html`. Fixture không nằm trong entry production build, không đọc/ghi localStorage. App v1 ở `/` vẫn chạy riêng. Reset fixture đặt lại dữ liệu; nếu đang đứng tuần không còn việc, chọn Tuần 1. Reload cũng đặt lại toàn bộ trạng thái fixture.

1. Chọn một trong tám plan từ dropdown. Mỗi fixture có hai việc tuần 1 và một backlog, 2 giờ/tuần. Cùng bài Python nền dùng để thử thao tác UI cho mỗi track; đây **không phải kế hoạch đầy đủ do planner sinh**.
2. Done → undo → done lại: tổng plan 1/3, tuần 1 là 1/2; ngày hoàn thành hiện từ context tiêm vào. Stats không cộng trùng lịch sử.
3. Thêm việc rồi Lưu trống để thấy validation. Nhập title/yêu cầu/phút/notes; nhập tuần theo số 1-based, để trống là backlog. Sửa việc bằng nút Sửa, nguồn và ID được domain giữ. Tuần vượt 120 phút có cảnh báo nhưng không xóa việc.
4. Bật Giả lập lỗi lưu tiếp theo, thêm việc hợp lệ. Khi lỗi, dữ liệu nền chưa đổi; Thử lưu lại dùng chính candidate đã chuẩn bị, không gọi add lần nữa. Hủy bỏ candidate. `Saves` chỉ tăng khi callback thành công.
5. Chốt tuần: xem danh sách unfinished, snapshot và đích/quỹ giờ; Hủy không lưu. Xác nhận từng cách dời đến tuần mở kế tiếp/backlog/skipped trên plan khác. Tuần chốt chỉ đọc, snapshot còn 1/2; việc dời xem được tại tuần đích/backlog. Stats current bỏ skipped khỏi mẫu số.
6. Weeks → Xem tuần; dropdown phiên bản Lịch sử để xem generation chỉ đọc. Thử các kịch bản Workspace rỗng/Lỗi tải/Đang tải/Plan archived. Tab và Escape trong dialog dùng component chung. Reload fixture sẽ reset; **không dùng bước này để trình diễn persistence thành công**.

Minh chứng: [desktop](evidence/ui-desktop.png), [mobile](evidence/ui-mobile.png), [ma trận browser](evidence/ui-matrix.json). Desktop chụp tab Weeks; mobile chụp snapshot tuần chốt.

## API nhận vào và trách nhiệm adapter

`MyPlanV2.tsx` nhận `plans`, `activePlanId` từ Workspace chuẩn; `stages` từ registry đã resolve dependency; `onSelectPlan(id)`, `onSavePlan(next, expected)` trả Promise<OperationResult<void>>; `getProgressContext()` và `nextTaskId()`. Có `loading`, `loadError`, `onReload` để phản ánh adapter. Callback là props của feature, không thêm hợp đồng global/type plan mới.

- Parent/context sở hữu Workspace duy nhất. Không tạo bản plans bằng useState ở route sản phẩm hoặc lưu trực tiếp trong feature. UI chỉ giữ form/navigation và **một candidate chưa lưu** để retry.
- Cả chọn plan và mutation phải await save thành công trước cập nhật Workspace context. Khi lỗi trả issues thật; đừng optimistic update rồi báo đã lưu.
- `expected` là plan object trước mutation. Adapter kiểm plan còn hiện hành, dùng revision của Workspace lúc chuẩn bị transaction và SaveWorkspaceFunction(nextWorkspace, expectedRevision). Nếu có refresh/command khác, trả conflict; tuyệt đối không lấy revision mới để overwrite candidate cũ. Cần serialize command và chống conflict giữa tab ở persistence. Feature chặn double submit, không thay thế transaction.
- Khi retry lỗi storage, dùng cùng `next` và cùng expected revision; chưa gọi clock/UUID/domain thêm lần nữa. Nếu context đã thay object, UI từ chối replay và yêu cầu mở lại thao tác. Callback phải phản ánh đúng save, không vừa thành công storage vừa trả lỗi.
- `getProgressContext` tạo now/today/timeZone **cùng thời điểm**, theo profile.timeZone, `today` không dùng UTC slice; `nextCompletionId`/`nextTaskId` phải UUID không trùng toàn workspace, kể cả snapshot/history. Domain không đọc Date/browser/storage ngầm.
- Caller validate runtime Workspace trước truyền; content chưa ready vẫn cần reviewer duyệt. History phải là generation snapshot độc lập do planner/persistence lưu, không reference current bị sửa.

## Diff đề xuất cho file chung — chưa áp dụng

| File/người tích hợp | Đề xuất và lý do |
|---|---|
| `src/app/context.ts` / Hải | Thêm Workspace v2/loading/loadError và transaction save với expectedRevision sau khi persistence/migration sẵn sàng. Giữ legacy bridge trong giai đoạn chuyển; không ép State v1 thành LearningPlan. |
| `src/app/App.tsx` / Hải | Route `/plan` dùng MyPlanV2 bên trong shell/sidebar hiện tại khi workspace v2 load hợp lệ; giai đoạn chưa migration vẫn dùng MyPlan v1. Không import preview docs vào app. |
| `src/persistence/**` / người phụ trách | Triển khai LoadWorkspaceFunction/SaveWorkspaceFunction chuẩn, validation/migration v1 bảo toàn backup, save failure/conflict. Feature không tự triển khai module này. |
| `src/content/index.ts` / Hải | Đăng ký bốn pack theo CONTENT_REVIEW.md và resolve stage dependency toàn registry cho props stages. Không chỉ lấy stages trong pack riêng. |

Đoạn wiring mô tả sau khi context v2 đã có (tên API transaction là đề xuất, không phải hàm đang tồn tại):

```tsx
import { MyPlanV2 } from '../features/my-plan/MyPlanV2';
// Render trong shell hiện có, không dựng store thứ hai.
<MyPlanV2
  plans={workspace.plans}
  activePlanId={workspace.activePlanId}
  stages={resolvedStages}
  onSelectPlan={selectPlanTransaction}
  onSavePlan={replacePlanTransaction}
  getProgressContext={progressClockAndUuid}
  nextTaskId={workspaceUniqueUuid}
  loading={loading}
  loadError={loadError}
  onReload={reloadWorkspace}
/>
```

`selectPlanTransaction`: chỉ sửa activePlanId hợp lệ, giữ drafts/plan data. `replacePlanTransaction`: tìm expected theo ID trong Workspace đã đọc, kiểm revision; chỉ thay plan tương ứng, giữ mọi plan/draft/profile khác, tăng revision theo persistence chuẩn. Publish Workspace trả về từ save rồi trả `{ok:true,value:undefined}`. Có lỗi trả đúng OperationResult thất bại. Không copy fixture callback vào app: fixture không có revision/migration/durable storage.

## Checklist bắt buộc sau tích hợp (chưa chạy)

Với mỗi `scientist.python`, `ml.classical`, `ml.cv`, `ml.nlp`, `mlops.serving`, `mlops.pipeline`, `ai-engineer.rag`, `ai-engineer.agents`: chọn nguồn (và đổi source) → tạo plan bằng planner thật → chuyển qua ít nhất hai plan → done/undo/done → sửa/dời/backlog → chốt tuần mỗi action → reload → đối chiếu IDs/source/completion/date/activePlanId và snapshot/history. Thử storage lỗi, conflict giữa tab, migration legacy, regenerate giữ customized. Chạy lại check registry đầy đủ và test logic/build. Ghi SHA mới và evidence; không lấy fixture Pass thay cho các bước này.
