# Kiểm thử và AI log — MW-TEAM-04

## Môi trường ban đầu

07/10/2026, Hữu Hiếu sử dụng Codex. Baseline local 6854350, branch feat/mw-team-04; Windows/PowerShell, Node v24.14.1/npm 11.11.0. Fetch remote chưa thực hiện do quyền bị từ chối. Fixture chỉ trong script task; không xóa storage học thật. Chưa có PR hoặc kết quả pass tại thời điểm lập test case.

## Test case trước triển khai (trạng thái tại lúc lập, xem kết quả cuối bên dưới)

| Mã | AC / flow | Input và bước | Mong đợi | Thực tế / trạng thái |
|---|---|---|---|---|
| TC-V01 | AC-03 / 05 | null/array/primitive/object thiếu trường; gọi cả hai validator | Lỗi cụ thể; không throw | Chưa chạy |
| TC-V02 | AC-03 / 05 | Workspace schema 3, backup formatVersion 2 | unsupported_version; giữ object | Chưa chạy |
| TC-V03 | AC-03 / 05 | Boolean/string/enum sai, NaN, fractional, giờ 1/2/20/21 | Chỉ biên hợp lệ được nhận | Chưa chạy |
| TC-V04 | AC-03 / 05 | 29/02 hợp lệ/sai, 31/04, instant thiếu timezone, timezone sai, ngày bắt đầu khác thứ Hai | Lỗi trường đúng | Chưa chạy |
| TC-V05 | AC-03 / 05 | UUID hỏng/trùng, activePlanId không tồn tại | Không hợp lệ | Chưa chạy |
| TC-V06 | AC-03 / 05 | URL javascript/data; URL http/https | Chặn protocol thực thi; nhận web URL | Chưa chạy |
| TC-V07 | AC-04 / 05 | Done thiếu completion; todo có completion; taskId lệch; reverted current | Lỗi quan hệ; không xóa dữ liệu | Chưa chạy |
| TC-V08 | AC-04 / 05 | History/ClosedWeek lặp task; undo sau snapshot | Snapshot lịch sử vẫn hợp lệ | Chưa chạy |
| TC-V09 | AC-04 / 05 | ClosedWeek tổng/done/phút sai hoặc trùng index | Lỗi đúng field | Chưa chạy |
| TC-V10 | AC-04 / 05 | Plan/current track/version khác; segment sai phút; import planId thiếu | Từ chối sai quan hệ | Chưa chạy |
| TC-V11 | AC-04 / 05 | Catalog thiếu hướng; có snapshot/history hợp lệ | Giữ plan nguyên vẹn | Chưa chạy |
| TC-V12 | AC-03/04 / 05 | Backup round trip, input deep freeze; known catalog source/prerequisite sai | Không mutate; lỗi catalog khi có đủ pack | Chưa chạy |
| TC-A01 | AC-02 / 02 | Không plan/ledger rỗng | Tổng 0, days rỗng | Chưa chạy |
| TC-A02 | AC-02 / 02 | Hai plan có archived; current/history/ClosedWeek lặp task | Mỗi completion đúng một lần | Chưa chạy |
| TC-A03 | AC-02 / 02 | Done → undo → done mới | Chỉ bản chưa revert được cộng | Chưa chạy |
| TC-A04 | AC-02 / 02 | Legacy completedAt/localDate/timeZone null | Tổng undated riêng; không bịa ngày | Chưa chạy |
| TC-A05 | AC-02 / 02 | Cùng instant, localDate theo timezone khác; đổi timezone profile | Ngày đã ghi nhận không đổi | Chưa chạy |
| TC-A06 | AC-02 / 02 | Deep freeze input; nhiều ngày không thứ tự | Không mutate; ngày tăng dần | Chưa chạy |
| TC-P01 | AC-01 / 01 | Lưu tên đã trim/rỗng và ngành | Header/form đúng; không báo lưu DB trước kết quả | Chưa chạy |
| TC-P02 | AC-01 / 01 | Tên >60, ngành sai, timezone sai | Lỗi validation | Chưa chạy |
| TC-P03 | AC-01 / 01 | Sửa rồi Hủy bằng bàn phím | Form trở về state hiện hành; không gọi update | Chưa chạy |
| TC-P04 | AC-01 / 01 | Giả lập lưu thất bại và conflict | Không báo đã lưu; giữ draft | Chưa chạy; v2 phụ thuộc context |
| TC-P05 | AC-01 / 01 | Lưu timezone rồi reload; đổi khoa khám phá | Hồ sơ giữ timezone/ngành | Blocked: State v1 thiếu timezone |
| TC-P06 | AC-01 / 03 | Link My Plan, empty state; desktop/mobile/keyboard | Route đúng, không tràn ngang, focus dùng được | Chưa chạy |
| TC-I01 | AC-05 / 04 | Xuất saved và dirty, so file với snapshot | Nội dung đúng, không đổi DB/save state | Blocked: callbacks Huy/Hải chưa có |
| TC-I02 | AC-05 / 05 | File hỏng, hợp lệ, duplicate; chọn copy/profile | Preview không ghi, mặc định skip/giữ profile | Blocked: callbacks Huy/Hải chưa có |
| TC-I03 | AC-05 / 06 | Confirm copy với history/completion | Remap đủ; source không đổi | Blocked: persistence chưa có |
| TC-I04 | AC-05 / 06 | Cancel trước confirm | Workspace/revision không đổi | Blocked: persistence chưa có |
| TC-I05 | AC-05 / 06 | Quota/abort/conflict khi confirm | Không báo success; nguồn giữ nguyên | Blocked: persistence chưa có |

## Ma trận nội dung và tích hợp

Mỗi dòng kiểm tra ID/thứ tự/nguồn/default/prerequisite/bài/phút/acceptance/credential/portfolio với pack phụ thuộc. Sau tích hợp lặp: chọn track → đổi nguồn → tạo plan → hoàn thành → reload.

| Test | Track | Kiểm tra độc lập | Toàn hành trình app |
|---|---|---|---|
| TC-C01 | analyst.spreadsheet | Chưa chạy | Blocked: chưa registry/context/planner v2 |
| TC-C02 | analyst.pandas | Chưa chạy | Blocked: như trên |
| TC-C03 | bi.powerbi | Chưa chạy | Blocked: như trên |
| TC-C04 | bi.tableau | Chưa chạy | Blocked: như trên |
| TC-C05 | engineer.batch | Chưa chạy | Blocked: như trên |
| TC-C06 | engineer.streaming | Chưa chạy | Blocked: như trên |
| TC-C07 | business-analyst.software-ba | Chưa chạy | Blocked: như trên |
| TC-C08 | business-analyst.data-ba | Chưa chạy | Blocked: như trên |

## Lệnh kiểm tra

- node scripts/tasks/MW-TEAM-04.mjs: chưa chạy.
- npm run check: chưa chạy; chỉ pack đã đăng ký.
- npm run build: chưa chạy; build sinh tài liệu ngoài allowlist nên phải đối chiếu diff, không commit file sinh thay đổi.
- UI riêng: chưa chạy; dùng profile thử, không reset dữ liệu thật.

## Bug log

BUG-04-01 (đọc code): Profile gọi toast đã lưu ngay sau update void; AppShell chỉ lưu trong effect và có thể fail. Chưa có bằng chứng trình duyệt. Sửa dự kiến: thông báo cập nhật state và hướng xem chỉ báo lưu, không khẳng định persistence thành công.

## AI Development Log

| Ngày/vòng | Công cụ | Công việc / nhận xét | Kết quả |
|---|---|---|---|
| 07/10/2026 · 1 | Codex | Đọc phân công năm người, contracts, context/AppShell/state/Profile/StudyActivity, templates; phát hiện v1/v2 chưa nối. Tách story/flow/test trước code, ghi API đề xuất; không tạo callback thứ hai. | Tài liệu này; chưa test; chưa có người review |

Không thực hiện so sánh công cụ AI thứ hai; đó là bài nhóm chọn. Không ghi người dùng hoặc Hải đã kiểm tra thay cho họ.

## Kết quả thực thi cuối — 07/10/2026

Baseline `685435047a58f05d1bb3a90ae901425bdcb31074`; code tại working tree của branch `feat/mw-team-04`. Manifest SHA-256 trong `evidence/source-hashes.json` xác định code đã chạy; commit bàn giao tra bằng `git log -1 -- src/domain/validate.ts`. Không dùng baseline SHA để giả định code mới đã ở commit đó.

| Case | Kết quả thực tế |
|---|---|
| TC-V01–V12 | PASS: malformed/schema/ranges/calendar/timezone/UUID/URL; task–ledger; snapshot trước/sau undo; totals; removed catalog; immutable input; source/prerequisite draft. Có thêm hồi quy current todo không được giữ ledger chưa revert. |
| TC-A01–A06 | PASS: empty, archived, snapshot lặp không đếm thêm, undo, legacy undated, localDate cũ, sort và không mutate. |
| TC-P02 | PASS bằng pure validator: tên 61 ký tự/ngành/timezone sai; tên rỗng và major null hợp lệ. |
| TC-P01, P03 | PASS Edge: trim/lưu/reload, fallback tên rỗng, hủy tên/ngành qua phím Enter; toast không tự tuyên bố storage đã lưu. |
| TC-P04 | PASS **v1 quota failure** ở browser context riêng: topbar Chưa lưu được, giữ tên đang sửa, toast không báo đã lưu. Conflict/callback v2 **chưa chạy**. |
| TC-P05 | PASS độc lập khoa khám phá không đổi ngành profile; timezone lưu/reload v2 **chưa chạy**. |
| TC-P06 | PASS empty activity 84 ô, ArrowLeft, link My Plan empty; desktop 1440 và mobile 390/320 không tràn ngang, nút còn hiển thị. Đã xem ảnh desktop/mobile. |
| TC-C01–C08 | PASS kiểm tra độc lập bốn pack cùng **backendPack thật**, đủ 8 track; nguồn/default/prerequisite/bài/phút/portfolio/credential; không trùng resource URL. **Chưa có hành trình tám track trên app.** |
| TC-I01–I05 | CHƯA CHẠY: context/callbacks/persistence v2 chưa có. Không dùng mock UI để ghi pass tích hợp. |

- `node scripts/tasks/MW-TEAM-04.mjs --ui`: **28 nhóm module/content + 14 kiểm tra UI pass**, Edge headless/profile thử. Chi tiết [unit-content.json](evidence/unit-content.json), [profile-ui.json](evidence/profile-ui.json).
- `npm run check`: PASS, 1 pack đăng ký/27 module, legacy save và ba Backend track. Bốn pack mới chưa được registry chung dùng; test task riêng bao phủ chúng.
- `npm run build`: PASS, 1613 module, 17.68s; xem [build.log](evidence/build.log). [check.log](evidence/check.log) lưu stdout thật.
- Minh chứng: [desktop](evidence/profile-desktop.png), [mobile 320px](evidence/profile-mobile.png), [quota](evidence/profile-save-error.png).
- Module Playwright dùng runtime sẵn có ngoài repo qua biến `MAJORWEAVE_PLAYWRIGHT_MODULE`; không thêm package. Khi chạy trên máy khác cần module Playwright và Edge có sẵn, hoặc chỉ chạy pure tests không có `--ui`.
- Lệnh check/build/esbuild cần escalation trên máy này do sandbox EACCES ở thư mục cha. Các lượt thất bại ban đầu không được tính pass. Fetch remote bị người dùng từ chối; không chạy lại fetch.

### Bug/failure thực tế và xử lý

| Mã | Quan sát | Sửa và kiểm tra lại |
|---|---|---|
| BUG-04-01 | Profile cũ toast đã lưu sau callback void, trước effect persistence | Toast chỉ nói đã cập nhật; quota injection cho thấy chỉ báo chưa lưu và không có success claim. |
| RUN-04-01 | UI lần đầu timeout ở `goto` chờ load; server vẫn HTTP 200 | Chờ `domcontentloaded` và label thật; không ghi pass lượt timeout. |
| RUN-04-02 | Lượt tiếp theo đã pass 9 check nhưng kiểm tra nút mobile trước React render sau route change | Thêm `name.waitFor()` trước resize; giữ nguyên assertion, lượt cuối 14 check pass. |
| REVIEW-04-01 | Action wrapper khiến nút Hủy cao hơn nút gốc | Dùng hai button theo style cũ, không đổi CSS; xem lại ảnh cuối. |
| REVIEW-04-02 | Python tutorial bị định nghĩa trùng với Backend | Tham chiếu `language.python`; nguồn mới chỉ bài CSV cụ thể. Test resolve cùng Backend và uniqueness URL pass. |

### AI log bổ sung

| Vòng | Công cụ / hành động | Kết quả và kiểm tra |
|---|---|---|
| 2 | Codex + Ponytail: triển khai module thuần theo contracts, không thêm framework | Runtime validator + activity; input unknown/frozen test; không storage/React trong domain. |
| 3 | Codex web: đọc nguồn chính thức; biên soạn tám track | 24 nguồn/6 mục tiêu được khảo sát trong [inventory](SOURCE_INVENTORY.md); ghi unknown cho phí chưa xác minh, không giả chứng nhận. |
| 4 | Codex + Edge Playwright: Profile v1 và trạng thái lỗi | Các lần lỗi và sửa ở trên; 14 check UI pass, giữ sidebar/style. |
| 5 | Codex shell: check/build, rà allowlist và bàn giao | Log thật; file catalog/event do prebuild sinh ngoài allowlist được trả về baseline, không commit. Cần Hải review API/tích hợp và Hân review chéo. |

Không có người dùng/Hải/Hân nghiệm thu trong phiên này. Phần timezone/heatmap v2/import-export và E2E tám track còn mở; toàn task **chưa Done**.

## Review và AI log bổ sung — 09/10/2026

- Nguồn phản hồi: GUI_NGUYEN_HUU_HIEU.md do người dùng cung cấp. Hai lỗi thật ở HEAD acb065d được tái hiện trước sửa; bộ 28 nhóm trước đó chưa đủ bao phủ chúng. [Chi tiết story/quy tắc/test](REVIEW_RESPONSE_2026-10-09.md).
- R01 trước sửa FAIL vì segment120/minutes45; log `review-2026-10-09-before.log`. Sửa để customized giữ provenance, vẫn kiểm biên/workId; completion và history không bị sửa.
- R02 trước sửa FAIL missing_prerequisite chặn workspace; log `review-2026-10-09-draft-before.log`. Chuyển kiểm catalog sang `validateDraftForGeneration`; giữ kiểm cấu trúc draft ở persistence. Assertion nguồn sai/thiếu prerequisite được giữ ở bước tạo plan, thêm assertion workspace lưu được.
- Lượt sandbox: pure tests qua, esbuild FAIL EACCES thư mục cha (`review-2026-10-09-tests.log`). Chạy lại ngoài sandbox; 30 nhóm pass, check pass, build pass. Không ghi lỗi sandbox thành lỗi sản phẩm hoặc bỏ assertion.
- Test mới dùng fixture giống planner/migrated và JSON round trip; **không phải** generate/save/reload v2 thật. UI tám track/backup/timezone vẫn chờ tích hợp, không chạy lại UI v1 và không nhận 14 pass cũ là của lượt này.
- Code gốc acb065d; code sửa chưa commit. Manifest riêng `review-2026-10-09-source-hashes.json`; giữ manifest cũ cho evidence cũ. Kết quả unit-content.json được cập nhật bởi lượt mới, có baseline rõ ràng.
- Diễn biến Git: phiên trước đã tạo commit local acb065d và push bị từ chối; người dùng yêu cầu dừng commit/push/PR. Ngày 09/10 đọc GitHub xác nhận PR #7 hiện tồn tại trên cùng HEAD, body template. Không suy đoán ai đã push/tạo sau phiên trước. Lượt sửa này không commit/push/sửa PR/request review; chỉ soạn PR_DESCRIPTION.md local.

| Vòng | Công cụ | Công việc / kết quả |
|---|---|---|
| 6 | Codex, đọc file và GitHub chỉ đọc | Đối chiếu phản hồi, HEAD/allowlist/callers/contracts. Không thay contracts/context. |
| 7 | Codex + Node asserts | Thêm R01/R02 trước sửa, ghi hai lỗi đỏ riêng; sửa nguyên nhân ở validator; kiểm positive/negative, nguồn/prerequisite/cycle/unknown track. |
| 8 | Codex shell | Chạy test/check/build, ghi log; cập nhật flow/task/bàn giao và bản nháp PR. Sự đồng thuận API và E2E thật còn mở. |

### Tiếp tục bàn giao PR

Người dùng yêu cầu gửi PR, cho phép tiếp tục commit/push và cập nhật PR #7, yêu cầu haiphamt review. Các ghi chú tạm dừng phía trên phản ánh trạng thái trước yêu cầu này. Không thay code sau lượt test cuối; không tự merge. Kết quả gửi thực tế được báo trong chat/PR.
