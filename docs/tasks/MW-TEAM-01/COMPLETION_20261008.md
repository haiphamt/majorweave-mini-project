# Hoàn tất kỹ thuật MW-TEAM-01 — 08/10/2026

PR: https://github.com/haiphamt/majorweave-mini-project/pull/5

Code được kiểm thử: c53c8f98311f759a1c9e58fa872c1b5defdb0538
Gộp origin/main mới nhất (chỉ README): 7ba7d3b23a9f66138ecadd82508d815b6ca4468d
Minh chứng: QA_AI_LOG.md và evidence/. Commit tài liệu sau SHA trên không sửa runtime.

## Quyết định tích hợp của lượt này

Hân yêu cầu sửa lỗi và hoàn thành phần cần thiết để gửi PR. Để 17 nhánh chạy trên app chính, branch task tái dùng dependency của nhóm thay vì tạo kho lưu/planner riêng:

- Merge origin/feat/mw-context-v2 (PR #3): WorkspaceProvider/controller, persistence IndexedDB, callbacks, mobile/game sẵn có và kiểm thử context. Các commit được giữ nguyên tác giả.
- Lấy phiên bản planner và MyRoadmap từ feat/mw-team-02 (PR #1), progress/MyPlanV2/viewModel từ feat/mw-team-03 (PR #2); nối bằng adapter ở src/app. Không tuyên bố hoàn thành task của các bạn đó.
- Mở rộng shared API hai callback savePlan và toggleCredential; không đổi schema Workspace/ID, giữ storage v1 và legacy UI. Snapshot source/plan độc lập draft. Lỗi ghi giữ candidate, không báo thành công sớm.
- Registry đăng ký thêm FE/FS/UX; shell hiển thị đúng nhánh và trạng thái. Generator catalog dùng v2 để docs/public có đủ 18 hướng như Explore.
- Các file ngoài allowlist gốc là phần tích hợp cần thiết nêu ở trên và file/check sinh tự động, cần Hải duyệt cùng dependency PR #3/#1/#2. Đây không phải phê duyệt thay nhóm trưởng.

## File thay đổi chính

- Explore/PathDetail/StageDrawer, content catalog, resolver, Backend/FE/FS/UX packs, script task và tài liệu task.
- Adapter/shell/controller/registry ở src/app và src/content/index.ts; planner/progress và hai UI roadmap/plan tái dùng từ team.
- scripts/check-project.mjs, generate-catalog.mjs, context test và architecture example check; docs/public catalog/events sinh tự động theo build.

Không bỏ assertion cũ: architecture vẫn kiểm tra ngày nguồn kế thừa, ngày nguồn verified kiểm tra theo chính item. Context test vẫn xác nhận mười track đầu và mở rộng mọi track registry. Task test chạy trong npm run check/CI.

## Bàn giao

Check, build, 69 planner cases, 17 vòng integration và 17 vòng UI thật đều PASS; 12 ngành, hủy, lọc rỗng, bookmark, keyboard/mobile có minh chứng. UI quota/conflict chưa được giả lập; controller tests chứng minh giữ bản cũ/retry/revision conflict. Không xóa/reset dữ liệu hoặc commit token.

Code clone đã nhập vào checkout repo gốc trên feat/mw-team-01; không merge/push main. fix_ids.ps1 staged có sẵn của Hân được giữ nguyên và loại khỏi commit. .vscode/launch.json và các thay đổi package-lock đã tồn tại trong lịch sử task; PR mô tả để reviewer không nhầm là dependency mới.

Phần kỹ thuật sẵn sàng review. Định review chéo và Hải duyệt/tích hợp cuối; pack giữ review. So sánh hai công cụ AI là hoạt động chung chưa thực hiện trong lượt sửa này. Những claim/Pass lịch sử thiếu bằng chứng trong clone không được dùng thay kết quả mới.