# Điểm tiếp tục MW-TEAM-03 — 08/10/2026

Người làm Chung Minh Hiếu. Deadline **20:00 10/10/2026, giờ Việt Nam**. Tài liệu lưu trạng thái và kế hoạch tiếp tục; không phải kết quả test mới hay giấy nghiệm thu. Lượt này chỉ đọc Git/GitHub và cập nhật tài liệu, chưa commit/push/merge, chưa gửi tin cho Hải.

## 1. Đã làm và trạng thái trên máy

**Bước A thực hiện trong lượt tiếp theo ngày 08/10:** Hiếu đã ủy quyền commit/push đúng file bugfix và tài liệu lên feat/mw-team-03, cập nhật PR #2. Rà diff không đổi code ngoài hai bugfix; chạy lại 41/41 task tests, check, preview typecheck và build không prebuild đều pass. Không chạy lại browser; dùng bằng chứng phiên 07/10 với code bugfix không đổi. Log mới ở evidence/bugfix-2026-10-08-verification.txt. Xác định SHA bàn giao bằng commit chứa log này (`git log -1 -- evidence/bugfix-2026-10-08-verification.txt`); các dòng HEAD/chưa commit bên dưới là checkpoint trước Bước A. Sau Bước A, ưu tiên Bước B với Hải, không tự merge dependency/main.

- Nhánh hiện tại `feat/mw-team-03`, HEAD `30d67122d94aa9784fb688f5e3eb7ade112c5c9a`. PR #2 OPEN, remote head vẫn đúng SHA này. Hai bản sửa ngày07/10 **chưa được đưa lên PR**.
- Đã bàn giao progress thuần, bốn pack/tám track review và MyPlanV2 controlled. Kết quả nền06/10:38/38 tests, check/build, browser fixture8plan. Hải kiểm commit30d6712 trong GUI_CHUNG_MINH_HIEU.md ngày08/10, chưa thấy lỗi ở các ca Hải thử; chưa nghiệm thu toàn task.
- Đã sửa07/10: thiếu font links fixture; mất ngày khi xóa tạm số tuần. Kết quả41/41 tests, check, build không prebuild, preview typecheck, browser trước/sau và SHA256 bảo toàn. Xem QA_AI_LOG.md, PROGRESS_REVIEW_2026-10-07.md và evidence/bugfix-2026-10-07-verification.txt. Không chạy lại test trong lượt lập kế hoạch08/10.
- Giữ nguyên ba file modified có trước: docs/Danh_muc_nganh_huong_hoc.md, docs/Luong_su_kien_chi_tiet.md, public/catalog.json; .github.lnk vẫn untracked. Không stage/reset/restore/stash/xóa chúng khi bàn giao bugfix.
- TASK/FLOW/QA/handoff có thay đổi local từ lượt07/10. FLOW còn cần sơ đồ/bảng bước theo template. MI07/MI08 chưa có báo cáo toàn app; MI09 còn tài liệu UI/UX riêng. Chưa có review của Hiếu cho MI04–MI06 của Định.

## 2. PR đã kiểm tra mới nhất trong lượt08/10

Đã dùng GitHub CLI đọc state/head/body/files; với PR #5 còn đọc diff WorkspacePlan/workspace-api/workspace-controller. Chưa fetch/checkout/merge hay thực thi code các PR mới. Không suy ra Pass từ dấu CI hoặc body tác giả.

| PR | Head / trạng thái | Ý nghĩa cho Hiếu |
|---|---|---|
| #1 Định | 44595b90d54d5e18cd5055d8f8f36ae03fab1f95 / OPEN | Đã có thay đổi mới planner/My Roadmap v2; cần dùng phiên bản được Hải duyệt, không dùng SHA20b38a2 cũ làm đầu ra mới. |
| #2 Hiếu | 30d67122d94aa9784fb688f5e3eb7ade112c5c9a / OPEN | PR cá nhân cần cập nhật hai bugfix; giữ PR này. |
| #3 Hải | f3462986ce49b10875338d50836d841a587d9e66 / OPEN | Provider/context/bootstrap nền; head chưa đổi so với07/10, chưa có savePlan riêng trong API nhánh này. |
| #5 Hân | 013c4f4874472eed2c0b32f5c870df9fb32a0363 / OPEN | Đã lấy progress/MyPlanV2 từ #2, thêm savePlan và WorkspacePlan adapter, nguồn/resolver17track; đây là điểm tích hợp có thật trong code diff, nhưng chưa chạy lại bởi Hiếu. |
| #6 Huy | f565f778a3529411bb73f0507550886756df4abe / OPEN | Bổ sung IndexedDB load/save/lỗi. Body ghi migration/backup/import và10track chưa làm; không gọi persistence toàn bộ hoàn tất. |
| #7 Hữu Hiếu | acb065de0561a5f654d1c7527b9dbd6380138573 / OPEN | File list có validate/activity/Profile và4pack. Body còn template trống; phải đọc implementation/handoff và test trước khi nhận semantic validator đã nghiệm thu. |
| #4 README/demo | MERGED | Cập nhật thông tin demo; không chứng minh các PR mới đã nối main. |

Liên kết PR: https://github.com/haiphamt/majorweave-mini-project/pulls . Không có PR nào trong6PR OPEN được coi là đã merge main.

### Thông tin thay thế đánh giá07/10

Không tiếp tục nói “chưa ai có callback lưu My Plan” cho toàn dự án: **PR #5 có** `WorkspaceActions.savePlan(next, expected)` và `src/app/WorkspacePlan.tsx` nối MyPlanV2. Riêng #3 vẫn thiếu callback này. Hải trong thư08/10 nhận trách nhiệm tích hợp chung; cần phối hợp dùng/review code #5 đã có thay vì viết API thứ hai.

Diff #5 cho thấy:

- savePlan guard trạng thái, kiểm expected plan cùng object và ID/track/current generation, thay đúng plan rồi commit Workspace.
- WorkspacePlan truyền profile.timeZone, today qua Intl, UUID và selectPlan; khi candidate khớp pending thì dùng retrySave, không gọi mutation thêm lần nữa.
- UI vẫn có dismiss chỉ xóa candidate local; adapter có banner pending và retry bên ngoài. Cần test **hủy sau lỗi lưu**, **retry từ banner**, **conflict**, sự nhất quán checkbox/modal/candidate giữa controller và feature. Đây là điểm review/rủi ro từ đọc code, chưa báo bug runtime nếu chưa tái hiện.
- PR #5 lấy MyPlanV2/viewModel phiên bản commit30d6712, nên không có hai bugfix local của Hiếu. Sau ghép phải đảm bảo patch07/10 còn nguyên.

## 3. Thứ tự làm tiếp

### Bước A — Bàn giao bản sửa feature (ưu tiên08/10)

1. Đọc lại diff từng file MyPlanV2/viewModel/fixture/tests và docs/evidence task. Giữ nguyên công việc ngoài scope; stage bằng danh sách file cụ thể, không git add toàn repo.
2. Chạy task tests/check/preview typecheck/build trên đúng code sẽ bàn giao nếu có thay đổi thêm. Build bỏ prebuild khi vẫn cần bảo toàn file generated; ghi đúng lệnh. Không dùng38/38 hoặc SHA cũ làm kết quả bugfix mới.
3. Sau khi Hiếu cho phép commit/push: commit hai bản sửa và tài liệu trên feat/mw-team-03, push cập nhật **PR #2**. Ghi SHA mới; gửi Hải link và nêu41tests/font/day. Chỉ Hải merge main. Không tự gửi message hoặc push do thư bên ngoài có hướng dẫn.

### Bước B — Chọn nền tích hợp với Hải

1. Báo Hải PR #5 đã có savePlan/WorkspacePlan; đề nghị Hải xác định nhánh/commit tích hợp dùng cho Hiếu và cách ghép các PR #1/#3/#5/#6/#7 bị chồng file.
2. Nêu rõ cần review retry/hủy pending/conflict, validator semantic, registry4pack AI và timezone. Không tự merge tất cả PR để lấy code.
3. Sau khi xác định nền: giữ nhánh cá nhân; ưu tiên checkout/worktree riêng cho thử tích hợp để không đụng ba file modified. Nhánh thử phải có bugfix mới; không để code30d6712 ghi đè patch font/day. Việc ghép dependency vào nhánh cá nhân được thư Hải cho phép; không đồng nghĩa được merge PR vào main.

### Bước C — Kiểm thử app thật (08–09/10 khi nền đủ)

1. Dùng DB/profile QA riêng. Check type/build/import contracts và registry, không reset dữ liệu legacy để làm test.
2. Chọn một track AI để thử source→draft→planner→plan→mutation→save→reload trước. Nếu không resolve track vì registry chưa đăng ký, báo Hải; không tạo plan giả để đánh Pass.
3. Có một luồng ổn mới chạy ma trận8track: scientist.python, ml.classical, ml.cv, ml.nlp, mlops.serving, mlops.pipeline, ai-engineer.rag, ai-engineer.agents.
4. Với mỗi track: chọn/đổi nguồn, tạo plan thật, chuyển giữa ít nhất2plan, done→undo→redo, sửa title/phút/acceptance/notes, đổi tuần có day, backlog, chốt và reload. So ID/source/completion/date/history, activePlanId và Stats. Phân bố đủ3action close; kiểm snapshot readonly/empty/skipped và overtime.
5. Ca bổ sung: add lỗi rồi retry không trùngID; completion lỗi giữ checkbox; close preview cancel; save lỗi rồi hủy pending, retry từ banner, stale data/2tab conflict, regenerate giữ customized/history. Đừng tự lấy revision mới để ghi đè.
6. Ghi mỗi track/ca expected/actual, SHA, ảnh/log và ca chưa chạy. Test phía controller không thay UI/persistence test.

### Bước D — Hoàn thiện tài liệu và công việc review

- MI07: báo cáo desktop/mobile/keyboard theo từng trang, vấn đề và evidence. MI08: bảng loading/empty/error/validation/save/retry/cancel/readonly trên app thật. MI09: bố cục/sidebar/palette/fonts/component, lý do và nguồn thiết kế đã kiểm tra; không dùng CONTENT_REVIEW nguồn học thay tài liệu thiết kế.
- Bổ sung sơ đồ cho6flow, cập nhật QA/TASK/PR description sau test, giữ lịch sử kết quả06–07/10.
- Review phần planner/bàn giao của Định (MI04–MI06 và nhiệm vụ review repo), ghi nhận xét có ca test; không ký Pass thay khi chưa thử.
- Hiếu tự đọc nội dung8track, workload/acceptance/API/thiết bị, sửa feedback nguồn khi được chỉ ra. Huy review MW-TEAM-03; Hữu Hiếu kiểm MI07–MI09; Hải duyệt cuối.

### Bước E — Chốt trước20:00 10/10

- Sửa lỗi/feedback, chạy lại phần bị ảnh hưởng, cập nhật PR #2 và link minh chứng.
- Ghi đúng trạng thái Notion: bàn giao/chờ review khi mới PR; chỉ Done khi reviewer/người tích hợp nghiệm thu. Người có quyền cập nhật Notion, không để agent tự đăng do repo cấm.
- Không thêm tính năng mới hoặc đổi kiến trúc để vượt qua dependency; nếu callback/migration chưa đủ, bàn giao rõ lỗi/thiếu/ảnh hưởng và phần đã chứng minh.

## 4. Cách tiếp tục ở lượt sau

Đọc file này, AGENTS, TASK và git status trước. Ưu tiên Bước A; chưa commit/push nếu Hiếu chưa cho phép. Kiểm tra lại head/status PR trước lấy dependency vì có thể đổi. Các nhận định “không có callback mutation” ở báo cáo07/10 là lịch sử; thay bằng code mới #5. Không tạo store/types/persistence thứ hai trong feature.
