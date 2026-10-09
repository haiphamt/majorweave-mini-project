# Đợt 2 — Nội dung để Chung Minh Hiếu đọc duyệt

Ngày biên soạn/kiểm chứng: **06/10/2026**. Deadline task: **20:00 10/10/2026, giờ Việt Nam**.
Bốn pack có `reviewStatus=review`; tám track giữ nguyên ID scaffold. Đây là chương trình bài thực hành tự biên soạn dựa trên tài liệu chính thức, chưa phải kết quả sinh viên đã học hoặc reviewer đã nghiệm thu.

## 1. Khối lượng và cách đọc

**39 chặng duy nhất, 37 nguồn, 78 bài thực hành, 3 mục tiêu chứng nhận tùy chọn.** Mỗi chặng có hai bài; mỗi bài 60–120 phút với ít nhất hai acceptance. Phút là ước lượng bài đã chọn, không phải thời lượng học toàn khóa, download/GPU/training dài có thể làm thời gian thực tế khác.

| Track giữ nguyên | Chặng / bài | Phút / giờ ước lượng | Trình tự và sản phẩm cần duyệt |
|---|---:|---:|---|
| scientist.python | 10 / 20 | 1710 / 28,5h | Python → NumPy/pandas → thống kê/loss/gradient → split/baseline/metric → trách nhiệm dữ liệu → SQL/EDA → báo cáo phân tích giao dịch và dự đoán |
| ml.classical | 11 / 22 | 1980 / 33h | Nền chung → linear/tree → tuning CV → clustering optional → CLI/model card cho classification bảng |
| ml.cv | 11 / 22 | 1980 / 33h | Nền chung → PyTorch/autograd → manifest/augmentation ảnh → frozen backbone/head → CLI ảnh và model card |
| ml.nlp | 11 / 22 | 2040 / 34h | Nền chung → PyTorch → corpus/TF-IDF → tokenizer/frozen encoder → audit câu ngắn/dài, CLI và card |
| mlops.serving | 14 / 28 | 2580 / 43h | Nền chung/classification → Git/venv → MLflow/artifact → FastAPI → container → metrics/drift/runbook |
| mlops.pipeline | 15 / 30 | 2760 / 46h | Nền chung/classification → Git/MLflow/artifact → DVC versions/DAG → CI gates → registry/promote/rollback |
| ai-engineer.rag | 13 / 26 | 2460 / 41h | Nền chung/PyTorch → LLM/adapter → chunk/embedding/retrieval → RAG/citations/refusal → 20 case và CLI |
| ai-engineer.agents | 13 / 26 | 2460 / 41h | Nền chung/PyTorch → LLM/adapter → tool schema/allowlist → loop giới hạn → 20 nhiệm vụ/trace/policy → CLI |

Thời lượng trên đã tính nền tảng và cả optional clustering; nếu bỏ clustering thì ml.classical giảm 150 phút (2,5h). Sinh viên biết nền tảng có thể đánh dấu known theo planner, không xóa tiên quyết. Không cộng tám dòng thành khối lượng duy nhất vì nhiều track dùng chung các ID.

## 2. Nội dung và các tiêu chí quan trọng

- **Data Science:** CSV tổng hợp được làm sạch có báo cáo số dòng; SQL phải khớp pandas; ba biểu đồ trả lời ba câu hỏi. Bootstrap/kiểm định có seed và giả định. Model so baseline, không dùng test để tuning, có năm lỗi và ba hạn chế trong báo cáo.
- **ML cổ điển:** cùng split so Dummy/LogisticRegression/RandomForest; search tối đa tám cấu hình/ba folds để giới hạn CPU. Clustering không được xem cluster ID là ground truth. Model card nêu intended use và lỗi.
- **CV:** ít nhất 20 ảnh/lớp được phép, split không trùng hash/đối tượng; augmentation chỉ train. Head train trên backbone freeze, ghi weights/license, CPU/RAM/thời gian; CLI test ảnh hỏng/quá lớn.
- **NLP:** corpus 60 câu/two labels tự viết hoặc được phép, không duplicate chéo split; so TF-IDF và frozen encoder trên cùng holdout. Test Unicode/rỗng/câu dài; ghi model có hỗ trợ tiếng Việt không. Đây là phân loại dùng encoder, không tự nhận full fine-tuning LLM.
- **Serving:** model artifact có checksum và provenance; FastAPI validate request/batch limits; container chạy local. Metrics đo 20 requests đúng/năm lỗi và latency; drift mô phỏng không tự chứng minh accuracy đã giảm.
- **Pipeline:** DVC quản hai data versions; đổi data/config phải rerun đúng stage. Test schema/metric/checksum làm CI fail khi cần. Hai model versions promote/rollback và kiểm chứng output version, không ghi đè lịch sử.
- **RAG:** 12 tài liệu có provenance; 10 query có ground truth; so lexical/semantic retrieval. 20 case kiểm citation, query không có đáp án và injection. Chỉ chấp nhận citation resolve được vào corpus; report tách retrieval khỏi answer quality.
- **Agent:** lookup/calculator validate args, không eval/shell tùy ý; loop tối đa năm bước. 20 nhiệm vụ có expected/actual/trace, kiểm tool lỗi/lặp/thiếu dữ liệu; thêm năm yêu cầu vượt quyền. Action giả lập có request ID để tránh thực thi hai lần.

AI mặc định fake model/offline để kiểm tra cơ chế trên máy; API thật là tùy chọn. Kết quả mock không được dùng để tuyên bố chất lượng LLM thật. Bài yêu cầu người học ghi rõ model/config/usage nếu thực hiện API thật.

## 3. Thiết bị, phí và chứng nhận

Nguồn Python/NumPy/pandas/SciPy/scikit-learn/PyTorch/FastAPI/MLflow/DVC là tài liệu chính thức truy cập công khai; accessNote nói rõ phần thực hành local. CPU fallback của tutorial CV đã được mở kiểm tra tại [PyTorch](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html). CV/NLP giới hạn sample/epoch, người học đo RAM/thời gian; không đảm bảo mọi model hoặc toàn khóa chạy nhanh trên mọi máy.

Docker trên Windows cần kiểm tra OS/WSL2 hoặc Hyper-V, virtualization và RAM; trang chính thức ghi yêu cầu RAM 8GB và điều kiện license giáo dục/cá nhân. Xem [Docker Windows installation](https://docs.docker.com/desktop/setup/install/windows-install/). Bài container dùng local; học tài liệu không đồng nghĩa mọi subscription/cloud miễn phí.

Gemini có free và paid tiers tùy model/quota. API thật cần key, account và điều kiện khu vực; không hardcode model/giá token, không bắt buộc bật billing. Xem [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing). GitHub Actions standard runner public có cơ chế miễn phí, private/quota/larger runner khác; bài có lệnh chạy local. Xem [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

| Khảo sát | Quyết định biên soạn |
|---|---|
| Machine Learning Specialization — Stanford Online / DeepLearning.AI trên Coursera | Mục tiêu tùy chọn cho scientist.python và ml.classical; certificate trả phí, cần hoàn thành ba khóa/assignments. Điều kiện/phí quan sát được ghi trong CredentialGoal, không hứa giá tại checkout. [Trang chính thức](https://www.coursera.org/specializations/machine-learning-introduction) |
| AWS Machine Learning Engineer Associate | Mục tiêu nâng cao cho hai MLOps tracks, không yêu cầu người mới mua thi/cloud. Cần kinh nghiệm theo đối tượng nhà cung cấp; trang có phiên bản current/beta khác nhau, xác nhận mã thi lúc đăng ký. [Trang chính thức](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) |
| Hugging Face Agents Course | Tùy chọn cho agent; cấp certificate miễn phí theo điều kiện khóa, nhưng compute/API ngoài có thể tốn phí. Trang claim yêu cầu final challenge trên 30%; không coi test local là đã đạt. [Claim certificate](https://huggingface.co/learn/agents-course/en/unit4/get-your-certificate), [giới thiệu/điều kiện](https://huggingface.co/learn/agents-course/en/unit0/introduction) |
| Harvard Data Science Professional Certificate | Đã mở khảo sát nhưng không gắn vào Python track: chương trình dùng R/RStudio/dplyr/ggplot2. [Harvard](https://pll.harvard.edu/series/professional-certificate-data-science) |
| CV / NLP / RAG thuần | Chưa gắn certificate trong bản này: ML Specialization khảo sát thiên nền ML/TensorFlow, không xác nhận portfolio PyTorch/Transformer; Agents Course chấm agent benchmark không tương đương RAG thuần. Dùng portfolio đặc thù để nghiệm thu. Không kết luận thị trường không có chứng nhận phù hợp; reviewer có thể đề xuất khảo sát bổ sung. |

Không đăng ký học/thi, mua dịch vụ hoặc đo chi phí tài khoản trong đợt biên soạn. Chỉ ghi điều kiện trên trang mở được, không xác minh trải nghiệm sau đăng nhập. URL mở lỗi có checkedAt=null trong [SOURCES.json](SOURCES.json), không đưa thành nguồn học đã verified. URLs chuyển hướng được lưu bằng địa chỉ đích chính thức.

## 4. Bàn giao registry cho Hải

Chưa sửa `src/content/index.ts`. Bốn pack cần được ghép cùng nhau vì ML dùng nền scientist; MLOps dùng scientist/ML; AI dùng scientist/ML và model card của ML. Không trải mảng chặng của dependency vào pack khác.

Đề xuất đoạn đăng ký trong registry hiện tại, giữ các pack khác đã tích hợp:

```ts
import { scientistPack } from './paths/scientist';
import { mlPack } from './paths/ml';
import { mlopsPack } from './paths/mlops';
import { aiEngineerPack } from './paths/ai-engineer';

export const contentPacks: readonly ContentPack[] = [
  backendPack, scientistPack, mlPack, mlopsPack, aiEngineerPack,
];
```

Đây là ví dụ tại baseline chỉ có Backend; nếu registry đã có thêm pack thì Hải nối thêm bốn pack, không thay cả mảng bằng ví dụ cũ. Shared registry phải resolve ID toàn bộ packs, không chỉ lookup trong pack hiện tại. Test riêng tự ghép bốn pack cùng registry hiện hữu trong bộ nhớ; khi registry thật thêm các object này, script khử lặp cùng object reference và vẫn kiểm tra collision khác.

Bảy chặng nền scientist chỉ định nghĩa một lần. ml.neural, MLflow tracking/artifacts và ai-engineer.llm/delivery cũng dùng chung qua ID. ID track giữ nguyên; các stage/work mới chưa phát hành, revision=1. Content version: `2026-10-06.mw-team-03.2`; không tạo migration dữ liệu đã học hoặc đổi ID track.

## 5. Review còn cần làm

Hiếu đọc câu hỏi, công cụ/thiết bị, thời lượng từng bài và tiêu chí portfolio; góp ý workload hoặc chủ đề thiếu trước khi nghiệm thu. Test tự động kiểm cấu trúc/quan hệ, không chứng minh thời gian học thực tế hoặc chất lượng model. Sau Hải ghép registry/context/planner, chạy lại check/task test và thử cả tám track: chọn/đổi nguồn/tạo plan/done/reload. UI v2 và planner end-to-end chưa được xác nhận trong đợt 2.
