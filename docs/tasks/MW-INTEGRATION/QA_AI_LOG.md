# QA và AI Log — tích hợp MajorWeave v2

Ngày: **09/10/2026**. Người phụ trách: Phạm Tuấn Hải; thực hiện tích hợp/kiểm tra với Codex. Nguồn năm nhánh và quyết định conflict: [INTEGRATION_V2](../../team/INTEGRATION_V2.md).

## Môi trường và phạm vi

- Windows, Node `v24.11.1`, Chrome qua extension; app dev cổng 5195.
- Branch `integration/majorweave-v2`, code đang sửa trên nền merge `6beec2f` lúc chạy UI. Các file khác biệt được commit trong đợt tích hợp; kết quả post-commit xem evidence manifest.
- Harness `tests/integration-browser.html`, session `186adb30-ef0c-436a-ba56-1e759aa52f1e`, DB QA riêng. Không xóa/ghi đè storage của người dùng.
- Suite thuần không được dùng để nhận là IndexedDB/browser test. Không chạy lại script Profile v1 `--ui` và gọi đó là Profile v2.

## Kết quả thực tế

| Test | Cách thực hiện | Kết quả | Minh chứng/giới hạn |
|---|---|---|---|
| Registry/cấu trúc/Context | `npm run check` | Pass | Log post-commit; 18 pack / 50 track |
| Năm task thuần | `npm run check:team` | Pass sau xử lý giả định alias | Bảy cặp Backend được đối chiếu rõ, duplicate ngoài danh sách vẫn bị chặn |
| TypeScript/build | `npm run build` | Pass | Log post-commit |
| 50 cấu hình UI | Từng track: chọn nguồn nếu có → tạo plan → mở My Plan → done → chờ save → reload | **50/50 Pass** | Chrome/AppShell/controller và IndexedDB thật; [browser-tracks.json](evidence/browser-tracks.json) trích file backup thật |
| Nhiều plan | Luồng trên tạo 50 plan độc lập, không đổi plan trước | Pass | Backup có 50 track khác nhau, mỗi plan 1 task done |
| Profile | Lưu tên Integration QA / Asia/Tokyo → reload | Pass | [Ảnh desktop](evidence/profile-desktop.jpg) |
| Nhịp học | Xem Profile sau 50 completions, đổi timezone | Pass | 50 việc ngày 09/10; ngày gốc không chuyển |
| Xuất backup | Bấm Xuất file sao lưu, đọc file JSON đã tải | Pass | File 1,482,231 byte; 50 plan, tên QA. Event download của công cụ timeout, kiểm tra file trên disk xác nhận tải thành công |
| V1 migration | Preview 50→51 → cancel → preview → confirm → reload → preview lại | Pass | 51 plan; completion v1 bổ sung; thông báo đã chuyển, không nhập trùng |
| Mobile Profile | Viewport 390×844 | Pass cho mẫu này | scrollWidth 375 ≤ innerWidth 390, [ảnh mobile](evidence/profile-mobile.jpg) |
| Import qua file picker | Filechooser chọn backup vừa tải | **Blocked bởi công cụ** | Extension chưa cho access file URLs; chưa chạy nhập file trọn luồng UI trong đợt này |
| Import/duplicate/copy/cancel/retry | Controller thật với RAM persistence port + semantic validator | Pass | `check-integration`: cancel/no-write, copy, skip ID trùng, failed confirm giữ ID/candidate, retry |
| Không mutation template | Sửa acceptance trong migration preview rồi đối chiếu Backend source | Pass | Regression trong check-integration |
| Console | Log error của tab QA | Pass | Không có error tại thời điểm kiểm tra; không suy ra mọi browser không lỗi |

Không claim test mọi thao tác trên mọi track: 50-track chỉ bao phủ source/create/done/reload. Edit/backlog/close-week/history/error/conflict được kiểm tra bởi suite cá nhân và regression có sẵn; không giả lập thành full-browser coverage toàn bộ. Test nhập JSON UI còn cần người chạy trực tiếp theo hướng dẫn. Quota thực chưa ép đầy disk; lỗi injected phải ghi đúng là injected.

## Các lỗi và xử lý

1. **Alias mảng acceptance ở migration**: preview dùng mảng content gốc. Sửa sao chép mảng; regression chứng minh sửa preview không sửa template.
2. **Kết nối UI cũ**: Profile/v1 save effect chưa đi qua v2. Nối controller/service, gỡ tự ghi v1 khi mount và giữ legacy view chỉ đọc.
3. **Conflict MyRoadmap/MyPlan**: giữ UI mới Định và discard shared candidate mới Hân, đồng thời giữ sửa ngày Chung. Ghi rõ trong INTEGRATION_V2.
4. **Test TEAM-04 giả định URL Backend duy nhất**: lần đầu Fail `68 !== 75` (“Repeated URL definitions”). Seven verified IDs cùng URL đã có là thay đổi nội dung TEAM-01. Giữ ID tương thích; test đối chiếu chính xác bảy cặp, cấm duplicate ngoài dự kiến và duplicate trong pack TEAM-04. Retest full suite Pass.
5. **Đồng bộ automation checkbox**: locator `check()` đòi trạng thái ngay trong khi callback save async; observed task đã done sau transaction. Chuyển test sang click, chờ success rồi kiểm tra/reload. Không bỏ assertion persisted done. Chờ đúng goal/route trước thao tác, tránh đọc DOM trang trước.
6. **Download event timeout**: file vẫn tải trên disk. Dùng file thực để xác minh nội dung, không ghi timeout là mất dữ liệu sản phẩm.

## AI Log của đợt tích hợp

| Tool | Yêu cầu thực tế | Đầu ra và quyết định | Kiểm tra |
|---|---|---|---|
| Codex; model không ghi nhận trong evidence | Hoàn thiện sản phẩm từ năm PR, giữ style, merge, viết README/test/AI Log | Merge history, xử lý conflict, nối Profile/transfer/registry, sửa alias preview, thêm regression và tài liệu | Lệnh check/team/build và Chrome 50 track, Profile/migration |
| Skill ponytail đã đọc trong session | Giữ giải pháp đơn giản khi tích hợp | Tái sử dụng controller/service/UI classes; không thêm framework, auth hay persistence thứ hai | Import/storage boundaries và build |
| Browser extension | Thử UI thật trên kho QA riêng | Các thao tác và kết quả bảng trên; file upload bị quyền extension chặn | Ghi Blocked, không bịa Pass |

Không dùng AI thứ hai trong đợt tích hợp này. Bảng này không thay log Antigravity/AI hoặc đóng góp cá nhân của năm bạn. Nếu môn yêu cầu hai AI, từng người bổ sung phép so sánh đã thực sự làm theo [hướng dẫn](../../team/HUONG_DAN_KIEM_THU_VA_AI_LOG.md).

## Bàn giao

Code của cả năm bạn đủ để nhóm trưởng tích hợp sau các sửa chung trên. Phần còn lại của thành viên là rà lại log cá nhân, dẫn commit/test thật và ghi rõ chưa chạy; không cần nhận việc tích hợp đã được nhóm trưởng xử lý. Mọi sửa tiếp gửi PR cho Hải, không tự merge/main.
