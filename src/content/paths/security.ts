import type { ContentPack } from '../../domain/contracts';

// MW-TEAM-05: nội dung chờ review; registry/app do Hải tích hợp.
export const securityPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-09.team05-review",
  "pathId": "security",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "security.threat-model",
      "title": "Threat model và phạm vi lab",
      "phase": "foundation",
      "description": "Threat model có assets/trust boundaries, ưu tiên rủi ro và phạm vi kiểm thử được phép.",
      "outcome": "Threat model có assets/trust boundaries, ưu tiên rủi ro và phạm vi kiểm thử được phép.",
      "prerequisiteIds": [
        "cs.networking",
        "cs.os-linux",
        "web.http"
      ],
      "resourceIds": [
        "resource.security.threat"
      ],
      "defaultResourceId": "resource.security.threat",
      "optional": false,
      "work": [
        {
          "id": "security.threat-model.data-flow",
          "revision": 1,
          "title": "Vẽ data flow cho ứng dụng mẫu",
          "minutes": 90,
          "acceptance": [
            "Chỉ ra assets, entry point và trust boundary.",
            "Nêu ba threat gắn dữ liệu cụ thể, không chỉ liệt kê acronym."
          ]
        },
        {
          "id": "security.threat-model.scope",
          "revision": 1,
          "title": "Lập phạm vi lab và tiêu chí kiểm thử",
          "minutes": 60,
          "acceptance": [
            "Chỉ dùng app/VM sở hữu hoặc lab được cấp; ghi mục tiêu ngoài phạm vi.",
            "Ba rủi ro có mức ảnh hưởng và cách kiểm chứng; dữ liệu/account là giả."
          ]
        }
      ]
    },
    {
      "id": "security.logs",
      "title": "Thu thập và chuẩn hóa security log",
      "phase": "build",
      "description": "Log timestamp/device/event chuẩn hóa và có provenance.",
      "outcome": "Log timestamp/device/event chuẩn hóa và có provenance.",
      "prerequisiteIds": [
        "security.threat-model"
      ],
      "resourceIds": [
        "resource.security.siem"
      ],
      "defaultResourceId": "resource.security.siem",
      "optional": false,
      "work": [
        {
          "id": "security.logs.normalize",
          "revision": 1,
          "title": "Chuẩn hóa auth log mẫu thành JSON",
          "minutes": 90,
          "acceptance": [
            "Giữ timestamp/timezone/raw line; ghi lỗi parse thay vì bỏ im lặng.",
            "Có fixture thành công, thất bại và malformed, không dùng log người khác."
          ]
        },
        {
          "id": "security.logs.timeline",
          "revision": 1,
          "title": "Dựng timeline đăng nhập giả lập",
          "minutes": 90,
          "acceptance": [
            "Kết hợp nhiều event theo host/user lab và thời điểm.",
            "Phân biệt sự kiện quan sát được với suy luận; che dữ liệu nhạy cảm trước bàn giao."
          ]
        }
      ]
    },
    {
      "id": "security.siem",
      "title": "SOC và truy vấn SIEM",
      "phase": "build",
      "description": "Báo cáo truy vấn log và độ phủ giám sát endpoint lab.",
      "outcome": "Báo cáo truy vấn log và độ phủ giám sát endpoint lab.",
      "prerequisiteIds": [
        "security.logs"
      ],
      "resourceIds": [
        "resource.security.siem"
      ],
      "defaultResourceId": "resource.security.siem",
      "optional": false,
      "work": [
        {
          "id": "security.siem.collect",
          "revision": 1,
          "title": "Kết nối một endpoint lab hoặc chuẩn bị dữ liệu offline",
          "minutes": 120,
          "acceptance": [
            "Máy đủ tài nguyên: agent/event xuất hiện trong SIEM; máy yếu: file log offline có nhãn chưa cài SIEM.",
            "Ghi host/version/cấu hình thu thập và điều kiện lặp lại."
          ]
        },
        {
          "id": "security.siem.query",
          "revision": 1,
          "title": "Truy vấn các sự kiện liên quan đăng nhập",
          "minutes": 90,
          "acceptance": [
            "Có truy vấn hoặc evaluator offline với expected event IDs.",
            "Tìm cả case thất bại và bình thường; không coi không có log là không có sự cố."
          ]
        }
      ]
    },
    {
      "id": "security.detection",
      "title": "Detection engineering với Sigma",
      "phase": "build",
      "description": "Rule được test trên dữ liệu lab gồm positive và false positive.",
      "outcome": "Rule được test trên dữ liệu lab gồm positive và false positive.",
      "prerequisiteIds": [
        "security.siem"
      ],
      "resourceIds": [
        "resource.security.sigma"
      ],
      "defaultResourceId": "resource.security.sigma",
      "optional": false,
      "work": [
        {
          "id": "security.detection.sigma-rule",
          "revision": 1,
          "title": "Viết rule phát hiện chuỗi login thất bại",
          "minutes": 90,
          "acceptance": [
            "Rule có logsource/detection và mô tả dữ liệu cần.",
            "Dùng event giả lập, không dò mật khẩu hoặc tác động tài khoản thật."
          ]
        },
        {
          "id": "security.detection.rule-fixtures",
          "revision": 1,
          "title": "Kiểm rule và phân tích false positive",
          "minutes": 90,
          "acceptance": [
            "Ít nhất ba positive/negative fixtures với expected event.",
            "Ghi backend/evaluator và điểm chưa hỗ trợ, không nhận chuyển đổi rule là triển khai detection."
          ]
        }
      ]
    },
    {
      "id": "security.triage",
      "title": "SOC triage và incident report",
      "phase": "ship",
      "description": "Ticket triage có evidence, mức tin cậy, containment và tiêu chí đóng.",
      "outcome": "Ticket triage có evidence, mức tin cậy, containment và tiêu chí đóng.",
      "prerequisiteIds": [
        "security.detection"
      ],
      "resourceIds": [
        "resource.security.siem",
        "resource.security.threat"
      ],
      "defaultResourceId": "resource.security.siem",
      "optional": false,
      "work": [
        {
          "id": "security.triage.triage-case",
          "revision": 1,
          "title": "Triage một chuỗi alert lab",
          "minutes": 90,
          "acceptance": [
            "Liên kết alert với host/timeline/raw evidence.",
            "Phân biệt false positive/incident/thiếu dữ liệu và nêu lý do."
          ]
        },
        {
          "id": "security.triage.containment",
          "revision": 1,
          "title": "Viết kế hoạch containment và closure",
          "minutes": 90,
          "acceptance": [
            "Hành động chỉ nằm trong VM lab, có backup/khôi phục.",
            "Ticket có owner, ưu tiên và bằng chứng kiểm sau xử lý; không bịa attribution."
          ]
        }
      ]
    },
    {
      "id": "security.web-lab",
      "title": "Web security testing local",
      "phase": "build",
      "description": "Ứng dụng local được kiểm theo test case có tái hiện và phạm vi rõ.",
      "outcome": "Ứng dụng local được kiểm theo test case có tái hiện và phạm vi rõ.",
      "prerequisiteIds": [
        "security.threat-model"
      ],
      "resourceIds": [
        "resource.security.juice",
        "resource.security.wstg"
      ],
      "defaultResourceId": "resource.security.juice",
      "optional": false,
      "work": [
        {
          "id": "security.web-lab.local-target",
          "revision": 1,
          "title": "Chạy Juice Shop hoặc app cố ý lỗi ở localhost",
          "minutes": 90,
          "acceptance": [
            "Target chỉ bind local/VM riêng và dùng account giả.",
            "README ghi version và cách dọn target; không công bố dịch vụ lỗi ra Internet."
          ]
        },
        {
          "id": "security.web-lab.web-report",
          "revision": 1,
          "title": "Kiểm một input flow và viết finding",
          "minutes": 90,
          "acceptance": [
            "Có steps/expected/actual, bằng chứng tối thiểu và impact trong lab.",
            "Không đưa payload ngoài phạm vi hoặc gọi scanner Internet; kết luận có mức tin cậy."
          ]
        }
      ]
    },
    {
      "id": "security.auth",
      "title": "Authentication và authorization",
      "phase": "build",
      "description": "Kiểm biệt quyền và session theo account lab, có negative tests.",
      "outcome": "Kiểm biệt quyền và session theo account lab, có negative tests.",
      "prerequisiteIds": [
        "security.web-lab"
      ],
      "resourceIds": [
        "resource.security.auth",
        "resource.security.wstg"
      ],
      "defaultResourceId": "resource.security.auth",
      "optional": false,
      "work": [
        {
          "id": "security.auth.auth-matrix",
          "revision": 1,
          "title": "Lập ma trận quyền cho hai account lab",
          "minutes": 90,
          "acceptance": [
            "Kiểm anonymous/owner/non-owner cho một resource.",
            "Nêu rõ authentication khác authorization, lưu response minh chứng đã che token."
          ]
        },
        {
          "id": "security.auth.session-cases",
          "revision": 1,
          "title": "Kiểm logout, session hết hạn và truy cập lại",
          "minutes": 90,
          "acceptance": [
            "Test ít nhất ba trạng thái session với expected response.",
            "Chỉ dùng app/lab được phép, không đánh cắp cookie hoặc token thực."
          ]
        }
      ]
    },
    {
      "id": "security.remediation",
      "title": "Khắc phục và kiểm tra lại AppSec",
      "phase": "ship",
      "description": "Finding được sửa trên app sở hữu và có regression test.",
      "outcome": "Finding được sửa trên app sở hữu và có regression test.",
      "prerequisiteIds": [
        "security.auth"
      ],
      "resourceIds": [
        "resource.security.validation",
        "resource.security.wstg"
      ],
      "defaultResourceId": "resource.security.validation",
      "optional": false,
      "work": [
        {
          "id": "security.remediation.fix-input",
          "revision": 1,
          "title": "Sửa input validation/permission trong app local",
          "minutes": 120,
          "acceptance": [
            "Validation phía server hoặc boundary thực nhận dữ liệu, thông báo rõ.",
            "Test positive/negative và quyền truy cập vẫn đúng; không sửa mã Juice Shop rồi coi là vá sản phẩm thực."
          ]
        },
        {
          "id": "security.remediation.retest",
          "revision": 1,
          "title": "Viết báo cáo before/after và regression",
          "minutes": 90,
          "acceptance": [
            "Reproduce lỗi trước, test cùng case sau sửa và một case hợp lệ.",
            "Ghi giới hạn/mức ảnh hưởng còn lại, không tuyên bố app hoàn toàn an toàn."
          ]
        }
      ]
    },
    {
      "id": "security.sast",
      "title": "DevSecOps và SAST pipeline",
      "phase": "build",
      "description": "SAST có rule, severity và gate rõ trên repo lab.",
      "outcome": "SAST có rule, severity và gate rõ trên repo lab.",
      "prerequisiteIds": [
        "security.threat-model",
        "devops.ci"
      ],
      "resourceIds": [
        "resource.security.sast"
      ],
      "defaultResourceId": "resource.security.sast",
      "optional": false,
      "work": [
        {
          "id": "security.sast.scan-repo",
          "revision": 1,
          "title": "Chạy Semgrep local trên repo mẫu",
          "minutes": 90,
          "acceptance": [
            "Ghi config/rule/version và finding có file/line.",
            "Chỉ dùng repo sở hữu, không upload source riêng khi chưa có phép."
          ]
        },
        {
          "id": "security.sast.sast-gate",
          "revision": 1,
          "title": "Thêm gate CI và xử lý finding",
          "minutes": 90,
          "acceptance": [
            "Finding xác nhận làm CI fail theo chính sách; case đã sửa qua.",
            "Có exception có lý do/hạn xem lại, không tắt toàn bộ rule để làm xanh."
          ]
        }
      ]
    },
    {
      "id": "security.dependencies",
      "title": "Dependency và container scanning",
      "phase": "build",
      "description": "Scan ghi version nguồn dữ liệu, phân loại finding và kế hoạch update.",
      "outcome": "Scan ghi version nguồn dữ liệu, phân loại finding và kế hoạch update.",
      "prerequisiteIds": [
        "security.sast",
        "devops.containers"
      ],
      "resourceIds": [
        "resource.security.dependencies"
      ],
      "defaultResourceId": "resource.security.dependencies",
      "optional": false,
      "work": [
        {
          "id": "security.dependencies.image-scan",
          "revision": 1,
          "title": "Quét image/dependency của app lab",
          "minutes": 90,
          "acceptance": [
            "Báo cáo ghi tool/DB version và package bị ảnh hưởng.",
            "Có minh chứng scan kết thúc; không coi severity là exploit chắc chắn."
          ]
        },
        {
          "id": "security.dependencies.dependency-fix",
          "revision": 1,
          "title": "Nâng dependency và kiểm lại",
          "minutes": 90,
          "acceptance": [
            "Update một dependency thực có kế hoạch tương thích và test.",
            "So sánh finding trước/sau; ghi residual risk, không xóa lockfile để che lỗi."
          ]
        }
      ]
    },
    {
      "id": "security.secrets",
      "title": "Secret hygiene và release gate",
      "phase": "ship",
      "description": "Pipeline phát hiện secret giả, artifact không chứa credential và có quy trình revoke.",
      "outcome": "Pipeline phát hiện secret giả, artifact không chứa credential và có quy trình revoke.",
      "prerequisiteIds": [
        "security.dependencies"
      ],
      "resourceIds": [
        "resource.security.secrets"
      ],
      "defaultResourceId": "resource.security.secrets",
      "optional": false,
      "work": [
        {
          "id": "security.secrets.fake-secret",
          "revision": 1,
          "title": "Kiểm gate bằng secret fixture giả",
          "minutes": 90,
          "acceptance": [
            "Không commit token thật; fixture được đánh dấu không dùng được.",
            "Gate fail fixture và pass bản sạch; ghi hạn mức/gói của công cụ đang dùng."
          ]
        },
        {
          "id": "security.secrets.release-policy",
          "revision": 1,
          "title": "Viết policy release và diễn tập revoke giả lập",
          "minutes": 90,
          "acceptance": [
            "Chính sách phân biệt secret/SAST/dependency severity và owner xử lý.",
            "Runbook rotate/revoke chỉ mô phỏng credential lab, kiểm log/artifact không leak."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.security.threat",
      "title": "Threat modeling cheat sheet",
      "provider": "OWASP",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc công khai; threat model ứng dụng lab do sinh viên sở hữu, vẽ luồng dữ liệu/trust boundary.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.siem",
      "title": "Wazuh quickstart",
      "provider": "Wazuh",
      "url": "https://documentation.wazuh.com/current/quickstart.html",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Wazuh mã nguồn mở; quickstart 1–25 endpoint khuyến nghị 4 vCPU/8 GiB RAM/50 GB disk. Máy yếu phân tích log mẫu offline, ghi rõ chưa nghiệm thu cài SIEM.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.sigma",
      "title": "Sigma getting started",
      "provider": "SigmaHQ",
      "url": "https://sigmahq.io/docs/guide/getting-started.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; Sigma là format detection, cần backend phù hợp hoặc bộ evaluator lab; không nhận rule hợp lệ là detection đã hiệu quả.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.wstg",
      "title": "Web Security Testing Guide v4.2",
      "provider": "OWASP",
      "url": "https://wstg.owasp.org/v4.2/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu kiểm thử công khai, không phải chứng nhận. Chỉ kiểm tra localhost/ứng dụng được phép.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.auth",
      "title": "Authentication vulnerabilities",
      "provider": "PortSwigger",
      "url": "https://portswigger.net/web-security/authentication",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Bài học công khai; lab Academy cần tài khoản và chỉ dùng mục tiêu lab được cấp. Hoặc dùng app local tự tạo.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.juice",
      "title": "Running OWASP Juice Shop",
      "provider": "OWASP Juice Shop",
      "url": "https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Ứng dụng lab mã nguồn mở; chạy localhost/VM riêng. Không mở app cố ý có lỗ hổng ra Internet; dùng dữ liệu và tài khoản giả.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.validation",
      "title": "Input validation cheat sheet",
      "provider": "OWASP",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; sửa app tự sở hữu và dùng negative tests, không coi validation là thay thế authorization.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.sast",
      "title": "Semgrep quickstart",
      "provider": "Semgrep",
      "url": "https://docs.semgrep.dev/getting-started/quickstart",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; CLI/scan local có lựa chọn không upload source. Tính năng nền tảng/cloud tùy gói; lab chỉ quét repo mẫu của mình.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.dependencies",
      "title": "Trivy scanning overview",
      "provider": "Aqua Security / Trivy Maintainers",
      "url": "https://trivy.dev/docs/latest/guide/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Trivy mã nguồn mở; cài CLI và tải vulnerability DB cần Internet/disk. Lab quét image/source của mình, ghi version DB và phân biệt severity với khả năng khai thác.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.security.secrets",
      "title": "GitHub secret scanning",
      "provider": "GitHub",
      "url": "https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; quyền/tính năng secret scanning tùy repo và gói. Dùng secret giả/fixture, không commit token thật; CI local có rule phát hiện mẫu giả.",
      "checkedAt": "2026-10-09"
    }
  ],
  "credentials": [
    {
      "id": "credential.security.isc2-cc",
      "name": "ISC2 Certified in Cybersecurity (CC)",
      "provider": "ISC2",
      "kind": "exam_certificate",
      "url": "https://www.isc2.org/certifications/cc",
      "cost": "paid",
      "prerequisites": "Không yêu cầu kinh nghiệm làm việc theo ISC2. Chọn bổ trợ SOC nền tảng, không thay bài thực hành AppSec/DevSecOps.",
      "requirements": "Vượt kỳ thi và hoàn tất thủ tục/thỏa thuận/phí theo ISC2. Chương trình 1MCC ngừng nhận mới 20/05/2026; kênh chuẩn có phí, không hứa miễn phí.",
      "checkedAt": "2026-10-09"
    }
  ],
  "tracks": [
    {
      "id": "security.soc",
      "pathId": "security",
      "label": "Defensive Security / SOC",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "security.threat-model",
        "security.logs",
        "security.siem",
        "security.detection",
        "security.triage"
      ],
      "credentialIds": [
        "credential.security.isc2-cc"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://roadmap.sh/cyber-security"
        }
      ],
      "portfolio": {
        "title": "SOC casebook và detection fixtures",
        "acceptance": [
          "Timeline/event provenance và rule có positive/negative fixtures.",
          "Triage report có evidence, mức tin cậy, false positives và containment có thể revert trong lab.",
          "SIEM thực có setup/log; nếu máy yếu dùng offline thì ghi rõ chưa nghiệm thu SIEM thật."
        ]
      }
    },
    {
      "id": "security.appsec",
      "pathId": "security",
      "label": "Web Application Security",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "security.threat-model",
        "security.web-lab",
        "security.auth",
        "security.remediation"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://wstg.owasp.org/v4.2/"
        }
      ],
      "portfolio": {
        "title": "AppSec report và regression patch",
        "acceptance": [
          "Scope localhost/lab được phép và account giả, finding có tái hiện/impact.",
          "Ma trận quyền/session và test trước/sau bản sửa trên app sở hữu.",
          "Không tuyên bố hoàn toàn an toàn; ghi rủi ro còn lại và dữ liệu minh chứng đã che."
        ]
      }
    },
    {
      "id": "security.devsecops",
      "pathId": "security",
      "label": "DevSecOps",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "language.python",
        "devops.automation",
        "devops.containers",
        "devops.ci",
        "security.threat-model",
        "security.sast",
        "security.dependencies",
        "security.secrets"
      ],
      "credentialIds": [],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://roadmap.sh/devops"
        }
      ],
      "portfolio": {
        "title": "Pipeline security gates cho container lab",
        "acceptance": [
          "SAST/dependency/secret fixture có báo cáo và gate fail/pass quan sát được.",
          "Finding được triage, update/regression test và exceptions có owner/hạn review.",
          "Repo/artifact không chứa token thật; nêu tool/version/hạn mức và residual risk."
        ]
      }
    }
  ]
};
