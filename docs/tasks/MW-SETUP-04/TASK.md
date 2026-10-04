# MW-SETUP-04 — Bộ khung và luật dùng chung

**Người thực hiện:** trợ lý theo yêu cầu nhóm trưởng. **Reviewer:** Hải. **Trạng thái:** Đang review.

## User story và tiêu chí

**US-MW-SETUP-04-01:** Là thành viên triển khai bằng Antigravity, tôi muốn có module, hợp đồng và quy trình chung để làm phần mình và tích hợp có kiểm tra.

| Mã | Acceptance | Luồng / test |
|---|---|---|
| AC-01 | App vẫn hiển thị năm trang sidebar cũ sau khi tách module | FL-MW-SETUP-04-01 / TC-01 |
| AC-02 | Contracts/content v2 có một nguồn chuẩn, không hai bản độc lập; Backend giữ ba nhánh và thư viện | TC-02 |
| AC-03 | Có luật Antigravity, allowlist theo task, mẫu story/flow/test/AI log và PR; chưa tự phân công năm bạn | TC-03 |
| AC-04 | Kiểm tra/build chạy, lỗi không bị che và ghi rõ v2 chưa tích hợp | TC-04–05 |
| AC-05 | Ghi dữ liệu v1 giữ key và trả lỗi khi storage không ghi được | TC-06 |

## Phạm vi được yêu cầu

Tách `src/main.tsx`, các thành phần Profile/StackChooser/StudyActivity; dựng `app`, `components`, `features`, hợp đồng/content và persistence v1; thêm quy tắc, templates và CI. Nhóm trưởng đã cho tiếp tục sau kiến trúc, cho commit GitHub, yêu cầu giữ UI cũ và không cập nhật Notion.

Contracts không đổi field trong bước này; chuyển vị trí và giữ đường dẫn cũ bằng re-export. Nội dung học không bị thay bằng fixtures. Chưa triển khai workspace/planner/IndexedDB v2, OAuth, mọi hướng ngoài Backend hoặc gói phân công.

## Bàn giao

- [Tài liệu bước 4](../../BUOC_4_BO_KHUNG_VA_QUY_TAC.md).
- [Luật chung](../../../AGENTS.md) và [quy trình Antigravity](../../team/QUY_TRINH_ANTIGRAVITY.md).
- [Luồng](FLOW.md), [kiểm thử/AI log](QA_AI_LOG.md).
- Phiên bản bàn giao: commit chứa task này; tra `git log -1 -- docs/tasks/MW-SETUP-04/TASK.md`.
- Còn lại: nhóm trưởng kiểm tra, sau đó lập gói phân công năm người bao phủ danh mục được duyệt.
