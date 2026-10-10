# Sơ đồ luồng tính năng — MW-TEAM-02

Ngày 10/10/2026 · Đối chiếu main `1e9bff4`.

[Mở bộ sơ đồ trực quan](diagrams/flows.html). Có tám hình, mỗi hình tập trung vào một luồng; phần Mermaid bên dưới là nguồn có thể chỉnh sửa.

Phạm vi: Roadmap/Planner của Định. My Plan và persistence được thể hiện ở điểm nối tích hợp, không nhận thành tính năng riêng của MW-TEAM-02.

## 01 — Từ lộ trình đến tiến độ đã lưu

Hành trình chính của người học, từ chọn nhánh đến tải lại tiến độ trong My Plan.

```mermaid
flowchart TD
  A["01 · Chọn nhánh học<br/>Mobile hoặc Game"]
  B["02 · Chỉnh bản nháp<br/>Chặng, nguồn, mục tiêu, giờ, ngày"]
  C["03 · Tạo và lưu kế hoạch<br/>Các kế hoạch trước được giữ"]
  D["04 · Mở My Plan<br/>Kế hoạch vừa lưu là bản đang xem"]
  E["05 · Hoàn thành một việc<br/>Chờ lưu tiến độ thành công"]
  F(["06 · Tải lại để tiếp tục<br/>Tiến độ đọc từ dữ liệu đã lưu"])
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
```

- Sơ đồ tổng quan chỉ mô tả luồng thành công. Các nhánh lỗi, hủy và tạo lại nằm ở các hình sau.
- Bước 01–03 thuộc phần MW-TEAM-02; My Plan và ghi nhận hoàn thành nối với module của Chung Minh Hiếu qua dữ liệu chung.

Đối chiếu: `FL-02-01 → FL-02-06` · `MyRoadmap.tsx` · `MyPlanV2.tsx`.

## 02 — Chỉnh và lưu bản nháp

Chỉnh bản nháp theo nhánh học rồi lưu độc lập với kế hoạch đang học.

```mermaid
flowchart TD
  A(["Chọn nhánh học<br/>Lấy bản nháp riêng của nhánh"])
  B["Chọn chặng và nguồn học<br/>Đánh dấu những chặng đã biết"]
  C{"Giờ và ngày hợp lệ?<br/>Giờ 2–20; ngày có thật"}
  D(["Báo lỗi để sửa lại<br/>Bản đang học được giữ nguyên"])
  E["Bấm Lưu bản nháp<br/>Chờ ghi dữ liệu hoàn tất"]
  F(["Bản nháp đã lưu<br/>Tải lại giữ các lựa chọn"])
  G(["Lỗi lưu / dữ liệu thay đổi<br/>Giữ bản chờ · xem hình 07–08"])
  A --> B
  B --> C
  C -->|KHÔNG| D
  C -->|CÓ| E
  E -->|ĐÃ LƯU| F
  E -->|THẤT BẠI| G
```

- Bản nháp có thể chưa có mục tiêu hoặc chưa đủ chặng tiên quyết. Lưu nháp không phải tạo kế hoạch.
- Thiếu nền tảng được chỉ rõ trên trang; không tự thêm chặng hay tự đánh dấu “đã biết”. Đổi lựa chọn không sửa kế hoạch hiện có.

Đối chiếu: `FL-02-01 / FL-02-02` · `AC-01` · `updateDraft / saveDraft`.

## 03 — Kiểm tra đầu vào và ngày bắt đầu

Kiểm tra dữ liệu trước khi tạo mới hoặc xem trước tạo lại, và xin xác nhận nếu cần đổi ngày sang Thứ Hai.

```mermaid
flowchart TD
  A(["Bấm tạo mới hoặc tạo lại<br/>Đọc dữ liệu bản nháp"])
  B{"Thông tin cơ bản hợp lệ?<br/>Chặng · mục tiêu · giờ · ngày"}
  C(["Báo lỗi và giữ bản nháp<br/>Không tạo hoặc lưu kế hoạch"])
  D{"Ngày bắt đầu là Thứ Hai?<br/>Ngày lịch đã được kiểm tra"}
  E{"Chấp nhận ngày đề xuất?<br/>Thứ Hai kế tiếp"}
  F(["Tiếp tục tạo / xem trước<br/>Kiểm tra nội dung và tiên quyết"])
  G(["Giữ ngày đã chọn<br/>Dừng thao tác; kế hoạch cũ còn nguyên"])
  A --> B
  B -->|KHÔNG| C
  B -->|CÓ| D
  D -->|KHÔNG| E
  D -->|CÓ| F
  E -->|HỦY| G
  E -->|ĐỒNG Ý| F
```

- Xác nhận mới cập nhật ngày. Hủy hoặc Escape giữ ngày cũ và không tiếp tục tạo.
- Planner kiểm tra nguồn thuộc chặng, thứ tự và tiên quyết; chọn tất cả “đã biết” sẽ không sinh kế hoạch rỗng.

Đối chiếu: `FL-02-03` · `AC-01` · `request / confirmMonday / validateDraft`.

## 04 — Tạo một kế hoạch mới

Sinh lịch theo thời gian học, thêm kế hoạch mới và chỉ thông báo thành công sau khi lưu xong.

```mermaid
flowchart TD
  A(["Bản nháp hợp lệ<br/>Nhánh và nguồn đã được đối chiếu"])
  B["Sinh các việc cần học<br/>Bỏ chặng đã biết · đoạn ≤120 phút"]
  C["Xếp lịch theo quỹ giờ<br/>Giữ tổng phút và thứ tự tiên quyết"]
  D["Thêm kế hoạch và gửi lưu<br/>Giữ mọi kế hoạch trước"]
  E(["Lưu thành công<br/>Chọn kế hoạch mới; mở My Plan"])
  F(["Chưa lưu được<br/>Giữ bản đề xuất · xem hình 07–08"])
  A --> B
  B --> C
  C --> D
  D -->|ĐÃ LƯU| E
  D -->|THẤT BẠI| F
```

- Tạo mới mặc định thêm một kế hoạch độc lập, kể cả khi đã có kế hoạch cùng nhánh. Ngày cụ thể trong tuần chưa được tự gán.
- Trong lúc lưu, chặn chỉnh sửa và gửi lặp. Không báo “đã lưu” hoặc chuyển kế hoạch đang xem trước khi ghi thành công.

Đối chiếu: `FL-02-04` · `AC-02 / AC-03` · `generatePlan / createPlan / commit`.

## 05 — Xem trước và tạo lại kế hoạch

Xem thay đổi trước khi xác nhận tạo lại một kế hoạch cùng nhánh, giữ bản cũ khi hủy hoặc xảy ra lỗi.

```mermaid
flowchart TD
  A(["Có kế hoạch cùng nhánh<br/>Kế hoạch đang xem có thể tạo lại"])
  B["Bấm Xem trước tạo lại<br/>Xem số việc, tiến độ giữ, backlog"]
  C{"Xác nhận tạo lại?<br/>Chưa ghi dữ liệu khi xem trước"}
  D(["Đóng preview / Escape<br/>Kế hoạch và lịch sử không đổi"])
  E["Kiểm tra preview và gửi lưu<br/>Đối chiếu bản nháp, phiên bản, revision"]
  F(["Lưu phiên bản mới<br/>Giữ phiên bản trước trong lịch sử"])
  G(["Báo lỗi, giữ kế hoạch cũ<br/>Preview cũ / lỗi lưu: xem 07–08"])
  A --> B
  B --> C
  C -->|HỦY| D
  C -->|XÁC NHẬN| E
  E -->|ĐÃ LƯU| F
  E -->|THẤT BẠI| G
```

- UI chỉ cho tạo lại kế hoạch đang xem cùng nhánh. Muốn học nhánh khác thì tạo kế hoạch mới.
- Sửa bản nháp làm preview cũ hết hiệu lực. Tiến độ được giữ theo quy tắc hình 06, không sao chép hoàn thành sang bài đã đổi nghĩa.

Đối chiếu: `FL-02-05` · `AC-04` · `previewRegeneration / confirmRegeneration`.

## 06 — Giữ việc tùy chỉnh và tiến độ

Phân biệt việc do người học chỉnh với bài từ nội dung mẫu để giữ đúng tiến độ khi tạo lại.

```mermaid
flowchart TD
  A(["Đối chiếu từng việc cũ<br/>Khi dựng phiên bản tạo lại"])
  B{"Việc tự thêm / tùy chỉnh?<br/>Không ghi đè việc tùy chỉnh"}
  C(["Giữ trong backlog<br/>Giữ ghi chú và trạng thái liên quan"])
  D{"Bài còn khớp định danh?<br/>Bài / phiên bản / đoạn"}
  E(["Giữ ID và tiến độ<br/>Giữ notes / trạng thái / completion"])
  F(["Tạo bài mới khi cần<br/>Không kế thừa hoàn thành cũ"])
  A --> B
  B -->|CÓ| C
  B -->|KHÔNG| D
  D -->|CÓ| E
  D -->|KHÔNG| F
```

- Đây là quy tắc giữ việc cũ; lịch mới vẫn được sinh từ các chặng cần học. Việc tùy chỉnh không thay thế bài mẫu mới.
- Các việc cũ không còn trong lịch mới vẫn được giữ trong phiên bản lịch sử. Không sửa lịch sử hay nhân đôi bản ghi hoàn thành.

Đối chiếu: `FL-02-06` · `AC-04` · `regeneratePlan / workId / revision / segment`.

## 07 — Thử lại khi lưu thất bại

Giữ đúng bản chưa lưu và thử lại mà không tạo thêm kế hoạch trùng.

```mermaid
flowchart TD
  A(["Lưu thất bại<br/>Báo lỗi; giữ bản đề xuất"])
  B["Bản chưa lưu được giữ<br/>Chặn chỉnh sửa và thao tác mới"]
  C["Bấm Thử lưu lại<br/>Gửi đúng bản đề xuất và các ID cũ"]
  D{"Ghi thành công?<br/>Chờ kết quả ghi thực tế"}
  E(["Đã lưu thay đổi<br/>Mở khóa; không tạo bản trùng"])
  F(["Vẫn chưa lưu được<br/>Giữ bản chờ để xử lý"])
  A --> B
  B --> C
  C --> D
  D -->|CÓ| E
  D -->|KHÔNG| F
```

- Nếu vẫn là lỗi lưu, có thể thử lại hoặc chọn “Tải bản đã lưu…” rồi xác nhận bỏ bản chờ theo hình 08.
- Nếu dữ liệu đã thay đổi ở tab khác, UI không hiện nút thử lưu lại để tránh ghi đè bản mới hơn. Khi đó đi thẳng đến hình 08.

Đối chiếu: `FL-02-04 / FL-02-05` · `AC-03` · `retrySave / commit`.

## 08 — Tải bản đã lưu và xử lý xung đột

Xin xác nhận trước khi bỏ dữ liệu chưa lưu; xung đột ở tab khác không được tự ghi đè.

```mermaid
flowchart TD
  A(["Có bản chưa lưu / xung đột<br/>Giữ bản chờ; không tự ghi đè"])
  B["Bấm Tải bản đã lưu…<br/>Mở hộp thoại xác nhận"]
  C{"Bỏ thay đổi chưa lưu?<br/>Nêu rõ phần sẽ bị bỏ"}
  D(["Giữ thay đổi / Escape<br/>Bản chờ vẫn được giữ"])
  E["Tải dữ liệu đã lưu<br/>Không bỏ bản chờ trước khi tải xong"]
  F(["Tải thành công<br/>Thay dữ liệu trên màn; xóa bản chờ"])
  G(["Tải thất bại<br/>Báo lỗi; bản chờ vẫn còn"])
  A --> B
  B --> C
  C -->|HỦY| D
  C -->|ĐỒNG Ý| E
  E -->|ĐÃ TẢI| F
  E -->|THẤT BẠI| G
```

- Xung đột thường xuất hiện khi tab khác lưu phiên bản mới hơn. Tải lại lấy phiên bản đã lưu thay cho dữ liệu đang chỉnh trên màn này.
- Trong lúc đang lưu, thao tác tải lại hoặc bỏ dữ liệu bị chặn. Không reset dữ liệu về mặc định để né lỗi.

Đối chiếu: `FL-02-04 / FL-02-05` · `AC-03` · `reloadWorkspace(true) / revision`.
