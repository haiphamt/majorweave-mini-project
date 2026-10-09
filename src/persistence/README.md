# Persistence

API và kiểu dữ liệu dùng `src/domain/contracts.ts`. Chỉ lớp persistence đọc/ghi storage; feature dùng callback/Context chung.

| Module | Vai trò |
| --- | --- |
| `legacy.ts` | Ghi v1 đang được UI cũ sử dụng; đọc v1 còn ở `src/state.ts` |
| `roadmap-store.ts` | IndexedDB native: `majorweave`, version 1, store `workspace`, key `local`; revision CAS trong một transaction |
| `migration-source.ts` | Đọc/kiểm raw v1 và fingerprint; không ghi/xóa nguồn |
| `migration-preview.ts` | Ánh xạ Backend, giữ dữ liệu, cảnh báo và vấn đề chặn |
| `migration.ts` | Preview riêng, confirm/cancel, fingerprint, retry và conflict |
| `backup.ts` | Export snapshot, validate file, preview/import, skip/copy/remap |

Chỉ báo lưu thành công sau transaction complete. Lỗi/conflict giữ proposal để retry hoặc xuất; không reset defaults, không xóa kho cũ. Validators semantic và UI/registry được Hải/Hữu Hiếu tích hợp; các trang QA độc lập không chứng minh app chính đã chuyển sang v2.

Đọc [hub MW-TEAM-05](../../docs/tasks/MW-TEAM-05/README.md) để chạy test, xem kết quả thực và phần cần nghiệm thu.
