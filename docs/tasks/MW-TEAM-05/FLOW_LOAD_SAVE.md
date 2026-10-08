# MW-TEAM-05 — user story và luồng load/save

Tài liệu này chỉ mô tả phần load/save đã bàn giao; không thay thế luồng migration, backup/import và content còn lại trong TASK.

## User story

- LS-01: Người học muốn mở lại workspace đã lưu để tiếp tục dùng profile, plans và drafts. Nếu chưa có bản lưu, nhận workspace rỗng mà không tự ghi defaults.
- LS-02: Người học muốn lưu thay đổi và chỉ nhận thành công khi transaction đã commit.
- LS-03: Khi một tab khác đã lưu trước, người học muốn được báo conflict và giữ bản chưa lưu để có thể xử lý tiếp.
- LS-04: Khi lưu gặp lỗi, người học muốn dữ liệu cũ còn nguyên, candidate không bị sửa và có thể thử lại.

## Load

1. Caller gọi loadWorkspace.
2. Adapter mở IndexedDB, đọc key local trong store workspace.
3. Không có dữ liệu: trả workspace rỗng, không ghi defaults.
4. Có dữ liệu hợp lệ: trả workspace đã lưu.
5. Dữ liệu hỏng/schema tương lai hoặc không mở/đọc được DB: trả lỗi; không reset database.

Bằng chứng: suite indexeddb-tests và suite Context native đã được người làm chạy. Hai suite có phạm vi khác nhau; xem QA_AI_LOG để biết kết quả thực.

## Save thành công

1. Caller gửi candidate và expectedRevision.
2. Adapter kiểm tra đầu vào, tạo bản sao để không sửa object của caller.
3. Trong cùng readwrite transaction: đọc bản đang lưu, kiểm tra revision của disk và candidate với expectedRevision.
4. Nếu hợp lệ, ghi bản mới có revision tăng một.
5. Chỉ trả success khi transaction.complete. Caller mới dùng kết quả thành công để cập nhật trạng thái đã lưu.

Bằng chứng bổ sung dự kiến: test complete trong indexeddb-extra. Không ghi PASS trước khi chạy.

## Conflict giữa hai tab

1. A và B cùng tải revision r, giữ snapshot riêng.
2. A lưu thành công, disk chuyển thành r+1.
3. B lưu candidate từ r với expectedRevision r.
4. Adapter đọc disk r+1, trả conflict, không ghi đè.
5. Caller giữ bản B chưa lưu. Trong luồng Context đã kiểm tra, plan đề xuất không được kích hoạt khi save conflict.

Bằng chứng bổ sung dự kiến: mục Hai tab thật trong indexeddb-extra. Suite cũ dùng hai writer trong cùng trang; không coi đó là bằng chứng hai tab.

## Lỗi lưu và retry

1. Đọc/ghi/transaction gặp lỗi hoặc abort: trả lỗi thay vì success.
2. Không sửa candidate của caller; transaction abort không để lại bản ghi chưa commit.
3. Caller giữ candidate để thử lại. Nếu tab khác thay đổi revision trong thời gian đó, retry có thể conflict và phải xử lý theo luồng conflict.

Bằng chứng bổ sung dự kiến: native abort và quota injection trong indexeddb-extra. Quota injection không chứng minh tình huống disk thật đầy.

## Hủy

Adapter load/save không cung cấp API hủy thao tác đang commit. Hủy preview/tạo lại và xác nhận bỏ bản chưa lưu thuộc Context; các kiểm tra Context được ghi riêng trong QA log. Không suy diễn rằng adapter có thể undo transaction đã commit.
