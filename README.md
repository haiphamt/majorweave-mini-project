# MajorWeave

Mini Project môn **Phát triển ứng dụng web — IS207.R11**, nhóm **PHP Is Awesome**. Khám phá hướng học, chọn nguồn phù hợp và biến roadmap thành kế hoạch tự học theo tuần.

## Bản tích hợp v2 — 09/10/2026

- Giữ giao diện sidebar, màu sắc và style đã chọn.
- **6 khoa, 12 ngành, 18 hướng, 50 cấu hình kế hoạch**, nối vào cùng bộ tạo lịch và kho dữ liệu.
- Nguồn học, roadmap tham khảo, mục tiêu portfolio và chứng nhận theo nhánh. BA dùng nguồn nghề ngoài roadmap.sh.
- Nhiều kế hoạch độc lập; draft không tự sửa plan đang học. Tạo lại có preview, xác nhận và lịch sử.
- My Plan có Plan / Stats / Weeks, thêm/sửa việc, hoàn thành/undo, backlog và chốt tuần.
- Profile lưu tên/ngành/múi giờ; nhịp học tổng hợp completion của mọi plan. Đổi múi giờ giữ ngày hoàn thành cũ.
- **IndexedDB** lưu workspace trên thiết bị. Xuất/nhập JSON có preview, bỏ qua ID trùng hoặc nhập bản sao; chuyển v1 có xác nhận và chống nhập trùng.
- Không cần đăng nhập; chưa có Google login, server tài khoản hoặc đồng bộ giữa thiết bị.

Số phút là ước lượng bài thực hành; tiến độ do người học tự ghi nhận. App không cấp/xác minh chứng chỉ hoặc đọc tiến độ khóa học bên ngoài. Các content pack vẫn mang trạng thái `review`: kiểm tra code không chứng minh mọi học phí, điều kiện thi hay chất lượng khóa học đã được xác minh.

## Chạy trên máy

Yêu cầu Node.js **22.12+** và npm. Không cần API key hay CSDL ngoài.

```powershell
npm ci
npm run check
npm run check:team
npm run build
npm run dev
```

Mở `http://127.0.0.1:5173/#/explore`. Nếu cổng đã được dùng: `npm run dev -- --port 5195`. Xem bản build bằng `npm run preview`. Deploy static thư mục `dist`; ứng dụng dùng hash route. Đổi domain/cổng tạo kho khác theo origin: xuất backup trước khi chuyển nơi chạy.

**Demo Netlify cũ:** [bản triển khai 07/10](https://cheery-dusk-9602b2.netlify.app/) ở commit `685435047a58f05d1bb3a90ae901425bdcb31074`. Link này chưa cập nhật bản v2 trong đợt tích hợp này.

## Thử một hành trình

1. **Explore:** chọn ngành, khám phá hướng; ngành không khóa các lựa chọn.
2. **Path detail:** chọn nhánh, mở roadmap tham khảo, xem chặng/nguồn/chứng nhận. Lưu chứng nhận là lưu mục tiêu bổ trợ.
3. **My roadmap:** chọn chặng/đã biết/nguồn, mục tiêu, giờ/tuần và ngày bắt đầu. Lưu draft hoặc tạo plan mới.
4. **My Plan:** chọn plan, hoàn thành/sửa việc, ghi chú/ngày hoặc backlog. Reload kiểm tra dữ liệu còn. Chốt tuần có xác nhận xử lý việc chưa xong.
5. **Profile:** sửa hồ sơ, xem nhịp học, xuất backup; nhập file/chuyển v1 luôn có preview trước xác nhận ghi.

Đã dùng bản cũ thì vào Profile để chuyển v1. Key `majorweave.prototype.v1` giữ nguyên. Link mở plan v1 chỉ đọc, không tự tạo lại lịch cũ.

## Kiến trúc

```text
main → AppShell → WorkspaceProvider / shared controller
                    ├─ features: Explore, Path detail, My roadmap, My Plan, Profile
                    ├─ content registry: 18 pack / 50 track
                    ├─ domain: resolver, planner, progress, activity, validation
                    └─ persistence: IndexedDB, migration, backup/import
```

UI dùng callback, không tự ghi storage. Domain độc lập React/storage. Dữ liệu đọc/nhập được kiểm tra runtime; transaction hoàn tất mới báo lưu thành công. Lỗi lưu/xung đột giữ bản sửa để retry, xuất hoặc bỏ có xác nhận.

## Tài liệu

- [Trạng thái tích hợp và xử lý conflict](docs/team/INTEGRATION_V2.md).
- [Hướng dẫn kiểm thử, minh chứng và AI Log](docs/team/HUONG_DAN_KIEM_THU_VA_AI_LOG.md).
- [Báo cáo kiểm thử thực tế](docs/tasks/MW-INTEGRATION/QA_AI_LOG.md).
- [Context/callback v2](docs/team/HANDOFF_CONTEXT_V2.md).
- [Hợp đồng dữ liệu](src/domain/contracts.ts), [biên soạn nội dung](docs/architecture/HUONG_DAN_DU_LIEU.md).
- [Danh mục ngành/hướng](docs/Danh_muc_nganh_huong_hoc.md), [phạm vi](docs/PHAM_VI_MAJORWEAVE.md).
- [Quy tắc AI/PR](AGENTS.md), [quy trình Antigravity](docs/team/QUY_TRINH_ANTIGRAVITY.md).

Tài liệu bước 3/4 và `src/prototype/` là lịch sử; INTEGRATION_V2 là trạng thái hiện tại. `events.html` giữ luồng nền trước đây và bổ sung luồng v2, không phải báo cáo chạy test.

## Đóng góp

| Thành viên | Phần được tích hợp |
|---|---|
| Phạm Tuấn Hải | Kiến trúc/style, Context/callback, registry, Profile/transfer UI, sửa lỗi tích hợp, nghiệm thu/README |
| Nguyễn Thị Quỳnh Hân — MW-TEAM-01 | Explore/Path detail/resolver; Backend/Frontend/Full-stack/UX; sửa discard pending UI chung |
| Phạm Công Định — MW-TEAM-02 | Planner/tạo lại, My roadmap; Mobile/Game |
| Chung Minh Hiếu — MW-TEAM-03 | My Plan/progress/chốt tuần; DS/ML/MLOps/AI Engineer |
| Lê Nguyễn Hữu Hiếu — MW-TEAM-04 | Profile/activity/semantic validation; Analyst/BI/Data Engineer/BA |
| Triệu Quang Huy — MW-TEAM-05 | IndexedDB/migration/backup/import; DevOps/Network/Security/QA |

Giữ commit và tài liệu cá nhân; tích hợp không thay AI Log từng bạn. Sửa tiếp bằng branch + PR cho Hải review; không tự merge/push `main`.

## Kiểm thử và giới hạn

`check` kiểm tra registry/module/resolver/Context và hồi quy tích hợp 50 cấu hình. `check:team` chạy suite thuần của năm bạn. `build` kiểm tra TypeScript/đóng gói. UI cần thử riêng theo hướng dẫn, không suy ra từ CI xanh.

Kho QA cách ly: `/tests/integration-browser.html?session=<UUID>#/roadmap` khi chạy dev. Harness dùng cùng AppShell/controller nhưng DB `majorweave.qa.integration.<UUID>` và fixture v1 riêng; không sửa kho người dùng, không có trong bản build.

Trình duyệt chặn IndexedDB hoặc hết dung lượng có thể làm lưu thất bại. Xuất backup định kỳ. Chưa có khảo sát người dùng diện rộng, xác minh toàn bộ nội dung nguồn hoặc đo khả năng chịu tải.
