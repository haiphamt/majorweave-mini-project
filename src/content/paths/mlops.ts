import type { ContentPack } from '../../domain/contracts';

// Sources verified in docs/tasks/MW-TEAM-03/SOURCES.json.
// Cross-pack IDs resolve through the single integrated registry.
export const mlopsPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-06.mw-team-03.2",
  "pathId": "mlops",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "mlops.reproducibility",
      "title": "Git và môi trường tái lập",
      "phase": "foundation",
      "description": "Version code/config/dependency trước serving.",
      "outcome": "Repo train/inference tái lập.",
      "prerequisiteIds": [
        "ml.classical.models"
      ],
      "resourceIds": [
        "mlops.resource.git",
        "mlops.resource.venv"
      ],
      "defaultResourceId": "mlops.resource.git",
      "optional": false,
      "work": [
        {
          "id": "mlops.reproducibility.env",
          "revision": 1,
          "title": "Đóng gói môi trường training local",
          "minutes": 90,
          "acceptance": [
            "venv, Python/dependency versions, seed/config; chạy train từ shell.",
            "Không absolute path/secrets/venv trong Git."
          ]
        },
        {
          "id": "mlops.reproducibility.trace",
          "revision": 1,
          "title": "Gắn run với code và dữ liệu",
          "minutes": 60,
          "acceptance": [
            "Metadata có commit/config/data hash; hai run cùng seed metric trong tolerance đã ghi.",
            "README lệnh tái lập và nondeterminism limits."
          ]
        }
      ]
    },
    {
      "id": "mlops.tracking",
      "title": "MLflow experiment tracking",
      "phase": "build",
      "description": "Params/metrics/artifacts local và so run.",
      "outcome": "Ba runs có provenance.",
      "prerequisiteIds": [
        "mlops.reproducibility"
      ],
      "resourceIds": [
        "mlops.resource.tracking"
      ],
      "defaultResourceId": "mlops.resource.tracking",
      "optional": false,
      "work": [
        {
          "id": "mlops.tracking.runs",
          "revision": 1,
          "title": "Log ba run scikit-learn bằng MLflow",
          "minutes": 120,
          "acceptance": [
            "Mỗi run có params/F1/seed/data hash/model artifact.",
            "So 3 run bằng UI/query local; không log key/PII."
          ]
        },
        {
          "id": "mlops.tracking.select",
          "revision": 1,
          "title": "Chọn model theo tiêu chí validation",
          "minutes": 90,
          "acceptance": [
            "Lưu lý do chọn theo validation và latency.",
            "Run ID/config rõ, test giữ kín tới đánh giá cuối."
          ]
        }
      ]
    },
    {
      "id": "mlops.artifacts",
      "title": "Artifact và tính toàn vẹn",
      "phase": "build",
      "description": "Trusted loading, compatibility và checksum.",
      "outcome": "Manifest model truy được code/data/run.",
      "prerequisiteIds": [
        "mlops.tracking"
      ],
      "resourceIds": [
        "mlops.resource.persistence"
      ],
      "defaultResourceId": "mlops.resource.persistence",
      "optional": false,
      "work": [
        {
          "id": "mlops.artifacts.manifest",
          "revision": 1,
          "title": "Tạo manifest model và SHA256",
          "minutes": 90,
          "acceptance": [
            "Model hash, Python/libraries/data hash/run ID có đủ.",
            "Load artifact tự tạo cho output khớp model gốc."
          ]
        },
        {
          "id": "mlops.artifacts.reject",
          "revision": 1,
          "title": "Test artifact hỏng và schema sai",
          "minutes": 90,
          "acceptance": [
            "Checksum sai/missing model/request schema sai bị chặn.",
            "Không download/load pickle tùy ý; nêu rủi ro loading."
          ]
        }
      ]
    },
    {
      "id": "mlops.api",
      "title": "FastAPI model serving",
      "phase": "build",
      "description": "Schema, health, batch nhỏ và lỗi inference.",
      "outcome": "API local có test hợp đồng.",
      "prerequisiteIds": [
        "mlops.artifacts"
      ],
      "resourceIds": [
        "mlops.resource.fastapi"
      ],
      "defaultResourceId": "mlops.resource.fastapi",
      "optional": false,
      "work": [
        {
          "id": "mlops.api.endpoint",
          "revision": 1,
          "title": "Viết /predict và /health",
          "minutes": 120,
          "acceptance": [
            "Input đúng trả prediction/model version; sai field trả validation.",
            "Load model một lần; health phản ánh load thành công."
          ]
        },
        {
          "id": "mlops.api.tests",
          "revision": 1,
          "title": "Test API và giới hạn batch",
          "minutes": 90,
          "acceptance": [
            "Test success/missing/type/NaN/batch quá lớn/model unavailable.",
            "Không lộ stack/key; README ghi batch limit."
          ]
        }
      ]
    },
    {
      "id": "mlops.container",
      "title": "Container inference local",
      "phase": "ship",
      "description": "Runtime và cold start, không bắt buộc cloud.",
      "outcome": "Image API chạy smoke test.",
      "prerequisiteIds": [
        "mlops.api"
      ],
      "resourceIds": [
        "mlops.resource.containers"
      ],
      "defaultResourceId": "mlops.resource.containers",
      "optional": false,
      "work": [
        {
          "id": "mlops.container.image",
          "revision": 1,
          "title": "Viết Dockerfile cho API model",
          "minutes": 120,
          "acceptance": [
            "Build/run local, /health và /predict hoạt động; non-root khi runtime hỗ trợ.",
            "Pin dependencies, không copy secrets/data thừa; ghi CPU/RAM và license Docker."
          ]
        },
        {
          "id": "mlops.container.smoke",
          "revision": 1,
          "title": "Smoke test container và shutdown",
          "minutes": 90,
          "acceptance": [
            "Script start/wait/health/predict/stop; input sai bị chặn.",
            "Bind localhost, kiểm tra restart/load và batch limits."
          ]
        }
      ]
    },
    {
      "id": "mlops.monitoring",
      "title": "Latency, lỗi và drift mô phỏng",
      "phase": "build",
      "description": "System metrics tách quality cần nhãn.",
      "outcome": "Metrics/alert và drift runbook.",
      "prerequisiteIds": [
        "mlops.api"
      ],
      "resourceIds": [
        "mlops.resource.monitoring",
        "scientist.resource.scipy-stats"
      ],
      "defaultResourceId": "mlops.resource.monitoring",
      "optional": false,
      "work": [
        {
          "id": "mlops.monitoring.metrics",
          "revision": 1,
          "title": "Instrument request/error/latency",
          "minutes": 120,
          "acceptance": [
            "20 requests đúng/5 lỗi, counters khớp; latency p50/p95.",
            "Metrics có model version, không log payload cá nhân."
          ]
        },
        {
          "id": "mlops.monitoring.drift",
          "revision": 1,
          "title": "Mô phỏng drift và viết runbook",
          "minutes": 90,
          "acceptance": [
            "So reference/current feature, cảnh báo theo threshold định trước.",
            "Drift không tự chứng minh accuracy giảm; runbook xác minh và rollback."
          ]
        }
      ]
    },
    {
      "id": "mlops.data-versioning",
      "title": "DVC data versioning",
      "phase": "build",
      "description": "Git metadata/DVC snapshot local.",
      "outcome": "Hai dataset version có hash.",
      "prerequisiteIds": [
        "mlops.reproducibility"
      ],
      "resourceIds": [
        "mlops.resource.data-versioning"
      ],
      "defaultResourceId": "mlops.resource.data-versioning",
      "optional": false,
      "work": [
        {
          "id": "mlops.data-versioning.versions",
          "revision": 1,
          "title": "Version hai CSV bằng DVC",
          "minutes": 90,
          "acceptance": [
            "Git giữ metadata; checkout hai version có hash/row count khác.",
            "Local remote, license/location rõ; không cloud bắt buộc."
          ]
        },
        {
          "id": "mlops.data-versioning.schema",
          "revision": 1,
          "title": "Test schema trước train",
          "minutes": 90,
          "acceptance": [
            "Thiếu cột/nhãn sai/duplicate/null theo policy có test.",
            "Input sai chặn training, báo lỗi với số dòng."
          ]
        }
      ]
    },
    {
      "id": "mlops.pipeline.dag",
      "title": "Pipeline train/evaluate tái lập",
      "phase": "build",
      "description": "DAG prepare/train/evaluate và invalidation.",
      "outcome": "Pipeline rerun đúng stage.",
      "prerequisiteIds": [
        "mlops.data-versioning",
        "mlops.tracking"
      ],
      "resourceIds": [
        "mlops.resource.pipelines"
      ],
      "defaultResourceId": "mlops.resource.pipelines",
      "optional": false,
      "work": [
        {
          "id": "mlops.pipeline.dag.dag",
          "revision": 1,
          "title": "Khai báo DAG DVC",
          "minutes": 120,
          "acceptance": [
            "dvc repro tạo clean/model/metrics; deps/outputs/params khai báo.",
            "Seed/config version hóa; không tuning test."
          ]
        },
        {
          "id": "mlops.pipeline.dag.rebuild",
          "revision": 1,
          "title": "Test invalidation data/config",
          "minutes": 90,
          "acceptance": [
            "Input giữ nguyên không train lại; đổi data/param chạy stage phụ thuộc.",
            "Log/hash trước-sau chứng minh model đúng data version."
          ]
        }
      ]
    },
    {
      "id": "mlops.ci",
      "title": "Pipeline test và CI",
      "phase": "ship",
      "description": "Schema/metric gate trước artifact publish.",
      "outcome": "CI hoặc local equivalent phát hiện lỗi.",
      "prerequisiteIds": [
        "mlops.pipeline.dag",
        "mlops.artifacts"
      ],
      "resourceIds": [
        "mlops.resource.python-ci"
      ],
      "defaultResourceId": "mlops.resource.python-ci",
      "optional": false,
      "work": [
        {
          "id": "mlops.ci.workflow",
          "revision": 1,
          "title": "Viết workflow test Python pipeline",
          "minutes": 120,
          "acceptance": [
            "Checkout/setup/install/test với fixture CPU; lệnh tương đương chạy local.",
            "Không cần cloud secrets; cache không bỏ test."
          ]
        },
        {
          "id": "mlops.ci.gate",
          "revision": 1,
          "title": "Test metric gate và checksum",
          "minutes": 90,
          "acceptance": [
            "Metric dưới ngưỡng/checksum sai làm job fail; case tốt pass.",
            "Threshold từ baseline định trước; không sửa assertion để né lỗi."
          ]
        }
      ]
    },
    {
      "id": "mlops.lifecycle",
      "title": "Model version, promote và rollback",
      "phase": "ship",
      "description": "Gate/pointer model và rollback local.",
      "outcome": "Hai model versions có diễn tập rollback.",
      "prerequisiteIds": [
        "mlops.ci"
      ],
      "resourceIds": [
        "mlops.resource.registry"
      ],
      "defaultResourceId": "mlops.resource.registry",
      "optional": false,
      "work": [
        {
          "id": "mlops.lifecycle.versions",
          "revision": 1,
          "title": "Đăng ký hai model versions local",
          "minutes": 120,
          "acceptance": [
            "Version/run/data hash; alias hoặc pointer champion trỏ version đạt gate.",
            "Không promote thiếu manifest/metric; ghi MLflow backend."
          ]
        },
        {
          "id": "mlops.lifecycle.rollback",
          "revision": 1,
          "title": "Diễn tập promote/rollback",
          "minutes": 90,
          "acceptance": [
            "Promote v2 rồi rollback v1; input cố định cho output đúng version.",
            "Test lỗi load/regression và runbook, không ghi đè artifact cũ."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "mlops.resource.git",
      "title": "Version control fundamentals",
      "provider": "Git project",
      "url": "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Sách miễn phí; Git local, không bắt buộc repo public.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.venv",
      "title": "Python virtual environments",
      "provider": "Python Software Foundation",
      "url": "https://docs.python.org/3/library/venv.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; Python 3/quyền tạo thư mục local; ghi phiên bản dependencies.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.tracking",
      "title": "MLflow Tracking Quickstart",
      "provider": "MLflow",
      "url": "https://mlflow.org/docs/latest/ml/tracking/quickstart/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; MLflow local, không cần hosted trả phí. Không mở server local ra Internet.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.persistence",
      "title": "Model persistence",
      "provider": "scikit-learn",
      "url": "https://scikit-learn.org/stable/model_persistence.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; chỉ load artifact tự tạo/tin cậy, có checksum/environment. Không load pickle của người lạ.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.fastapi",
      "title": "FastAPI request body",
      "provider": "FastAPI",
      "url": "https://fastapi.tiangolo.com/tutorial/body/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; Python/FastAPI local, không cloud/API trả tiền.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.containers",
      "title": "Build a containerized application",
      "provider": "Docker",
      "url": "https://docs.docker.com/get-started/tutorials/run-an-app/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; Docker/virtualization local. Windows kiểm tra WSL2/Hyper-V/RAM theo trang cài đặt; Docker Desktop miễn phí cho giáo dục/cá nhân theo điều kiện license, trường hợp doanh nghiệp cần kiểm tra subscription. Không bắt buộc cloud.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.monitoring",
      "title": "Prometheus overview",
      "provider": "Prometheus",
      "url": "https://prometheus.io/docs/introduction/overview/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; Prometheus local để đo request/error/latency, không thuê hosted service.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.data-versioning",
      "title": "DVC get started",
      "provider": "DVC",
      "url": "https://doc.dvc.org/start",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; Git/DVC/filesystem local. Cloud remote không bắt buộc; phí/quyền riêng nếu dùng.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.pipelines",
      "title": "DVC data pipelines",
      "provider": "DVC",
      "url": "https://doc.dvc.org/start/data-pipelines",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; DVC local, pipeline nhỏ CPU, không cần bucket cloud.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.python-ci",
      "title": "Build and test Python with GitHub Actions",
      "provider": "GitHub",
      "url": "https://docs.github.com/en/actions/tutorials/build-and-test-code/python",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Actions cần tài khoản/repo. Standard runner public miễn phí theo billing; private có quota, larger runner có phí. Có lệnh chạy test local tương đương.",
      "checkedAt": "2026-10-06"
    },
    {
      "id": "mlops.resource.registry",
      "title": "MLflow Model Registry tutorials",
      "provider": "MLflow",
      "url": "https://mlflow.org/docs/latest/ml/model-registry/tutorial/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; MLflow local với backend phù hợp phiên bản, không hosted subscription.",
      "checkedAt": "2026-10-06"
    }
  ],
  "credentials": [
    {
      "id": "mlops.credential.aws-mla",
      "name": "AWS Certified Machine Learning Engineer – Associate (tùy chọn nâng cao)",
      "provider": "Amazon Web Services",
      "kind": "exam_certificate",
      "url": "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/",
      "cost": "paid",
      "prerequisites": "Nhà cung cấp hướng tới ít nhất 1 năm ML engineering/AWS hands-on; không phải nhập môn. Bài local không cần AWS account.",
      "requirements": "Đạt kỳ thi theo hướng dẫn hiện hành. Trang có MLA-C01 150 USD và beta cập nhật 75 USD ngày kiểm tra; xác nhận mã thi/giá/thuế khi đăng ký. AWS compute/lab có phí ngoài lệ phí thi.",
      "checkedAt": "2026-10-06"
    }
  ],
  "tracks": [
    {
      "id": "mlops.serving",
      "pathId": "mlops",
      "label": "Serving và monitoring",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.classical.models",
        "mlops.reproducibility",
        "mlops.tracking",
        "mlops.artifacts",
        "mlops.api",
        "mlops.container",
        "mlops.monitoring"
      ],
      "credentialIds": [
        "mlops.credential.aws-mla"
      ],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://fastapi.tiangolo.com/tutorial/body/"
        }
      ],
      "portfolio": {
        "title": "Inference API local có monitoring",
        "acceptance": [
          "Manifest checksum/version/run/data hash và load test.",
          "/health,/predict validation/batch limit; container smoke test.",
          "20 requests đúng/5 lỗi có counters và latency p50/p95.",
          "Drift threshold/limits và runbook rollback; không cần cloud."
        ]
      }
    },
    {
      "id": "mlops.pipeline",
      "pathId": "mlops",
      "label": "Pipeline và vòng đời mô hình",
      "stageIds": [
        "scientist.foundation.python",
        "scientist.arrays",
        "scientist.tables",
        "scientist.statistics",
        "scientist.math",
        "scientist.evaluation",
        "scientist.responsible-data",
        "ml.classical.models",
        "mlops.reproducibility",
        "mlops.tracking",
        "mlops.artifacts",
        "mlops.data-versioning",
        "mlops.pipeline.dag",
        "mlops.ci",
        "mlops.lifecycle"
      ],
      "credentialIds": [
        "mlops.credential.aws-mla"
      ],
      "roadmapLinks": [
        {
          "label": "Khung học chính thức theo chủ đề",
          "url": "https://doc.dvc.org/start/data-pipelines"
        }
      ],
      "portfolio": {
        "title": "DVC/MLflow pipeline có gate và rollback",
        "acceptance": [
          "Hai data versions DVC/schema tests chặn data sai.",
          "DAG tái lập/invalidation đúng theo data/config changes.",
          "CI hoặc local equivalent có metric/checksum gates; lỗi làm fail.",
          "Hai model versions truy code/data/run, promote/rollback output kiểm chứng."
        ]
      }
    }
  ]
};
