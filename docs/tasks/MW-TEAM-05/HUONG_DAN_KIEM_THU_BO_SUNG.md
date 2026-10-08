# MW-TEAM-05 — kiểm thử bổ sung load/save

## Phạm vi

Bổ sung bằng chứng cho hai tab thật, blocked, abort và thời điểm trả success. Quota dùng lỗi được tạo có kiểm soát, không phải thử làm đầy ổ đĩa. Không thay đổi adapter hoặc mã Context. Chỉ dùng database QA có UUID; không xóa storage thật.

Gói này chỉ chứa file mới trong `docs/tasks/MW-TEAM-05/`. Giữ nguyên các file code và QA log đã có. Nếu nhóm đã có `FLOW_LOAD_SAVE.md`, đối chiếu rồi ghép nội dung thay vì ghi đè.

## Mở trang

Trong terminal ở thư mục dự án và nhánh `feat/mw-team-05`, chạy:

```powershell
npm run dev -- --port 5174
```

Nếu server đang chạy, dùng URL của server đó. Mở:

`http://127.0.0.1:5174/docs/tasks/MW-TEAM-05/indexeddb-extra.html`

Dùng Vite dev server để chạy file TypeScript; không mở HTML trực tiếp bằng `file://` và không dùng bản `dist` cũ.

## Bốn kiểm thử lỗi và transaction

Bấm **Chạy 4 kiểm thử bổ sung** ở mục 2. Copy toàn bộ kết quả, kể cả TRACE và tên database QA. Kết quả kỳ vọng là `4 PASS / 0 FAIL`, nhưng chỉ ghi PASS khi thực tế chạy ra kết quả đó.

- Success: quan sát `transaction.complete` trước khi Promise save trả kết quả thành công.
- Abort: gọi abort trên transaction thật sau put.success; kiểm tra rollback, giữ input và retry.
- Quota: tạo `QuotaExceededError` tại put của DB QA; kiểm tra mã lỗi, giữ disk/input và retry. Đây là fault injection đồng bộ, chưa bao phủ quota thật hoặc lỗi quota bất đồng bộ của trình duyệt.
- Blocked: giữ connection v1 và chuyển riêng yêu cầu mở DB QA sang v2 để tạo blocked thật; kiểm tra mở muộn bị hủy, DB vẫn v1 và dữ liệu còn nguyên. Adapter ứng dụng vẫn dùng v1.

Các thao tác can thiệp API chỉ áp dụng cho tên DB QA tương ứng và được khôi phục trong finally. Không chạy đồng thời các thao tác khác trong cùng trang khi suite đang chạy.

## Hai tab thật

1. Mở trang test mới không có tham số `session`; trang tạo một phiên QA riêng.
2. Ở mục 1, bấm **Mở tab B cùng phiên kiểm thử**. Hai tab phải cùng tên database, khác page ID.
3. Bấm **Tải snapshot** ở cả A và B. Cả hai phải tải revision 0 trước khi lưu.
4. Ở A, bấm **Lưu snapshot**, đợi SUCCESS revision 0 → 1.
5. Ở B, đợi dòng quan sát A đã save xuất hiện, rồi bấm **Lưu snapshot**. Kỳ vọng conflict và dòng `PASS hai tab thật`.
6. Copy output của cả hai tab. Không bấm tải lại B giữa bước 3 và 5 vì sẽ làm mất snapshot stale cần kiểm tra.

BroadcastChannel chỉ truyền quan sát, không thay snapshot của tab B. Kiểm thử xác nhận tab stale không ghi đè disk của A và candidate chưa lưu vẫn nguyên. Đây là hai tab trình duyệt thật nhưng thao tác save theo thứ tự, không tuyên bố hai transaction bắt đầu đồng thời.

## Ghi QA log

Sau khi chạy, bổ sung kết quả thực vào `QA_AI_LOG.md`: ngày, trình duyệt/phiên bản, branch/SHA, URL local, tên DB QA, output của 4 test và hai tab. Nêu rõ quota là injection và blocked là upgrade có kiểm soát. Nếu FAIL hoặc timeout, giữ nguyên output để điều tra; không xóa DB để biến FAIL thành PASS.

Người hỗ trợ đã kiểm tra TypeScript của trang bổ sung; chưa chạy xác nhận native trên trình duyệt ở môi trường hỗ trợ. Kết quả native cần lấy từ lần chạy của người làm/reviewer.

Load/save bổ sung không hoàn tất toàn bộ MW-TEAM-05. Migration, backup/import, validator semantic và các content track vẫn cần đối chiếu TASK/review của nhóm trưởng.
