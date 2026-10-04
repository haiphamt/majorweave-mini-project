# MW-TEAM-03 — Kế hoạch tuần, tiến độ và nội dung AI

**Người làm:** Chung Minh Hiếu (`chungminhhieu2311-collab`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Triệu Quang Huy.
**Branch:** `feat/mw-team-03`. **Trạng thái:** Được giao; chưa bắt đầu, chưa có kết quả test/PR.

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

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. File mới được liệt kê ở trên là **cần triển khai**, chưa tồn tại. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

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

Người làm tách thêm story theo từng hành động; bảng dưới là phạm vi bắt buộc ban đầu, không thay toàn bộ story/flow/test do mình viết.

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

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Hiện tất cả test của task **chưa chạy**.

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
