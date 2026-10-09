import type { ContentPack } from '../../domain/contracts';

// MW-TEAM-05: nội dung chờ review; registry/app do Hải tích hợp.
export const qaPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-09.team05-review",
  "pathId": "qa",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "qa.requirements",
      "title": "Yêu cầu và chiến lược kiểm thử",
      "phase": "foundation",
      "description": "Bộ yêu cầu kiểm chứng được với risk-based test scope.",
      "outcome": "Bộ yêu cầu kiểm chứng được với risk-based test scope.",
      "prerequisiteIds": [
        "web.http"
      ],
      "resourceIds": [
        "resource.qa.syllabus"
      ],
      "defaultResourceId": "resource.qa.syllabus",
      "optional": false,
      "work": [
        {
          "id": "qa.requirements.acceptance",
          "revision": 1,
          "title": "Viết acceptance cho form và API lab",
          "minutes": 90,
          "acceptance": [
            "Ba user story có expected và ranh giới input rõ.",
            "Phân biệt test UI/API và điều kiện môi trường; không mặc định thành công là đúng mọi case."
          ]
        },
        {
          "id": "qa.requirements.risk-plan",
          "revision": 1,
          "title": "Lập test plan theo rủi ro",
          "minutes": 60,
          "acceptance": [
            "Scope/in-scope/out-of-scope, ưu tiên và exit criteria được ghi.",
            "Mỗi rủi ro có test hoặc lý do hoãn, không ghi PASS chưa chạy."
          ]
        }
      ]
    },
    {
      "id": "qa.design",
      "title": "Thiết kế test case",
      "phase": "build",
      "description": "Case có equivalence/boundary/state transition và truy vết AC.",
      "outcome": "Case có equivalence/boundary/state transition và truy vết AC.",
      "prerequisiteIds": [
        "qa.requirements"
      ],
      "resourceIds": [
        "resource.qa.syllabus"
      ],
      "defaultResourceId": "resource.qa.syllabus",
      "optional": false,
      "work": [
        {
          "id": "qa.design.boundary",
          "revision": 1,
          "title": "Thiết kế case cho input có giới hạn",
          "minutes": 90,
          "acceptance": [
            "Có valid/invalid và giá trị sát hai biên.",
            "Mỗi case có precondition/input/expected, không sao chép expected thành actual."
          ]
        },
        {
          "id": "qa.design.state-table",
          "revision": 1,
          "title": "Lập decision table và chuyển trạng thái",
          "minutes": 90,
          "acceptance": [
            "Có bảng kết hợp điều kiện và các transition hợp lệ/lỗi.",
            "Liên kết case ID tới AC/risk và xác định coverage thiếu."
          ]
        }
      ]
    },
    {
      "id": "qa.execution",
      "title": "Thực thi và báo cáo lỗi",
      "phase": "build",
      "description": "Kết quả thực có evidence và bug tái hiện được.",
      "outcome": "Kết quả thực có evidence và bug tái hiện được.",
      "prerequisiteIds": [
        "qa.design"
      ],
      "resourceIds": [
        "resource.qa.syllabus"
      ],
      "defaultResourceId": "resource.qa.syllabus",
      "optional": false,
      "work": [
        {
          "id": "qa.execution.run-cases",
          "revision": 1,
          "title": "Chạy bộ case trên app local",
          "minutes": 90,
          "acceptance": [
            "Ghi version/môi trường và actual từng case, có fail/cancel/error nếu xảy ra.",
            "Evidence không chứa credential; case chưa chạy giữ Not run."
          ]
        },
        {
          "id": "qa.execution.bug-report",
          "revision": 1,
          "title": "Viết và retest hai bug report",
          "minutes": 90,
          "acceptance": [
            "Report có steps, expected/actual, severity và ảnh/log.",
            "Retest trên version mới hoặc ghi chưa sửa; không tự biến fail thành pass."
          ]
        }
      ]
    },
    {
      "id": "qa.accessibility",
      "title": "Keyboard, focus và thông báo lỗi",
      "phase": "build",
      "description": "Checklist accessibility cơ bản có quan sát bằng bàn phím.",
      "outcome": "Checklist accessibility cơ bản có quan sát bằng bàn phím.",
      "prerequisiteIds": [
        "qa.execution"
      ],
      "resourceIds": [
        "resource.qa.accessibility"
      ],
      "defaultResourceId": "resource.qa.accessibility",
      "optional": false,
      "work": [
        {
          "id": "qa.accessibility.keyboard",
          "revision": 1,
          "title": "Kiểm luồng form bằng keyboard",
          "minutes": 90,
          "acceptance": [
            "Tab order/focus và kích hoạt nút có thể quan sát.",
            "Ghi chỗ bị kẹt và cách tái hiện, không suy ra screen reader đã thử nếu chưa chạy."
          ]
        },
        {
          "id": "qa.accessibility.labels-errors",
          "revision": 1,
          "title": "Kiểm label và thông báo input lỗi",
          "minutes": 60,
          "acceptance": [
            "Control có tên/label rõ và lỗi liên kết field.",
            "Kiểm loading/empty/error; ghi đây là checklist nhỏ, không xác nhận toàn WCAG."
          ]
        }
      ]
    },
    {
      "id": "qa.regression",
      "title": "Regression và test completion",
      "phase": "ship",
      "description": "Regression suite và báo cáo release có rủi ro còn lại.",
      "outcome": "Regression suite và báo cáo release có rủi ro còn lại.",
      "prerequisiteIds": [
        "qa.accessibility"
      ],
      "resourceIds": [
        "resource.qa.syllabus"
      ],
      "defaultResourceId": "resource.qa.syllabus",
      "optional": false,
      "work": [
        {
          "id": "qa.regression.regression-set",
          "revision": 1,
          "title": "Chọn smoke/regression từ bug history",
          "minutes": 90,
          "acceptance": [
            "Suite ưu tiên flow chính và case từng lỗi; không bỏ negative cases.",
            "Ghi thời gian/môi trường và kết quả chạy lại có evidence."
          ]
        },
        {
          "id": "qa.regression.release-report",
          "revision": 1,
          "title": "Viết test completion report",
          "minutes": 60,
          "acceptance": [
            "Thống kê Pass/Fail/Blocked/Not run và liên kết case/log.",
            "Nêu blocker/rủi ro còn lại và khuyến nghị release có điều kiện."
          ]
        }
      ]
    },
    {
      "id": "qa.pw-basics",
      "title": "Playwright và test isolation",
      "phase": "build",
      "description": "Test UI local chạy độc lập với fixture và kết quả có expected rõ.",
      "outcome": "Test UI local chạy độc lập với fixture và kết quả có expected rõ.",
      "prerequisiteIds": [
        "qa.design",
        "language.javascript",
        "cs.git"
      ],
      "resourceIds": [
        "resource.qa.pw-write"
      ],
      "defaultResourceId": "resource.qa.pw-write",
      "optional": false,
      "work": [
        {
          "id": "qa.pw-basics.first-tests",
          "revision": 1,
          "title": "Viết ba test UI local bằng Playwright",
          "minutes": 120,
          "acceptance": [
            "Case thành công, input lỗi và cancel có assertion.",
            "Mỗi test tự chuẩn bị dữ liệu, chạy độc lập không phụ thuộc thứ tự."
          ]
        },
        {
          "id": "qa.pw-basics.isolation",
          "revision": 1,
          "title": "Kiểm lại test với dữ liệu sạch",
          "minutes": 60,
          "acceptance": [
            "Có hướng dẫn cài browser/Node và lệnh chạy.",
            "Chạy từng test riêng và cả suite giữ cùng expected, không dùng account thật."
          ]
        }
      ]
    },
    {
      "id": "qa.pw-locators",
      "title": "Locator và assertion bền vững",
      "phase": "build",
      "description": "Selector phản ánh vai trò UI, assertion xử lý trạng thái bất đồng bộ.",
      "outcome": "Selector phản ánh vai trò UI, assertion xử lý trạng thái bất đồng bộ.",
      "prerequisiteIds": [
        "qa.pw-basics"
      ],
      "resourceIds": [
        "resource.qa.pw-locators",
        "resource.qa.pw-assert"
      ],
      "defaultResourceId": "resource.qa.pw-locators",
      "optional": false,
      "work": [
        {
          "id": "qa.pw-locators.stable-selectors",
          "revision": 1,
          "title": "Thay selector layout bằng role/label",
          "minutes": 90,
          "acceptance": [
            "Không phụ thuộc nth-child khi có accessible name phù hợp.",
            "Case động/loading dùng web-first assertion, không sleep cố định để né lỗi."
          ]
        },
        {
          "id": "qa.pw-locators.race-cases",
          "revision": 1,
          "title": "Test lỗi mạng mô phỏng và loading",
          "minutes": 90,
          "acceptance": [
            "Có mock/error fixture và expected UI tương ứng.",
            "Suite không gọi endpoint production và log ghi fixture đã dùng."
          ]
        }
      ]
    },
    {
      "id": "qa.pw-debug",
      "title": "Debug, trace và dữ liệu test",
      "phase": "build",
      "description": "Trace giải thích test fail, fixture có cleanup và không leak dữ liệu.",
      "outcome": "Trace giải thích test fail, fixture có cleanup và không leak dữ liệu.",
      "prerequisiteIds": [
        "qa.pw-locators"
      ],
      "resourceIds": [
        "resource.qa.pw-trace"
      ],
      "defaultResourceId": "resource.qa.pw-trace",
      "optional": false,
      "work": [
        {
          "id": "qa.pw-debug.trace-failure",
          "revision": 1,
          "title": "Gây fail có kiểm soát và đọc trace",
          "minutes": 90,
          "acceptance": [
            "Trace chỉ rõ bước fail và expected/actual.",
            "Trước chia sẻ kiểm trace không có password/token hoặc thông tin cá nhân."
          ]
        },
        {
          "id": "qa.pw-debug.fixture-cleanup",
          "revision": 1,
          "title": "Tách fixture và cleanup suite",
          "minutes": 90,
          "acceptance": [
            "Fixture test IDs riêng, cleanup không xóa data thật.",
            "Một test fail vẫn chạy cleanup; không tăng retry để giấu flaky."
          ]
        }
      ]
    },
    {
      "id": "qa.pw-ci",
      "title": "Playwright regression trong CI",
      "phase": "ship",
      "description": "Suite có artifact và gate CI, trình duyệt/môi trường được ghi.",
      "outcome": "Suite có artifact và gate CI, trình duyệt/môi trường được ghi.",
      "prerequisiteIds": [
        "qa.pw-debug"
      ],
      "resourceIds": [
        "resource.qa.pw-ci"
      ],
      "defaultResourceId": "resource.qa.pw-ci",
      "optional": false,
      "work": [
        {
          "id": "qa.pw-ci.ci-tests",
          "revision": 1,
          "title": "Chạy suite UI trên runner",
          "minutes": 120,
          "acceptance": [
            "Workflow khởi động app lab và chạy test; fail test làm job fail.",
            "Lưu report/trace theo chính sách, ghi runner/browser version và giới hạn quota."
          ]
        },
        {
          "id": "qa.pw-ci.flaky-review",
          "revision": 1,
          "title": "Đánh giá flaky và coverage",
          "minutes": 60,
          "acceptance": [
            "Ba lần chạy có số test/fail rõ; flaky có issue và owner.",
            "Ghi browser đã/chưa thử; không suy ra mọi browser từ Chromium duy nhất."
          ]
        }
      ]
    },
    {
      "id": "qa.api-cases",
      "title": "API contract và negative cases",
      "phase": "build",
      "description": "Collection thể hiện contract HTTP/JSON và các case lỗi có expected.",
      "outcome": "Collection thể hiện contract HTTP/JSON và các case lỗi có expected.",
      "prerequisiteIds": [
        "qa.design"
      ],
      "resourceIds": [
        "resource.qa.pm-tests"
      ],
      "defaultResourceId": "resource.qa.pm-tests",
      "optional": false,
      "work": [
        {
          "id": "qa.api-cases.api-matrix",
          "revision": 1,
          "title": "Lập ma trận request/response cho API lab",
          "minutes": 90,
          "acceptance": [
            "Có method/path/status/schema và valid/invalid payload.",
            "Auth thiếu/hết hạn chỉ thử credential giả trên API local."
          ]
        },
        {
          "id": "qa.api-cases.api-assert",
          "revision": 1,
          "title": "Viết Postman assertions cho response",
          "minutes": 90,
          "acceptance": [
            "Assertion kiểm status và field, không chỉ response time.",
            "Fail khi payload sai contract; environment dùng placeholder, không export token thật."
          ]
        }
      ]
    },
    {
      "id": "qa.api-runner",
      "title": "Collection runner và dữ liệu test",
      "phase": "build",
      "description": "Collection có dữ liệu theo iteration, cleanup và biến môi trường riêng.",
      "outcome": "Collection có dữ liệu theo iteration, cleanup và biến môi trường riêng.",
      "prerequisiteIds": [
        "qa.api-cases"
      ],
      "resourceIds": [
        "resource.qa.pm-runner"
      ],
      "defaultResourceId": "resource.qa.pm-runner",
      "optional": false,
      "work": [
        {
          "id": "qa.api-runner.dataset",
          "revision": 1,
          "title": "Chạy collection với ba dòng dữ liệu",
          "minutes": 90,
          "acceptance": [
            "Mỗi iteration có case ID và expected riêng.",
            "Chọn tool/format hỗ trợ và ghi hạn mức runner; không nhận demo một request là chạy dataset."
          ]
        },
        {
          "id": "qa.api-runner.api-cleanup",
          "revision": 1,
          "title": "Kiểm CRUD và cleanup tài nguyên lab",
          "minutes": 90,
          "acceptance": [
            "Tạo/read/update/delete liên kết bằng ID test riêng.",
            "Cleanup không đụng record thật, fail midway có hướng dẫn dọn QA."
          ]
        }
      ]
    },
    {
      "id": "qa.api-cli",
      "title": "Newman và CI cho API",
      "phase": "ship",
      "description": "Collection tương thích chạy CLI có exit code/report và không leak environment.",
      "outcome": "Collection tương thích chạy CLI có exit code/report và không leak environment.",
      "prerequisiteIds": [
        "qa.api-runner",
        "cs.git"
      ],
      "resourceIds": [
        "resource.qa.newman"
      ],
      "defaultResourceId": "resource.qa.newman",
      "optional": false,
      "work": [
        {
          "id": "qa.api-cli.newman-run",
          "revision": 1,
          "title": "Chạy collection QA bằng Newman local",
          "minutes": 90,
          "acceptance": [
            "Ghi Node/Newman/collection format và lệnh chạy tái hiện được.",
            "Assertion lỗi làm exit code fail; nếu format không hỗ trợ phải ghi blocker, không đổi kết quả."
          ]
        },
        {
          "id": "qa.api-cli.api-ci-report",
          "revision": 1,
          "title": "Đưa API suite vào CI và báo cáo",
          "minutes": 90,
          "acceptance": [
            "Có job/report và dữ liệu fixture, secret giả/placeholder.",
            "Tổng kết case pass/fail/not-run và phần auth/schema chưa bao phủ."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.qa.syllabus",
      "title": "ISTQB CTFL syllabus v4.0.1",
      "provider": "ISTQB",
      "url": "https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "PDF syllabus công khai; học phần khái niệm/thiết kế/quản lý kiểm thử. Không nhận hoàn thành bài này là có chứng chỉ ISTQB.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.accessibility",
      "title": "WCAG 2.2 quick reference",
      "provider": "W3C WAI",
      "url": "https://www.w3.org/WAI/WCAG22/quickref/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; kiểm keyboard/focus/name/error cho app local, checklist nhỏ không đồng nghĩa đạt toàn bộ WCAG.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pw-write",
      "title": "Playwright writing tests",
      "provider": "Microsoft / Playwright",
      "url": "https://playwright.dev/docs/writing-tests",
      "language": "en",
      "format": "lab",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; Node.js và browser binaries cần cài trên máy. Dùng app local/fixture riêng, không test dịch vụ bên ngoài.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pw-locators",
      "title": "Playwright locators",
      "provider": "Microsoft / Playwright",
      "url": "https://playwright.dev/docs/locators",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; ưu tiên role/label/test ID khi cần, tránh selector theo bố cục dễ đổi.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pw-assert",
      "title": "Playwright assertions",
      "provider": "Microsoft / Playwright",
      "url": "https://playwright.dev/docs/test-assertions",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; kiểm trạng thái UI với assertion có retry, không sleep cố định để che race.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pw-trace",
      "title": "Playwright trace viewer",
      "provider": "Microsoft / Playwright",
      "url": "https://playwright.dev/docs/trace-viewer",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu công khai; trace có thể chứa dữ liệu app, dùng fixture và kiểm trước khi chia sẻ.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pw-ci",
      "title": "Playwright CI",
      "provider": "Microsoft / Playwright",
      "url": "https://playwright.dev/docs/ci-intro",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; CI runner có hạn mức tùy dịch vụ. Có thể chạy cùng lệnh trong môi trường local sạch; đó chưa là bằng chứng CI hosted.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pm-tests",
      "title": "Postman response test scripts",
      "provider": "Postman",
      "url": "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Desktop/local API lab, không lưu token thật trong collection xuất ra. Dùng phần script local; cloud/team có điều kiện riêng.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.pm-runner",
      "title": "Postman collection runner",
      "provider": "Postman",
      "url": "https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/",
      "language": "en",
      "format": "article",
      "cost": "mixed",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; quyền/hạn mức runner phụ thuộc gói Postman hiện hành. Bài có lựa chọn chạy fixture bằng Newman CLI local.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.qa.newman",
      "title": "Newman CLI integration",
      "provider": "Postman",
      "url": "https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc miễn phí; Node.js/Newman local và collection tương thích. Không đồng nhất mọi định dạng collection mới với Newman; ghi version/định dạng đã chạy.",
      "checkedAt": "2026-10-09"
    }
  ],
  "credentials": [
    {
      "id": "credential.qa.istqb-ctfl",
      "name": "ISTQB Certified Tester Foundation Level",
      "provider": "ISTQB",
      "kind": "exam_certificate",
      "url": "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/",
      "cost": "unknown",
      "prerequisites": "Có thể tự học syllabus; mục tiêu bổ trợ nền tảng testing, không cấp chứng chỉ Playwright/Postman.",
      "requirements": "Đăng ký với exam provider và vượt kỳ thi CTFL theo quy định hiện hành. Trang tổng quan có 40 câu, mốc 26 điểm; phí/điều kiện địa phương chưa xác minh, cần hỏi provider. Không nhận course/test suite là chứng chỉ.",
      "checkedAt": "2026-10-09"
    }
  ],
  "tracks": [
    {
      "id": "qa.manual",
      "pathId": "qa",
      "label": "Manual QA",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "qa.requirements",
        "qa.design",
        "qa.execution",
        "qa.accessibility",
        "qa.regression"
      ],
      "credentialIds": [
        "credential.qa.istqb-ctfl"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://roadmap.sh/qa"
        }
      ],
      "portfolio": {
        "title": "Test plan, casebook và release report",
        "acceptance": [
          "Case AC/risk/boundary/state có actual và evidence, Not run không đổi thành Pass.",
          "Bug reports tái hiện được và retest trên version cụ thể.",
          "Keyboard/label/error checklist và release report nêu rủi ro, không tự nhận đạt toàn WCAG."
        ]
      }
    },
    {
      "id": "qa.playwright",
      "pathId": "qa",
      "label": "Web Automation / Playwright",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "qa.requirements",
        "qa.design",
        "language.javascript",
        "qa.pw-basics",
        "qa.pw-locators",
        "qa.pw-debug",
        "qa.pw-ci"
      ],
      "credentialIds": [
        "credential.qa.istqb-ctfl"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://playwright.dev/docs/writing-tests"
        }
      ],
      "portfolio": {
        "title": "UI regression suite có trace và CI",
        "acceptance": [
          "Test positive/negative/cancel với fixture độc lập và selector role/label.",
          "Loading/error được mock có kiểm soát; không sleep cố định hoặc retry để che flaky.",
          "CI artifact ghi browser/version; chỉ kết luận trên browser đã chạy."
        ]
      }
    },
    {
      "id": "qa.postman",
      "pathId": "qa",
      "label": "API Testing / Postman",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "qa.requirements",
        "qa.design",
        "qa.api-cases",
        "qa.api-runner",
        "qa.api-cli"
      ],
      "credentialIds": [
        "credential.qa.istqb-ctfl"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/"
        }
      ],
      "portfolio": {
        "title": "API collection và Newman regression report",
        "acceptance": [
          "Contract/status/response-field tests có data iterations và cleanup ID QA.",
          "Newman CLI/CI có exit code/report, ghi collection format và version.",
          "Environment không có token thật; manual file export/round-trip và limitations được ghi."
        ]
      }
    }
  ]
};
