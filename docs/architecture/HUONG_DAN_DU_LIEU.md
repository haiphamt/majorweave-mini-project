# Chuẩn dữ liệu nội dung và mẫu triển khai

**Ngày:** 04/10/2026 · **Trạng thái:** hợp đồng đề xuất để Hải duyệt, chưa phải phân công.

Đọc [kiến trúc](../KIEN_TRUC_MAJORWEAVE.md) → [contracts.ts](contracts.ts) → [backend.example.ts](backend.example.ts). Các file ví dụ ở `docs/architecture` không được app import; chỉ chuyển sang `src` sau khi Hải duyệt và có bộ khung chung.

## 1. Mẫu đang có và việc còn phải làm

`backend.example.ts` chuyển dữ liệu từ `src/data.ts` sang hợp đồng mới: **ba nhánh, 15 chặng mỗi nhánh, 35 chặng sau khi dùng chung phần giống nhau, 40 nguồn, 8 mục tiêu chứng nhận**. Không tải hoặc biên soạn lại khóa học từ Internet trong lần chuyển này.

- OOP/DSA, SQL/xác thực/triển khai theo ngữ cảnh có ID riêng. Git/mạng/OS/HTTP chung chỉ khai báo một lần.
- `legacyStageMap` và `legacyWorkMap` cho biết ID cũ tương ứng với ID nội dung mới; đây chưa phải chương trình migrate workspace người dùng.
- Ngày `2026-10-03` kế thừa mốc chung trong `src/data.ts`, không khẳng định từng trang vừa được kiểm tra ngày 04/10. Cần rà từng nguồn khi hoàn thiện release.
- `reviewStatus='review'` có chủ đích: mẫu kiểm tra cấu trúc, không tự phong đã duyệt.
- Tiên quyết trong mẫu được đề xuất từ chuỗi học; cần review nghiệp vụ. Acceptance của từng bài hiện kế thừa đầu ra chặng; cần viết tiêu chí cụ thể hơn khi hoàn thiện nội dung.
- Giữ ID legacy-work ổn định sau khi sử dụng; không đổi chỉ vì sắp xếp lại mảng. Với bài mới, dùng ID có ý nghĩa như `backend.python.api.validate-request`.

Đây là mẫu định dạng đầy đủ cho Backend, không phải thông báo toàn bộ 18 hướng đã hoàn tất.

## 2. Gói nội dung cho một hướng

Mỗi hướng có một `ContentPack` và các nhánh `LearningTrack`. Không tạo một app/component riêng cho mỗi hướng. Ví dụ Backend có ba track; UX có track research/product; BA có software/data. UI chọn nhánh đọc label từ dữ liệu.

| Trường | Cần cung cấp |
|---|---|
| `schemaVersion` | `1`; đổi cấu trúc phải review hợp đồng |
| `contentVersion` | Mốc biên soạn/phát hành, độc lập schema và revision dữ liệu sinh viên |
| `pathId` | ID trong catalog đã duyệt |
| `reviewStatus` | draft → review → ready sau người review kiểm tra |
| `stages` | Chặng riêng của hướng; chặng chung thực sự đặt trong shared registry khi tích hợp |
| `resources` | Nguồn có tác giả/provider, URL trực tiếp, ngôn ngữ tài liệu, chi phí và điều kiện truy cập |
| `credentials` | Chương trình bổ trợ có trang chính thức và điều kiện rõ; không phải chứng chỉ MajorWeave cấp |
| `tracks` | Thứ tự các chặng, nguồn roadmap, credential áp dụng và portfolio đầu ra |

Không gộp toàn bộ dữ liệu mọi hướng vào `content/index.ts`. File ấy chỉ import/ghép registry. Nếu nhiều gói tham chiếu chặng chung, chỉ có một định nghĩa được import; ID trùng với nội dung khác là lỗi.

## 3. Chặng và bài thực hành

Một chặng cần mục tiêu, đầu ra, tiên quyết, ít nhất một nguồn chính phù hợp và các bài có kết quả kiểm tra được. Chặng mở rộng có `optional=true`; không tự bỏ tiên quyết khi sinh viên chọn nhánh nâng cao.

Ví dụ một bài Backend tốt:

```ts
{
  id: 'backend.python.api.validate-request',
  revision: 1,
  title: 'Thêm kiểm tra dữ liệu khi tạo công việc bằng FastAPI',
  minutes: 90,
  acceptance: [
    'Request hợp lệ tạo được công việc và trả response đúng.',
    'Request thiếu tiêu đề bị từ chối với thông báo có thể hiểu.',
    'Có kiểm thử cho hai trường hợp trên.'
  ]
}
```

Đó là bài trong roadmap học **Python**, không phải yêu cầu website MajorWeave phải chạy FastAPI. Bài QA có thể tạo bộ test case; UX tạo nghiên cứu/prototype; BA tạo user story/process model. Không thay tất cả bằng “Đọc tài liệu” và “Làm dự án nhỏ” giống hệt nhau.

- Bài không yêu cầu code vẫn cần acceptance quan sát được.
- Tăng `work.revision` khi đổi yêu cầu hoặc lượng công việc; không mang dấu hoàn thành cũ sang một bài đã đổi nghĩa.
- Ước lượng cho bài được chọn, không lấy thời lượng hoàn thành toàn bộ khóa làm quỹ giờ tuần.
- Bài dài có điểm dừng có ích để chia thành các đoạn tối đa 120 phút. Mức này bằng quỹ giờ tuần nhỏ nhất và không chia lại bài Backend cũ khi chuyển dữ liệu. ID đoạn theo khoảng phút giữ ổn định khi đổi quỹ giờ tuần.
- Cần đọc lại tất cả bài theo từng nhánh để tránh Java vào Python hoặc engine không đúng với track.

## 4. Nguồn học: tìm theo chủ đề, không giới hạn hai website

1. Dùng roadmap.sh hoặc khung chính thức BA để kiểm tra chủ đề.
2. Tìm tài liệu chính thức, khóa đại học mở, bài tập/lab và khóa có người cung cấp rõ ràng.
3. Mở URL nguồn, kiểm tra có đúng nội dung, còn truy cập được và cần điều kiện gì. Kết quả AI/search snippet không thay thế bước này.
4. Tóm tắt khác biệt, trình độ, ngôn ngữ, hình thức, chi phí và thiết bị cần dùng.
5. Ghi ngày kiểm tra từng nguồn; nguồn chưa kiểm tra có `checkedAt=null`, gói chưa được đánh dấu ready.
6. Có nguồn thay thế hữu ích thì thêm; tránh nhiều link trùng hoặc link trang chủ không đến bài/chủ đề cần học.

Nguồn nên đa dạng phù hợp chủ đề: MDN, tài liệu ngôn ngữ/framework, MIT/Stanford/Harvard/Helsinki, F8, freeCodeCamp, W3Schools, The Odin Project, bài tập/lab của nhà cung cấp. Đây là các nhóm nguồn để khảo sát, không phải tuyên bố mọi khóa hoặc chứng nhận trong đó miễn phí/phù hợp mọi hướng.

`cost`: free = phần học được giới thiệu miễn phí; mixed = có phần miễn phí và phần cần trả tiền/thuê dịch vụ; paid = phần học được giới thiệu trả phí; unknown = chưa xác minh. Trang giới thiệu đọc được không đồng nghĩa toàn khóa miễn phí. `accessNote` nói rõ điều kiện. Không dùng language Việt/Anh để biểu diễn Java/Python.

Nguồn đã lưu trong plan là snapshot. Danh mục mới ngừng cung cấp một URL cần hiển thị lưu ý/chọn lại, không tự xóa công việc cũ.

## 5. Chứng nhận và portfolio

| `kind` | Nội dung |
|---|---|
| `course_certificate` | Chứng nhận hoàn thành một khóa theo yêu cầu nhà cung cấp |
| `program_certificate` | Hoàn thành một chương trình/cụm nội dung có yêu cầu riêng |
| `exam_certificate` | Chứng chỉ nghề nghiệp qua kỳ thi; ghi điều kiện và phí |
| `skill_assessment` | Đánh giá kỹ năng/thực hành theo chương trình nhà cung cấp |

- Chỉ thêm từ trang chính thức; ghi prerequisites, requirements và ngày kiểm tra.
- Phí chưa xác minh dùng unknown + dẫn trang chính thức; không tự coi không có giá trên trang là miễn phí.
- Không gắn chứng chỉ cloud làm bước đầu bắt buộc cho mọi sinh viên Backend.
- Không đưa một chứng chỉ vào mọi track chỉ để tab có số lượng lớn.
- Nếu không có chương trình chứng nhận phù hợp, ghi lý do biên soạn và vẫn có portfolio với tiêu chí đầu ra. Không dùng trạng thái “chưa biên soạn” để kết luận hướng không có chứng chỉ.
- Dữ liệu thực về chứng nhận BA và các hướng mới cần người phụ trách xác minh; file mẫu hiện chưa bổ sung những nội dung ấy.

## 6. Dùng chung giữa các hướng / Full-stack

Ví dụ React + Python:

```text
frontend.react.stageIds
  + backend.python.stageIds
  + fullstack.react-python.integrationStageIds
  → bỏ ID lặp → kiểm tra tiên quyết → thứ tự hợp lệ → lịch chung
```

JavaScript của FE và Python của BE là hai chặng khác nhau, đều cần học nếu sinh viên chưa biết. Git thật sự giống nhau có thể dùng một lần. Cùng chủ đề SQL nhưng bài nối ORM khác nhau thì dùng ID/bài theo nhánh, không khử trùng chỉ bằng tên.

Các cấu hình Full-stack được tạo từ danh mục ba FE × ba BE và một builder dùng chung; vẫn phải kiểm tra cả chín kết hợp. SRE/ML/MLOps/các nhánh nâng cao dùng phần nền tảng phù hợp, không có quy tắc bỏ nền tảng tự động.

## 7. Hợp đồng persistence và validation

`loadWorkspace()` trả `OperationResult<Workspace>`. Chưa có dữ liệu → workspace rỗng hợp lệ; dữ liệu hỏng → lỗi có thông báo, không ghi defaults lên bản hỏng.

`saveWorkspace(next, expectedRevision)` kiểm tra trước ghi; revision của bản chưa lưu không tự tăng ở UI. Đọc revision/ghi trong một transaction; trả workspace với revision đã tăng sau complete. Bản mới bắt đầu revision 0 và lần lưu đầu trả revision 1.

Runtime validator phải kiểm tra:

- `schemaVersion`, loại dữ liệu, enum, UUID người dùng và ID nội dung; không tin object vì có chữ `Workspace`.
- Ngày thực tế, số giờ 2–20, số phút nguyên dương, tuần nguyên không âm, ngày null hoặc 0–6.
- ID không trùng trong từng collection; `activePlanId` tồn tại hoặc null; plan/track/draft khớp catalog khi cần tạo lại.
- Nhánh/contentVersion của plan khớp generation hiện hành; mỗi generation trong history giữ nhánh và lựa chọn lúc tạo, không bị sửa theo draft mới.
- `resourceByStage` thuộc chặng/nhánh; tiên quyết không vòng lặp và không bị thiếu.
- Task done phải có completion chưa revert; task todo/skipped không có completion hiện hành. Task chuyển/giữ qua generation có thể lặp trong snapshot, nhưng sổ completions không nhân bản.
- Completion phải liên hệ một task trong current/history/tuần chốt; timestamp và localDate thiếu đồng thời cho dữ liệu legacy, không tự điền ngày hôm nay.
- Closed week không trùng index trong generation; số done/tổng/phút khớp snapshot trước khi dời việc.
- URL được phân tích bằng `URL`, chặn protocol thực thi code; text người dùng hiển thị qua React, không chèn raw HTML.

Không có factory/repository server giả cho auth sau này. Chỉ có module persistence tập trung; khi chọn backend thật, thêm chức năng online vào ranh giới đó sau review.

## 8. Cách kiểm tra mẫu trên máy

Sau `npm install` ở thư mục repo:

```powershell
node docs/architecture/check-example.mjs
npx --no-install tsc --strict --noEmit --target es2022 --module esnext --moduleResolution bundler --skipLibCheck docs/architecture/contracts.ts docs/architecture/backend.example.ts
```

Kết quả đã chạy ngày 04/10/2026: cả hai lệnh pass. Script kiểm tra ba nhánh, thứ tự/tiên quyết không vòng, ID duy nhất, nguồn áp dụng đúng, default source tồn tại, phút/acceptance và legacy maps. Phân tích URL chỉ xác nhận cấu trúc/protocol; không xác nhận URL còn hoạt động hoặc phí/điều kiện chứng nhận.

Khi triển khai, bổ sung kiểm tra planner, IndexedDB/migration/import và giao diện theo [mục 9 của kiến trúc](../KIEN_TRUC_MAJORWEAVE.md#9-luồng-cần-mở-rộng-và-tiêu-chí-kiểm-tra). Không ghi Pass cho các chức năng chưa chạy.
