# Nguồn và phạm vi nội dung — MW-TEAM-04

## Cách khảo sát

Ngày 07/10/2026, Codex mở các trang chính thức dưới đây bằng công cụ web, đọc nội dung bài/điều kiện truy cập. Đây là khảo sát nguồn, không phải bằng chứng đã học hoặc thi. `checkedAt` chỉ áp dụng URL đã mở. Phí và chính sách có thể đổi; không coi portfolio mini là đủ điều kiện đạt chứng chỉ nghề.

24 nguồn, 6 mục tiêu chứng nhận, 29 chặng tự biên soạn, 43 bài thực hành; 8 track. Tất cả pack giữ `review`. Dataset 30 đơn hàng là dữ liệu giả lập **do người học tạo theo bài**, không phải kết quả học được dựng sẵn. Bài có thời lượng và acceptance cụ thể; portfolio có đầu ra kiểm tra được.

## Nguồn học đã mở

ID ở bảng bỏ tiền tố `resource.`. URL là URL cuối được dùng trong pack; trang có chuyển hướng được cập nhật tới đích quan sát được.

| ID | Trang đã mở | Nội dung dùng / điều kiện |
|---|---|---|
| data-quality | [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) | Chất lượng, kiểm soát dữ liệu; đọc miễn phí |
| data-postgres | [PostgreSQL SQL tutorial](https://www.postgresql.org/docs/current/tutorial-sql.html) | Tạo bảng, truy vấn, join và aggregate; miễn phí |
| data-cs50 | [CS50 SQL](https://cs50.harvard.edu/sql/) | Bài giảng, problem sets theo khóa SQL; nội dung mở |
| data-location | [NIST Measures of Location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm) | Mean, median, outlier và lựa chọn thống kê; miễn phí |
| data-powerquery | [Power Query overview](https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query) | Transform/refresh dữ liệu; bài đọc miễn phí, sản phẩm host có điều kiện riêng |
| data-excel-pivot | [Create a PivotTable](https://support.microsoft.com/en-us/excel/get-started/create-a-pivottable-to-analyze-worksheet-data) | Pivot từ worksheet; đọc miễn phí, Excel cần quyền sử dụng |
| data-sheets-pivot | [Google Sheets pivot](https://support.google.com/docs/answer/1272900?hl=en) | Pivot thay thế trong Sheets; cần Google account cho công cụ, app MajorWeave vẫn không login |
| data-python | [Python CSV](https://docs.python.org/3/library/csv.html) | DictReader/DictWriter và xử lý newline; miễn phí |
| data-pandas | [pandas tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html) | Đọc/ghi, chọn dữ liệu, nhóm, reshape; miễn phí |
| data-pandas-missing | [pandas missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html) | Kiểu thiếu, fill/drop và kiểm tra; miễn phí |
| bi-star | [Microsoft star schema](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema) | Fact/dimension, grain, relationship; miễn phí |
| bi-desktop | [Power BI Desktop getting started](https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started) | Import/transform/model/report; Desktop local miễn phí, chia sẻ service có điều kiện license |
| bi-dax | [DAX quickstart](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-quickstart-learn-dax-basics) | Measure và filter context; bài đọc miễn phí |
| bi-tableau-tutorial | [Tableau tutorial](https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm) | Kết nối dữ liệu, worksheet, dashboard/story; dùng mẫu tutorial |
| bi-tableau-public | [Tableau Public](https://www.tableau.com/products/public) | Lựa chọn miễn phí, công khai; chỉ đưa dữ liệu tổng hợp/giả lập lên Public |
| engineer-copy | [PostgreSQL COPY](https://www.postgresql.org/docs/current/sql-copy.html) | Nạp/xuất, format và lỗi; miễn phí |
| engineer-window | [PostgreSQL window functions](https://www.postgresql.org/docs/current/tutorial-window.html) | Partition/order và row numbering; miễn phí |
| engineer-airflow | [Airflow fundamentals](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html) | DAG/task/dependency/retry; chạy local cần môi trường hỗ trợ |
| engineer-kafka | [Kafka quickstart](https://kafka.apache.org/quickstart/) | Broker/topic, producer/consumer; local, không cần mua cloud |
| engineer-spark | [Spark Structured Streaming API](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html) | Event time/window/watermark/checkpoint và output; local |
| ba-standard | [IIBA Business Analysis Standard](https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/the-foundation-for-effective-business-analysis/) | PDF miễn phí sau form; bản tương tác theo membership, sách in trả phí |
| ba-intro | [What is Business Analysis](https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/) | Vai trò, nhu cầu và giá trị nghiệp vụ; mở |
| ba-bpmn | [Camunda BPMN primer](https://docs.camunda.io/docs/components/modeler/bpmn/bpmn-primer/) | Event/task/gateway, mô hình quy trình; tài liệu mở |
| ba-scrum | [Scrum Guide](https://scrumguides.org/scrum-guide.html) | Goal/backlog/Definition of Done; tài liệu mở, không phải chứng chỉ |

## Chứng nhận đã khảo sát

| Mục tiêu | Bằng chứng chính thức / quyết định |
|---|---|
| CS50 SQL Certificate | [Điều kiện](https://cs50.harvard.edu/sql/certificate/): đạt ít nhất 70% từng problem và final project để nhận chứng nhận CS50 miễn phí; chứng nhận verified edX là lựa chọn khác. Portfolio mini không tự cấp certificate. Dùng cho hai DA track. |
| Power BI Data Analyst Associate | [Microsoft](https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/): PL-300 đánh giá chuẩn bị/model/visualize/manage dữ liệu; thi trả phí theo vùng, không ghi một giá chung. Mục tiêu tiếp sau dashboard. |
| Salesforce Certified Tableau Desktop Foundations | [Tableau certification](https://www.tableau.com/learn/certification): tên hiện hành có trên trang chính thức. Trang exam chi tiết không trả nội dung đọc được trong lần khảo sát; phí/prerequisite để `unknown` và yêu cầu tra guide trước đăng ký. Không dùng tên Desktop Specialist cũ như kỳ thi đã xác nhận còn mở. |
| AWS Data Engineer – Associate | [AWS](https://aws.amazon.com/certification/certified-data-engineer-associate/): định hướng ứng viên có 2–3 năm data engineering và 1–2 năm AWS; exam fee công bố 150 USD trước điều chỉnh theo vùng/thuế. Mục tiêu dài hạn tùy chọn, không yêu cầu cloud trả phí hoặc hứa đủ trình độ sau mini. |
| ECBA | [IIBA](https://www.iiba.org/business-analysis-certifications/ecba/): chứng nhận nhập môn BA, phù hợp software BA; cần theo handbook và quy trình đăng ký hiện hành. Thi trả phí, không bịa số giờ kinh nghiệm bắt buộc. |
| CBDA | [IIBA CBDA](https://www.iiba.org/business-analysis-certifications/business-data-analytics-certification/): quyết định nghiệp vụ dựa trên dữ liệu; phù hợp Data/BI BA. Đọc blueprint/handbook trước đăng ký; chưa xác minh giá áp dụng người học nên `unknown`. |

## Dùng chung và phụ thuộc nội dung

- `analystPack` định nghĩa duy nhất `data.quality`, `data.sql`, `data.python-files`; BI/DE/BA tham chiếu ID khi cần. Không import feature hay dùng registry riêng.
- `language.python` lấy từ **backendPack hiện có**, owner MW-TEAM-01/Hân. Dùng trước `data.python-files` ở analyst.pandas, engineer.batch và engineer.streaming. Test bundle đúng file Backend thật. Đã mở lại [Python Tutorial](https://docs.python.org/3/tutorial/) và [Helsinki Python MOOC 2026](https://programming-26.mooc.fi/) ngày 07/10; không sửa metadata/check date thuộc Hân.
- Chặng Python kế thừa hiện là bài chuyển đổi legacy với một acceptance theo outcome. Test riêng giữ quy tắc của baseline cho chặng kế thừa, yêu cầu tối thiểu hai acceptance cho **mọi bài mới**. Hải/Hân cần review độ cụ thể của chặng chung khi duyệt; không sao chép chặng để che hạn chế này.
- Test kiểm tra toàn bộ resource IDs/URLs của Backend + bốn pack để phát hiện nguồn định nghĩa trùng. Link roadmap hoặc chứng nhận dẫn cùng khóa học không tạo resource trùng.
- BA Software đi từ khám phá vấn đề đến stakeholder/process/requirements/UAT, không ép Python/SQL/DSA/OS. BA Data thêm data quality, KPI, lineage và đối chiếu kết quả nghiệp vụ.
- Streaming bao gồm toàn bộ chặng batch rồi thêm Kafka, event-time và recovery; portfolio kiểm tra replay, duplicate, late event.

## Cần Hải chốt trước tích hợp

1. Đăng ký bốn export `analystPack`, `biPack`, `engineerPack`, `businessAnalystPack` cùng Backend và resolver dùng ID toàn cục.
2. Xác nhận ownership Data stages và phụ thuộc `language.python`; không đổi ID âm thầm khi các PR khác cùng dùng.
3. Giữ `review` tới khi review nội dung, nguồn và chạy hành trình app cho đủ tám track.
4. Kiểm tra lại fees/availability ngay trước việc đăng ký thi; không biến thông tin chưa xác minh thành `free` hoặc placeholder Done.
