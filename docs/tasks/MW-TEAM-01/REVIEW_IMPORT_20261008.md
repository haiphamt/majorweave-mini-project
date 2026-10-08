# Review và nhập clone MW-TEAM-01 — 08/10/2026

Người yêu cầu: Nguyễn Thị Quỳnh Hân. Công cụ review: Codex. Kết luận: **đã nhập phần code vào nhánh task trong repo mini; chưa đủ điều kiện Done hoặc merge main**.

## Nguồn và phạm vi nhập

- Repo Git: `majorweave-mini-project`, nhánh `feat/mw-team-01`, HEAD trước nhập `1565011`.
- Clone: `clone_majorweave-mw-team-01 (1)`; không có `.git`, nên không thể merge lịch sử Git của thư mục này. Nhập diff nội dung theo allowlist.
- Đã fetch origin. `origin/main` tại `dd67b67`; thay đổi mới so với baseline chỉ ở README.
- Nhập 11 file: ba pack FE/FS/UX, resolver, Explore, PathDetail, test task, TASK/FLOW/PROGRESS/QA_AI_LOG.
- Giữ backend.ts của repo Git: clone dùng bản cũ và sẽ làm mất 11 nguồn + 2 mục tiêu bổ sung. Bản giữ lại có 51 nguồn / 10 mục tiêu, ID và legacy maps không đổi.
- Không nhập package/lock/vite/metadata từ môi trường clone. Catalog v2 giống nhau giữa hai thư mục. Không sửa app/context, registry, CSS, contracts hay phần của bạn khác.
- Bản sao các file trước nhập nằm ở `artifacts/mw-team-01-import-20261008/` (gitignored). Thư mục clone giữ nguyên.
- `fix_ids.ps1` đã staged trước buổi review; không chạy, không đưa vào commit nhập.

## Phát hiện cần xử lý

| Mức | Phát hiện | Cách tái hiện / tác động | Chủ sở hữu |
|---|---|---|---|
| P1, đã sửa | PathDetail truyền ID chặng v2 vào drawer v1 | `openModule('language.javascript')` không khớp `modules` v1. Đã ánh xạ ngược qua legacyStageMap và dùng ID v1 cho trạng thái đã biết. Thử drawer Node/Python/Java đều mở đúng, console không có lỗi. | Hân |
| P1, còn | Nhánh FE/FS/UX không lưu draft | Chọn Angular rồi reload: trở lại React. Các lựa chọn nằm trong useState; chưa dùng Workspace v2. AC-05 chưa đạt. | Hân phối hợp Hải |
| P1, còn | Chưa chọn nguồn / thêm chặng vào draft cho FE/FS/UX | Drawer chỉ hiển thị bài và nút đóng. Chưa có hành động chọn nguồn, hủy chọn nguồn, thêm chặng; My Roadmap vẫn chỉ Backend. Chưa thể nghiệm thu luồng tạo plan của 14 nhánh mới. | Hân phối hợp Hải/Định |
| P1, còn | Resolver bỏ qua dữ liệu hỏng | Xóa resources FE / credentials FE / đảo stageIds: resolver đều trả `ok:true`. Thiếu validation nguồn, chứng nhận, prerequisite thiếu/vòng/thứ tự, ID trùng. Test hiện chỉ kiểm tra not_found và missing_stage. | Hân |
| P2, còn | Explore vẫn đọc catalog v1 | UI hiển thị 16 hướng; catalog v2 có 18 nhưng chưa được Explore sử dụng. Bản clone không chứng minh UI đủ 18 hướng/BA/AIE. | Hân phối hợp Hải |
| P2, còn | Chứng nhận Backend dùng ID v2 trong State v1 | Bookmark dùng `credential.*`, trong khi Profile v1 tra ID cũ; cần phối hợp ánh xạ/context, không suy ra bookmark đầy đủ ở mọi trang từ thao tác trên PathDetail. | Hân phối hợp Hải |
| Cổng check, có trước nhập | npm run check fail | docs/architecture/check-example.mjs:13 yêu cầu checkedAt 2026-10-03 cho cả nguồn bổ sung 2026-10-06. Cùng lỗi trước và sau nhập. Không sửa assertion ngoài task. | Hải |
| Phối hợp ID | FE/FS/UX thay một số ID/contentVersion đã có ở 1565011 | Các pack mới khớp nhau và 17 track resolve được; chưa có migration hoặc xác nhận consumer. Không đổi ID Backend. Cần Hải rà dependency trước tích hợp v2. | Hân/Hải và consumer |

## Kết quả thực chạy ở buổi review này

Môi trường: Windows, Node v24.21.0, Vite 6.4.3, Codex in-app browser, profile thử riêng tại `http://127.0.0.1:5173/#/explore`. Không reset/xóa dữ liệu học thật.

| Kiểm tra | Kết quả | Giới hạn |
|---|---|---|
| node scripts/tasks/MW-TEAM-01.mjs | Pass: catalog 6/12/18; đủ 17 track, bài/phút/portfolio/HTTPS/thứ tự; not_found và missing_stage | Không kiểm tra URL online, persistence hoặc mọi ca lỗi resolver |
| npm run build | Pass sau chạy ngoài sandbox | Lượt sandbox ban đầu fail EPERM realpath; TypeScript + Vite build thực tế đã hoàn tất |
| npm run check | Fail assertion ngày ở check-example.mjs:13 | Kiểm tra cấu trúc/ranh giới và lưu v1 đi trước đã pass; registry chỉ có Backend |
| UI: preview chọn nhánh | Pass hiển thị 3 Backend + 3 FE + 9 FS + 2 UX | Chưa chạy tạo plan → done → reload cho 17 nhánh |
| UI: drawer Backend | Pass Node/Python/Java sau sửa ID | Không nghiệm thu toàn bộ tương tác của mọi chặng |
| UI: drawer React | Pass hiển thị mục tiêu, bài/phút/acceptance và đóng | Chưa có chọn nguồn/draft cho FE |
| UI: bộ lọc nguồn | Pass tìm xyz123456 ra 0; xóa bộ lọc trở lại 20 nguồn React | Ảnh evidence/review-resources-20261008.jpg |
| UI: reload Angular | Fail: Angular → reload → React | Minh chứng lỗi AC-05 |
| Audit resolver dữ liệu hỏng | Fail: thiếu nguồn/chứng nhận hoặc đảo tiên quyết vẫn ok:true | Không gọi đây là Pass vì process audit thoát 0 |
| Xác minh online mọi nguồn/chứng nhận, responsive/keyboard/lỗi lưu | Chưa chạy đầy đủ | checkedAt và PASS cũ trong clone chưa được xác thực lại |

## Điểm bàn giao

Bản nhập là đầu vào review, không phải bản nghiệm thu. Hải cần xử lý cổng check, duyệt ID/contentVersion, đăng ký pack và nối callback/context v2; Hân cần hoàn thiện resolver và thao tác draft trong allowlist. Sau tích hợp kiểm tra chọn → nguồn → tạo plan → done → reload cho từng cấu hình, lỗi/hủy/lưu thất bại và dữ liệu cũ. Không tự merge/push main hoặc ký review thay Hải/Định.

## AI log của buổi này

Codex đọc allowlist và diff hai thư mục, chạy lại test/check/build, kiểm tra UI trên profile thử, phát hiện và sửa lỗi ID drawer, giữ phần Backend mới hơn, ghi rõ các kết quả chưa đạt. Các tên model và PASS trong QA log clone là báo cáo được nhập; chưa có log gốc/SHA để xác thực lịch sử đó.

## Phiên bản kiểm chứng

Code và minh chứng của buổi review được lưu ở commit 9091d951dce62f67b5faf4eb203a322122c62e07 trên feat/mw-team-01. Commit tài liệu kế tiếp chỉ bổ sung SHA và dọn khoảng trắng của script; không đổi logic đã kiểm thử.
