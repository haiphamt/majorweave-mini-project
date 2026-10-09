# Đối chiếu tiến độ MW-TEAM-03 — 07/10/2026

Chung Minh Hiếu · deadline **20:00 10/10/2026 Việt Nam**. Không quy đổi tiến độ thành phần trăm. Đây là kết luận từ code/refs Git, GitHub CLI và test thực; lời mô tả PR không tự chứng minh chức năng đã chạy.

## Mốc code đã đọc

- Nhánh làm việc `feat/mw-team-03`, HEAD `30d67122d94aa9784fb688f5e3eb7ade112c5c9a`. [PR #2](https://github.com/haiphamt/majorweave-mini-project/pull/2) OPEN, head đúng SHA này, API comments/reviews đều rỗng lúc đọc. Bugfix A/B ở working tree chưa commit/push.
- `origin/main` = `dd67b6735d59fe56b32384a674bbe03b76501962`: merge PR #4 cập nhật README/demo, `src/app/context.ts` vẫn LegacyAppContext/State v1. Không suy ra chuyển v2 từ trạng thái PR #4 merged. Main mới chỉ cập nhật thông tin demo; README dùng deadline cũ 12/10, task này dùng yêu cầu của Hiếu 10/10.
- [PR #1](https://github.com/haiphamt/majorweave-mini-project/pull/1) planner của Định OPEN, SHA `20b38a2f6a0640aff8e9f6d8de2426cf26e1515c`.
- [PR #3](https://github.com/haiphamt/majorweave-mini-project/pull/3) OPEN, `origin/feat/mw-context-v2` = `f3462986ce49b10875338d50836d841a587d9e66`, khớp GitHub API. Đã đọc WorkspaceProvider.tsx, workspace-api.ts, workspace-controller.ts, context.ts, registry, diff contracts và HANDOFF_CONTEXT_V2.md bằng `git show`; không checkout/merge dependency.
- Remote refs do Hiếu fetch trước lượt làm việc; head PR #3 khớp refs hiện có nên không cần fetch lại. PR #3 đã ghép planner #1 trong lịch sử nhưng cả hai PR chưa merge main. Chưa chạy tests của PR #1/#3 trong lượt này; test mà body PR liệt kê là kết quả tác giả báo cáo, không phải kết quả kiểm lại ở nhánh Hiếu.

## Đã làm và đã kiểm chứng trong phạm vi độc lập

| Yêu cầu | Code / bằng chứng | Kết luận |
|---|---|---|
| Done/undo/redo, event lặp và completion ngày thật | src/domain/progress.ts; TC01–05; verification bugfix | 20 test domain chạy lại pass, bao gồm idempotency, ID/calendar/timezone, legacy date. Chưa chứng minh durable save của app v2. |
| Thêm/sửa title, acceptance, minutes/notes, customized | progress.ts; MyPlanV2.tsx; TC06–08/10/18; UI01/04 | Logic và form độc lập pass. Không tạo storage/type plan riêng. |
| Dời tuần/backlog giữ identity/source/completion | progress.ts, viewModel.ts, UI09–10 | Lỗi mất ngày đã tái hiện browser và sửa. Xóa tuần tạm rồi nhập 2 giữ Thứ Ba; save blank backlog đặt cả tuần/ngày null. Unit chạy đủ7day và giữ ledger/input. |
| Close tuần với snapshot trước xử lý,3action,next OPEN,readonly | progress.ts; TC11–14/16/17; UI02/03/07 | Domain chạy lại pass. Browser8plan/3action ở QA ngày06/10; chưa kiểm transaction thật/reload. |
| Stats done/(todo+done), bỏ skipped, empty, không cộng snapshot/history | progress.ts; TC15–17; MyPlanV2 Plan/Stats/Weeks | Tests chạy lại pass. Browser Stats/history minh chứng06/10; font tiêu đề Stats kiểm lại07/10. |
| Plan chọn/lỗi/loading/empty/history; validation/preview/cancel/retry | MyPlanV2.tsx; UI05–08; evidence/ui-matrix.json | UI controlled và fixture hoạt động;41/41 task tests mới pass. Bằng chứng UI06/10 là fixture-only, không dùng thay cho context mới. |
| Font tiếng Việt theo style app | ui-preview.html, UI11, ảnh bug-a-before/bug-ab-after/bug-a-stats-after | UTF-8/NFC đúng; trước thiếu font links. Thêm3link giống index.html, không sửa CSS shared. Browser hiển thị Tuần2/Thống kê đúng, giữ letter-spacing -0.8px/style cũ. |
| Tám track4pack có nguồn,tiên quyết,work/portfolio | 4src/content/paths files; CONTENT01–10; CONTENT_REVIEW.md/SOURCES.json | 39stage,37source,78work,8track; structure/negative/dependency tests chạy lại pass. reviewStatus=review. |

## Đã làm nhưng chưa kiểm chứng đủ / còn thiếu

- Nội dung học: nguồn có bằng chứng đã mở ngày06/10 trong SOURCES; chưa chạy đủ78exercise hoặc đo thời gian học, chưa đạt credential. Tests metadata không tự xác minh tính đúng/chất lượng toàn khóa. Hiếu/reviewer còn đọc duyệt chủ đề/workload/acceptance.
- UI chọn nhiều plan/đổi source/tạo plan/regenerate/reload: mới kiểm fixture3task/plan với nguồn Python chung; chưa chạy planner/persistence thật cho8track. Không nhận đã tạo được8fullplan.
- Code MyPlanV2 đã có nhưng route sản phẩm vẫn MyPlan v1; source/stage props cần resolver toàn registry. Check chung tại nhánh Hiếu chỉ1Backend pack/28modules, không phải full registry v2.
- Story/FLOW/QA và bằng chứng đã có; FLOW còn thiếu sơ đồ/bảng step theo template. Các mục “chưa commit/PR” ở phần lịch sử06/10 là trạng thái cũ, không áp dụng cho commit bàn giao30d6712; đã sửa status đầu TASK/PR_DESCRIPTION.
- MI07/MI08 trong ảnh Notion: bằng chứng hiện mới phủ My Plan fixture và smoke app v1, chưa rà đủ toàn website. MI09 chưa có tài liệu UI/UX riêng hoàn chỉnh. Review MI04–MI06 của Định chưa có biên bản kết quả Hiếu thực hiện. Nội dung chi tiết Notion từng trang chưa truy cập được; không tự suy đoán acceptance bổ sung.

## Đang chờ nhóm và điểm nối cụ thể

1. Hải: duyệt/tích hợp PR #3 và #2, đăng ký scientist/ml/mlops/ai-engineer cùng dependency. Registry PR #3 hiện có Backend/Mobile/Game, chưa4pack của Hiếu. Không tự merge PR của người khác.
2. Context #3: `useWorkspace()` trả workspace/activePlan/actions. `actions.selectPlan` có thể chuyển kết quả Workspace thành OperationResult<void> cho prop onSelectPlan sau khi lưu thành công. Nhưng WorkspaceActions **chưa có replacePlan/updatePlan/mutatePlan** cho done/edit/close; hàm commit nội bộ không export. Không gọi thẳng persistence từ feature để lách API.
3. Callback mutation cần owner bổ sung (đề xuất để review): nhận candidate LearningPlan và expectedRevision/identity current generation; guard loading/saving/pending, kiểm plan active và validator, thay đúng1plan trong Workspace hiện hành, dùng transaction chung, giữ mọi draft/plan khác. Đây là chữ ký đề xuất, chưa là API tồn tại.
4. Retry/cancel: controller #3 có unsavedWorkspace/retrySave, UI hiện cũng giữ1candidate chưa lưu. Adapter phải thống nhất ownership: lần đầu mutation qua action chung; retry dùng action retrySave cho đúngcandidate; hủy pending cần callback bỏ candidate có kiểm trạng thái/conflict. UI dismiss hiện chỉ bỏ localcandidate nên **không được wiring đơn giản rồi cho là context pending cũng đã hủy**. Chưa có action discard riêng; reloadWorkspace(true) là thao tác bỏ dữ liệu rộng, chỉ dùng sau xác nhận rõ các thay đổi bị bỏ.
5. Huy/Hữu Hiếu: semantic validator/migration/import/export còn cần review và hoàn thiện. Bootstrap IndexedDB ở #3 không tự có migration v1; provider now/today dùng timezone máy, progress cần clock nhất quán theo profile.timeZone (không suy đoán bằng UTC slice).
6. Khi callbacks/registry sẵn sàng: nối MyPlanV2 trong allowlist, để Hải đổi route/context chung; tự thử8track fulljourney, nhiềuplan, regenerate customized, lưu lỗi/retry/cancel/conflict, completion/heatmap và reload. Huy review chéo, Hải nghiệm thu cuối. Hữu Hiếu là reviewer MI07–MI09 theo ảnh Notion, không thay vai trò Huy cho task repo.

## Quyền sửa và bảo toàn

Không worktree vì chỉ sửa file trong allowlist tại nhánh hiện có, không chuyển nhánh. Trước/sau đối chiếu SHA256 của3file generated modified và .github.lnk; không reset/restore/stash/xóa/stage chúng. Build dùng `npm --ignore-scripts run build` để vẫn chạy tsc -b && vite build, bỏ prebuild sinh3file chung. Không commit/push/merge hoặc gửi message review trong lượt này.

Kết quả lệnh và giới hạn: QA_AI_LOG.md mục07/10, evidence/bugfix-2026-10-07-verification.txt. Deadline **20:00 10/10/2026 Việt Nam**.
