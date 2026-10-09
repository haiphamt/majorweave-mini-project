# Phản hồi review 09/10/2026 — MW-TEAM-04

Đầu vào: `GUI_NGUYEN_HUU_HIEU.md` do người dùng gửi; đối chiếu PR #7 và code local tại `acb065de0561a5f654d1c7527b9dbd6380138573`. Thay đổi dưới đây ở working tree, chưa commit/push. Các kết quả 28 nhóm test trước đây không bao phủ hai lỗi review; nhận định trước đó rằng phần độc lập đã đủ cần được hiểu lại theo hai lỗi này.

## 1. Segment và thời lượng customized

**Story bổ sung:** Người học chỉnh thời lượng của việc sinh từ bài nguồn và lưu được, vẫn giữ đoạn bài nguồn cùng ghi nhận hoàn thành cũ.

**Quy tắc áp dụng theo phản hồi:** `segment` là provenance; `minutes` là thời lượng hiện tại. Khi `customized=true`, không bắt độ dài segment bằng minutes. Vẫn yêu cầu số nguyên an toàn, from >= 0, to > from, workId/workRevision hợp lệ; minutes nguyên dương. Task chưa customized vẫn phải khớp độ dài. Validator không sửa segment, ledger hoặc history. Không so segment lịch sử với bài trong catalog mới vì revision có thể đã đổi.

**TC-R01:** Fixture mô phỏng đầu ra chia bài 200 phút thành 120 + 80; completion đoạn đầu ghi 120; chỉnh task đầu thành 45/customized. Validate, JSON round trip, validate backup đều giữ segment và completion 120. Thử completion legacy không timestamp và history/ClosedWeek; chúng giữ nguyên. Biên rỗng/đảo/âm/lẻ, segment không workId và task chưa customized lệch phút vẫn bị từ chối.

Đã tái hiện lỗi trước sửa trong `evidence/review-2026-10-09-before.log`. Fixture không phải planner/migration thật; JSON round trip không phải lưu IndexedDB hay browser reload.

## 2. Lưu draft khác với điều kiện tạo plan

**Story bổ sung:** Người học giữ draft đang chọn dở mà vẫn lưu được hồ sơ và plan khác; chỉ bị báo thiếu tiên quyết khi chuẩn bị tạo plan từ draft đó.

**Quy tắc triển khai local theo đề xuất của Hải:** `validateWorkspace`/`validateBackupFile` kiểm cấu trúc draft, không dùng catalog readiness để chặn lưu cả workspace. Nguồn/stage không còn trong catalog cũng được giữ để người dùng sửa tiếp. Schema/types/ID/ranges/date/key draft vẫn bắt buộc; quan hệ plan/task/ledger/snapshot vẫn kiểm tra như trước.

Kiểm tra membership nguồn/chặng, tiên quyết và vòng phụ thuộc được chuyển sang:

```ts
validateDraftForGeneration(
  value: unknown,
  contentPacks: readonly ContentPack[],
): OperationResult<RoadmapDraft>
```

Đây là kiểm tra trước về cấu trúc/catalog cho resolver/planner; không thay planner kiểm lịch/quỹ giờ/điều kiện tạo plan khác. Track không còn phải trả lỗi ở bước này. Giữ option `contentPacks` ở hai validator cũ để không phá caller, nhưng option đó không còn làm draft chưa sẵn sàng bị từ chối khi lưu. Không đổi contracts/context và chưa nối helper vào UI. Hải/Định cần xác nhận vị trí gọi helper hoặc dùng kiểm tra tương đương của planner hiện có trước khi bật persistence. Không ghi đã có sự đồng thuận liên nhóm khi chưa nhận phản hồi.

**TC-R02:** Draft chỉ chọn data.sql, thiếu data.quality; workspace có profile vừa đổi và plan hợp lệ. Validate workspace/backup + JSON round trip thành công, profile/plan/draft giữ nguyên. Kiểm tra trước tạo plan vẫn lỗi `missing_prerequisite`; đánh dấu quality đã biết thì qua. Draft sai kiểu hours vẫn lỗi. Track mất và catalog có chu trình vẫn chặn ở helper. TC-V12 giữ test nguồn sai nhưng chuyển assertion sang đúng bước trước tạo plan; thêm assertion lưu workspace vẫn thành công.

Đã tái hiện lỗi trước sửa trong `evidence/review-2026-10-09-draft-before.log`.

## 3. Kiểm tra và ranh giới

- 30 nhóm test module/content pass sau sửa; check/build pass. Log cuối mang tiền tố `review-2026-10-09-` trong evidence. Manifest `review-2026-10-09-source-hashes.json` định danh code/test sửa.
- Không sửa lại tám pack, CSS/sidebar, Profile UI, contracts, context, registry, package hay module người khác.
- Không chạy lại bộ UI v1 vì lượt này chỉ sửa validation Workspace/catalog và tests; không dùng 14 check UI cũ để tuyên bố UI v2 pass.
- Local branch chưa có planner/progress/persistence Workspace v2. E2E generate → sửa duration → save → reload bằng module/app thật và tám hành trình nguồn → tạo → complete → reload **chưa chạy**. Cần chạy trên bản Hải tích hợp; không đánh Done.
- GitHub đọc ngày 09/10 xác nhận PR #7 đã tồn tại, HEAD vẫn acb065d, base dd67b6735d59fe56b32384a674bbe03b76501962; body còn template. Đây là thông tin mới so với phiên trước khi push bị từ chối.
- Theo yêu cầu trực tiếp tạm dừng Git: không commit/push hoặc sửa PR/request review trong lượt này. Chuẩn bị [mô tả PR](PR_DESCRIPTION.md) local; đề nghị reviewer `haiphamt` khi người dùng cho tiếp tục bàn giao. Không merge main.
