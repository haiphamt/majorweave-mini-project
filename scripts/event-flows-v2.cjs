const flow=(id,name,page,condition,trigger,steps,end,alternatives)=>({id,name,group:'Workspace v2',page,condition,trigger,steps,end,alternatives,kind:'linear'});
module.exports=[
  flow('EF29','Chọn nhánh và tạo plan v2','Lộ trình của tôi','Workspace đã tải; draft hợp lệ.','Tạo kế hoạch mới',[
    ['Chọn nhánh, chặng và nguồn','18 hướng / 50 cấu hình'],['Kiểm tra draft và sinh lịch','Tiên quyết, giờ/tuần, ngày'],['Chờ transaction hoàn tất','Tạo ID mới, giữ plan cũ']],['Plan mới được lưu','Mở Kế hoạch để tiếp tục'],['Draft lỗi: hiển thị lỗi, không ghi.','Save lỗi: giữ candidate để retry hoặc xuất.']),
  flow('EF30','Tạo lại có preview/history','Lộ trình của tôi','Có active plan và draft hợp lệ.','Xem trước tạo lại',[
    ['Sinh preview và đối chiếu','Chưa sửa plan đã lưu'],['Chọn xác nhận hoặc hủy','Hủy không ghi'],['Lưu bản mới và history','Chỉ cập nhật sau commit']],['Plan được tạo lại','Giữ completion phù hợp'],['Plan/draft thay đổi: báo conflict, xem lại preview.','Lưu lỗi: giữ proposal, không báo success.']),
  flow('EF31','Hoàn thành và undo v2','Kế hoạch','Plan đang xem và tuần còn mở.','Đổi dấu hoàn thành',[
    ['Tạo completion hoặc undo','Giữ ngày/timezone lần ghi'],['Lưu với expected revision','Không ghi đè tab mới'],['Cập nhật plan và nhịp học','Chờ lưu xong trước reload']],['Tiến độ được cập nhật','Completion ledger giữ lịch sử'],['Save lỗi: giữ candidate, retry hoặc bỏ có xác nhận.','Snapshot tuần chốt chỉ đọc.']),
  flow('EF32','Chốt tuần và giữ snapshot','Kế hoạch','Tuần mở, chưa có candidate chờ.','Chốt tuần',[
    ['Xem việc xong/chưa xong','Snapshot trước xử lý'],['Chọn xử lý việc chưa xong','Dời tuần / backlog / skip'],['Xác nhận và lưu plan','Hủy giữ tuần mở']],['Tuần đã chốt chỉ đọc','Thống kê / Các tuần đọc kết quả chốt'],['Lỗi/conflict: không chốt âm thầm.','Không có tuần đích hợp lệ: từ chối.']),
  flow('EF33','Lưu Profile và timezone','Hồ sơ','Workspace đã tải.','Lưu hồ sơ',[
    ['Sửa tên, ngành, múi giờ','Validate IANA và tên'],['Lưu qua callback chung','Chờ transaction complete'],['Cập nhật hồ sơ/nhịp học','Ngày completion cũ giữ']],['Hồ sơ được giữ khi reload','Không cần đăng nhập'],['Hủy: trả form về profile đã lưu.','Giá trị sai/lưu lỗi: giữ form và báo lỗi.']),
  flow('EF34','Xuất và nhập backup v2','Hồ sơ','Workspace đã tải; chọn JSON hợp lệ.','Xem trước nhập file',[
    ['Kiểm tra file và phiên bản','Không lọc bỏ lỗi âm thầm'],['Chọn skip hoặc copy','Preview chưa ghi dữ liệu'],['Xác nhận rồi chờ commit','Giữ proposal nếu lỗi']],['Nhập giữ plan hiện có','Có thể xuất JSON để chuyển máy'],['Cancel không ghi; ID trùng mặc định skip.','File lỗi/version lạ: từ chối toàn bộ.','Save lỗi: retry cùng ID hoặc xuất proposal.']),
  flow('EF35','Chuyển dữ liệu v1 an toàn','Hồ sơ','Đọc được raw v1; draft đã lưu/bỏ.','Xem trước chuyển v1',[
    ['Đọc raw và fingerprint','Không sửa key nguồn'],['Xem preview và cảnh báo','Thiếu bối cảnh: cần bổ sung'],['Xác nhận append vào v2','Ghi migration fingerprint']],['Dữ liệu v1 được giữ','Chuyển lại không nhập trùng'],['Cancel không ghi.','Unknown IDs và completion thiếu ngày được giữ.','Lỗi/conflict giữ proposal để retry.']),
  flow('EF36','Lưu lỗi và hai tab','Workspace','Hai tab cùng DB, cùng revision ban đầu.','Tab cũ lưu thay đổi',[
    ['Tab A commit dữ liệu mới','Revision trên disk tăng'],['Tab B lưu với revision cũ','Phát hiện conflict'],['Giữ bản đang sửa của B','Retry / xuất / bỏ có xác nhận']],['Không ghi đè tab A','Không báo lưu thành công giả'],['Abort/quota: giữ candidate, disk nguyên.','Load lỗi không thay defaults rồi ghi đè.'])
];
