# Kiểm thử và AI log — MW-TEAM-03

## Môi trường và trạng thái bàn giao

- Người được giao: Chung Minh Hiếu. Thực thi code/test: Codex theo yêu cầu trực tiếp đợt 1.
- Ngày chạy: 06/10/2026. Deadline: **20:00 ngày 10/10/2026, giờ Việt Nam (UTC+7)**.
- Branch: `feat/mw-team-03`; base SHA: `685435047a58f05d1bb3a90ae901425bdcb31074` + thay đổi working tree chưa commit. SHA này là baseline, không phải commit chứa kết quả đợt 1. Chưa có PR, chưa push.
- Windows / PowerShell; Node v24.15.0, npm 11.12.1; TypeScript/esbuild/Vite dùng dependency đã có.
- Test bundle progress.ts trực tiếp bằng esbuild vào bộ nhớ, assert của Node; không sửa package/check chung, không cài dependency.
- Dữ liệu: fixture LearningPlan v2 tổng hợp, UUID deterministic; deep-freeze và so sánh sâu input; không đọc/ghi localStorage hay dữ liệu học thật. Không có trình duyệt/viewport vì đợt này không sửa UI.

## Kết quả thực tế

Lệnh `node scripts/tasks/MW-TEAM-03.mjs` trả exit code 0: **20/20 tests passed**. TC12 có ba test độc lập; các mã dưới đây trùng tên trong script. Các bước và expected đã được assert thực sự; không phải kiểm tra thủ công suy đoán.

| Mã / liên kết | Input và bước thực hiện | Expected | Actual / trạng thái |
|---|---|---|---|
| TC01 / AC02 / FL02 | Plan todo; set true hai lần, false hai lần, true lại; đếm lần gọi ID factory | 2 completion, chỉ 1 active, done=1; repeated no-op, input nguyên | Khớp toàn bộ — Pass |
| TC02 / AC02 / FL02 | Ngày 30/02, 24h, thiếu offset, timezone sai, ngày lệch; UTC sang VN, 29/02 năm nhuận, DST New York | Input lỗi bị từ chối; localDate đúng timezone | Khớp toàn bộ — Pass |
| TC03 / AC02 / FL02 | UUID trùng task/plan/generation/history, ID sai, factory throw | OperationResult lỗi, không tạo completion | Khớp toàn bộ — Pass |
| TC04 / AC02 / FL02 | Task thiếu, completed không boolean, skipped, done không ledger, task ID trùng, hai ledger active | Từ chối command thay vì đếm trùng/sửa ngầm | Khớp toàn bộ — Pass |
| TC05 / AC02 / FL02 | Undo trước completedAt; undo legacy ngày null | Từ chối clock lùi; giữ ngày legacy null | Khớp toàn bộ — Pass |
| TC06 / AC03 / FL03 | Đổi title/acceptance/minutes; đổi lại; sửa notes/lịch/cùng giá trị | customized bật và sticky; notes/lịch/no-op không bật | Khớp toàn bộ — Pass |
| TC07 / AC03 / FL03–04 | Phút 0/âm/lẻ/NaN/Infinity; title/requirements/notes sai; tuần/ngày sai; patch ID | Lỗi từng field; không mutation | Khớp toàn bộ — Pass |
| TC08 / AC03 / FL03 | Add custom; stage sai, ID trùng, phút sai, chèn status, đích đóng | Custom UUID, null provenance, customized; input lỗi bị chặn | Khớp toàn bộ — Pass |
| TC09 / AC02–03 / FL04 | Done → dời tuần → backlog → tuần khác; gọi backlog lặp | Giữ ID/source/work/segment/notes/status/completion và ledger; backlog ngày null | Khớp toàn bộ — Pass |
| TC10 / AC03 / FL03,06 | Hoàn thành 30 phút rồi sửa thành 80 | Completion vẫn 30; stats task là 80 | Khớp toàn bộ — Pass |
| TC11 / AC04 / FL05 | Đóng tuần 1 trước; tuần 0 có done/todo; close move_next | Todo sang tuần 2; snapshot tuần 0 trước dời; ledger và input nguyên | Khớp toàn bộ — Pass |
| TC12-move_next / AC04 / FL05 | Close tuần có done/todo, rồi close lại với skip | Todo sang tuần 1; một snapshot, snapshot vẫn 50% | Khớp toàn bộ — Pass |
| TC12-move_backlog / AC04 / FL05 | Close chọn backlog rồi gửi lặp | Todo về backlog; một snapshot, vẫn 50% | Khớp toàn bộ — Pass |
| TC12-skip / AC04 / FL05 | Close chọn skip rồi gửi lặp | Todo thành skipped; snapshot vẫn todo và 50% | Khớp toàn bộ — Pass |
| TC13 / AC03–04 / FL02–05 | Edit/move/done ở tuần đóng; dời backlog vào tuần đóng | Tất cả bị chặn | Khớp toàn bộ — Pass |
| TC14 / AC04 / FL05 | Chỉ số sai, action sai, tuần rỗng, next từ MAX_SAFE_INTEGER | Lỗi cụ thể, không mất task | Khớp toàn bộ — Pass |
| TC15 / AC04 / FL01,04,06 | Done/todo/skipped/backlog, tuần rỗng, tất cả skipped, task 100 phút/quỹ 60 | Không đếm skipped, empty=true/0%, overtime=40, backlog không budget | Khớp toàn bộ — Pass |
| TC16 / AC04 / FL01,05–06 | History fixture; chốt/dời; sửa/done/undo task đã dời; sửa sâu output | Input/history/snapshot độc lập, tuần vẫn 50%; plan không cộng snapshot; generation sai báo lỗi | Khớp toàn bộ — Pass |
| TC17 / AC01,04 / FL01,06 | Archived rồi thử các mutation; task chỉ có trong history | Chỉ đọc, current task lookup không sửa history | Khớp toàn bộ — Pass |
| TC18 / AC03 / FL03 | Edit/add rồi sửa mảng acceptance của caller | Output không bị ảnh hưởng alias | Khớp toàn bộ — Pass |

## Lệnh kiểm tra và bằng chứng

Tất cả chạy ngày 06/10/2026 tại baseline SHA + working tree nêu trên.

| Lệnh | Kết quả thực | Phạm vi chứng minh |
|---|---|---|
| `node scripts/tasks/MW-TEAM-03.mjs` | Exit 0; `20/20 tests passed` | Logic domain progress, validation command, completion/snapshot/history; không chứng minh UI/storage/planner thật |
| `npm run check` | Exit 0; `PASS: 1 registered content pack(s), 26 modules` | Registry hiện tại, references/prerequisites, boundaries/cycles; legacy save giữ input khi storage throw |
| `npm run build` | Exit 0; TypeScript thành công; Vite 6.4.3, `1612 modules transformed`, `built in 4.38s` | TypeScript và production bundle hiện tại |

Check chung còn báo Pass cho 3 Backend tracks, 15 stages/track, 35 shared/contextual stages, 40 resources và 8 credential goals. **Không phải kết quả kiểm tra tám track AI**: bốn scaffold AI chưa được triển khai/đăng ký.

Prebuild sinh lại ba file catalog/flow chung, chỉ đổi line endings và không có diff nội dung. Đã đưa line endings về trạng thái trước build để giữ diff đúng allowlist; không chỉnh nội dung tài liệu chung.

## Chưa chạy và giới hạn

- UI chọn nhiều plan, activePlanId, preview/confirm/cancel, lỗi lưu, reload, desktop/mobile/keyboard: **chưa chạy**, vì UI vẫn State v1 và không được nối v2 trong đợt 1.
- Planner regeneration thật, import/migration/shared validator, optimistic concurrency nhiều tab: **chưa chạy**; test history dùng fixture, không tuyên bố end-to-end.
- Tám track AI: nội dung/URL/provider/phí/chứng nhận và hành trình app **chưa chạy**. Giữ bốn file có sẵn, không giả mốc checkedAt.
- Review của Chung Minh Hiếu, review chéo Triệu Quang Huy và nghiệm thu Phạm Tuấn Hải: **chưa thực hiện**.
- Completion retry hỗ trợ repeated desired state; không có command ID chống sự kiện cũ đến trễ. Add task cần caller khóa submit và retry save cùng kết quả, không add lần hai. Xem giả định tại TASK.md.

## Bug / phát hiện thật

- Khi đọc scaffold: các hàm progress trả not_implemented và stats luôn 0; comment backlog nói reset todo, trái yêu cầu giữ completion. Đã triển khai và sửa quy tắc backlog; TC01/TC09/TC15 kiểm chứng. Đây là phần chưa triển khai của scaffold, không gán thành lỗi production.
- Bộ test mới chạy lần đầu 20/20; không phát sinh test Fail trong lần chạy này. Không có lỗi build cần sửa ngoài allowlist.

## AI log

| Ngày | Công cụ / yêu cầu | Việc AI thực hiện | Kiểm chứng và phần con người còn làm |
|---|---|---|---|
| 06/10/2026 | Codex; Chung Minh Hiếu yêu cầu đợt 1, deadline 20:00 10/10/2026, không commit/push | Đọc AGENTS/task/contracts/kiến trúc và scaffold; triển khai progress thuần theo contracts, script test, 6 flow và tài liệu; giữ content/UI chung | Node assertions 20/20, check/build exit 0. Hiếu cần đọc giả định/API, thử lại khi tích hợp UI và tiếp nhận review; chưa giả lập xác nhận của con người |

Không dùng công cụ AI thứ hai trong đợt này; không bịa so sánh, review, ảnh UI hoặc PR. Kết quả đợt 1 không đánh Done cho toàn MW-TEAM-03.

## Đợt 2 — Kết quả mới nhất ngày 06/10/2026

Baseline SHA/branch/Node/npm vẫn như đợt 1; working tree có đợt 1 và nội dung mới, chưa commit. Bốn pack đã chuyển scaffold sang nội dung hoàn chỉnh để review; các ghi chú chưa biên soạn ở phần đợt 1 là lịch sử.

### Kiểm thử bổ sung AC-05 / US-03-C1,C2

| Ca | Input/bước thực hiện | Expected | Actual |
|---|---|---|---|
| CONTENT01 | Bundle bốn pack và registry Backend; resolve ID/stage/source/work/track/credential; kiểm DAG/thứ tự/portfolio | Đủ 8 ID track; unique ID, mọi tiên quyết trước chặng, không orphan; bài có phút 1–120/acceptance | Pass: 4 packs, 8 tracks, 39 stages, 37 resources, 78 works |
| CONTENT02 | So metadata resource/credential với SOURCES.json và official domain allowlist | URL/date/note khớp evidence; cost/format/level đúng enum, unverified date=null; source URL không nhân bản | Pass: 37 nguồn + 3 credential entries có evidence |
| CONTENT03 | Resolve foundation, nguồn và dependency liên pack cho mọi track | Scientist foundation và neural chỉ định nghĩa một lần; ML/MLOps/AI tìm được chặng/nguồn | Pass |
| CONTENT04 | Kiểm milestone từng nhánh, portfolio riêng, CPU/API/pricing notes và credential placement | Mỗi track có bài riêng; API mixed có key/pricing support; CV/NLP/RAG không gắn certificate không phù hợp | Pass |
| CONTENT05 | Clone fixture rồi chèn stage ID đã định nghĩa ở pack khác | Validator phát hiện duplicate ID | Pass, lỗi mong đợi được assert |
| CONTENT06 | Clone fixture rồi thêm prerequisite thiếu hoặc vòng Python↔arrays | Validator phát hiện missing/cycle | Pass, lỗi mong đợi được assert |
| CONTENT07 | Đảo stage order CV hoặc xóa nền evaluation khỏi serving | Từ chối thiếu/thứ tự tiên quyết | Pass, lỗi mong đợi được assert |
| CONTENT08 | Thêm resource thiếu hoặc default không thuộc resourceIds | Từ chối missing source/default sai | Pass, lỗi mong đợi được assert |
| CONTENT09 | Đặt minutes=0/121 hoặc acceptance=[] | Từ chối lượng bài sai/acceptance rỗng | Pass, lỗi mong đợi được assert |
| CONTENT10 | Credential thiếu, track path khác pack, chặng lặp trong track | Từ chối mỗi fixture lỗi | Pass, lỗi mong đợi được assert |

### Lệnh đã chạy

- `node scripts/tasks/MW-TEAM-03.mjs`: lần cuối exit **0**, **30/30 tests passed** (20 progress + 10 content). Script bundle bốn pack chưa đăng ký và một pack Backend dependency trong bộ nhớ; không thay registry app. Hỗ trợ khi Hải ghép các object pack này vào registry mà không đếm hai lần cùng object reference.
- `npm run check`: exit **0**, **1 registered content pack(s), 26 modules**; Backend references/prerequisites/legacy maps và storage boundaries pass. Registry thực tế vẫn chỉ Backend, không nhận đây là check chung đã chạy tám track mới.
- `npm run build`: exit **0**, TypeScript + Vite 6.4.3; **1612 modules transformed**, **built in 3.29s**. Bốn file pack nằm trong tsconfig include, được kiểm TypeScript; app bundle chưa import chúng qua registry.
- `git diff --check`: kiểm cuối sau tài liệu; không có whitespace error.

Prebuild lại sinh ba file chung, chỉ đổi line endings không đổi nội dung; đã trả line endings về baseline để không đưa file ngoài allowlist vào diff. Không sửa registry/contracts/package/dependency/UI/domain progress trong đợt 2.

### Lỗi thật và sửa trong đợt 2

- Hai lần chạy đầu test nội dung cho tổng **23/30**: validator ID toàn cục phát hiện stage mới trùng track `scientist.python`, tiếp theo `mlops.pipeline`; `ai-engineer.rag` cũng trùng và được sửa cùng lần rà. Đổi stage mới sang `scientist.foundation.python`, `mlops.pipeline.dag`, `ai-engineer.rag.pipeline` và cập nhật tham chiếu. Tám ID track giữ nguyên; stage/work mới chưa phát hành nên không có migration dấu đã học. Sau sửa test **30/30**, assertions collision vẫn giữ.
- Web tool không mở được ba URL ghi ở SOURCES.unverified; không gán checkedAt giả. Dùng official pages mở được thay thế. Các URL redirect lưu địa chỉ đích; Harvard certificate được mở nhưng loại vì chương trình R không phù hợp Python track.
- Windows từ chối command biên soạn quá dài trước khi ghi file; chuyển sang patch để tạo dữ liệu. Helper tạm đã xóa; chỉ bàn giao pack tĩnh và tài liệu/evidence.

### Kiểm chứng nguồn và giới hạn còn lại

- Đã mở/read 37 source pages, 3 certificate pages và supporting pages (Gemini pricing, Docker license/hardware, Actions billing, HF course/certificate conditions), cùng khảo sát Harvard. Chi tiết URL/topic/cost/access ở [SOURCES.json](SOURCES.json) và [CONTENT_REVIEW.md](CONTENT_REVIEW.md).
- checkedAt=06/10/2026 nghĩa là kiểm tra trang chính thức và nội dung/điều kiện công khai, không phải đã đăng nhập, học xong, chạy notebook, mua thi/API hoặc đạt certificate. Không dùng search snippet thay bằng chứng mở trang.
- Test CONTENT02 kiểm metadata với evidence đã ghi, không phải live network test định kỳ hay tự chứng minh từng claim giáo dục đúng. Trang/giá/thiết bị có thể đổi; reviewer cần đọc nguồn trước nghiệm thu/đăng ký.
- Chưa chạy planner thật, lựa chọn/đổi resource/tạo lịch/done/reload trên cả tám track, UI/keyboard/mobile và đo thời gian 78 learning exercises. Đó là bước sau đăng ký registry/context; không đánh Pass end-to-end.
- Content `review`, chưa `ready`; review chéo/Hiếu/Hải chưa thực hiện. Deadline **20:00 10/10/2026 giờ Việt Nam**, chưa commit/push.

### AI log bổ sung

| Ngày / công cụ | Yêu cầu và thao tác thực | Kiểm chứng / người review còn làm |
|---|---|---|
| 06/10/2026 / Codex | Theo yêu cầu đợt 2 của Hiếu, đọc chuẩn/contracts/scaffold; mở nguồn chính thức; viết 4 pack/8 track và SOURCE evidence, khảo sát certificate; bổ sung CONTENT01–10, handoff registry và giải thích nội dung | 30/30 task tests, check/build exit 0; phát hiện/sửa stage collision. Hiếu duyệt chủ đề/workload/acceptance; Hải ghép registry; chạy UI/planner thật sau tích hợp. Chưa tự ký nghiệm thu hay đạt chứng nhận |

## Đợt 3 — Controlled MyPlanV2, ngày 06/10/2026

Người làm Chung Minh Hiếu; deadline **20:00 10/10/2026 giờ Việt Nam**. Branch feat/mw-team-03, SHA baseline **685435047a58f05d1bb3a90ae901425bdcb31074**, working tree chưa commit. Bản kiểm là changes hiện tại, SHA baseline không chứa code mới.

### Context, phạm vi và môi trường

- Đọc lại context trước sửa: LegacyAppContext dùng State v1, persistence chưa có Workspace v2 load/save/migration. Giữ nguyên MyPlan.tsx, App/context/sidebar/CSS/shared components/contracts/registry. Chỉ thêm MyPlanV2/viewModel, mở rộng script test và docs task.
- MyPlanV2 nhận plans/activePlanId/stages/callback, domain thuần progress.ts đã kiểm thử. Không storage riêng. Fixture docs chỉ in-memory 8 plan với 3 việc/plan và history giả; không planner, không dữ liệu học thật. Shared source Python dùng để kiểm thao tác ở các track, không khẳng định toàn bộ bài từng track đã tạo lịch.
- Windows PowerShell, Node/dependency đã có trong repo; TypeScript, Vite 6.4.3. Browser IAB tại loopback port5183. Viewport desktop mặc định và tạm390×844, đã reset sau test. Không reset/xóa localStorage app của người dùng.

### Ca tự động bổ sung

| Test | Steps / expected | Actual |
|---|---|---|
| UI01 | Parse trim title/yêu cầu, 1-based tuần→0-based, backlog null; từ chối phút/tuần/ngày/title/yêu cầu/stage sai | Pass |
| UI02 | Lịch sparse tới1000000 không enumerate gap; visible closed snapshot giữ todo trước dời, không mutate plan | Pass |
| UI03 | closed week, history generation, archived plan readonly; current open writable | Pass |
| UI04 | Roundtrip task form và update schedule giữ ID/source/completion/customized | Pass |
| UI05 | SSR empty/loading/load-error/active ID thiếu không crash, có thông điệp rõ | Pass |
| UI06 | SSR dropdown plan, Plan/Stats/Weeks/backlog/quỹ giờ/acceptance/source snapshot | Pass |
| UI07 | SSR archive ẩn mutation buttons, completion disabled | Pass |
| UI08 | Text escape, URL javascript/invalid không render link, http/https được phép | Pass |

### Browser đã thực hiện (fixture-only)

| Case | Steps / expected | Actual |
|---|---|---|
| B01 | Plan scientist done→Stats→undo, không cộng trùng | Saves1 rồi2; plan1/3→0/3, week1/2→0/2 |
| B02 | Add form trống, save; không gọi callback | Hiện title/yêu cầu validation; chưa tăng Saves |
| B03 | Bật lỗi lưu, add Việc thử UI180phút/2 yêu cầu/notes; retry phải giữ candidate và ID | Lỗi, form giữ values; retry Saves2→3, 1 task mới, customized; cảnh báo210phút |
| B04 | Edit title thành Việc đã sửa UI,60phút,tuần2; move backlog | Saves3→4→5; việc ra khỏi tuần2, empty0/0 và nút chốt disabled; notes giữ |
| B05 | Reset dữ liệu, chọn tuần1, mở close preview→Hủy | Không save; Chốt tuần vẫn enabled; preview đích tuần2/150phút/vượt30 |
| B06 | Add dialog: Tab từ Title sang Phút, Escape đóng | DOM activeElement input Phút nằm trong dialog; Escape đóng không save |
| B07 | 8plan lần lượt select→done→undo→redo→close, action xoay next/backlog/skip | 8/8 checkbox snapshot done disabled, Saves32 (4 successful saves/plan); không đếm lần select |
| B08 | Stats ở cả8plan→Plan→tuần2 hoặc backlog | Tuần1 snapshot1/2·50% giữ nguyên; todo đúng đích next/backlog, skip không vào backlog |
| B09 | Chọn generation lịch sử / scenario archived | Banner readonly, checkbox disabled, không có add/edit/close |
| B10 | Scenario empty/error/Reload callback/loading | Heading empty, nút Tải lại và loading hiện; callback thử lại quay normal |
| B11 | Weeks và mobile390×844 | Weeks có Xem tuần/Xem backlog; mobile scrollWidth375<390, không tràn ngang, screenshot đọc task/nguồn/snapshot được |
| B12 | Reload preview, smoke app /Explore→My plan v1 | Fixture reset (không persistence test). App thật v1 hiện empty plan và link tạo; cả2tab console error/warn=[] trong phiên thử |

Ma trận: scientist.python→next; ml.classical→backlog; ml.cv→skip; ml.nlp→next; mlops.serving→backlog; mlops.pipeline→skip; ai-engineer.rag→next; ai-engineer.agents→backlog. Có kiểm destination và Stats snapshot từng plan. [JSON](evidence/ui-matrix.json), [desktop Weeks](evidence/ui-desktop.png), [mobile snapshot](evidence/ui-mobile.png).

### Lệnh / kết quả thực

- `node scripts/tasks/MW-TEAM-03.mjs`: **38/38 Pass**,20progress+10content+8UI model/SSR; exit0.
- TypeScript preview: `npx --no-install tsc --noEmit --target ES2022 --lib ES2022,DOM,DOM.Iterable --module ESNext --moduleResolution Bundler --jsx react-jsx --strict --skipLibCheck --allowImportingTsExtensions --resolveJsonModule --isolatedModules docs/tasks/MW-TEAM-03/ui-preview.tsx`: exit0. Docs không trong tsconfig chính nên check riêng.
- `npm run check`: exit0, **1 registered content pack,28modules**. Chưa full registry8track mới.
- `npm run build`: exit0, **1612modules**, Vite6.4.3. Fixture và component v2 chưa import vào entry production; build chỉ chứng minh app cũ chạy/TS của src, không integration v2.
- `git diff --check`: check cuối và ghi log evidence/verification.txt. Prebuild sinh3file chung chỉ đổi lineendings; chuẩn hóa về baselineCRLF, giữ nội dung; không xóa/restore thay đổi người dùng.

### Lỗi thật và cách xử lý

1. Bundle SSR react-dom Node cần dynamic require khi import dataURL. Lần đầu test harness không khởi tạo; thêm createRequire banner bằng esbuild hiện có. Không đổi dependency/package. Rút gọn dataURL stack khi lỗi để đọc kết quả.
2. Chạy test sau thêm UI:36/38. UI02 fixture dời cả2todo sangweek1 nhưng test chỉ đưa1task lên1000000 rồi mongweek1 biến mất; sửa setup đưa cả2task. UI06 mong chữ Yêu cầu nhưng UI render nội dung acceptance trực tiếp; sửa expectation match fixture Có kết quả. Giữ nguyên kiểm sparse/snapshot/acceptance và mọi negative assertions; sau đó38/38.
3. Browser checkbox `.check()` báo không đổi ngay vì controlled UI chờ save100ms. Đọc lại thấy Saves1/checked true; dùng click và wait notice save để kiểm kết quả async, không sửa domain thành optimistic.
4. Retry locator ban đầu match2buttons (global và dialog). Scope dialog để thử xong, sau đó sửa UI chỉ hiện global retry khi không có form/preview, tránh duplicate action phía sau modal.
5. Reset fixture giữ navigation local của component, lúc đang tuần2 sau reset chốt disabled đúng vì tuần rỗng; chọn tuần1 trước chạy ma trận. Không coi lỗi test driver là lỗi persistence.
6. Preview bổ sung đích cụ thể/overtime; warning ở readonly đổi thành số liệu bản chỉ đọc, không gợi ý dời việc bị khóa. Mobile screenshot đã kiểm sau thay đổi.

### Chưa chạy / không nhận Pass

- V2 sản phẩm chưa nối: chọn nguồn/đổi nguồn→planner thật→tạo plan→done/undo→close→reload persistence trên8track, activePlanId reload, v1 migration/backup, multi-tab revision conflicts và regeneration customized **chưa chạy**.
- Browser add lỗi/retry là fault injection callback, không thực sự làm localStorage/quota bị lỗi. Close save fail chưa thử browser riêng (domain snapshot/repeat có test). E2E stale callback giữa tab và keyboard đầy đủ bằng screen reader/chứng nhận accessibility chưa chạy.
- Mobile kiểm viewport390×844 và Tab/Escape cơ bản, không giả thiết đã thử thiết bị thật hoặc mọi browser/breakpoint. Learning labs/certificate vẫn chưa thực hiện.
- Reviewer cần đọc DEMO_INTEGRATION/PR_DESCRIPTION và nghiệm thu; task chưa Done toàn bộ, chưa commit/push hoặc tạo PR.

### AI log đợt3

| Ngày / công cụ | Công việc thực | Review tiếp |
|---|---|---|
| 06/10/2026 / Codex | Rà contextv1 và boundaries, viết controlled MyPlanV2/viewModel tái dùng progress/Dialog/CSS; fixture 8plan,8test UI; browser fault/retry, snapshot3action, readonly/multi-plan/mobile/keyboard; cập nhật6flow, QA, demo, adapter diff đề xuất và PR description | 38/38, check/build/preview typecheck và fixture browser Pass; giữ appv1. Hiếu đọc demo/nội dung, người sở hữu chung nối Workspace/persistence/registry và chạy full E2E chưa thực hiện; không ký nghiệm thu thay reviewer |

Browser bổ sung cuối đợt3: lỗi onSelectPlan khi đổi sang ml.classical giữ scientist.python, hiện issues; lỗi lưu completion rồi Bỏ thay đổi chưa lưu giữ unchecked và Saves0. Đã reload fixture về trạng thái sạch; ghi thêm checks trong ui-matrix.json. Vite port5183 còn chạy để demo, Ctrl+C tại terminal để dừng.
