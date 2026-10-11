# Đối chiếu báo cáo Công Định và kiểm thử My Plan

Ngày kiểm tra: 11/10/2026. Nguồn: báo cáo Word **Kiểm thử.docx** của Công Định, gồm 14 nhận xét và 16 ảnh. Đã đọc toàn bộ nội dung và xem từng ảnh. Đây là đối chiếu nghiệp vụ và kiểm thử, không tự coi các đề xuất trong báo cáo là yêu cầu bỏ tính năng.

Kết luận: có một lỗi chức năng được tái hiện là bỏ ngành làm mất khoa. Đã sửa. Nhiều điểm khác là vấn đề dễ hiểu/dễ thao tác; đã làm rõ những chỗ gây nhầm. Điều kiện tiên quyết, trạng thái đã biết, lưu lựa chọn riêng với tạo kế hoạch và xem trước tạo lại đều có mục đích bảo vệ dữ liệu. My Plan không phát hiện lỗi chức năng trong các tình huống đã chạy dưới đây.

## Môi trường và bảo vệ dữ liệu

- Nhánh `fix/beaver-ui`, baseline `ac0dfb4`; các sửa đổi được kiểm tra trên nhánh này.
- App QA riêng `http://127.0.0.1:5197/`, tắt Supabase trong tiến trình Vite; Guest/IndexedDB riêng theo origin. Không sửa kế hoạch Backend trong tài khoản thật, không đánh dấu hoàn thành giả trên tài khoản của Hải.
- Chrome dùng cho hành trình Guest; trình duyệt nội bộ dùng viewport mobile thực 390 × 844. Viewport đã được trả về mặc định sau thử.
- Fixture lỗi tại `docs/tasks/MW-QA-20261011/tests/my-plan.html` chạy component MyPlanV2 và domain thật, giả lập callback lưu bằng RAM. Không gọi Supabase hoặc ghi storage. Kết quả loại này được ghi riêng với hành trình IndexedDB thật.
- Không thể render Word bằng renderer đóng gói vì môi trường không có LibreOffice. Nội dung XML và toàn bộ 16 ảnh đã được trích đọc; không sửa hoặc phát hành lại file Word.

## Từng nhận xét của Công Định

| # | Nhận xét | Phân loại và kết luận | Xử lý |
|---|---|---|---|
| 1 | Chọn Chưa chọn ngành làm mất khoa | **Lỗi chức năng**, tái hiện trên giao diện. Khoa bị suy ra hoàn toàn từ ngành nên ngành rỗng kéo khoa về rỗng. | Giữ lựa chọn khoa riêng trong phiên Explore. Bỏ ngành vẫn giữ khoa và danh sách ngành; chọn Bỏ qua ở khoa vẫn xóa có chủ đích. Kiểm tra lại đạt. Khoa riêng này chưa phải trường hồ sơ được lưu qua reload. |
| 2 | Bước 2 và 3 không làm gì | Hướng dẫn quy trình, không phải nút thao tác ở bản cũ. Việc chọn ngành chỉ ưu tiên gợi ý, không tự chuyển trang hoặc khóa hướng học. | Giữ ba bước đã được Hải duyệt; bước 2 thành nút đến danh mục, bước 3 thành link My roadmap. |
| 3 | Lặp 18 hướng | Vấn đề thông tin lặp, không sai số liệu. Tổng danh mục và kết quả lọc phục vụ hai bối cảnh khác nhau. | Bỏ badge tổng ở tiêu đề danh mục; giữ số liệu mở đầu và số kết quả dưới bộ lọc. |
| 4 | Mô tả dưới tiêu đề rối/ít ý nghĩa | Đề xuất biên tập, không phải lỗi. Mô tả giới thiệu khám phá → chọn kỹ năng → lên lịch. | Giữ nội dung đã duyệt; không xóa chỉ vì nhận xét chủ quan. Có thể rút tiếp khi Hải muốn thay lời giới thiệu. |
| 5 | Nguồn học nên vào combobox/menu | Đề xuất thiết kế. Drawer hiện cho so sánh mô tả/đơn vị và chọn một nguồn; danh sách dài không làm sai lựa chọn. My roadmap đã có combobox nguồn. | Không đổi thành phần so sánh nguồn trong lượt sửa lỗi này. Giữ như một đề xuất thiết kế riêng. |
| 6 | Đã biết thì bỏ chặng, bỏ checkbox Đã biết | **Tính năng có chủ đích.** Bỏ chặng = không học nhưng không khẳng định có nền tảng. Đã biết = đã có nền tảng, không tạo bài học và đáp ứng điều kiện cho chặng sau. | Giữ logic; giải thích rõ và đổi chữ thành Đã biết — bỏ qua bài học. |
| 7 | Không học chặng tiên quyết thì không chọn được chặng sau | Chặng sau vẫn chọn được. **Tạo kế hoạch** bị chặn nếu nền tảng không học và cũng chưa xác nhận đã biết; đây là kiểm tra nghiệp vụ. Thông báo cũ lộ ID kỹ thuật, gây khó hiểu. | Lỗi hiển thị dùng tên chặng và cách xử lý. Cho đánh dấu Đã biết ngay cả khi không chọn học chặng đó. Đã thử bỏ OOP/DSA: bị chặn; đánh dấu hai chặng đã biết: tạo được plan và không sinh bài OOP/DSA. |
| 8 | Nội dung & bài thực hành khó nhận ra là bấm được | Vấn đề khả năng nhận diện thao tác; CSS cũ ẩn dấu mở rộng. | Dùng nhãn Xem nội dung & bài thực hành, giữ marker của summary, chữ rõ và con trỏ tương tác. |
| 9 | Lưu lựa chọn và Tạo kế hoạch mới khó phân biệt | **Hai tính năng khác nhau.** Lưu lựa chọn ghi cấu hình để chỉnh sau; không đổi plan. Tạo kế hoạch mới sinh một plan độc lập, không ghi đè plan đang học. | Thêm hướng dẫn bên dưới; thông báo lưu nói rõ chưa tạo/thay đổi kế hoạch. Không bỏ nút để tránh mất khả năng lưu cấu hình. |
| 10 | Xem trước tạo lại khó hiểu | Tính năng bảo vệ kế hoạch hiện có; ngôn ngữ cũ chưa rõ. | Đổi thành Xem lịch mới trước khi áp dụng, giải thích chỉ ghi khi xác nhận. Preview/hủy/xác nhận đã kiểm tra. |
| 11 | Activity nhiều chữ | Vấn đề mật độ thông tin, không sai dữ liệu. Ghi chú cách tính và điều khiển bàn phím vẫn cần tìm được. | Thu ghi chú dài vào Cách tính nhịp học. Giữ hướng dẫn trạng thái trống và cảnh báo dữ liệu thiếu ngày nếu có. |
| 12 | Múi giờ không chọn được | Trước đây là ô nhập có datalist, cho nhập mã IANA; `dsa` trong ảnh không phải múi giờ hợp lệ. Không phải mất khả năng lưu múi giờ, nhưng cách nhập dễ gây nhầm. | Đổi sang select các múi giờ trình duyệt hỗ trợ, giữ giá trị cũ/alias hợp lệ. Chọn Asia/Tokyo → lưu → reload vẫn còn. Validator vẫn giữ nguyên. |
| 13 | Tên hiển thị có lên nav sau đăng nhập không | Đối chiếu code: nav tài khoản ưu tiên `workspace.profile.displayName`, sau đó username/full_name Google, cuối cùng Account. Guest vẫn mang nhãn Guest để không giả là đã đăng nhập. | Không cần sửa logic. Form tên lưu/reload và Hủy đã thử trên Guest; không sửa tên tài khoản thật trong QA này. Việc đổi tên sau Google là đối chiếu code, chưa ghi là live test đạt. |
| 14 | Mô tả dưới Hồ sơ học tập ít ý nghĩa | Đề xuất biên tập. Câu hiện tại giải thích ngành dùng để ưu tiên gợi ý và tên không bắt buộc. | Giữ vì thông tin đúng và ngắn; không coi là lỗi chức năng. |

## My Plan trên app Guest thật

Các mục dưới đây đã chạy bằng thao tác giao diện và IndexedDB thật ở origin QA. Kế hoạch đầu có 39 việc, 5 giờ/tuần, bắt đầu 12/10/2026. Tất cả đạt theo kết quả quan sát; không bao gồm việc đồng bộ hai thiết bị vật lý.

| Mã | Tình huống | Kết quả thực tế |
|---|---|---|
| MP01 | Chưa có kế hoạch | Có trạng thái trống và link tạo kế hoạch đầu tiên. |
| MP02 | Tạo Backend rồi reload | 39 việc và mục tiêu còn sau tải lại. |
| MP03 | Hoàn thành một việc | 1/39, 90 phút; thông báo chỉ sau lưu. |
| MP04 | Bỏ hoàn thành | Trở về chưa hoàn thành, thông báo đúng. |
| MP05 | Đánh dấu lại | Vẫn chỉ 1 việc đang hoàn thành; Activity hiển thị 1, không cộng lại lần đã undo. |
| MP06 | Stats | Tổng 3270 phút, đã xong 90 phút; tuần 1 là 1/3, toàn plan 1/39. |
| MP07 | Thêm việc trống | Chặn vì thiếu tiêu đề và yêu cầu. |
| MP08 | Phút 0 và tuần âm | Chặn với lỗi cụ thể, không ghi. |
| MP09 | Thêm việc 120 phút, Thứ Năm | Có cảnh báo vượt 60 phút; lưu được, nhóm theo đúng ngày. |
| MP10 | Ghi chú chứa thẻ HTML | Hiển thị nguyên văn `<b>không phải HTML</b>`, không dựng HTML. |
| MP11 | Sửa tiêu đề/phút/ngày rồi Hủy | Giữ tiêu đề và ngày đã lưu ban đầu. |
| MP12 | Lưu sửa thành 45 phút, Thứ Sáu | Đúng tiêu đề/ngày, task không bị nhân đôi. |
| MP13 | Chuyển về chưa xếp lịch | Việc còn trong backlog; không còn lịch ngày/tuần. |
| MP14 | Xếp lại backlog vào tuần 2, Thứ Ba | Việc xuất hiện ở đúng tuần/ngày. |
| MP15 | Tạm xóa tuần trong form rồi điền lại | Ngày học bị khóa khi tuần trống nhưng lựa chọn Thứ Bảy được giữ khi điền tuần lại; Hủy không ghi. |
| MP16 | Preview chốt tuần rồi Hủy | Tuần vẫn mở; không dời việc. |
| MP17 | Chốt tuần 1, dời việc chưa xong | 2 việc/150 phút sang tuần 2; cảnh báo vượt 165 phút tại đích đúng. |
| MP18 | Tuần đã chốt | Checkbox chỉ đọc, không có sửa/thêm; Chốt tuần bị khóa. Snapshot vẫn 1/3 trước khi dời việc. |
| MP19 | Chốt tuần 2 về backlog | 6 việc còn nguyên trong backlog. |
| MP20 | Chốt tuần 3 bằng Bỏ qua | 4 việc skipped; không đưa vào mẫu số tiến độ. |
| MP21 | Stats sau ba cách chốt | 3 tuần đã chốt, 1/36 việc, 90/3015 phút; khớp với thêm/sửa/skipped. |
| MP22 | Weeks | Giữ snapshot tuần 1 = 1/3, tuần 2 = 0/6, tuần 3 = 0/4. |
| MP23 | Tạo plan thứ hai và chuyển qua lại | Hai plan giữ độc lập; activePlanId của plan đầu còn sau reload. |
| MP24 | Preview tạo lại rồi hủy | Lần preview tiếp theo vẫn thấy 40 việc cũ, chưa đổi plan. |
| MP25 | Xác nhận tạo lại | 40 → 35 việc; giữ 1 việc hoàn thành, 1 việc tùy chỉnh trong backlog, ghi chú và lịch sử. |
| MP26 | Xem phiên bản lịch sử thật | Checkbox cũ bị khóa; quay lại phiên bản hiện tại và backlog thấy việc QA đã sửa còn. |

## My Plan với callback lỗi giả lập

Chạy fixture riêng, dùng component/domain thật và lưu giả trong RAM. Đây là kiểm thử nhánh giao diện, không phải bằng chứng đã gây mất mạng hoặc quota trên Supabase thật.

| Mã | Tình huống | Kết quả thực tế |
|---|---|---|
| MP27 | Callback trả storage failure | Commit vẫn 0, checkbox chưa hoàn thành, các thao tác ghi bị khóa; Retry ghi đúng một lần. |
| MP28 | Callback ném exception | Lỗi an toàn, plan cũ còn, có Retry/Bỏ thay đổi. |
| MP29 | Bỏ pending, giữ rồi xác nhận bỏ | Hủy xác nhận giữ pending; xác nhận bỏ không tăng commit và mở lại thao tác. |
| MP30 | Conflict rồi caller lưu chung | Plan mới được nhận, pending cũ được giải phóng; thao tác kế tiếp dùng dữ liệu mới. |
| MP31 | Callback trì hoãn 1.5 giây | Trong lúc lưu, Thêm việc bị khóa; chỉ tăng một attempt/commit. |
| MP32 | Archived | Không có Thêm việc, checkbox đều bị khóa. |
| MP33 | History | Checkbox đều bị khóa ở phiên bản lịch sử. |
| MP34 | Loading | Hiển thị Đang tải kế hoạch, không dựng kế hoạch mặc định giả. |
| MP35 | Load error → tải lại | Có lỗi và nút Tải lại; callback đưa về màn hình plan. |
| MP36 | Empty | Hiển thị Chưa có kế hoạch. |
| MP37 | Form thêm việc lưu lỗi → retry | Giữ tiêu đề đang nhập; tasks 39 → 40 đúng một lần, commits 3 → 4; không nhân đôi. |
| MP38 | Form lưu lỗi → Hủy → xác nhận bỏ | Field bị khóa khi pending, có xác nhận bỏ; tasks vẫn 40, commit vẫn 4. |

## Mobile và các hồi quy liên quan

- **MP39 đạt:** My Plan ở 390 × 844, document width 375 px; form dialog rộng 354 px, clientWidth/scrollWidth cùng 337 px. Không tràn ngang; nội dung dài cuộn trong dialog. Native form và lựa chọn ngày/tuần có đầy đủ.
- Chrome không áp dụng viewport override trong phiên này dù công cụ nhận lệnh; không ghi là đã kiểm tra mobile bằng Chrome. Kiểm tra mobile thực thực hiện trong trình duyệt nội bộ, có xác nhận `innerWidth = 390`.
- Explore: trước sửa chọn Chưa chọn ngành kéo khoa về rỗng. Sau sửa giữ được cả Công nghệ Phần mềm và Khoa học Máy tính. Chọn Bỏ qua ở khoa vẫn về rỗng và khóa bộ lọc liên quan ngành.
- My roadmap: thông báo thiếu OOP/DSA dùng tên người đọc được; đánh dấu hai chặng đã biết khi không chọn học vẫn tạo được kế hoạch mới.
- Profile: lưu tên QA Công Định và Asia/Tokyo, reload còn; nhập tên khác rồi Hủy trở về tên đã lưu. Activity sau done/undo/redo hiển thị đúng 1 việc hoàn thành.

## Kiểm thử tự động và minh chứng

- `npm run check`: đạt, gồm cấu trúc, 16 Context checks, tích hợp 50/50 track, account/SQL và các lỗi persistence đã có.
- `npm run check:team`: đạt. Đây là kiểm thử logic/renderer đã có, không thay cho 39 trường hợp UI ở trên.
- Riêng `node scripts/tasks/MW-TEAM-03.mjs`: **42/42 đạt**. Log: `D:/IS207/artifacts/qa-dinh-2026-10-11/my-plan-domain.txt`.
- `npm run build`: đạt. Vite vẫn cảnh báo bundle app >500 KB, chưa thay ngưỡng để che cảnh báo.
- Ảnh mobile đã kiểm tra: `D:/IS207/artifacts/qa-dinh-2026-10-11/my-plan-mobile.png` và `my-plan-mobile-form.png`.
- Source thay đổi: Explore, MyRoadmap, planner (chỉ thông báo), ProfileV2, StudyActivity và CSS. Không đổi hợp đồng/schema, ID, dữ liệu cũ hoặc thuật toán tiên quyết.

## Cách chạy lại lỗi lưu

1. Chạy Vite ở một cổng QA riêng, giữ Guest; không dùng cổng đang chứa dữ liệu cá nhân để reset thử nghiệm.
2. Mở `/docs/tasks/MW-QA-20261011/tests/my-plan.html` trên bản dev.
3. Bấm QA return/throw/conflict/delay trước thao tác hoàn thành hoặc thêm việc; xem attempts/commits và bản UI còn nguyên.
4. Thử Retry, Bỏ thay đổi, giữ/hủy xác nhận; thử QA shared retry khi pending từ thao tác hoàn thành ngoài dialog.
5. QA loading/load error/empty/archive/history kiểm tra các trạng thái còn lại. Fixture không lưu dữ liệu qua reload.

AI hỗ trợ đọc báo cáo, đối chiếu contract/luồng, tái hiện giao diện, sửa phạm vi nhỏ và ghi kết quả. Công Định là người phát hiện/đề xuất các nhận xét gốc. Không ghi các đề xuất biên tập là lỗi thuật toán; không ghi kết quả chưa chạy là đạt.
