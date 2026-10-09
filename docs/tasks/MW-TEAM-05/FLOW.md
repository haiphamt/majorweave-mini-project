# MW-TEAM-05 — luồng chi tiết

Ngày cập nhật: 09/10/2026. Các bước UI là hợp đồng bàn giao cho Hải; không coi mô tả này là bằng chứng app chính đã tích hợp. Mã TC-01…15 tương ứng bảng load/save trong [QA log](QA_AI_LOG.md); các nhóm unit/native khác được ánh xạ trong bảng coverage ở cùng file.

## FL-MW-TEAM-05-01 — Load workspace

- Story: US-05-L01: Người học mở lại dữ liệu đã lưu mà không bị thay bằng mặc định.
- Acceptance: AC-01.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: App/controller gọi load; adapter sẵn có và có validator được truyền vào.
- Đầu vào: Tên DB/store/key theo hợp đồng; dữ liệu ngoài phải qua validator.
- Sau thành công: Workspace hợp lệ hoặc lỗi rõ; load không ghi defaults.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Mở app | Hiện loading | Mở DB và đọc key local | Disk không đổi |
| S2 | Đợi kết quả | Hiện workspace hoặc empty | Kiểm version/schema/validator | Không có bản ghi → workspace rỗng |
| S3 | Xem lỗi nếu có | Hiện lỗi và cách xử lý | Trả error; giữ nguồn hỏng | Không reset DB |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| E1 | S1 | Blocked/version mới/thiếu store | Trả mã lỗi, không reset; UI hướng dẫn đóng tab cản khi cần | Disk giữ nguyên | TC-09/10/14 |
| E2 | S2 | Dữ liệu hỏng hoặc validator throw | Trả lỗi, không defaults | Raw giữ nguyên | TC-05/06/08 |
| C1 | S1–S2 | Người dùng rời màn hình | UI không dùng kết quả cho màn hình đã rời; adapter không có API hủy load | Không có ghi | UI chưa chạy |

## FL-MW-TEAM-05-02 — Save và retry

- Story: US-05-L02: Người học biết dữ liệu đã lưu thật và giữ bản đang sửa khi lưu lỗi.
- Acceptance: AC-02.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: Controller có workspace hợp lệ và expectedRevision; không có save đang chờ.
- Đầu vào: Candidate và expectedRevision nguyên không âm, cùng revision.
- Sau thành công: Disk tăng một revision sau transaction complete; input không bị sửa.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Lưu chỉnh sửa | Hiện pending; chặn submit kép | Validate candidate trước ghi | Bản chưa lưu còn trong bộ nhớ |
| S2 | Đợi | Chưa báo success | Trong một readwrite transaction: đọc, so revision, put | Chưa coi put.success là commit |
| S3 | Đợi complete | Hiện đã lưu | Resolve success sau transaction.complete | Disk chứa revision mới |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| A1 | S3 | Lưu thất bại và muốn retry | Dùng lại đề xuất/IDs; so revision hiện tại | Giữ bản chưa lưu | Controller memory và native retry |
| E1 | S2 | Abort/quota | Trả storage error; rollback; UI cho retry/xuất | Disk/input giữ nguyên | TC-12/13; quota injection |
| E2 | S2 | Revision stale | Chuyển FL-03 | Không ghi đè disk | TC-03/04 |
| C1 | S2 | Muốn hủy khi commit đang chạy | Không cung cấp cancel transaction; không hứa rollback | Đợi kết quả thật | Pending unit tests |

## FL-MW-TEAM-05-03 — Conflict hai tab

- Story: US-05-L03: Người học giữ bản chưa lưu khi tab khác đã cập nhật kế hoạch.
- Acceptance: AC-03.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: A và B đã đọc cùng revision; A lưu trước và hoàn tất.
- Đầu vào: Candidate của B và revision cũ; nguồn export phải là snapshot B.
- Sau thành công: B nhận conflict, disk A không đổi; B tự chọn tải mới hoặc xuất.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Lưu ở A | A hiện success sau complete | Ghi revision r+1 | Disk giữ bản A |
| S2 | Lưu ở B | B hiện conflict | So revision trong transaction; từ chối ghi | Candidate B giữ nguyên |
| S3 | Chọn xử lý | Cho xuất bản chưa lưu hoặc tải mới | Export không ghi; tải mới chỉ đọc | Không tự rebase/overwrite |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| A1 | S3 | Xuất trước khi tải mới | FL-05; ghi rõ bản chưa lưu | Giữ proposal để xuất | Backup unit export proposal |
| A2 | S3 | Bỏ bản chưa lưu rồi tải mới | UI phải xác nhận bỏ trước; đọc workspace mới | Không ghi lại bản stale | Context native; UI cuối chưa chạy |
| E1 | S3 | Load/export lỗi | Giữ proposal và hiện lỗi | Disk không đổi | Unit validator/storage tests |
| C1 | S3 | Hủy lựa chọn bỏ bản chưa lưu | Giữ bản B | Không ghi | Context preview/cancel |

## FL-MW-TEAM-05-04 — Migration v1

- Story: US-05-M01: Người học chuyển bản cũ sau khi xem cảnh báo, giữ nguồn và tránh nhập trùng.
- Acceptance: AC-04.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: Controller có readLegacy, persistence, validate và clock/timezone/UUID; không pending.
- Đầu vào: Raw v1, metadata/lựa chọn nhập rõ; mode append nếu thiết bị đã có dữ liệu.
- Sau thành công: Plan và fingerprint được lưu cùng revision; nguồn v1 giữ nguyên.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Yêu cầu chuyển v1 | Hiện preview/cảnh báo | Read raw → schema → fingerprint → maps → validate | Prepare chỉ đọc; candidate riêng |
| S2 | Chọn metadata/cách nhập | Hiện blocking issues và thay đổi dự kiến | Giữ plan/draft riêng; không tự bỏ unknown hoặc dựng defaults | Ticket mới vô hiệu ticket cũ |
| S3 | Xác nhận | Pending; chưa báo success | Đọc lại nguồn/workspace, kiểm fingerprint/revision rồi save | Không nhận candidate do caller sửa |
| S4 | Đợi kết quả | Hiện success và trạng thái nguồn sau commit | Plan + marker cùng save; đọc lại source state | Không xóa key v1 |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| A1 | S3 | Fingerprint đã nhập | Trả workspace hiện có; không nhập lần hai | Không save thêm | Migration unit + native repeat |
| E1 | S1–S2 | Schema/metadata/unknown/prerequisite lỗi | Chặn; yêu cầu lựa chọn rõ hoặc giữ raw để xử lý | Không ghi | Source/preview unit |
| E2 | S3 | Nguồn đổi, save lỗi hoặc conflict | Chặn hoặc giữ proposal; retry/preview lại tùy lỗi | Không ghi đè; IDs giữ khi retry | Migration controller + native |
| E3 | S4 | Nguồn đổi/không đọc được sau commit | Báo changed/unreadable; giữ sourceRaw; không giả rollback | Workspace đã commit còn nguyên | Controller memory post-commit tests |
| C1 | S2 | Hủy preview | Vô hiệu ticket, không save; pending thì từ chối cancel | Nguồn/disk giữ nguyên | Migration native cancel |

## FL-MW-TEAM-05-05 — Export backup

- Story: US-05-B01: Người học xuất snapshot đang có, kể cả bản chưa lưu, để tự giữ bản sao.
- Acceptance: AC-05.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: Caller cung cấp snapshot, thời điểm và unsaved flag; có workspace/backup validators.
- Đầu vào: Snapshot hiện tại hoặc proposal sau lỗi; label chưa lưu phải rõ.
- Sau thành công: JSON envelope format/version đúng; export không ghi DB.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Chọn xuất | Cho biết đang xuất bản đã/chưa lưu | Validate snapshot và envelope | Snapshot không bị sửa |
| S2 | Chọn tải file | Tạo JSON và tên/nhãn tương ứng | Serialize; trả containsUnsavedChanges cho caller | Không load/save storage |
| S3 | Lưu file trên thiết bị | UI chỉ thông báo theo khả năng tải thực | Module chỉ tạo JSON, không xác nhận hộp thoại tải | Không đổi revision |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| A1 | S1 | Có proposal chưa lưu | Xuất chính proposal và ghi nhãn | Bản chưa lưu còn nguyên | Backup unit + native export |
| E1 | S1–S2 | Validator/clock/serialization lỗi | Không tạo defaults; giữ snapshot | Disk không đổi | Backup unit invalid export |
| C1 | S3 | Hủy hộp thoại tải | Không tuyên bố đã tải thành công | Không ghi DB | UI download cancel chưa chạy |

## FL-MW-TEAM-05-06 — Import backup

- Story: US-05-B02: Người học xem trước file nhập và chọn skip/copy, giữ dữ liệu thiết bị.
- Acceptance: AC-05.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: File JSON và current workspace; có validators và nextId; không pending.
- Đầu vào: Format/version, workspace và lựa chọn nhập hợp lệ; mặc định giữ profile/preferences/drafts/goals.
- Sau thành công: Nhập bằng revision thiết bị; copy remap đầy đủ; success sau complete.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Chọn file | Hiện lỗi hoặc summary | Parse/validate; load thiết bị | Không ghi |
| S2 | Chọn skip/copy và dữ liệu phụ | Preview plans/collision/profile/drafts | Candidate riêng; copy user IDs và relations, giữ content IDs | Không dùng revision file để ghi |
| S3 | Xác nhận | Pending, chặn submit kép | Kiểm lại workspace/revision/validator; save qua adapter | Caller tamper không đổi candidate riêng |
| S4 | Đợi complete | Hiện thành công | Trả workspace đã lưu | Existing active/profile giữ theo choices |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| A1 | S2–S3 | Tất cả duplicate skip, không có thay đổi khác | Trả workspace hiện tại | Không save/tăng revision | Backup unit + native skip |
| E1 | S1–S2 | JSON/version/ID/remap/validator lỗi | Từ chối và giữ file | Disk giữ nguyên | Backup unit invalid/copy tests |
| E2 | S3 | Save lỗi/conflict | Giữ proposal/IDs để retry hoặc xuất; không ghi đè | Bản thiết bị giữ nguyên | Backup unit + native injected failure/conflict |
| C1 | S2 | Hủy preview | Vô hiệu ticket; không ghi; pending chặn cancel | Thiết bị/file giữ nguyên | Backup native cancel |

## FL-MW-TEAM-05-07 — Chọn nội dung và tạo kế hoạch

- Story: US-05-C01: Người học chọn track phù hợp và thấy nguồn/điều kiện lab trước khi tạo lịch.
- Acceptance: AC-06.
- Actor: sinh viên; caller là Context/UI chung, trang QA chỉ mô phỏng phần đã ghi rõ.
- Điều kiện trước: Registry có backend nền tảng và đủ bốn pack; preview isolated có registry riêng trong trang QA.
- Đầu vào: Track, selected/known stages, nguồn áp dụng và quỹ giờ hợp lệ.
- Sau thành công: Planner giữ tổng phút, tiên quyết và source; preview không đổi plan đang dùng.
- Khi lỗi/hủy: giữ nguồn, disk và proposal theo từng nhánh; không reset defaults.

| Bước | Người dùng | UI/caller | Domain / persistence | Dữ liệu |
| --- | --- | --- | --- | --- |
| S1 | Chọn một trong mười track | Hiện chặng, nguồn, portfolio và điều kiện lab | Resolve đủ references/prerequisites | Không đổi active plan |
| S2 | Đổi nguồn/quỹ giờ | Hiện lựa chọn phù hợp | Kiểm source applicability và prerequisite | Không tự đánh dấu đã biết |
| S3 | Tạo preview | Hiện tuần/đoạn việc | Planner giữ tổng phút và giới hạn giờ | Preview không ghi DB |
| S4 | Xác nhận trên app sau tích hợp | Callback chung tạo/lưu plan | Sau complete mới kích hoạt; UI hoàn thành/reload | Bước app chính còn nghiệm thu |

### Thay thế, lỗi và hủy

| Mã | Từ bước | Điều kiện | Xử lý | Trạng thái dữ liệu | Kiểm thử |
| --- | --- | --- | --- | --- | --- |
| E1 | S1–S3 | Reference/source/prerequisite lỗi | Từ chối; không sinh lịch một phần | Không ghi | 26 content unit checks |
| C1 | S3 | Hủy/khám phá track khác | Giữ plan/draft hiện hành theo Context | Không ghi từ preview | Context tests; content UI cuối chưa chạy |
| A1 | S4 | Chạy harness QA riêng | Native generate/save/completion fixture/reload/export | DB QA riêng từng track | 10/10 native content PASS; chưa phải callback progress |

