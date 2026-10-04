# MajorWeave — Kịch bản họp nhóm và hướng dẫn bắt đầu

**Người trình bày:** Phạm Tuấn Hải. **Ngày soạn:** 04/10/2026. **Hạn nộp mini:** Thứ Hai, 12/10/2026.

**Cách dùng:** Hải trình bày phần A khoảng 15 phút, mở demo và bảng phân công cùng lúc. Phần B để các bạn làm theo sau buổi họp. Các câu trong blockquote là lời nói gợi ý; bảng/checklist là nội dung để chỉ trên màn hình.

Tài liệu đi kèm: [phân công năm bạn](PHAN_CONG_MINI_PROJECT.md), [quy trình Antigravity](QUY_TRINH_ANTIGRAVITY.md), [kiến trúc](../KIEN_TRUC_MAJORWEAVE.md), [phạm vi](../PHAM_VI_MAJORWEAVE.md), [luật chung](../../AGENTS.md).

## A. Kịch bản Hải trình bày

### 1. Dự án giải quyết việc gì? — 1 phút

> Mini của nhóm mình là MajorWeave: giúp sinh viên khám phá các hướng IT từ ngành đang học, chọn một hướng và nhánh, rồi lập kế hoạch tự học. Sinh viên cũng có thể xem các hướng thuộc khoa khác.
>
> Ví dụ một bạn học Kỹ thuật Phần mềm muốn theo Backend: bạn xem nền tảng cần học, chọn Node.js, Python hoặc Java, chọn tài liệu phù hợp, đặt quỹ giờ và tạo kế hoạch theo tuần. Học ở nguồn bên ngoài xong thì quay lại đánh dấu tiến độ.
>
> Website cần có nội dung và kế hoạch dùng được cho mọi hướng trong danh mục nhóm chốt. Việc khám phá hướng học là gợi ý; mình không kết luận một sinh viên phù hợp nghề nào chỉ từ vài câu hỏi hoặc tên ngành.

### 2. Demo để mọi người hình dung đầu ra — 3 phút

Chuẩn bị bản đang chạy có sidebar tại `http://127.0.0.1:5173/#/explore`. Dùng hồ sơ trình duyệt thử riêng nếu thao tác tạo/đánh dấu kế hoạch; giữ dữ liệu học thật đang có.

| Thứ tự | Hải mở/thao tác | Điều cần giải thích |
|---|---|---|
| 1 | Explore: chọn ngành, khám phá khoa khác | Ngành hồ sơ và bộ lọc khám phá độc lập; ngành không khóa hướng |
| 2 | Backend → chọn Node/Python/Java | Cùng một trang, nội dung/nguồn/bài thay đổi theo nhánh |
| 3 | Roadmap / Nguồn học / Chứng nhận | Có liên kết roadmap ngoài và nguồn trực tiếp; không chỉ một link trang chủ |
| 4 | My roadmap: chọn chặng, nguồn, giờ/tuần | Bản nháp chưa làm thay đổi kế hoạch đã tạo |
| 5 | My plan và Profile | Công việc tuần, tiến độ và nhịp học cần nhất quán |

**Nói rõ trạng thái:**

> Bản hiện tại là prototype Backend và giao diện nền đã chọn. Code đã tách module, có hợp đồng dữ liệu và kiểm tra chung. Nhiều kế hoạch, lưu trữ mới và nội dung mọi hướng là phần chúng ta tiếp tục triển khai. Không lấy việc trang mở được hoặc build thành công làm bằng chứng mọi tính năng đã xong.

### 3. Phạm vi và kiến trúc chung — 2 phút

> Bảng đích đang có 12 ngành gốc, 18 hướng và 50 cấu hình. Chín cấu hình Full-stack ghép từ ba FE nhân ba BE, dùng lại chặng đã có. Chi tiết còn đề xuất trong bảng phạm vi sẽ được ghi quyết định trong buổi giao việc.
>
> Cả nhóm xây cùng một website React, TypeScript và Vite. Node.js/Python/Java trong roadmap là công nghệ sinh viên học, không có nghĩa mỗi người viết thêm một backend của website bằng ngôn ngữ đó.
>
> Giai đoạn này dùng không đăng nhập. Profile là hồ sơ trên thiết bị. Đích là lưu bằng IndexedDB, có sao lưu file; bản đang chạy vẫn dùng localStorage cũ. Google login thuộc phần sau.

Giải thích cấu trúc bằng lời:

| Vùng | Hiểu đơn giản |
|---|---|
| `features` | Các trang và thao tác của sinh viên |
| `content` | Các hướng, nhánh, chặng học, tài liệu và chứng nhận |
| `domain` | Quy tắc: tiên quyết, sinh lịch, tiến độ, kiểm tra dữ liệu |
| `persistence` | Lưu/đọc/chuyển/sao lưu dữ liệu |
| `app` | Ghép các phần vào cùng một trạng thái, thông báo và điều hướng |

> Mỗi hướng dùng cùng bộ trang và planner. Mình giữ app/context, registry, kiểu dữ liệu chung, component và CSS để tích hợp. Các bạn làm module và nội dung trong phạm vi file của task mình.

### 4. Giao phần cho từng bạn — 2 phút

| Bạn | Task | Chức năng/logic | Nội dung học |
|---|---|---|---|
| Nguyễn Thị Quỳnh Hân | [MW-TEAM-01](../tasks/MW-TEAM-01/TASK.md) | Explore, Path detail, resolve nội dung, ghép Full-stack | Backend, Frontend, Full-stack, UX |
| Phạm Công Định | [MW-TEAM-02](../tasks/MW-TEAM-02/TASK.md) | My roadmap, planner, tạo lại kế hoạch | Mobile, Game |
| Chung Minh Hiếu | [MW-TEAM-03](../tasks/MW-TEAM-03/TASK.md) | My plan, công việc, tiến độ, chốt tuần, Stats/Weeks | DS, ML, MLOps, AI Engineer |
| Lê Nguyễn Hữu Hiếu | [MW-TEAM-04](../tasks/MW-TEAM-04/TASK.md) | Profile, nhịp học, validation | Data Analyst, BI, Data Engineer, BA |
| Triệu Quang Huy | [MW-TEAM-05](../tasks/MW-TEAM-05/TASK.md) | IndexedDB, migration, sao lưu/nhập | DevOps/SRE, Network, Security, QA |

> Mỗi bạn có hai phần: code chức năng/module và nội dung học của các hướng được giao. Nguồn học, chứng nhận, bài thực hành và kế hoạch phải đúng từng nhánh. Mỗi bạn cũng tự viết story, luồng và test của mình.
>
> Hân có nhiều cấu hình vì Full-stack ghép từ FE/BE và Backend đã có nền. Định có ít hướng hơn vì thuật toán sinh lịch/tạo lại nhiều ràng buộc. Mỗi bạn kiểm kê và báo khối lượng thực; nếu cần hỗ trợ mình sẽ điều phối và cập nhật chủ sở hữu file.

### 5. Làm việc với Antigravity và bàn giao — 3 phút

> Mở đúng repo, cho Antigravity đọc AGENTS.md và task cá nhân. Trước khi sửa, yêu cầu nó nêu lại việc được giao, file được sửa, phần phụ thuộc và điều kiện hoàn thành. Nếu nó bắt đầu dựng lại cả app hoặc sửa CSS/kiểu chung ngoài task thì điều chỉnh ngay.
>
> Các bạn có thể bắt đầu kiểm kê nội dung, viết story/flow, pack dữ liệu và module logic thuần. Phần UI v2 cần callback/context chung đã chốt; báo dependency rồi làm phần độc lập trước. Không tạo storage hay bản plan riêng cho mỗi trang để né việc tích hợp.
>
> Mỗi người dùng branch và danh tính Git riêng, nộp PR nhỏ. Mình review, ghép vào app; sau đó người làm kiểm tra lại các nhánh được giao trên app chính. Không tự merge main.

Chỉ vào ba tài liệu một task phải có:

| File | Phải thể hiện |
|---|---|
| `TASK.md` | Người dùng muốn gì, acceptance, file được sửa, dependency |
| `FLOW.md` | Từng hành động có luồng chính, lỗi/thay thế/hủy, dữ liệu trước/sau |
| `QA_AI_LOG.md` | Test case, kết quả thực, SHA, bằng chứng, bug và quá trình dùng AI |

Ví dụ để giải thích **story → luồng → test**:

- **Story:** Là sinh viên có hai kế hoạch, tôi muốn chọn kế hoạch đang xem để tiếp tục học đúng hướng.
- **Luồng:** mở bộ chọn → chọn plan B → cập nhật lựa chọn → lưu → hiển thị B. Lưu lỗi giữ bản đang sửa và báo chưa lưu; chọn plan khác không ghi đè nội dung A.
- **Test:** chuẩn bị A và B → chọn B → hoàn thành một việc B → reload → kiểm tra B còn được chọn, tiến độ B đúng và A không thay đổi. Đây là test minh họa cần thực hiện, chưa có kết quả Pass.

> Luồng không phải chỉ một hình tổng quan. Chọn nguồn, tạo plan, tạo lại, bỏ hoàn thành, kết thúc tuần hay nhập file đều cần luồng riêng. Skill chỉ giúp trình bày hình; mình vẫn phải đọc lại các điều kiện và kiểm thử.

### 6. Công cụ, skill và việc sau buổi họp — 2 phút

> Mọi người cần Antigravity, Git, tài khoản GitHub, Node/npm và trình duyệt. Repo đã có luật và mẫu task; bắt đầu không cần cài thêm skill.
>
> Nếu muốn hình luồng đẹp hơn thì chọn diagram-design hoặc archify. Mermaid trong Markdown vẫn dùng được để nộp và review luồng. Ponytail là tùy chọn để nhắc AI tái dùng code và tránh thêm thư viện thừa, không dùng để bỏ bớt yêu cầu đã giao.
>
> Sau buổi này, mỗi người mở task, chạy repo, gửi lại phạm vi mình hiểu, danh sách nhánh/chặng/nguồn và dependency. Mình chốt API/ID chung và thành phần UI cần thêm. Mục tiêu 06/10 có phần nền để ghép; 07–08/10 hoàn thiện nội dung/UI; 09–10/10 tích hợp và sửa lỗi; 11/10 tổng duyệt; 12/10 nộp.

**Câu chốt:**

> Khi bàn giao, cho mình xem đã làm gì, chạy được bằng cách nào, test nào đã chạy và phần nào còn thiếu. Một module chưa ghép vào app được ghi là bàn giao module; tính năng Done cần chạy đúng sau tích hợp.

## B. Checklist thực hành cho thành viên

### 1. Cài gì để chạy repo?

| Công cụ | Cần cho |
|---|---|
| Antigravity | Soạn/chỉnh code cùng AI |
| Git + tài khoản GitHub cá nhân | Clone, branch, commit và PR |
| Node.js **22.12 trở lên trong dòng 22.x**, kèm npm | Cài dependency và chạy dự án; thống nhất môi trường CI Node 22 |
| Chrome/Edge | Thao tác thử, console, responsive và minh chứng |

React/TypeScript/Vite đã nằm trong repo; dùng `npm ci` theo lockfile. Không cần cài chúng global. Giai đoạn hiện tại không cần Supabase, OAuth key hoặc một server CSDL riêng.

Nếu máy đã clone repo, mở bản đó và kiểm tra `git status`; giữ công việc chưa commit trước khi đổi branch/cập nhật main. Lệnh dưới dùng cho **lần clone đầu**, ở thư mục bạn chọn:

```powershell
git clone https://github.com/haiphamt/majorweave-mini-project.git
cd majorweave-mini-project
npm ci
npm run check
npm run build
npm run dev
```

Mở URL được terminal báo, mặc định `http://127.0.0.1:5173`. Terminal chạy dev giữ mở; dùng terminal thứ hai cho Git. Nếu port 5173 bận, kiểm tra server đang chạy trước khi đổi port.

Trong Antigravity, mở thư mục chứa `package.json` và `AGENTS.md`. Tạo branch từ main đã cập nhật; Hân dùng ví dụ dưới, các bạn đổi thành mã task của mình:

```powershell
git switch -c feat/mw-team-01
```

Giữ danh tính Git cá nhân. Nếu chưa có quyền push, báo Hải hoặc gửi PR từ fork; không dùng tài khoản Git của người khác.

### 2. Đọc file nào trước và prompt gì?

1. [AGENTS.md](../../AGENTS.md).
2. [Bảng phân công](PHAN_CONG_MINI_PROJECT.md) và `docs/tasks/MW-TEAM-0x/TASK.md` của mình.
3. [Kiến trúc](../KIEN_TRUC_MAJORWEAVE.md), [contracts](../../src/domain/contracts.ts).
4. [Chuẩn biên soạn nội dung](../architecture/HUONG_DAN_DU_LIEU.md) và [mẫu Backend](../../src/content/paths/backend.ts).

Antigravity hỗ trợ `AGENTS.md` làm luật theo thư mục. Vẫn yêu cầu AI đọc và tóm tắt để kiểm tra đúng phạm vi trên máy của mình; không chép một bộ luật khác dễ lệch. [Google Antigravity — Rules](https://www.antigravity.google/docs/rules/).

```text
Tôi phụ trách MW-TEAM-0x trong MajorWeave.
Đọc AGENTS.md, docs/team/PHAN_CONG_MINI_PROJECT.md,
docs/KIEN_TRUC_MAJORWEAVE.md và docs/tasks/MW-TEAM-0x/TASK.md.
Đọc code liên quan rồi tóm tắt chức năng, mọi track được giao,
allowlist, dependency và tiêu chí nghiệm thu.
Giữ sidebar/style cũ, contracts chung và chế độ không đăng nhập.
Trước hết hoàn thiện story, FLOW.md và test case từ mẫu trong docs/templates.
Lập kế hoạch ngắn; làm phần độc lập trước khi context/API chung sẵn sàng.
Chỉ sửa trong allowlist; ghi đề xuất nếu cần thay file/hợp đồng chung.
Không giảm phạm vi, không báo Done cho placeholder hoặc module chưa tích hợp.
Chạy kiểm tra liên quan, check/build, ghi actual/bằng chứng/AI log thật.
```

Thay `0x` bằng `01`…`05`. Đọc lại bản tóm tắt của AI trước khi cho sửa code. Khi bắt đầu phần nhỏ tiếp theo, nêu một mục cụ thể trong task cùng acceptance; không dùng prompt chung “làm hết website”.

### 3. Làm source/credential và test thế nào?

- Bắt đầu từ chủ đề của roadmap/khung nghề và nguồn chính thức. Mở link nhà cung cấp, xem nội dung/điều kiện/phí rồi ghi ngày kiểm tra; AI đưa link chưa phải bằng chứng nguồn hợp lệ.
- Mỗi nhánh có bài thực hành đúng công cụ/ngôn ngữ, phút ước lượng và tiêu chí quan sát được. Chủ đề nền tảng giống thật sự dùng chung ID; bài khác ngôn ngữ giữ ID riêng.
- Chứng nhận khóa học khác chứng chỉ kỳ thi; không dùng một chứng chỉ cho mọi nhánh hoặc bịa chứng chỉ khi chưa tìm được. Ghi lý do khảo sát và portfolio nếu không có mục tiêu phù hợp.
- Copy mẫu [FLOW](../templates/FLOW.md) và [QA/AI log](../templates/QA_AI_LOG.md) vào thư mục task. Người làm tự hoàn thiện, không chỉ đổi tiêu đề.

| Kiểm tra | Làm thực tế |
|---|---|
| Nội dung | ID/tiên quyết/source bằng check + mở link + kiểm tra từng track sau tích hợp |
| Planner | Input/clock/ID cố định, kiểm tra tổng phút, quỹ tuần, bài dài, thiếu tiên quyết, tạo lại |
| Progress/activity | Done/undo, dời việc, snapshot tuần, không đếm trùng completion, ngày thực |
| Storage/import | Profile/DB thử riêng, reload, hai tab conflict, lỗi lưu, dữ liệu cũ, file hỏng/trùng và hủy |
| UI | Luồng chính/lỗi/rỗng/hủy, bàn phím/mobile, reload, ảnh/log tương ứng SHA |

Build/check qua không thay các lượt thử trên. Pack chưa đăng ký chưa được check chung bao phủ; script task phải kiểm tra pack cùng dependency và chạy lại sau Hải ghép registry. Test chưa chạy ghi **Chưa chạy**.

### 4. Nộp PR và tránh conflict

1. Thay đổi nhỏ, chỉ stage các file thuộc task; đọc diff và giữ danh tính Git cá nhân.
2. Chạy `npm run check`, `npm run build` và kiểm thử liên quan; cập nhật `QA_AI_LOG.md`.
3. Commit có mã task, push branch cá nhân; mở PR vào main theo mẫu có sẵn.
4. Ghi phần đã làm, dependency, phần chưa tích hợp và cách thử. Người review chéo xem trước, Hải review/merge cuối.
5. Sau merge, cập nhật main/branch khi working tree sạch; kiểm tra lại tính năng trên app chính.

File chung như CSS/components/app/context/contracts/registry/package/check/CI do Hải phối hợp. Cần thay đổi thì ghi yêu cầu + tác động/test vào TASK.md. Không xóa dữ liệu hoặc bỏ assertion để né lỗi; conflict phải đọc hai phía và phối hợp chủ sở hữu.

### 5. Có cần cài skill không?

**Để bắt đầu: không cần skill bổ sung.** Đây là quyết định của nhóm dựa trên bộ luật, template và công cụ đã có trong repo.

| Loại | Ví dụ | Hiểu để dùng đúng |
|---|---|---|
| Rule | `AGENTS.md` | Quy tắc của dự án, áp dụng xuyên suốt |
| Skill | Thư mục có `SKILL.md` | Hướng dẫn chuyên biệt cho một loại việc; [Agent skills](https://www.antigravity.google/docs/skills/) |
| MCP | Kết nối tới công cụ/dữ liệu bên ngoài | Cho AI đọc hoặc thao tác qua server; [MCP](https://www.antigravity.google/docs/mcp/) |
| Plugin | Gói mở rộng | Có thể đóng gói nhiều skill/MCP/cấu hình; [Plugins](https://www.antigravity.google/docs/plugins/) |

**Lựa chọn cho nhóm:**

| Skill | Ai cần / khi nào | Đề xuất |
|---|---|---|
| [diagram-design](https://github.com/cathrynlavery/diagram-design) | Hải hoặc bạn cần sơ đồ flow/sequence trình bày theo style chung | Tùy chọn ưu tiên; Mermaid trong `FLOW.md` vẫn đủ để review |
| [archify](https://github.com/tt-a1i/archify) | Cần sơ đồ kiến trúc/workflow HTML có thể khám phá | Lựa chọn thay cho diagram-design; chọn một công cụ phù hợp |
| [ponytail](https://github.com/DietrichGebert/ponytail) | Muốn nhắc AI tái dùng code, tránh dependency/boilerplate thừa | Tùy chọn, ưu tiên mức lite; task/AGENTS vẫn quyết định phạm vi đầy đủ |
| huashu-design / skill dựng lại UI | Khi có một yêu cầu thiết kế riêng được Hải giao | Chưa cần cho đợt triển khai theo style đã chọn |

Skill đã có trong Codex trên máy Hải không tự có trong Antigravity hoặc máy của các bạn. Theo tài liệu Antigravity, skill dự án nằm ở `.agents/skills/<tên>/`; phải giữ cả bundle cần thiết, không chỉ một file SKILL.md. Kiểm tra danh sách skill được nhận trong Customizations. [Vị trí skill của Antigravity](https://www.antigravity.google/docs/skills/).

**Nếu cá nhân muốn cài một skill:** có thể dùng CLI `skills`, chọn Antigravity và phạm vi global để không tự thêm file vào repo chung. CLI có các cờ `--skill`, `--agent`, `--global`, `--copy`; đây là hướng dẫn dựa trên tài liệu, chưa phải kết quả cài trên năm máy. [Vercel — skills CLI](https://github.com/vercel-labs/skills).

Ví dụ cài diagram-design; hai lệnh sau là lựa chọn khác, không yêu cầu chạy cả ba:

```powershell
npx skills add cathrynlavery/diagram-design --skill diagram-design --agent antigravity --global --copy
```

```powershell
npx skills add tt-a1i/archify --skill archify --agent antigravity --global --copy
```

```powershell
npx skills add DietrichGebert/ponytail --skill ponytail --agent antigravity --global --copy
```

Xem README/yêu cầu runtime của skill đã chọn; mở phiên AI mới và kiểm tra skill có được nhận. Phần render/kiểm tra của từng skill có thể cần công cụ bổ sung; không gọi cài thành công chỉ vì đã tải một file. Nếu chưa nhận, vẫn bắt đầu bằng AGENTS/task và mô tả luồng Markdown. Skill trình bày không được tự đổi UI hoặc cắt yêu cầu để đơn giản hóa.

Không cần cài MCP GitHub/Notion để làm task này: Git + PR và tài liệu trong repo đáp ứng quy trình hiện tại. Mọi cập nhật Notion vẫn chờ chỉ đạo của Hải.

## C. Checklist chốt cuối buổi

### Hải chốt

- [ ] Danh mục/nhánh còn đề xuất trong bảng phạm vi; ghi quyết định thật.
- [ ] Mỗi bạn đã nhận đúng task/allowlist, chạy repo hoặc báo lỗi cụ thể.
- [ ] Export/callback và ID dùng chung; phần UI bổ sung được duyệt trên sidebar cũ.
- [ ] PR nền ưu tiên và dependency; phần nào làm độc lập ngay.
- [ ] Inventory/ước lượng ngày 05/10, mốc tích hợp và cách báo vướng.
- [ ] Một bài nhỏ so sánh hai công cụ AI theo kế hoạch nhóm; chọn công cụ và ghi bằng chứng thực.

### Mỗi bạn gửi trước mốc 05/10

```text
Tên / Task:
Máy đã chạy repo: Có / Chưa; lỗi cụ thể nếu có
Phạm vi chức năng và mọi track mình hiểu:
Story / luồng / test đã soạn:
Inventory chặng, bài, nguồn cần kiểm tra:
API / ID / file chung cần phối hợp:
PR nhỏ đầu tiên dự kiến gồm gì:
Ước lượng và phần cần hỗ trợ:
```

Đây là tài liệu hướng dẫn buổi họp, không phải biên bản xác nhận đã cài công cụ, duyệt scope, chạy test hoặc nhận việc. Kết quả thật được từng bạn ghi vào task và PR.
