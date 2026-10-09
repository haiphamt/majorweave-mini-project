# Kiểm thử và AI log — MW-TEAM-05

## Load/save — kết quả ngày 08/10/2026

### Môi trường

- Người chạy: Triệu Quang Huy (`1can5ez`). Ngày: 08/10/2026.
- Branch: `feat/mw-team-05`.
- Commit chứa mã đã kiểm tra: `aafd1f6ece1eaa895f4e2ca41674fb8e3f5b12cf`.
- Máy: Windows, Terminal PowerShell, Antigravity. Tên/phiên bản trình duyệt và viewport: Google Chrome. Phiên bản quan sát ngày 09/10/2026: 154.0.8037.99 (64-bit), đang cập nhật; chưa xác nhận phiên bản chính xác tại lần chạy 08/10/2026.
- Server: `npm run dev -- --port 5174`; URL `http://127.0.0.1:5174`.
- DB load/save: `majorweave.qa.team05.ae4569a7-b490-462c-8900-81ebd8f38dbb` cùng các suffix từng test.
- DB Context: `majorweave-context-qa-aac532d4-b9ea-482d-b789-da0fc1d08ef6`.
- Trang QA dùng tên DB riêng, không xóa hoặc ghi vào database học thật/localStorage v1.
- Kết quả dưới đây do Huy chạy và gửi log trong cuộc trao đổi. Không phải mọi kiểm thử do AI chạy. Kiểm thử diễn ra trước commit, sau khi áp dụng gói mã; không ghi là đã chạy lại sau commit.

## Test cases — load/save

Đường dẫn hiện hành: `/docs/tasks/MW-TEAM-05/tests/indexeddb-tests.html`; bấm **Chạy kiểm thử**.

| Mã | AC / luồng | Điều kiện & input | Các bước | Mong đợi | Kết quả thực | Trạng thái |
|---|---|---|---|---|---|---|
| TC-MW-TEAM-05-01 | AC-01 / FL-01 | DB QA trống | Load, đọc raw key local | Workspace revision 0; key vẫn chưa có | PASS Load rỗng không ghi defaults | Pass |
| TC-MW-TEAM-05-02 | AC-02 / FL-02 | Workspace revision 0, tên QA Huy | Save expected 0, load lại, so input | Revision 1, profile còn, input không bị sửa | PASS Save tăng revision, reload giữ profile; không sửa object đầu vào | Pass |
| TC-MW-TEAM-05-03 | AC-03 / FL-03 | Hai instance cùng DB, revision 0 | Promise.all hai save, đọc disk | Một success, một conflict, disk đúng bản thắng | PASS Hai save cùng revision chỉ một thành công | Pass |
| TC-MW-TEAM-05-04 | AC-03 / FL-03 | Disk revision 1, candidate revision 0, expected 1 | Save rồi so disk | Conflict, disk không đổi | PASS Candidate sai revision trả conflict, không ghi đè | Pass |
| TC-MW-TEAM-05-05 | AC-01 / FL-01 | Raw schema 2 nhưng thiếu cấu trúc | Thử save workspace hợp lệ, đọc raw | Validation error, raw được giữ | PASS Dữ liệu hỏng trên disk được giữ nguyên, save bị từ chối | Pass |
| TC-MW-TEAM-05-06 | AC-01 / FL-01 | Raw schemaVersion 99 | Load rồi đọc raw | unsupported_version, raw không đổi | PASS Schema tương lai được giữ nguyên | Pass |
| TC-MW-TEAM-05-07 | AC-02 / FL-02 | Expected revision -1 | Save, đọc raw | Validation error, không ghi | PASS Revision đầu vào không hợp lệ không ghi dữ liệu | Pass |
| TC-MW-TEAM-05-08 | AC-01 / FL-01 | Validator cố ý throw khi đọc DB QA | Load với timeout 5 giây, đọc raw | Trả storage error, không treo/không đổi disk | PASS Validator ném lỗi trong callback đọc trả lỗi thay vì treo | Pass |
| TC-MW-TEAM-05-09 | AC-01 / FL-01 | DB QA version 2 | Adapter mở version 1 | INDEXEDDB_VERSION, không reset | PASS DB version mới hơn trả INDEXEDDB_VERSION | Pass |
| TC-MW-TEAM-05-10 | AC-01 / FL-01 | DB QA version 1 thiếu store workspace | Load, xem lại store names | Storage error, không tự sửa/reset DB | PASS Object store bị thiếu trả lỗi, không reset database | Pass |

Tổng log người chạy cung cấp: **10 PASS / 0 FAIL**. TC-03 dùng hai instance trong cùng trang; không thay bằng chứng hai tab thực. “Reload” ở suite là đọc lại qua port, không phải toàn bộ UI đã reload.

## Kiểm tra Context và React

Trang `/tests/context-v2-browser.html`; bấm **Chạy kiểm tra**, sau đó **Thử callback qua React**.

| Mục | Kết quả thực do người chạy cung cấp | Trạng thái |
|---|---|---|
| Mở DB trống | PASS: Mở IndexedDB trống, không có plan mặc định | Pass |
| Tạo hai plan | PASS: Tạo hai plan; thành công sau transaction hoàn tất | Pass |
| Controller mới | PASS: Tải lại bằng controller mới giữ hai plan và draft | Pass |
| Cùng revision | PASS: Hai writer cùng revision: một thành công, một conflict | Pass |
| Callback conflict | PASS: Conflict ở callback giữ bản chưa lưu, không kích hoạt plan mới | Pass |
| Reload/preview/cancel | PASS: Bỏ bản chưa lưu có xác nhận; preview/hủy giữ nguyên database | Pass |
| Regeneration history | PASS: Xác nhận tạo lại lưu history; reload vẫn giữ history | Pass |
| React Provider/hook | ready · 3 plans; PASS React callback: mobile.flutter saved | Pass |

Tổng: **7/7 native Context PASS**, callback React PASS. Đây là kết quả test Context có sẵn; không tự coi nó chứng minh các case abort/quota/blocked hoặc luồng migration/import.

## Lệnh kiểm tra

| Lệnh | Mã nguồn / ngày | Kết quả thực | Phạm vi |
|---|---|---|---|
| `npm run check` | Source sau áp dụng gói; được commit thành aafd1f6…; 08/10/2026 | PASS 3 content packs, 29 modules; legacy/Backend checks và 16 context checks passed | Cấu trúc/logic đã đăng ký, không thay native tests |
| `npm run build` | Cùng source; 08/10/2026 | TypeScript + Vite v6.4.3 thành công; 1621 modules transformed | Compile/build |
| Trang load/save QA | Cùng source; 08/10/2026 | 10 PASS / 0 FAIL | Các case trong bảng load/save |
| Trang Context + React | Cùng source; 08/10/2026 | 7/7 + React callback PASS | Tích hợp port với controller/provider |

## Minh chứng

- Log terminal và log browser đã được Huy cung cấp trong cuộc trao đổi.
- Log text đã có: [load/save bổ sung](evidence/load-save-extra-2026-10-08.txt), [nội dung native](evidence/content-native-2026-10-09.txt), [script task chạy lại](evidence/unit-rerun-2026-10-09.txt). Không có ảnh browser trong gói dọn tài liệu.
- PR load/save: https://github.com/haiphamt/majorweave-mini-project/pull/6; chờ review/nghiệm thu của Hải.

## Bug log

Chưa phát hiện lỗi trong các lần chạy đã được cung cấp ở trên. Các nguy cơ exception callback, lỗi lưu và mã lỗi chưa rõ là kết quả đọc code; không ghi thành bug đã tái hiện nếu chưa có bằng chứng chạy bản cũ.

## AI Development Log

| Ngày / vòng | Công cụ | Input / mục tiêu | Output | Kiểm tra / quyết định của người thực hiện | Verification |
|---|---|---|---|---|---|
| 08/10/2026 — chuẩn bị | ChatGPT/Codex; không ghi model chưa xác nhận | Feedback GUI_TRIEU_QUANG_HUY.md, TASK, HANDOFF_CONTEXT_V2, roadmap-store.ts, contracts | Đối chiếu scope, adapter bootstrap và dependency | Huy tạo nhánh MW-TEAM-05, ghép Context theo hướng dẫn Hải | npm ci; check/build baseline do Huy chạy |
| 08/10/2026 — contracts | ChatGPT/Codex | Kiểm tra import WorkspacePersistence | Phát hiện file contracts đính kèm ban đầu thiếu port | Huy kiểm tra file trên máy bằng Select-String, gửi contracts(1).ts mới; không tự sửa contracts chung | File hiện hành có WorkspacePersistence; check/build đạt |
| 08/10/2026 — load/save | ChatGPT/Codex | Hoàn thiện adapter trong src/persistence, giữ API/DB/key | Gói mã bổ sung issue codes, bảo vệ input, bắt callback errors, kiểm thử QA | Huy áp dụng trên nhánh cá nhân; thay đổi chưa tự merge main | TypeScript strict do AI chạy; check/build, 10 native QA, 7 Context và React callback do Huy chạy |

Code tiếp tục cần người thực hiện đọc diff và Hải review. Không coi việc chạy test là review hoàn tất.

## So sánh hai công cụ AI

Chưa thực hiện trong đợt này; làm trên bài nhỏ chung do nhóm chọn. Không bịa kết quả công cụ thứ hai.

## Trạng thái tổng hợp hiện hành

Các phần migration/backup/nội dung đã được triển khai và kiểm thử độc lập ngày 09/10/2026; xem bảng tổng hợp cuối file. Những mục kiểm tra load/save phía trên là lịch sử ngày 08/10, không đại diện cho toàn bộ mã mới.

Còn nghiệm thu: validator semantic và UI app chính, failure paths migration/import chưa được suite bao phủ, toàn hành trình mười track sau đăng ký registry, review chéo và Hải duyệt cuối. Không tự merge main.

## Kết quả bổ sung theo review PR #6 — 08/10/2026

Người chạy: Huy; output do Huy cung cấp trong cuộc trao đổi lúc khoảng 20:43–20:44 (Asia/Ho_Chi_Minh). Trang hiện hành sau dọn thư mục: `http://127.0.0.1:5174/docs/tasks/MW-TEAM-05/tests/indexeddb-extra.html`. Lần chạy 08/10 dùng đường dẫn cũ chưa có `/tests/`.

Mã trang test bổ sung đã có trong ZIP dự án người làm gửi trước lần chạy. File test bổ sung đã được commit thành `2be6c07bb12089e477e96d87e80436d0c55062cb` sau khi Huy chạy. Không nhận đã chạy lại sau commit. Phiên bản Chrome tại lần chạy 08/10 chưa xác nhận; bản quan sát 09/10 là 154.0.8037.99. Không gán SHA aafd1f6 của lần kiểm tra cũ cho trang test mới chưa xác nhận commit.

| Test | Kết quả thực | Giới hạn |
|---|---|---|
| TC-11 — thời điểm success | PASS; TRACE transaction.complete → save.promise.resolved | Native transaction được quan sát bằng listener trong trang test |
| TC-12 — abort sau put.success | PASS; rollback, input giữ nguyên, retry được | Abort chủ động trên transaction native của DB QA |
| TC-13 — quota | PASS; mã lỗi rõ, disk/input giữ nguyên, retry được | QuotaExceededError tạo có kiểm soát tại put; chưa thử disk thật đầy hoặc lỗi quota bất đồng bộ |
| TC-14 — blocked | PASS; mở muộn không reset/ghi DB, version giữ v1 | Giữ connection v1, chuyển riêng yêu cầu open DB QA sang v2 để tạo blocked native; adapter ứng dụng vẫn v1 |
| TC-15 — hai tab thật | PASS; A save 0 → 1; B stale trả conflict / REVISION_CONFLICT; disk của A và candidate của B giữ nguyên | Hai tab riêng, save theo thứ tự A rồi B; không tuyên bố hai transaction bắt đầu đồng thời |

Suite lỗi/transaction: **4 PASS / 0 FAIL**. Hai tab: **PASS**, kết quả riêng. Mục 2 ở tab B hiện “Chưa chạy” là đúng vì suite 4 test đã chạy ở A; không tính suite của B là một lần chạy khác.

- DB suite: `majorweave.qa.team05.failures.ef535b72-7d74-4b95-8aa0-01ae5a74b572`.
- DB hai tab: `majorweave.qa.team05.tabs.a05b5a3d-38ea-49e1-b3a5-dbd234e112d1`.
- Tab A page: `39fe014e-d6a0-4cbd-b00b-250d8a6e1670`.
- Tab B page: `cc4edbf7-3f40-4037-952b-1a695eb6918e`.
- Minh chứng dạng text: [evidence/load-save-extra-2026-10-08.txt](evidence/load-save-extra-2026-10-08.txt). Chép từ output do người chạy gửi; không phải ảnh chụp và không phải AI tự chạy trình duyệt.

### AI log bổ sung

ChatGPT/Codex tạo indexeddb-extra.html/ts, hướng dẫn chạy và FLOW_LOAD_SAVE.md trong allowlist docs; kiểm tra TypeScript strict thành công. Huy áp dụng, chạy suite và hai tab, gửi output thực. AI đối chiếu output, bổ sung QA log và lưu bản text minh chứng. Không đổi adapter load/save trong đợt bổ sung này.

Các kết quả bổ sung trên chỉ nghiệm thu phạm vi load/save; kết quả migration/backup/nội dung nằm ở bảng ngày 09/10 bên dưới. FLOW.md đã bổ sung; semantic/UI toàn task vẫn cần nghiệm thu. Không tự merge main.

## Tổng hợp ngày 09/10/2026

Nhánh: `feat/mw-team-05-migration`. Dữ liệu nguồn: bản ZIP `majorweave-mini-project(2).zip` Huy gửi và output Huy đã cung cấp trong cuộc trao đổi. Không có `.git` được dùng để xác minh HEAD trong lần dọn tài liệu; SHA commit nội dung mới nhất cần Huy bổ sung bằng `git rev-parse HEAD` sau commit. Không gán SHA backup cho các pack thêm sau đó.

| Nhóm / AC / flow | Kết quả Huy cung cấp | Môi trường và giới hạn | Tài liệu / test |
| --- | --- | --- | --- |
| Source / AC-04 / FL-04 | 16 PASS / 0 FAIL | Node/PowerShell, trước commit 6cf1733028edb40ba8192ba1c2efff113cc40143 | migration-source.ts; 16 test đầu script task |
| Source + preview / AC-04 / FL-04 | 30 PASS / 0 FAIL | Node/PowerShell, trước commit 3f360cbc4847552636263d5ce4495fc4e622c491 | migration-preview.ts; giữ 16 cũ + 14 preview |
| Source + preview + controller / AC-04 / FL-04 | 49 PASS / 0 FAIL | Memory port; chưa chứng minh native/semantic/UI | migration.ts; thêm 19 controller tests |
| Migration native / AC-04 / FL-04 | 7 PASS / 0 FAIL | Chrome; fixture nguồn trong bộ nhớ, hai controller cùng trang, save error injection, validator cấu trúc | migration-tests.html/ts; trang test commit a040483cf5707c31807e1ffb8ba805c33cb04172 |
| Backup/import / AC-05 / FL-05/06 | Native 7 PASS / 0 FAIL; chọn lại JSON QA hợp lệ 1 plan | Chrome; save error injection, validator cấu trúc; chưa semantic/UI app | backup-tests.html/ts; backup commit ce8b8c6adffdbd37d84bfb7ea565caf6d848144b |
| Nội dung / AC-06 / FL-07 | Native 10 PASS / 0 FAIL | Chrome; mỗi track DB UUID riêng; completion do fixture tạo, không qua callback progress thật | content-preview.html/ts; evidence/content-native-2026-10-09.txt |
| Script task toàn bộ | 91 PASS / 0 FAIL | Node/PowerShell: 65 persistence/migration/backup + 26 nội dung; isolated resolver/planner | scripts/tasks/MW-TEAM-05.mjs |
| Check/build bản mới | PASS; 3 registered packs, 37 modules, 16 Context checks; build 1621 modules | Terminal Windows do Huy gửi; bốn pack mới chưa đăng ký app | Không dùng check/build làm bằng chứng UI/nguồn đã nghiệm thu |

Các tổng 16/30/49/65/91 là các đợt mở rộng cùng script, không cộng lại thành tổng số test độc lập. Kết quả 65 trước đó là lần Codex chạy đã ghi trong BACKUP_IMPORT.md; bảng không tự nhận Huy đã gửi output 65.

### Coverage để reviewer đối chiếu

| Bộ test | Steps / input | Expected / assertion | Actual |
| --- | --- | --- | --- |
| Source, 16 test | Raw rỗng/hỏng/schema lạ, task/date/ID lỗi, unknown/extra fields, reader throw | Không defaults, bảo toàn raw, từ chối cả nguồn lỗi, fingerprint theo raw | PASS trong 91-test script |
| Preview, 14 test | Maps Backend, sửa title/phút, missing work/source/metadata/date/prerequisite, UUID/clock/timezone lỗi | Giữ dữ liệu; customized/segment đúng; vấn đề cần lựa chọn bị chặn; không sửa input | PASS trong 91-test script |
| Migration controller, 19 test | Prepare/cancel/confirm/tamper/repeat/retry/pending/revision/source change/append/validator throw | Không ghi khi preview/hủy; marker+plan cùng save; không trùng; proposal/IDs giữ khi lỗi | PASS trong 91-test script |
| Backup/import, 16 test | Round trip, lỗi file/version/clock, skip/copy/history/closed/completion/marker, lựa chọn nhập, pending/cancel/conflict/retry | Validate trước ghi; remap quan hệ; dùng revision thiết bị; không overwrite mặc định | PASS trong 91-test script |
| Nội dung, 26 test | 4 pack/10 track, ID/source/work/portfolio/credential, resolver, nguồn cuối, quỹ 2h/20h, thiếu prerequisite | Scope đủ, ID không trùng, đúng nguồn/tiên quyết/tổng phút/quỹ tuần | PASS trong 91-test script |

Các steps chi tiết và expected từng case nằm ngay trong assertion của script và trang native; bảng này là chỉ mục coverage. Native migration/backup/content dùng validator cấu trúc. Compatibility semantic do Codex chạy riêng với validator từ ZIP MW-TEAM-04 đã được ghi ở MIGRATION/BACKUP/CONTENT; chưa thay nghiệm thu tích hợp semantic hiện hành.

### AI log ngày 09/10

| Đợt | Công cụ / mục tiêu | Output và quyết định | Verification |
| --- | --- | --- | --- |
| Migration | ChatGPT/Codex; đọc raw v1, maps/contracts và yêu cầu giữ dữ liệu | Source/preview/controller, giữ raw và key, không defaults; Huy áp dụng trong allowlist | Unit rồi native QA do Huy chạy; giới hạn ghi riêng |
| Backup/import | ChatGPT/Codex; xuất snapshot/preview/copy/remap/retry | Module và trang QA; mặc định giữ dữ liệu thiết bị; không sửa app/contracts | Unit Codex, check/build và native QA Huy; semantic compatibility riêng |
| Nội dung | ChatGPT/Codex; đủ 4 pack/10 track, khảo sát nguồn chính thức | Nội dung có bài/acceptance/portfolio, inventory URL và điều kiện; pack review | 91 unit, strict/compatibility Codex; check/build và 10 native track Huy |
| Dọn bản ZIP | ChatGPT/Codex; Huy yêu cầu tài liệu gọn, dễ review | README hub, FLOW, trạng thái TASK/QA, gom ba tài liệu migration; giữ link cũ và assertions | Chạy lại script/check/build trên source ZIP; không chạy lại browser trong đợt này |

### Việc còn lại

- Hải đăng ký bốn pack và nối callback/Context/UI; Hữu Hiếu phối hợp semantic validator.
- Chạy migration/import bằng semantic validator hiện hành, xem warnings/choices/nguồn v1 và nhãn xuất chưa lưu trên UI.
- Kiểm native failure paths/two-tab riêng cho migration/import chưa được suite chứng minh; quota thật đầy disk vẫn chưa chạy.
- Kiểm toàn hành trình app cho 10 track bằng callback progress thật, rồi reload, UI trạng thái lỗi/hủy/bàn phím và viewport theo yêu cầu nghiệm thu.
- Bổ sung SHA/PR cuối và kết quả reviewer; không tự ký review, không đánh Done chỉ dựa trên isolated QA.

### Chạy lại bản ZIP khi dọn tài liệu — Codex, 09/10/2026

- Node.js v24.19.0, Linux; dùng các dependency cùng phiên bản từ ZIP và binary Linux tương ứng cho esbuild/rollup. Không thay package/lock của bản bàn giao.
- `node scripts/tasks/MW-TEAM-05.mjs`: **91 PASS / 0 FAIL**; [output đầy đủ](evidence/unit-rerun-2026-10-09.txt).
- `npm run check`: **PASS**, 3 registered packs / 37 modules; 16 Context checks passed.
- `npm run build`: **PASS**, TypeScript + Vite 6.4.3, 1621 modules transformed.
- Không sửa code runtime hoặc assertion; không chạy lại browser/native UI trong đợt dọn tài liệu. Kết quả browser trong bảng là của Huy đã cung cấp.

## Dọn cấu trúc ngày 09/10/2026

Huy yêu cầu gom thư mục vì còn nhiều file trùng/hướng dẫn cũ. Codex giữ bốn tài liệu chính ở gốc, chuyển API/nội dung sang technical, chuyển năm cặp HTML/TS sang tests, sửa import thêm một cấp ../ và đường dẫn Markdown/HTTP. Xóa bảy tài liệu trùng sau khi nội dung được gom vào FLOW, MIGRATION và README; assertions và evidence được giữ. Không thay code runtime hoặc ký nghiệm thu thay reviewer. Link file trong PR đang mở cần cập nhật sang vị trí mới.

Verification sau di chuyển: Codex chạy lại script 91 PASS / 0 FAIL, npm run check PASS (16 Context checks), npm run build PASS (1621 modules). Cả năm entry TS của trang test bundle thành công với import mới; mười URL HTML/TS trả HTTP 200 qua Vite dev server. Chỉ kiểm đường dẫn/import, không tuyên bố đã chạy lại assertions native trong browser.
