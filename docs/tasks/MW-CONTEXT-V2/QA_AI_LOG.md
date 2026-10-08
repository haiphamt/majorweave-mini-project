# Kiểm thử và AI log — MW-CONTEXT-V2

**Ngày:** 07/10/2026. **Nhánh:** feat/mw-context-v2. **Người chuẩn bị:** Codex theo yêu cầu Hải. SHA kiểm thử code: `bc13f06d4c73f9c3b537e6c3f7ff8c75c50f8eee`. [PR bàn giao #3](https://github.com/haiphamt/majorweave-mini-project/pull/3).

## Kết quả đã chạy

- TypeScript strict: Pass sau khi sửa narrowing guard generation.
- Check nội dung 3 pack và ranh giới: Pass.
- Controller: 16 kiểm tra Pass; init không ghi defaults, chặn hai reload đồng thời, 10 track/nhiều plan, draft độc lập, validation, preview/cancel/stale/tampering, save lỗi/retry, double submit, conflict/reload, snapshot freeze, resolver lỗi, guard persistence.
- Build production: Pass. Planner và nội dung MW-TEAM-02: 69 Pass, 0 Fail.
- Native Chrome: 7 kiểm tra IndexedDB Pass (DB QA UUID riêng), gồm load/save/reload, hai writer tranh revision, lỗi conflict giữ candidate, preview/hủy không ghi, confirm giữ history.
- React StrictMode provider/hook: callback tạo/lưu mobile.flutter Pass; hiển thị ready, 3 plans sau thao tác.
- Bằng chứng: evidence/native-storage.png. Không đọc/ghi/xóa key legacy trong test.
- Smoke trang ứng dụng `/#/roadmap`: sidebar và màn My Roadmap v1 hiển thị bình thường sau khi thêm provider. Bằng chứng: evidence/app-preserved.png; không thao tác sửa kế hoạch trên màn này.

## AI log và lỗi triển khai

1. Đọc contracts, kiến trúc, allowlist và code v1; chọn provider v2 song song để chưa chuyển dữ liệu cũ khi migration chưa có.
2. Dùng planner của Định đã review; không chép thuật toán thứ hai. Callback trả OperationResult và không kích hoạt plan trước commit.
3. TypeScript phát hiện guard draft làm hẹp object generation sai; tách fields trước kiểm tra, compile lại Pass.
4. Kiểm tra logic và browser xác nhận preview/cancel không ghi, save failure giữ pending, transaction revision chống stale overwrite, React dùng cùng controller.

## Giới hạn

Chưa kiểm tra migration/import, full validator semantic, quota thật hoặc DB version upgrade blocked trong giao diện; các phần đó thuộc task Huy/Hữu Hiếu. Chưa kiểm thử UI My Roadmap của Định vì chưa có UI v2. Cùng nhánh khi regenerate; đổi nhánh dùng tạo plan mới. Topbar và các feature cũ vẫn v1.
