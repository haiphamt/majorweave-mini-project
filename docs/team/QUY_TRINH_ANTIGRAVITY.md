# Quy trình vibe code MajorWeave bằng Antigravity

**Áp dụng:** mini project, sáu thành viên. **Ngày:** 04/10/2026. Chưa phải bảng phân công.

## 1. Bắt đầu trên máy thành viên

1. Clone repo mini, mở **thư mục chứa `package.json` và `AGENTS.md`** trong Antigravity; không mở nhầm project chính.
2. Mỗi người dùng tài khoản/danh tính Git cá nhân. Kiểm tra `git status` trước khi đổi branch; giữ công việc chưa commit của mình.
3. Cài dependency từ lockfile bằng `npm ci`; chạy `npm run check`, `npm run build`, `npm run dev`. Máy cần Node 22, Git và trình duyệt. Repo không cần Supabase key/Google OAuth.
4. Đọc AGENTS và tài liệu bước 4; mở task có mã, allowlist, acceptance và phụ thuộc. Chưa được giao task thì chỉ đọc/chuẩn bị, không tự nhận sửa file chung.
5. Tạo branch từ main đã cập nhật, dạng `feat/<TASK-ID>-<noi-dung>` hoặc `fix/<TASK-ID>-<loi>`. Đừng bắt đầu từ nhánh của bạn khác nếu task không yêu cầu.

### Đảm bảo Antigravity đã đọc luật

Repo dùng một `AGENTS.md` ở gốc. Tài liệu chính thức cho biết Antigravity hỗ trợ file này làm luật theo thư mục, không cần YAML frontmatter. Nếu phiên bản trên máy chưa nhận, mở Customizations → Rules và thêm workspace rule yêu cầu đọc AGENTS; đừng chép một bộ luật khác dễ lệch. [Google Antigravity — Rules](https://www.antigravity.google/docs/rules/).

Đầu mỗi task, gửi prompt bên dưới và kiểm tra AI nêu đúng: sidebar cũ, guest trước, giới hạn file, trạng thái v1/v2 và tiêu chí. Luật không thay kiểm tra của người làm và review PR.

```text
Đọc AGENTS.md, docs/BUOC_4_BO_KHUNG_VA_QUY_TAC.md,
docs/KIEN_TRUC_MAJORWEAVE.md và docs/tasks/<TASK-ID>/TASK.md.
Tóm tắt phạm vi của task, file được sửa, dependency và tiêu chí nghiệm thu.
Đọc code liên quan trước khi sửa. Lập kế hoạch ngắn rồi thực hiện trong allowlist.
Dùng sidebar/style hiện có; giai đoạn này không đăng nhập.
Không tự sửa hợp đồng/CSS/file bạn khác hoặc giảm phạm vi để né lỗi.
Nếu thiếu dependency, ghi đề xuất phối hợp và tiếp tục phần độc lập.
Chạy kiểm tra liên quan; báo kết quả thực, phần chưa chạy và file đã đổi.
```

## 2. Một task cần bàn giao những gì?

Tạo `docs/tasks/<TASK-ID>/` trong branch của mình:

| File | Nội dung |
|---|---|
| `TASK.md` | Copy mẫu task: user story, acceptance, allowlist, dependency, thay đổi hợp đồng nếu có |
| `FLOW.md` | Mỗi hành động một luồng có mã; UI → logic → lưu; nhánh lỗi/hủy và kết quả |
| `QA_AI_LOG.md` | Test case + kết quả thực + bug + AI log; ảnh/link bằng chứng tương ứng SHA |
| `evidence/` | Ảnh nhỏ đã kiểm tra; không commit dữ liệu học thật, token hoặc file build |

Mẫu nằm trong `docs/templates/`. Không điền “Pass” hoặc ký review thay bạn khác. Người làm có thể dùng AI soạn nhưng phải đọc lại và chạy thử.

## 3. Quy trình thực hiện

1. Viết story/acceptance và luồng trước, dựa trên nghiệp vụ đã chốt. Với chức năng UI có empty/loading/error/hủy; với data pack ghi từng nhánh, tiên quyết, nguồn và đầu ra.
2. Xem các thành phần hiện có, dùng lại và sửa trong file của task. Đừng bắt AI xây lại cả app từ prompt chung “làm đẹp”.
3. Chia từng thay đổi có đầu ra kiểm tra được. Code theo `src/domain/contracts.ts`; v2 chưa nối UI thì bàn giao module + test/preview theo task, không gọi nó là tính năng đã chạy trong app chính.
4. Kiểm thử unit/invariant cho logic; thử thao tác trên giao diện cho UI; nguồn/chứng nhận phải mở trang đơn vị cung cấp. Bộ test cũ chỉ kiểm tra prototype, không đủ nghiệm thu mọi cấu hình mới.
5. Đọc diff; chạy check/build; ghi test và AI log. Commit có TASK-ID, mô tả việc thật; push branch và mở PR vào main.
6. Nhóm trưởng review và tích hợp. Sửa feedback trên cùng branch, chạy lại phần bị ảnh hưởng. Khi đã merge, cập nhật main rồi mới bắt đầu task kế tiếp.

## 4. Tránh và xử lý conflict

- Mỗi task sở hữu file rõ. Hướng riêng ở `content/paths/<id>.ts`, feature riêng ở `features/<name>/`, docs riêng theo task. Các chặng thật sự dùng chung do một task/người tích hợp định nghĩa; người khác tham chiếu cùng ID.
- Thêm gói mới cần registry: đề xuất dòng import/đăng ký trong PR hoặc để nhóm trưởng tích hợp; không năm PR tự sắp xếp lại cả registry.
- Muốn thêm field/đổi chữ ký: ghi change request trong TASK, liệt kê nơi đọc/ghi/migration/test bị ảnh hưởng. Nhóm trưởng chốt và đưa lên main trước; các branch cập nhật theo cùng hợp đồng.
- Cập nhật branch từ main khi working tree đã sạch. Với người mới, dùng merge main vào branch để giữ lịch sử. Conflict xuất hiện thì đọc hai phía và phối hợp người sở hữu; không “accept all ours/theirs”, không xóa kiểm tra để build qua.
- Package/CSS/AppShell/contracts thay đổi do nhóm trưởng hoặc task được giao riêng xử lý. Thành viên không force push hoặc tự merge main. Không dùng cùng thư mục làm việc cho hai agent đang sửa cùng file.
- Luật giảm conflict, không bảo đảm hết conflict. CI kiểm tra cấu trúc, reviewer kiểm tra allowlist và hành vi.

## 5. Vẽ luồng chi tiết

Một sơ đồ cho một hành động có ý nghĩa: tạo plan, đổi plan, chọn nguồn, kết thúc tuần, bỏ hoàn thành, import backup... Một sơ đồ tổng quan chỉ giúp hiểu hành trình.

Mẫu `FLOW.md` có mã bước để nối story → luồng → test. Mermaid trong Markdown đủ để review trên GitHub. Có thể dùng diagram-design/archify xuất HTML/SVG khi cần hình trình bày; vẫn giữ mô tả và mã bước làm nguồn nghiệp vụ. Skill vẽ không tự xác minh code hoặc tính đúng của luồng.

## 6. Kiểm thử theo loại task

| Loại | Cách kiểm tra thực tế |
|---|---|
| Nội dung | Check ID/tiên quyết/nguồn qua `npm run check`; mở link chính thức; tự làm bài/đọc tiêu chí; thử mỗi nhánh qua luồng khi đã tích hợp |
| Planner | Input cố định, clock/ID cố định; assert tổng phút, ngân sách, thứ tự, bài dài, thiếu tiên quyết, tất cả đã biết; không chỉ snapshot một output mẫu |
| Persistence | DB/profile thử riêng; reload, lưu lỗi, revision conflict, import hỏng/trùng, migration lặp; so dữ liệu trước/sau, giữ nguồn cũ |
| UI | Luồng chính/lỗi/hủy; bàn phím; màn hình desktop/mobile; nguồn mở tab mới; reload giữ dữ liệu; ảnh và thao tác cụ thể |
| Tích hợp | Toàn hành trình mỗi cấu hình, nhiều plan, tạo lại, lịch sử, tuần chốt/heatmap; không chỉ click vào trang |

Ưu tiên assertion và công cụ hiện có. Nếu máy có công cụ test trình duyệt, dùng môi trường/profile thử riêng; không xóa localStorage thật để chuẩn bị test. Test chưa thực hiện ghi **Chưa chạy**; check/build xanh chưa phải UI pass.

## 7. Cổng review / định nghĩa Done

- Phạm vi task và mọi nhánh được giao đã hoàn thành, không dùng placeholder/nguồn sai nhánh.
- User story + acceptance + luồng + test/bằng chứng + AI log có thật và liên kết nhau.
- Check/build pass ở SHA đang review; lỗi phát hiện đã sửa hoặc được ghi rõ để quyết định, không che lỗi.
- Diff trong allowlist, hoặc có thay đổi hợp đồng/file chung đã thống nhất. Mọi thao tác lưu thất bại không mất dữ liệu.
- Nhóm trưởng review UI và merge. Module chưa nối app chỉ được ghi “đã bàn giao module”; hoàn thiện feature cần nghiệm thu sau tích hợp.

Chưa thiết lập quyền GitHub để bắt buộc reviewer/CI hoặc CODEOWNERS. Điều này sẽ làm khi nhóm chốt quyền và tài khoản; hiện không tuyên bố main đã được khóa.
