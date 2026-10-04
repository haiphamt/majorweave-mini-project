# MajorWeave — Prototype

Mini Project môn **Phát triển ứng dụng web — IS207.R11**, nhóm **PHP Is Awesome**.

- [Project Hub chung trên Notion](https://app.notion.com/p/3ee533490aed81719583de1253e9cb2d)
- [Board Mini Project — MajorWeave](https://app.notion.com/p/3ee533490aed81f7ab5eee549942f2c3)
- [Repository đồ án chính](https://github.com/haiphamt/is207-main-project)
- Hạn nộp mini: **12/10/2026**. Bản hiện tại là prototype, URL demo online sẽ cập nhật sau triển khai.

## Bản đang dùng — giao diện có sidebar

**Mở bản đã chọn:** http://127.0.0.1:5173/#/explore sau khi chạy `npm run dev`. Hải yêu cầu dùng lại bản cũ có sidebar ngày 04/10/2026; đây là nền giao diện cho phần triển khai tiếp theo.

[Kiến trúc triển khai — bước 3, nền cho bộ khung](docs/KIEN_TRUC_MAJORWEAVE.md): mô hình chung cho mọi hướng, nhiều kế hoạch, lưu trên thiết bị, lịch sử và xuất/nhập. [Hợp đồng dữ liệu chuẩn](src/domain/contracts.ts), [hướng dẫn biên soạn](docs/architecture/HUONG_DAN_DU_LIEU.md) và [mẫu ba nhánh Backend](src/content/paths/backend.ts).

**Bước 4 — đã bàn giao:** [bộ khung và ranh giới file](docs/BUOC_4_BO_KHUNG_VA_QUY_TAC.md), [luật chung cho AI](AGENTS.md), [quy trình Antigravity](docs/team/QUY_TRINH_ANTIGRAVITY.md) và [mẫu task](docs/templates/TASK.md). Các trang đã tách thành module; v2/IndexedDB chưa tích hợp.

**Bước 5 — đã lập phân công theo yêu cầu của Hải:** [bảng phân công mini](docs/team/PHAN_CONG_MINI_PROJECT.md) có năm task cá nhân, allowlist, nội dung toàn danh mục, dependency, AC, luồng/test phải viết và mốc tới 12/10. Chưa triển khai code của các task hoặc ghi kết quả kiểm thử thay thành viên.

**Quyết định mới:** làm chế độ không đăng nhập trước; Profile là hồ sơ học tập trên thiết bị. Tài khoản/Google login là giai đoạn sau, chưa chọn backend/nhà cung cấp. Kiến trúc đề xuất IndexedDB và file sao lưu; bản chạy hiện tại vẫn giữ localStorage và chưa được chuyển cấu trúc.

Prototype 02 được giữ để đối chiếu lịch sử, không phải giao diện nền đang được chọn: [tài liệu thử nghiệm](docs/PROTOTYPE_02.md). Nội dung mẫu 18 hướng / 50 cấu hình trong đó chưa phải thư viện học hoàn chỉnh. Phạm vi hoàn thiện mọi hướng được duyệt vẫn giữ nguyên.

## Phạm vi đích

[Bảng phạm vi MajorWeave — 04/10/2026](docs/PHAM_VI_MAJORWEAVE.md) đề xuất đầy đủ ngành → hướng → nhánh, chức năng và tiêu chí nghiệm thu. Bản này có 18 hướng và 50 cấu hình kế hoạch đề xuất; Backend ba stack và việc thêm BA đã được xác nhận, các nhánh còn lại chờ duyệt.

Danh mục 16 hướng và hành trình Backend mô tả phía dưới là **bản đang chạy ở trang gốc**, có giao diện Hải đã chọn lại. Phân công mới dưới đây bao phủ bảng đích 18 hướng/50 cấu hình, không phải bằng chứng đã hoàn thiện nội dung của từng hướng.

## Nhóm thực hiện

| Thành viên | Phân công triển khai mini hiện tại |
|---|---|
| Phạm Tuấn Hải | Kiến trúc, thiết kế/style, context/registry, tích hợp PR, nghiệm thu và demo |
| [Nguyễn Thị Quỳnh Hân — MW-TEAM-01](docs/tasks/MW-TEAM-01/TASK.md) | Explore/Path detail, resolver; Backend, Frontend, Full-stack, UX |
| [Phạm Công Định — MW-TEAM-02](docs/tasks/MW-TEAM-02/TASK.md) | My roadmap, planner/tạo lại; Mobile, Game |
| [Chung Minh Hiếu — MW-TEAM-03](docs/tasks/MW-TEAM-03/TASK.md) | My plan, task/progress/tuần chốt; DS, ML, MLOps, AI Engineer |
| [Lê Nguyễn Hữu Hiếu — MW-TEAM-04](docs/tasks/MW-TEAM-04/TASK.md) | Profile, activity/validation; Data Analyst, BI, Data Engineer, BA |
| [Triệu Quang Huy — MW-TEAM-05](docs/tasks/MW-TEAM-05/TASK.md) | IndexedDB/migration/backup; DevOps/SRE, Network, Security, QA |

Phân công là kế hoạch; đóng góp thực tế ghi bằng commit/PR cá nhân, story/flow/test/AI log và review trong repo. Dùng mã `MW-TEAM-01` đến `MW-TEAM-05` cho đợt này. Mục còn đề xuất trong bảng phạm vi cần Hải chốt đầu buổi; gói phân công không tự biến fixture thành nội dung đã duyệt.

Bản thử một hành trình hoàn chỉnh: chọn ngành → khám phá Backend và chọn Node.js, Python hoặc Java → chọn nguồn học → chỉnh roadmap → tạo kế hoạch tuần → theo dõi tiến độ.

## Chạy trên máy

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```powershell
npm ci
npm run dev
```

Mở địa chỉ mà máy chủ hiển thị, mặc định `http://127.0.0.1:5173`.

```powershell
npm run build
npm run check
npm run preview
```

## Thử hành trình

1. Ở Explore, chọn khoa Công nghệ Phần mềm và ngành Kỹ thuật Phần mềm. Có thể chọn khoa khác ở bộ lọc khám phá.
2. Chọn Backend Developer và chọn một trong ba nhánh. Mở roadmap.sh Backend / ngôn ngữ ở tab mới. Đặt nền tảng, ngôn ngữ tài liệu và ưu tiên miễn phí.
3. Bấm chặng nền tảng hoặc framework tương ứng, xem tài nguyên, chọn nguồn rồi đóng bảng. Có thể chọn thêm hoặc bỏ chặng.
4. Mở My roadmap. Đánh dấu ngôn ngữ đang chọn đã biết nếu đúng với nền tảng của mình, giữ các chặng muốn học, chọn nguồn, chỉnh mục tiêu, số giờ và ngày bắt đầu.
5. Tạo kế hoạch. Đánh dấu một việc đã hoàn thành, sửa việc khác, thêm ghi chú hoặc chuyển sang tuần tiếp theo.
6. Mở Profile để sửa tên / ngành và xem nhịp học. Tải lại và kiểm tra lựa chọn, kế hoạch, tiến độ còn được giữ.

## Luồng sự kiện để trình bày

Mở `http://127.0.0.1:5173/events.html` hoặc bấm “Luồng sự kiện minh họa” ở chân trang.

- 28 luồng chức năng EF01–EF28, mỗi luồng có sơ đồ riêng, điều kiện, sự kiện bắt đầu, phản hồi và nhánh thay thế / lỗi.
- Hai sơ đồ tổng hợp giúp nhìn toàn hành trình và liên hệ tạo lịch với xác nhận tạo lại.
- Bao gồm chọn ngành, khám phá khoa khác, tìm hướng, mở chi tiết, chọn nguồn, chỉnh roadmap, tạo / tạo lại lịch, chuyển tuần, mở tài liệu, hoàn thành, sửa / chuyển việc, thêm việc, chứng nhận và lưu / khôi phục dữ liệu.
- `docs/Luong_su_kien_chi_tiet.md` là bản mô tả để nhóm kiểm tra.

Tình huống mẫu 5 giờ/tuần là lịch tự học của sinh viên, không phải lịch làm đồ án của nhóm.

## Danh mục ngành để kiểm tra

Mở `http://127.0.0.1:5173/catalog.html` để xem đầy đủ 12 ngành với 16 hướng, hoặc mở bảng ngay ở Explore.

- `src/catalog.ts`: nguồn dữ liệu ngành, hướng, nền tảng, quan hệ gần / mở rộng và link roadmap.sh đã đối chiếu. Chỉ giữ 16 hướng có roadmap chính thức; Thiết kế Vi mạch có thông báo thiếu phạm vi phù hợp.
- `docs/Danh_muc_nganh_huong_hoc.md`: bản đọc và kiểm tra cùng nhóm.
- `public/catalog.json`: dữ liệu danh mục, có ngày đối chiếu và liên kết nguồn UIT.
- Nhãn liên hệ là đề xuất của nhóm dựa trên nền tảng, không phải kết quả xác định một sinh viên hợp nghề nào. Mọi hướng vẫn có thể khám phá.
- Backend có roadmap và kế hoạch hoàn chỉnh; 15 hướng còn lại đang có tổng quan để kiểm tra và bổ sung nội dung sau.

Khi build, hai tài liệu công khai và bản Markdown được tạo lại từ dữ liệu nguồn. Sửa `src/catalog.ts` hoặc `scripts/event-flows.cjs` để cập nhật; tránh sửa riêng bản tài liệu sinh tự động.

## Mức độ tham chiếu Beaver Plans

Đối chiếu giao diện công khai ngày 02/10/2026: dùng cùng nền kem `#f4f1ea`, giấy `#fbfaf6`, chữ `#1c1a17`, điểm nhấn `#a74127`, font Be Vietnam Pro và JetBrains Mono. Newsreader dùng cho tiêu đề riêng của MajorWeave. My Plan đã thu gọn tiêu đề để ưu tiên công việc theo tuần. Bố cục MajorWeave còn có thanh điều hướng bên trái và các màn hình khám phá hướng học; chưa phải bản sao giao diện Beaver Plans.

## Phạm vi

- 5 trang, 6 khoa, 12 ngành gốc, 16 hướng để xem tổng quan; có tìm kiếm, lọc nhóm và bảng ngành → hướng học.
- Backend có ba nhánh kế hoạch: Node.js / Express, Python / FastAPI, Java / Spring Boot. Mỗi nhánh có 15 chặng (System Design chọn thêm); 40 tài nguyên và 8 mục tiêu chứng nhận trong toàn bộ danh mục, hiển thị theo nhánh phù hợp.
- Nguồn học mở trên trang của đơn vị cung cấp. Người dùng tự đánh dấu việc đã học.
- Profile có hồ sơ học tập và bảng hoạt động 12 tuần, dựa trên ngày đánh dấu hoàn thành. Việc cũ chưa có ngày vẫn giữ tiến độ, không suy đoán ngày cho biểu đồ. Bỏ dấu hoàn thành cập nhật số việc; chuyển tuần giữ ngày đã ghi nhận. Biểu đồ tính các việc được giữ trong kế hoạch hiện tại. My Plan có tiến độ từng tuần và liên kết sang Profile.
- Thời gian là ước lượng cho bài thực hành của một dự án nhỏ, không phải thời gian cam kết để thành Backend Developer.
- Chứng nhận được lưu làm mục tiêu bổ trợ; ứng dụng không cấp hoặc xác minh chứng nhận.
- Dữ liệu lưu ở localStorage của trình duyệt, chưa đồng bộ giữa các thiết bị. Bản thử không yêu cầu tài khoản.
- Ngôn ngữ tài liệu Việt/Anh độc lập với ngôn ngữ lập trình. Thay trình độ cập nhật các chặng đã biết theo nhánh đang chọn; người dùng có thể sửa lại từng chặng.
- Thay nhánh / roadmap / mục tiêu / quỹ giờ / ngày bắt đầu không đổi nhãn và lịch của plan đang học. Plan lưu bộ thông tin tại lúc tạo; chỉ thay khi người dùng xác nhận tạo lại; hộp thoại giải thích các dữ liệu được giữ/thay.
- Ngành hiện tại ưu tiên gợi ý để khám phá, không giới hạn các hướng học. Các chương trình tiếng Anh, tài năng, Việt–Nhật được gộp về ngành gốc theo yêu cầu của nhóm.

- Bản cũ giữ lựa chọn và kế hoạch Node.js khi tải lại. Có nút bổ sung năm chặng nền tảng còn thiếu, không tự sửa lịch cũ.
- Tạo lại giữ hoàn thành, ngày và ghi chú của bài vẫn có cùng định danh; bài thực hành OOP, SQL, xác thực và triển khai theo nhánh khác được tạo mới.
- Đăng nhập Google mới ở mức đề xuất, xem `docs/Google_Login_Profile.md`; chưa cấu hình OAuth hoặc lưu kế hoạch trên server.

## Cấu trúc

- `src/data.ts`: danh mục ngành, hướng học, chặng, tài nguyên, chứng nhận. Nội dung tóm tắt được biên soạn riêng, có liên kết nguồn.
- `src/state.ts`: lưu/đọc lựa chọn và thuật toán phân chia công việc theo quỹ thời gian tuần.
- `src/main.tsx`, `src/app/`: entry, sidebar, routes và context v1 đang dùng.
- `src/features/`: năm trang và tương tác riêng.
- `src/components/`: UI dùng chung, bộ chọn stack và nhịp học.
- `src/domain/contracts.ts`, `src/content/`: hợp đồng/gói nội dung v2 chuẩn, chưa nối UI.
- `src/persistence/legacy.ts`: ghi v1; đọc v1 còn ở `state.ts`. IndexedDB chưa triển khai.
- `src/styles.css`: giao diện giấy màu kem, điểm nhấn màu gạch, responsive.
- `scripts/verify.cjs`: kiểm tra hành trình, lưu dữ liệu, chỉnh/chuyển việc, nguồn học và bố cục.

## Kiểm tra

Build: `npm run build`. Các kiểm tra trình duyệt nằm tại `scripts/verify.cjs`, `scripts/verify-stacks.cjs`, `scripts/verify-catalog.cjs`, `scripts/verify-activity.cjs`; đặt `MAJORWEAVE_PLAYWRIGHT_MODULE` nếu dùng Playwright từ runtime riêng. Báo cáo và ảnh lưu tại `artifacts/`.

`npm run check` kiểm tra gói nội dung đã đăng ký, nguồn/tiên quyết, ranh giới module và vòng import. GitHub workflow chạy check/build; chưa cấu hình branch protection/CODEOWNERS. [Luồng mẫu](docs/templates/FLOW.md), [test case và AI log mẫu](docs/templates/QA_AI_LOG.md). Nội dung mẫu chưa đồng nghĩa nghiệm thu mọi hướng.

## Nguồn tham khảo

Danh mục ban đầu đối chiếu 02/10/2026, nguồn nền tảng và nhánh mới bổ sung **03/10/2026**, danh mục chi tiết nằm trong `src/data.ts`.

- [UIT — ngành đào tạo](https://tuyensinh.uit.edu.vn/nganh-dao-tao/)
- [Beaver Plans](https://beaverplans.com/) — cảm hứng màu sắc, typography và kế hoạch theo tuần; giao diện được viết riêng.
- [roadmap.sh](https://roadmap.sh/backend) — tham khảo tương tác theo chủ đề, liên kết đọc thêm; không nhập hoặc đăng lại sơ đồ/nội dung của họ.
- F8, freeCodeCamp, W3Schools, The Odin Project, MDN, Node.js Learn, Full Stack Open, Git, PostgreSQL, MongoDB University, PortSwigger, Docker, AWS, Boot.dev, Exercism; bổ sung MIT OpenCourseWare, Stanford CS144, OSTEP, Python, FastAPI, pytest và Spring. Java MOOC là khóa legacy; nguồn ghi rõ trạng thái đó.

Phí, phiên bản chứng chỉ và điều kiện chương trình có thể thay đổi; mỗi thẻ liên kết đến trang chính thức để kiểm tra.
