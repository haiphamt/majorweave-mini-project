# Phân công triển khai Mini Project — MajorWeave

**Ngày lập:** 04/10/2026. **Hạn nộp:** Thứ Hai, 12/10/2026.
**Nhóm:** Phạm Tuấn Hải + năm thành viên. **Trạng thái:** đã lập task theo yêu cầu “Chia task cho 5 bạn”; chưa phải thông báo các task đã hoàn thành hoặc các bạn đã xác nhận nhận việc.

Danh sách tên/username lấy từ ảnh Hải cung cấp. Không đưa MSSV, email hoặc thông tin liên hệ vào phân công repo. Phân công này thay đợt chuẩn bị prototype trong README; chỉ áp dụng mini, không phải project chính.

Để hướng dẫn các bạn trong buổi họp: [kịch bản trình bày và checklist](HUONG_DAN_HOP_NHOM.md).

## 1. Phạm vi làm việc và điểm cần chốt đầu buổi

Dùng [bảng phạm vi](../PHAM_VI_MAJORWEAVE.md) làm baseline tổ chức công việc: **12 ngành gốc, 18 hướng, 50 cấu hình**, năm trang. 50 gồm chín Full-stack ghép FE × BE; không phải 50 ứng dụng hoặc 50 roadmap chép riêng.

- Các mục còn ghi “đề xuất” trong bảng phạm vi, nhất là AI Engineer và chi tiết nhánh ngoài Backend, vẫn cần Hải ghi quyết định ở mốc đầu buổi 05/10. Bảng này phân sẵn người phụ trách để không bỏ sót; các bạn được làm inventory/story/nguồn/module chung trước, không tự coi nội dung đề xuất đã được phê duyệt để phát hành.
- Không cắt bớt hướng chỉ để vừa tiến độ, không đưa placeholder hoặc chỉ link roadmap vào tiêu chí Done. Nếu Hải điều chỉnh một nhánh, cập nhật cả bảng này, task, catalog và checklist coverage.
- Sidebar/style bản cũ, không đăng nhập trước, nhiều plan/activePlanId, dữ liệu khách giữ lại. Google/online account ở giai đoạn sau.
- File nội dung học Node/Python/Java/... là lộ trình **sinh viên tự học**; website MajorWeave vẫn dùng React/TypeScript/Vite, không yêu cầu viết ba backend của website.

## 2. Mỗi người làm phần nào?

| Người / GitHub | Phần giao diện | Logic dùng chung | Nội dung học phải làm đầy đủ | Cấu hình |
|---|---|---|---|---:|
| [Nguyễn Thị Quỳnh Hân](../tasks/MW-TEAM-01/TASK.md) · `QuynhHan486` | **Explore + Path detail** | Resolve nội dung và ghép Full-stack | Backend Developer; Frontend Developer; Full-stack Developer; UX Design | 17 |
| [Phạm Công Định](../tasks/MW-TEAM-02/TASK.md) · `Dinglebell` | **My roadmap** | Planner + tạo lại kế hoạch | Mobile Developer; Game Developer | 7 |
| [Chung Minh Hiếu](../tasks/MW-TEAM-03/TASK.md) · `chungminhhieu2311-collab` | **My plan: Plan / Stats / Weeks** | Thao tác task, chốt tuần và thống kê | Data Scientist; Machine Learning; MLOps Engineer; AI Engineer | 8 |
| [Lê Nguyễn Hữu Hiếu](../tasks/MW-TEAM-04/TASK.md) · `hiuanhutiu` | **Profile: hồ sơ, nhịp học, sao lưu** | Validation workspace + tổng hợp hoạt động | Data Analyst; BI Analyst; Data Engineer; Business Analyst | 8 |
| [Triệu Quang Huy](../tasks/MW-TEAM-05/TASK.md) · `1can5ez` | **Module dữ liệu cho toàn app; phối hợp giao diện sao lưu với Profile** | IndexedDB + migration + backup/import | DevOps / SRE; Network Engineer; Cyber Security; QA / Test Automation | 10 |
| **Tổng** | **Đủ năm trang và module dữ liệu** | | **18 hướng** | **50** |

Hân có 17 cấu hình: ba Backend đã có nền để rà soát, ba FE, chín Full-stack dùng lại FE/BE và hai UX. Định có bảy nhánh nội dung nhưng planner/tạo lại là logic có nhiều ràng buộc. Hữu Hiếu nhận validation để Huy tập trung transaction/migration; Chung Minh Hiếu nhận task/progress để planner và Profile không tự tính khác nhau.

Đây là cách cân phần code + số nhánh riêng + nội dung cần kiểm tra, chưa phải cam kết giờ công bằng tuyệt đối. Mỗi bạn gửi inventory chặng/bài/URL và ước lượng thực tế ngày 05/10; Hải điều chỉnh hỗ trợ khi một phần quá tải. Điều chỉnh phải chuyển cả phạm vi file/chặng với người phụ trách rõ, không để hai người sửa cùng file.

## 3. Hải giữ phần kiến trúc, thiết kế và tích hợp

Hải không nhận một nhóm nội dung riêng; năm bạn thực hiện chính toàn bộ nội dung và module trong bảng.

**Hải cần làm ngay trước phần code phụ thuộc:**

1. Mở buổi giao việc: chốt các nhánh còn đề xuất, kiểm tra mọi người chạy được repo và hiểu v1/v2. Ghi quyết định vào task/bảng phạm vi; không ký Done thay bằng chứng.
2. Duyệt UI bổ sung trên sidebar cũ: chọn hướng/track tổng quát, chọn nhiều plan, Plan/Stats/Weeks, profile và preview nhập/chuyển dữ liệu. Giữ palette/font/spacing; không phát ba hướng thiết kế mới.
3. Chốt chữ ký export và callback UI theo mục 5 với năm bạn; xác nhận ID nội dung dùng chung. Chỉ điều chỉnh contracts một chỗ khi có lý do/tác động/test.
4. Khi domain/persistence có kiểm thử, tích hợp `src/app/context.ts`/AppShell và registry sang **một Workspace v2**; giữ v1 tới khi migration + giữ dữ liệu qua gate. Trạng thái dirty/save/conflict và thông báo chỉ thành công sau lưu phải nhất quán.
5. Ghép PR, duyệt file chung/CSS/component và xử lý conflict. Hải sở hữu entry/app, components/style, contracts, registry, package/config/check/CI, tài liệu sinh tự động và demo triển khai.
6. Nghiệm thu toàn hành trình và đóng gói báo cáo/demo cuối. Các bạn tự test phần mình, Hải kiểm tra đầu ra sau tích hợp.

**Các bạn bắt đầu được ngay:** viết story/flow, inventory/kiểm tra nguồn, biên soạn pack mới và pure module/test theo contracts. UI chuyển v2 phụ thuộc callback/context đã chốt; không có năm kho trạng thái hoặc năm storage riêng.

## 4. Bao phủ tất cả hướng và nhánh

ID track v2 dùng `<pathId>.<track>`; danh sách ID cụ thể nằm trong từng TASK.md. Không lấy ID ngắn của fixtures lịch sử làm ID toàn cục.

| Hướng / pathId | Chủ sở hữu | Các nhánh được phân | Số |
|---|---|---|---:|
| `backend` · Backend Developer | Nguyễn Thị Quỳnh Hân | Node.js / Express; Python / FastAPI; Java / Spring Boot | 3 |
| `frontend` · Frontend Developer | Nguyễn Thị Quỳnh Hân | React; Angular; Vue | 3 |
| `fullstack` · Full-stack Developer | Nguyễn Thị Quỳnh Hân | React + Node; React + Python; React + Java; Angular + Node; Angular + Python; Angular + Java; Vue + Node; Vue + Python; Vue + Java | 9 |
| `ux` · UX Design | Nguyễn Thị Quỳnh Hân | UX Research / interaction; UI / Product Design | 2 |
| `mobile` · Mobile Developer | Phạm Công Định | Android / Kotlin; iOS / Swift; Flutter / Dart; React Native / TypeScript | 4 |
| `game` · Game Developer | Phạm Công Định | Unity / C#; Unreal / C++ và Blueprint; Godot / GDScript | 3 |
| `scientist` · Data Scientist | Chung Minh Hiếu | Python / thống kê / mô hình | 1 |
| `ml` · Machine Learning | Chung Minh Hiếu | scikit-learn; Computer Vision / PyTorch; NLP / Transformers | 3 |
| `mlops` · MLOps Engineer | Chung Minh Hiếu | Serving và monitoring; Pipeline và vòng đời mô hình | 2 |
| `ai-engineer` · AI Engineer | Chung Minh Hiếu | LLM / RAG với Python; Tools / agent với Python | 2 |
| `analyst` · Data Analyst | Lê Nguyễn Hữu Hiếu | SQL + bảng tính; SQL + Python / pandas | 2 |
| `bi` · BI Analyst | Lê Nguyễn Hữu Hiếu | Power BI; Tableau | 2 |
| `engineer` · Data Engineer | Lê Nguyễn Hữu Hiếu | Batch pipeline; Streaming / Kafka | 2 |
| `business-analyst` · Business Analyst | Lê Nguyễn Hữu Hiếu | IT / Software BA; Data / BI BA | 2 |
| `devops` · DevOps / SRE | Triệu Quang Huy | DevOps / AWS; SRE | 2 |
| `network` · Network Engineer | Triệu Quang Huy | Mạng và mô phỏng; Network Automation / Python | 2 |
| `security` · Cyber Security | Triệu Quang Huy | Defensive Security / SOC; Web Application Security; DevSecOps | 3 |
| `qa` · QA / Test Automation | Triệu Quang Huy | Manual QA; Web Automation / Playwright; API Testing / Postman | 3 |
| **Tổng** | **Mỗi hướng có đúng một chủ sở hữu** | **9 Full-stack là 3 FE × 3 BE** | **50** |

Quan hệ ngành–hướng theo bảng phạm vi; Hân triển khai catalog/hiển thị, Hải duyệt. Cả 12 ngành khám phá được toàn danh mục. KTMT/Thiết kế Vi mạch giữ riêng majorId, nhóm khám phá chung, lời giải thích rõ phần mở rộng; không thêm VLSI/FPGA/Embedded ngoài danh mục.

## 5. Ranh giới module và điểm ghép phải thống nhất

Bảng này mô tả trách nhiệm, không phải thông báo các hàm đã được viết. `PlannerFunction`, `LoadWorkspaceFunction`, `SaveWorkspaceFunction` trong [contracts](../../src/domain/contracts.ts) là hợp đồng đã có. Chữ ký helper/props còn lại chốt bằng một quyết định chung ngày 05/10 trước phần UI phụ thuộc; không tự chép một bản type vào feature.

| Người | Điểm ghép cần bàn giao | Quy tắc |
|---|---|---|
| Hân | `domain/content.ts`: resolve track từ **ContentPack[] truyền vào**, trả track/chặng/nguồn/credential/version hoặc lỗi | Domain không import registry/implementation. Full-stack chỉ định nghĩa phần tích hợp riêng; chặng FE/BE tham chiếu ID |
| Định | `domain/planner.ts`: generate theo PlannerFunction, tạo lại giữ history/identity | Clock/ID truyền vào; không gọi storage/React. Cùng planner cho mọi track |
| Chung Minh Hiếu | `domain/progress.ts`: mutation task/close week/progress/Stats | Trả plan mới, giữ input/history/snapshot; completion ở cấp plan, không nhân bản |
| Hữu Hiếu | `domain/validate.ts`: kiểm tra Workspace/BackupFile từ unknown; `domain/activity.ts`: tổng hợp completion | Không import React/storage; validation không xóa lịch sử khi catalog đổi; activity dùng ngày thật |
| Huy | `persistence/workspace.ts`, `migration.ts`, `backup.ts`: load/save, preview/confirm migration/import, export | Revision trong transaction; success sau complete; không ghi khi preview/cancel |
| Hải | App context/routes/registry, callbacks và save indicator | UI gọi callback; không tự ghi storage hoặc gọi “đã lưu” trước kết quả thật |

### Không sửa chồng file

- Allowlist chính xác ở từng task. `scripts/tasks/<TASK-ID>.mjs` và docs của mỗi task thuộc người ấy.
- Hải giữ `src/content/index.ts`; pack chưa đăng ký chưa được check chung bao phủ. Người làm test pack riêng với dependency cần thiết; Hải đăng ký và chạy toàn bộ lại trước nghiệm thu.
- Hân được tạo `src/content/catalog.ts` v2; catalog/data/state v1 vẫn do Hải phối hợp chuyển, không đổi hàng loạt khi app còn dùng v1.
- Một chặng/nguồn giống thật sự chỉ có một định nghĩa toàn cục. Ví dụ nền Backend đang có Hân giữ ID + legacy maps; track khác tham chiếu. Nội dung/bài khác ngôn ngữ có ID riêng.
- Track tham chiếu chặng ở pack khác phải ghi dependency và chủ sở hữu. Không chép stage/resource vào nhiều pack rồi sửa check để chấp nhận trùng.
- Ngày 05/10 ghi ID dùng chung và chữ ký vào phần “Phụ thuộc” từng task; khi thay đổi, Hải điều phối các consumer, không tự rename ID.
- Không sửa `src/prototype/**` để thay nền app; không đổi framework/dependency/auth; không cập nhật Notion.
- Không bắt bạn khác fix compile bằng cách chép types hoặc thêm dummy return. Dependency chưa có: test pure module bằng fixture **chỉ trong test**, ghi chưa tích hợp.

## 6. Mỗi bạn phải nộp đủ code, nội dung và bằng chứng

1. **TASK.md:** tách user story theo hành động, acceptance và ranh giới file. Task khởi tạo đã có AC bắt buộc; người làm bổ sung, không coi mẫu là đã làm xong.
2. **FLOW.md:** mỗi hành động một mã/sơ đồ; luồng chính, thay thế, lỗi và hủy; UI → logic → lưu; dữ liệu trước/sau; liên kết AC/test. Có thể dùng Mermaid trong Markdown hoặc diagram-design/archify để trình bày; sơ đồ không thay kiểm tra logic.
3. **QA_AI_LOG.md:** test case với steps/expected/actual, SHA/môi trường, minh chứng, bug thật, các lần AI sửa. Hiện task mới **chưa có test Pass**.
4. **Code/module** đúng allowlist và **pack nội dung** tất cả track được giao; branch/PR cá nhân.
5. **Nguồn và chứng nhận:** trực tiếp đúng chủ đề, đã mở trang nhà cung cấp, chi phí/điều kiện/checkedAt thật; portfolio có acceptance. Một chặng cần nguồn chính, nguồn thay thế khi phù hợp; không dùng một nguồn mẫu chung cho cả hướng hoặc một bài giống nhau cho mọi nhánh.
6. **Check/build + UI:** `npm run check`, `npm run build`, script task và thao tác giao diện liên quan. Test logic dùng Node/test công cụ đã có; test UI thao tác thực, bàn phím/mobile, rỗng/lỗi/hủy.
7. **Sau ghép:** từng track chạy chọn → nguồn → tạo plan → done → reload; ghi kết quả từng cấu hình. Done chỉ sau review/tích hợp/nghiệm thu.

Riêng các module planner, tiến độ, validation và persistence phải có test lỗi/invariant vì lỗi có thể làm mất hoặc sai dữ liệu; không chỉ snapshot code hiện tại. URL có HTTPS chưa chứng minh trang tồn tại/miễn phí. Nhánh có lab/API/thiết bị phải ghi điều kiện.

So sánh hai công cụ AI thực hiện trên **một bài nhỏ chung** của nhóm theo yêu cầu môn: Hân giữ bằng chứng của bài thử bộ lọc nguồn, Huy ghép vào báo cáo, Hải chọn hai công cụ/cách đo thực tế ngày 05/10. Không tạo log giả hoặc yêu cầu năm người dựng lại toàn app bằng hai AI.

## 7. Mốc đề xuất đến ngày nộp

Đây là mục tiêu điều phối; ước lượng giờ cụ thể cần kiểm kê ngày 05/10.

| Mốc | Đầu ra của năm bạn | Hải |
|---|---|---|
| **04/10** | Đọc task; chuẩn bị repo, câu hỏi phụ thuộc | Gửi gói phân công này |
| **05/10** | Inventory mọi nhánh/chặng/nguồn; story/flow đầu; chữ ký API; ước lượng và rủi ro | Chốt scope/ID/callback, duyệt thành phần UI mới |
| **06/10** | PR nhỏ nền: resolver+BE/FE, planner, mutation done/undo, validator, load/save; có test liên quan | Review và ghép nền v2 khi persistence/migration giữ dữ liệu qua gate; nếu chưa đạt giữ v1 |
| **07–08/10** | Hoàn thiện pack mọi hướng và UI riêng; gửi PR từng phần, phối hợp dependency | Ghép registry/context/CSS; kiểm tra toàn luồng sớm |
| **09/10** | Coverage từng cấu hình sau tích hợp; tạo lại, tuần chốt, nhiều plan, import/migration | Review thiếu sót và tổ chức kiểm tra chéo |
| **10/10** | Sửa bug, responsive/keyboard, kiểm tra nguồn/chứng nhận cuối | Nghiệm thu chức năng và demo online |
| **11/10** | Ghi kết quả cuối, đóng gói phần báo cáo/AI log; không mở tính năng mới | Tổng duyệt, bản backup/demo và nộp thử |
| **12/10** | Hỗ trợ báo cáo/nộp | Chốt bản nộp đúng hạn |

Không đợi một PR khổng lồ tới 09/10. Một task người có thể chia vài PR nhỏ nối tiếp; mỗi PR ghi rõ phần chưa đủ để Done. Code v2 chưa tích hợp không gọi là toàn app đã hoàn thiện.

## 8. Review chéo và tích hợp

- Định review Hân: track/source/FE–BE/Full-stack và resolver.
- Chung Minh Hiếu review Định: lịch, identity khi tạo lại và dữ liệu My plan.
- Huy review Chung Minh Hiếu: mutation/snapshot/completion lưu được.
- Hân review Hữu Hiếu: catalog/nguồn/BA và trạng thái Profile.
- Hữu Hiếu review Huy: validator, dữ liệu cũ, import/transaction lỗi.
- **Hải review cuối và merge**, không tự merge main hoặc force push.

Trình tự ghép ưu tiên: contracts/callback → resolver/catalog + validator → planner/progress/persistence có test → migration/backup qua gate → app context v2 → UI/các pack còn lại → toàn hành trình. Hân resolve nội dung qua tham số nên domain không chờ registry hay import vào app.

Hải tổng hợp coverage 18/50 từ kết quả từng task; không suy ra 50 Pass từ một lượt Backend. Mỗi bạn vẫn chịu trách nhiệm test nội dung mình dù dùng chung UI/planner. Nếu mốc không đạt, báo cụ thể phần thiếu/giờ cần/ảnh hưởng, chuyển hỗ trợ có chủ sở hữu; không âm thầm bỏ nhánh.

## 9. Prompt đưa vào Antigravity

Mỗi người dùng mã task tương ứng; README và AGENTS luôn là luật chung.

```text
Đọc AGENTS.md, docs/team/PHAN_CONG_MINI_PROJECT.md,
docs/KIEN_TRUC_MAJORWEAVE.md và docs/tasks/<TASK-ID>/TASK.md.
Tôi là <người phụ trách>; thực hiện đúng task và allowlist.
Trước hết đọc code thật, viết/hoàn thiện user story, FLOW.md và test case.
Nêu dependency/chữ ký cần chốt; làm phần độc lập trước.
Giữ sidebar/style cũ, dùng contracts chung, không đăng nhập trước.
Hoàn thiện mọi track được giao: nguồn đã xác minh, bài cụ thể,
portfolio/chứng nhận phù hợp; không dùng placeholder để báo Done.
Không tự sửa app/context/CSS/registry/types/package/file người khác.
Test phần mình, chạy check/build, ghi kết quả thật và AI log;
bàn giao PR cá nhân, chờ Hải review/tích hợp rồi kiểm tra lại trên app.
```
