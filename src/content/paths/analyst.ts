import type { ContentPack } from '../../domain/contracts';

// Shared Data stages/resources are defined here once; see MW-TEAM-04 inventory.
export const analystPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-07.mw-team-04.1",
  "pathId": "analyst",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "data.quality",
      "title": "Câu hỏi phân tích và chất lượng dữ liệu",
      "phase": "foundation",
      "prerequisiteIds": [],
      "resourceIds": [
        "resource.data-quality"
      ],
      "defaultResourceId": "resource.data-quality",
      "description": "Chuyển câu hỏi doanh thu thành định nghĩa chỉ số và kiểm tra dữ liệu đầu vào.",
      "outcome": "Có data dictionary, grain và báo cáo chất lượng trước phân tích.",
      "optional": false,
      "work": [
        {
          "id": "data.quality.dictionary",
          "revision": 1,
          "title": "Định nghĩa đơn hàng và doanh thu thuần",
          "minutes": 60,
          "acceptance": [
            "Tạo CSV giả lập 30 dòng gồm order_id, order_date, customer_id, quantity, unit_price, discount, status.",
            "Ghi đơn vị, kiểu và ý nghĩa từng cột; định nghĩa doanh thu loại đơn hủy và xử lý giảm giá.",
            "Nêu ba câu hỏi phân tích có phạm vi thời gian và người sử dụng."
          ]
        },
        {
          "id": "data.quality.audit",
          "revision": 1,
          "title": "Lập bảng kiểm chất lượng 30 đơn hàng",
          "minutes": 90,
          "acceptance": [
            "Cố ý thêm ID trùng, ngày sai, giá thiếu và số lượng âm; phát hiện đủ bốn nhóm lỗi.",
            "Ghi số dòng trước/sau và quy tắc xử lý từng lỗi; không âm thầm xóa dòng.",
            "Lưu bản raw riêng và bảng đối chiếu các dòng bị sửa."
          ]
        }
      ]
    },
    {
      "id": "data.sql",
      "title": "SQL cho dữ liệu phân tích",
      "phase": "foundation",
      "prerequisiteIds": [
        "data.quality"
      ],
      "resourceIds": [
        "resource.data-postgres",
        "resource.data-cs50"
      ],
      "defaultResourceId": "resource.data-postgres",
      "description": "Truy vấn dữ liệu dạng bảng, khóa và phép nối theo câu hỏi nghiệp vụ.",
      "outcome": "Bộ SQL tạo dữ liệu và đối chiếu tổng hợp được.",
      "optional": false,
      "work": [
        {
          "id": "data.sql.schema",
          "revision": 1,
          "title": "Tạo bảng customers và orders",
          "minutes": 90,
          "acceptance": [
            "Tạo primary/foreign key; nạp dữ liệu giả lập của chặng chất lượng và ít nhất 5 khách hàng.",
            "Chứng minh khóa trùng và khách hàng không tồn tại bị từ chối.",
            "Lưu script setup có thể chạy lại trên database thử."
          ]
        },
        {
          "id": "data.sql.analysis",
          "revision": 1,
          "title": "Truy vấn doanh thu và khách hàng chưa mua",
          "minutes": 120,
          "acceptance": [
            "Viết SELECT lọc ngày, GROUP BY doanh thu, HAVING và LEFT JOIN tìm khách chưa mua.",
            "Kiểm tra NULL, đơn hủy và lỗi nhân dòng khi join; đối chiếu 3 kết quả bằng tính tay.",
            "Ghi query và expected output trong README."
          ]
        }
      ]
    },
    {
      "id": "analyst.statistics",
      "title": "Thống kê mô tả và giới hạn kết luận",
      "phase": "foundation",
      "prerequisiteIds": [
        "data.sql"
      ],
      "resourceIds": [
        "resource.data-location"
      ],
      "defaultResourceId": "resource.data-location",
      "description": "Diễn giải phân phối và dữ liệu lệch trước khi đề xuất hành động.",
      "outcome": "Bản phân tích có số đo, hạn chế và câu hỏi tiếp theo.",
      "optional": false,
      "work": [
        {
          "id": "analyst.statistics.compare",
          "revision": 1,
          "title": "So sánh trung bình và trung vị giá trị đơn",
          "minutes": 75,
          "acceptance": [
            "Tính hai số đo trước/sau thêm một đơn ngoại lệ lớn.",
            "Giải thích số đo phù hợp khi dữ liệu lệch, không tự loại ngoại lệ vì làm xấu kết quả.",
            "Nêu giới hạn mẫu 30 dòng; không kết luận quan hệ nhân quả."
          ]
        },
        {
          "id": "analyst.statistics.memo",
          "revision": 1,
          "title": "Viết memo phân tích một trang",
          "minutes": 60,
          "acceptance": [
            "Trả lời ba câu hỏi ban đầu với số liệu đối chiếu được.",
            "Tách quan sát, giả thuyết và đề xuất kiểm tra tiếp; ghi dữ liệu còn thiếu."
          ]
        }
      ]
    },
    {
      "id": "analyst.spreadsheet.clean",
      "title": "Làm sạch bằng bảng tính",
      "phase": "build",
      "prerequisiteIds": [
        "analyst.statistics"
      ],
      "resourceIds": [
        "resource.data-powerquery"
      ],
      "defaultResourceId": "resource.data-powerquery",
      "description": "Tạo các bước biến đổi có thể refresh từ file gốc.",
      "outcome": "Workbook có vùng raw, dữ liệu sạch và nhật ký biến đổi.",
      "optional": false,
      "work": [
        {
          "id": "analyst.spreadsheet.clean.refresh",
          "revision": 1,
          "title": "Nhập CSV và chuẩn hóa cột bằng Power Query",
          "minutes": 120,
          "acceptance": [
            "Đặt kiểu ngày/số rõ ràng; xử lý trùng và thiếu theo bảng quy tắc.",
            "Giữ raw; thêm 5 dòng vào file nguồn rồi refresh được.",
            "Đối chiếu tổng số dòng và doanh thu với SQL, ghi mọi sai lệch."
          ]
        }
      ]
    },
    {
      "id": "analyst.spreadsheet.report",
      "title": "Pivot và báo cáo quyết định",
      "phase": "ship",
      "prerequisiteIds": [
        "analyst.spreadsheet.clean"
      ],
      "resourceIds": [
        "resource.data-excel-pivot",
        "resource.data-sheets-pivot"
      ],
      "defaultResourceId": "resource.data-excel-pivot",
      "description": "Tổng hợp dữ liệu sạch thành bảng và biểu đồ có thể kiểm tra.",
      "outcome": "Workbook/pivot phản hồi được lọc ngày và câu hỏi nghiệp vụ.",
      "optional": false,
      "work": [
        {
          "id": "analyst.spreadsheet.report.pivot",
          "revision": 1,
          "title": "Tạo pivot theo tháng và nhóm khách",
          "minutes": 90,
          "acceptance": [
            "Tạo hai pivot, một biểu đồ xu hướng và bộ lọc thời gian.",
            "Tổng pivot bằng SQL với cùng bộ lọc; định dạng tiền và ngày nhất quán."
          ]
        },
        {
          "id": "analyst.spreadsheet.report.handoff",
          "revision": 1,
          "title": "Bàn giao workbook phân tích doanh thu",
          "minutes": 90,
          "acceptance": [
            "Gồm raw, clean, pivot, dictionary, memo và hướng dẫn refresh.",
            "Người khác dùng file CSV mới chạy lại được; không có dữ liệu cá nhân thật.",
            "Nêu ba phát hiện, hai giới hạn và một khuyến nghị có chỉ số theo dõi."
          ]
        }
      ]
    },
    {
      "id": "data.python-files",
      "title": "Python cho file dữ liệu",
      "phase": "foundation",
      "prerequisiteIds": [
        "data.quality",
        "language.python"
      ],
      "resourceIds": [
        "resource.data-python"
      ],
      "defaultResourceId": "resource.data-python",
      "description": "Dùng Python với CSV/JSON, kiểu dữ liệu và lỗi đầu vào.",
      "outcome": "Script kiểm tra file có thể chạy bằng dòng lệnh.",
      "optional": false,
      "work": [
        {
          "id": "data.python-files.parse",
          "revision": 1,
          "title": "Đọc và kiểm tra đơn hàng CSV bằng Python",
          "minutes": 120,
          "acceptance": [
            "Dùng csv/decimal/datetime; kiểm tra cột bắt buộc, ngày và số tiền.",
            "Dòng lỗi được ghi riêng có số dòng; chương trình không crash vì một dòng sai.",
            "Hàm biến đổi có assert cho dòng hợp lệ, thiếu cột và ngày sai."
          ]
        }
      ]
    },
    {
      "id": "analyst.pandas.clean",
      "title": "Làm sạch và ghép bảng với pandas",
      "phase": "build",
      "prerequisiteIds": [
        "analyst.statistics",
        "data.python-files"
      ],
      "resourceIds": [
        "resource.data-pandas",
        "resource.data-pandas-missing"
      ],
      "defaultResourceId": "resource.data-pandas",
      "description": "Kiểu dữ liệu, missing values và merge có kiểm tra số dòng.",
      "outcome": "Notebook tái lập bước làm sạch và quan hệ nhiều–một.",
      "optional": false,
      "work": [
        {
          "id": "analyst.pandas.clean.merge",
          "revision": 1,
          "title": "Tạo DataFrame đơn hàng và ghép khách hàng",
          "minutes": 120,
          "acceptance": [
            "Đọc CSV với dtype/ngày rõ; dùng merge validate nhiều–một.",
            "Báo cáo unmatched keys; giải thích fill/drop theo từng cột.",
            "Kiểm tra trùng ID và tổng doanh thu trước/sau merge bằng assert."
          ]
        }
      ]
    },
    {
      "id": "analyst.pandas.report",
      "title": "Phân tích pandas tái lập",
      "phase": "ship",
      "prerequisiteIds": [
        "analyst.pandas.clean"
      ],
      "resourceIds": [
        "resource.data-pandas"
      ],
      "defaultResourceId": "resource.data-pandas",
      "description": "Tổng hợp, trực quan và bàn giao phân tích có thể chạy lại.",
      "outcome": "Notebook có dữ liệu đầu vào, kết quả và kiểm tra đối chiếu.",
      "optional": false,
      "work": [
        {
          "id": "analyst.pandas.report.aggregate",
          "revision": 1,
          "title": "Tổng hợp tháng và vẽ biểu đồ",
          "minutes": 90,
          "acceptance": [
            "Dùng groupby theo tháng/nhóm khách và biểu đồ có nhãn, đơn vị.",
            "Đối chiếu doanh thu với SQL trong sai số làm tròn đã ghi.",
            "Không suy diễn thiếu dữ liệu thành doanh thu bằng 0."
          ]
        },
        {
          "id": "analyst.pandas.report.reproduce",
          "revision": 1,
          "title": "Bàn giao notebook và memo",
          "minutes": 90,
          "acceptance": [
            "Chạy Restart & Run All từ raw tới kết quả không cần sửa ô thủ công.",
            "Ghi môi trường, lệnh chạy, kiểm tra và chính sách thiếu dữ liệu.",
            "Có ba phát hiện, hai hạn chế mẫu và một đề xuất đo tiếp."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.data-quality",
      "title": "Government Data Quality Framework",
      "provider": "UK Government",
      "url": "https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu công khai; áp dụng các tiêu chí chất lượng vào dữ liệu giả lập.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-postgres",
      "title": "PostgreSQL SQL tutorial",
      "provider": "PostgreSQL",
      "url": "https://www.postgresql.org/docs/current/tutorial-sql.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Đọc miễn phí; cài PostgreSQL cục bộ để làm bài, không cần cloud.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-cs50",
      "title": "CS50 Introduction to Databases with SQL",
      "provider": "Harvard CS50",
      "url": "https://cs50.harvard.edu/sql/",
      "language": "en",
      "format": "course",
      "cost": "free",
      "level": "introductory",
      "accessNote": "OpenCourseWare miễn phí; nộp bài theo hướng dẫn tài khoản của khóa. Không cần học trọn khóa cho bài mini.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-location",
      "title": "Measures of Location",
      "provider": "NIST",
      "url": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu công khai về mean/median/mode; không yêu cầu tài khoản.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-powerquery",
      "title": "What is Power Query?",
      "provider": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí. Lab cần Excel có Power Query hoặc Power BI Desktop; kiểm tra giấy phép Excel trên máy.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-excel-pivot",
      "title": "Create a PivotTable to analyze worksheet data",
      "provider": "Microsoft Support",
      "url": "https://support.microsoft.com/en-us/excel/get-started/create-a-pivottable-to-analyze-worksheet-data",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "introductory",
      "accessNote": "Đọc miễn phí; lab dùng Excel có PivotTable. Các khả năng phụ thuộc phiên bản/giấy phép.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-sheets-pivot",
      "title": "Create and use pivot tables",
      "provider": "Google Docs Editors Help",
      "url": "https://support.google.com/docs/answer/1272900?hl=en",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Nguồn thay thế cho bước pivot bằng Google Sheets; cần tài khoản Google, chỉ dùng dữ liệu giả lập.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-python",
      "title": "csv — CSV File Reading and Writing",
      "provider": "Python Software Foundation",
      "url": "https://docs.python.org/3/library/csv.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu và Python miễn phí; học language.python trước. Thực hành DictReader/DictWriter, newline và kiểu dữ liệu khi đọc CSV.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-pandas",
      "title": "Getting started tutorials",
      "provider": "pandas",
      "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu và thư viện miễn phí; cần Python/pandas và môi trường notebook hoặc script.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.data-pandas-missing",
      "title": "Working with missing data",
      "provider": "pandas",
      "url": "https://pandas.pydata.org/docs/user_guide/missing_data.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; dùng sau tutorial DataFrame, làm rõ nullable dtype.",
      "checkedAt": "2026-10-07"
    }
  ],
  "credentials": [
    {
      "id": "credential.data-cs50-sql",
      "name": "CS50 SQL Certificate",
      "provider": "Harvard CS50",
      "kind": "course_certificate",
      "url": "https://cs50.harvard.edu/sql/certificate/",
      "cost": "free",
      "prerequisites": "Học/nộp bài theo tài khoản và hướng dẫn khóa CS50 SQL.",
      "requirements": "Đạt ít nhất 70% mỗi bài và final project. Chứng nhận CS50 miễn phí khác verified certificate edX; bài mini không thay bài khóa.",
      "checkedAt": "2026-10-07"
    }
  ],
  "tracks": [
    {
      "id": "analyst.spreadsheet",
      "pathId": "analyst",
      "label": "SQL + bảng tính",
      "stageIds": [
        "data.quality",
        "data.sql",
        "analyst.statistics",
        "analyst.spreadsheet.clean",
        "analyst.spreadsheet.report"
      ],
      "credentialIds": [
        "credential.data-cs50-sql"
      ],
      "roadmapLinks": [
        {
          "label": "Khung chất lượng dữ liệu",
          "url": "https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework"
        }
      ],
      "portfolio": {
        "title": "Workbook phân tích doanh thu",
        "acceptance": [
          "CSV giả lập + data dictionary + SQL đối chiếu.",
          "Workbook raw/clean/pivot/chart có refresh và quy tắc lỗi.",
          "Memo ba phát hiện, hạn chế và đề xuất đo; không dùng dữ liệu cá nhân thật."
        ]
      }
    },
    {
      "id": "analyst.pandas",
      "pathId": "analyst",
      "label": "SQL + Python / pandas",
      "stageIds": [
        "data.quality",
        "data.sql",
        "analyst.statistics",
        "language.python",
        "data.python-files",
        "analyst.pandas.clean",
        "analyst.pandas.report"
      ],
      "credentialIds": [
        "credential.data-cs50-sql"
      ],
      "roadmapLinks": [
        {
          "label": "pandas: lộ trình tutorial",
          "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html"
        }
      ],
      "portfolio": {
        "title": "Notebook phân tích tái lập",
        "acceptance": [
          "Chạy toàn bộ từ raw bằng môi trường được ghi phiên bản.",
          "Merge có kiểm tra cardinality, missing data và đối chiếu SQL.",
          "Biểu đồ, memo và assert đủ để người khác kiểm tra kết quả."
        ]
      }
    }
  ]
};
