# Migration v1 — đọc nguồn, kiểm tra raw và fingerprint

Đợt đầu ngày 09/10/2026. Chưa triển khai toàn bộ migration.

## File

- src/persistence/migration-source.ts: đọc qua callback nhận đúng key majorweave.prototype.v1; kiểm JSON/version/fields; giữ raw, unknown IDs/extra fields; SHA-256 theo bytes UTF-8 của raw.
- scripts/tasks/MW-TEAM-05.mjs: 16 test bằng dữ liệu giả, không chạm localStorage/IndexedDB thật.

Chạy ở thư mục dự án trên feat/mw-team-05-migration:

```powershell
node scripts/tasks/MW-TEAM-05.mjs
npm run check
npm run build
```

Chỉ chép ba file trong gói. Không chép state.ts/contracts/data từ môi trường hỗ trợ. Nếu đã có script task MW-TEAM-05.mjs thì ghép test, không ghi đè test có sẵn.

## API và hành vi

inspectLegacyV1(raw) nhận string hoặc null, trả OperationResult<LegacySource|null>. readLegacyV1(read) nhận hàm đọc và gọi inspectLegacyV1. Không có API ghi/reset/delete storage. Caller giữ raw lỗi để tải xuống/xử lý; không dùng loadState/defaults của v1.

Raw không có key → null. Raw JSON/schema/field lỗi → lỗi, không lọc task và không thay defaults. Một task hỏng từ chối cả nguồn. Phút/tuần nguyên dương/không âm an toàn được giữ, không áp cap 1200/1000 của loadState. PlanMeta khác draft được giữ riêng. PlanMeta thiếu ở bản cũ và done thiếu timestamp có warning; preview bước sau phải giải thích cách xử lý. Timestamp lỗi không tự bị xóa.

Fingerprint là raw SHA-256, giống raw cho cùng fingerprint; chỉ khác khoảng trắng cũng khác fingerprint. Không tuyên bố đây là fingerprint semantic hoặc cơ chế khử trùng plan đã chuyển: confirm còn cần kiểm imports và IDs.

Validator này chỉ kiểm nguồn v1 để đọc có kiểm soát, không thay validator Workspace semantic của MW-TEAM-04. Không chỉnh contracts/Context/UI của nhóm. Các trường UI v1 ngoài hợp đồng v2 vẫn còn trong raw/state, nhưng chưa chốt cách trình bày bảo toàn khi chuyển.

## Verification thực

Codex chạy ở môi trường Node.js v24 ngày 09/10/2026: 16 PASS / 0 FAIL; TypeScript strict --noEmit thành công. Đây là kiểm thử do AI hỗ trợ chạy, chưa phải lần chạy Windows của Huy; SHA/thời điểm/trình duyệt cho lần chạy Huy cần ghi riêng.

## Còn lại

Ánh xạ Backend, unknown/customized work, nguồn/ghi chú/date, suy luận planMeta cũ có xác nhận, preview count/warnings, confirm/cancel, giữ key nguồn, chống caller tampering và source thay đổi, ghi fingerprint cùng plan trong transaction, repeat/reload/conflict/quota, kiểm validator semantic, tích hợp Profile/Context qua Hải. Chưa chuyển app sang v2. Không nhận Done migration từ 16 test này.

## AI log

Dựa trên ZIP dự án người làm gửi, State v1 và kiến trúc mục 7.2. Không import loadState runtime, không mở/xóa DB thật. Tạo raw-reader và test độc lập trong allowlist; chạy test/TypeScript. Gói chỉ thêm ba file, không sửa load/save đã review. Không tự merge main.
