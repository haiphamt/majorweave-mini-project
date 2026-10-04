# Prototype 02 — hướng dẫn Hải duyệt

> **Trạng thái lịch sử — 04/10/2026:** Hải yêu cầu dùng lại bản cũ có sidebar. Prototype 02 không còn là giao diện nền được chọn. Làm không đăng nhập trước; phần tài khoản/Google trong bản này là thử nghiệm chưa kết nối. Xem [kiến trúc hiện tại để duyệt](KIEN_TRUC_MAJORWEAVE.md). Nội dung phía dưới giữ để đối chiếu đợt thử nghiệm.

**Ngày:** 04/10/2026. **Phần:** 2 — prototype và giao diện chung.

## 1. Mở bản mới

Trong thư mục repository:

```powershell
npm install
npm run dev
```

Mở http://127.0.0.1:5173/prototype.html#/explore.

Bản trước vẫn ở http://127.0.0.1:5173/. Hai bản dùng vùng lưu trình duyệt khác nhau. Bản mới dùng `majorweave.design.v2`; việc thử bản mới không migrate dữ liệu bản trước. Không dùng mô hình lưu này làm hợp đồng dữ liệu cho sản phẩm cuối.

```powershell
npm run check:prototype
npm run build
```

Build bao gồm cả `index.html` và `prototype.html`. Đây chưa phải URL triển khai công khai.

## 2. Những gì đã chạy được

| Trang | Hành vi để thử |
|---|---|
| Explore | Chọn một trong 12 ngành; tìm kiếm hướng; lọc khoa/nhóm; mở 18 hướng |
| Path detail | Mở roadmap tham khảo; chọn nhánh; xem chặng; chọn nguồn; đánh dấu đã biết; lọc nguồn; lưu mục tiêu bổ trợ khi có nội dung |
| My roadmap | Thêm/bỏ chặng, thay thứ tự, chọn nguồn, bỏ qua kỹ năng đã biết; nhập mục tiêu, ngày và quỹ giờ; tạo kế hoạch riêng hoặc xác nhận thay kế hoạch đang xem |
| My plan — Plan | Đổi giữa nhiều kế hoạch; chuyển tuần; lọc ngày/chặng; đánh dấu hoàn thành; thêm việc; sửa tên/thời lượng/ngày/ghi chú; dời việc; kết thúc tuần |
| My plan — Weeks | Xem tuần và kết quả tổng kết được lưu; mở lại tuần để đọc |
| My plan — Stats | Tiến độ theo tuần, số việc hoàn thành và thời lượng ước lượng; link sang nhịp học |
| Profile | Lưu tên/ngành học; xem số kế hoạch và mục tiêu; nhịp học 12 tuần từ ngày tự đánh dấu hoàn thành; xem giao diện tài khoản |

Mọi hướng/nhánh trong fixtures có thể đi qua cùng bộ màn hình và tạo lịch mẫu. Bộ kiểm tra dữ liệu xác nhận 18 hướng, 12 ngành, 50 cấu hình không rỗng, ID không trùng, task có thời lượng dương và URL nguồn có dạng HTTPS.

## 3. Phân biệt giao diện chạy được và nội dung đã hoàn thiện

- **Backend Node.js/Python/Java:** kế thừa nội dung đã biên soạn, có nguồn CS và nguồn theo stack; vẫn cần rà soát khi chuẩn hóa sản phẩm cuối.
- **Frontend, Full-stack và BA:** chuỗi chặng mẫu để kiểm tra hành vi. Nguồn ban đầu là tài liệu chính thức; chưa phải thư viện khóa học đầy đủ.
- **Các hướng khác:** khung chặng và bài thực hành mẫu, chủ yếu liên kết roadmap tổng quan. Các nhánh thể hiện công cụ đã chọn, chưa có giáo trình chuyên sâu riêng hoàn chỉnh.
- **Chứng nhận:** Backend dùng danh mục cũ; các hướng còn lại hiện thể hiện trạng thái chưa biên soạn. Không suy ra rằng hướng đó không có chứng nhận phù hợp.
- **Google login:** có màn để duyệt, nút Google chưa kết nối. OAuth, backend, đồng bộ, quyền truy cập và migrate dữ liệu khách sẽ thiết kế/triển khai sau.
- Dữ liệu chỉ lưu trên trình duyệt. Không đọc tiến độ thực từ roadmap.sh/freeCodeCamp hoặc website khác.
- Không quiz chấm năng lực, không điểm “phù hợp nghề” tự tạo.

**Phạm vi cuối vẫn phải hoàn thiện tất cả các hướng/nhánh được duyệt.** Các dữ liệu mẫu ở phần prototype không thay đổi yêu cầu này.

## 4. Kịch bản kiểm tra đề xuất

### A. Tạo và giữ nhiều kế hoạch

1. Chọn ngành Kỹ thuật Phần mềm → Backend → Node.js.
2. Mở JavaScript foundations; chọn một nguồn và đánh dấu đã biết nếu phù hợp.
3. My roadmap → nhập mục tiêu, ngày bắt đầu, 5 giờ/tuần → Tạo kế hoạch mới.
4. Explore → Frontend → React → My roadmap → tạo kế hoạch thứ hai.
5. My plan → đổi kế hoạch đang xem. Backend không bị thay bằng Frontend.

### B. Một tuần học

1. Đánh dấu một việc hoàn thành; sửa một việc khác, ghi chú và chuyển sang tuần sau.
2. Kết thúc tuần → chọn chuyển việc chưa xong hoặc bỏ khỏi lịch sắp tới.
3. Weeks/Stats giữ mẫu số của kết quả tổng kết; không đổi thành 100% sau khi dời việc.
4. Tuần đã kết thúc được khóa sửa. Khi tuần kế tiếp đã đóng, việc chuyển đến tuần mở tiếp theo.
5. Tải lại trang, kiểm tra kế hoạch/ghi chú/kết quả còn giữ.
6. Nếu tự dời/thêm làm lịch vượt quỹ giờ, giao diện có thông báo để điều chỉnh.

### C. Nhánh và nguồn học

1. Backend: Node.js / Python / Java thay được chặng riêng.
2. Frontend: HTML → CSS → JavaScript, sau đó React / Angular / Vue. Vite hiển thị như công cụ build.
3. Full-stack: chọn Frontend và Backend độc lập; thử Vue + Java.
4. BA: IT / Software BA hoặc Data / BI BA; nguồn nghề từ IIBA.
5. Tìm nguồn không tồn tại → màn rỗng → xóa bộ lọc để trở lại.
6. Mở link roadmap/tài liệu ở tab mới; lịch học vẫn ở MajorWeave.

### D. Trạng thái và điện thoại

1. Thanh Prototype phía trên → loading/error giả lập → quay về dữ liệu mẫu.
2. Profile → xem Google login → tiếp tục với tư cách khách.
3. Thử menu điện thoại, form, chọn kế hoạch và lịch tuần.
4. Dùng Escape đóng hộp thoại; dùng mũi tên trong nhịp học.

## 5. Những giới hạn tương tác còn cần thiết kế

- Tạo lại kế hoạch hiện yêu cầu xác nhận và đặt lại lịch sử tuần của kế hoạch đó; giữ ghi chú/hoàn thành của task cùng định danh khi không đổi hướng/nhánh. Chính sách sản phẩm cuối cần Hải duyệt ở kiến trúc.
- Chưa có xóa/đổi tên kế hoạch, xóa task, sao chép tuần, copy/paste kế hoạch hoặc kéo thả hàng loạt.
- Thứ tự chặng đang cho tự chỉnh; chưa có kiểm tra tiên quyết như một hệ thống học hoàn chỉnh.
- Chưa đồng bộ thiết bị và chưa xử lý xung đột nhiều tab/người dùng.
- Khóa học, phí/chính sách thi và điều kiện chứng nhận cần kiểm tra ở đơn vị cấp trước khi đưa vào thư viện cuối.

## 6. Thiết kế và bằng chứng

- [Nguồn lựa chọn hướng giao diện](prototype-02/direction-approved.md).
- [Màu, chữ, tài sản và thành phần](prototype-02/brand-spec.md).
- [Kết quả kiểm tra thực tế](prototype-02/QA.md).
- [Explore máy tính](prototype-02/screenshots/explore-desktop.png).
- [Plan máy tính](prototype-02/screenshots/plan-desktop.png).
- [Profile điện thoại](prototype-02/screenshots/profile-mobile.png).

Nguồn tham khảo đọc ngày 04/10/2026: [BeaverPlans](https://beaverplans.com/), [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [Angular Tutorials](https://angular.dev/tutorials), [Playwright Writing tests](https://playwright.dev/docs/writing-tests), [IIBA BA](https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/).

## 7. Hải duyệt trước khi sang kiến trúc

- [ ] Style, độ dễ đọc và bố cục năm trang.
- [ ] My plan với Plan / Stats / Weeks và lịch theo ngày.
- [ ] Bộ chọn nhánh và cách phân biệt roadmap tham khảo / roadmap cá nhân.
- [ ] Nhiều kế hoạch; một kế hoạch đang xem.
- [ ] Profile và vị trí nhịp học.
- [ ] Giao diện Google login và tiếp tục khám phá với tư cách khách.
- [ ] Cách giải thích dữ liệu mẫu, trạng thái lỗi/rỗng và kết thúc tuần.

**Dừng ở đây để Hải kiểm tra.** Kiến trúc, hợp đồng module, luật Antigravity và phân công năm bạn thuộc các phần kế tiếp. Notion không được cập nhật trong lượt này.
