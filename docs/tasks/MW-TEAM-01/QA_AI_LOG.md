# QA và AI log — MW-TEAM-01

Người bàn giao: Nguyễn Thị Quỳnh Hân (QuynhHan486). Ngày kiểm tra lại: 08/10/2026.
PR: https://github.com/haiphamt/majorweave-mini-project/pull/5

## Kết quả thực tế

Môi trường: Windows, Node 24.21.0, React/Vite của repo, trình duyệt Codex riêng tại http://127.0.0.1:5173. Không xóa dữ liệu/profile người dùng. CI sử dụng Node 22.

| Test | Steps / expected | Actual / bằng chứng |
|---|---|---|
| TC-01 Catalog | Chọn lần lượt 12 ngành trong 6 khoa; đổi khoa khám phá giữ ngành hồ sơ | PASS 12/12; evidence/ui-other-20261008.json. Catalog UI và JSON sinh tự động có 18 hướng |
| TC-02 Resolver | ID thiếu, stage/resource/credential thiếu, ID trùng, default sai, prerequisite thiếu/vòng/đảo thứ tự, path sai phải trả lỗi | PASS; scripts/tasks/MW-TEAM-01.mjs. Kiểm tra thêm bản trả về độc lập input và version theo pack phụ thuộc |
| TC-03 Ma trận Full-stack | Đúng một FE + một BE; nguồn tích hợp chung; chứng nhận React/Node không áp cho Angular/Vue/Java | PASS 9/9; task script kiểm tra từng cặp, không chỉ đếm track |
| TC-04 Hủy và lọc nguồn | Angular HTML chọn freeCodeCamp rồi Hủy; mở lại vẫn MDN. Lọc vi rỗng rồi nới lọc giữ nguồn | PASS trên UI. Sau Áp dụng và lưu, reload và My roadmap giữ freeCodeCamp |
| TC-05 End-to-end | Mỗi nhánh: chọn, đổi nguồn, lưu, tạo plan, hoàn thành một việc, reload giữ plan/tiến độ | PASS 17/17 trên app, evidence/ui-17-tracks-20261008.json. 17 plan độc lập; Angular đầu tiên còn completion sau 16 luồng tiếp theo |
| TC-06 Bookmark | Lưu Google UX, reload, mở Profile | PASS; mục tiêu đã lưu xuất hiện trong Profile; controller test thêm bỏ lưu |
| TC-07 Lỗi lưu | Giả lập quota khi savePlan: không đổi bản đã lưu, giữ candidate, retry đúng một lần; stale plan/conflict bị từ chối | PASS ở controller tests; chưa giả lập quota IndexedDB bằng UI. Không ghi test UI lỗi lưu là Pass |
| TC-08 Empty/error | Tìm chuỗi không khớp: 0 card và nút xóa bộ lọc trả 18; track không tồn tại hiển thị lỗi rõ | PASS UI; roadmap?track=invalid.branch không sinh kế hoạch Backend thay thế |
| TC-09 Bàn phím/mobile | Enter chọn tab/mở drawer; Escape hủy. Viewport 390×844, không tràn ngang | PASS UI; clientWidth=scrollWidth=375 (trừ scrollbar), ảnh mobile-ux-sources-20261008.jpg |
| TC-10 Học liệu | Mở HTTP URL nguồn/chứng nhận; đối chiếu provider/chủ đề/chi phí/điều kiện thay vì suy ra từ HTTPS | 109/109 URL trả 200 trong lượt cuối. Sửa tám URL lỗi và trang SUS chuyển sang trang tổng quan. Có giới hạn HTTP nêu bên dưới |

## Lệnh đã chạy

- npm run check: PASS, 6 pack đăng ký, 40 module, legacy save guard, backend legacy maps, 16 context tests và toàn bộ test MW-TEAM-01.
- npm run build: PASS TypeScript và Vite; catalog sinh 12 ngành / 18 hướng.
- node scripts/tasks/MW-TEAM-02.mjs: PASS 69 case planner của dependency.
- node scripts/tasks/MW-TEAM-01-sources.mjs: 109 URL reachable; evidence/source-http-audit-20261008.json.
- Console trình duyệt sau thử: không có error/warn.

## Nội dung và nguồn

Thay nguồn React bị 404 bằng bài Tic-Tac-Toe chính thức, React Router bằng guide hiện hành, Web Vitals bằng bài vitals; sửa User flow, Smart Animate, Design systems và case study UX. Trang usability.gov cũ trả 200 nhưng chuyển sang trang tổng quan nên thay bằng bài đo khả dụng NN/G.

Refactoring UI là sản phẩm có phí; không hiển thị miễn phí. Chín cặp Full-stack dùng MDN Fetch + CORS và OWASP REST Security chung; không lấy bài JWT Java làm default cho Python/Node. Full Stack Open/chứng nhận chỉ gắn React + Node; IBM là bổ trợ React/Node/Python, không xác nhận FastAPI. Các cặp khác dùng chứng nhận nền HTML/CSS/JS và portfolio đúng cặp, không bịa chứng nhận riêng.

Ngày nguồn kế thừa Backend giữ nguyên lịch sử 03/10, nguồn bổ sung 06/10; audit HTTP mới không tự thay ngày kiểm tra nội dung của người biên soạn. Ngày 08/10 áp dụng cho metadata FE/FS/UX được sửa và đối chiếu. Status 200 không chứng minh hoàn thành khóa, giá cố định, nội dung sau đăng nhập hay điều kiện cấp chứng nhận. Không đăng ký/mua khóa để kiểm thử; điều kiện hiện hành tại nhà cung cấp là nguồn cuối cùng. Các gói vẫn review chờ Hải nghiệm thu.

## AI log thực tế của lượt sửa

1. Codex rà clone và PR: phát hiện UI v1 chỉ sinh Backend, nguồn/branch FE chưa lưu, thiếu resolver error cases và test checkedAt áp sai cho nguồn bổ sung.
2. Tái dùng context/planner/progress từ các nhánh team hiện có, nối app vào một workspace chung. Giữ kho v1, không reset/migration phá dữ liệu. Thêm callback lưu plan và bookmark; success chỉ sau persistence.
3. Thêm test malformed content, 9 cặp FE/BE và 17 vòng source/create/complete/reload; test bắt lỗi chứng nhận Full Stack Open vẫn bị gắn tất cả cặp. Sửa builder rồi chạy lại.
4. Mở nguồn chính thức, sửa URL/metadata, kiểm thử UI thật toàn bộ 17 nhánh, 12 ngành, hủy, empty, mobile, keyboard và bookmark.
5. Ghi evidence, SHA và PR. Không xác nhận các log model hoặc Pass lịch sử trong clone nếu thiếu bằng chứng. So sánh hai công cụ AI là hoạt động chung của nhóm, chưa được thực hiện trong lượt này.

Xem COMPLETION_20261008.md để biết SHA chính xác và phạm vi cần Hải review.