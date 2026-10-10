# uitplans. — quy tắc chung cho AI và thành viên

Đọc file này khi mở repo. Áp dụng cho mini project, không áp dụng cho project chính. Yêu cầu trực tiếp mới nhất của nhóm trưởng được ưu tiên; ghi lại quyết định thay thế trong tài liệu liên quan.

## Đọc trước khi làm

1. `docs/PHAM_VI_MAJORWEAVE.md`: ngành → hướng → nhánh và phạm vi đích.
2. `docs/KIEN_TRUC_MAJORWEAVE.md`: nghiệp vụ và kiến trúc v2.
3. `docs/BUOC_4_BO_KHUNG_VA_QUY_TAC.md`: trạng thái thực tế, ranh giới file.
4. `docs/team/QUY_TRINH_ANTIGRAVITY.md` và task của mình.
5. Nếu sửa nội dung: `docs/architecture/HUONG_DAN_DU_LIEU.md`, `src/domain/contracts.ts`, `src/content/paths/backend.ts`.
6. Phân công hiện tại: `docs/team/PHAN_CONG_MINI_PROJECT.md` và `docs/tasks/MW-TEAM-01` đến `MW-TEAM-05`; allowlist trong task quyết định quyền sửa file.

## Phạm vi và giao diện

- Quyết định mới nhất ngày 10/10/2026: tên hiển thị là **uitplans.**, viết thường và có dấu chấm cuối. Wordmark chữ sans serif đậm như Beaver Plans, không icon/logo riêng, không chữ nghiêng hay tagline bên dưới. Giữ các khóa lưu dữ liệu, định dạng backup và ID hiện có để dữ liệu cũ tiếp tục dùng được.
- Quyết định tiếp theo ngày 10/10/2026: Hải duyệt triển khai đề xuất bố cục bên trong; làm **Hướng học và Kế hoạch trước**. Dùng chữ sans serif, danh sách chặng gọn, công việc nhóm theo ngày đã chọn và menu thao tác phụ. Giữ dữ liệu học thật và gửi bản xem trước trước khi làm ba trang còn lại.
- Điều chỉnh mới nhất ngày 10/10/2026: nav giữ tiếng Anh **Explore / Path detail / My roadmap / My plan / Profile**. Trong Profile, **Nhịp học của bạn** là phần đầu tiên sau tiêu đề, trước form hồ sơ và chứng nhận. Hải yêu cầu tạo một kế hoạch Backend để thử trên trình duyệt; không đưa dữ liệu cá nhân này vào seed của app.
- Sáu thành viên: nhóm trưởng kiến trúc/thiết kế/tích hợp/duyệt cuối; năm bạn triển khai theo bảng phân công bước 5. Chỉ làm task có mã và phạm vi file được giao; mỗi người làm cả module và nội dung học được chỉ định.
- Hoàn thiện mọi hướng/nhánh trong danh mục được duyệt; không thu hẹp về Backend. Không nhận placeholder hoặc chỉ liên kết ngoài là một kế hoạch đã hoàn chỉnh.
- Quyết định mới của Hải ngày 09/10/2026: chuyển app sang top nav, tham chiếu Beaver Plans. Giữ palette kem/gạch và thương hiệu UIT - Path; ưu tiên thao tác học, nội dung gọn và tùy chọn nâng cao thu gọn. `src/prototype/` vẫn là thử nghiệm lịch sử.
- Không tự thay thiết kế đã được duyệt. Điều chỉnh top nav/Profile/Path detail/My Plan hiện tại theo yêu cầu trực tiếp của Hải; skill chỉ hỗ trợ cách thực hiện. Xem `docs/team/UI_BEAVER_REFINEMENT.md`.
- Giai đoạn hiện tại không đăng nhập. Profile cục bộ không phải tài khoản online. Không thêm OAuth/Supabase, nút đăng nhập giả hoặc thông báo đồng bộ giả.
- Không cập nhật Notion. Không tự làm project chính từ task mini.

## Ranh giới code

- `src/main.tsx`: entry. `src/app/`: shell/routes/context, do nhóm trưởng tích hợp.
- `src/features/<feature>/`: trang và tương tác của feature. Không import feature khác; dùng `components` hoặc context. Không gọi storage trực tiếp, không tạo bản plan riêng ở từng trang.
- `src/components/`: UI dùng chung; thay đổi ảnh hưởng các trang phải được phối hợp trước tích hợp.
- `src/domain/contracts.ts`: một nguồn kiểu v2. Không chép kiểu sang file cá nhân; không dùng `any`/ép kiểu để né lỗi. Domain độc lập React/browser/storage.
- `src/content/paths/<pathId>.ts`: dữ liệu theo hướng; ID toàn cục ổn định, không trùng. Một chặng dùng chung chỉ định nghĩa một lần, nhánh khác tham chiếu ID. `src/content/index.ts` đăng ký qua người tích hợp.
- `src/persistence/`: nơi ghi dữ liệu. UI dùng Workspace v2/IndexedDB qua shared controller. `src/state.ts` và `src/data.ts` giữ tương thích/khám phá cũ; key v1 chỉ đọc để migration, không tự ghi lại khi mở app. Trạng thái mới: `docs/team/INTEGRATION_V2.md`.
- `src/styles.css`, contracts, catalog, registry, app, package/lock/config, script kiểm tra và workflow là file phối hợp qua nhóm trưởng. Task được giao sửa file chung là đủ ủy quyền; không mở rộng sang file khác chỉ để làm mất lỗi.
- Thay hợp đồng dùng chung: ghi đề xuất, tác động, migration và test trong task; phối hợp nhóm trưởng và module bị ảnh hưởng trước khi merge. Không đổi ID âm thầm.
- Dùng dependency hiện có và API trình duyệt phù hợp. Thêm dependency phải nêu nhu cầu và thống nhất với nhóm trưởng; không tự chuyển framework.

## Dữ liệu và nghiệp vụ

- Nguồn/chứng nhận có URL chính thức hoặc đơn vị cung cấp rõ, loại/chi phí/điều kiện/ngày kiểm tra. Không bịa URL, học phí, chứng chỉ hoặc bằng chứng đã học. BA dùng nguồn nghề phù hợp ngoài roadmap.sh.
- Ngôn ngữ tài liệu Việt/Anh độc lập với ngôn ngữ lập trình. Không gắn bài Java vào Python; không coi Vite là một framework FE ngang hàng React/Angular.
- Roadmap draft và kế hoạch đã tạo độc lập. Khám phá hướng khác không tự thay kế hoạch. Kết quả sinh lịch phải đúng tiên quyết, tổng phút, quỹ giờ và giữ lịch sử theo kiến trúc.
- Giữ dữ liệu cũ; không xóa storage/reset defaults để né migration hoặc test lỗi. Dùng trình duyệt/profile thử riêng cho dữ liệu test. Chỉ báo thành công khi thao tác thực sự hoàn tất.
- Nội dung nhập/đọc storage phải được kiểm tra runtime; React hiển thị text, không đưa nội dung ngoài vào raw HTML. Không commit thông tin đăng nhập/token.

## Cách bàn giao

- Mỗi task có user story, acceptance criteria, luồng chính/thay thế/lỗi/hủy, test case, kết quả và AI log; dùng `docs/templates/`.
- Một branch/task, một PR có phạm vi đọc được; giữ danh tính Git cá nhân. Không tự merge/push main, force push hoặc ghi đè công việc người khác. Nhóm trưởng tích hợp theo quyền được giao.
- Chạy `npm run check` và `npm run build`. Kiểm tra luồng UI bị tác động bằng tay hoặc công cụ trình duyệt; có minh chứng và SHA. Check cấu trúc/build không chứng minh khóa học đã kiểm tra hoặc mọi hướng đã chạy.
- Không sửa/xóa assertion, bỏ qua lỗi hoặc ghi Pass cho test chưa chạy để làm CI xanh. Nếu lỗi ngoài phạm vi: ghi rõ lỗi/tác động và báo người sở hữu, tiếp tục phần độc lập còn làm được.
- Kết thúc task: liệt kê file đổi, cách thử, kết quả thực tế, giới hạn và việc cần tích hợp. Dừng tại ranh giới task; không tự nhận thêm phần của bạn khác.
