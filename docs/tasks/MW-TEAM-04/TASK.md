# MW-TEAM-04 — Hồ sơ, nhịp học, validation và nội dung Data/BA

**Người làm:** Lê Nguyễn Hữu Hiếu (`hiuanhutiu`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Nguyễn Thị Quỳnh Hân.
**Branch:** `feat/mw-team-04`. **Trạng thái:** Đang triển khai độc lập; chưa tích hợp v2, chưa nghiệm thu.

Đọc [phân công chung](../../team/PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md) và [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md). Scope chi tiết/nhánh là baseline từ bảng đích; ghi thay đổi được Hải chốt vào task, không tự thu hẹp.

## 1. Quyền sửa file

- `src/features/profile/**`
- `src/domain/activity.ts`
- `src/domain/validate.ts`
- `src/content/paths/analyst.ts`
- `src/content/paths/bi.ts`
- `src/content/paths/engineer.ts`
- `src/content/paths/business-analyst.ts`
- `scripts/tasks/MW-TEAM-04.mjs`: kiểm thử module/nội dung task với công cụ đã có; không hạ assertion chung.
- `docs/tasks/MW-TEAM-04/**`: story, flow, test, AI log, minh chứng và yêu cầu phối hợp.

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. File mới được liệt kê ở trên là **cần triển khai**, chưa tồn tại. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

## 2. Nội dung phải hoàn thiện

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| Data Analyst · `analyst` | `analyst.spreadsheet`, `analyst.pandas` | SQL + bảng tính; SQL + Python / pandas | 2 |
| BI Analyst · `bi` | `bi.powerbi`, `bi.tableau` | Power BI; Tableau | 2 |
| Data Engineer · `engineer` | `engineer.batch`, `engineer.streaming` | Batch pipeline; Streaming / Kafka | 2 |
| Business Analyst · `business-analyst` | `business-analyst.software-ba`, `business-analyst.data-ba` | IT / Software BA; Data / BI BA | 2 |
| **Tổng của task** | | | **8** |

Mỗi track có chặng nền tảng/riêng, tiên quyết, nguồn trực tiếp đã mở kiểm tra, bài thực hành có phút/acceptance, portfolio và mục tiêu chứng nhận đã khảo sát. Không nhân số nguồn bằng link trùng/trang chủ. Chứng nhận không phù hợp phải có lý do sau khảo sát và portfolio; không điền mục giả. Gói ở `review` tới khi Hải nghiệm thu. Không dùng `checkedAt` của pack cũ như bằng chứng đã kiểm tra lại từng URL hôm nay.

## 3. Phần thực hiện

1. Profile là hồ sơ trên thiết bị: displayName/majorId/timeZone, tổng quan, link tới plan; ngành hồ sơ không đổi khi người dùng lọc khoa khác.
2. Viết activity.ts thuần: tổng hợp sổ completion trên mọi plan gồm archived, bỏ ghi nhận reverted, không đọc lặp history/ClosedWeek; ngày/timezone tại ghi nhận giữ nguyên.
3. Heatmap dùng số việc/phút ước lượng hoàn thành theo ngày thực; legacy thiếu ngày giữ tiến độ nhưng không bịa ngày. Tái dùng component StudyActivity qua props/adapter Hải tích hợp, không tự sửa component chung.
4. Viết validate.ts kiểm tra runtime Workspace/BackupFile: schema, types/enums/ranges/ngày/timezone/ID/quan hệ task–completion/generation/snapshot; trả ValidationIssue cụ thể. Catalog không còn ID vẫn giữ snapshot/history theo kiến trúc.
5. Giao diện export/import ở Profile gọi callbacks do Hải ghép với Huy: preview, lựa chọn profile, duplicate/copy, confirm/cancel, trạng thái chưa lưu/lỗi. Không tự viết IndexedDB/đọc file trong feature.
6. Biên soạn DA, BI, DE, BA đủ tám track; phân biệt phân tích dữ liệu, dashboard, pipeline và yêu cầu nghiệp vụ. BA dùng khung/nguồn chính thức ngoài roadmap.sh, không bịa roadmap.sh/ba.

## 4. Phụ thuộc và bàn giao kỹ thuật

**Đầu vào:**

- Workspace/BackupFile/ValidationIssue; mục 7 và rules dữ liệu trong kiến trúc/hướng dẫn.
- Sổ completion/mutation từ Chung Minh Hiếu; nguồn migration/backup của Huy; callbacks/context do Hải tích hợp.
- Xác nhận đọc catalog thiếu trong plan là tình huống lịch sử, không được validator loại bỏ toàn bộ plan.

**Đầu ra:**

- Validator và activity helpers + test; Profile render/preview dữ liệu qua context chung.
- Bốn pack Data/BA đủ tám track; yêu cầu KPI, chất lượng dữ liệu, traceability và portfolio riêng.

**Bàn giao sớm:** 05/10 chốt validator output/issue codes với Huy và Hải; 06/10 ưu tiên validator Workspace/BackupFile để persistence/migration có kiểm tra, sau đó hoàn thiện Profile/heatmap và tám track Data/BA.

Có thể làm inventory nguồn, pack, pure module và test trên dữ liệu thử trước. Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback. Không tự gọi v2 đã chạy trong app khi mới compile pack/module. Không để dependency chưa có làm dừng phần độc lập.

## 5. User story và acceptance ban đầu

**US-MW-TEAM-04-01:** Là sinh viên, tôi muốn sử dụng profile: hồ sơ, nhịp học, sao lưu theo hướng/nhánh đã chọn, để học đúng nội dung và giữ kế hoạch/tiến độ của mình.

**US-MW-TEAM-04-02:** Là người biên soạn, tôi muốn các track được giao có nguồn, bài và đầu ra phù hợp, để mọi cấu hình đều sử dụng được trong cùng website.

Người làm tách thêm story theo từng hành động; bảng dưới là phạm vi bắt buộc ban đầu, không thay toàn bộ story/flow/test do mình viết.

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Lưu tên/ngành/timezone và reload đúng; cancel/error giữ dữ liệu; không hiện online account/Google giả. | Sửa hồ sơ | Tên rỗng theo quyết định UX, major/timezone sai, lưu lỗi, reload |
| AC-02 | Heatmap không đếm reverted hoặc snapshot lặp; gồm archived; không tạo ô ngày cho legacy thiếu timestamp. | Xem nhịp học | Nhiều plan/generation, archived, undo, đổi timezone, legacy |
| AC-03 | JSON/object sai có lỗi theo trường, không crash và không trả hợp lệ vì ép kiểu TypeScript. | Validate dữ liệu ngoài | Schema mới hơn, types/enums/ranges/ngày, UUID, URL protocol |
| AC-04 | Task/completion/generation/ClosedWeek khớp; snapshot của catalog cũ được giữ, không tự reset workspace. | Validate quan hệ và dữ liệu cũ | ID trùng, activePlanId thiếu, done không completion, tổng snapshot sai |
| AC-05 | Import/export UI có preview/confirm/cancel và phản hồi đúng lưu; nguồn hiện tại còn nguyên khi hủy/lỗi. | Sao lưu / nhập / hủy | Tích hợp Huy; duplicate/copy; file hỏng; quota/conflict |
| AC-06 | Tám track DA/BI/DE/BA có nội dung/ngôn ngữ/công cụ và portfolio đúng; BA không bị ép học DSA/OS. | Chọn Data/BA và tạo kế hoạch | SQL+bảng tính/pandas, Power BI/Tableau, batch/streaming, hai BA |

## 6. Luồng riêng và test case phải viết

Copy mẫu [FLOW](../../templates/FLOW.md) thành `FLOW.md`; mỗi hành động bên dưới có mã riêng, điều kiện đầu vào, luồng chính/thay thế/lỗi/hủy, dữ liệu trước/sau và AC/test liên kết. Không chỉ nộp một sơ đồ tổng quát.

- **FL-MW-TEAM-04-01:** Sửa tên/ngành/timezone, lưu hoặc hủy.
- **FL-MW-TEAM-04-02:** Xem activity, empty state và dữ liệu cũ thiếu ngày.
- **FL-MW-TEAM-04-03:** Mở plan từ Profile.
- **FL-MW-TEAM-04-04:** Xuất bản đang lưu/bản chưa lưu.
- **FL-MW-TEAM-04-05:** Chọn file nhập, xem preview/lỗi, bỏ qua trùng hoặc nhập bản sao.
- **FL-MW-TEAM-04-06:** Xác nhận/hủy nhập và phản hồi lỗi lưu/conflict.

Test được lập trong [QA và AI log](QA_AI_LOG.md), có steps/expected/actual, môi trường và minh chứng. Trạng thái ban đầu được giữ để đối chiếu; xem mục kết quả cuối để phân biệt test đã chạy và tích hợp còn chờ.

- Validator runtime: malformed object, ranges/dates/UUID/schema, quan hệ done–completion và snapshots; dữ liệu thiếu catalog không mất plan.
- Activity: nhiều plan/history, reverted, archived, legacy thiếu ngày, timezone cũ giữ nguyên.
- Profile UI và preview sao lưu tích hợp Huy; tám cấu hình nội dung Data/BA.
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

## 8. Khảo sát code và kế hoạch thực hiện — 07/10/2026

Baseline local: `6854350`. Working tree sạch trước khi tạo branch; fetch remote bị từ chối quyền chạy nên chưa xác nhận baseline bằng main remote. Giữ danh tính Git hiện có của Hữu Hiếu.

Code thật: AppShell giữ State v1, update trả void và saveLegacyState chạy trong effect; context không có Workspace, save result hoặc import/export. StudyActivity nhận Task[] v1 và quy ngày theo timezone máy. Profile không có timezone/cancel, báo đã lưu trước kết quả persistence. Chưa có domain/content/planner/progress hay persistence/workspace/backup. Registry chỉ có backendPack. Không nối v2 bằng state/storage/callback riêng.

Thứ tự: story/flow/test → validator/activity thuần → bốn content pack/tám track và kiểm tra nguồn → cải thiện Profile trong props v1 hiện có → kiểm thử riêng/check/build → PR bàn giao, chờ review/tích hợp. Nội dung mới luôn ở review.

### Story theo hành động

| Story | Nhu cầu của sinh viên | Acceptance | Flow / test |
|---|---|---|---|
| US-04-01 | Sửa tên/ngành/timezone của hồ sơ trên thiết bị, có thể hủy | AC-01; tên rỗng được giữ theo hành vi v1 và hiển thị Người học; tối đa 60 ký tự; ngành hợp lệ hoặc null; timezone IANA hợp lệ | FL-04-01 / TC-P01–P05 |
| US-04-02 | Xem ngày học và phút ước lượng thực tế trên tất cả plan | AC-02; bỏ reverted; không đọc history lần nữa; giữ localDate tại ghi nhận; legacy không bịa ngày | FL-04-02 / TC-A01–A06 |
| US-04-03 | Mở plan đang học từ Profile | Chuyển trang không sửa draft/profile/completion; chưa có plan dẫn tới tạo kế hoạch | FL-04-03 / TC-P06 |
| US-04-04 | Xuất bản đang lưu hoặc bản còn thay đổi để chuyển máy | AC-05; nói rõ bản xuất; không báo đã lưu DB khi chỉ tải file | FL-04-04 / TC-I01 |
| US-04-05 | Xem trước file nhập, lựa chọn profile và xử lý trùng | AC-03/04/05; validator từ unknown; lỗi có code/field/message; preview không ghi | FL-04-05 / TC-V01–V12, TC-I02 |
| US-04-06 | Xác nhận hoặc hủy nhập, giữ dữ liệu khi lỗi/conflict | AC-05; revision thiết bị; confirm một transaction; cancel không mutation | FL-04-06 / TC-I03–I05 |
| US-04-07 | Học đủ tám nhánh Data/BA với bài và portfolio phù hợp | AC-06; prerequisite đủ; nguồn trực tiếp, checkedAt thật; chứng nhận tùy chọn | FL-04-07 / TC-C01–C08 |

### Chữ ký bàn giao đề xuất (chưa được Hải/Huy xác nhận)

- `validateWorkspace(value: unknown, options?: { majorIds?: readonly string[]; contentPacks?: readonly ContentPack[] }): OperationResult<Workspace>`.
- `validateBackupFile(value: unknown, options?: ...): OperationResult<BackupFile>`; nhận object sau JSON.parse ở persistence, không đọc file/storage. Lỗi schema mới trả unsupported_version; sai cấu trúc/quan hệ trả validation. Không sửa input, không reset dữ liệu.
- `validateProfile(value: unknown, majorIds?: readonly string[]): OperationResult<Workspace['profile']>`; catalog do caller truyền, domain không import registry/catalog.
- `summarizeActivity(plans: readonly LearningPlan[])`: trả days (date/completedTasks/estimatedMinutes), tổng việc/phút có ngày và undatedTasks/undatedEstimatedMinutes. Chỉ đọc sổ completion, gồm archived, không đổi localDate theo timezone profile mới.
- Chốt với Chung Minh Hiếu: undo có revertedAt ở ledger; snapshot lịch sử done vẫn được giữ dù ledger đã revert sau đó. Current done phải liên kết completion chưa revert; snapshot chỉ cần liên kết đúng task và không xảy ra sau thời điểm snapshot.
- Chốt với Hải: context cung cấp Workspace và kết quả lưu thực; updateProfile trả OperationResult sau lưu; openPlan xử lý activePlanId; save state dirty/saving/saved/error/conflict. Profile không tự định nghĩa context thứ hai.
- Chốt với Huy/Hải: callback chọn file/preview (persistence đọc file), export bản saved/unsaved; previewId gắn revision; confirm nhận duplicate policy skip/copy và includeProfile (mặc định false); cancel không ghi. Shape preview/import options cần vào hợp đồng chung trước khi làm UI v2.
- StudyActivity cần props tổng hợp ngày/phút + legacy count và ngày hôm nay theo timezone. Hải sở hữu adapter/component; không chuyển localDate thành timestamp giả để nhét vào Task[] v1.
- Bốn pack export analystPack/biPack/engineerPack/businessAnalystPack; Hải đăng ký vào content/index.ts và Hân resolve. ID shared Data SQL sẽ định nghĩa một lần ở analystPack; các pack phụ thuộc ghi rõ trong inventory.

### Điểm chưa thể nghiệm thu ở baseline

Timezone lưu/reload v2; heatmap nhiều plan; UI preview/confirm/copy/export; lưu lỗi/conflict v2; hành trình tám track trên app đều phụ thuộc phần chung chưa tồn tại. Test fixture độc lập không được dùng làm bằng chứng tích hợp. Không tự ghi Hải đã duyệt nhánh, chữ ký hoặc UI. Sau PR, Hải/Huy/Hân/Định/Chung Minh Hiếu tích hợp phần sở hữu rồi chạy lại ma trận trong QA_AI_LOG.

## 9. Bản triển khai độc lập để review

**Cập nhật 09/10/2026:** Review phát hiện hai lỗi chưa được bộ test cũ bao phủ. Đã sửa local quy tắc customized segment và tách catalog readiness khỏi lưu draft; xem [phản hồi và API cần chốt](REVIEW_RESPONSE_2026-10-09.md). Kết quả hiện tại 30 nhóm module/content pass; chưa có E2E v2. Không dùng nhận định phần độc lập đủ trước đó như nghiệm thu. Các API/chính sách mới chưa được Hải xác nhận trực tiếp sau sửa.

- Validator/activity, Profile v1 có validation/hủy/phản hồi lưu trung thực; bốn pack đủ tám track, 29 chặng mới/43 bài/24 nguồn/6 mục tiêu chứng nhận. [Nguồn và dependency](SOURCE_INVENTORY.md).
- 28 nhóm test module/content và 14 check UI pass; chi tiết [QA/AI log](QA_AI_LOG.md). Không đánh dấu hoàn thành toàn task khi v2 chưa tích hợp.
- `language.python` phụ thuộc backendPack của Hân; analystPack sở hữu Data shared stages. Chữ ký ở mục 8 là code đã triển khai nhưng **chưa được đồng thuận liên nhóm**.
- Bàn giao riêng trên `feat/mw-team-04`; không merge main, không sửa file chung, không tạo login. Theo dõi review/tích hợp rồi chạy lại toàn bộ TC-I và hành trình TC-C trên app chính.
