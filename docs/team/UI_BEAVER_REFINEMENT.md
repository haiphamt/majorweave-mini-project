# Điều chỉnh giao diện theo Beaver Plans — 09/10/2026

## Quyết định của Hải

- Dùng top nav thay side nav; giữ tên MajorWeave và palette kem/gạch.
- Tham chiếu Beaver Plans: thao tác rõ, chữ vừa, ít chi tiết phụ; không tuyên bố sao chép toàn bộ chức năng.
- Profile: hồ sơ, nhịp học, chứng nhận đã lưu. Sao lưu là mục thu gọn; tùy chọn chỉ hiện sau khi chọn file. Khôi phục bản cũ chỉ hiện nếu có dữ liệu cũ hoặc lỗi đọc cần xử lý.
- Path detail: hướng/nhánh → roadmap tham khảo → hàng lưu lựa chọn → các tab. Nút lưu không nằm lẫn trong bộ chọn nhánh.
- Không hiển thị khối “Mục tiêu Portfolio” như mục tiêu bắt buộc và không tự điền mục tiêu cá nhân khi mở hướng. Không xóa mục tiêu hoặc kế hoạch người học đã lưu trước đó.
- My Plan: Plan / Stats / Weeks, các tuần ở hàng ngang, việc học có tiêu chí mở khi cần. Không thay nghiệp vụ sinh lịch/lưu/tiến độ.
- Trang luồng dùng các thao tác hiện tại, mọi hướng học. Bỏ sơ đồ và demo Backend lịch sử khỏi trang được phục vụ.

## Kiểm chứng

- Chạy kiểm tra cấu trúc/domain và build.
- Trình duyệt Chrome, database QA riêng: mở React, lưu lựa chọn, xác nhận mục tiêu mới trống; nhập mục tiêu, tạo plan, hoàn thành việc, tải lại; Profile có ngày và việc tương ứng.
- Profile mặc định đóng sao lưu; mở chỉ có xuất/chọn file, chưa có bốn checkbox nhập. Fixture dữ liệu cũ nằm trong mục khôi phục riêng.
- Desktop và 390×844: kiểm tra top nav, Path detail, My Plan, Profile và trang luồng; minh chứng trong `D:/IS207/artifacts/beaver-ui-2026-10-09`.
- Chưa kiểm thử lại upload JSON qua file picker (giới hạn extension đã ghi ở báo cáo tích hợp). Logic nhập/xuất và bảo toàn dữ liệu vẫn dùng controller hiện có.

## Công cụ hỗ trợ

- Impeccable: distill, operate, craft-floor; dùng cho hierarchy, typography, disclosure và responsive.
- Ponytail: giữ React/CSS/native details; không thêm framework hoặc dependency.
- Không dùng skill để tự thay phạm vi, nội dung học hoặc thiết kế ngoài yêu cầu của Hải.

## Bàn giao

Nhánh `fix/beaver-ui`; gửi bản local để Hải kiểm tra trước khi merge. Chưa thay bản Netlify, chưa sửa Notion.

## Điều chỉnh ngày 10/10/2026

- Tên hiển thị mới nhất: **uitplans.** — chữ thường, dấu chấm cuối, không logo biểu tượng.
- Explore bỏ nhãn “Bản trải nghiệm” và cách tô nổi bật riêng cho Backend. Nút mở đầu dẫn xuống danh sách hướng học.
- Profile giữ tên/ngành học, đổi tiêu đề thành “Hồ sơ học tập”; tên là tùy chọn. Bỏ khối “Đang khám phá” và thông tin kế hoạch lặp với My Plan.
- Múi giờ nằm trong “Tùy chọn nâng cao”, mặc định thu gọn. Giữ thao tác lưu/hủy, nhịp học, chứng nhận và sao lưu.

### Wordmark và thanh điều hướng

Theo ảnh Beaver Plans Hải cung cấp: tên dùng Be Vietnam Pro 700, 24px desktop / 22px mobile, tracking −0.03em, chữ đứng và dấu chấm cùng màu chữ. Giữ palette kem/gạch; bỏ icon của các mục điều hướng, dùng nhãn chữ gọn. Không thêm font hoặc dependency. Tên browser/tab và trang hướng dẫn thống nhất với wordmark; khóa dữ liệu/format backup cũ giữ nguyên.

Kiểm chứng: `npm run check` và `npm run build` đạt. Scan typography của Impeccable không có finding. Chrome 1280px và 390px: wordmark không có ảnh, computed font là Be Vietnam Pro 700 / normal, đúng 24px và 22px; body không tràn ngang. Ảnh thực tế nằm trong `D:/IS207/artifacts/uitplans-2026-10-10`.


### Bố cục Hướng học và Kế hoạch — bước được Hải duyệt ngày 10/10/2026

Hải yêu cầu bắt đầu theo đề xuất chỉnh phần bên trong. Bước này triển khai hai màn hình trước để duyệt; Khám phá, Lộ trình của tôi và Hồ sơ sẽ làm sau.

- Hướng học: đầu trang gọn, bộ chọn hướng/nhánh cùng nhóm; roadmap tham khảo là liên kết nhỏ; lưu lựa chọn nằm ở hàng riêng. Ba tab Lộ trình / Nguồn học / Chứng nhận giữ đầy đủ dữ liệu.
- Các chặng là hàng có số thứ tự, tiêu đề, mô tả, nguồn và thời lượng; không còn thẻ lồng trong timeline. Phần tóm tắt tính từ chặng được chọn và chưa biết, không coi tổng thời gian này là thời lượng toàn khóa.
- Trên điện thoại, tóm tắt và nút Tùy chỉnh xuất hiện trước danh sách. Trên desktop, tóm tắt nằm bên phải. Cửa sổ chặng dùng cùng kiểu chữ và vẫn có Áp dụng / Hủy.
- Kế hoạch: chọn kế hoạch ngay đầu trang; mục tiêu xuất hiện một lần. Việc học / Thống kê / Các tuần là ba chế độ xem. Thanh tuần cuộn ngang trong vùng riêng.
- Công việc nhóm theo dayIndex đang có; việc chưa gán ngày nằm trong Chưa chọn ngày. Không tự gán ngày cho lịch sinh ra. Menu dấu ba chấm chứa sửa và chuyển về chưa xếp lịch; tiêu chí mở bằng native details.
- Trạng thái chưa có kế hoạch có nút tạo kế hoạch đầu tiên. Thống kê, danh sách tuần, trạng thái chỉ đọc, lưu lỗi/thử lại và hủy chốt tuần vẫn dùng callback/controller hiện có.
- Điều hướng và tiêu đề tab trình duyệt Việt hóa. Giữ tên uitplans., palette kem/gạch, wordmark và kho dữ liệu cũ. Không thêm dependency, đổi nội dung học, reset dữ liệu hay cập nhật Notion.

#### Kiểm chứng của bước này

- Build và kiểm tra dự án đạt. Bộ kiểm tra MW-TEAM-03 đạt 41/41; fixture render được bổ sung lịch sử thật khi kiểm tra bộ chọn phiên bản, và kiểm tra mỗi việc chỉ xuất hiện một lần khi nhóm theo ngày. Không bỏ assertion.
- Impeccable layout scan trước và sau chỉnh sửa đều không có finding.
- Chrome 1280×900 và 390×844; kiểm tra thêm độ rộng 900px: body không tràn ngang. Kiểu chữ, nội dung dài, tab, menu và nút chính đã xem trực tiếp.
- Dữ liệu QA dùng database riêng `uitplans-layout-qa-20261010`, entry trong thư mục artifacts bị Git bỏ qua; không ghi vào workspace của người dùng. Tạo kế hoạch React từ nội dung thật: 17 việc, 11 chặng.
- Thử lọc nguồn không có kết quả và xóa bộ lọc; xem đủ 3 chứng nhận; đổi trạng thái trong cửa sổ chặng rồi Hủy giữ bản nháp. Sửa ngày một việc thành Thứ Hai, hoàn thành, tải lại: nhóm ngày và kết quả 1/17 vẫn được giữ.
- Xem Thống kê, mở Các tuần → tuần 2; quay lại tuần 1, mở Chốt tuần → Hủy: tuần vẫn mở. Chưa thử lại lỗi quota/hai tab trực tiếp trong bước UI; các kiểm tra domain/controller hiện có vẫn đạt.
- Ảnh bàn giao: `D:/IS207/artifacts/learning-ui-2026-10-10/path-desktop.jpg`, `plan-desktop.jpg`, `path-mobile.jpg`, `plan-mobile.jpg` và `plan-empty-desktop.jpg`. Ảnh Kế hoạch dùng dữ liệu kiểm tra riêng, không phải kế hoạch của Hải.

Nhánh bàn giao vẫn là `fix/beaver-ui`. Chờ Hải kiểm tra hai trang trước khi triển khai ba trang tiếp theo hoặc merge.

## Điều chỉnh theo phản hồi Hải · 10/10/2026

- Nav và tiêu đề tab trình duyệt giữ tiếng Anh: Explore / Path detail / My roadmap / My plan / Profile. Nội dung học, form và các chế độ xem trong trang giữ tiếng Việt.
- Profile: Nhịp học của bạn lên đầu, trước form hồ sơ, mục tiêu chứng nhận và sao lưu. Khung hoạt động dùng bố cục gọn, số liệu nằm cạnh lịch ở desktop và xuống dưới ở mobile; giữ điều hướng ngày bằng bàn phím và completion ledger thật.
- Đã tạo trên trình duyệt Chrome tại 127.0.0.1:5195 một kế hoạch thử Backend Node.js / Express: mục tiêu Xây API quản lý công việc, 5 giờ/tuần, bắt đầu Thứ Hai 12/10/2026; 15 chặng, 39 việc, 12 tuần, 54.5 giờ thực hành. Dữ liệu thử được lưu qua giao diện thật; không đưa vào seed, không đánh dấu hoàn thành giả. Tải lại vẫn giữ kế hoạch.
- Kiểm tra: build và check đạt; Profile desktop 1280×900 và mobile 390×844 không tràn ngang trang. Lịch/ngày chưa chọn vẫn do người học phân bổ; tạo plan hiện chỉ xếp theo tuần.
- Minh chứng: D:/IS207/artifacts/profile-backend-2026-10-10/. Branch fix/beaver-ui; chờ Hải duyệt giao diện trước khi merge.

## Canvas theo ảnh Beaver Plans · 10/10/2026

Hải yêu cầu Plan giống style trong ảnh và áp dụng tương tự cho các trang khác. Quyết định này mở rộng bước hai trang trước đó sang cả năm trang; dùng Impeccable cho bố cục và kiểm tra responsive.

### Đã thực hiện

- Giữ wordmark **uitplans.**, nav tiếng Anh và palette kem/gạch. Nav cao 64px desktop; tiêu đề, form, nút và đường phân cách thống nhất, bỏ thẻ lớn và typography trang trí trong app hiện tại.
- My Plan: thanh chọn tuần có khoảng ngày, mũi tên trước/sau và Today; thanh tiến độ riêng của tuần ở trên hai cột. Chặng bên trái lọc công việc bên phải; việc vẫn nhóm theo ngày đã chọn. Điện thoại dùng bộ chọn chặng để tiết kiệm chiều cao.
- Mục tiêu, quỹ giờ và tiến độ toàn kế hoạch nằm trong phần tóm tắt bên trái. Chốt tuần vẫn xử lý toàn bộ công việc của tuần, kể cả khi đang lọc một chặng. Đổi tuần xóa bộ lọc; chặng không còn công việc tự trở về xem tất cả.
- Today chỉ hoạt động khi ngày hiện tại nằm trong một tuần hiện có của kế hoạch. Kế hoạch Backend bắt đầu 12/10 nên ngày 10/10 nút này bị vô hiệu hóa đúng với dữ liệu. Thanh chọn tuần cũng truy cập được bằng bàn phím/native select; tính khoảng ngày bằng ngày UTC để không lệch vì múi giờ.
- Explore: tiêu đề và bộ chọn ngành gọn; danh mục dùng hai cột hàng chia bằng đường kẻ trên desktop, một cột trên mobile. Giữ đủ 18 hướng, các bộ lọc và bảng 12 ngành.
- My roadmap: phần mục tiêu/quỹ giờ/ngày bắt đầu ở cột trái, lựa chọn chặng ở cột phải; trên mobile form đặt trước danh sách. Giữ callback lưu/tạo/tạo lại và kiểm tra tiên quyết.
- Path detail: cùng kiểu chữ, tab dạng pill, danh sách nguồn/chứng nhận chia bằng đường kẻ. Profile: nhịp học vẫn ở đầu; form, mục tiêu và sao lưu dùng cùng canvas, tùy chọn nâng cao vẫn thu gọn.
- Giữ controller, persistence, ID, nội dung và dữ liệu người học. Không thêm dependency hoặc tạo số liệu hoàn thành giả. Các luồng thao tác công bố đã cập nhật cho bộ chọn tuần/bộ lọc chặng.

### Kiểm chứng thực tế

- `npm run check` và `npm run build`: đạt. MW-TEAM-03: **42/42** đạt; thêm kiểm tra khoảng ngày qua tháng/năm nhuận, chỉ số tuần không hợp lệ và Today ngoài các tuần hiện có.
- Impeccable layout scan trước/sau: không có finding cơ học. Đã xem Chrome desktop 1280×900 và mobile 390×844 cho cả năm trang; mobile không tràn ngang body, nav cuộn trong vùng riêng.
- Trên kế hoạch Backend của Hải: chuyển tuần 1 → 2 → 1, chọn chặng bằng native select; đổi tuần xóa bộ lọc. Các thao tác xem không sửa dữ liệu kế hoạch.
- Database QA riêng `uitplans-layout-qa-20261010`: tuần 1 có 4 việc ở 2 chặng, 1 việc hoàn thành. Lọc Git hiển thị đúng 2 việc và tiến độ tuần giữ 1/4. Xem trước Chốt tuần vẫn có toàn bộ 3 việc chưa xong; Hủy giữ tuần mở. Mở menu sửa → Hủy, xem Thống kê và đủ 6 tuần; không có console error.
- Chưa kiểm thử lại quota/hai tab hoặc nhập file backup trực tiếp trong lượt chỉnh style này; các kiểm tra domain/controller hiện có vẫn đạt.
- Ảnh thực tế: `D:/IS207/artifacts/beaver-workspace-2026-10-10/` gồm Plan, Explore, My roadmap, Path detail và Profile, mỗi trang có desktop/mobile. Ảnh Plan bàn giao dùng kế hoạch Backend của Hải, chưa có việc hoàn thành.

Bàn giao trên nhánh `fix/beaver-ui`, xem local tại http://127.0.0.1:5195/#/plan. Chờ Hải kiểm tra trước merge; chưa cập nhật Notion hoặc bản Netlify.

### Bổ sung khung đỏ theo phản hồi ảnh

- Khung cần nhấn mạnh dùng viền gạch 2px, bo góc 14px, nền giấy sáng. My Plan đánh dấu việc chưa hoàn thành đầu tiên trong danh sách đang xem bằng khung này và `aria-current="step"`; số thứ tự nằm trong ô nhỏ. Đây là chỉ dẫn việc học tiếp theo, không phải kết quả hoàn thành. Khi lọc/đổi tuần, khung theo danh sách hiện tại.
- My roadmap có khung đỏ quanh form thiết lập kế hoạch; Plan chưa có dữ liệu cũng dùng khung đỏ cho bước tạo đầu tiên. Các hàng chặng ở Path detail hiện viền khi hover/focus; Explore, editor chặng và hồ sơ có khung khi tương tác bằng bàn phím.
- Đã xem Plan và My roadmap tại 1280×900 và 390×844: viền thực tế 2px, màu `rgb(167, 65, 39)`, không tràn ngang body. Ảnh: `D:/IS207/artifacts/beaver-red-frame-2026-10-10/`. Giữ nguyên dữ liệu Backend, chưa merge.

### Explore rõ cách bắt đầu và bỏ thuật ngữ bản nháp trên giao diện

Theo phản hồi tiếp theo của Hải: đầu Explore quá trống và thuật ngữ bản nháp gây khó hiểu.

- Explore: tiêu đề hai dòng, màu gạch ở dòng thứ hai, CTA cuộn đến hướng học và liên kết My plan. Phía phải là bộ chọn khoa/ngành thật trong khung đỏ, tiếp theo là bước chọn kỹ năng và lên kế hoạch. Số ngành/hướng/nhánh lấy từ danh mục hiện có (12/18/50), không thêm số liệu giả.
- Bộ lọc gọn trong một hàng desktop; bảng ngành → hướng vẫn mở được ở dưới danh mục, giúp hướng học xuất hiện sớm hơn. Không thay ngành hay nhánh của người dùng để tạo minh họa.
- My roadmap: “Lưu bản nháp” đổi thành “Lưu lựa chọn”; chỉ báo trạng thái khi đang lưu, chưa lưu hoặc có lỗi. Phần “Điều chỉnh kế hoạch đã tạo” mặc định đóng, mở ra mới thấy Xem trước tạo lại. Nhãn nhập backup đổi thành “Nhập lựa chọn lộ trình”. Schema/draft/controller và cơ chế tạo lại không đổi.
- Các bước kiểm thử UI hiện có cập nhật tên nút và thao tác mở phần thu gọn, giữ nguyên assertion; không tuyên bố đã chạy lại toàn bộ browser harness trong lượt này.
- Chrome 1280×900 và 390×844: đã xem đầu Explore; không tràn ngang body, chữ tiêu đề mobile 32px. Danh mục desktop bắt đầu khoảng y=780 trong màn 900px; nút khám phá cuộn đến danh mục. Tìm không có kết quả rồi Xóa bộ lọc khôi phục đủ 18 hướng.
- My roadmap trên kế hoạch Backend thật: không còn trạng thái “bản nháp” khi sạch; mở phần thu gọn → xem trước tạo lại → đóng giữ nguyên kế hoạch. Không xác nhận tạo lại, không tạo dữ liệu hoàn thành.
- Build/check và scan layout đạt. Ảnh thực tế: `D:/IS207/artifacts/explore-refresh-2026-10-10/`. Branch vẫn `fix/beaver-ui`, chờ Hải kiểm tra trước merge; chưa cập nhật Notion.

### Danh mục và thông tin cuối Explore

Hải yêu cầu xử lý bộ lọc, hướng học và thông tin bên dưới trong hai ảnh, theo style Beaver Plans.

- Bộ lọc gom trong một khung: tìm kiếm ở trên, khoa/nhóm/liên hệ ngành ở dưới. Số kết quả và nút xóa bộ lọc tách ra ở hàng riêng. Bộ lọc “Liên quan tới ngành của tôi” vẫn bao gồm hướng gần và mở rộng theo quan hệ hiện có.
- Mỗi hướng có nền giấy, viền bo 14px, nhóm nghề và số nhánh lấy từ content pack thật; nút Xem lộ trình màu gạch nhạt. Hover hoặc focus bên trong làm nổi viền gạch; nguồn tham khảo là hành động phụ, giữ URL hiện có. Nguồn IIBA không bị gọi chung là roadmap.sh trong danh mục mới.
- Bảng ngành thu gọn có tiêu đề và mô tả; khi mở có chú giải hai nhóm, lưu ý phạm vi và bảng 12 ngành. Trên mobile, bảng cuộn ngang trong vùng riêng có thể focus bằng bàn phím; body không tràn.
- Ghi chú cuối dùng nền xanh nhạt và nút Quay lại hướng học. Footer dùng chữ sans serif, wordmark, hướng dẫn thao tác và thông tin lưu trên trình duyệt; bỏ dòng Mini project/nhánh đang chọn khỏi footer sản phẩm. Phần đầu Explore và nghiệp vụ kế hoạch được giữ.
- Khởi động lại Vite tại cổng 5195 vì bản xem trước đã dừng; sau reload Chrome đã hiển thị đúng nguồn đang sửa.
- Kiểm chứng Chrome desktop 1280×900/mobile 390×844: 18 hướng được render; lọc AI còn đúng 3 hướng, tìm không có kết quả có đúng một nút xóa; xóa khôi phục 18. Xem lộ trình Backend mở đúng Path detail. Bảng có 12 hàng; vùng bảng mobile rộng 333px, nội dung 820px cuộn riêng; body 375px trong viewport 390px. Không có console error. Build/check và scan layout đạt.
- Ảnh: `D:/IS207/artifacts/catalog-refinement-2026-10-10/` gồm danh mục và cuối trang desktop/mobile. Bàn giao trên `fix/beaver-ui`, chưa merge hoặc cập nhật Notion.

### Sửa theo ảnh: khung ngang có viền đỏ hiện sẵn

Hải không duyệt thẻ hai cột với viền trung tính. Thay bằng một cột khung ngang như khung bước trong Beaver Plans: nền giấy, viền gạch 2px luôn hiển thị, bo 14px, ô số 32px bên trái, nội dung giữa và CTA bên phải. Mobile giữ ô số/nội dung, CTA xuống dưới. Số là vị trí đang hiển thị; không dùng làm thứ hạng nghề hoặc tiến độ học.

Bảng ngành và ghi chú cuối đổi sang cùng khung trắng viền gạch. Giữ bộ lọc, số nhánh, nội dung, URL và hành động hiện có; bỏ các icon nghề khỏi danh mục để ô số có đúng vai trò như ảnh.

Kiểm chứng: build/check và scan layout đạt. Chrome 1280×900 render đủ 18 khung trong một cột, mỗi khung rộng khoảng 1209px; border thực tế `2px solid rgb(167, 65, 39)`. Mobile 390×844 giữ viền, body 375px không tràn ngang. Ảnh: `D:/IS207/artifacts/beaver-horizontal-frames-2026-10-10/`. Branch `fix/beaver-ui`, chưa merge.

### Điều chỉnh thành 4 cột

Hải yêu cầu 4 cột thay cho khung ngang một cột. Giữ viền gạch 2px hiện sẵn, nền giấy, số thứ tự và các hành động; nội dung xếp dọc, CTA căn cuối khung. Desktop 1280px có 4 cột khoảng 290px; tablet 900px có 2 cột khoảng 406px; mobile 390px có 1 cột khoảng 335px. Cả ba kích thước không tràn ngang body. Build/check đạt. Ảnh: `D:/IS207/artifacts/explore-four-columns-2026-10-10/`.

## Explore tools & Profile — 10/10/2026

- Hải bác bộ lọc trong hộp lớn, hai khối cuối đặt cạnh nhau và các khung lớn trong Profile. Thay cách tổ chức theo phản hồi mới nhất.
- Explore dùng thanh lọc trên canvas: tìm kiếm, khoa, nhóm, liên quan ngành. Bảng ngành trở thành một hàng mở rộng gọn; ghi chú ngắn ở dưới. Giữ khung gạch hiện sẵn và 4 cột của danh mục.
- Profile chia ba mục Activity / Profile / Data. Activity mặc định hiển thị nhịp học; Profile chứa form và chứng nhận; Data chứa xuất/nhập. Nút chọn có trạng thái aria-pressed, liên kết aria-controls, vùng không chọn dùng hidden. Nội dung đang chỉnh được giữ khi chuyển mục. Giữ validation, hủy thay đổi, bảo vệ dữ liệu và preview/xác nhận nhập.
- Build/check đạt. Detector layout không có findings. Đã thử chuyển ba mục, sửa tên → đổi mục → quay lại (tên đang sửa giữ nguyên) → hủy (trở về tên đã lưu), tìm không khớp → xóa bộ lọc, bảng 12 ngành, responsive và console. Không lưu tên thử, không nhập/xóa/ghi đè kế hoạch.
- Trạng thái có chứng nhận và lỗi nhập/xung đột dùng code hiện có, kiểm tra nghiệp vụ qua bộ check; không tuyên bố đã chạy lại mọi luồng browser. Bàn giao trên fix/beaver-ui trước merge.

## Thống nhất Path detail và My roadmap — 10/10/2026

- Theo phản hồi của Hải: thông tin/tác vụ bên trái, danh sách chặng bên phải trên cả hai trang. Cùng tỷ lệ 1:2, gap 36px, khung giấy viền gạch 2px và sticky top 88px. Dưới 990px cùng cột trái 240px; dưới 760px cả hai xếp thao tác trước chặng học.
- Path detail vốn có aside đứng trước danh sách trong DOM; sửa grid areas để thứ tự nhìn và thứ tự đọc thống nhất. Không đổi nội dung hoặc callback.
- Build/check đạt. Browser desktop 1280: cả hai cột 390.885 / 781.781px; khối trái x=28, danh sách x=454.885. Mobile 390: body 375px, thông tin/thiết lập đứng trước danh sách. Đường dẫn Tùy chỉnh lộ trình mở đúng Backend Node.js, goal và dữ liệu đang lưu được giữ.
- Ảnh bàn giao: D:/IS207/artifacts/path-layout-2026-10-10. Chưa merge.

## Nguồn học — 10/10/2026

Theo yêu cầu của Hải, tab Nguồn học thay ngày đối chiếu bằng tên website hoặc đơn vị cung cấp lấy từ provider. Loại tài liệu (khóa học, bài viết, video, bài tập, thực hành) lấy từ format hiện có. Bỏ nhãn provider bị ẩn ở đầu mục; giữ checkedAt trong dữ liệu, không đổi nội dung/URL hoặc dữ liệu học đã lưu. Sửa cách gọi draft thành lựa chọn học.

Kiểm tra: build và check đạt; trình duyệt Backend hiển thị 25 tên nhà cung cấp, loại tài liệu đúng dữ liệu; không còn ngày đối chiếu trong tab Nguồn học. Màn hình 390px: nội dung 375px, không tràn ngang.

## Chứng nhận — 10/10/2026

Hải yêu cầu thiết kế lại tab Chứng nhận. Mỗi mục dùng nền giấy, khung gạch bo góc; 3 cột desktop, 2 dưới 1100px và 1 dưới 760px. Hiện loại chứng nhận, phí, đơn vị cấp, nền tảng và yêu cầu nhận. Thay bookmark rời bằng nút Lưu mục tiêu có aria-pressed và trạng thái đã lưu. Bỏ ngày đối chiếu khỏi phần hiển thị; giữ checkedAt trong dữ liệu. Không thay thông tin chương trình, URL, callback lưu hoặc ID.

Kiểm tra: build/check đạt; Backend hiện đủ 6 mục. Trên bản QA dùng database riêng, lưu → tải lại vẫn đã lưu → bỏ lưu trở về chưa lưu. Desktop 1280px: 3 cột; mobile 390px: 1 cột, body 375px, nút lưu cao 44px. Dữ liệu học thật không dùng cho thử lưu/bỏ lưu. Ảnh ở artifacts/credentials-2026-10-10 bên ngoài repo.
