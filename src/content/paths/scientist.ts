import type { ContentPack } from '../../domain/contracts';

// Sources verified in docs/tasks/MW-TEAM-03/SOURCES.json.
// Cross-pack IDs resolve through the single integrated registry.
export const scientistPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-06.mw-team-03.2",
  "pathId": "scientist",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "scientist.foundation.python",
      "title": "Python cho dữ liệu",
      "phase": "foundation",
      "description": "Hàm, collection, file và lỗi; người chưa biết lập trình cần nhập môn trước.",
      "outcome": "Script đọc dữ liệu có test.",
      "prerequisiteIds": [],
      "resourceIds": [
        "scientist.resource.python"
      ],
      "defaultResourceId": "scientist.resource.python",
      "optional": false,
      "work": [
        {
          "id": "scientist.foundation.python.csv",
          "revision": 1,
          "title": "Đọc CSV và tính tổng theo nhóm",
          "minutes": 90,
          "acceptance": [
            "CSV 12 dòng/3 nhóm; script nhận đường dẫn và xuất tổng đúng.",
            "File trống/thiếu cột trả lỗi rõ."
          ]
        },
        {
          "id": "scientist.foundation.python.tests",
          "revision": 1,
          "title": "Tách hàm và test parser",
          "minutes": 60,
          "acceptance": [
            "4 test: dòng đúng, thiếu cột, số sai, file không tồn tại.",
            "README có lệnh Python 3, không hardcode path."
          ]
        }
      ]
    },
    {
      "id": "scientist.arrays",
      "title": "NumPy và vector hóa",
      "phase": "foundation",
      "description": "Shape, indexing, broadcasting và vector.",
      "outcome": "Notebook vector hóa có assert.",
      "prerequisiteIds": [
        "scientist.foundation.python"
      ],
      "resourceIds": [
        "scientist.resource.numpy"
      ],
      "defaultResourceId": "scientist.resource.numpy",
      "optional": false,
      "work": [
        {
          "id": "scientist.arrays.normalize",
          "revision": 1,
          "title": "Chuẩn hóa ma trận bằng broadcasting",
          "minutes": 90,
          "acceptance": [
            "Ma trận 20x3, báo mean/std trước-sau.",
            "Cột hằng không chia cho 0; assert shape/kết quả."
          ]
        },
        {
          "id": "scientist.arrays.dot",
          "revision": 1,
          "title": "So loop và tích vô hướng NumPy",
          "minutes": 60,
          "acceptance": [
            "Hai kết quả khớp với tolerance 1e-6.",
            "Đo thời gian cùng input; giải thích shape/broadcast."
          ]
        }
      ]
    },
    {
      "id": "scientist.tables",
      "title": "pandas và chất lượng dữ liệu",
      "phase": "foundation",
      "description": "Dtype, missing, duplicate, joins và schema.",
      "outcome": "Bảng sạch có báo cáo kiểm tra.",
      "prerequisiteIds": [
        "scientist.arrays"
      ],
      "resourceIds": [
        "scientist.resource.pandas"
      ],
      "defaultResourceId": "scientist.resource.pandas",
      "optional": false,
      "work": [
        {
          "id": "scientist.tables.clean",
          "revision": 1,
          "title": "Làm sạch CSV giao dịch tổng hợp",
          "minutes": 90,
          "acceptance": [
            "30 dòng có missing/duplicate/số sai; báo số dòng theo từng quy tắc.",
            "Xuất clean.csv và bảng lỗi; không xóa im lặng."
          ]
        },
        {
          "id": "scientist.tables.join",
          "revision": 1,
          "title": "Join khách hàng và giao dịch",
          "minutes": 90,
          "acceptance": [
            "Test khóa thiếu và khách có nhiều giao dịch.",
            "Đối chiếu tổng tiền trước/sau, phát hiện nhân dòng."
          ]
        }
      ]
    },
    {
      "id": "scientist.statistics",
      "title": "Xác suất và thống kê",
      "phase": "foundation",
      "description": "Phân phối, lấy mẫu, khoảng tin cậy và giả định.",
      "outcome": "Báo cáo suy luận có giới hạn.",
      "prerequisiteIds": [
        "scientist.arrays",
        "scientist.tables"
      ],
      "resourceIds": [
        "scientist.resource.scipy-stats"
      ],
      "defaultResourceId": "scientist.resource.scipy-stats",
      "optional": false,
      "work": [
        {
          "id": "scientist.statistics.bootstrap",
          "revision": 1,
          "title": "Bootstrap khoảng tin cậy trung bình",
          "minutes": 90,
          "acceptance": [
            "Seed cố định, ít nhất 500 resamples; báo khoảng 95%.",
            "Lặp seed cùng kết quả; nêu ảnh hưởng sample nhỏ."
          ]
        },
        {
          "id": "scientist.statistics.hypothesis",
          "revision": 1,
          "title": "So sánh hai nhóm tổng hợp",
          "minutes": 90,
          "acceptance": [
            "Báo mean/effect size và kiểm định với giả định rõ.",
            "Không coi p-value là xác suất giả thuyết đúng, không kết luận nhân quả từ tương quan."
          ]
        }
      ]
    },
    {
      "id": "scientist.math",
      "title": "Loss, gradient và đại số tuyến tính",
      "phase": "foundation",
      "description": "Vector trọng số, hồi quy và gradient descent.",
      "outcome": "Linear model NumPy có gradient được kiểm tra.",
      "prerequisiteIds": [
        "scientist.arrays",
        "scientist.statistics"
      ],
      "resourceIds": [
        "scientist.resource.linear-regression"
      ],
      "defaultResourceId": "scientist.resource.linear-regression",
      "optional": false,
      "work": [
        {
          "id": "scientist.math.gradient",
          "revision": 1,
          "title": "Kiểm tra gradient MSE",
          "minutes": 90,
          "acceptance": [
            "Dữ liệu y=2x+1 có seed; analytic gradient khớp finite difference trong 1e-4.",
            "Ghi shape X/w và công thức loss."
          ]
        },
        {
          "id": "scientist.math.fit",
          "revision": 1,
          "title": "Huấn luyện linear regression NumPy",
          "minutes": 90,
          "acceptance": [
            "Loss cuối thấp hơn đầu; vẽ loss theo bước.",
            "Test learning rate quá lớn và giải thích phân kỳ."
          ]
        }
      ]
    },
    {
      "id": "scientist.evaluation",
      "title": "Split, baseline và đánh giá",
      "phase": "build",
      "description": "Train/CV/test, Pipeline và metric; nền chung các track.",
      "outcome": "Baseline tái lập, không leakage.",
      "prerequisiteIds": [
        "scientist.tables",
        "scientist.math"
      ],
      "resourceIds": [
        "scientist.resource.leakage",
        "scientist.resource.evaluation"
      ],
      "defaultResourceId": "scientist.resource.leakage",
      "optional": false,
      "work": [
        {
          "id": "scientist.evaluation.baseline",
          "revision": 1,
          "title": "Tạo split và baseline classification",
          "minutes": 120,
          "acceptance": [
            "make_classification có seed, train/test stratified; Pipeline fit preprocessing chỉ train.",
            "CV trên train so DummyClassifier/LogisticRegression, test giữ kín tới cuối."
          ]
        },
        {
          "id": "scientist.evaluation.metrics",
          "revision": 1,
          "title": "Đánh giá holdout và phân tích lỗi",
          "minutes": 90,
          "acceptance": [
            "Xuất confusion matrix, precision/recall/F1 và 5 dự đoán sai.",
            "Nêu metric cho lớp thiểu số; không tuning trên test."
          ]
        }
      ]
    },
    {
      "id": "scientist.responsible-data",
      "title": "Trách nhiệm dữ liệu",
      "phase": "build",
      "description": "License, privacy, bias và giới hạn dùng.",
      "outcome": "Data sheet và audit có số mẫu.",
      "prerequisiteIds": [
        "scientist.evaluation"
      ],
      "resourceIds": [
        "scientist.resource.fairness"
      ],
      "defaultResourceId": "scientist.resource.fairness",
      "optional": false,
      "work": [
        {
          "id": "scientist.responsible-data.audit",
          "revision": 1,
          "title": "Audit recall theo hai nhóm giả lập",
          "minutes": 90,
          "acceptance": [
            "Báo recall/sample count mỗi nhóm; nêu nhóm ít mẫu.",
            "Không thu thuộc tính nhạy cảm thật hoặc khẳng định công bằng tuyệt đối."
          ]
        },
        {
          "id": "scientist.responsible-data.sheet",
          "revision": 1,
          "title": "Viết data sheet dự án",
          "minutes": 60,
          "acceptance": [
            "Có nguồn/license/schema/split và intended use.",
            "Repo không chứa PII/secrets; nêu policy công bố dữ liệu."
          ]
        }
      ]
    },
    {
      "id": "scientist.sql",
      "title": "SQL phân tích dữ liệu",
      "phase": "build",
      "description": "Queries, joins, aggregate và NULL.",
      "outcome": "SQL có expected output đối chiếu pandas.",
      "prerequisiteIds": [
        "scientist.tables"
      ],
      "resourceIds": [
        "scientist.resource.sql"
      ],
      "defaultResourceId": "scientist.resource.sql",
      "optional": false,
      "work": [
        {
          "id": "scientist.sql.queries",
          "revision": 1,
          "title": "Tính doanh thu theo tháng bằng SQL",
          "minutes": 90,
          "acceptance": [
            "Schema customers/orders PK/FK, JOIN/GROUP BY/lọc.",
            "Tổng khớp pandas trên cùng dữ liệu."
          ]
        },
        {
          "id": "scientist.sql.edge",
          "revision": 1,
          "title": "Test NULL và quan hệ một-nhiều",
          "minutes": 60,
          "acceptance": [
            "Fixture khách không đơn, NULL và nhiều đơn.",
            "Không đếm trùng; lưu SQL và expected output."
          ]
        }
      ]
    },
    {
      "id": "scientist.visualization",
      "title": "EDA và trực quan hóa",
      "phase": "build",
      "description": "Biểu đồ có câu hỏi, đơn vị và diễn giải.",
      "outcome": "EDA trả lời ba câu hỏi.",
      "prerequisiteIds": [
        "scientist.tables",
        "scientist.statistics"
      ],
      "resourceIds": [
        "scientist.resource.plots"
      ],
      "defaultResourceId": "scientist.resource.plots",
      "optional": false,
      "work": [
        {
          "id": "scientist.visualization.eda",
          "revision": 1,
          "title": "Vẽ histogram, scatter và biểu đồ nhóm",
          "minutes": 90,
          "acceptance": [
            "3 câu hỏi gắn 3 biểu đồ với nhãn/đơn vị.",
            "Có bảng số liệu đối chiếu, export PNG đọc được."
          ]
        },
        {
          "id": "scientist.visualization.outlier",
          "revision": 1,
          "title": "Phân tích hai ngoại lệ",
          "minutes": 60,
          "acceptance": [
            "Nêu giữ/loại outlier và tác động kết quả.",
            "Phân biệt mô tả/tương quan với nhân quả."
          ]
        }
      ]
    },
    {
      "id": "scientist.report",
      "title": "Báo cáo Data Science tái lập",
      "phase": "ship",
      "description": "Ghép phân tích và mô hình cho người đọc.",
      "outcome": "Repo phân tích có báo cáo và lệnh tái lập.",
      "prerequisiteIds": [
        "scientist.evaluation",
        "scientist.responsible-data",
        "scientist.sql",
        "scientist.visualization"
      ],
      "resourceIds": [
        "scientist.resource.evaluation",
        "scientist.resource.plots"
      ],
      "defaultResourceId": "scientist.resource.evaluation",
      "optional": false,
      "work": [
        {
          "id": "scientist.report.reproduce",
          "revision": 1,
          "title": "Đóng gói pipeline phân tích",
          "minutes": 120,
          "acceptance": [
            "Môi trường mới chạy một lệnh tạo clean data, metrics.json và 3 biểu đồ.",
            "Ghi versions/seed; notebook chạy từ đầu không cell ngầm."
          ]
        },
        {
          "id": "scientist.report.brief",
          "revision": 1,
          "title": "Viết báo cáo kết luận",
          "minutes": 90,
          "acceptance": [
            "Nêu câu hỏi, data sheet, baseline/model metrics và 5 lỗi.",
            "3 hạn chế và bước kiểm chứng tiếp; không tự nhận production."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "scientist.resource.python",
      "title": "Python Tutorial",
      "provider": "Python Software Foundation",
      "url": "https://docs.python.org/3/tutorial/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; cần biết lập trình cơ bản. Python 3 local, CPU, không tài khoản/API.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.numpy",
      "title": "NumPy absolute basics",
      "provider": "NumPy",
      "url": "https://numpy.org/doc/stable/user/absolute_beginners.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; cài NumPy trong Python tương thích, bài dữ liệu nhỏ chạy CPU.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.pandas",
      "title": "pandas getting started tutorials",
      "provider": "pandas",
      "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; cài pandas, CSV tổng hợp; không dữ liệu cá nhân.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.scipy-stats",
      "title": "Statistics with scipy.stats",
      "provider": "SciPy",
      "url": "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; cần NumPy, trung bình/phương sai; CPU và seed cố định. Trang hướng dẫn còn phát triển.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.linear-regression",
      "title": "Linear regression and loss",
      "provider": "Google",
      "url": "https://developers.google.com/machine-learning/crash-course/linear-regression",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Module công khai miễn phí; cần đại số/Python/NumPy. Bài tổng hợp chạy CPU, không API/GPU.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.evaluation",
      "title": "Metrics and scoring",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/modules/model_evaluation.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; scikit-learn và dữ liệu nhỏ CPU. Không dịch vụ ngoài.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.leakage",
      "title": "Common pitfalls and leakage",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/common_pitfalls.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; cần dữ liệu bảng/Python; không fit preprocessing trên test.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.fairness",
      "title": "ML fairness",
      "provider": "Google",
      "url": "https://developers.google.com/machine-learning/crash-course/fairness",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Module miễn phí, học sau phân loại/đánh giá. Bài dùng nhóm giả lập, không thu thập thuộc tính nhạy cảm thật.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.sql",
      "title": "PostgreSQL SQL tutorial",
      "provider": "PostgreSQL Global Development Group",
      "url": "https://www.postgresql.org/docs/current/tutorial-sql.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; PostgreSQL local, không cần thuê cloud.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "scientist.resource.plots",
      "title": "Pyplot tutorial",
      "provider": "Matplotlib",
      "url": "https://matplotlib.org/stable/tutorials/pyplot.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; Python/Matplotlib CPU, xuất PNG không cần notebook online.",
      "checkedAt": "2026-10-06"
    }
  ],
  "credentials": [
    {
      "id": "scientist.credential.ml-specialization",
      "name": "Machine Learning Specialization (tùy chọn)",
      "provider": "Stanford Online / DeepLearning.AI trên Coursera",
      "kind": "program_certificate",
      "url": "https://www.coursera.org/specializations/machine-learning-introduction",
      "cost": "paid",
      "prerequisites": "Python/đại số cơ bản và account Coursera; không bắt buộc mua để làm portfolio.",
      "requirements": "Hoàn thành cả 3 khóa và programming assignments; certificate cần gói trả phí. FAQ hiển thị 49 USD/tháng ngày kiểm tra; giá/thuế/khuyến mại ở checkout có thể khác. Không phải university credit.",
      "checkedAt": "2026-10-06"
    }
  ],
  "tracks": [
    {
      "id": "scientist.python",
      "pathId": "scientist",
      "label": "Python / Thống kê / Mô hình",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "scientist.sql",
        "scientist.visualization",
        "scientist.report"
      ],
      "credentialIds": [
        "scientist.credential.ml-specialization"
      ],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
        }
      ],
      "portfolio": {
        "title": "Phân tích giao dịch và dự đoán có báo cáo",
        "acceptance": [
          "Dataset được phép/tổng hợp có data sheet/SQL/cleaning tests.",
          "3 biểu đồ trả lời 3 câu hỏi; thống kê ghi giả định/giới hạn.",
          "Baseline/model có split không leakage, metrics và 5 lỗi.",
          "Môi trường sạch chạy lại một lệnh tạo metrics/báo cáo; không bắt buộc mua chứng nhận."
        ]
      }
    }
  ]
};
