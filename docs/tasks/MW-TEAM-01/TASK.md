# MW-TEAM-01 — Khám phá, chi tiết hướng và nội dung Web/UX

**Người làm:** Nguyễn Thị Quỳnh Hân (`QuynhHan486`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Phạm Công Định.
**Branch:** `feat/mw-team-01`. **Trạng thái:** Đã sửa feedback và kiểm thử kỹ thuật ngày 09/10/2026; PR #5 chờ Hải/Chung Hiếu review callback chung và Định/Hải nghiệm thu. Xem FEEDBACK_20261009.md và QA_AI_LOG.md.

Đọc [phân công chung](../../team/PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md) và [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md). Scope chi tiết/nhánh là baseline từ bảng đích; ghi thay đổi được Hải chốt vào task, không tự thu hẹp.

## 1. Quyền sửa file

- `src/features/explore/**`
- `src/features/path-detail/**`
- `src/domain/content.ts`
- `src/content/catalog.ts`
- `src/content/paths/backend.ts`
- `src/content/paths/frontend.ts`
- `src/content/paths/fullstack.ts`
- `src/content/paths/ux.ts`
- `scripts/tasks/MW-TEAM-01.mjs`: kiểm thử module/nội dung task với công cụ đã có; không hạ assertion chung.
- `docs/tasks/MW-TEAM-01/**`: story, flow, test, AI log, minh chứng và yêu cầu phối hợp.

Đây là allowlist của task. Hải giữ `src/app/**`, `src/components/**`, `src/styles.css`, `src/domain/contracts.ts`, `src/content/index.ts`, file nguồn v1 `src/data.ts`/`src/catalog.ts`/`src/state.ts`, package/config/check/CI và tài liệu sinh tự động. File mới được liệt kê ở trên là **cần triển khai**, chưa tồn tại. Không tạo type/callback/registry thứ hai để né file chung; báo yêu cầu đổi hợp đồng trong task.

## 2. Nội dung phải hoàn thiện

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| Backend Developer · `backend` | `backend.node`, `backend.python`, `backend.java` | Node.js / Express; Python / FastAPI; Java / Spring Boot | 3 |
| Frontend Developer · `frontend` | `frontend.react`, `frontend.angular`, `frontend.vue` | React; Angular; Vue | 3 |
| Full-stack Developer · `fullstack` | `fullstack.react-node`, `fullstack.react-python`, `fullstack.react-java`, `fullstack.angular-node`, `fullstack.angular-python`, `fullstack.angular-java`, `fullstack.vue-node`, `fullstack.vue-python`, `fullstack.vue-java` | React + Node; React + Python; React + Java; Angular + Node; Angular + Python; Angular + Java; Vue + Node; Vue + Python; Vue + Java | 9 |
| UX Design · `ux` | `ux.research`, `ux.product` | UX Research / interaction; UI / Product Design | 2 |
| **Tổng của task** | | | **17** |

Mỗi track có chặng nền tảng/riêng, tiên quyết, nguồn trực tiếp đã mở kiểm tra, bài thực hành có phút/acceptance, portfolio và mục tiêu chứng nhận đã khảo sát. Không nhân số nguồn bằng link trùng/trang chủ. Chứng nhận không phù hợp phải có lý do sau khảo sát và portfolio; không điền mục giả. Gói ở `review` tới khi Hải nghiệm thu. Không dùng `checkedAt` của pack cũ như bằng chứng đã kiểm tra lại từng URL hôm nay.

## 3. Phần thực hiện

1. Đưa đủ 12 ngành / 6 khoa và danh mục hướng v2 vào catalog nội dung; thể hiện gần nền tảng/mở rộng và giải thích riêng cho Thiết kế Vi mạch. Ngành hồ sơ và khoa đang khám phá độc lập; mọi hướng vẫn mở được.
2. Explore: tìm/lọc, kết quả rỗng, xem quan hệ ngành–hướng, mở Path detail. Path detail dùng cùng một trang cho mọi hướng, chọn track phù hợp và giữ ba tab Roadmap / Nguồn học / Chứng nhận.
3. Giữ nguồn học đa dạng; lọc Việt/Anh/miễn phí độc lập ngôn ngữ lập trình. Nguồn không đúng bộ lọc có trạng thái rỗng + cách nới bộ lọc; không tự đổi nguồn trong draft.
4. Viết resolver thuần trong domain/content.ts: nhận ContentPack[] và ID, trả nội dung đã resolve hoặc lỗi có mã; không import registry/content implementation vào domain.
5. Rà Backend Node/Python/Java: giữ ID/legacy maps, nền tảng DSA, OOP, Computer Networking, OS/Linux, Computer Systems và thư viện đang có. Viết nền tảng FE trước React/Angular/Vue, rồi nội dung UX đúng hai nhánh.
6. Ghép đủ chín Full-stack từ FE × BE; dùng tham chiếu chặng đã có, thêm chặng tích hợp đúng cặp. Không chép chín bộ tài nguyên/lịch, không coi Vite là nhánh framework.

## 4. Phụ thuộc và bàn giao kỹ thuật

**Đầu vào:**

- Catalog/ngành và rules trong bảng phạm vi; mẫu backendPack đang ở review, không lấy fixtures Prototype 02 làm nội dung hoàn chỉnh.
- Context v2 và callback do Hải tích hợp. Có thể biên soạn pack + resolver trước khi context sẵn sàng.

**Đầu ra:**

- Catalog v2 + bốn pack/Full-stack builder; resolver dùng chung, danh sách ID nền tảng được tái sử dụng.
- Explore/Path detail đọc nội dung đã resolve qua props/context v2 sau khi giao diện chung được Hải chốt.

**Bàn giao sớm:** Ngày 05/10 bàn giao danh sách track/ID nền tảng và format catalog; 06/10 bàn giao resolver + Backend/FE nền đầu để các bạn kiểm thử. Hoàn thiện cả UX và chín Full-stack theo mốc chung.

Có thể làm inventory nguồn, pack, pure module và test trên dữ liệu thử trước. Chỉ nối UI vào v2 sau khi Hải tích hợp context/registry và chốt callback. Không tự gọi v2 đã chạy trong app khi mới compile pack/module. Không để dependency chưa có làm dừng phần độc lập.

## 5. User story và acceptance ban đầu

**US-MW-TEAM-01-01:** Là sinh viên, tôi muốn sử dụng explore + path detail theo hướng/nhánh đã chọn, để học đúng nội dung và giữ kế hoạch/tiến độ của mình.

**US-MW-TEAM-01-02:** Là người biên soạn, tôi muốn các track được giao có nguồn, bài và đầu ra phù hợp, để mọi cấu hình đều sử dụng được trong cùng website.

Người làm tách thêm story theo từng hành động; bảng dưới là phạm vi bắt buộc ban đầu, không thay toàn bộ story/flow/test do mình viết.

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Chọn ngành bất kỳ, đổi khoa khám phá và mở hướng khác không sửa majorId hồ sơ, draft khác hay plan đang học. | Chọn ngành / lọc / mở hướng | Tất cả 12 ngành; kết quả rỗng; mở hướng không gần nền tảng |
| AC-02 | Chọn mọi track trong bốn hướng có chặng, nguồn, portfolio và mục tiêu đã khảo sát; React/Angular/Vue dùng nền tảng FE trước. | Chọn nhánh | 17 cấu hình; kiểm tra ngôn ngữ, nguồn áp dụng, prerequisite |
| AC-03 | Chọn nguồn/chứng nhận và mở roadmap ngoài hoạt động; link mở tab mới; bộ lọc không có kết quả được giải thích. | Lọc / chọn / mở nguồn và lưu mục tiêu | URL/provider/checkedAt thực; lọc rỗng; hủy chọn nguồn |
| AC-04 | Chín Full-stack dùng đúng một FE + một BE, không lặp chặng chung; tiên quyết đúng và không đưa bài Java vào Python. | Ghép Full-stack | Ma trận 3 × 3, ID dùng chung, nguồn theo cặp |
| AC-05 | Reload sau lưu draft giữ nhánh/nguồn; lỗi lưu không hiện đã lưu; các kế hoạch cũ không bị thay khi khám phá. | Lưu lựa chọn / lỗi lưu | Tích hợp với context và persistence; kiểm tra lại các plan cũ |

## 6. Luồng riêng và test case phải viết

Copy mẫu [FLOW](../../templates/FLOW.md) thành `FLOW.md`; mỗi hành động bên dưới có mã riêng, điều kiện đầu vào, luồng chính/thay thế/lỗi/hủy, dữ liệu trước/sau và AC/test liên kết. Không chỉ nộp một sơ đồ tổng quát.

- **FL-MW-TEAM-01-01:** Chọn ngành và khám phá khoa khác.
- **FL-MW-TEAM-01-02:** Tìm/lọc hướng, kết quả rỗng và mở chi tiết.
- **FL-MW-TEAM-01-03:** Chọn/đổi track, bao gồm cặp Full-stack.
- **FL-MW-TEAM-01-04:** Mở chặng, chọn nguồn, lọc không có nguồn và hủy.
- **FL-MW-TEAM-01-05:** Mở roadmap/nguồn ở tab mới.
- **FL-MW-TEAM-01-06:** Lưu/bỏ lưu mục tiêu chứng nhận; chuyển My roadmap.

Copy mẫu [QA và AI log](../../templates/QA_AI_LOG.md) thành `QA_AI_LOG.md`. Test có steps/expected/actual, SHA, môi trường, ảnh/log khi cần. Kết quả chạy lại và minh chứng hiện tại nằm trong QA_AI_LOG.md.

- Resolver thiếu ID, tham chiếu sai, prerequisite thiếu/vòng, thứ tự hợp lệ và nguồn theo track.
- Nội dung cho 17 cấu hình; chín Full-stack kiểm tra riêng từng cặp; nguồn/chứng nhận kiểm tra bằng trang chính thức.
- UI Explore/Path detail: lỗi/rỗng/hủy, tab nguồn/chứng nhận, keyboard, mobile và không thay plan cũ.
- `npm run check`, `npm run build` và script task: ghi lệnh/kết quả thật. Pack chưa đăng ký chưa được check chung bao phủ; test riêng phải resolve cùng các pack phụ thuộc, sau tích hợp chạy lại toàn registry.
- Mọi cấu hình trong bảng phải được kiểm tra chọn → đổi nguồn → tạo plan → hoàn thành → reload trên app đã tích hợp. Shared planner không miễn kiểm tra nhánh.
- UI: desktop/mobile, bàn phím, loading/empty/error, lưu lỗi/hủy. Nội dung: URL/provider/phí/điều kiện/ngày kiểm tra thực.
- AI log của mình, không bịa bug hoặc Pass. Nhóm sẽ làm so sánh hai công cụ AI trên một bài nhỏ chung, không bắt từng người xây app bằng hai AI.

## 7. Định nghĩa bàn giao hoàn tất

- [x] Tất cả hướng/track và module được giao đã làm; không còn placeholder thiếu nguồn/bài.
- [x] `TASK.md`, `FLOW.md`, `QA_AI_LOG.md` có nội dung do người làm bổ sung, bằng chứng và SHA/PR.
- [x] Kiểm tra đơn vị/nội dung, check/build và UI liên quan có kết quả thực.
- [ ] Hợp đồng/ID dùng chung đã phối hợp; diff đúng allowlist, style/sidebar cũ được giữ.
- [ ] Hải đã tích hợp; kiểm tra lại mọi cấu hình của task trên app chính, dữ liệu cũ còn nguyên.
- [ ] Review chéo và Hải nghiệm thu cuối; sửa feedback xong trước khi đánh Done.

Không cập nhật Notion, không tự merge/push main và không giao lại toàn bộ kiểm thử cho một thành viên.

## Story theo hành động — bổ sung sơ đồ 10/10

PR #5 đã được Hải merge ngày 09/10 tại `5800838`; `main` hiện có bản tích hợp PR #8, baseline `1e9bff4db59e75a6b90aa44f6b614a6ca5b73ee3`. Các trạng thái review ngày 09/10 ở đầu file và checklist trên là lịch sử bàn giao code, không phải kết luận mới về toàn bộ nghiệm thu. Lượt này chỉ hoàn thiện sơ đồ/tài liệu trong allowlist; không thay acceptance hoặc hợp đồng, không tự đánh dấu reviewer đã nghiệm thu.

Sáu mã nhóm FL ở §6 được giữ nguyên. Tách các hành động bằng hậu tố A/B/C/D theo quy định “mỗi hành động một mã/sơ đồ”; retry/discard là hai luồng bổ sung từ feedback 09/10. **16 sơ đồ: 14 hành động task + 2 hành động feedback.** Mỗi story dưới kế thừa US-MW-TEAM-01-01; mở nguồn còn liên quan US-MW-TEAM-01-02. Xem [FLOW.md](FLOW.md) cho bảng bước, input/precondition/postcondition, dữ liệu giữ khi lỗi/hủy, hình và test. Đây là mô tả triển khai hiện tại, không yêu cầu xây lại module của thành viên khác.

| Story riêng | Là sinh viên, tôi muốn… | Để… | FL | AC / test |
|---|---|---|---|---|
| US-MW-TEAM-01-01-A | Chọn ngành đang học | Ưu tiên gợi ý và lưu hồ sơ qua v2 | 01-A | AC-01/05; TC-01/07 |
| US-MW-TEAM-01-01-B | Khám phá theo khoa khác | Xem hướng khác mà giữ ngành hồ sơ | 01-B | AC-01; TC-01/08 |
| US-MW-TEAM-01-02-A | Tìm/lọc hướng, xử lý kết quả rỗng | Chọn hướng phù hợp mà không đổi kế hoạch | 02-A | AC-01/03; TC-08/09 |
| US-MW-TEAM-01-02-B | Mở hướng chi tiết hoặc tổng quan | Đọc đúng nội dung đã đăng ký | 02-B | AC-01/02/05; TC-02/08/09 |
| US-MW-TEAM-01-03-A | Chọn/đổi track, gồm cặp Full-stack | Xem đúng chặng/nguồn, giữ plan cũ | 03-A | AC-02/04/05; TC-02/03/05/08 |
| US-MW-TEAM-01-03-B | Lưu draft lựa chọn | Reload giữ lựa chọn, biết khi lưu thất bại | 03-B | AC-05; TC-05/07/11b |
| US-MW-TEAM-01-04-A | Mở thông tin chặng | Đọc đầu ra, nguồn và bài thực hành | 04-A | AC-02/03; TC-04/09 |
| US-MW-TEAM-01-04-B | Lọc nguồn theo ngôn ngữ/chi phí | Nới bộ lọc khi rỗng, giữ nguồn đã chọn | 04-B | AC-03/05; TC-04/09 |
| US-MW-TEAM-01-04-C | Chọn nguồn/chặng/đã biết rồi áp dụng | Chỉ nhận thông báo thành công sau lưu | 04-C | AC-03/05; TC-04/05/07 |
| US-MW-TEAM-01-04-D | Hủy/đóng drawer | Bỏ lựa chọn tạm trước Apply, phân biệt pending chung | 04-D | AC-03/05; TC-04/09/07 |
| US-MW-TEAM-01-05 | Mở roadmap/nguồn ở tab mới | Xem điều kiện nhà cung cấp và giữ dữ liệu học | 05 | AC-03; TC-10/09 |
| US-MW-TEAM-01-06-A | Lưu mục tiêu chứng nhận | Theo dõi mục tiêu ở Profile | 06-A | AC-03/05; TC-06/07 |
| US-MW-TEAM-01-06-B | Bỏ lưu mục tiêu chứng nhận | Chỉ bỏ bookmark đó, giữ lịch sử học | 06-B | AC-03/05; TC-06/07 |
| US-MW-TEAM-01-06-C | Chuyển My roadmap theo track | Tiếp tục tùy chỉnh draft chung trước khi tạo plan | 06-C | AC-02/05; TC-05/08 |
| US-MW-TEAM-01-07-A | Retry candidate khi save thất bại | Lưu lại đúng bản, không nhân đôi mutation | 07-A | AC-05/feedback; TC-07/11b/11c |
| US-MW-TEAM-01-07-B | Xác nhận bỏ candidate My Plan | Dọn local/shared, giữ committed/history, không hồi sinh qua retry | 07-B | AC-05/feedback; TC-11/11b/11c |

Tài liệu/sơ đồ mới được gửi qua branch `codex/mw-team-01-diagrams` để review độc lập vì PR #5 đã đóng sau merge. Căn cứ thay đổi mô tả: AppShell main lưu `majorId` qua `saveProfile` v2; v1 chỉ đọc. Không đổi mã ID dữ liệu. [Bàn giao sơ đồ](DIAGRAMS_20261010.md) ghi kiểm tra thực tế và việc còn cần Hải duyệt.
