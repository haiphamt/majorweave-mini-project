# Luồng chi tiết — MW-TEAM-02

## FL-MW-TEAM-02-01 — Chọn/bỏ chặng và xử lý thiếu prerequisite

- Story / acceptance: US-MW-TEAM-02-01 / AC-01
- Actor, trang và sự kiện bắt đầu: Sinh viên, trang My Roadmap, click checkbox chặng học.
- Điều kiện trước (data/branch/plan/quyền/trạng thái): Đã chọn một nhánh (track) và có dữ liệu draft hiện hành.
- Dữ liệu đầu vào và kiểm tra: Trạng thái chọn/bỏ chọn (`selectedStageIds`). Kiểm tra tập `available` (đã biết + đã chọn) có chứa đủ các tiên quyết (`prerequisiteIds`) của chặng đó không.
- Kết quả sau thành công: Chặng được thêm/xóa khỏi `selectedStageIds` của draft. UI hiển thị trạng thái mới.
- Dữ liệu phải giữ khi hủy/lỗi: Giữ nguyên draft cũ.

| Bước | Sinh viên | UI | Domain / persistence | Dữ liệu sau bước |
|---|---|---|---|---|
| S1 | Click chọn chặng B | Gửi yêu cầu cập nhật draft | Domain kiểm tra tiên quyết (vd: A) | Giữ draft chờ kiểm tra |
| S2 | | | Xác nhận đã chọn A hoặc đã biết A | |
| S3 | | Cập nhật UI hiển thị B đã chọn | Cập nhật draft `selectedStageIds` | Draft mới có B |

### Nhánh thay thế, lỗi và hủy

| Mã | Xuất phát từ bước | Điều kiện | Thông báo / xử lý | Trạng thái dữ liệu | Test |
|---|---|---|---|---|---|
| E1 | S1 | Thiếu chặng tiên quyết A | Thông báo: "Chặng B yêu cầu tiên quyết A. Vui lòng chọn hoặc đánh dấu đã biết A trước." | Giữ draft cũ (không có B) | TC-01 |

## FL-MW-TEAM-02-02 — Đánh dấu đã biết / bỏ đã biết và đổi nguồn

- Story / acceptance: US-MW-TEAM-02-01 / AC-01
- Actor, trang và sự kiện bắt đầu: Sinh viên, trang My Roadmap, click nút "Đã biết" hoặc dropdown đổi nguồn.
- Điều kiện trước: Có draft hiện hành.
- Dữ liệu đầu vào và kiểm tra: `knownStageIds` và `resourceByStage`. Nguồn phải hợp lệ với chặng. Đánh dấu đã biết thì không được lập kế hoạch học phần đó nữa.
- Kết quả sau thành công: Cập nhật `knownStageIds` hoặc `resourceByStage` trong draft.
- Dữ liệu phải giữ khi hủy/lỗi: Draft cũ.

| Bước | Sinh viên | UI | Domain / persistence | Dữ liệu sau bước |
|---|---|---|---|---|
| S1 | Click đổi nguồn chặng A | Dropdown hiện danh sách resource hợp lệ | | |
| S2 | Chọn nguồn R2 | Cập nhật nguồn trên giao diện | Ghi R2 vào `resourceByStage` của chặng A trong draft | Draft đổi nguồn |

## FL-MW-TEAM-02-03 — Nhập mục tiêu, giờ/tuần và ngày khác Thứ Hai

- Story / acceptance: US-MW-TEAM-02-01 / AC-01
- Actor, trang và sự kiện bắt đầu: Sinh viên, form cấu hình kế hoạch.
- Điều kiện trước: Các chặng và nguồn đã được chọn.
- Dữ liệu đầu vào và kiểm tra: `goal` (không rỗng), `hoursPerWeek` (2-20), `startDate` (Thứ Hai).
- Kết quả sau thành công: Draft được cập nhật với cấu hình hợp lệ.
- Dữ liệu phải giữ khi hủy/lỗi: Dữ liệu đang nhập trong form.

| Bước | Sinh viên | UI | Domain / persistence | Dữ liệu sau bước |
|---|---|---|---|---|
| S1 | Đổi ngày bắt đầu thành Thứ Ba | Validate ngay lập tức | Domain `isMonday` trả false | Dữ liệu form tạm |
| S2 | | UI báo lỗi "Ngày bắt đầu phải là Thứ Hai", có thể gán nút quy đổi tự động | | |

## FL-MW-TEAM-02-04 — Tạo plan mới; đầu vào lỗi/không còn việc/lưu lỗi

- Story / acceptance: US-MW-TEAM-02-01 / AC-01, AC-02, AC-03
- Actor, trang và sự kiện bắt đầu: Sinh viên, click "Tạo kế hoạch".
- Điều kiện trước: Không có active plan hoặc sinh viên tạo riêng (kết hợp với luồng chọn nhánh).
- Dữ liệu đầu vào và kiểm tra: Toàn bộ draft.
- Kết quả sau thành công: Kế hoạch mới được sinh ra, validate hợp lệ, chia chunk thành công, lưu storage.
- Dữ liệu phải giữ khi hủy/lỗi: Giữ draft và thông báo lỗi.

| Bước | Sinh viên | UI | Domain / persistence | Dữ liệu sau bước |
|---|---|---|---|---|
| S1 | Nhấn "Tạo kế hoạch" | Hiện loading | Gọi `generatePlan(draft)` | Plan rỗng trong RAM |
| S2 | | | Validate trả về `ok: true`, sinh task và schedule | Plan hoàn chỉnh trong RAM |
| S3 | | | Gọi `saveWorkspace` ghi vào IndexedDB | Plan lưu trong DB |
| S4 | | Điều hướng sang My Plan | | |

### Nhánh thay thế, lỗi và hủy

| Mã | Xuất phát từ bước | Điều kiện | Thông báo / xử lý | Trạng thái dữ liệu | Test |
|---|---|---|---|---|---|
| E1 | S1 | Domain validate lỗi (vd `NOTHING_TO_PLAN`) | UI hiển thị lỗi: "Không có chặng nào để lập lịch" | Giữ draft cũ | TC-02 |
| E2 | S3 | Storage lưu lỗi | Thông báo "Không thể lưu dữ liệu" | Giữ draft, không có plan mới | TC-03 |

## FL-MW-TEAM-02-05 — Xem preview tạo lại, xác nhận hoặc hủy

- Story / acceptance: US-MW-TEAM-02-01 / AC-03, AC-04
- Actor, trang và sự kiện bắt đầu: Sinh viên, có active plan, mở My Roadmap, sửa cấu hình và nhấn "Tạo lại kế hoạch".
- Điều kiện trước: Kế hoạch hiện tại đang tồn tại, draft có sửa đổi.
- Dữ liệu đầu vào và kiểm tra: Draft mới so với plan cũ (history).
- Kết quả sau thành công: Hiển thị giao diện preview (những gì sẽ đổi, mất mát). Sinh viên xác nhận -> lưu plan.
- Dữ liệu phải giữ khi hủy/lỗi: Hủy thì draft và plan cũ giữ nguyên.

| Bước | Sinh viên | UI | Domain / persistence | Dữ liệu sau bước |
|---|---|---|---|---|
| S1 | Nhấn "Tạo lại kế hoạch" | Gọi hàm `regeneratePlan` | Xử lý logic tạo bản preview (RAM) | Preview plan |
| S2 | | Hiện hộp thoại Preview so sánh | | |
| S3 | Nhấn "Xác nhận" | | Lưu preview thành generation mới | DB cập nhật |

## FL-MW-TEAM-02-06 — Giữ việc tự thêm/sửa và lịch sử khi tạo lại

- Story / acceptance: US-MW-TEAM-02-01 / AC-04
- Khía cạnh logic của luồng FL-05: Khi domain xử lý `regeneratePlan`, nó phải quét history và list task cũ. Task nào `customized: true` hoặc `workId = null` thì đẩy vào backlog (`weekIndex: null`). Task cũ đã done (`completionId` != null) mà vẫn tồn tại trong khung bài học mới thì giữ nguyên completion và notes.
