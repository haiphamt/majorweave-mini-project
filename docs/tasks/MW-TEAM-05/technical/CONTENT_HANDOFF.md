# MW-TEAM-05 — bàn giao 10 track nội dung

## Phạm vi và trạng thái

Bốn pack `devopsPack`, `networkPack`, `securityPack`, `qaPack` có `reviewStatus=review`, không tự chuyển ready. Chưa thêm vào registry/app chính; chỉ Hải tích hợp `src/content/index.ts` và UI. Giữ sidebar/CSS hiện có.

| Pack | Track | Chặng riêng trong pack | Nguồn mới | Bài thực hành riêng |
| --- | --- | ---: | ---: | ---: |
| devops | devops.devops, devops.sre | 13 | 12 | 26 |
| network | network.network, network.automation | 10 | 10 | 20 |
| security | security.soc, security.appsec, security.devsecops | 11 | 10 | 22 |
| qa | qa.manual, qa.playwright, qa.postman | 12 | 10 | 24 |
| Tổng | 10 track | 46 | 42 | 92 |

Track tham chiếu nền tảng `cs.git`, `cs.networking`, `cs.os-linux`, `web.http` và `language.python`/`language.javascript` khi phù hợp. Định nghĩa/nguồn nằm trong backendPack hiện hành, không chép lại sang pack mới. Hai DevOps track dùng một tập chặng chung; DevSecOps dùng lại chặng automation/container/CI của devopsPack. Khi integrate cần đủ bốn pack và pack chứa nền tảng; không chỉ đăng ký securityPack riêng rồi bỏ tiên quyết bị thiếu.

Các ID là đề xuất ổn định cho review, không âm thầm đổi ID đã lưu trong plan sau nghiệm thu. Khi Hải chuyển core stages sang shared registry, cần giữ ID và kiểm tra lại mọi track. Không dùng checkedAt cũ của backendPack làm bằng chứng đã mở lại nguồn hôm nay.

## Thiết kế bài học

Bài riêng có ước lượng 60–120 phút và acceptance quan sát được; không lấy thời lượng toàn khóa làm quỹ giờ tuần. Tài liệu nguồn là tham khảo; bài tập, ưu tiên và tiên quyết do Codex đề xuất cho nhóm review, không sao chép chương trình chứng nhận thành lời hứa đạt chứng chỉ.

- DevOps/AWS: script/process → container → CI → IAM/IaC → release/rollback → metrics; Kubernetes local là mở rộng. Không có ngân sách AWS thì nộp template/review offline có nhãn, không nhận đã deploy AWS.
- SRE: giữ nền tảng/container/CI; thêm SLI/SLO, cảnh báo, incident/postmortem, capacity và recovery. Không chỉ vài link sách.
- Network: subnet/IPv6, bridge/VLAN, static/OSPF, DNS và capture. Automation giữ phần mạng này rồi thêm Python inventory, readonly SSH, playbook/idempotence/rollback. Không giả simulator hỗ trợ SSH ngoài host.
- SOC: threat model, log/provenance, SIEM/query, detection fixture và triage. Wazuh yêu cầu tài nguyên được ghi; offline fixture là chế độ học có nhãn, không thay nghiệm thu SIEM đã cài thật.
- AppSec: target local, finding, ma trận quyền/session, patch và retest. DevSecOps giữ container/CI rồi SAST/dependency/secret gates, không bỏ nền tảng.
- QA: test scope/risk/design là chung. Manual có thực thi/bug/accessibility/regression; Playwright có isolation/locators/trace/CI; Postman có API contract/dataset/cleanup/Newman/CI.

Mỗi track có portfolio riêng và ba tiêu chí đầu ra. Credential là mục tiêu tùy chọn, không do MajorWeave cấp. Chi phí/điều kiện và lựa chọn không thêm credential được ghi trong [inventory nguồn](CONTENT_SOURCE_INVENTORY.md). Không thêm Postman Student Expert đã đóng nhận mới hoặc hứa ISC2 CC đang miễn phí cho đăng ký mới.

## Luồng học và acceptance

US-05-C01: Người học chọn một trong 10 track được giao để có nền tảng và bài thực hành phù hợp, nhìn thấy điều kiện lab/chi phí trước khi chọn nguồn.

FL-05-C01: Chọn track → resolve đủ nền tảng/tiên quyết → xem chặng/nguồn/portfolio → đổi nguồn hợp lệ → chọn quỹ giờ 2–20 → tạo preview → xác nhận qua controller app sau tích hợp. Khám phá không tự đổi plan hiện hành. Thiếu nguồn/tiên quyết trả lỗi, không sinh một phần hoặc tự đánh dấu đã biết.

AC: Track được resolve đủ theo thứ tự; ID không trùng; tổng phút giữ nguyên; tuần không quá quỹ giờ; source snapshot thuộc chặng; lựa chọn chưa biết không được tự thêm known. Test Node đã kiểm; flow UI app chính chưa nghiệm thu.

## Kiểm tra đã chạy

Ngày 09/10/2026, actor Codex trên bản bàn giao chưa có SHA Git người làm:

- `node scripts/tasks/MW-TEAM-05.mjs`: **91 PASS / 0 FAIL**. Giữ 65 test source/migration/backup, thêm 26 kiểm tra nội dung.
- 4 pack/10 track đúng scope; ID stage/resource/credential/work duy nhất trong registry isolated gồm backendPack + 4 pack mới.
- Nội dung work/source/portfolio/credential có fields; 42 URL mới không trùng và có protocol an toàn. Check URL shape không chứng minh lab đã chạy; mở nguồn có inventory riêng.
- Mười track resolve giữ nền tảng/tiên quyết; planner chạy 2h và 20h/tuần, đổi sang nguồn cuối của từng chặng, giữ tổng phút, UUID, tuần và source snapshot. Thiếu prerequisite bị chặn.
- TypeScript strict cho bốn pack và trang preview: PASS.
- Mười kiểm tra tương thích với validator semantic từ ZIP MW-TEAM-04 do người làm cung cấp: generated workspace + một completion fixture trên mỗi track PASS. Không chép validator/contract và không gọi đây là nghiệm thu toàn bộ validator hay UI progress.
- Ngày 09/10/2026, người làm chạy trên Chrome: 10 PASS / 0 FAIL qua native IndexedDB. Mỗi track đã tạo plan, lưu, ghi completion fixture, reload và export/parse. Chưa nghiệm thu callback progress/Context hoặc toàn hành trình app chính.

Script dùng resolver/planner hiện có trên nhánh Context của người làm. File chung dùng để kiểm tra local không nằm trong gói bàn giao. Không đổi registry/check/CI để làm test pass. Check chung chưa đăng ký 4 pack sẽ không bao phủ nội dung như test task isolated.

Hướng dẫn chạy: [README của task](../README.md#chạy-kiểm-tra).

## Reviewer và tích hợp còn lại

Hữu Hiếu review chéo nội dung/nguồn/validator và Hải chốt core ID/registry/callback. Biên soạn đủ không đồng nghĩa đã hoàn tất mọi lab/khóa hoặc đủ chuẩn nghề nghiệp. Reviewer cần đánh giá mức khó, thời lượng, nguồn thay thế, credential và điều kiện lab của từng nhánh.

Sau Hải tích hợp: trên app chính chạy đủ 10 cấu hình chọn → đổi nguồn → tạo plan → hoàn thành bằng callback thật → reload; kiểm draft/plan độc lập, cancel/error/loading, bàn phím/mobile và storage lỗi. Ghi Pass/Fail/Not run thật, không dùng harness isolated thay nghiệm thu này.

MW-TEAM-05 còn ghép semantic/UI cho migration/backup, QA lỗi native/hai tab liên quan, tài liệu tổng hợp và nghiệm thu cuối. TASK/FLOW/QA_AI_LOG đã đồng bộ trong đợt dọn tài liệu; SHA/PR nội dung cuối và kết quả tích hợp còn cần bổ sung. Chưa đánh Done.
