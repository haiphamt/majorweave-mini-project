# Hướng dẫn kiểm thử và AI Log — MajorWeave

Mỗi bạn ghi kết quả của mình trong `docs/tasks/MW-TEAM-0x/QA_AI_LOG.md`. Không cần cài skill để viết test/log. Antigravity đọc AGENTS.md, TASK.md và hợp đồng chung trước khi sửa. Skill vẽ luồng là tùy chọn; sơ đồ không thay việc chạy test.

## 1. Test từ user story

Story mẫu: “Là người học, tôi muốn lưu tiến độ và mở lại để tiếp tục học.”

- AC: done → transaction hoàn tất → báo thành công → reload vẫn done.
- Lỗi: abort/quota → không báo thành công; giữ bản sửa và dữ liệu đã lưu.
- Conflict: hai tab cùng revision → tab cũ không ghi đè tab mới.
- Hủy: cancel preview/import/close-week → dữ liệu không đổi.

Viết expected **trước** khi chạy. Mỗi case có điều kiện/dữ liệu/bước/expected/actual/evidence.

| ID | Story/AC | Điều kiện | Bước | Mong đợi | Thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|---|---|
| TC-01 | Lưu tiến độ | DB QA mới, backend.node | Tạo → done → chờ lưu → reload | Task done, ngày giữ | Điền sau chạy | Not run | SHA/log/ảnh |
| TC-02 | Không mất dữ liệu | Hai tab cùng DB/revision | A lưu → B lưu bản cũ | B conflict, không ghi đè | Điền sau chạy | Not run | SHA/log/ảnh |
| TC-03 | Hủy không ghi | JSON hợp lệ | Preview → Cancel → reload | Plan count/revision giữ | Điền sau chạy | Not run | SHA/log/ảnh |

Trạng thái: `Pass`, `Fail`, `Blocked`, `Not run`. Công cụ chặn nhập file là Blocked. Mock quota không phải hết dung lượng thật.

## 2. Ba lớp kiểm tra

### Cấu trúc/build

```powershell
npm ci
npm run check
npm run check:team
npm run build
git rev-parse HEAD
```

- `check`: registry/ID/tiên quyết/module/resolver/Context và integration regression.
- `check:team`: logic thuần năm task. TEAM-04 cập nhật file unit kết quả của task đó; review diff trước commit.
- `build`: TypeScript/bundle, không chứng minh UI.

### Logic cụ thể

```powershell
node scripts/tasks/MW-TEAM-01.mjs
node scripts/tasks/MW-TEAM-02.mjs
node scripts/tasks/MW-TEAM-03.mjs
node scripts/tasks/MW-TEAM-04.mjs
node scripts/tasks/MW-TEAM-05.mjs
node scripts/check-integration.mjs
```

Assertion: đúng nguồn/nhánh, không mutation input, không trùng ID, giữ ngày, đúng tổng phút, history nguyên. Inject lỗi persistence để test retry; ghi rõ fixture/mock. IndexedDB thật cần test riêng. Không bỏ assertion để suite xanh.

### Trình duyệt thật

```powershell
npm run dev -- --port 5195
```

Mở `http://127.0.0.1:5195/tests/integration-browser.html?session=<UUID>#/roadmap`, thay `<UUID>` bằng ID mới. Harness dùng AppShell thật, DB QA riêng và v1 fixture. Test conflict: hai tab cùng URL session. Không xóa dữ liệu người dùng.

Checklist cho feature bị sửa:

1. Chọn hướng/nhánh/nguồn → tạo → task đúng nguồn → done → **chờ báo lưu thành công** → reload.
2. Đổi track giữ metadata/tiến độ plan cũ; tạo mới giữ cả hai.
3. Tạo lại: preview/cancel không đổi; confirm có history, giữ việc phù hợp theo ID/revision.
4. Sửa tên/phút/ghi chú/ngày; xóa ngày về chưa xếp; backlog; chốt tuần cả ba cách xử lý, snapshot chỉ đọc.
5. Profile save/cancel/input sai; timezone giữ ngày cũ; undo cập nhật heatmap.
6. Xuất JSON → nhập → ID trùng skip/copy → cancel/confirm → reload. File lỗi/version lạ bị từ chối cả file.
7. V1: preview không ghi → cancel → confirm → raw nguồn giữ → chuyển lại không trùng. Thiếu planMeta cần bối cảnh, không đoán stack.
8. Save fail/abort/blocked: candidate còn; retry giữ ID; bỏ có xác nhận; hai tab không ghi đè.
9. Desktop/mobile 390px: dialog cuộn, không bị che/tràn ngang; bàn phím dùng được.

Script `--ui` cũ TEAM-04 nhắm Profile v1. Không dùng kết quả đó để kết luận v2 đã Pass; dùng harness/callback hiện tại.

## 3. Minh chứng

- Ghi ngày/OS/browser/version/viewport/branch/**SHA**. Nếu chưa commit, ghi “working tree” và file đang sửa; không gắn kết quả vào main.
- Terminal giữ lệnh/exit/output. Ảnh chụp điểm chứng minh AC; test lưu phải có reload.
- Mỗi lỗi: bước tái hiện, expected/actual, nguyên nhân đã xác minh, commit sửa/retest. Giữ Fail ban đầu và Pass sau sửa.
- Evidence: `docs/tasks/<TASK>/evidence/`, link tương đối trong MD. Không commit backup cá nhân/token/ảnh riêng.
- CI xanh, ảnh đẹp và URL HTTP 200 là bằng chứng khác nhau. URL sống không chứng minh nguồn miễn phí/chứng chỉ được công nhận.

## 4. AI Log

Ghi AI giúp gì và người thực hiện kiểm tra gì. Ghi đúng tool/model; không nhớ model thì “không ghi nhận”, không đoán.

| Ngày | Tool/model | Mục đích/prompt | Đầu ra AI | Quyết định người làm | Kiểm tra | Evidence |
|---|---|---|---|---|---|---|
| Điền thật | Antigravity/model thật | TASK + AC lưu/retry | Code/test/đề xuất | Giữ/sửa/reject gì, vì sao | Lệnh, kết quả, SHA | Diff/log/ảnh |

Mẫu, **chưa phải kết quả đã thực hiện**:

```text
Task/test: MW-TEAM-xx / TC-02
Tool/model: ...
Prompt: test transaction abort, giữ ID/candidate.
Đầu ra: ...
Phần tôi sửa hoặc reject + lý do: ...
Kiểm tra: command/browser steps ...
Thực tế: Pass/Fail/Blocked/Not run + expected/actual ...
Commit/evidence: ...
```

Nếu cần so sánh hai AI: dùng cùng yêu cầu/ràng buộc/input cho hai tool **đã thực sự dùng**. So sánh API, logic, giữ dữ liệu, bảo trì/test; ghi lựa chọn/reject có lý do. Chưa dùng AI thứ hai thì ghi chưa làm, không dựng lịch sử.

Prompt Antigravity gợi ý:

> Đọc AGENTS.md, TASK.md và INTEGRATION_V2.md. Chỉ sửa phạm vi task. Từ story/AC, viết FLOW với main/alternative/error/cancel và test expected trước chạy. Kiểm tra thuần/UI riêng, chờ save hoàn tất trước reload. Không reset storage, đổi style/contracts hoặc tự merge. Ghi kết quả thật/SHA/evidence vào QA_AI_LOG.md; chưa kiểm tra ghi Not run/Blocked.

## 5. PR cho nhóm trưởng

Ghi phạm vi, story/AC, file chung bị tác động, test/SHA/evidence, lỗi/giới hạn, AI đã dùng. Request review Hải; không tự merge/push main/force push. Sau merge lấy main mới trước task tiếp.

Nhóm trưởng xử lý lỗi tích hợp thì dẫn commit đó; không ghi là kiểm thử cá nhân đã tự chạy.
