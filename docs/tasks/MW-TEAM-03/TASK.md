# MW-TEAM-03 — Kế hoạch tuần, tiến độ và nội dung AI

## Cập nhật tiếp tục ngày 09/10/2026
Bugfix đã push tại **1ce77b1491d09c2134fe4cd9ebf652fe3b7582fc**; PR #2 OPEN cùng SHA trước lượt tài liệu này. Không commit trùng hai bugfix. Đã hoàn thiện sáu flow có bảng/sơ đồ, MI09_UI_UX.md, MI07_MI08_REVIEW_2026-10-08.md, CONTENT_AUDIT_2026-10-08.md và REVIEW_MW_TEAM_02_2026-10-08.md. Browser/source audit chạy 08/10; validation mới chạy 09/10, không sửa ngày bằng chứng cũ.
41/41 tests MW-TEAM-03, check, preview TypeScript và build không prebuild đạt; planner Định 123/123 và cross-review 22/22. Log mới trong evidence/*validation-2026-10-09.txt. Phần app v2 vẫn chờ nền Hải xác nhận; xem HANDOFF_2026-10-08.md (có cập nhật09/10). Không có đủ bằng chứng để tự đánh Done toàn task.
PR #6 mới tại **2be6c07bb12089e477e96d87e80436d0c55062cb**: QA của Huy bổ sung hai tab, blocked/abort/transaction complete và quota injection. Đây là bằng chứng do Huy cung cấp, chưa chạy lại bởi Hiếu; migration/backup/semantic validator còn thiếu. PR #1/#3/#5/#7 và main không đổi; #3/#5 chưa có comment/review xác nhận nền tích hợp.
Các checkpoint HEAD30d6712/chưa push bên dưới là lịch sử, không phải trạng thái mới. Việc tiếp theo: reviewer đọc artifact, Hải chỉ định SHA tích hợp, kiểm một AI track end-to-end rồi tám track. Deadline vẫn20:00 10/10/2026.


**Cập nhật bàn giao bugfix 08/10/2026:** Hiếu đã cho phép commit/push bản sửa font fixture và giữ ngày học khi đổi tuần vào PR #2. Chạy lại trên code bàn giao: 41/41 task tests, check, TypeScript preview và build không prebuild đều pass; log ở [evidence/bugfix-2026-10-08-verification.txt](evidence/bugfix-2026-10-08-verification.txt). Browser ngày 07/10 là minh chứng trước/sau; không chạy lại browser trong lượt 08/10. PR #5 đã có savePlan/WorkspacePlan adapter theo diff đọc ngày 08/10, chưa được kiểm thử/tích hợp tại nhánh này. Trạng thái 07/10 và các đợt dưới đây là lịch sử; toàn task vẫn chờ tích hợp và nghiệm thu.

**Người làm:** Chung Minh Hiếu (`chungminhhieu2311-collab`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Triệu Quang Huy.
**Branch:** `feat/mw-team-03`. **Trạng thái hiện tại 07/10/2026:** Đã bàn giao commit `30d67122d94aa9784fb688f5e3eb7ade112c5c9a` qua [PR #2](https://github.com/haiphamt/majorweave-mini-project/pull/2), đang open, chưa có review. Main vẫn v1; [PR #3](https://github.com/haiphamt/majorweave-mini-project/pull/3) có provider v2 nhưng còn thiếu callback mutation My Plan và registry AI. Đã sửa lỗi font fixture và mất ngày khi nhập tuần; 41/41 task tests pass, browser tái hiện/kiểm lại hai lỗi. Sửa lỗi lượt này chưa commit/push. Đánh giá từng yêu cầu: [PROGRESS_REVIEW_2026-10-07.md](PROGRESS_REVIEW_2026-10-07.md). Chưa nghiệm thu toàn task.

Đọc [phân công chung](../../team/PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md) và [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md). Scope chi tiết/nhánh là baseline từ bảng đích; ghi thay đổi được Hải chốt vào task, không tự thu hẹp.

## 1. Quyền sửa file

- `src/features/my-plan/**`
- `src/domain/progress.ts`
- `src/content/paths/scientist.ts`
- `src/content/paths/ml.ts`
- `src/content/paths/mlops.ts`
- `src/content/paths/ai-engineer.ts`
- `scripts/tasks/MW-TEAM-03.mjs`: kiểm thử module/nội dung task với công cụ đã có; không hạ assertion chung.
- `docs/tasks/MW-TEAM-03/**`: story, flow, test, AI log, minh chứng và yêu cầu phối hợp.

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. Các file mới trong allowlist cần được triển khai theo từng đợt; xem kết quả đợt 1 bên dưới. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

## 2. Nội dung phải hoàn thiện

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| Data Scientist · `scientist` | `scientist.python` | Python / thống kê / mô hình | 1 |
| Machine Learning · `ml` | `ml.classical`, `ml.cv`, `ml.nlp` | scikit-learn; Computer Vision / PyTorch; NLP / Transformers | 3 |
| MLOps Engineer · `mlops` | `mlops.serving`, `mlops.pipeline` | Serving và monitoring; Pipeline và vòng đời mô hình | 2 |
| AI Engineer · `ai-engineer` | `ai-engineer.rag`, `ai-engineer.agents` | LLM / RAG với Python; Tools / agent với Python | 2 |
| **Tổng của task** | | | **8** |

Mỗi track có chặng nền tảng/riêng, tiên quyết, nguồn trực tiếp đã mở kiểm tra, bài thực hành có phút/acceptance, portfolio và mục tiêu chứng nhận đã khảo sát. Không nhân số nguồn bằng link trùng/trang chủ. Chứng nhận không phù hợp phải có lý do sau khảo sát và portfolio; không điền mục giả. Gói ở `review` tới khi Hải nghiệm thu. Không dùng `checkedAt` của pack cũ như bằng chứng đã kiểm tra lại từng URL hôm nay.

## 3. Phần thực hiện

1. My plan có chọn plan đang xem, Plan/Stats/Weeks trong trang cũ. Chuyển plan chỉ đổi activePlanId; draft/hướng đang khám phá không sửa kế hoạch.
2. Viết mutation thuần trong domain/progress.ts: hoàn thành/bỏ hoàn thành, thêm/sửa/ghi chú/dời việc, backlog, chốt tuần; nhận clock/ID/timezone từ context khi cần.
3. Hoàn thành tạo StudyCompletion; bỏ dấu ghi revertedAt và bỏ liên kết task; làm lại tạo bản mới. Dời việc giữ ID và ngày hoàn thành thực; sửa requirements/minutes cập nhật customized.
4. Chốt tuần preview việc còn lại, xác nhận dời/backlog/skipped; snapshot trước khi xử lý. Tuần đã chốt/history chỉ đọc, Stats không thay khi việc được dời.
5. Tiến độ done/(todo+done), skipped không trong mẫu số; tuần rỗng không ghi 100%. Thêm/dời/sửa vượt giờ hiển thị số phút vượt, không làm mất việc.
6. Biên soạn DS, ML, MLOps, AI Engineer đủ tám track: thống kê/toán/dữ liệu/evaluation, CV/NLP sau nền tảng; serving/lifecycle và RAG/agent có prerequisite, bài riêng, chi phí/điều kiện API khi dùng.

## 4. Phụ thuộc và bàn giao kỹ thuật

**Đầu vào:**

- LearningPlan/PlanTask/StudyCompletion/ClosedWeek đã có; mục 6.3 kiến trúc.
- Planner và identity đoạn của Định; persistence/context lưu do Hải/Huy ghép; không tự ghi storage.
- Hữu Hiếu cần sổ completion đúng để tính heatmap; bàn giao quy tắc timeZone/localDate thống nhất.

**Đầu ra:**

- My plan + mutation/progress/Stats dùng chung, không viết công thức lặp trong UI/Profile.
- Bốn pack AI, tám track; fixture/test cho done/undo, tuần chốt và tạo lại.

**Bàn giao sớm:** 05/10 chốt mutation/progress output với Định, Hữu Hiếu và Hải; 06/10 bàn giao done/undo + thống kê nền trước, rồi thêm tuần chốt/Stats/Weeks và hoàn thiện nội dung AI.

Có thể làm inventory nguồn, pack, pure module và test trên dữ liệu thử trước. Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback. Không tự gọi v2 đã chạy trong app khi mới compile pack/module. Không để dependency chưa có làm dừng phần độc lập.

## 5. User story và acceptance ban đầu

**US-MW-TEAM-03-01:** Là sinh viên, tôi muốn sử dụng my plan: plan / stats / weeks theo hướng/nhánh đã chọn, để học đúng nội dung và giữ kế hoạch/tiến độ của mình.

**US-MW-TEAM-03-02:** Là người biên soạn, tôi muốn các track được giao có nguồn, bài và đầu ra phù hợp, để mọi cấu hình đều sử dụng được trong cùng website.

Story chi tiết theo hành động được bổ sung tại mục 8; bảng dưới giữ phạm vi bắt buộc của toàn task.

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Chọn giữa nhiều plan giữ việc/nguồn/history của từng plan; activePlanId hợp lệ; empty state dùng được. | Chọn plan / tuần | Hai plan khác track; plan archived; chưa có plan |
| AC-02 | Done/undo/done lại có ghi nhận đúng, không đếm trùng; di chuyển không đổi completedAt/localDate. | Hoàn thành / bỏ hoàn thành / dời | Timezone, ngày thực, undo, thao tác lặp, reload |
| AC-03 | Thêm/sửa/dời giữ ID/notes, customized đúng; vượt ngân sách hiển thị rõ; hủy không mất dữ liệu. | Thêm / sửa / dời / backlog | Việc tự thêm, phút sai, giờ vượt, hủy dialog |
| AC-04 | Chốt tuần giữ snapshot, xử lý unfinished đúng lựa chọn; Weeks/history chỉ đọc; Stats giữ tỷ lệ cũ. | Kết thúc tuần và xem lịch sử | Dời/backlog/skipped, hủy, tuần rỗng, tuần đã chốt |
| AC-05 | Tám track AI có prerequisite và bài phù hợp; source/credential không phải một bộ mẫu giống hệt. | Khám phá AI và tạo/học kế hoạch | DS/ML/CV/NLP/MLOps/RAG/agent, kiểm tra nguồn thật |

## 6. Luồng riêng và test case phải viết

Copy mẫu [FLOW](../../templates/FLOW.md) thành `FLOW.md`; mỗi hành động bên dưới có mã riêng, điều kiện đầu vào, luồng chính/thay thế/lỗi/hủy, dữ liệu trước/sau và AC/test liên kết. Không chỉ nộp một sơ đồ tổng quát.

- **FL-MW-TEAM-03-01:** Chọn plan và chuyển tuần.
- **FL-MW-TEAM-03-02:** Hoàn thành, bỏ hoàn thành và làm lại.
- **FL-MW-TEAM-03-03:** Thêm việc / sửa yêu cầu, phút và ghi chú.
- **FL-MW-TEAM-03-04:** Dời việc / đưa vào backlog / vượt ngân sách.
- **FL-MW-TEAM-03-05:** Preview kết thúc tuần, xử lý chưa xong, xác nhận/hủy.
- **FL-MW-TEAM-03-06:** Xem Weeks, Stats và generation lịch sử.

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Test domain đợt 1 đã chạy và Pass; kết quả thực ở QA_AI_LOG.md. Test UI vẫn chưa chạy; test nội dung đợt 2 xem mục 9 và QA_AI_LOG.md.

- Mutation thuần: ID/notes/source/completion invariants, done/undo và customized; tiến độ bỏ skipped.
- Snapshot tuần chốt bất biến sau dời việc; ba xử lý unfinished; tạo lại không nhân đôi ghi nhận.
- UI Plan/Stats/Weeks, lỗi lưu/hủy, keyboard/mobile; tám track AI qua toàn hành trình.
- `npm run check`, `npm run build` và script task: ghi lệnh/kết quả thật. Pack chưa đăng ký chưa được check chung bao phủ; test riêng phải resolve cùng các pack phụ thuộc, sau tích hợp chạy lại toàn registry.
- Mọi cấu hình trong bảng phải được kiểm tra chọn → đổi nguồn → tạo plan → hoàn thành → reload trên app đã tích hợp. Shared planner không miễn kiểm tra nhánh.
- UI: desktop/mobile, bàn phím, loading/empty/error, lưu lỗi/hủy. Nội dung: URL/provider/phí/điều kiện/ngày kiểm tra thực.
- AI log của mình, không bịa bug hoặc Pass. Nhóm sẽ làm so sánh hai công cụ AI trên một bài nhỏ chung, không bắt từng người xây app bằng hai AI.

## 7. Định nghĩa bàn giao hoàn tất

- [ ] Tất cả hướng/track và module được giao đã làm; không còn placeholder thiếu nguồn/bài.
- [ ] `TASK.md`, `FLOW.md`, `QA_AI_LOG.md` có nội dung do người làm bổ sung, bằng chứng và SHA/PR.
- [ ] Kiểm tra đơn vị/nội dung, check/build và UI liên quan có kết quả thực.
- [ ] Hợp đồng/ID dùng chung đã phối hợp; diff đúng allowlist, style/sidebar cũ được giữ.
- [ ] Hải đã tích hợp; kiểm tra lại mọi cấu hình của task trên app chính, dữ liệu cũ còn nguyên.
- [ ] Review chéo và Hải nghiệm thu cuối; sửa feedback xong trước khi đánh Done.

Không cập nhật Notion, không tự merge/push main và không giao lại toàn bộ kiểm thử cho một thành viên.

## 8. Bàn giao đợt 1 — 06/10/2026

**Deadline chính xác: 20:00 ngày 10/10/2026, giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7)**, theo yêu cầu trực tiếp của Chung Minh Hiếu. Không dùng mốc 12/10. Đây là deadline task; các mốc bàn giao sớm ở mục 4 là kế hoạch cũ, không phải kết quả đã diễn ra.

### Stories và acceptance chi tiết

| Story | Mong muốn và giá trị | Acceptance đợt 1 | Flow / test |
|---|---|---|---|
| US-03-P1 | Chọn đúng plan/tuần để không học nhầm kế hoạch | Domain đọc đúng plan được truyền, hỗ trợ backlog và generation lịch sử; workspace selection chờ tích hợp | FL01; TC15–17 |
| US-03-P2 | Đánh dấu, bỏ dấu và học lại để sổ học phản ánh đúng | true/false lặp không thêm bản ghi; undo giữ bản cũ với revertedAt; redo UUID mới; kiểm tra ngày/timezone | FL02; TC01–05 |
| US-03-P3 | Tự thêm hoặc điều chỉnh việc học | Title/acceptance/minutes/notes hợp lệ; customized sticky; giữ nguồn; không sửa ledger cũ | FL03; TC06–08, TC10, TC18 |
| US-03-P4 | Đổi lịch khi bận mà không mất tiến độ | Dời/backlog giữ ID, nguồn, completion; trả phút vượt ngân sách để UI hiển thị | FL04; TC09, TC13, TC15 |
| US-03-P5 | Chốt tuần để lưu đúng kết quả lúc kết thúc | Snapshot trước xử lý, ba nhánh todo, tìm tuần mở, retry không chốt hai lần, khóa tuần đóng | FL05; TC11–14 |
| US-03-P6 | Xem tiến độ/lịch sử đáng tin | done/(todo+done), skipped bị loại, empty rõ, current không cộng trùng snapshots, lịch sử không đổi | FL06; TC15–17 |

Story biên soạn US-MW-TEAM-03-02 và AC-05 vẫn còn nguyên cho đợt nội dung tám track; không đánh hoàn tất trong đợt này.

### API đã triển khai trong progress.ts

- `setTaskCompletion(plan, taskId, completed, context)` → OperationResult<LearningPlan>. Gửi trạng thái mong muốn rõ ràng. `toggleTaskCompletion` chỉ giữ tương thích scaffold, không dùng cho event có retry.
- `updateTask(plan, taskId, updates)` → OperationResult<LearningPlan>. Cho sửa title/acceptance/minutes/notes/weekIndex/dayIndex.
- `addTask(plan, input, { nextTaskId })` → OperationResult<LearningPlan>. Input có stageId/title/minutes/acceptance/notes/weekIndex/dayIndex. Task tự thêm không có catalog source/work identity.
- `moveTaskToBacklog(plan, taskId)` → OperationResult<LearningPlan>; giữ nguyên status và completion.
- `closeWeek(plan, weekIndex, action, context)` → OperationResult<LearningPlan>; action move_next/move_backlog/skip.
- `calculatePlanStats(plan)` → total/done/percentage/empty/totalMinutes/estimatedCompletedMinutes của current.
- `calculateWeekStats(plan, weekIndex, generationId?)` → OperationResult chứa các stats trên và closed/budgetMinutes/overtimeMinutes. null là backlog, generationId mặc định current.
- Context: now (ISO có offset), today (YYYY-MM-DD tại timezone), timeZone và nextCompletionId. Không đọc đồng hồ ngầm, không tự tạo UUID, không React/storage/context riêng. Toàn bộ mutation trả bản sao sâu, không thay input/history/snapshot.

### Giả định để review và giới hạn

1. Caller phải đưa LearningPlan đã qua validator chung; module xác thực command và quan hệ completion/current, không thay thế bộ validator storage/import. Mọi lỗi trả OperationResult, không ghi dữ liệu.
2. Chỉ mutation trên current của plan active; archived/history/tuần đã chốt chỉ đọc. Việc tự thêm cần stageId trong selectedStageIds. UUID mới không được trùng plan/generation/task/completion hay snapshot lịch sử trong plan này; caller đảm bảo UUID toàn workspace.
3. Title/acceptance không trắng, minutes nguyên dương an toàn; notes được phép rỗng. Không áp thêm giới hạn độ dài hoặc ngân sách không có trong contracts. Dời tay sang tuần mới giữ dayIndex nếu không truyền; về backlog tự xóa ngày. Chốt move_next luôn xóa ngày để tránh tự chọn một ngày học mới.
4. customized=true khi sửa title/acceptance/minutes và không tự tắt nếu sửa về giá trị cũ. Notes/lịch không tự bật cờ. Giữ workId/revision/segment/source gốc làm provenance; planner cần dùng customized để không ghi đè nội dung đã sửa khi tạo lại.
5. Completion lưu phút ở thời điểm hoàn thành; chỉnh phút sau đó chỉ đổi ước lượng task/stats, không viết lại ledger. Ngày legacy null không suy đoán. Snapshot/history chứa trạng thái tại thời điểm chụp, không join ledger hiện tại để tính lại.
6. Gửi lặp cùng trạng thái done/undo hoặc closeWeek đã đóng không tạo hiệu ứng mới. Đây không phải cơ chế chống command cũ đến sau command mới hoặc concurrency giữa tab: persistence/context cần expectedRevision, lưu kết quả thành công rồi hiển thị. Add task không có idempotency key trong contracts: UI cần khóa submit lúc lưu, không tự gọi add lần nữa để retry save.
7. Tuần không có task không chốt; tuần chỉ có skipped có thể chốt và empty=true. Close lại giữ quyết định đầu tiên kể cả action khác. Preview/hủy không gọi mutation. Tổng plan current có thể đổi khi skip, còn tỷ lệ snapshot tuần đã chốt giữ nguyên.
8. Chưa thay contracts hoặc API chung; tên API tại đây là đầu ra đợt 1 để review/tích hợp. Không tuyên bố UI v2, reload, migration, nội dung AI hoặc regeneration end-to-end đã chạy.

### Kết quả và bước tiếp theo

- [x] Module tiến độ thuần và kiểm thử 20/20 ca.
- [x] `npm run check` và `npm run build` thành công.
- [x] Sáu flow, story và QA/AI log có kết quả thực.
- [ ] Nối My plan vào v2 context/persistence; thử save fail/reload, preview/cancel, keyboard/mobile và lựa chọn nhiều plan.
- [ ] Hoàn thiện bốn pack/tám track, kiểm tra URL/chi phí/nguồn thực; đăng ký qua registry chung và kiểm thử toàn hành trình.
- [ ] Kiểm thử với planner tạo lại thật, review chéo và nghiệm thu.

Giữ nguyên bốn scaffold nội dung có sẵn, UI v1 và các file chung. Chưa commit/push theo yêu cầu. Minh chứng chi tiết: [QA_AI_LOG.md](QA_AI_LOG.md), mô tả thao tác: [FLOW.md](FLOW.md).
## 9. Bàn giao đợt 2 — Bốn pack / tám track

- Hoàn thiện scientist.ts (1 track), ml.ts (3), mlops.ts (2), ai-engineer.ts (2); giữ nguyên tám ID track tại mục 2. Cả bốn pack `reviewStatus=review`, contentVersion `2026-10-06.mw-team-03.2`.
- 39 chặng duy nhất / 37 nguồn / 78 bài có phút và acceptance / 3 credential goals tùy chọn. Nền scientist và ml.neural dùng chung bằng ID, không nhân bản định nghĩa.
- **US-03-C1 / AC-05:** Là sinh viên, tôi muốn nhánh AI/ML có thứ tự học, bài và portfolio phù hợp công cụ của nhánh để biết cần làm gì và tự kiểm tra đầu ra. AC: đủ tám track, prerequisite closure/thứ tự hợp lệ, nguồn đúng chủ đề, phút nguyên dương, acceptance cụ thể, CPU/API/chi phí được ghi rõ.
- **US-03-C2 / AC-05:** Là người review, tôi muốn biết nguồn/chứng nhận nào thực sự đã mở kiểm tra và dependency nào cần ghép để không coi cấu trúc compile là đã chạy mọi cấu hình. AC: checkedAt thật, URL lỗi có null và lý do; reviewStatus chưa ready; không sửa registry chung; test giải dependency cùng bốn pack và Backend hiện hữu.
- Hồ sơ nguồn [SOURCES.json](SOURCES.json): từng URL/provider/topic/access/checkedAt ngày 06/10/2026; có supporting URLs cho chi phí/thiết bị/API. Mở chính thức thành công trước khi ghi checkedAt; chưa đăng nhập/mua khóa/chạy learning labs.
- Bản giải thích để Hiếu duyệt, khảo sát chứng nhận và đoạn import/đăng ký cho Hải: [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Chứng nhận không phù hợp nhánh CV/NLP/RAG được để trống có lý do khảo sát và portfolio riêng; không coi không gắn certificate là chưa có nội dung.
- Test riêng đợt 2: CONTENT01–10, tổng cùng đợt 1 **30/30 pass**; bao gồm negative fixtures cho collision, thiếu/vòng/thứ tự tiên quyết, source/default sai, phút/acceptance lỗi. Không hạ assertion để né lỗi.
- `npm run check` pass trên registry hiện tại (Backend); `npm run build` pass kiểm TypeScript tất cả bốn pack. Chưa chứng minh bốn pack đã chạy trên app vì chưa đăng ký registry.

Checklist đợt 2:

- [x] Biên soạn đủ tám track, bài và portfolio có tiêu chí kiểm tra.
- [x] Mở nguồn chính thức, ghi ngày/chi phí/điều kiện/thiết bị; khảo sát chứng nhận và ghi lý do loại.
- [x] Test bốn pack cùng dependency, check/build và QA/AI log kết quả thật.
- [x] Bàn giao dòng đăng ký registry; giữ file chung và công việc đợt 1.
- [ ] Hiếu/reviewer duyệt workload, nguồn và phạm vi; chuyển ready chỉ sau nghiệm thu.
- [ ] Hải ghép registry/context; thử cả tám track chọn → đổi nguồn → tạo plan → done → reload.

Các ghi chú “scaffold giữ nguyên” ở mục 8 là trạng thái lịch sử đợt 1; đợt 2 đã triển khai bốn scaffold theo yêu cầu mới. Toàn task vẫn còn UI/tích hợp/review, chưa đánh Done. Deadline giữ **20:00 10/10/2026, giờ Việt Nam**. Chưa commit/push.

## 10. Bàn giao đợt 3 — My Plan v2 nhận plan/callback

Deadline **20:00 10/10/2026 giờ Việt Nam**, người làm Chung Minh Hiếu. Kiểm tra lại context/persistence trước sửa: LegacyAppContext/State v1 vẫn hiện hành, chưa có transaction Workspace v2. Theo yêu cầu, không mở rộng file chung; giữ nguyên MyPlan.tsx và app/sidebar/style v1.

- `MyPlanV2.tsx`: controlled UI chọn plan, Plan/Stats/Weeks, thao tác qua progress.ts; validation, preview đích/quỹ giờ, confirm/cancel, backlog, closed/history/archive chỉ đọc, empty/loading/load-error, lỗi save/retry. UI chỉ giữ form và candidate chưa lưu, không sở hữu kho plan.
- `viewModel.ts`: parse/normalize form, lịch 1-based ↔ contract 0-based/null, tuần sparse, snapshot display, readonly, kiểm protocol URL nguồn.
- `scripts/tasks/MW-TEAM-03.mjs`: thêm UI01–08; tổng **38/38** (20 progress + 10 content + 8 view model/SSR). Có TypeScript check riêng preview vì docs không nằm tsconfig src.
- Fixture test-only trong docs: tám plan giả, có history và fault injection; không storage hoặc planner. Browser kiểm done/undo/redo/close ở đủ tám plan; cả ba action, Stats snapshot 1/2, add/edit/backlog, validation/error/retry/cancel, Weeks/history/archive/loading/empty, Tab/Escape và màn hình nhỏ. Đây không phải full plan của tám track được planner sinh.
- `npm run check` pass 1 registered pack/28 modules; `npm run build` pass. App v1 Explore và My Plan empty smoke pass; không thay dữ liệu legacy. Minh chứng/steps/results ở QA_AI_LOG và evidence.
- Hướng dẫn demo và diff chung đề xuất (chưa áp dụng): [DEMO_INTEGRATION.md](DEMO_INTEGRATION.md). Mô tả PR chuẩn bị: [PR_DESCRIPTION.md](PR_DESCRIPTION.md); chưa tạo PR.

### Giả định UI để review

1. Props là plan đã được validator runtime của context/persistence kiểm tra; toàn stages đã resolve từ registry dependency. Không cast State v1 sang v2. Chỉ khi v2 sẵn sàng mới đổi route hiện tại.
2. Đặt done/undo rõ trạng thái; callback await save rồi mới publish props. Ref khóa double submit và retry dùng cùng candidate, không sinh ID/date mới. expected plan + Workspace expectedRevision ở adapter bảo vệ cập nhật cũ; không tuyên bố feature tự xử lý persistence concurrency.
3. Dời tay qua form có thể chọn ngày hoặc để trống; backlog xóa ngày. Chốt tuần dời đến tuần mở kế tiếp bỏ ngày, theo progress.ts. Preview không mutation, overtime chỉ cảnh báo, không giới hạn mới ngoài contracts.
4. Phút hiển thị là ước lượng. Tuần chốt dùng tasks/stats snapshot, lịch sử đọc generation cũ; không cộng vào inventory current. Không thêm drag/drop hoặc type/storage chung.
5. Bản preview cần Vite dev; không thêm entry production hoặc package script ngoài allowlist. Fixture clock cố định Oct6 chỉ để tái lập test; adapter thật phải tiêm clock/timezone của profile tại thao tác.

Checklist đợt 3:

- [x] UI v2 độc lập theo contracts, giữ app hiện tại và allowlist.
- [x] Sáu flow cập nhật mapping UI, test thật và giới hạn tích hợp.
- [x] Logic/SSR/content test, preview typecheck, check/build, browser fixture desktop/mobile/keyboard có minh chứng.
- [x] Điểm tích hợp/diff đề xuất, demo và mô tả PR.
- [ ] Ghép context/persistence/migration/registry qua người sở hữu file chung.
- [ ] Sau ghép thử đủ tám track chọn nguồn → tạo plan thật → done/undo → chốt tuần → reload, nhiều plan và conflict/save lỗi thật.
- [ ] Hiếu đọc duyệt, review chéo và nghiệm thu cuối. Không đánh toàn task Done khi các mục tích hợp còn thiếu.

Các dòng “UI chưa chạy” ở phần đợt 1/2 là trạng thái lúc bàn giao các đợt trước. UI fixture đã chạy trong đợt 3; persistence sản phẩm/end-to-end vẫn chưa chạy. Không sửa nội dung/domain tiến độ đợt 1/2 trong đợt 3.
