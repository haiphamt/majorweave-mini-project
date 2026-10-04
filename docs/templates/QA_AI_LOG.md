# Kiểm thử và AI log — <TASK-ID>

## Môi trường

- Commit SHA / branch / ngày chạy / người chạy:
- App URL / trình duyệt / viewport hoặc môi trường logic:
- Dữ liệu test và cách giữ dữ liệu học thật:

## Test cases

| Mã | AC / luồng / nhánh | Điều kiện & input | Các bước cụ thể | Kết quả mong đợi | Kết quả thực | Trạng thái | Minh chứng |
|---|---|---|---|---|---|---|---|
| TC-<TASK-ID>-01 | AC-01 / FL-… S1–S… | | | | | Chưa chạy | |
| TC-<TASK-ID>-02 | AC-02 / FL-… E1 | | | | | Chưa chạy | |

Trạng thái: **Chưa chạy / Pass / Fail / Blocked**. Blocked cần lý do. Kiểm tra luồng chính, input rỗng/sai/biên, hủy, lưu lỗi và reload theo phạm vi; với nhiều nhánh ghi từng nhánh đã chạy. Pass chỉ sau khi so kết quả thực với mong đợi. Screenshot/build không thay kiểm thử logic/lưu.

## Lệnh kiểm tra

| Lệnh / phép kiểm tra | Đã chạy lúc nào / SHA | Kết quả thực / log | Phạm vi chứng minh |
|---|---|---|---|
| `npm run check` | | Chưa chạy | ID/quan hệ/tiên quyết/ranh giới đã đăng ký |
| `npm run build` | | Chưa chạy | TypeScript/build |
| <test logic hoặc UI của task> | | Chưa chạy | |

## Bug log

### BUG-<TASK-ID>-01 — <tên lỗi thật nếu tìm thấy>

- Môi trường/input/bước tái hiện:
- Mong đợi / thực tế / ảnh hoặc assertion lỗi:
- Nguyên nhân sau điều tra:
- Cách sửa / file / SHA:
- Test chạy lại và kết quả:

Không bịa bug để đủ báo cáo. Nếu chưa thấy lỗi, ghi đúng “chưa phát hiện trong phạm vi đã chạy”. Giữ bằng chứng lỗi thật khi có.

## AI Development Log

| Ngày / vòng | Công cụ / model thực dùng | Mục tiêu & prompt chính | Output ban đầu | Người kiểm tra phát hiện gì | Chỉnh prompt/code thế nào | Test / SHA sau chỉnh |
|---|---|---|---|---|---|---|
| | | | | | | |

Không ghi tên công cụ/model chưa dùng, không đưa secret vào prompt/log. Nêu ít nhất một kết quả AI đã được đọc/kiểm tra có lý do trong phần của mình. Tổng số log và yêu cầu báo cáo nhóm đối chiếu Product Brief/hướng dẫn môn; không buộc mỗi thành viên bịa đủ số vòng.

## So sánh hai công cụ AI — chỉ task nhóm chọn

Nhóm chọn một bài nhỏ chung để thực hiện đúng yêu cầu đối chiếu; không mỗi bạn tự làm thêm một thử nghiệm lớn.

- Task/prompt/input/tiêu chí giữ giống nhau:
- Công cụ A, output, cách kiểm tra, kết quả:
- Công cụ B, output, cách kiểm tra, kết quả:
- Khác biệt quan sát được / chọn gì và vì sao:

## Kết luận bàn giao

- Đã kiểm chứng:
- Chưa chạy / chưa tích hợp / cần nhóm trưởng quyết định:
- Link PR và bằng chứng:
