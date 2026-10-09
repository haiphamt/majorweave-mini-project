# MW-TEAM-05 — phạm vi và nghiệm thu

**Người làm:** Triệu Quang Huy (`1can5ez`). **Reviewer cuối:** Phạm Tuấn Hải. **Review chéo:** Lê Nguyễn Hữu Hiếu.

Nhánh load/save: `feat/mw-team-05`, PR #6. Nhánh triển khai tiếp: `feat/mw-team-05-migration`. Ngày cập nhật: 09/10/2026.

**Trạng thái:** module và nội dung đã triển khai, có kết quả QA độc lập. Chờ review, tích hợp và nghiệm thu app chính; chưa Done. Xem [QA log](QA_AI_LOG.md) để biết phần thực sự đã kiểm tra, [README](README.md) để chạy test.

## Phạm vi và quyền sửa

- `src/persistence/**`: load/save IndexedDB, migration v1, backup/import.
- `src/content/paths/devops.ts`, `network.ts`, `security.ts`, `qa.ts`: bốn pack / mười track.
- `scripts/tasks/MW-TEAM-05.mjs`: test module/nội dung, giữ assertions.
- `docs/tasks/MW-TEAM-05/**`: tài liệu, trang QA và minh chứng.

Hải giữ app/Context/components/CSS/contracts/registry, file nguồn v1, package/config/check/CI và tài liệu sinh tự động. Không thêm đăng nhập; giữ sidebar/style chung; không reset/xóa dữ liệu cũ. Không tự merge/push main.

Baseline: [phân công](../../team/PHAN_CONG_MINI_PROJECT.md), [kiến trúc](../../KIEN_TRUC_MAJORWEAVE.md), [chuẩn nội dung](../../architecture/HUONG_DAN_DU_LIEU.md), [quy trình nhóm](../../team/QUY_TRINH_ANTIGRAVITY.md).

## Nội dung được giao

| Hướng / pathId | Track ID v2 cần bàn giao | Nhánh | Số |
|---|---|---|---:|
| DevOps / SRE · `devops` | `devops.devops`, `devops.sre` | DevOps / AWS; SRE | 2 |
| Network Engineer · `network` | `network.network`, `network.automation` | Mạng và mô phỏng; Network Automation / Python | 2 |
| Cyber Security · `security` | `security.soc`, `security.appsec`, `security.devsecops` | Defensive Security / SOC; Web Application Security; DevSecOps | 3 |
| QA / Test Automation · `qa` | `qa.manual`, `qa.playwright`, `qa.postman` | Manual QA; Web Automation / Playwright; API Testing / Postman | 3 |
| **Tổng của task** | | | **10** |

Mỗi track cần đủ nền tảng/tiên quyết, nguồn chính thức đã kiểm tra, work có phút/acceptance và portfolio. Credential phù hợp có phí/điều kiện rõ; không phù hợp thì ghi lý do, không dựng mục giả. Bốn pack giữ `review` tới khi Hải nghiệm thu. Chi tiết ở [CONTENT_HANDOFF](technical/CONTENT_HANDOFF.md) và [inventory nguồn](technical/CONTENT_SOURCE_INVENTORY.md).

## Acceptance

| AC | Điều kiện/kết quả cần kiểm tra | Luồng cần mô tả | Test cần viết |
|---|---|---|---|
| AC-01 | Load rỗng trả workspace rỗng hợp lệ; dữ liệu hỏng/schema lạ trả lỗi và bảo toàn nguồn; không tự ghi defaults. | Mở/lưu workspace | Không dữ liệu, JSON/schema lỗi, DB blocked, reload |
| AC-02 | Save đọc/so revision + ghi trong một transaction, chỉ success sau complete; quota/abort trả storage và bản UI chưa lưu còn nguyên. | Lưu / thử lại / lỗi | Completion/abort/quota, không báo success trước complete |
| AC-03 | Hai tab cùng revision không ghi đè âm thầm: một save thành công, bản stale trả conflict; người dùng tải mới hoặc xuất bản đang sửa. | Xử lý conflict | Hai tab thật trên profile thử, compare trước/sau |
| AC-04 | Migration giữ key v1 và dữ liệu task/source/notes/done/date; unknown work không mất; bấm lại/reload không nhân bản. | Preview / xác nhận / hủy chuyển v1 | Fixture v1, customized, thiếu timestamp, fingerprint trùng, lỗi ghi |
| AC-05 | Import valid/invalid/version mới/duplicate/copy tuân preview/confirm/cancel, remap quan hệ đúng; không reset profile/plan. | Xuất / nhập / copy / hủy | Round trip, file hỏng, version mới, ID trùng, copy, quota/conflict |
| AC-06 | Mười track hạ tầng/QA có prerequisite, nguồn/credentials/portfolio phù hợp; SRE/automation/DevSecOps không bỏ nền tảng. | Chọn hạ tầng/QA và tạo kế hoạch | Hai DevOps, hai Network, ba Security, ba QA |

User story chi tiết và các luồng tương ứng: [FLOW.md](FLOW.md), FL-01 đến FL-07. Test case, expected/actual, môi trường, SHA và AI log: [QA_AI_LOG.md](QA_AI_LOG.md).

## Phụ thuộc và đầu ra bàn giao

| Phần | Đầu ra hiện có | Phối hợp / nghiệm thu còn lại |
| --- | --- | --- |
| Load/save | Adapter, revision CAS, success sau complete, native QA và hai tab | Hải ghép state/save indicator; dùng validator hiện hành |
| Migration | Source/schema/fingerprint, preview, confirm/cancel, retry, chống nhập trùng; giữ key v1 | Hữu Hiếu semantic; Hải nối warnings/choices/callback UI; kiểm failure paths chưa bao phủ |
| Backup/import | Export snapshot chưa lưu, validate, skip/copy/remap, confirm/cancel và retry | Semantic/UI, native failure paths và hai tab cho luồng import |
| Nội dung | 4 pack/10 track, nguồn/work/portfolio/credential; resolver/planner và native QA isolated | Hải đăng ký các pack cùng nền tảng; review nội dung và toàn hành trình |

Dùng WorkspacePersistence/Workspace/BackupFile từ contracts chung; legacy maps Backend giữ ID ổn định. Không chép validator hoặc tạo registry app thứ hai. Registry riêng trong harness chỉ phục vụ test isolated.

## Điều kiện Done

- [ ] Reviewer xác nhận module và đủ mười track đúng scope, không placeholder.
- [ ] Tài liệu/flow/test/AI log có bằng chứng và SHA cuối; feedback đã xử lý.
- [ ] Check/build và kiểm tra UI liên quan đạt trên mã đang review.
- [ ] Validator/ID/contracts được phối hợp, diff đúng allowlist, style cũ được giữ.
- [ ] Hải đã tích hợp; mười track đi đủ chọn → đổi nguồn → tạo plan → hoàn thành bằng callback thật → reload.
- [ ] Migration/import giữ dữ liệu cũ; kiểm lỗi/hủy/pending, bàn phím và viewport theo yêu cầu nghiệm thu.
- [ ] Review chéo và Hải nghiệm thu cuối.

Các checkbox là cổng nghiệm thu, không tự tick theo số test isolated. Quyết định gộp hai nhánh/PR do Hải chốt. Không cập nhật Notion hoặc nhận kiểm thử thay toàn nhóm.
