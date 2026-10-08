# Luồng Context v2

| Mã | Hành động | Luồng thành công | Lỗi/hủy và dữ liệu phải giữ |
|---|---|---|---|
| CTX01 | Mở workspace | Provider initialize → load → snapshot ready | Load sai/schema lạ: error, không reset nguồn |
| CTX02 | Chọn/chỉnh nhánh | resolve → get/update draft → dirty | Track thiếu/đang saving/pending: result lỗi; profile/activePlan giữ |
| CTX03 | Tạo plan | validate → generate ID mới → compare revision/write → transaction complete → activePlan mới | Input sai không ghi; save lỗi/conflict giữ candidate, plan đang xem giữ |
| CTX04 | Tạo lại | preview trong RAM → dialog → token/draft/revision check → save → history/current mới | Hủy không ghi; draft đổi token stale; lỗi save giữ current cũ và candidate |
| CTX05 | Lưu lại | pending candidate → transaction → ready | Conflict giữ pending, không force overwrite |
| CTX06 | Tải lại | Nếu sạch → read; nếu dirty cần xác nhận discard=true | Không xác nhận → UNSAVED_CHANGES, giữ bản đang sửa |

Test CTX01–CTX06: scripts/tasks/MW-CONTEXT-V2.mjs và tests/context-v2-browser.html.
