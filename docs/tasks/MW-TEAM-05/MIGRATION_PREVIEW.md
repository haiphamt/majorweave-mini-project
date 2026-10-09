# Migration v1 — ánh xạ và advisory preview

## Phạm vi đợt này

Thêm src/persistence/migration-preview.ts. Dùng backendPack/legacyStageMap/legacyWorkMap hiện có, không đổi ID nội dung hoặc tạo registry khác. Nhận raw JSON, gọi inspector rồi lập plan/draft/summary/warnings/unresolved. Không mở/ghi/xóa kho dữ liệu, không đánh dấu imports, chưa có confirm controller.

previewLegacyV1(raw, {now,timeZone,nextId,missingPlanMeta?}) trả OperationResult<MigrationPreview|null>. nextId là UUID factory được tiêm để kiểm thử. Đây là preview advisory, không phải save candidate được UI quyền sửa rồi đem ghi; confirm bước sau phải giữ snapshot riêng và bỏ qua caller tampering.

## Quy tắc

- Plan dùng planMeta cũ, draft dùng stack/goal/hours/startDate hiện hành; không lẫn hướng đang khám phá với plan đã tạo.
- Khớp work ID, module, title và minutes: giữ provenance/revision/segment [0,minutes], không chia lại hoặc xếp lại tuần.
- Đã sửa/unknown work: giữ title/phút/tuần/notes/status; customized=true, segment=null. Bài chưa khớp có workId null; stage thiếu dùng ID legacy.custom-stage-N và warning, không gán sang bài gần giống. Chưa cho tạo lại với synthetic stage trong catalog thật.
- Nguồn có snapshot an toàn: giữ ID/title/provider/URL. Nguồn thiếu: source=null, thêm ID nguồn v1 vào ghi chú, raw còn nguyên và có warning cần chọn lại.
- Done thiếu timestamp: completion có completedAt/localDate/timeZone null; không tạo ngày giả từ lịch. Có timestamp: giữ instant gốc, ngày tính theo timezone người dùng chọn trong preview vì v1 không lưu timezone riêng; hiển thị warning.
- PlanMeta thiếu: blocking issue, chưa dựng plan; cần chọn rõ stack/goal/hours/startDate trong missingPlanMeta. Không âm thầm lấy draft làm plan metadata.
- Ngày v1 không Thứ Hai giữ nguyên và blocking issue; chưa tự chuẩn hóa lịch.
- Draft thiếu prerequisite có blocking issue, không tự thêm chặng hoặc đánh dấu đã biết.
- Selection/source/credential chưa ánh xạ có inventory unresolved và raw đầy đủ. Không được bỏ chúng rồi coi migration hoàn tất. Cách xử lý phải được chốt ở bước confirm.
- Raw/extra fields/history ngoài mô hình v1 chuẩn vẫn trong raw; chưa tuyên bố đã biểu diễn hết các trường đó trong Workspace v2.

## Cách áp dụng

Gói gồm ba file: thêm migration-preview.ts và MIGRATION_PREVIEW.md; thay scripts/tasks/MW-TEAM-05.mjs bằng bản mở rộng (giữ đủ 16 test source cũ, thêm 14 test preview). Không chép validator hoặc backend.ts từ nhánh người khác.

```powershell
node scripts/tasks/MW-TEAM-05.mjs
npm run check
npm run build
```

Kỳ vọng script 30 PASS / 0 FAIL. Chỉ ghi PASS sau khi thực tế chạy. Chưa có UI preview cần mở ở bước này.

## Kết quả thực / AI log

- Đợt source: Huy đã chạy 16/16 test, check 3 packs/30 modules + 16 Context checks và build 1621 modules ngày 09/10/2026. Kiểm tra trước commit trên source sau đó được commit thành 6cf1733028edb40ba8192ba1c2efff113cc40143; không nhận đã chạy lại sau commit.
- Đợt preview: Codex chạy Node script 30/30 và TypeScript strict thành công ngày 09/10/2026. Chưa có kết quả Windows/SHA của Huy cho phần preview.
- Compatibility kiểm riêng tại môi trường hỗ trợ: đưa bốn preview fixtures (matched, modified minutes, unknown work, missing source) vào Workspace và gọi validateWorkspace từ ZIP MW-TEAM-04, contentPacks=[backendPack]: 4/4 PASS. Validator không chép vào gói bàn giao; test này không thay nghiệm thu semantic toàn bộ dữ liệu migration.
- Lỗi compatibility đã báo trước: mutation updateTask của MW-TEAM-03 giữ segment cũ khi đổi phút, trong khi validator MW-TEAM-04 bắt đoạn khớp phút. Preview ở đây dùng segment=null cho việc đã sửa, không tự sửa file của người khác.

## Còn lại / nghiệm thu

Bảo toàn metadata/raw ngoài v2, xử lý unresolved/nháp invalid và ngày không Monday, session preview/confirm/cancel chống tampering, reread raw trước confirm, kiểm fingerprint đã nhập, source change khi save pending, UUID collision với workspace hiện có, giữ profile/plan hiện có, ghi imports cùng plan chỉ sau transaction.complete, lỗi/conflict/retry, browser tests trên DB QA, bàn giao callback qua Hải/Hiếu. Chưa nối app vào v2; chưa Done migration và chưa nghiệm thu backup/import/content.
