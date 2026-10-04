# Bước 4 — Bộ khung và quy tắc làm việc

**Ngày:** 04/10/2026. **Trạng thái:** đang giao nhóm trưởng kiểm tra. Phân công cụ thể năm người thuộc bước tiếp theo.

## 1. Đã làm trong bước này

- Tách file `main.tsx` thành AppShell, context, năm feature và UI dùng chung. Nội dung JSX và CSS giữ bản sidebar đã chọn.
- Đưa hợp đồng v2 vào `src/domain/contracts.ts`; đường dẫn tài liệu cũ chỉ re-export, không có hai bản kiểu khác nhau.
- Đưa ba nhánh Backend vào `src/content/paths/backend.ts` và registry `src/content/index.ts`. Gói còn ở trạng thái `review`; chặng/bài/nguồn kế thừa bản cũ, cần rà soát nội dung trước release.
- Tập trung thao tác ghi v1 vào `src/persistence/legacy.ts`; giữ key và cách phục hồi của app cũ.
- Thêm `AGENTS.md`, quy trình Antigravity, mẫu task/story/flow/test/AI log, mẫu PR và kiểm tra tự động trên GitHub.

## 2. Đang chạy và chưa được tích hợp

| Phần | Trạng thái thực tế |
|---|---|
| Sidebar, năm trang, Backend Node/Python/Java, nguồn/chứng nhận, Profile | Dùng các module đã tách; hành vi v1 được giữ |
| State/lưu | Vẫn `src/state.ts`, localStorage v1, một kế hoạch hiện hành |
| Contracts/Content v2 | Đã có source chuẩn và qua kiểm tra cấu trúc; chưa nối vào UI |
| IndexedDB, migration, xuất/nhập, nhiều kế hoạch, lịch sử v2 | Chưa triển khai; cần task riêng và kiểm thử trước khi chuyển UI |
| Mọi hướng ngoài Backend | Vẫn chưa hoàn thiện nội dung/lịch. Bảng 18 hướng/50 cấu hình là phạm vi đích đề xuất |
| Google login/tài khoản | Giai đoạn sau, chưa chọn backend |
| Quy tắc và CI | Đã có file; luật không phải khóa file hay bảo đảm hết conflict |

Không cho các bạn tự nối từng feature với v2 theo cách riêng. Khi module v2 có kiểm thử, nhóm trưởng chuyển context/routes sang một workspace chung trong một PR tích hợp, có migration giữ dữ liệu cũ.

## 3. Cấu trúc thực tế sau bước 4

```text
AGENTS.md
src/
  main.tsx
  app/                  AppShell.tsx, context.ts
  components/           ui.tsx, ProviderMark.tsx, StackChooser.tsx, StudyActivity.tsx
  features/
    explore/            Explore.tsx
    path-detail/        PathDetail.tsx, ModuleDrawer.tsx, ResourceCard.tsx
    my-roadmap/         MyRoadmap.tsx
    my-plan/            MyPlan.tsx
    profile/            Profile.tsx
  domain/               contracts.ts, README.md
  content/              index.ts, paths/backend.ts
  persistence/          legacy.ts, README.md
  data.ts, catalog.ts, state.ts, styles.css   # v1 còn dùng
  prototype/            # thử nghiệm lịch sử
scripts/check-project.mjs
.github/workflows/check.yml
docs/team/QUY_TRINH_ANTIGRAVITY.md
docs/templates/         TASK.md, FLOW.md, QA_AI_LOG.md
```

Chưa tạo các hàm planner/validator/IndexedDB giả. Module cần triển khai và chữ ký nằm trong [kiến trúc](KIEN_TRUC_MAJORWEAVE.md) và [contracts chuẩn](../src/domain/contracts.ts).

## 4. Ranh giới sửa file trước khi gắn tên người

| Vùng | Cách làm việc |
|---|---|
| Feature riêng | Task ghi rõ feature + allowlist file; giữ props/context chung |
| Nội dung theo hướng | Một file/gói riêng từng hướng; chia chặng dùng chung qua người tích hợp |
| Domain / persistence | Task riêng với test; không vừa viết thuật toán mới vừa tự thay UI của bạn khác |
| App/context/routes, components chung, CSS, contracts, catalog, registry, package/lock, scripts, CI | Nhóm trưởng tích hợp hoặc giao rõ file chung cho một task; không nhiều người sửa đồng thời |
| Docs task/flow/test/AI log | Mỗi task một thư mục `docs/tasks/<TASK-ID>/`, tránh sửa chung một bảng nhật ký |
| Prototype lịch sử, project chính, Notion | Không thuộc task bước này |

Chưa gắn tên năm bạn, chưa tạo issue giao việc và chưa cấu hình CODEOWNERS/branch protection. Luật trong repo + PR/CI giúp kiểm soát thay đổi; quyền merge bắt buộc trên GitHub cần thiết lập riêng khi nhóm thống nhất quyền.

## 5. Những gì check tự động thực sự kiểm tra

`npm run check`:

- Mọi gói đã đăng ký: ID duy nhất, nguồn/chứng nhận/thứ tự/tiên quyết hợp lệ, phút/revision/tiêu chí bài thực hành, URL HTTPS có cấu trúc hợp lệ.
- Mã app chính: không import Prototype 02; feature không import feature khác hoặc dùng storage trực tiếp; domain độc lập UI/browser; CSS chung nạp ở entry; không vòng lặp import.
- Backend: đủ ba nhánh × 15 chặng, giữ thư viện 40 nguồn/8 mục tiêu và legacy maps.

`npm run build`: TypeScript + build Vite + sinh tài liệu prototype hiện có. CI chạy cùng hai lệnh sau `npm ci` trên PR và main. Workflow dùng [actions/checkout](https://github.com/actions/checkout) và [actions/setup-node](https://github.com/actions/setup-node) chính thức.

Check không truy cập mọi URL, không xác minh chi phí/chứng nhận, không kiểm tra quyền sở hữu file của người gửi PR và không tự kiểm thử giao diện. Các phần ấy vẫn cần người làm/nhóm trưởng kiểm tra. Không gọi CI là đã bảo vệ main khi chưa bật branch protection.

## 6. Nhóm trưởng kiểm tra

1. Mở `/` và thử năm trang: giao diện sidebar cũ, nguồn học/chứng nhận còn đầy đủ theo nhánh.
2. Đọc [AGENTS.md](../AGENTS.md), [quy trình Antigravity](team/QUY_TRINH_ANTIGRAVITY.md) và các mẫu bàn giao.
3. Kiểm tra cấu trúc mới có đủ ranh giới để năm bạn làm độc lập; xem bảng trạng thái để không hiểu v2 đã tích hợp.

Sau khi nhóm trưởng yêu cầu tiếp tục, lập gói phân công năm bạn theo nội dung + logic + kiểm thử, bao phủ toàn danh mục được duyệt. Không lấy số hướng làm thước đo công sức duy nhất.
