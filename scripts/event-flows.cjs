// Each record describes an observable use case in the current prototype.
// Diagrams are generated as static HTML/SVG, not evaluated in the browser.
const linear = (id, name, group, page, condition, trigger, steps, end, alternatives = []) => ({ id, name, group, page, condition, trigger, steps, end, alternatives, kind: 'linear' });
const choice = (id, name, group, page, condition, trigger, action, decision, success, end, alternative, options = {}) => ({ id, name, group, page, condition, trigger, steps: [action, success], end, alternatives: [alternative], kind: 'choice', decision, ...options });
module.exports = [
  linear('EF01', 'Chọn khoa và ngành hiện tại', 'Khám phá', 'Explore', 'Đang ở Explore; có thể chưa chọn ngành.', 'Đổi khoa / ngành trong hồ sơ', [
    ['Sinh viên chọn khoa, rồi chọn ngành', 'Đổi khoa chọn ngành đầu tiên của khoa mới'],
    ['Website ưu tiên các hướng liên quan', 'Gần nền tảng → mở rộng → hướng khác'],
    ['Lưu ngành hiện tại', 'Bộ lọc khám phá khoa khác vẫn độc lập'],
  ], ['Hồ sơ và danh sách được cập nhật', 'Mọi hướng vẫn có thể khám phá'], [
    'Chọn “Chưa chọn / Bỏ qua”: không ưu tiên ngành; checkbox chỉ hướng gần ngành bị vô hiệu.',
    'Chương trình tiếng Anh, tài năng, Việt–Nhật được gộp về ngành gốc trong danh mục.',
  ]),
  linear('EF02', 'Khám phá hướng thuộc khoa khác', 'Khám phá', 'Explore', 'Explore đang mở; hồ sơ ngành hiện tại đã chọn hoặc bỏ qua.', 'Đổi “Khám phá theo khoa”', [
    ['Chọn khoa muốn tìm hiểu', 'Ví dụ: từ Phần mềm sang Kỹ thuật Máy tính'],
    ['Website lọc các hướng liên quan khoa', 'Có nền tảng chung hoặc có thể mở rộng'],
    ['Giữ nguyên ngành đang theo học', 'Không thay hồ sơ khi đổi bộ lọc'],
  ], ['Có danh sách để khám phá chéo khoa', 'Có thể trở về “Tất cả các khoa”'], [
    'Bộ lọc khoa kết hợp nhóm / tìm kiếm / chỉ hướng gần ngành có thể cho danh sách trống; dùng “Xóa bộ lọc hướng học”.',
  ]),
  choice('EF03', 'Tìm và lọc hướng học', 'Khám phá', 'Explore', 'Danh mục hướng học đã tải.', 'Nhập từ khóa hoặc đổi nhóm',
    ['Website áp dụng các bộ lọc', 'Khoa · nhóm · từ khóa · liên hệ ngành'],
    'Có hướng học khớp?', ['Hiển thị các thẻ hướng học', 'Ưu tiên liên hệ với ngành hiện tại'],
    ['Sinh viên mở hướng muốn tìm hiểu', 'Chỉ Backend có trải nghiệm đầy đủ'],
    ['Hiển thị trạng thái trống', 'Bấm xóa bộ lọc để xem lại toàn bộ'], { loop: true }),
  linear('EF04', 'Đọc bảng ngành → hướng học', 'Khám phá', 'Explore', 'Explore đang mở.', 'Mở “Xem bảng ngành → hướng học”', [
    ['Mở bảng 12 ngành', 'Có nhóm gần nền tảng và hướng mở rộng'],
    ['Bấm tên ngành muốn kiểm tra', 'Đặt hồ sơ ngành và xóa lọc khoa / nhóm'],
    ['Website bật lọc hướng liên quan ngành', 'Tìm kiếm được xóa để thấy danh sách'],
  ], ['Đối chiếu danh mục ngay trên website', 'Có liên kết thông tin ngành tại UIT'], [
    'Đóng bảng: giữ các lựa chọn hiện tại.',
    'Những nhãn liên hệ do nhóm biên soạn, không phải kết quả đánh giá phù hợp cá nhân.',
    'Ngành Thiết kế Vi mạch có thông báo chưa có roadmap chuyên biệt trong danh mục đã đối chiếu; có thể khám phá ngành khác.',
  ]),
  choice('EF05', 'Mở chi tiết hoặc tổng quan hướng', 'Khám phá', 'Explore → Path Detail / hộp thoại', 'Có ít nhất một hướng trong kết quả.', 'Bấm nút trên thẻ hướng học',
    ['Website nhận hướng đã bấm', 'Phân biệt hướng hoàn chỉnh và tổng quan'],
    'Là hướng Backend?', ['Đi đến Path Detail', 'Kỹ năng · nguồn học · chứng nhận'],
    ['Có thể tùy chỉnh roadmap Backend', 'Luồng chi tiết tiếp tục tại đây'],
    ['Mở tổng quan của đúng hướng', 'Nền tảng và ngành liên quan; có thể đóng'], { noEnd: true }),
  linear('EF06', 'Mở roadmap tham khảo trên roadmap.sh', 'Roadmap tham khảo', 'Explore / Path Detail', 'Đã mở tổng quan hướng hoặc đang xem Backend; liên kết ngoài hiển thị.', 'Bấm một nút roadmap.sh', [
    ['Website mở đúng liên kết ở tab mới', 'Đúng hướng theo nút đã chọn'],
    ['Sinh viên xem bản đồ trên roadmap.sh', 'Tương tác diễn ra ở website nguồn'],
    ['Quay lại tab MajorWeave', 'Giữ hồ sơ, kỹ năng và nguồn đã chọn'],
  ], ['Tiếp tục khám phá hoặc học Backend', 'Không tự đồng bộ tiến độ từ roadmap.sh'], [
    'Mạng hoặc website ngoài không truy cập được: MajorWeave vẫn giữ trạng thái; có thể mở lại link sau.',
    'Nếu trình duyệt chặn tab mới, sinh viên có thể mở liên kết bằng thao tác của trình duyệt.',
  ]),
  linear('EF07', 'Mở và đóng một chặng học', 'Nguồn học', 'Path Detail / My Roadmap', 'Chặng nằm trong danh mục Backend.', 'Bấm tên hoặc thẻ kỹ năng', [
    ['Website mở khung chi tiết chặng', 'Mục tiêu · nguồn học · bài thực hành'],
    ['Sinh viên xem nguồn và kỹ năng', 'Có thể đổi nguồn hoặc đánh dấu đã biết'],
    ['Đóng bằng nút, Escape hoặc ngoài khung', 'Quay lại trang trước; giữ thay đổi đã chọn'],
  ], ['Tiếp tục xem roadmap', 'Đóng khung không hủy các thay đổi đã lưu'], [
    'Khung nguồn học cuộn riêng trên điện thoại.',
  ]),
  choice('EF08', 'Lọc nguồn học trong một chặng', 'Nguồn học', 'Khung chi tiết chặng', 'Đã mở một chặng Backend.', 'Chọn miễn phí / tiếng Việt / chứng nhận',
    ['Website lọc nguồn của chặng hiện tại', 'Không trộn tài liệu từ chặng khác'],
    'Có nguồn học khớp?', ['Hiển thị các nguồn phù hợp bộ lọc', 'Có thể mở hoặc chọn một nguồn'],
    ['Sinh viên chọn nguồn để học', 'Ưu tiên chỉ giới hạn cách hiển thị'],
    ['Thông báo không có nguồn khớp', 'Bấm “Xem tất cả nguồn” để đổi lọc'], { loop: true }),
  linear('EF09', 'Chọn hoặc đổi nguồn cho một chặng', 'Nguồn học', 'Khung chặng / My Roadmap', 'Có nguồn thuộc đúng chặng đang chỉnh.', 'Bấm “Chọn nguồn này” hoặc đổi nguồn', [
    ['Ghi nhận nguồn của đúng chặng', 'Mỗi chặng dùng một nguồn chính'],
    ['Hiển thị trạng thái nguồn đã chọn', 'My Roadmap phản ánh lựa chọn này'],
    ['Lưu lựa chọn trên trình duyệt', 'Kế hoạch đã tạo chưa đổi tự động'],
  ], ['Nguồn được dùng khi tạo kế hoạch', 'Tạo lại lịch nếu muốn cập nhật lịch cũ'], [
    'Chọn nguồn khác thay nguồn chính của chặng; không xóa kỹ năng khác.',
    'Mở đường dẫn tài liệu chỉ để xem; việc đó không đồng nghĩa đã chọn nguồn.',
  ]),
  choice('EF10', 'Tìm trong thư viện tài nguyên', 'Nguồn học', 'Path Detail → Nguồn học', 'Đang ở tab Nguồn học.', 'Nhập từ khóa hoặc chọn bộ lọc',
    ['Tìm trong tiêu đề, nền tảng và mô tả', 'Kết hợp bộ lọc tài nguyên'],
    'Có tài nguyên khớp?', ['Hiển thị danh sách tài nguyên', 'Có thông tin phí, ngôn ngữ, định dạng'],
    ['Mở tài liệu trên trang của nguồn', 'Muốn chọn nguồn: mở chặng tương ứng'],
    ['Thông báo tìm kiếm không có kết quả', 'Bấm “Xóa bộ lọc” để xem lại'], { loop: true }),
  linear('EF11', 'Đánh dấu kỹ năng đã biết / cần học', 'Roadmap cá nhân', 'Path Detail / My Roadmap', 'Có chặng muốn điều chỉnh; trình độ là một mẫu khởi đầu.', 'Đổi trình độ hoặc checkbox “Đã biết”', [
    ['Ghi nhận kỹ năng đã biết', 'Có thể sửa từng chặng sau khi đổi trình độ'],
    ['Cập nhật số chặng và thời gian dự kiến', 'Chặng đã biết được bỏ qua khi sinh lịch'],
    ['Lưu trạng thái kỹ năng', 'Kế hoạch hiện tại chưa đổi tự động'],
  ], ['Roadmap phù hợp nền tảng tự khai báo', 'Bỏ dấu đã biết để học lại chặng'], [
    'Tất cả chặng đã biết: tạo kế hoạch bị chặn; cần chọn ít nhất một chặng chưa biết.',
    'Đổi trình độ thay mẫu kỹ năng đã biết; sinh viên có thể chỉnh lại từng mục.',
  ]),
  linear('EF12', 'Thêm / bỏ / sắp xếp chặng', 'Roadmap cá nhân', 'Khung chặng / My Roadmap', 'Đang tùy chỉnh roadmap Backend.', 'Thêm chặng, bấm bỏ hoặc di chuyển lên / xuống', [
    ['Cập nhật chặng và thứ tự đã chọn', 'Thêm ở khung chặng; đổi thứ tự ở roadmap'],
    ['Website tính lại thời lượng và số tuần', 'Dựa trên những chặng chưa biết'],
    ['Lưu roadmap cá nhân', 'Chưa thay lịch học cũ cho đến khi tạo lại'],
  ], ['Có danh sách chặng theo lựa chọn', 'Nguồn từng chặng vẫn được giữ'], [
    'Chặng đầu không đi lên, chặng cuối không đi xuống: nút tương ứng bị vô hiệu.',
    'Bỏ tất cả chặng: hiện roadmap trống và link chọn chặng; không thể tạo kế hoạch.',
  ]),
  linear('EF13', 'Nhập mục tiêu, giờ học và ngày bắt đầu', 'Kế hoạch', 'My Roadmap', 'Có thể chỉnh các giá trị trước hoặc sau khi có lịch.', 'Đổi mục tiêu, giờ / tuần, ngày', [
    ['Sinh viên chỉnh ba thông tin kế hoạch', 'Mục tiêu · 2–20 giờ/tuần · ngày bắt đầu'],
    ['Website tính lại ước lượng lịch', 'Thời lượng bài thực hành là ước lượng'],
    ['Lưu lựa chọn để chuẩn bị tạo lịch', 'Không tự tạo hoặc thay thế lịch cũ'],
  ], ['Bấm tạo kế hoạch khi đã sẵn sàng', 'Thông tin đầu vào được kiểm tra khi tạo'], [
    'Mục tiêu trống, ngày không hợp lệ hoặc không có chặng cần học: luồng EF14 báo lỗi.',
  ]),
  choice('EF14', 'Tạo kế hoạch lần đầu', 'Kế hoạch', 'My Roadmap → My Plan', 'Chưa có kế hoạch; đang ở My Roadmap.', 'Bấm “Tạo kế hoạch của tôi”',
    ['Website kiểm tra dữ liệu đầu vào', 'Mục tiêu · ngày hợp lệ · chặng chưa biết'],
    'Dữ liệu hợp lệ?', ['Chia bài thực hành theo giờ mỗi tuần', 'Bỏ qua đã biết, giữ thứ tự và nguồn'],
    ['Lưu lịch và chuyển sang My Plan', 'Xem tuần đầu và bắt đầu học'],
    ['Báo lỗi ngay tại My Roadmap', 'Giữ lựa chọn để sửa rồi tạo lại'], { loop: true }),
  choice('EF15', 'Tạo lại kế hoạch đã có', 'Kế hoạch', 'My Roadmap → My Plan', 'Đã có việc trong kế hoạch; đầu vào mới hợp lệ.', 'Bấm tạo khi đã có kế hoạch',
    ['Website mở hộp thoại giải thích', 'Nêu dữ liệu giữ lại và dữ liệu thay thế'],
    'Đồng ý tạo lại?', ['Tạo lịch mới theo roadmap hiện tại', 'Giữ hoàn thành / ghi chú bài còn tồn tại'],
    ['Lưu và mở kế hoạch mới', 'Sử dụng nguồn và quỹ thời gian mới'],
    ['Giữ nguyên kế hoạch hiện tại', 'Hủy hoặc đóng khung không thay lịch'], { noEnd: true }),
  linear('EF16', 'Chọn tuần và chuyển tuần', 'Theo dõi học', 'My Plan', 'Kế hoạch có ít nhất một việc.', 'Chọn tuần hoặc nút trước / sau', [
    ['Sinh viên chọn tuần muốn xem', 'Danh sách tuần hoặc nút điều hướng'],
    ['Website hiển thị việc của tuần', 'Ngày, tổng giờ và số việc đã hoàn thành'],
    ['Kiểm tra quỹ thời gian của tuần', 'Hiện cảnh báo nếu chỉnh sửa làm vượt giờ'],
  ], ['Có danh sách việc của tuần đã chọn', 'Đổi tuần không tự đánh dấu hoàn thành'], [
    'Tuần đầu / cuối: vô hiệu nút đi ra ngoài kế hoạch.',
    'Tuần trống: hiện thông báo và cho phép thêm việc.',
  ]),
  linear('EF17', 'Mở nguồn học từ công việc', 'Theo dõi học', 'My Plan', 'Công việc có nguồn học trong danh mục.', 'Bấm “Mở nguồn học” dưới công việc', [
    ['Mở nguồn đúng với chặng của công việc', 'Liên kết dùng nguồn khi kế hoạch được tạo'],
    ['Sinh viên học trên website nguồn', 'Tab MajorWeave giữ kế hoạch hiện tại'],
    ['Quay lại và tự đánh dấu hoàn thành', 'Website không quan sát tiến độ bên ngoài'],
  ], ['Tiếp tục theo dõi học tại My Plan', 'Chỉ mở tài liệu chưa làm tiến độ tăng'], [
    'Việc tự thêm không có nguồn mặc định: không hiển thị link nguồn học.',
    'Nguồn ngoài không truy cập được: lịch và tiến độ MajorWeave vẫn được giữ.',
  ]),
  linear('EF18', 'Hoàn thành / bỏ hoàn thành một việc', 'Theo dõi học', 'My Plan', 'Kế hoạch có việc cần cập nhật.', 'Bấm checkbox của công việc', [
    ['Ghi nhận hoàn thành hoặc cần làm lại', 'Thêm ngày hoàn thành; bỏ dấu thì xóa ngày'],
    ['Cập nhật tiến độ và lịch hoạt động', 'Số việc, phần trăm và ngày có hoạt động'],
    ['Lưu trạng thái và hiện thông báo', 'Việc và ghi chú khác vẫn giữ nguyên'],
  ], ['Tải lại vẫn thấy tiến độ đã lưu', 'Bỏ dấu để tiếp tục việc chưa xong'], [
    'Nếu mọi việc trong tuần hoàn thành: hiển thị thông báo tuần đã xong.',
    'Lỗi lưu trên thiết bị: trạng thái “Chưa lưu được” theo EF24; có thể mất thay đổi khi tải lại.',
  ]),
  choice('EF19', 'Sửa việc, ghi chú và chuyển tuần', 'Theo dõi học', 'My Plan → hộp thoại chỉnh việc', 'Có công việc cần chỉnh; bản nháp chỉnh sửa chưa ảnh hưởng lịch.', 'Bấm biểu tượng sửa của công việc',
    ['Chỉnh tên, phút, ghi chú và tuần đích', 'Tên có nội dung; 15–1200 phút, bước 15'],
    'Bấm lưu, dữ liệu đúng?', ['Lưu việc và mở tuần đích', 'Giữ trạng thái hoàn thành của công việc'],
    ['Hiển thị lịch và tiến độ cập nhật', 'Cảnh báo nếu tuần vượt quỹ giờ'],
    ['Chưa áp dụng thay đổi vào lịch', 'Sửa dữ liệu; hủy / đóng để bỏ bản nháp'], { loop: true }),
  choice('EF20', 'Thêm công việc cá nhân', 'Theo dõi học', 'My Plan', 'Đang xem một tuần; việc mới được thêm vào tuần đó.', 'Bấm “Thêm một việc nhỏ”',
    ['Nhập việc và chọn thời lượng', '30, 60, 90 hoặc 120 phút'],
    'Tên việc có nội dung?', ['Thêm việc mới vào tuần đang xem', 'Việc chưa hoàn thành và chưa có nguồn'],
    ['Lưu và cập nhật tổng giờ của tuần', 'Cảnh báo khi tổng giờ vượt quỹ tuần'],
    ['Giữ form để nhập tên công việc', 'Có thể hủy; chưa thêm việc vào lịch'], { loop: true }),
  linear('EF21', 'Lưu / bỏ lưu mục tiêu chứng nhận', 'Chứng nhận', 'Path Detail → Chứng nhận', 'Đang xem danh mục chứng nhận Backend.', 'Bấm biểu tượng bookmark của thẻ', [
    ['Đổi trạng thái mục tiêu chứng nhận', 'Lưu nếu chưa lưu; bỏ lưu nếu đã lưu'],
    ['Website cập nhật biểu tượng và thông báo', 'Không cấp hoặc xác minh chứng nhận'],
    ['Lưu lựa chọn trên trình duyệt', 'Khi có My Plan: hiện mục tiêu đã lưu'],
  ], ['Có danh sách mục tiêu bổ trợ', 'Bỏ lưu không thay đổi lịch kỹ năng'], [
    'Chưa tạo kế hoạch: mục tiêu vẫn lưu ở tab Chứng nhận, My Plan hiện lời mời tạo lịch.',
  ]),
  linear('EF22', 'Xem điều kiện chứng nhận ở nguồn chính thức', 'Chứng nhận', 'Path Detail / My Plan', 'Thẻ chứng nhận có liên kết chính thức.', 'Bấm “Xem điều kiện” hoặc mục tiêu đã lưu', [
    ['Website mở trang của đơn vị cấp', 'Liên kết mở tab mới'],
    ['Sinh viên xem phí và yêu cầu hiện hành', 'Đăng ký / thi diễn ra tại đơn vị cấp'],
    ['Quay lại MajorWeave', 'Không tự đổi trạng thái chứng nhận'],
  ], ['Có thông tin để quyết định học bổ trợ', 'Ứng dụng không thu phí hoặc đăng ký thi'], [
    'Hoàn thành roadmap mẫu không đồng nghĩa đạt điều kiện hoặc đạt chứng chỉ.',
  ]),
  choice('EF23', 'Tải lại và khôi phục dữ liệu', 'Lưu dữ liệu', 'Toàn website', 'Trình duyệt hỗ trợ đọc dữ liệu trên thiết bị.', 'Mở lại website hoặc tải lại trang',
    ['Đọc dữ liệu MajorWeave đã lưu', 'Kiểm tra phiên bản, kiểu dữ liệu và ID'],
    'Có dữ liệu hợp lệ?', ['Khôi phục các lựa chọn và kế hoạch', 'Chuẩn hóa giá trị theo danh mục hiện tại'],
    ['Hiển thị tiến độ đã lưu trên thiết bị', 'Không đồng bộ sang thiết bị khác'],
    ['Khởi tạo trạng thái mặc định', 'Chưa có hoặc hỏng dữ liệu thì bắt đầu mới'], { noEnd: true }),
  choice('EF24', 'Lưu thay đổi và xử lý lỗi lưu', 'Lưu dữ liệu', 'Toàn website', 'Có thay đổi hồ sơ, roadmap, công việc hoặc chứng nhận.', 'Website tự lưu sau thay đổi',
    ['Thử ghi dữ liệu trên trình duyệt', 'Dùng cùng một bộ dữ liệu của bản thử'],
    'Ghi dữ liệu thành công?', ['Hiển thị trạng thái “Đã lưu”', 'Thay đổi có thể khôi phục khi tải lại'],
    ['Tiếp tục thao tác trên website', 'Không cần nút lưu chung cho mọi thay đổi'],
    ['Hiển thị “Chưa lưu được”', 'Tạm giữ trong trang; tải lại có thể mất'], { noEnd: true }),
  linear('EF25', 'Xem nhịp học trong 12 tuần', 'Theo dõi học', 'Profile', 'Profile đã mở; có thể chưa tạo kế hoạch hoặc chưa hoàn thành việc.', 'Xem bảng hoặc bấm một ô ngày', [
    ['Đọc ngày hoàn thành của công việc', 'Dùng ngày ghi nhận, không dùng tuần dự kiến'],
    ['Đếm số việc cho từng ngày', 'Chỉ đếm việc hoàn thành và có ngày hợp lệ'],
    ['Hiện màu và chi tiết ngày được chọn', 'Xem ngày bằng chuột hoặc phím mũi tên'],
  ], ['Sinh viên xem nhịp học đã tự ghi nhận', 'Chuyển tuần không đổi ngày hoàn thành'], [
    'Chưa có việc hoàn thành có ngày: hiển thị bảng trống cùng gợi ý bắt đầu.',
    'Việc từ bản cũ chưa có ngày: giữ tiến độ và ghi rõ chưa được đưa vào biểu đồ.',
    'Ngày sắp tới bị vô hiệu; bỏ hoàn thành làm cập nhật lại số việc của ngày tương ứng.',
    'Biểu đồ tính các việc được giữ trong kế hoạch hiện tại; việc bị bỏ khi tạo lại không còn được tính.',
  ]),
  linear('EF26', 'Chọn / đổi nhánh Backend', 'Roadmap', 'Path Detail', 'Đang xem Backend; có ba lựa chọn Node.js, Python và Java.', 'Bấm một nhánh Backend', [
    ['Đổi ngôn ngữ và framework', 'Express · FastAPI · Spring Boot'],
    ['Cập nhật chặng và nguồn phù hợp', 'Giữ lựa chọn nền tảng chung'],
    ['Giữ kế hoạch đang học', 'Chỉ thay lịch sau khi xác nhận tạo lại'],
  ], ['Roadmap dùng nhánh mới được chọn', 'My Plan vẫn ghi đúng nhánh đã tạo'], [
    'Bấm nhánh đang chọn không thay dữ liệu.',
    'Khi đổi nhánh, không suy đoán rằng sinh viên đã biết ngôn ngữ mới; có thể sửa từng chặng đã biết.',
    'Nguồn chỉ dùng cho nhánh cũ được thay bằng nguồn phù hợp. Ngôn ngữ tài liệu Việt/Anh là lựa chọn độc lập.',
    'Các bài OOP, SQL, xác thực và triển khai theo nhánh khác được tạo mới, không tự nhận hoàn thành từ nhánh cũ.',
  ]),
  linear('EF27', 'Sửa hồ sơ học tập', 'Hồ sơ', 'Profile', 'Profile đã mở; hồ sơ được lưu trên trình duyệt này.', 'Nhập tên / ngành rồi bấm lưu', [
    ['Chỉnh tên hiển thị và ngành', 'Có thể để trống tên hoặc bỏ qua ngành'],
    ['Website lưu hồ sơ học tập', 'Tên cập nhật ở avatar và Profile'],
    ['Ưu tiên hướng theo ngành mới', 'Explore vẫn cho khám phá chéo khoa'],
  ], ['Hiển thị thông báo đã lưu hồ sơ', 'Kế hoạch đang học được giữ nguyên'], [
    'Tên tối đa 60 ký tự; ngành chỉ chọn từ danh mục.',
    'Đi sang trang khác trước khi lưu: phần sửa hồ sơ chưa được áp dụng.',
    'Profile hiện chưa phải tài khoản Google; dữ liệu chưa được đồng bộ qua thiết bị.',
    'Lỗi lưu trên thiết bị được báo theo EF24.',
  ]),
  linear('EF28', 'Thêm các chặng nền tảng còn thiếu', 'Roadmap', 'Path Detail', 'Có OOP, DSA, mạng, OS hoặc hệ thống chưa nằm trong My Roadmap.', 'Bấm thêm nền tảng vào roadmap', [
    ['Xác định chặng nền tảng chưa thêm', 'Không thêm chặng đã có lần thứ hai'],
    ['Chèn các chặng vào roadmap', 'Theo thứ tự gợi ý, giữ chặng đang chọn'],
    ['Giữ việc và tiến độ của lịch cũ', 'Lịch chỉ đổi khi chủ động tạo lại'],
  ], ['Có thể chỉnh từng kỹ năng đã biết', 'Nguồn phù hợp nhánh hiện tại'], [
    'Nếu đủ năm chặng, nút thêm nền tảng không hiển thị.',
    'System Design là chặng mở rộng: chỉ thêm riêng khi muốn học, không thêm mặc định.',
    'Bản cũ giữ nguyên lựa chọn và kế hoạch khi tải lại; sinh viên tự bấm để bổ sung.',
  ]),
];
