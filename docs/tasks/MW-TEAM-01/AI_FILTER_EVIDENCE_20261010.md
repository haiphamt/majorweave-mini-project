# So sánh Antigravity và Codex — bộ lọc nguồn

**Người thực hiện:** Nguyễn Thị Quỳnh Hân · **Task:** MW-TEAM-01 · **Ngày:** 10/10/2026.

**Căn cứ:** [Phân công nhóm §6](../../team/PHAN_CONG_MINI_PROJECT.md) và [hướng dẫn AI log §4](../../team/HUONG_DAN_KIEM_THU_VA_AI_LOG.md). Yêu cầu đầy đủ là cùng bài/prompt/input/tiêu chí, output và kiểm tra thực của hai công cụ; Hân giữ minh chứng, Huy ghép báo cáo, Hải duyệt. Bản dưới chỉ là đối chiếu hồi cứu, chưa đủ để xác nhận đã hoàn thành yêu cầu cùng prompt.

Hân dùng Antigravity ở giai đoạn đầu, sau đó chuyển sang Codex khi hết token. Đối chiếu đoạn lọc nguồn trong bản clone ban đầu và bản đã tích hợp bằng cùng 14 ca thử trên Node 24.21.0/Windows, baseline `28c2472`. Đây là so sánh hai bản triển khai lịch sử, không phải chạy hai AI bằng cùng prompt mới.

| Tiêu chí | Bản giai đoạn Antigravity | Bản sau chỉnh sửa với Codex |
|---|---|---|
| Tìm theo tên, nhà cung cấp, mô tả; không phân biệt hoa thường | Đạt | Đạt |
| Bỏ khoảng trắng đầu/cuối từ khóa | Chưa có | Có |
| Lọc ngôn ngữ tài liệu đồng thời với miễn phí | Một select nên không kết hợp được | Hai điều kiện độc lập, kết hợp AND |
| Giữ thứ tự và không sửa dữ liệu đầu vào | Đạt trong thử nghiệm hàm lọc | Đạt trong thử nghiệm hàm lọc |
| Tổng kết 14 ca | 10 đạt, 1 không đạt, 3 không hỗ trợ | 14 đạt |

**Quyết định:** Giữ bộ lọc hiện tại vì đáp ứng lọc ngôn ngữ + miễn phí và xử lý từ khóa có khoảng trắng. Không sửa code ứng dụng trong lượt làm minh chứng.

**Giới hạn:** Không có prompt/model/output hội thoại gốc; không kết luận công cụ nào tốt hơn nói chung hoặc tự đánh hoàn tất yêu cầu hai AI dùng cùng prompt. Không chạy UI/lưu/reload trong phép thử này. Log, dữ liệu thử và code trích được giữ cục bộ tại `artifacts/ai-filter-20261010/`, không đưa vào PR.
