# MW-TEAM-05 — Lưu dữ liệu, chuyển bản cũ, sao lưu và nội dung hạ tầng/QA

**Người làm:** Triệu Quang Huy (`1can5ez`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Lê Nguyễn Hữu Hiếu.
**Branch:** `feat/mw-team-05`. **Trạng thái:** Được giao; chưa bắt đầu, chưa có kết quả test/PR.

Đọc [phân công chung](../../team/PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md) và [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md). Scope chi tiết/nhánh là baseline từ bảng đích; ghi thay đổi được Hải chốt vào task, không tự thu hẹp.

## 1. Quyền sửa file

- `src/persistence/**`
- `src/content/paths/devops.ts`
- `src/content/paths/network.ts`
- `src/content/paths/security.ts`
- `src/content/paths/qa.ts`
- `scripts/tasks/MW-TEAM-05.mjs`: kiểm thử module/nội dung task với công cụ đã có; không hạ assertion chung.
- `docs/tasks/MW-TEAM-05/**`: story, flow, test, AI log, minh chứng và yêu cầu phối hợp.

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. File mới được liệt kê ở trên là **cần triển khai**, chưa tồn tại. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

## 2. Nội dung phải hoàn thiện

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| DevOps / SRE · `devops` | `devops.devops`, `devops.sre` | DevOps / AWS; SRE | 2 |
| Network Engineer · `network` | `network.network`, `network.automation` | Mạng và mô phỏng; Network Automation / Python | 2 |
| Cyber Security · `security` | `security.soc`, `security.appsec`, `security.devsecops` | Defensive Security / SOC; Web Application Security; DevSecOps | 3 |
| QA / Test Automation · `qa` | `qa.manual`, `qa.playwright`, `qa.postman` | Manual QA; Web Automation / Playwright; API Testing / Postman | 3 |
| **Tổng của task** | | | **10** |

Mỗi track có chặng nền tảng/riêng, tiên quyết, nguồn trực tiếp đã mở kiểm tra, bài thực hành có phút/acceptance, portfolio và mục tiêu chứng nhận đã khảo sát. Không nhân số nguồn bằng link trùng/trang chủ. Chứng nhận không phù hợp phải có lý do sau khảo sát và portfolio; không điền mục giả. Gói ở `review` tới khi Hải nghiệm thu. Không dùng `checkedAt` của pack cũ như bằng chứng đã kiểm tra lại từng URL hôm nay.

## 3. Phần thực hiện

1. IndexedDB native theo kiến trúc: database majorweave/version 1, store workspace, key local; load/save theo hợp đồng, revision kiểm tra/ghi trong một transaction.
2. Chỉ trả lưu thành công sau transaction complete. Lỗi quota/abort/open/version blocked/conflict phải trả lỗi rõ; dữ liệu đang sửa giữ trong bộ nhớ để thử lại/xuất, không fallback/reset âm thầm.
3. Migration v1: raw JSON/schema/fingerprint/preview/confirm, dùng legacy maps Backend, giữ ID nội dung/source/notes/status/date thực; việc không khớp giữ customized, không xóa key cũ. Lặp/reload không nhập trùng.
4. Backup/import có version, validate trước ghi, preview, mặc định giữ profile hiện có; ID trùng bỏ qua hoặc copy khi chọn rõ, ánh xạ đầy đủ task/generation/completion. Import dùng revision thiết bị và transaction, cancel không ghi.
5. Kết hợp export từ bản chưa lưu, lỗi storage và conflict với Hải/Hữu Hiếu; không đặt storage trong feature/Profile hoặc dựng online account giả.
6. Biên soạn DevOps/SRE, Network, Security, QA đủ mười track; lab được phép, công cụ/chi phí/thiết bị rõ. Chủ sở hữu nguồn QA không thay trách nhiệm test của mọi thành viên.

## 4. Phụ thuộc và bàn giao kỹ thuật

**Đầu vào:**

- LoadWorkspaceFunction/SaveWorkspaceFunction/Workspace/BackupFile; mục 7 kiến trúc.
- Validator từ Hữu Hiếu; legacy maps từ backendPack Hân phụ trách (giữ ID đã có); code v1 còn ở state.ts để đọc định dạng.
- App state/save indicator và callback import/export do Hải ghép; không tự đổi app/context để né dependency.

**Đầu ra:**

- Persistence + migration + backup/import thực, có test browser/native transaction và failure paths.
- Bốn pack hạ tầng/QA, mười track; hướng dẫn chạy thử isolated profile/DB, không thao tác dữ liệu học thật.

**Bàn giao sớm:** 05/10 chốt load/save/result và preview/import với Hải/Hữu Hiếu; 06/10 ưu tiên load/save + revision/lỗi, rồi hoàn thiện migration/backup. Không đổi localStorage/UI sang v2 khi migration chưa có gate.

Có thể làm inventory nguồn, pack, pure module và test trên dữ liệu thử trước. Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback. Không tự gọi v2 đã chạy trong app khi mới compile pack/module. Không để dependency chưa có làm dừng phần độc lập.

## 5. User story và acceptance ban đầu

**US-MW-TEAM-05-01:** Là sinh viên, tôi muốn sử dụng module dữ liệu cho toàn app; phối hợp giao diện sao lưu với profile theo hướng/nhánh đã chọn, để học đúng nội dung và giữ kế hoạch/tiến độ của mình.

**US-MW-TEAM-05-02:** Là người biên soạn, tôi muốn các track được giao có nguồn, bài và đầu ra phù hợp, để mọi cấu hình đều sử dụng được trong cùng website.

Người làm tách thêm story theo từng hành động; bảng dưới là phạm vi bắt buộc ban đầu, không thay toàn bộ story/flow/test do mình viết.

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Load rỗng trả workspace rỗng hợp lệ; dữ liệu hỏng/schema lạ trả lỗi và bảo toàn nguồn; không tự ghi defaults. | Mở/lưu workspace | Không dữ liệu, JSON/schema lỗi, DB blocked, reload |
| AC-02 | Save đọc/so revision + ghi trong một transaction, chỉ success sau complete; quota/abort trả storage và bản UI chưa lưu còn nguyên. | Lưu / thử lại / lỗi | Completion/abort/quota, không báo success trước complete |
| AC-03 | Hai tab cùng revision không ghi đè âm thầm: một save thành công, bản stale trả conflict; người dùng tải mới hoặc xuất bản đang sửa. | Xử lý conflict | Hai tab thật trên profile thử, compare trước/sau |
| AC-04 | Migration giữ key v1 và dữ liệu task/source/notes/done/date; unknown work không mất; bấm lại/reload không nhân bản. | Preview / xác nhận / hủy chuyển v1 | Fixture v1, customized, thiếu timestamp, fingerprint trùng, lỗi ghi |
| AC-05 | Import valid/invalid/version mới/duplicate/copy tuân preview/confirm/cancel, remap quan hệ đúng; không reset profile/plan. | Xuất / nhập / copy / hủy | Round trip, file hỏng, version mới, ID trùng, copy, quota/conflict |
| AC-06 | Mười track hạ tầng/QA có prerequisite, nguồn/credentials/portfolio phù hợp; SRE/automation/DevSecOps không bỏ nền tảng. | Chọn hạ tầng/QA và tạo kế hoạch | Hai DevOps, hai Network, ba Security, ba QA |

## 6. Luồng riêng và test case phải viết

Copy mẫu [FLOW](../../templates/FLOW.md) thành `FLOW.md`; mỗi hành động bên dưới có mã riêng, điều kiện đầu vào, luồng chính/thay thế/lỗi/hủy, dữ liệu trước/sau và AC/test liên kết. Không chỉ nộp một sơ đồ tổng quát.

- **FL-MW-TEAM-05-01:** Load lần đầu / mở DB bị blocked / dữ liệu hỏng.
- **FL-MW-TEAM-05-02:** Lưu, quota/abort và thử lại.
- **FL-MW-TEAM-05-03:** Conflict hai tab: tải bản mới hoặc xuất bản chưa lưu.
- **FL-MW-TEAM-05-04:** Preview migration v1, confirm/cancel và tránh nhập trùng.
- **FL-MW-TEAM-05-05:** Xuất backup.
- **FL-MW-TEAM-05-06:** Preview import, xử lý duplicate/copy/profile, confirm/cancel.

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Hiện tất cả test của task **chưa chạy**.

- Browser IndexedDB thật trên DB/profile thử: transaction complete, revision stale/conflict, reload và version blocked; không chỉ mock API.
- Migration/import: dữ liệu gốc không đổi, giữ task/notes/source/date, lặp không nhân đôi, copy remap đầy đủ, cancel/error không ghi.
- Mười cấu hình nội dung qua toàn hành trình; mỗi bạn vẫn test phần mình, Huy không phải người test thay cả nhóm.
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
