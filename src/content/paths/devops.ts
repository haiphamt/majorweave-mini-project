import type { ContentPack } from '../../domain/contracts';

// MW-TEAM-05: nội dung chờ review; registry/app do Hải tích hợp.
export const devopsPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-09.team05-review",
  "pathId": "devops",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "devops.automation",
      "title": "Tự động hóa tác vụ vận hành",
      "phase": "foundation",
      "description": "Script vận hành có exit code, timeout và log; cấu hình không chứa secret.",
      "outcome": "Script vận hành có exit code, timeout và log; cấu hình không chứa secret.",
      "prerequisiteIds": [
        "cs.git",
        "cs.os-linux",
        "language.python"
      ],
      "resourceIds": [
        "resource.devops.process"
      ],
      "defaultResourceId": "resource.devops.process",
      "optional": false,
      "work": [
        {
          "id": "devops.automation.healthcheck",
          "revision": 1,
          "title": "Viết script healthcheck cho service local",
          "minutes": 90,
          "acceptance": [
            "Trả exit 0 khi endpoint sẵn sàng, khác 0 khi lỗi.",
            "Có timeout và test endpoint bị dừng."
          ]
        },
        {
          "id": "devops.automation.config-log",
          "revision": 1,
          "title": "Tách cấu hình và ghi log cho script",
          "minutes": 60,
          "acceptance": [
            "Đọc endpoint từ biến môi trường, không hard-code credential.",
            "Log có thời điểm/kết quả, không ghi token hoặc mật khẩu."
          ]
        }
      ]
    },
    {
      "id": "devops.containers",
      "title": "Container và Compose",
      "phase": "build",
      "description": "Service và database lab chạy lại được từ Dockerfile/Compose.",
      "outcome": "Service và database lab chạy lại được từ Dockerfile/Compose.",
      "prerequisiteIds": [
        "devops.automation",
        "cs.networking"
      ],
      "resourceIds": [
        "resource.devops.containers"
      ],
      "defaultResourceId": "resource.devops.containers",
      "optional": false,
      "work": [
        {
          "id": "devops.containers.build-image",
          "revision": 1,
          "title": "Đóng gói service lab thành image",
          "minutes": 90,
          "acceptance": [
            "Build từ repo sạch và truy cập được endpoint local.",
            "Ghi port, volume và biến môi trường trong README."
          ]
        },
        {
          "id": "devops.containers.compose-restart",
          "revision": 1,
          "title": "Kiểm tra restart và dữ liệu Compose",
          "minutes": 90,
          "acceptance": [
            "App và database có healthcheck hoặc bước chờ readiness rõ.",
            "Restart giữ dữ liệu trong volume lab; nêu tác động khi xóa volume."
          ]
        }
      ]
    },
    {
      "id": "devops.ci",
      "title": "Continuous integration",
      "phase": "build",
      "description": "Pipeline kiểm tra bản thay đổi và lưu log/artifact có thể review.",
      "outcome": "Pipeline kiểm tra bản thay đổi và lưu log/artifact có thể review.",
      "prerequisiteIds": [
        "devops.containers",
        "cs.git"
      ],
      "resourceIds": [
        "resource.devops.ci"
      ],
      "defaultResourceId": "resource.devops.ci",
      "optional": false,
      "work": [
        {
          "id": "devops.ci.test-pipeline",
          "revision": 1,
          "title": "Tạo workflow build và test cho repo lab",
          "minutes": 90,
          "acceptance": [
            "Push/PR kích hoạt build/test trên runner được phép.",
            "Một test cố ý lỗi khiến workflow thất bại, sửa lại thì qua."
          ]
        },
        {
          "id": "devops.ci.artifact-review",
          "revision": 1,
          "title": "Xuất artifact và cố định version công cụ",
          "minutes": 60,
          "acceptance": [
            "Lưu báo cáo test/image metadata, ghi thời hạn lưu.",
            "Lệnh pipeline có thể chạy local; không in secret trong log."
          ]
        }
      ]
    },
    {
      "id": "devops.iam",
      "title": "AWS identity và quyền tối thiểu",
      "phase": "foundation",
      "description": "Ma trận quyền và policy tối thiểu cho ứng dụng mẫu; chưa coi policy offline là triển khai.",
      "outcome": "Ma trận quyền và policy tối thiểu cho ứng dụng mẫu; chưa coi policy offline là triển khai.",
      "prerequisiteIds": [
        "cs.networking",
        "devops.automation"
      ],
      "resourceIds": [
        "resource.devops.iam"
      ],
      "defaultResourceId": "resource.devops.iam",
      "optional": false,
      "work": [
        {
          "id": "devops.iam.policy-model",
          "revision": 1,
          "title": "Soạn policy cho một bucket lab",
          "minutes": 90,
          "acceptance": [
            "Phân biệt quyền đọc/ghi/list và giới hạn resource.",
            "Có ba tình huống allow/deny dự kiến; không dùng wildcard toàn bộ dịch vụ."
          ]
        },
        {
          "id": "devops.iam.access-plan",
          "revision": 1,
          "title": "Lập kế hoạch truy cập và chi phí AWS",
          "minutes": 60,
          "acceptance": [
            "Dùng role/temporary credential trong thiết kế, không chia sẻ root/access key.",
            "Ghi dịch vụ có phí, hạn mức ngân sách và tài nguyên cần dọn."
          ]
        }
      ]
    },
    {
      "id": "devops.iac",
      "title": "Infrastructure as code",
      "phase": "build",
      "description": "Template hạ tầng được validate, review thay đổi và có kế hoạch cleanup.",
      "outcome": "Template hạ tầng được validate, review thay đổi và có kế hoạch cleanup.",
      "prerequisiteIds": [
        "devops.iam",
        "cs.git"
      ],
      "resourceIds": [
        "resource.devops.terraform"
      ],
      "defaultResourceId": "resource.devops.terraform",
      "optional": false,
      "work": [
        {
          "id": "devops.iac.template-validate",
          "revision": 1,
          "title": "Viết Terraform template cho mạng và service mẫu",
          "minutes": 120,
          "acceptance": [
            "terraform fmt/validate qua và input được tách khỏi credential.",
            "README phân biệt validate, plan, apply; không nhận validate là đã tạo tài nguyên."
          ]
        },
        {
          "id": "devops.iac.review-diff",
          "revision": 1,
          "title": "Review change set và kế hoạch rollback",
          "minutes": 90,
          "acceptance": [
            "Ghi các resource dự kiến tạo/sửa/xóa bằng plan thật nếu có account hoặc phân tích template offline có nhãn.",
            "Có checklist destroy và rủi ro mất dữ liệu; không tự apply ngoài lab."
          ]
        }
      ]
    },
    {
      "id": "devops.delivery",
      "title": "Triển khai và rollback",
      "phase": "ship",
      "description": "Bản phát hành có phiên bản, smoke check và cách quay lại bản trước.",
      "outcome": "Bản phát hành có phiên bản, smoke check và cách quay lại bản trước.",
      "prerequisiteIds": [
        "devops.ci",
        "devops.iac"
      ],
      "resourceIds": [
        "resource.devops.cloudformation",
        "resource.devops.containers"
      ],
      "defaultResourceId": "resource.devops.cloudformation",
      "optional": false,
      "work": [
        {
          "id": "devops.delivery.release-tag",
          "revision": 1,
          "title": "Phát hành hai version service ở local",
          "minutes": 90,
          "acceptance": [
            "Hai image/tag truy xuất được cùng hướng dẫn chạy.",
            "Smoke test kiểm endpoint và version sau mỗi lần thay."
          ]
        },
        {
          "id": "devops.delivery.rollback-runbook",
          "revision": 1,
          "title": "Diễn tập rollback và ghi CloudFormation design",
          "minutes": 90,
          "acceptance": [
            "Local rollback về version trước có log và dữ liệu lab còn đúng.",
            "Template AWS ghi account/chi phí/cleanup; nếu chưa tạo stack ghi rõ chưa deploy AWS."
          ]
        }
      ]
    },
    {
      "id": "devops.metrics",
      "title": "Metrics và logging",
      "phase": "build",
      "description": "Prometheus thu thập request/error/latency từ service local.",
      "outcome": "Prometheus thu thập request/error/latency từ service local.",
      "prerequisiteIds": [
        "devops.containers"
      ],
      "resourceIds": [
        "resource.devops.metrics"
      ],
      "defaultResourceId": "resource.devops.metrics",
      "optional": false,
      "work": [
        {
          "id": "devops.metrics.scrape",
          "revision": 1,
          "title": "Cấu hình scrape và kiểm target",
          "minutes": 90,
          "acceptance": [
            "Target local UP, có query counter/gauge với đơn vị rõ.",
            "Tắt target tạo trạng thái DOWN quan sát được."
          ]
        },
        {
          "id": "devops.metrics.dashboard-evidence",
          "revision": 1,
          "title": "Lập báo cáo metrics cho ba tình huống",
          "minutes": 90,
          "acceptance": [
            "So sánh baseline, tăng request và lỗi giả lập bằng dữ liệu có thời điểm.",
            "Phân biệt counter/rate, không đặt user ID/token vào labels."
          ]
        }
      ]
    },
    {
      "id": "devops.slo",
      "title": "SLI, SLO và error budget",
      "phase": "build",
      "description": "Mục tiêu độ tin cậy gắn trải nghiệm người dùng và cửa sổ đo.",
      "outcome": "Mục tiêu độ tin cậy gắn trải nghiệm người dùng và cửa sổ đo.",
      "prerequisiteIds": [
        "devops.metrics",
        "web.http"
      ],
      "resourceIds": [
        "resource.devops.slis"
      ],
      "defaultResourceId": "resource.devops.slis",
      "optional": false,
      "work": [
        {
          "id": "devops.slo.define-sli",
          "revision": 1,
          "title": "Chọn SLI cho API lab",
          "minutes": 90,
          "acceptance": [
            "Định nghĩa numerator/denominator và loại request được tính.",
            "Có cửa sổ đo/mục tiêu và lý do chọn, không chỉ lấy uptime process."
          ]
        },
        {
          "id": "devops.slo.budget",
          "revision": 1,
          "title": "Tính error budget từ dữ liệu mẫu",
          "minutes": 60,
          "acceptance": [
            "Tính budget còn lại cho tập dữ liệu có cả request thành công/thất bại.",
            "Nêu chính sách xử lý khi hết budget và giới hạn của dữ liệu mô phỏng."
          ]
        }
      ]
    },
    {
      "id": "devops.alerts",
      "title": "Cảnh báo dựa trên SLO",
      "phase": "build",
      "description": "Rule cảnh báo có cửa sổ, mức độ và runbook, tránh paging mọi lỗi nhỏ.",
      "outcome": "Rule cảnh báo có cửa sổ, mức độ và runbook, tránh paging mọi lỗi nhỏ.",
      "prerequisiteIds": [
        "devops.slo"
      ],
      "resourceIds": [
        "resource.devops.alerts"
      ],
      "defaultResourceId": "resource.devops.alerts",
      "optional": false,
      "work": [
        {
          "id": "devops.alerts.alert-rule",
          "revision": 1,
          "title": "Viết rule cho vi phạm SLO mô phỏng",
          "minutes": 90,
          "acceptance": [
            "Rule phân biệt warning/page hoặc hai mức ảnh hưởng.",
            "Dữ liệu bình thường không kích hoạt; dữ liệu lỗi dài đủ kích hoạt."
          ]
        },
        {
          "id": "devops.alerts.alert-tests",
          "revision": 1,
          "title": "Kiểm tra false positive và link runbook",
          "minutes": 60,
          "acceptance": [
            "Ít nhất ba fixture và expected result cho rule.",
            "Cảnh báo ghi service/triệu chứng/hành động, không chứa dữ liệu nhạy cảm."
          ]
        }
      ]
    },
    {
      "id": "devops.incidents",
      "title": "Incident response và postmortem",
      "phase": "ship",
      "description": "Diễn tập lỗi service, phân vai, phục hồi và rút ra hành động cải thiện.",
      "outcome": "Diễn tập lỗi service, phân vai, phục hồi và rút ra hành động cải thiện.",
      "prerequisiteIds": [
        "devops.alerts",
        "devops.ci"
      ],
      "resourceIds": [
        "resource.devops.incidents"
      ],
      "defaultResourceId": "resource.devops.incidents",
      "optional": false,
      "work": [
        {
          "id": "devops.incidents.drill",
          "revision": 1,
          "title": "Diễn tập một lỗi config local",
          "minutes": 90,
          "acceptance": [
            "Có timeline phát hiện, giảm ảnh hưởng và phục hồi.",
            "Ghi vai trò liên lạc/người xử lý; không thử lỗi trên production."
          ]
        },
        {
          "id": "devops.incidents.postmortem",
          "revision": 1,
          "title": "Viết postmortem không đổ lỗi",
          "minutes": 90,
          "acceptance": [
            "Phân biệt tác nhân, nguyên nhân góp phần và bằng chứng.",
            "Ba action item có owner/ưu tiên/điều kiện kiểm chứng; không bịa thời gian downtime."
          ]
        }
      ]
    },
    {
      "id": "devops.load",
      "title": "Capacity và giới hạn tải",
      "phase": "ship",
      "description": "Đo tải service local và nêu giới hạn hệ thống thay vì hứa throughput sản xuất.",
      "outcome": "Đo tải service local và nêu giới hạn hệ thống thay vì hứa throughput sản xuất.",
      "prerequisiteIds": [
        "devops.slo",
        "devops.containers"
      ],
      "resourceIds": [
        "resource.devops.load"
      ],
      "defaultResourceId": "resource.devops.load",
      "optional": false,
      "work": [
        {
          "id": "devops.load.baseline-load",
          "revision": 1,
          "title": "Đo throughput/latency với tải nhỏ",
          "minutes": 90,
          "acceptance": [
            "Ghi CPU/RAM/máy/công cụ và ba mức tải giới hạn trên localhost.",
            "Có error rate/latency, dừng khi tài nguyên vượt ngưỡng lab."
          ]
        },
        {
          "id": "devops.load.overload",
          "revision": 1,
          "title": "Thử giới hạn concurrency hoặc timeout",
          "minutes": 90,
          "acceptance": [
            "Chứng minh tải quá mức có response lỗi được kiểm soát thay vì treo vô hạn.",
            "So sánh trước/sau và ghi tradeoff, không suy ra công suất cloud thật."
          ]
        }
      ]
    },
    {
      "id": "devops.recovery",
      "title": "Backup và phục hồi dịch vụ",
      "phase": "ship",
      "description": "Backup lab được thử restore với RPO/RTO quan sát được.",
      "outcome": "Backup lab được thử restore với RPO/RTO quan sát được.",
      "prerequisiteIds": [
        "devops.incidents",
        "devops.containers"
      ],
      "resourceIds": [
        "resource.devops.incidents",
        "resource.devops.containers"
      ],
      "defaultResourceId": "resource.devops.incidents",
      "optional": false,
      "work": [
        {
          "id": "devops.recovery.backup-restore",
          "revision": 1,
          "title": "Sao lưu rồi phục hồi database lab",
          "minutes": 120,
          "acceptance": [
            "Restore vào volume/DB QA khác; so sánh record count và mẫu dữ liệu.",
            "Không ghi đè DB học thật; ghi thời điểm backup và thời gian restore."
          ]
        },
        {
          "id": "devops.recovery.recovery-check",
          "revision": 1,
          "title": "Đánh giá RPO/RTO và kiểm integrity",
          "minutes": 60,
          "acceptance": [
            "Nêu dữ liệu mất tối đa từ thời điểm backup và bước kiểm integrity.",
            "Runbook có đường dẫn file, version/schema và điều kiện rollback."
          ]
        }
      ]
    },
    {
      "id": "devops.kubernetes",
      "title": "Kubernetes local căn bản",
      "phase": "expand",
      "description": "Deployment/service local có probe và rollout; không thay portfolio tối thiểu bằng cloud cluster.",
      "outcome": "Deployment/service local có probe và rollout; không thay portfolio tối thiểu bằng cloud cluster.",
      "prerequisiteIds": [
        "devops.delivery",
        "devops.metrics"
      ],
      "resourceIds": [
        "resource.devops.k8s"
      ],
      "defaultResourceId": "resource.devops.k8s",
      "optional": true,
      "work": [
        {
          "id": "devops.kubernetes.local-deployment",
          "revision": 1,
          "title": "Đưa service lab lên cluster local",
          "minutes": 120,
          "acceptance": [
            "Có manifest Deployment/Service và endpoint kiểm tra.",
            "Readiness/liveness phản ánh trạng thái service, ghi giới hạn máy."
          ]
        },
        {
          "id": "devops.kubernetes.rollout-test",
          "revision": 1,
          "title": "Diễn tập rollout/rollback trên local cluster",
          "minutes": 90,
          "acceptance": [
            "Rollout version mới rồi rollback có minh chứng.",
            "Ghi cleanup namespace lab; không coi local cluster là high availability sản xuất."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.devops.process",
      "title": "Python subprocess: quản lý tiến trình",
      "provider": "Python Software Foundation",
      "url": "https://docs.python.org/3/library/subprocess.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Python 3 trên Linux/WSL/VM; chỉ chạy lệnh do người học kiểm soát.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.containers",
      "title": "Build and share a containerized application",
      "provider": "Docker",
      "url": "https://docs.docker.com/get-started/tutorials/run-an-app/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc công khai; Docker Engine trong Linux VM hoặc Desktop theo giấy phép hiện hành. Tài khoản Docker cần cho phần push; lab local không bắt buộc push.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.ci",
      "title": "GitHub Actions quickstart",
      "provider": "GitHub",
      "url": "https://docs.github.com/en/actions/get-started/quickstart",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; chạy CI cần repo/tài khoản GitHub. Hosted runner có hạn mức theo loại repo/gói; có thể chạy cùng lệnh test local trước.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.iam",
      "title": "Getting started with IAM",
      "provider": "AWS",
      "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; lab mặc định soạn policy/ma trận quyền offline. Áp dụng lên AWS cần tài khoản và quyền phù hợp; không đưa access key vào Git.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.terraform",
      "title": "Terraform: AWS get started",
      "provider": "HashiCorp",
      "url": "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
      "language": "en",
      "format": "lab",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Terraform CLI dùng local. init/validate không thay cho triển khai; apply tạo tài nguyên AWS có thể tính phí. Lab mặc định dừng ở validate, có kế hoạch destroy.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.cloudformation",
      "title": "Create a CloudFormation stack",
      "provider": "AWS",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc công khai; tạo stack cần AWS account/IAM, tài nguyên có thể tính phí. Sinh viên chưa có ngân sách nộp template, sơ đồ và dry-run review, không nhận là deploy thật.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.metrics",
      "title": "Prometheus getting started",
      "provider": "Prometheus Authors",
      "url": "https://prometheus.io/docs/prometheus/latest/getting_started/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu và server mã nguồn mở; chạy local/container, có cổng riêng và file cấu hình.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.slis",
      "title": "Implementing SLOs",
      "provider": "Google SRE",
      "url": "https://sre.google/workbook/implementing-slos/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Chương sách công khai; bài tập dùng request/log tổng hợp của dịch vụ local, không cần tài khoản cloud.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.alerts",
      "title": "Alerting on SLOs",
      "provider": "Google SRE",
      "url": "https://sre.google/workbook/alerting-on-slos/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Chương sách công khai; dùng số liệu lab và cửa sổ cảnh báo mô phỏng, không trực on-call sản xuất.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.incidents",
      "title": "Incident response",
      "provider": "Google SRE",
      "url": "https://sre.google/workbook/incident-response/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Chương sách công khai; diễn tập trên service local và ghi timeline/postmortem.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.load",
      "title": "Managing load",
      "provider": "Google SRE",
      "url": "https://sre.google/workbook/managing-load/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Chương sách công khai; chỉ đo tải thấp trên service của mình, ghi tài nguyên máy và giới hạn đo.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.devops.k8s",
      "title": "Learn Kubernetes basics",
      "provider": "Kubernetes Authors",
      "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "advanced",
      "accessNote": "Đọc miễn phí; lab cần cụm local như minikube/kind và tài nguyên máy tương ứng, không bắt buộc thuê cluster cloud.",
      "checkedAt": "2026-10-09"
    }
  ],
  "credentials": [
    {
      "id": "credential.devops.aws-cloud-practitioner",
      "name": "AWS Certified Cloud Practitioner",
      "provider": "AWS",
      "kind": "exam_certificate",
      "url": "https://aws.amazon.com/certification/certified-cloud-practitioner/",
      "cost": "paid",
      "prerequisites": "Mục tiêu bổ trợ nền tảng AWS; không đòi kinh nghiệm IT trước đó theo trang giới thiệu. Không chứng minh đã thành thạo DevOps.",
      "requirements": "Đăng ký và vượt kỳ thi theo AWS/Pearson VUE; trang kiểm tra ghi phí 100 USD, xem giá/thuế/ngoại tệ khi đăng ký. Hoàn thành roadmap không tự cấp chứng chỉ.",
      "checkedAt": "2026-10-09"
    }
  ],
  "tracks": [
    {
      "id": "devops.devops",
      "pathId": "devops",
      "label": "DevOps / AWS",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "language.python",
        "devops.automation",
        "devops.containers",
        "devops.ci",
        "devops.iam",
        "devops.iac",
        "devops.delivery",
        "devops.metrics",
        "devops.kubernetes"
      ],
      "credentialIds": [
        "credential.devops.aws-cloud-practitioner"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://roadmap.sh/devops"
        }
      ],
      "portfolio": {
        "title": "Service lab có CI, IaC và rollback",
        "acceptance": [
          "Docker/Compose chạy tái hiện được; pipeline fail/pass và release tags có log.",
          "IaC validate có policy/chi phí/cleanup; ghi rõ AWS đã deploy hay chỉ thiết kế offline.",
          "Rollback/metrics có minh chứng local và README cho người khác chạy."
        ]
      }
    },
    {
      "id": "devops.sre",
      "pathId": "devops",
      "label": "SRE",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "language.python",
        "devops.automation",
        "devops.containers",
        "devops.ci",
        "devops.metrics",
        "devops.slo",
        "devops.alerts",
        "devops.incidents",
        "devops.load",
        "devops.recovery"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://sre.google/workbook/table-of-contents/"
        }
      ],
      "portfolio": {
        "title": "SLO và incident drill cho service local",
        "acceptance": [
          "SLI/SLO/error budget tính được từ dữ liệu và rule có positive/negative fixtures.",
          "Incident timeline/postmortem và restore drill có số liệu thật, không bịa downtime.",
          "Load report nêu máy/giới hạn và ba action item có owner/tiêu chí kiểm lại."
        ]
      }
    }
  ]
};
