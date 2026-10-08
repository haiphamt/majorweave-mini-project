# Rà nội dung tám track — 08/10/2026
Code 1ce77b1491d09c2134fe4cd9ebf652fe3b7582fc. Codex hỗ trợ Hiếu đọc 78 bài và acceptance, 39 chặng dùng chung/riêng; chưa thay cho việc Hiếu và reviewer nghiệm thu. Bốn pack giữ reviewStatus=review. Không nhận đã học hoặc đạt chứng nhận.

| Track | Chặng / bài | Tổng phút / giờ | Nhận xét workload |
|---|---:|---:|---|
| scientist.python | 10 / 20 | 1710 / 28.5 | Python, thống kê, báo cáo mô hình |
| ml.classical | 11 / 22 | 1980 / 33 | Clustering 150 phút là phần tùy chọn; tổng bảng gồm toàn stageIds |
| ml.cv | 11 / 22 | 1980 / 33 | Nền chung trước neural/transfer learning |
| ml.nlp | 11 / 22 | 2040 / 34 | Bài local giới hạn dữ liệu, không cam kết full fine-tune |
| mlops.serving | 14 / 28 | 2580 / 43 | Serving, kiểm thử lỗi, monitoring |
| mlops.pipeline | 15 / 30 | 2760 / 46 | Pipeline, version/model lifecycle |
| ai-engineer.rag | 13 / 26 | 2460 / 41 | Retrieval, citation, evaluation |
| ai-engineer.agents | 13 / 26 | 2460 / 41 | Tool schema, lỗi, giới hạn và evaluation |
Các dòng tính theo tham chiếu từng track nên có nội dung dùng chung; không cộng bảng để thành 198 bài duy nhất. Toàn bộ bốn pack có 78 bài duy nhất, 37 nguồn và 3 mục tiêu chứng nhận. Bài 60–120 phút là ước lượng biên soạn, chưa đo bằng học viên; cài đặt/download/API có thể kéo dài. Planner review ở 2/20h chứng minh bảo toàn tổng phút/quỹ giờ, không chứng minh thời gian thực tế.

## Nội dung và acceptance
Đã đọc title, acceptance, prerequisite và portfolio. Bài có artifact kiểm được: dữ liệu nhỏ, output, xử lý file trống/thiếu cột, test lỗi, báo cáo và repo. Không phát hiện bằng chứng nguồn Java bị gắn vào Python, ID đổi/trùng hoặc prerequisite đảo trong kiểm tra hiện tại.
Bảy chặng nền scientist được tham chiếu thay vì nhân định nghĩa; ML neural và delivery dùng chung phù hợp. Portfolio cần người review chạy artifact thực, không chỉ tick đã đọc nguồn.
Yêu cầu thu thập lỗi mô hình cần giải thích cách chọn holdout/case khó; không bịa lỗi nếu mô hình chưa có lỗi trên tập nhỏ. Mock LLM chỉ chứng minh flow và xử lý lỗi, không chứng minh chất lượng model thật. Thời lượng CPU và chất lượng evaluation vẫn cần phản hồi học viên.
Không sửa content chỉ dựa trên suy đoán. checkedAt trong pack/SOURCES.json giữ ngày kiểm nguồn ban đầu; bảng dưới chỉ ghi URL thực sự mở lại hôm nay.

## Nguồn chính thức mở lại ngày 08/10/2026
| URL | Điều kiện / thiết bị / chi phí đã đối chiếu |
|---|---|
| https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html | Có CPU fallback khi không có accelerator; không yêu cầu mua GPU cho bài nhỏ |
| https://docs.docker.com/desktop/setup/install/windows-install/ | Windows cần nền WSL2/Hyper-V và virtualization phù hợp; tài liệu nêu RAM 8GB. Cần kiểm máy cá nhân trước bài Docker |
| https://ai.google.dev/gemini-api/docs/pricing | Có free/paid tier tùy model; quota/giá thay đổi. Không hardcode phí, không yêu cầu bật billing cho bài mock |
| https://huggingface.co/learn/agents-course/en/unit4/get-your-certificate | Điều kiện certificate ở unit4 có score trên 30%, đăng nhập và tên; không nhận đã đạt |
| https://scikit-learn.org/stable/common_pitfalls.html | Đối chiếu leakage/preprocessing trong evaluation |
| https://huggingface.co/docs/transformers/tasks/sequence_classification | Nguồn chính thức phân loại chuỗi; tách yêu cầu tutorial đầy đủ khỏi bài local nhỏ |
| https://mlflow.org/docs/latest/ml/model-registry/tutorial/ | Tutorial model registry; không tự biến bài local thành yêu cầu cloud trả phí |
Đây là kiểm lại nguồn đại diện cho các nhóm track, không phải kiểm lại toàn bộ 37 URL hôm nay. Nguồn còn lại giữ bằng chứng 06/10 trong SOURCES.json/CONTENT_REVIEW.md; URL/giá chưa mở lại không được nhận là xác minh mới.
RAG/agent dùng API thật cần người học tự có key, tuân quota và bảo vệ key; mock/local là đường thực hành khi không có API. Không có key thật trong repo hoặc test.
Reviewer cần duyệt workload và tiêu chí portfolio; chứng nhận không phù hợp có lý do/portfolio trong pack, không tạo chứng chỉ giả.
