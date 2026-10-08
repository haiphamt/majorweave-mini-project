import type { ContentPack } from '../../domain/contracts';

// Depends on analystPack's shared Data foundations/resources; no copied stages.
export const engineerPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-07.mw-team-04.1",
  "pathId": "engineer",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "engineer.ingest",
      "title": "Hợp đồng nguồn và nạp batch",
      "phase": "build",
      "prerequisiteIds": [
        "data.sql",
        "data.python-files"
      ],
      "resourceIds": [
        "resource.engineer-copy",
        "resource.data-python"
      ],
      "defaultResourceId": "resource.engineer-copy",
      "description": "Nạp file vào staging với schema, provenance và xử lý lỗi.",
      "outcome": "Pipeline raw → staging có kiểm tra và chạy lại an toàn.",
      "optional": false,
      "work": [
        {
          "id": "engineer.ingest.contract",
          "revision": 1,
          "title": "Định nghĩa hợp đồng CSV sự kiện đơn hàng",
          "minutes": 75,
          "acceptance": [
            "Schema có event_id/order_id/event_time/status/amount; ghi timezone, null và khóa.",
            "Tạo 50 sự kiện giả lập chia hai ngày, gồm trùng ID và dòng sai.",
            "Ghi layout raw theo ngày và quy tắc giữ file nguồn bất biến."
          ]
        },
        {
          "id": "engineer.ingest.load",
          "revision": 1,
          "title": "Nạp staging và cách ly dòng lỗi",
          "minutes": 120,
          "acceptance": [
            "Python kiểm tra schema rồi COPY/load vào bảng staging PostgreSQL.",
            "Ghi số dòng nhận/từ chối và nguyên nhân; không mất raw.",
            "Chạy lại cùng batch không nhân bản event_id; kiểm tra row count."
          ]
        }
      ]
    },
    {
      "id": "engineer.transform",
      "title": "Biến đổi và nạp tăng dần",
      "phase": "build",
      "prerequisiteIds": [
        "engineer.ingest"
      ],
      "resourceIds": [
        "resource.data-postgres",
        "resource.engineer-window"
      ],
      "defaultResourceId": "resource.data-postgres",
      "description": "Xử lý sự kiện trùng/muộn và xây bảng phục vụ truy vấn.",
      "outcome": "SQL biến đổi idempotent với kiểm thử reconciliation.",
      "optional": false,
      "work": [
        {
          "id": "engineer.transform.incremental",
          "revision": 1,
          "title": "Lấy trạng thái cuối cho mỗi đơn hàng",
          "minutes": 120,
          "acceptance": [
            "Dùng thứ tự event_time và tie-break event_id; thử sự kiện đến muộn.",
            "Chạy lại cùng input cho cùng kết quả; đối chiếu raw/staging/mart.",
            "Có case hủy đơn, NULL và trùng thời điểm; không cộng lại doanh thu cũ."
          ]
        }
      ]
    },
    {
      "id": "engineer.orchestration",
      "title": "Điều phối Airflow và phục hồi",
      "phase": "build",
      "prerequisiteIds": [
        "engineer.transform"
      ],
      "resourceIds": [
        "resource.engineer-airflow"
      ],
      "defaultResourceId": "resource.engineer-airflow",
      "description": "DAG phụ thuộc rõ ràng, retry và chạy lại ngày cụ thể.",
      "outcome": "Một DAG batch có log và mô phỏng lỗi.",
      "optional": false,
      "work": [
        {
          "id": "engineer.orchestration.dag",
          "revision": 1,
          "title": "Tạo DAG ingest → transform → quality",
          "minutes": 120,
          "acceptance": [
            "DAG nhận ngày dữ liệu, không dùng thời gian chạy làm ngày dữ liệu ngầm định.",
            "Cố ý gây lỗi ingest; downstream không xuất mart thành công.",
            "Retry/chạy lại ngày cũ không tạo dữ liệu trùng; chụp log chứng minh."
          ]
        }
      ]
    },
    {
      "id": "engineer.batch-delivery",
      "title": "Chất lượng và bàn giao batch pipeline",
      "phase": "ship",
      "prerequisiteIds": [
        "engineer.orchestration"
      ],
      "resourceIds": [
        "resource.data-quality",
        "resource.engineer-airflow"
      ],
      "defaultResourceId": "resource.data-quality",
      "description": "Đo freshness, completeness và lưu quy trình phục hồi.",
      "outcome": "Repo pipeline có dữ liệu thử, kiểm tra và runbook.",
      "optional": false,
      "work": [
        {
          "id": "engineer.batch-delivery.checks",
          "revision": 1,
          "title": "Thêm quality gate và báo cáo chạy",
          "minutes": 90,
          "acceptance": [
            "Kiểm tra unique event_id, not-null khóa, amount hợp lệ và freshness.",
            "Batch không đạt gate không được báo publish thành công.",
            "Ghi row counts/raw-to-mart reconciliation và thời gian dữ liệu mới nhất."
          ]
        },
        {
          "id": "engineer.batch-delivery.runbook",
          "revision": 1,
          "title": "Bàn giao pipeline chạy hai ngày",
          "minutes": 90,
          "acceptance": [
            "Có setup, version Python/PostgreSQL/Airflow, lệnh chạy và nguồn dữ liệu giả.",
            "Runbook mô tả backfill, lỗi schema, retry và nơi xem log.",
            "Người khác chạy lại hai batch và kiểm tra idempotence được; không cần cloud."
          ]
        }
      ]
    },
    {
      "id": "engineer.kafka",
      "title": "Kafka, partition và consumer offset",
      "phase": "build",
      "prerequisiteIds": [
        "engineer.batch-delivery"
      ],
      "resourceIds": [
        "resource.engineer-kafka"
      ],
      "defaultResourceId": "resource.engineer-kafka",
      "description": "Đưa sự kiện vào topic, đọc theo consumer group và kiểm tra phát lại.",
      "outcome": "Lab Kafka có key, offset và dữ liệu lỗi.",
      "optional": false,
      "work": [
        {
          "id": "engineer.kafka.events",
          "revision": 1,
          "title": "Tạo topic và gửi sự kiện đơn hàng",
          "minutes": 120,
          "acceptance": [
            "Chạy Kafka local theo quickstart; ghi phiên bản và lệnh start/stop.",
            "Gửi 30 sự kiện có key order_id; quan sát partition và offset.",
            "Consumer dừng/chạy lại; ghi cách reset offset trong topic thử và không chạy lệnh xóa ngoài lab."
          ]
        },
        {
          "id": "engineer.kafka.contract",
          "revision": 1,
          "title": "Kiểm tra schema và bản tin trùng",
          "minutes": 90,
          "acceptance": [
            "Thêm một bản tin thiếu key và một event_id trùng; định nghĩa cách quarantine/dedup.",
            "Nêu ordering chỉ trong partition và vì sao cần key ổn định.",
            "Lưu input và expected output cho bước stream processing."
          ]
        }
      ]
    },
    {
      "id": "engineer.streaming-process",
      "title": "Event time, watermark và checkpoint",
      "phase": "build",
      "prerequisiteIds": [
        "engineer.kafka"
      ],
      "resourceIds": [
        "resource.engineer-spark"
      ],
      "defaultResourceId": "resource.engineer-spark",
      "description": "Tổng hợp dòng sự kiện theo cửa sổ với giới hạn dữ liệu muộn.",
      "outcome": "Job PySpark có checkpoint riêng và kiểm tra replay.",
      "optional": false,
      "work": [
        {
          "id": "engineer.streaming-process.window",
          "revision": 1,
          "title": "Tổng hợp doanh thu theo cửa sổ sự kiện",
          "minutes": 120,
          "acceptance": [
            "Đọc Kafka với schema rõ; xử lý event_time theo UTC và tổng hợp cửa sổ 5 phút.",
            "Đặt watermark có giải thích; thử sự kiện đúng giờ, muộn trong ngưỡng và quá ngưỡng.",
            "Lưu expected output theo từng case; không dùng processing time thay event time."
          ]
        },
        {
          "id": "engineer.streaming-process.restart",
          "revision": 1,
          "title": "Thử restart và đầu ra không nhân bản",
          "minutes": 120,
          "acceptance": [
            "Dùng checkpoint riêng cho lab; dừng/chạy lại job cùng input.",
            "Sink có key cửa sổ/nhóm hoặc thao tác ghi idempotent; chứng minh doanh thu không tăng vì replay.",
            "Nêu giới hạn đảm bảo phụ thuộc source/sink, không tuyên bố exactly-once vô điều kiện."
          ]
        }
      ]
    },
    {
      "id": "engineer.streaming-delivery",
      "title": "Giám sát và bàn giao streaming",
      "phase": "ship",
      "prerequisiteIds": [
        "engineer.streaming-process"
      ],
      "resourceIds": [
        "resource.engineer-kafka",
        "resource.engineer-spark"
      ],
      "defaultResourceId": "resource.engineer-kafka",
      "description": "Đối chiếu batch/stream và quy trình xử lý backlog, dữ liệu muộn.",
      "outcome": "Demo pipeline sự kiện và runbook vận hành.",
      "optional": false,
      "work": [
        {
          "id": "engineer.streaming-delivery.audit",
          "revision": 1,
          "title": "Đối chiếu kết quả và diễn tập phục hồi",
          "minutes": 120,
          "acceptance": [
            "So tổng streaming với batch trên cùng tập event và cùng chính sách lateness/dedup.",
            "Ghi lag, rejected records, watermark và quy tắc cảnh báo khi consumer dừng.",
            "README có diagram, setup local, lệnh replay, expected output và giới hạn dữ liệu muộn."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.engineer-copy",
      "title": "PostgreSQL COPY",
      "provider": "PostgreSQL",
      "url": "https://www.postgresql.org/docs/current/sql-copy.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; cần PostgreSQL local và quyền nạp dữ liệu phù hợp; dùng database thử.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.engineer-window",
      "title": "PostgreSQL Window Functions",
      "provider": "PostgreSQL",
      "url": "https://www.postgresql.org/docs/current/tutorial-window.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; học sau SELECT/JOIN/GROUP BY.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.engineer-airflow",
      "title": "Airflow 101: Building Your First Workflow",
      "provider": "Apache Airflow",
      "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu/phần mềm mở; lab cần môi trường Airflow tương thích (Linux/WSL/container trên Windows). Ghi version vì API thay đổi.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.engineer-kafka",
      "title": "Apache Kafka Quickstart",
      "provider": "Apache Kafka",
      "url": "https://kafka.apache.org/quickstart/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu/phần mềm mở; chạy local theo tùy chọn Java/container ở quickstart, cần tài nguyên máy cho broker.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.engineer-spark",
      "title": "Structured Streaming: DataFrame APIs",
      "provider": "Apache Spark",
      "url": "https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "advanced",
      "accessNote": "Tài liệu/phần mềm mở; lab cần Java/PySpark và Kafka connector tương thích version, dùng local checkpoint riêng.",
      "checkedAt": "2026-10-07"
    }
  ],
  "credentials": [
    {
      "id": "credential.engineer-aws",
      "name": "AWS Certified Data Engineer – Associate",
      "provider": "Amazon Web Services",
      "kind": "exam_certificate",
      "url": "https://aws.amazon.com/certification/certified-data-engineer-associate/",
      "cost": "paid",
      "prerequisites": "Mục tiêu sau portfolio: AWS khuyến nghị 2–3 năm data engineering/architecture và 1–2 năm thực hành AWS; đây không phải điều kiện của bài mini.",
      "requirements": "Thi chứng chỉ theo AWS/Pearson VUE; trang công bố phí 150 USD, cần kiểm tra thuế/tỷ giá hiện hành. Pipeline local chưa bao phủ đủ dịch vụ AWS để sẵn sàng thi.",
      "checkedAt": "2026-10-07"
    }
  ],
  "tracks": [
    {
      "id": "engineer.batch",
      "pathId": "engineer",
      "label": "Batch pipeline",
      "stageIds": [
        "data.quality",
        "data.sql",
        "language.python",
        "data.python-files",
        "engineer.ingest",
        "engineer.transform",
        "engineer.orchestration",
        "engineer.batch-delivery"
      ],
      "credentialIds": [
        "credential.engineer-aws"
      ],
      "roadmapLinks": [
        {
          "label": "Airflow: workflow cơ bản",
          "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html"
        }
      ],
      "portfolio": {
        "title": "Pipeline đơn hàng batch có thể chạy lại",
        "acceptance": [
          "Raw/staging/mart, schema và dữ liệu thử có lỗi.",
          "DAG ingest/transform/quality với backfill/retry idempotent.",
          "Quality report, đối chiếu SQL và runbook phục hồi."
        ]
      }
    },
    {
      "id": "engineer.streaming",
      "pathId": "engineer",
      "label": "Streaming / Kafka",
      "stageIds": [
        "data.quality",
        "data.sql",
        "language.python",
        "data.python-files",
        "engineer.ingest",
        "engineer.transform",
        "engineer.orchestration",
        "engineer.batch-delivery",
        "engineer.kafka",
        "engineer.streaming-process",
        "engineer.streaming-delivery"
      ],
      "credentialIds": [
        "credential.engineer-aws"
      ],
      "roadmapLinks": [
        {
          "label": "Kafka: lab bắt đầu",
          "url": "https://kafka.apache.org/quickstart/"
        },
        {
          "label": "Spark: streaming APIs",
          "url": "https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html"
        }
      ],
      "portfolio": {
        "title": "Pipeline sự kiện Kafka và PySpark",
        "acceptance": [
          "Hoàn thành nền batch trước streaming; event contract và partition key.",
          "Window/watermark/checkpoint, thử late/duplicate/restart và kiểm tra sink idempotent.",
          "Đối chiếu batch, lag/quality report, sơ đồ và runbook."
        ]
      }
    }
  ]
};
