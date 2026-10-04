# MajorWeave — Bảng phạm vi để nhóm trưởng duyệt

**Phiên bản:** 0.3 · **Ngày đối chiếu:** 04/10/2026 · **Hạn nộp:** 12/10/2026.

**Điều chỉnh mới nhất:** Hải chọn lại giao diện cũ có sidebar và yêu cầu làm không đăng nhập trước. Profile hiện là hồ sơ học tập cục bộ; tài khoản/Google login ở giai đoạn sau, chưa chọn nhà cung cấp. Giữ nhiều kế hoạch và phạm vi mọi hướng được duyệt. Kiến trúc đề xuất để kiểm tra nằm tại [KIEN_TRUC_MAJORWEAVE.md](KIEN_TRUC_MAJORWEAVE.md); chưa chuyển đổi code đang chạy.

**Trạng thái:** Đã soạn để Hải kiểm tra. Đây là phạm vi đích đề xuất; chưa phải danh sách tính năng đã triển khai hoặc bản đã được Hải duyệt toàn bộ.

**Phụ trách phần chuẩn bị:** Phạm Tuấn Hải — nhóm trưởng, kiến trúc, prototype, thiết kế giao diện và duyệt đầu ra. Phân công triển khai cho năm thành viên còn lại sẽ được lập sau khi duyệt phạm vi và kiến trúc.

## 1. Đọc nhanh

| Nội dung | Phạm vi đích trong bản này |
|---|---|
| Tên | MajorWeave — khám phá hướng IT và xây kế hoạch tự học |
| Đối tượng | Sinh viên muốn tìm hiểu hướng nghề từ ngành đang học hoặc khám phá hướng thuộc khoa khác |
| Danh mục ngành | 6 khoa, 12 ngành gốc; chương trình tiếng Anh, tài năng, Việt–Nhật gộp về ngành gốc |
| Cách trình bày KTMT | Nhóm khám phá **Kỹ thuật Máy tính / Thiết kế Vi mạch**; giữ hai ngành gốc trong hồ sơ |
| Hướng | 18 hướng: 16 hướng hiện có + AI Engineer được đề xuất thêm + Business Analyst đã được Hải đồng ý bổ sung |
| Nhánh/kết hợp | 50 cấu hình kế hoạch đề xuất, trong đó Full-stack có 9 kết hợp từ 3 nhánh Frontend × 3 nhánh Backend |
| Mức hoàn thành | Mỗi hướng và mỗi nhánh được duyệt đều có nền tảng, các chặng học, nguồn học, bài thực hành, mục tiêu bổ trợ và kế hoạch sử dụng được |
| Số trang chính | 5: Explore, Path detail, My roadmap, My plan, Profile |
| Giao diện | Kế thừa phong cách prototype hiện có, lấy cảm hứng từ BeaverPlans; chi tiết và các trạng thái sẽ được duyệt ở phần prototype |
| Tình trạng repo | Prototype 01: giao diện sidebar được chọn, 16 hướng, Backend ba stack. Prototype 02: thử nghiệm lịch sử với 18 hướng / 50 cấu hình mẫu; nội dung ngoài Backend chưa hoàn chỉnh |

**Cách đọc:** Duyệt bảng ngành ở mục 3, các nhánh ở mục 4, chức năng ở mục 7 và tiêu chí hoàn thành ở mục 8. Các mục sau giúp kiểm tra khối lượng và chuẩn bị bước tiếp theo.

## 2. Những quyết định đã nhận từ Hải

1. Triển khai đầy đủ mọi hướng nằm trong danh mục được duyệt trên toàn bộ 12 ngành, thay vì chỉ làm hoàn chỉnh Backend.
2. Một hướng có thể liên quan nhiều ngành. Dùng chung nội dung của hướng đó; bổ sung ghi chú nền tảng khi sinh viên khám phá từ ngành khác.
3. Sinh viên chọn ngành đang theo học rồi được khám phá mọi hướng, kể cả hướng thuộc khoa khác. Ngành học không khóa lựa chọn.
4. Backend có ba kế hoạch: **Node.js / Express, Python / FastAPI, Java / Spring Boot**.
5. Frontend học HTML → CSS → JavaScript trước khi chọn nhánh. Vite là công cụ phát triển/build, không phải lựa chọn thay thế React, Angular hoặc Vue. [Tài liệu Vite](https://vite.dev/guide/).
6. Phần khám phá **Kỹ thuật Máy tính / Thiết kế Vi mạch** chỉ lấy các hướng liên quan có roadmap chính thức trên roadmap.sh. Không đưa các lộ trình VLSI, RTL, FPGA, Physical Design hoặc Embedded riêng vào bản này.
7. Bổ sung **Business Analyst** từ nguồn khác roadmap.sh. Không bổ sung SEO/MarTech và Multimedia Design theo trả lời ngày 04/10/2026.
8. Sáu thành viên: Hải chuẩn bị kiến trúc, prototype, thiết kế và duyệt cuối; năm bạn còn lại thực hiện chính. Mỗi bạn sẽ viết user story, luồng chi tiết, test case và ghi bằng chứng kiểm thử cho phần mình.
9. Hoàn thành từng phần rồi Hải kiểm tra trước khi bắt đầu phần mới. Sau bảng phạm vi, Hải đã yêu cầu tiếp tục prototype; không cập nhật Notion.
10. Quyết định ban đầu: **có Google login/đồng bộ; vẫn cho khách khám phá**. Điều chỉnh sau trong ngày 04/10/2026: **làm không đăng nhập trước**, giữ tài khoản/Google login cho giai đoạn sau; chưa chọn backend hoặc dịch vụ xác thực. Nút tài khoản thử nghiệm của Prototype 02 không phải tính năng đăng nhập đã chạy.
11. **Giữ nhiều kế hoạch, chọn một kế hoạch đang xem**, xác nhận ngày 04/10/2026. Prototype 02 cho thử bằng dữ liệu lưu trên trình duyệt.
12. Hải yêu cầu **“Dùng bản cũ đi”** và cho tiếp tục bước sau. Giữ sidebar/style bản cũ; Prototype 02 được lưu để đối chiếu, không coi điều hướng ngang đã được duyệt.

**Phạm vi được giới hạn bằng danh mục cụ thể dưới đây.** “Đầy đủ” nghĩa là hoàn thiện tất cả hướng/nhánh trong danh mục đã duyệt. Không tuyên bố 18 hướng này là toàn bộ nghề nghiệp IT hoặc toàn bộ đầu ra của 12 ngành. Chẳng hạn Truyền thông Đa phương tiện còn có các hướng sáng tạo/truyền thông ngoài phạm vi đã chọn. [Thông tin ngành tại UIT](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-truyen-thong-da-phuong-tien).

## 3. Ngành → hướng khám phá

### 3.1. Quy tắc quan hệ

- **Gần nền tảng:** có nhiều kiến thức chung với ngành; cần kiểm tra kỹ năng thực tế của sinh viên trước khi bỏ chặng học.
- **Mở rộng:** có thể theo nhưng cần bổ sung nền tảng. Nhãn này phải đi kèm các kiến thức cần học thêm.
- Quan hệ dưới đây là **đề xuất biên soạn của nhóm**, suy luận từ thông tin ngành tại UIT. Không phải phân loại nghề chính thức của trường hoặc kết luận về khả năng của một sinh viên.
- Sinh viên không thấy hướng mình muốn trong danh sách ưu tiên vẫn mở được danh mục tất cả hướng.
- Không tự đánh dấu “đã biết” chỉ vì chọn một ngành. Người dùng chủ động xác nhận hoặc sửa lựa chọn nền tảng.

### 3.2. Bảng bao phủ 12 ngành

Dùng mã hướng ở mục 4 để bảng ngắn và dễ kiểm tra. Cột mở rộng là gợi ý ưu tiên, không giới hạn quyền khám phá.

| Khoa | Ngành gốc / mã hiện tại | Gần nền tảng | Mở rộng ưu tiên | Nền tảng cần lưu ý |
|---|---|---|---|---|
| Công nghệ Phần mềm | [Kỹ thuật Phần mềm](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-ky-thuat-phan-mem) · `software` | BE, FE, FS, MOB, GAME, QA, DEV | BA, AIE, DA, DE, ML, MLOPS, NET, SEC, UX | Dữ liệu/AI cần bổ sung thống kê và toán; hạ tầng cần Linux, mạng và vận hành |
| Công nghệ Phần mềm | [Truyền thông Đa phương tiện](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-truyen-thong-da-phuong-tien) · `multimedia` | UX, DA | FE, GAME, MOB, BI, DS, ML, AIE | Hướng lập trình cần nền tảng code; AI/dữ liệu cần toán, thống kê và đánh giá kết quả. GAME ở đây là lập trình game, không thay cho ngành nghề đồ họa game |
| Khoa học Máy tính | [Khoa học Máy tính](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-khoa-hoc-may-tinh) · `cs` | BE, FE, FS, MOB, GAME, DS, DE, ML, MLOPS, AIE | QA, DEV, DA, BI, NET, SEC, BA | Hướng nghiệp vụ cần khảo sát yêu cầu, quy trình và bối cảnh tổ chức |
| Khoa học Máy tính | [Trí tuệ Nhân tạo](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-tri-tue-nhan-tao) · `ai` | ML, DS, MLOPS, AIE | BE, FS, GAME, DEV, DA, DE | Triển khai sản phẩm cần API, dữ liệu, kiểm thử, bảo mật và vận hành |
| Hệ thống Thông tin | [Hệ thống Thông tin](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-he-thong-thong-tin) · `is` | BA, DA, BI, DE, BE, FS, QA | FE, MOB, DEV, DS, ML, AIE, SEC, UX | Phân biệt phân tích nghiệp vụ, phân tích dữ liệu và phát triển phần mềm; không gộp BA với DA |
| Hệ thống Thông tin | [Thương mại Điện tử](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-thuong-mai-dien-tu) · `ecommerce` | BA, DA, BI | BE, FE, FS, MOB, QA, DE, DS, UX, AIE | Chọn hướng kỹ thuật cần bổ sung lập trình, dữ liệu hoặc web; không coi nghiệp vụ TMĐT là đủ để bỏ các chặng kỹ thuật |
| Khoa học & Kỹ thuật Thông tin | [Công nghệ Thông tin](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-cong-nghe-thong-tin) · `it` | BE, FE, FS, MOB, QA, DEV, DA, BI, DE, NET, BA | GAME, DS, ML, MLOPS, AIE, SEC, UX | Nền tảng rộng nhưng cần chọn nhánh và tự xác nhận những kiến thức đã biết |
| Khoa học & Kỹ thuật Thông tin | [Khoa học Dữ liệu](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-khoa-hoc-du-lieu) · `data` | DA, BI, DS, DE, ML, MLOPS | BE, FS, DEV, AIE, BA | MLOps cần kỹ năng triển khai; BA cần khảo sát và quản lý yêu cầu, không chỉ SQL/dashboard |
| Mạng máy tính & Truyền thông | [Mạng máy tính & Truyền thông Dữ liệu](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-mang-may-tinh-truyen-thong-du-lieu) · `networks` | NET, DEV, SEC | BE, DE, MLOPS, AIE | Hướng dữ liệu/AI cần bổ sung xử lý dữ liệu và đánh giá mô hình; AI Engineer cần thêm API và đánh giá ứng dụng |
| Mạng máy tính & Truyền thông | [An toàn Thông tin](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-an-toan-thong-tin) · `security` | SEC, NET | DEV, BE, QA, AIE | DevSecOps học thêm CI/CD và container; AIE cần nền tảng xây ứng dụng và đánh giá AI |
| Kỹ thuật Máy tính | [Kỹ thuật Máy tính](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-ky-thuat-may-tinh) · `computer` | NET | BE, MOB, GAME, DEV, SEC, ML, MLOPS, AIE | Chỉ gợi ý hướng đã có roadmap tương ứng; không đổi tên ML thành Robotics hay đổi C++ thành lộ trình Embedded |
| Kỹ thuật Máy tính | [Thiết kế Vi mạch](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-thiet-ke-vi-mach) · `chip` | Không gán một hướng nghề vi mạch tương đương | Cùng nhóm khám phá KTMT: NET, BE, MOB, GAME, DEV, SEC, ML, MLOPS, AIE | Hiển thị rõ đây là khám phá hướng phần mềm/hạ tầng mở rộng; không mô tả các hướng này là lộ trình đào tạo vi mạch |

### 3.3. Cách gộp KTMT / Thiết kế Vi mạch

- Phần khám phá hiển thị nhóm **Kỹ thuật Máy tính / Thiết kế Vi mạch** theo yêu cầu.
- Hồ sơ vẫn lưu `computer` hoặc `chip` để không đổi ngành đang học của sinh viên.
- Hai ngành dùng chung danh sách hướng khám phá, nhưng giữ riêng lời giải thích nền tảng và quan hệ gần/mở rộng như bảng trên.
- Có liên kết thông tin ngành UIT. Chưa thấy roadmap nghề VLSI/Embedded riêng trong [danh mục chính thức roadmap.sh đã kiểm tra](https://roadmap.sh/roadmaps/); không gắn các lộ trình kỹ năng C/C++/Linux thành nghề vi mạch.
- Học C/C++, Linux, Computer Science có thể hỗ trợ nền tảng. Chúng không thay thế chương trình vi mạch/hệ thống nhúng tại UIT. [Nguồn KTMT](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-ky-thuat-may-tinh).

## 4. Hướng → nhánh lựa chọn

### 4.1. Cách tính và mức xác nhận

- **Ngành:** chương trình đang học. **Hướng:** mục tiêu nghề/kỹ năng nghề. **Nhánh:** cách thực hiện hoặc chuyên sâu của hướng.
- Một nhánh có thể là stack, nền tảng, công cụ hoặc trọng tâm nghiệp vụ. Không bắt mọi hướng phải chọn “ngôn ngữ lập trình”.
- Backend ba stack đã được Hải chọn. BA đã được Hải đồng ý bổ sung. AI Engineer, các nhánh còn lại và các quan hệ ngành là đề xuất trong bản này để Hải duyệt.
- Tên nhánh dưới đây do nhóm lựa chọn để triển khai; link roadmap hướng không có nghĩa roadmap.sh đã cung cấp nguyên bộ nhánh như trong bảng.
- Nhánh chưa được duyệt chưa đưa vào giao việc. Sau khi duyệt, tất cả nhánh được chọn phải dùng được từ Path detail tới My plan.

### 4.2. Danh mục 18 hướng và 50 cấu hình kế hoạch

Giữ ID của 16 hướng cũ để thuận tiện đối chiếu prototype. Mã viết tắt chỉ phục vụ đọc tài liệu.

| Mã / ID hướng | Hướng | Nhánh/kết hợp đề xuất | Số cấu hình | Roadmap / nguồn khung |
|---|---|---|---:|---|
| BE · `backend` | Backend Developer | JavaScript/TypeScript → Node.js + Express; Python → FastAPI; Java → Spring Boot | 3 | [Backend](https://roadmap.sh/backend), [Node.js](https://roadmap.sh/nodejs), [Python](https://roadmap.sh/python), [Java](https://roadmap.sh/java), [Spring Boot](https://roadmap.sh/spring-boot) |
| FE · `frontend` | Frontend Developer | React; Angular; Vue — sau nền tảng HTML/CSS/JavaScript, TypeScript theo nhánh | 3 | [Frontend](https://roadmap.sh/frontend), [React](https://roadmap.sh/react), [Angular](https://roadmap.sh/angular), [Vue](https://roadmap.sh/vue) |
| FS · `fullstack` | Full-stack Developer | Chọn một nhánh FE trong 3 nhánh × một nhánh BE trong 3 nhánh; dùng lại các chặng FE/BE rồi thêm tích hợp | 9 | [Full Stack](https://roadmap.sh/full-stack) + roadmap FE/BE tương ứng |
| MOB · `mobile` | Mobile Developer | Android/Kotlin; iOS/Swift; Flutter/Dart; React Native/TypeScript | 4 | [Android](https://roadmap.sh/android), [iOS](https://roadmap.sh/ios), [Flutter](https://roadmap.sh/flutter), [React Native](https://roadmap.sh/react-native) |
| GAME · `game` | Game Developer | Unity/C#; Unreal/C++ và Blueprint; Godot/GDScript | 3 | [Game Developer](https://roadmap.sh/game-developer) + [Unity](https://docs.unity3d.com/Manual/scripting.html), [Unreal](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine), [Godot](https://docs.godotengine.org/en/stable/getting_started/introduction/index.html) |
| QA · `qa` | QA / Test Automation | Manual QA; Web Automation/Playwright + TypeScript; API Testing/Postman + JavaScript | 3 | [QA](https://roadmap.sh/qa) |
| DEV · `devops` | DevOps / SRE | DevOps: Linux, CI/CD, Docker và triển khai AWS; SRE: thêm SLI/SLO, giám sát và xử lý sự cố sau nền tảng DevOps | 2 | [DevOps](https://roadmap.sh/devops) |
| DA · `analyst` | Data Analyst | SQL + bảng tính; SQL + Python/pandas | 2 | [Data Analyst](https://roadmap.sh/data-analyst) |
| BI · `bi` | BI Analyst | Power BI; Tableau — cùng SQL, mô hình dữ liệu và chỉ số nghiệp vụ | 2 | [BI Analyst](https://roadmap.sh/bi-analyst), [Power BI](https://roadmap.sh/power-bi) |
| DS · `scientist` | Data Scientist | Python — thống kê, thử nghiệm, mô hình và diễn giải | 1 | [AI and Data Scientist](https://roadmap.sh/ai-data-scientist) |
| DE · `engineer` | Data Engineer | Batch: Python, SQL, orchestration; Streaming: bổ sung Kafka và xử lý sự kiện sau nền tảng batch | 2 | [Data Engineer](https://roadmap.sh/data-engineer) |
| ML · `ml` | Machine Learning | Machine Learning cơ bản/scikit-learn; Computer Vision/PyTorch; NLP/PyTorch và Transformers | 3 | [Machine Learning](https://roadmap.sh/machine-learning) |
| MLOPS · `mlops` | MLOps Engineer | Model serving và monitoring; Pipeline, versioning và tự động hóa vòng đời mô hình | 2 | [MLOps](https://roadmap.sh/mlops) |
| NET · `network` | Network Engineer | Mạng và thực hành mô phỏng; Network Automation/Python sau nền tảng mạng | 2 | [Network Engineer](https://roadmap.sh/network-engineer) |
| SEC · `security` | Cyber Security | Defensive Security/SOC; Web Application Security/Pentesting; DevSecOps | 3 | [Cyber Security](https://roadmap.sh/cyber-security), [DevSecOps](https://roadmap.sh/devsecops) |
| UX · `ux` | UX Design | UX Research và interaction; UI/Product Design và design system | 2 | [UX Design](https://roadmap.sh/ux-design) |
| AIE · `ai-engineer` | AI Engineer | Ứng dụng LLM/RAG với Python; ứng dụng AI có tools/agent với Python sau nền tảng LLM và đánh giá | 2 | [AI Engineer](https://roadmap.sh/ai-engineer) |
| BA · `business-analyst` | Business Analyst | IT/Software BA: yêu cầu và quy trình; BA cho sản phẩm dữ liệu/BI: thêm yêu cầu báo cáo và đo giá trị | 2 | [IIBA — Business Analysis](https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/) |
| | **Tổng** | **18 hướng; 50 cấu hình, bao gồm 9 kết hợp Full-stack** | **50** | |

**50 cấu hình không phải 50 bộ nội dung chép riêng.** Full-stack ghép chặng đã có của FE/BE; DevOps/SRE, ML/CV/NLP và các nhánh khác chia sẻ phần nền tảng. Vẫn cần xác minh đầu ra và kế hoạch của từng cấu hình.

### 4.3. Ranh giới tránh nhầm lẫn

- JavaScript và TypeScript thuộc cùng nhánh Node/React thích hợp; không nhân đôi toàn bộ roadmap chỉ vì thêm TypeScript.
- React là thư viện UI; Angular và Vue là framework. Giao diện có thể dùng nhãn chung “Nhánh giao diện”. [React](https://react.dev/learn), [Angular](https://angular.dev/overview), [Vue](https://vuejs.org/guide/introduction.html).
- Vite nằm trong chặng công cụ của nhánh thích hợp; không có thẻ hướng nghề “Vite Developer”.
- Data Analyst làm phân tích dữ liệu; BI Analyst ưu tiên mô hình dữ liệu và báo cáo nghiệp vụ; BA ưu tiên nhu cầu, yêu cầu, quy trình và giá trị giải pháp. Cho phép liên kết giữa các hướng nhưng không dùng một roadmap giống hệt cho cả ba.
- Data Scientist/ML tập trung thống kê và mô hình; AI Engineer tập trung xây ứng dụng dùng AI, tích hợp và đánh giá. Sử dụng API AI không tự chứng minh năng lực huấn luyện ML.
- SRE, MLOps, streaming và nhánh agent có các chặng tiên quyết. Chọn nhánh không tự bỏ các chặng nền tảng.
- Với iOS hoặc công cụ/lab có yêu cầu môi trường riêng, thẻ nguồn/bài thực hành phải ghi điều kiện thiết bị. App MajorWeave không cần chạy các công cụ đó để lập kế hoạch.

## 5. Chuỗi chặng bắt buộc phải có nội dung

Đây là khung nội dung để kiểm tra bao phủ, chưa phải chi tiết khóa học đã nhập vào hệ thống. Khi biên soạn, mỗi nhóm chủ đề cần tách thành chặng có kết quả và công việc rõ ràng. Chặng mở rộng phải ghi điều kiện tiên quyết.

| Hướng | Nền tảng và chặng chung | Phần thay đổi theo nhánh | Đầu ra thực hành cuối |
|---|---|---|---|
| BE | Lập trình; OOP; DSA; Git; Computer Networking; OS/Linux; Computer Systems; HTTP; SQL; API; xác thực/phân quyền; kiểm thử; triển khai. System Design là mở rộng | Ngôn ngữ, runtime/build, framework, thư viện DB và cách test | API có CRUD, validation, dữ liệu lưu bền, quyền truy cập, test, tài liệu và đường dẫn thử |
| FE | Web/HTTP cơ bản; HTML ngữ nghĩa; CSS/layout/responsive; JavaScript/DOM/async; Git; accessibility; API; quản lý state; kiểm thử; hiệu năng; build/deploy | Component, routing, form, state và công cụ theo React/Angular/Vue; TypeScript theo nhu cầu nhánh | Giao diện responsive gọi API, có loading/empty/error, nhập liệu, kiểm thử và bản online |
| FS | Dùng lại nền tảng FE/BE; nối API và giao diện; auth; contract dữ liệu; cấu hình; test tích hợp; deploy | Kết hợp một FE với một BE; chặng tích hợp theo đúng hai lựa chọn | Ứng dụng hoàn chỉnh với giao diện, API, dữ liệu, quyền truy cập, test và hướng dẫn chạy |
| MOB | Ngôn ngữ; Git; UI; navigation; lifecycle; state; API; local storage; test; đóng gói | Android, iOS, Flutter hoặc React Native; cách build và công cụ riêng | App có ít nhất một luồng dữ liệu, trạng thái mạng/lỗi và bản chạy thử theo nền tảng |
| GAME | Ngôn ngữ/OOP; toán vector; Git; scene/entity; input; gameplay; collision/physics; UI; save; tối ưu; build | Engine và scripting; tích hợp asset và pipeline theo engine | Game chơi được, có điều khiển, điều kiện thắng/thua, lưu trạng thái hoặc màn chơi và bản build |
| QA | Yêu cầu; test design; test case; bug report; web/HTTP; SQL; dữ liệu test; kiểm thử API; báo cáo chất lượng | Manual: thực thi/report; Playwright: tự động hóa web; Postman: collection/assertion/API | Bộ kiểm thử có bằng chứng thực thi và báo cáo; nhánh automation có lệnh chạy lặp lại được |
| DEV | Linux/OS; mạng; Git; shell; CI/CD; container; cấu hình/secrets; cloud; logs/metrics; backup/rollback | SRE thêm SLI/SLO, cảnh báo, kịch bản sự cố và postmortem | Pipeline triển khai có quan sát và rollback; nhánh SRE có đo độ tin cậy và thử tình huống lỗi |
| DA | Câu hỏi nghiệp vụ; bảng tính; SQL; thống kê mô tả; chất lượng/làm sạch dữ liệu; trực quan; diễn giải | Xử lý/biểu đồ bằng bảng tính hoặc Python/pandas | Báo cáo dữ liệu có câu hỏi, truy vấn, biểu đồ, kết luận và giới hạn của phân tích |
| BI | Nhu cầu báo cáo; SQL; ETL cơ bản; fact/dimension; mô hình dữ liệu; định nghĩa KPI; dashboard; kiểm tra dữ liệu | Power BI: Power Query/DAX; Tableau: data model/calculated fields | Dashboard có mô hình, định nghĩa chỉ số, kiểm tra tính đúng và hướng dẫn sử dụng |
| DS | Python; SQL; xác suất/thống kê; đại số tuyến tính; EDA; thiết kế thử nghiệm; mô hình; đánh giá; diễn giải; tái lập | Một nhánh Python trong đề xuất hiện tại | Notebook/repo tái lập được, có baseline, đánh giá và giải thích giới hạn |
| DE | Python; SQL; DB; modeling; ingestion; ETL/ELT; orchestration; chất lượng; logging; triển khai | Streaming thêm event, Kafka, xử lý lỗi và độ trễ | Pipeline chạy lại được, dữ liệu kiểm tra được, có theo dõi lỗi; streaming có xử lý sự kiện |
| ML | Python; OOP/DSA thích hợp; toán/thống kê; dữ liệu; train/validation/test; leakage; metrics; baseline; model evaluation | scikit-learn; CV/PyTorch; NLP/Transformers, gồm nền tảng deep learning trước nhánh sâu | Mô hình có baseline, đánh giá trên dữ liệu tách riêng, phân tích lỗi và demo sử dụng |
| MLOPS | Nền tảng ML; Git/Linux; API; Docker; version dữ liệu/mô hình; tracking; phục vụ; giám sát; CI/CD | Serving/monitoring hoặc pipeline/retraining và quản lý phiên bản | Quy trình đưa mô hình vào chạy với phiên bản, test, monitoring và khả năng khôi phục |
| NET | TCP/IP; subnet; switching; routing; DNS/DHCP; hệ thống/Linux; bảo vệ mạng; cấu hình; troubleshooting | Mô phỏng/cấu hình mạng hoặc tự động hóa bằng Python/API thiết bị | Sơ đồ và lab kết nối có kiểm tra; nhánh automation có script kiểm tra/lưu cấu hình |
| SEC | Mạng; OS/Linux; scripting; web/HTTP; mô hình đe dọa; kiểm soát truy cập; log; rủi ro; báo cáo; thực hành lab được phép | SOC: phân tích log/incident; Web: kiểm tra ứng dụng và remediation; DevSecOps: kiểm soát trong CI/CD | Báo cáo lab có bằng chứng, phân tích và cách khắc phục; không dùng hoạt động trái phép làm bài học |
| UX | Vấn đề/người dùng; nghiên cứu; information architecture; journey/flow; wireframe; interaction; accessibility; usability; handoff | Research: nghiên cứu/đánh giá; UI: typography, palette, component và design system | Case study có lý do thiết kế, prototype và kết quả thử sử dụng; không chỉ xuất màn hình đẹp |
| AIE | Python; API/HTTP; dữ liệu; kiến thức LLM; prompt; embeddings; retrieval; RAG; đánh giá; quyền riêng tư; lỗi/chi phí; triển khai | RAG hoặc thêm tools/agent với quyền hạn và điều kiện dừng rõ ràng | Ứng dụng AI có bộ tình huống đánh giá, trích nguồn khi phù hợp và hành vi khi không có câu trả lời |
| BA | Bối cảnh tổ chức; stakeholder; khảo sát; nhu cầu; yêu cầu; ưu tiên; process modeling; user story/use case; acceptance; traceability; đánh giá giải pháp | Software BA: luồng và yêu cầu phần mềm; Data/BI BA: yêu cầu dữ liệu, KPI và báo cáo | Hồ sơ bài toán có stakeholder, quy trình, yêu cầu, tiêu chí nghiệm thu và liên kết kiểm thử |

### 5.1. Nền tảng CS không được bỏ sót

- Các hướng lập trình phải có chặng nền tảng phù hợp: lập trình, OOP khi dùng mô hình đối tượng, DSA, Git và các kiến thức hệ thống cần cho hướng đó.
- Backend phải có rõ **DSA, OOP, Computer Networking, OS/Linux và Computer Systems**. Không thay tất cả bằng một dòng “đã biết lập trình”.
- Dữ liệu/AI cần chặng toán và thống kê phù hợp. UX/BA không bị ép học toàn bộ DSA/OS như điều kiện bắt đầu.
- Một chủ đề nền tảng có thể dùng chung tài liệu khái niệm. Bài thực hành và ước lượng thời gian theo ngôn ngữ phải tương ứng nhánh, không đưa bài Java vào kế hoạch Python.
- Thời gian trong plan là ước lượng cho các công việc được chọn, không cam kết sau vài tuần sẽ đủ năng lực nghề nghiệp hoặc đủ điều kiện thi chứng chỉ.

## 6. Nguồn học và mục tiêu bổ trợ

### 6.1. Một chặng có gì?

1. Tên, mục tiêu, kiến thức tiên quyết và kết quả quan sát được.
2. Ít nhất một nguồn trực tiếp phù hợp với chặng/nhánh. Ưu tiên nguồn miễn phí đủ để bắt đầu khi có.
3. Nguồn thay thế khi tìm được nguồn phù hợp; ghi rõ khác biệt về ngôn ngữ, mức khó, hình thức và chi phí.
4. Công việc học/thực hành với thời gian ước lượng và liên kết nguồn.
5. Bài thực hành hoặc tiêu chí để sinh viên tự kiểm tra, thay vì chỉ bấm “đã đọc”.

### 6.2. Cách lấy và biên soạn nguồn

- roadmap.sh giúp tìm chủ đề và nguồn tham khảo. Kiểm tra trang của đơn vị cung cấp trước khi đưa vào danh mục; không dùng kết quả AI gợi ý URL như bằng chứng nguồn còn hoạt động.
- Tìm theo chặng, không giới hạn thư viện vào W3Schools/freeCodeCamp. Có thể dùng tài liệu chính thức, khóa đại học mở, nền tảng bài tập, lab và khóa học có tác giả rõ ràng.
- Tóm tắt do nhóm biên soạn; dẫn đến bài/khóa/trang chính thức. Không sao chép nguyên roadmap hoặc tải lại tài liệu khóa học của bên khác.
- Lưu đơn vị cung cấp, URL, ngôn ngữ tài liệu, hình thức, chi phí, trình độ, nhánh áp dụng và ngày kiểm tra.
- Bản mini dùng danh mục được nhóm kiểm tra, không xây crawler/scraper tổng quát để tự động nhập toàn bộ Internet.
- Bộ lọc “ngôn ngữ tài liệu” là Việt/Anh và độc lập với ngôn ngữ lập trình. Khi không có nguồn đúng bộ lọc, hiển thị trạng thái rỗng và cách nới bộ lọc.
- Nội dung trả phí hoặc lab cần thiết bị/API phải ghi điều kiện sử dụng. Không quảng bá khóa là miễn phí chỉ vì đọc được trang giới thiệu.

### 6.3. Chứng nhận, chứng chỉ và portfolio

- Phân biệt **chứng nhận hoàn thành khóa**, **chứng chỉ qua kỳ thi** và **portfolio/bài thực hành**.
- Với từng hướng, tìm mục tiêu bổ trợ thích hợp từ nguồn chính thức; ghi rõ đối tượng, nền tảng cần có, điều kiện, loại chứng nhận và chi phí đã xác minh.
- Có thể lưu mục tiêu để tham khảo. MajorWeave không cấp, xác minh hoặc hứa bảo đảm đạt chứng chỉ.
- Không ép mỗi framework phải có chứng chỉ nếu không có chương trình phù hợp. Khi chưa chọn được chứng chỉ có ích, ghi rõ và ưu tiên đầu ra portfolio; không tạo mục giả để đủ số lượng.
- BA dùng khung nghề và nguồn của IIBA, sau đó kiểm tra riêng các trang chứng nhận khi biên soạn chi tiết. [IIBA — Business Analysis](https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/).
- Đợt bảng phạm vi này xác định quy tắc tuyển chọn. Danh sách khóa/chứng chỉ chi tiết cho 18 hướng vẫn là công việc triển khai nội dung, chưa được coi là đã kiểm tra đầy đủ.

## 7. Năm trang và chức năng đích

| Trang | Chức năng cần hoàn thành | Trạng thái cần thiết kế/kiểm tra |
|---|---|---|
| Explore | Chọn ngành hiện tại; khám phá khoa khác; tìm/lọc; xem hướng gần nền tảng/mở rộng; mở bất kỳ hướng nào; đọc quan hệ ngành–hướng | Chưa chọn ngành; tìm không ra; kết quả lọc; ngành có phạm vi đặc biệt như Thiết kế Vi mạch |
| Path detail | Nội dung của mọi hướng; chọn nhánh/kết hợp; đọc chặng; nguồn học; mục tiêu bổ trợ; mở roadmap ngoài; xác nhận kỹ năng đã biết | Nhánh khác nhau; nguồn rỗng theo bộ lọc; nguồn ngoài; điều kiện tiên quyết; chặng chọn thêm |
| My roadmap | Chọn/bỏ/sắp xếp chặng; đổi nguồn; giữ chặng đã biết; đặt mục tiêu, giờ/tuần, ngày bắt đầu; tạo hoặc xác nhận tạo lại kế hoạch | Chưa chọn chặng; tất cả chặng đã biết; đầu vào lỗi; lựa chọn thiếu nền tảng; đã có kế hoạch |
| My plan | Công việc theo tuần; hoàn thành/bỏ hoàn thành; sửa/ghi chú; thêm việc; chuyển việc; mở nguồn; xem lịch sử tuần và thống kê | Chưa có kế hoạch; tuần rỗng; việc hoàn thành; việc dời tuần; tạo lại kế hoạch; lỗi lưu dữ liệu |
| Profile | Tên/ngành; nhịp học theo ngày; tổng quan tiến độ; liên kết tới kế hoạch | Chưa có hoạt động; có hoạt động; dữ liệu cũ không có ngày hoàn thành; thay đổi hồ sơ |

### 7.1. My plan theo tinh thần BeaverPlans

Đề xuất cần được Hải duyệt cùng prototype:

- Ba vùng/tab **Plan, Stats, Weeks** ở trong My plan, không tăng số trang chính.
- Plan: chọn tuần, tiến độ tuần, nhóm công việc/chặng và chỉnh công việc.
- Weeks: xem các tuần đã học, mở một tuần, phân biệt tuần hiện tại và tuần đã kết thúc.
- Stats: tổng hợp công việc và tỷ lệ hoàn thành theo tuần; liên kết Profile để xem bảng hoạt động theo ngày.
- Kết thúc tuần: ghi lại kết quả; sinh viên quyết định việc chưa xong sẽ giữ, dời hay bỏ. Chỉ báo hoàn tất sau khi dữ liệu đã lưu thành công.
- Prototype sẽ đối chiếu bố cục, typography, palette, khoảng cách và trạng thái tương tác theo ảnh/tham khảo BeaverPlans trước khi giao cho nhóm.

Các chức năng này chưa được coi là đã giống hoặc đã hoàn thiện trong repo hiện tại. Copy/Paste plan, kéo thả, nhắc lịch và xuất lịch không nằm trong danh mục chức năng đề xuất này; có thể xét thêm khi duyệt nếu cần.

### 7.2. Quy tắc dữ liệu người dùng

- Ngành trong hồ sơ và khoa đang khám phá là hai lựa chọn độc lập.
- Bản roadmap đang chỉnh là bản nháp; kế hoạch đã tạo giữ thông tin hướng/nhánh/mục tiêu tại thời điểm tạo.
- Đổi hướng/nhánh để khám phá không tự thay đổi kế hoạch đang học. Thay kế hoạch cần có hành động rõ ràng và xác nhận nếu có dữ liệu sẽ bị thay.
- Chặng đã biết có thể hiện trên roadmap nhưng không tự sinh công việc học lại nếu người dùng không chọn.
- Dời công việc không tạo thêm bản sao; hoàn thành/bỏ hoàn thành phải cập nhật tiến độ và hoạt động nhất quán.
- Nhịp học dựa trên ngày thực sự đánh dấu hoàn thành. Không tự tạo dữ liệu cũ để heatmap trông đầy.
- Tải lại giữ dữ liệu đã lưu; dữ liệu lỗi phải được xử lý với thông báo rõ ràng, không âm thầm báo thành công.

**Quyết định hiện tại:** làm không đăng nhập trước, giữ nhiều kế hoạch và chọn một kế hoạch đang xem. Kiến trúc bước 3 đề xuất lưu cục bộ bằng IndexedDB, migrate bản cũ, giữ lịch sử khi tạo lại và xuất/nhập file; đang giao Hải duyệt. Tài khoản/Google login/đồng bộ online thuộc giai đoạn sau, chưa chọn stack. Prototype 02 là thử nghiệm lịch sử, dùng localStorage riêng; chưa có OAuth.

## 8. Tiêu chí hoàn thành — áp dụng cho tất cả hướng được duyệt

### 8.1. Nghiệm thu nội dung

- [ ] Cả 12 ngành có thông tin và trạng thái quan hệ; KTMT/Vi mạch hiển thị đúng ngoại lệ.
- [ ] Mọi hướng được duyệt có mô tả, nền tảng, điều kiện tiên quyết, thứ tự học và đầu ra.
- [ ] Mọi nhánh được duyệt có chặng, nguồn và bài thực hành tương ứng. Không để hướng ngoài Backend chỉ mở hộp thoại tổng quan.
- [ ] Nguồn chính có URL trực tiếp đã kiểm tra; nguồn thay thế có phân biệt hữu ích; không chỉ lặp hai website cho mọi chủ đề.
- [ ] Mục tiêu bổ trợ phân loại đúng; nếu chưa có chứng chỉ thích hợp, diễn đạt thật và có đầu ra portfolio.
- [ ] Nội dung chung dùng lại hợp lý, nhưng khác biệt giữa BA/DA/BI, DS/ML/AIE hoặc các stack không bị xóa.

### 8.2. Nghiệm thu luồng xuyên trang

Với **mỗi cấu hình** được duyệt, phải kiểm tra được:

1. Chọn ngành → mở hướng/nhánh → xem đúng các chặng và nguồn.
2. Chọn nguồn, đánh dấu chặng đã biết, chỉnh chặng → tạo lịch bằng quỹ giờ hợp lệ.
3. Kế hoạch ghi đúng hướng, nhánh/kết hợp và mục tiêu; có công việc thực hành phù hợp.
4. Mở nguồn từ công việc; đánh dấu hoàn thành; sửa/dời việc → tiến độ đúng.
5. Tải lại → kế hoạch và thay đổi vẫn còn; Profile/Stats/Weeks phản ánh cùng dữ liệu.
6. Khám phá một hướng khác → kế hoạch cũ được giữ cho tới khi người dùng quyết định thay.

Các luồng dùng chung còn cần kiểm tra nhánh lỗi: giờ học bằng 0/âm/không hợp lệ; thiếu lựa chọn; tất cả chặng đã biết; hủy tạo lại; nguồn không đúng bộ lọc; dữ liệu lưu lỗi; thao tác từ bàn phím và màn hình nhỏ.

### 8.3. Nghiệm thu kỹ thuật và bài nộp

- [ ] Kiểm tra dữ liệu: ID duy nhất, liên kết hợp lệ giữa hướng/nhánh/chặng/nguồn, không chặng mồ côi, không công việc thuộc sai nhánh.
- [ ] Thuật toán tạo lịch đúng thứ tự/tiên quyết và quỹ giờ; bài quá lớn phải được chia hoặc xử lý rõ, không âm thầm bỏ công việc.
- [ ] Dữ liệu prototype Backend cũ được phục hồi/migrate có kiểm tra; không xóa dữ liệu để né lỗi.
- [ ] Giao diện responsive và các trạng thái đã duyệt; có focus, label nhập liệu và tương phản phù hợp.
- [ ] Build chạy được; bản online sử dụng được; repo có hướng dẫn cài/chạy.
- [ ] Mỗi chức năng có user story, luồng chính/thay thế/lỗi, test case và kết quả thực hiện. Bài test chưa chạy ghi “Chưa chạy”, không ghi Pass.
- [ ] Có Product Brief, tài liệu kiến trúc, lý do UI, AI log, đối chiếu cùng một task giữa hai công cụ AI, bằng chứng kiểm thử/lỗi, slide và kịch bản demo theo yêu cầu môn.

Các sơ đồ luồng chi tiết sẽ thực hiện sau khi nghiệp vụ được duyệt. Dùng tài liệu EF01–EF28 hiện có làm đối chiếu; mở rộng/điều chỉnh cho mọi hướng và các chức năng mới, không coi nó đã là đặc tả đích hoàn chỉnh.

## 9. Đối chiếu với Prototype 01 và nền tảng cần chuẩn hóa

| Hạng mục | Prototype 01 trong repo | Cần làm sau khi duyệt |
|---|---|---|
| Danh mục | 12 ngành, 16 hướng trong `src/catalog.ts` | Cập nhật quan hệ, thêm AIE/BA, nhóm KTMT/Vi mạch |
| Nội dung học | Backend có ba stack; 15 hướng khác chủ yếu tổng quan | Hoàn thiện mọi hướng/nhánh được duyệt, theo mục 5–6 |
| Cấu trúc dữ liệu | `BackendStack`, `PlanMeta.stack` và planner phụ thuộc Backend trong `src/data.ts`/`src/state.ts` | Chốt mô hình chung và cách ghép chặng/nhánh trước khi các bạn mở rộng |
| UI | Năm trang, prototype một hành trình Backend | Duyệt thiết kế tổng quát dùng được cho loại nhánh khác nhau và các tab My plan |
| Lưu | localStorage, một kế hoạch hiện hành | Lưu cục bộ nhiều kế hoạch/lịch sử, xuất/nhập và bảo toàn dữ liệu cũ; đăng nhập/đồng bộ online ở giai đoạn sau |
| Luồng | EF01–EF28 cho prototype Backend | Generalize và bổ sung luồng nghiệp vụ đã duyệt |
| Kiểm thử | Các script kiểm tra prototype | Coverage theo danh mục mới + kiểm thử logic dùng chung + kiểm tra mọi cấu hình |

**Tài liệu cũ:** `docs/Danh_muc_nganh_huong_hoc.md` được sinh tự động từ catalog của Prototype 01, mô tả 16 hướng. **Prototype 02** dùng fixtures riêng để thử giao diện 18 hướng / 50 cấu hình, nhiều kế hoạch và các tab My plan. Chưa thay mô hình sản xuất hoặc hoàn thiện thư viện học; xem [hướng dẫn duyệt](PROTOTYPE_02.md).

## 10. Khối lượng để quyết định trước khi giao việc

- 18 hướng, 50 cấu hình đề xuất; hiện ba cấu hình Backend có nền tảng triển khai, cần rà soát lại khi đổi mô hình.
- 47 cấu hình còn lại mới có lịch và khung nội dung mẫu ở Prototype 02; chưa có nội dung kế hoạch hoàn chỉnh. Chúng có thể chia sẻ nhiều chặng, nhưng vẫn cần biên soạn, kiểm tra nguồn và bằng chứng nghiệm thu.
- Full-stack có 9 kết hợp được tạo từ FE/BE; không giao chín bạn viết chín roadmap hoặc chép chín thư mục dữ liệu.
- Hướng ML/MLOps/SRE có chiều sâu và nhiều tiên quyết; không cân công việc chỉ bằng số hướng. Khi giao việc cần tính cả số chặng riêng, số nguồn cần kiểm tra, phần logic và kiểm thử.
- Chưa có ước lượng giờ đáng tin cho toàn bộ phạm vi. Sau khi duyệt, sẽ kiểm kê chặng dùng chung/riêng và phân công năm bạn theo công sức thực tế trước khi cam kết lịch.

## 11. Những phần Hải cần hoàn thành trước khi năm bạn triển khai

| Thứ tự | Đầu ra cần có | Khi nào được sang bước sau |
|---|---|---|
| 1 — đã gửi | Bảng phạm vi này: ngành → hướng → nhánh, chức năng và tiêu chí | Hải yêu cầu tiếp tục prototype; còn có thể sửa chi tiết danh mục |
| 2 — đã chọn lại nền giao diện | Giữ sidebar và style bản cũ; thành phần mới sẽ ghép vào và duyệt trước tích hợp | Không dùng bố cục ngang Prototype 02 làm nền |
| 3 — đang giao kiểm tra | [Kiến trúc](KIEN_TRUC_MAJORWEAVE.md), hợp đồng dữ liệu, lưu/migrate, planner chung và mẫu ba nhánh Backend đã kiểm tra cấu trúc | Hải duyệt; có ví dụ để các bạn triển khai cùng một cấu trúc |
| 4 | Quy tắc Antigravity, quyền sửa thư mục, Git/PR, mẫu story/flow/test và tiêu chí bàn giao | Hải duyệt quy trình và hợp đồng giữa các phần |
| 5 | Gói giao việc cho năm bạn: phạm vi, file/module sở hữu, phụ thuộc, người review, nghiệm thu, mốc tích hợp | Hải giao việc và nhóm xác nhận đầu ra |

Hải không cần tự biên soạn toàn bộ nguồn học hoặc viết xong mọi module trước khi giao việc. Hải cần chốt danh mục, cấu trúc và các ví dụ chuẩn; năm bạn thực hiện nội dung/chức năng theo chuẩn đó.

## 12. Checklist Hải duyệt phần 1

- [ ] Đồng ý danh mục 18 hướng, bao gồm AI Engineer được đề xuất mới và BA đã đồng ý.
- [ ] Đồng ý/sửa các nhánh ở mục 4; số 50 sẽ cập nhật theo lựa chọn thực tế.
- [ ] Đồng ý/sửa quan hệ ngành → hướng và cách trình bày KTMT/Vi mạch ở mục 3.
- [ ] Đồng ý/sửa năm trang và đề xuất Plan/Stats/Weeks ở mục 7.
- [ ] Đồng ý tiêu chí “mọi hướng/nhánh đều tạo được kế hoạch” ở mục 8.
- [x] Làm không đăng nhập trước; nhiều kế hoạch, một kế hoạch đang xem. Tài khoản/Google login ở giai đoạn sau, chưa chọn nhà cung cấp.
- [ ] Chốt cách giữ lịch sử khi tạo lại và migrate dữ liệu khách ở phần kiến trúc.

Hải đã chọn lại sidebar cũ và yêu cầu bước tiếp theo. [Kiến trúc bước 3](KIEN_TRUC_MAJORWEAVE.md), hợp đồng dữ liệu và mẫu ba nhánh Backend đang giao kiểm tra; dừng trước bộ khung và quy tắc giao việc. Không coi việc commit tài liệu hoặc fixtures là phê duyệt toàn bộ nhánh hay bằng chứng đã hoàn thiện thư viện học.

## 13. Nguồn đối chiếu và cách sử dụng

- [roadmap.sh — danh mục chính thức](https://roadmap.sh/roadmaps/): xác minh hướng/kỹ năng có trang tham khảo; các link từng hướng ở mục 4 đã được mở kiểm tra ngày 04/10/2026.
- [UIT — ngành đào tạo](https://tuyensinh.uit.edu.vn/nganh-dao-tao/): thông tin nền tảng để nhóm đề xuất quan hệ khám phá; nguồn từng ngành nằm ở mục 3. Không dùng thông tin tuyển sinh để chấm điểm phù hợp nghề của một sinh viên.
- [IIBA — What is Business Analysis?](https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/): khung nghề BA; quan hệ BA với TMĐT còn được hỗ trợ bởi [mô tả nghề nghiệp ngành TMĐT tại UIT](https://tuyensinh.uit.edu.vn/nganh-dao-tao/nganh-thuong-mai-dien-tu).
- [Vite — Getting Started](https://vite.dev/guide/), [React — Learn](https://react.dev/learn): phân biệt công cụ build với nhánh giao diện.
- [W3C WAI — Tutorials](https://www.w3.org/WAI/tutorials/): nguồn nền tảng accessibility.
- [BeaverPlans](https://beaverplans.com/): tham khảo phong cách và kế hoạch tuần theo ảnh Hải cung cấp; đã đọc trực tiếp giao diện khách khi làm Prototype 02 ngày 04/10/2026. Không tuyên bố đã kiểm tra hết tương tác của website tham khảo.
- Repo hiện tại: kiểm tra `src/catalog.ts`, `src/data.ts`, `src/state.ts`, README và các tài liệu prototype ngày 04/10/2026.

Các bảng ngành, nhánh, chuỗi chặng và tiêu chí nghiệm thu là thiết kế của nhóm cho MajorWeave, không phải bản sao của một website hay chương trình đào tạo.
