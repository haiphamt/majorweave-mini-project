# MW-TEAM-04 — Hồ sơ, nhịp học, validation và nội dung Data/BA

**Người làm:** Lê Nguyễn Hữu Hiếu (`hiuanhutiu`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Nguyễn Thị Quỳnh Hân.
**Branch:** `feat/mw-team-04`. **Trạng thái:** Được giao; chưa bắt đầu, chưa có kết quả test/PR.

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

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Hiện tất cả test của task **chưa chạy**.

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
