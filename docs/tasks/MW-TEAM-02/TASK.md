# MW-TEAM-02 — Roadmap cá nhân, sinh kế hoạch và nội dung Mobile/Game

**Người làm:** Phạm Công Định (`Dinglebell`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Chung Minh Hiếu.
**Branch:** `feat/mw-team-02`. **Trạng thái:** Đã triển khai planner + 7 track; đã rà nguồn và kiểm thử ngày 07/10/2026. Chờ tích hợp UI v2, review chéo và Hải nghiệm thu. Branch hiện có PR mở; thay đổi đợt rà này chưa commit/push.

Đọc [phân công chung](../../team/PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md) và [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md). Scope chi tiết/nhánh là baseline từ bảng đích; ghi thay đổi được Hải chốt vào task, không tự thu hẹp.

## 1. Quyền sửa file

- `src/features/my-roadmap/**`
- `src/domain/planner.ts`
- `src/content/paths/mobile.ts`
- `src/content/paths/game.ts`
- `scripts/tasks/MW-TEAM-02.mjs`: kiểm thử module/nội dung task với công cụ đã có; không hạ assertion chung.
- `docs/tasks/MW-TEAM-02/**`: story, flow, test, AI log, minh chứng và yêu cầu phối hợp.

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. Các file mới trong allowlist đã được triển khai; xem bằng chứng và phần còn chờ tích hợp bên dưới. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

## 2. Nội dung phải hoàn thiện

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| Mobile Developer · `mobile` | `mobile.android`, `mobile.ios`, `mobile.flutter`, `mobile.react-native` | Android / Kotlin; iOS / Swift; Flutter / Dart; React Native / TypeScript | 4 |
| Game Developer · `game` | `game.unity`, `game.unreal`, `game.godot` | Unity / C#; Unreal / C++ và Blueprint; Godot / GDScript | 3 |
| **Tổng của task** | | | **7** |

Mỗi track có chặng nền tảng/riêng, tiên quyết, nguồn trực tiếp đã mở kiểm tra, bài thực hành có phút/acceptance, portfolio và mục tiêu chứng nhận đã khảo sát. Không nhân số nguồn bằng link trùng/trang chủ. Chứng nhận không phù hợp phải có lý do sau khảo sát và portfolio; không điền mục giả. Gói ở `review` tới khi Hải nghiệm thu. Không dùng `checkedAt` của pack cũ như bằng chứng đã kiểm tra lại từng URL hôm nay.

## 3. Phần thực hiện

1. My roadmap dùng draft theo trackId, chọn/bỏ chặng, xác nhận đã biết, nguồn theo chặng, mục tiêu, giờ/tuần và ngày bắt đầu; không suy ra đã biết chỉ từ ngành.
2. Triển khai generatePlan theo PlannerFunction đang có: nhận nội dung đã resolve + draft + clock/ID truyền vào; trả OperationResult<LearningPlan>. Planner không import React, registry hoặc persistence.
3. Kiểm tra giờ nguyên 2–20, ngày thực tế/Thứ Hai, source và prerequisite. Nếu thiếu nền tảng cho lựa chọn sửa rõ ràng; nếu không còn việc thì không tạo plan rỗng.
4. Chia bài thành đoạn tối đa 120 phút, giữ tổng phút/thứ tự/identity; dùng quỹ hoursPerWeek × 60 và để dayIndex=null. UI giải thích và xác nhận khi ngày chọn cần quy đổi về Thứ Hai.
5. Tạo plan mới mặc định. Tạo lại có preview/xác nhận: giữ history, completion/notes của cùng workId + revision + đoạn; giữ việc tự thêm/sửa ở backlog; không mang hoàn thành giữa các nhánh khác nghĩa.
6. Biên soạn đủ bốn Mobile và ba Game: nguồn/ngôn ngữ/công cụ đúng track, điều kiện thiết bị/lab rõ; mỗi nhánh có portfolio và bài thực hành cụ thể. iOS là nội dung để học, không yêu cầu website MajorWeave chạy Swift.

## 4. Phụ thuộc và bàn giao kỹ thuật

**Đầu vào:**

- PlannerFunction, LearningPlan/PlanGeneration/PlanTask trong contracts chuẩn; mục 6.1–6.2 kiến trúc.
- Resolver/ID nội dung từ Hân; có thể test bằng backendPack hiện có và fixture nhỏ trong test của mình.
- Mutation task/StudyCompletion từ Chung Minh Hiếu; shape Workspace + callback tạo/lưu từ Hải.

**Đầu ra:**

- Planner/tạo lại thuần + test invariant; My roadmap nối cùng draft/workspace v2.
- Hai pack Mobile/Game; bảy track mới được kiểm tra từ chọn nhánh tới tạo lịch.

**Bàn giao sớm:** 05/10 chốt chữ ký generate/regenerate và input/output với Hải/Hiếu; 06/10 bàn giao planner đã test trên Backend để các trang có thể tích hợp, rồi mở rộng đủ bảy Mobile/Game.

Có thể làm inventory nguồn, pack, pure module và test trên dữ liệu thử trước. Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback. Không tự gọi v2 đã chạy trong app khi mới compile pack/module. Không để dependency chưa có làm dừng phần độc lập.

## 5. User story và acceptance ban đầu

**US-MW-TEAM-02-01:** Là sinh viên, tôi muốn sử dụng my roadmap theo hướng/nhánh đã chọn, để học đúng nội dung và giữ kế hoạch/tiến độ của mình.

**US-MW-TEAM-02-02:** Là người biên soạn, tôi muốn các track được giao có nguồn, bài và đầu ra phù hợp, để mọi cấu hình đều sử dụng được trong cùng website.

Người làm tách thêm story theo từng hành động; bảng dưới là phạm vi bắt buộc ban đầu, không thay toàn bộ story/flow/test do mình viết.

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Đầu vào lỗi chỉ ra trường/prerequisite; giữ draft, không tạo plan thành công khi mọi chặng đã biết. | Sửa draft / kiểm tra đầu vào | Giờ 1/2/20/21, ngày không thật, ID/source sai, tất cả đã biết |
| AC-02 | Lịch giữ tổng phút và thứ tự, đoạn ≤120 phút, mỗi tuần khi sinh không vượt ngân sách; ID được cấp từ context. | Tạo lịch | Quỹ 2 và 20 giờ; bài 30/120/121/300 phút; prerequisite |
| AC-03 | Tạo mới giữ các plan trước; chọn plan mới chỉ sau kết quả lưu đúng. Hủy tạo lại giữ nguyên plan/history. | Tạo mới / tạo lại / hủy | Hai plan; hủy; lỗi lưu và conflict |
| AC-04 | Tạo lại giữ lịch sử và việc khớp định danh; bài sửa/tự thêm vào backlog; không nhân đôi completion. | Xem preview và xác nhận tạo lại | Đổi giờ, đổi nhánh, revision mới, bài customized, notes/history |
| AC-05 | Bảy cấu hình Mobile/Game có nguồn, bài và portfolio riêng; sinh lịch dùng cùng planner. | Chọn Mobile/Game và tạo kế hoạch | Android/iOS/Flutter/RN; Unity/Unreal/Godot; điều kiện môi trường |

## 6. Luồng riêng và test case phải viết

Copy mẫu [FLOW](../../templates/FLOW.md) thành `FLOW.md`; mỗi hành động bên dưới có mã riêng, điều kiện đầu vào, luồng chính/thay thế/lỗi/hủy, dữ liệu trước/sau và AC/test liên kết. Không chỉ nộp một sơ đồ tổng quát.

- **FL-MW-TEAM-02-01:** Chọn/bỏ chặng và xử lý thiếu prerequisite.
- **FL-MW-TEAM-02-02:** Đánh dấu đã biết / bỏ đã biết và đổi nguồn.
- **FL-MW-TEAM-02-03:** Nhập mục tiêu, giờ/tuần và ngày khác Thứ Hai.
- **FL-MW-TEAM-02-04:** Tạo plan mới; đầu vào lỗi/không còn việc/lưu lỗi.
- **FL-MW-TEAM-02-05:** Xem preview tạo lại, xác nhận hoặc hủy.
- **FL-MW-TEAM-02-06:** Giữ việc tự thêm/sửa và lịch sử khi tạo lại.

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Kết quả hiện tại: **123 domain/content + 7 UI v1 check pass**; ma trận UI v2 chưa chạy vì context/persistence chung chưa tích hợp.

- Unit/invariant planner: tổng phút, thứ tự, quỹ tuần, đoạn ổn định; không chỉ snapshot một lịch mẫu.
- Tạo lại: cùng work/revision/đoạn giữ ID/notes/completion; đổi nghĩa không chuyển hoàn thành; history không bị sửa.
- UI My roadmap: form lỗi, hủy/confirm, hai plan, reload và bảy cấu hình nội dung.
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

## 8. Cập nhật 07/10/2026

- [Rà nội dung và sổ nguồn](CONTENT_REVIEW.md): Mobile/Game sang review; bỏ chứng nhận retired/placeholder, sửa nguồn lệch nội dung, bổ sung portfolio/lab và điều kiện thiết bị.
- [QA và AI log](QA_AI_LOG.md): 130 pass, check/build pass; có ảnh desktop/mobile và manifest file để đối chiếu với base SHA.
- [Bàn giao tích hợp](INTEGRATION_HANDOFF.md): chữ ký hàm, quy tắc giữ backlog/history/completion, callback chung còn thiếu và thứ tự tích hợp.
- MyRoadmap v1 có kiểm tra giờ/ngày và xác nhận quy đổi Thứ Hai. Vẫn chưa có UI nhiều plan/preview v2; không nhân bản context/registry để lách allowlist.
- Chưa cập nhật Notion, chưa push/merge main, chưa đánh dấu Done. Pack ready và nghiệm thu cuối thuộc Hải.
