# Bàn giao bản tích hợp v2 — 09/10/2026

18 content pack / 50 track chạy qua registry, resolver, planner, WorkspaceController, MyPlanV2 và IndexedDB. Profile dùng workspace v2; hồ sơ, nhịp học, chuyển v1 và backup/import đã có UI. Giữ sidebar/style và chế độ không đăng nhập.

## Đầu nhánh đã lấy

| Người | PR | Commit nguồn |
|---|---|---|
| Quỳnh Hân | #5 | `9b5517a0cee2b23709729a49f247394e885b442f` |
| Công Định | #1 | `44595b90d54d5e18cd5055d8f8f36ae03fab1f95` |
| Chung Minh Hiếu | #2 | `c0ca5d7b1fce9ab11d841fbd919e64d963fd93c3` |
| Nguyễn Hữu Hiếu | #7 | `fbd3bbf10b68556c3bae124c6ae16b5776b82ae4` |
| Quang Huy | #6 | `5ee00b4d4d3df18321ee22ec584a07a1c35931dc` |

Context #3 nằm trong lịch sử nhánh Hân. Dùng merge commit giữ lịch sử tác giả.

## Quyết định tích hợp

1. MyRoadmap lấy UI mới của Định: lỗi/retry, tạo mới/xác nhận tạo lại. Bổ sung query track từ Path detail và nhóm nhánh toàn danh mục.
2. MyPlanV2 giữ sửa pending/discard mới của Hân và sửa ngày của Chung. `onDiscardPendingPlan(candidate)` đối chiếu candidate trước khi bỏ bản chờ ở controller.
3. Validator lấy sửa mới của Nguyễn Hiếu: draft chưa đủ không khiến workspace bị coi là hỏng; thời lượng bài tùy chỉnh không buộc bằng template.
4. Preview migration sao chép `acceptance`, tránh dùng chung mảng với content template. Có regression sửa preview không sửa nguồn.
5. Profile mới dùng service của Huy qua controller; không viết persistence thứ hai trong component.
6. Gỡ tự ghi v1 khi mount. Key cũ là nguồn migration bất biến; tiếp tục học ở v2 sau xác nhận chuyển.
7. Suite TEAM-04 trước đây giả định URL của cả Backend và bốn pack cá nhân đều duy nhất. Hân thêm bảy ID verified cho URL đã có: giữ cả hai ID để tương thích draft/source snapshot. Test nay đối chiếu chính xác bảy cặp URL, vẫn cấm mọi duplicate ngoài danh sách và mọi duplicate trong pack TEAM-04. Không bỏ kiểm tra dữ liệu trùng để làm CI xanh.

## Callback thêm

- `saveProfile`, `savePreferences`: validate candidate rồi await commit.
- `getLegacyRaw`, `inspectBackup`, `exportBackupFile`: đọc/kiểm tra/xuất, không ghi.
- `prepareMigration`, `prepareImport`: preview, giữ ticket/candidate.
- `confirmTransfer`: cùng port IndexedDB; thành công mới cập nhật workspace/đóng preview.
- `cancelTransfer`: hủy preview, không ghi.

Preview chặn mutation cạnh tranh. Dirty draft phải lưu/bỏ trước import; dữ liệu chưa lưu có thể xuất. Lỗi confirm giữ proposal/ID để retry. Import mặc định thêm ID mới, bỏ qua ID trùng; chọn `copy` khi muốn bản sao.

## Profile/activity

Completion ledger từ mọi plan kể cả archived; bỏ reverted, không đếm lại history snapshot. Completion thiếu ngày giữ tiến độ, không bịa ngày trên heatmap. Đổi timezone áp dụng lần ghi mới, giữ ngày cũ.

## Giới hạn

- Chạy được 50 cấu hình là độ phủ chức năng, không chứng minh mọi nguồn/học phí/chứng nhận đã được người học kiểm chứng. Giữ `reviewStatus: review`.
- Netlify 07/10 là bản cũ tới khi deploy `dist` mới.
- Không cập nhật Notion hoặc thêm tài khoản/CSDL server.
- Kết quả cụ thể: [QA_AI_LOG](../tasks/MW-INTEGRATION/QA_AI_LOG.md).
