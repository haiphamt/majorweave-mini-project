# Context v2 — bàn giao cho Định và các feature

**Ngày:** 07/10/2026. **Nhánh:** `feat/mw-context-v2`. **Task tích hợp:** MW-CONTEXT-V2.

Hải yêu cầu triển khai Context/callback để Định làm UI My Roadmap. Huy xác nhận qua Hải chưa bắt đầu persistence; bootstrap load/save được thêm ở file riêng, không nhận thay toàn bộ MW-TEAM-05. Không cập nhật Notion hoặc tự thay thiết kế.

## 1. Lấy code

Giữ nhánh cá nhân của bạn. Commit hoặc cất thay đổi đang làm trước khi cập nhật:

```sh
git fetch origin
git merge origin/feat/mw-context-v2
npm ci
npm run check
npm run build
```

Nhánh này đã ghép commit planner của Định `20b38a2` trong lịch sử Git; không viết lại planner. Chưa có nghĩa PR #1 hoặc nhánh tích hợp đã merge vào main.

## 2. Hook và nguồn dữ liệu duy nhất

```tsx
import { useWorkspace } from '../../app/context';

const {
  workspace, selectedTrackId, activePlan,
  status, dirty, error, preview, unsavedWorkspace, actions,
} = useWorkspace();
```

- `workspace` có thể null lúc tải/lỗi; không dùng non-null assertion trong UI.
- `status`: loading / ready / saving / error / conflict. Disable submit và sửa draft khi loading/saving hoặc có pending save.
- `error.issues` chứa field/code/message để hiển thị. Lỗi validation từ một action nằm trong result trả về, phải hiển thị result đó.
- `workspace`/preview là snapshot chỉ đọc, được freeze. Không push/splice hoặc ghi trực tiếp; dùng callback.
- `selectedTrackId` phục vụ khám phá/đang chỉnh; `workspace.activePlanId` chỉ plan đang xem. Hai lựa chọn độc lập, không đổi ngành hồ sơ khi chọn track.
- `unsavedWorkspace` là bản đề xuất chưa ghi được; giữ để thử lại/xuất về sau. Không tự reset hoặc ghi đè khi conflict.
- `useApp()` vẫn là API v1 cho UI cũ. UI mới không chép plan v2 sang state.tasks hoặc tạo state riêng.

## 3. Callback cho My Roadmap

| Callback | Kết quả / hành vi |
|---|---|
| `actions.resolveTrack(trackId)` | OperationResult<ResolvedTrack>; trả track, chặng theo thứ tự, nguồn, chứng nhận, version; thiếu tham chiếu thì lỗi |
| `actions.selectTrack(trackId)` | Chọn nhánh để chỉnh, không đổi activePlan/profile; trả draft mặc định hoặc đã lưu |
| `actions.getDraft(trackId)` | Bản sao draft hoặc null; mặc định chưa xác nhận đã biết, goal rỗng, 5 giờ, ngày Thứ Hai tới/gần nhất phía trước |
| `actions.updateDraft(trackId, patch)` | Chỉnh draft trong workspace RAM, dirty=true; không sửa plan. Thứ tự checkbox được đưa về thứ tự track |
| `await actions.saveDraft()` | Lưu workspace/draft; chỉ thành công sau transaction complete |
| `await actions.createPlan(trackId)` | Tạo ID plan mới, giữ mọi plan cũ, chỉ chọn activePlan sau save; trả OperationResult<LearningPlan> |
| `actions.previewRegeneration(planId)` | Xem trước tạo lại **cùng nhánh của plan**, không ghi storage; trả token và nextPlan |
| `await actions.confirmRegeneration(token)` | Dùng candidate nội bộ, kiểm tra token/revision/draft còn đúng; giữ history, chỉ áp dụng sau save |
| `actions.cancelRegeneration()` | Hủy preview trước confirm; giữ draft và plan, không ghi storage. Disable nút hủy khi saving |
| `await actions.selectPlan(planId)` | Lưu lựa chọn plan đang xem; không thay plan hoặc track đang chỉnh |
| `await actions.retrySave()` | Lưu lại đúng candidate đang chờ, không tạo thêm một plan khác |
| `await actions.reloadWorkspace()` | Nếu có dirty/pending thì trả UNSAVED_CHANGES; không bỏ dữ liệu âm thầm |
| `await actions.reloadWorkspace(true)` | Chỉ gọi sau UI xác nhận bỏ bản chưa lưu; đọc revision mới để xử lý conflict |

Đổi sang nhánh khác hiện dùng tạo plan mới, giữ plan trước. Không gọi tạo lại để âm thầm biến plan Backend thành Mobile. Việc hỗ trợ đổi nhánh trong một plan là điểm ghép tiếp theo, chưa được callback cùng-nhánh này nghiệm thu.

### Ví dụ tạo kế hoạch

```tsx
async function handleCreate() {
  if (!selectedTrackId) return;
  const result = await actions.createPlan(selectedTrackId);
  if (!result.ok) {
    setIssues(result.issues);
    return; // không báo đã lưu, không điều hướng khi save thất bại
  }
  setIssues([]);
  // result.value đã được lưu. Hải ghép UI My Plan v2 của MW-TEAM-03 sau.
}
```

Trong handler checkbox: lấy draft qua getDraft, tạo mảng mới, gọi updateDraft với selectedStageIds/knownStageIds. Chọn nguồn sửa resourceByStage bằng object mới. Đầu vào goal/hours/startDate có thể đang sai khi người dùng nhập; createPlan trả lỗi trước khi ghi. UI phải giải thích ngày Thứ Hai và cho xác nhận quy đổi, không sửa ngày trong im lặng.

### Ví dụ xem trước / xác nhận / hủy

```tsx
const result = actions.previewRegeneration(planId);
if (!result.ok) setIssues(result.issues);
// Nếu thành công, render preview.nextPlan và previousTaskCount trong dialog.
// Bấm Xác nhận:
const confirmed = await actions.confirmRegeneration(preview.token);
if (!confirmed.ok) setIssues(confirmed.issues);
// Bấm Hủy trước khi lưu:
actions.cancelRegeneration();
```

Thay draft sau khi mở preview sẽ làm token cũ hết hiệu lực. Muốn confirm phải xem trước lại. Chỉnh object preview nhận về không thể thay dữ liệu được lưu.

## 4. Ranh giới và phần chưa chuyển

- AppShell đã bọc một WorkspaceProvider chung; sidebar/CSS/JSX các feature cũ giữ nguyên.
- Registry có Backend 3 track + Mobile 4 + Game 3 để tích hợp. Trạng thái biên soạn được giữ, không gọi nguồn draft là đã review.
- UI My Roadmap/My Plan/Profile hiện vẫn v1 cho tới khi từng feature được nối/duyệt. Sau tạo plan v2, màn My Plan cũ không tự hiển thị plan đó. Không dùng việc tạo bản shadow v1 làm cách né tích hợp.
- Topbar hiện là save indicator v1. Trong UI v2 dùng status/dirty/error ở hook; Hải sẽ chuyển indicator toàn app khi các trang đổi sang v2.
- Không đọc/ghi/xóa key legacy qua callback v2, không tự migration. Huy làm preview/confirm migration + import/export; các plan v1 vẫn chạy ở UI cũ.
- Bootstrap IndexedDB: majorweave / version 1 / store workspace / key local. Revision compare và ghi cùng transaction; thành công sau complete, không fallback sang kho khác.
- `roadmap-store.ts` kiểm tra shape cơ bản để không đọc/ghi object hỏng. Chưa thay validator semantic đầy đủ của MW-TEAM-04 (ngày/timezone/UUID/quan hệ completion/snapshot). Huy truyền validator ấy vào createRoadmapStore hoặc thay persistence port khi đã review.
- Resolver ở app là adapter tạm để thiếu ID/source/prerequisite không bị coi thành công. Hân tiếp tục domain/content.ts; Hải thay adapter sau khi resolver đó đạt cùng test.

## 5. Cách kiểm tra

```sh
node scripts/tasks/MW-CONTEXT-V2.mjs
node scripts/tasks/MW-TEAM-02.mjs
npm run check
npm run build
npm run dev
```

Mở `http://127.0.0.1:5173/tests/context-v2-browser.html`, bấm Chạy kiểm tra rồi Thử callback qua React. Trang dùng DB QA có UUID riêng; không thao tác dữ liệu thật. Check logic đã được thêm vào npm run check/CI. Kiểm tra native vẫn chạy bằng trình duyệt.

Định làm UI trong `src/features/my-roadmap/**`, dùng style hiện có, ghi test thao tác UI. Không cần sửa lại provider/controller/planner hoặc gọi storage từ feature. Báo nhu cầu callback còn thiếu trước khi thêm API thứ hai.
