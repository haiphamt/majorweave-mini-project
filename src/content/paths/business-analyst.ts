import type { ContentPack } from '../../domain/contracts';

// Data/BI BA references data.quality from analystPack; Software BA needs no coding track.
export const businessAnalystPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-07.mw-team-04.1",
  "pathId": "business-analyst",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "business-analyst.discovery",
      "title": "Nhu cầu, giá trị và stakeholder",
      "phase": "foundation",
      "prerequisiteIds": [],
      "resourceIds": [
        "resource.ba-standard",
        "resource.ba-intro"
      ],
      "defaultResourceId": "resource.ba-standard",
      "description": "Phân biệt nhu cầu kinh doanh với yêu cầu giải pháp; đặt ranh giới khảo sát.",
      "outcome": "Problem statement và stakeholder map có giả định rõ.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.discovery.scope",
          "revision": 1,
          "title": "Xác định vấn đề mượn thiết bị trong câu lạc bộ",
          "minutes": 75,
          "acceptance": [
            "Viết problem statement, phạm vi trong/ngoài và chỉ số thời gian xử lý yêu cầu.",
            "Liệt kê người mượn, người duyệt, người quản lý kho và người chịu trách nhiệm dữ liệu.",
            "Ghi giả định và câu hỏi cần xác minh; không trình bày tình huống giả lập như phỏng vấn thật."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.elicitation",
      "title": "Khảo sát và xác nhận nhu cầu",
      "phase": "foundation",
      "prerequisiteIds": [
        "business-analyst.discovery"
      ],
      "resourceIds": [
        "resource.ba-standard"
      ],
      "defaultResourceId": "resource.ba-standard",
      "description": "Đặt câu hỏi, tổng hợp thông tin và xử lý mâu thuẫn giữa các bên.",
      "outcome": "Bộ câu hỏi và biên bản xác nhận yêu cầu có nguồn.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.elicitation.interview",
          "revision": 1,
          "title": "Soạn kế hoạch phỏng vấn và ghi nhận giả lập",
          "minutes": 90,
          "acceptance": [
            "Có ít nhất 8 câu hỏi mở về quy trình, ngoại lệ, trách nhiệm và tiêu chí thành công.",
            "Ghi câu trả lời bằng role-play có nhãn giả lập; tách fact/assumption/open question.",
            "Nêu mâu thuẫn ưu tiên giữa mượn nhanh và kiểm soát tài sản, đề xuất cách xác nhận."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.process",
      "title": "Mô hình quy trình và ngoại lệ",
      "phase": "build",
      "prerequisiteIds": [
        "business-analyst.elicitation"
      ],
      "resourceIds": [
        "resource.ba-bpmn"
      ],
      "defaultResourceId": "resource.ba-bpmn",
      "description": "Mô tả as-is/to-be với vai trò và điểm ra quyết định.",
      "outcome": "Sơ đồ quy trình dùng để rà yêu cầu với stakeholder.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.process.model",
          "revision": 1,
          "title": "Vẽ quy trình mượn/trả thiết bị",
          "minutes": 120,
          "acceptance": [
            "As-is và to-be có start/end, lane, task và gateway có điều kiện.",
            "Bao phủ hết hàng, từ chối, hủy yêu cầu và trả hỏng/quá hạn.",
            "Walkthrough ba tình huống; không có nhánh không tới kết thúc; ghi bảng thay đổi."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.requirements",
      "title": "Yêu cầu và truy vết",
      "phase": "build",
      "prerequisiteIds": [
        "business-analyst.process"
      ],
      "resourceIds": [
        "resource.ba-standard",
        "resource.ba-scrum"
      ],
      "defaultResourceId": "resource.ba-standard",
      "description": "Viết yêu cầu kiểm chứng được và liên kết nhu cầu → yêu cầu → kiểm thử.",
      "outcome": "Danh mục yêu cầu có ưu tiên và traceability.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.requirements.backlog",
          "revision": 1,
          "title": "Viết backlog và tiêu chí chấp nhận",
          "minutes": 120,
          "acceptance": [
            "Có ít nhất 6 story với actor/action/value và Given/When/Then cho luồng chính/lỗi.",
            "Ghi 3 yêu cầu phi chức năng có ngưỡng kiểm tra, gồm quyền truy cập và thời gian phản hồi.",
            "Mỗi story truy tới nhu cầu/stakeholder và quy trình, có ưu tiên kèm lý do."
          ]
        },
        {
          "id": "business-analyst.requirements.trace",
          "revision": 1,
          "title": "Lập ma trận nhu cầu–yêu cầu–test",
          "minutes": 75,
          "acceptance": [
            "Mỗi yêu cầu có ID ổn định và ít nhất một test; phát hiện yêu cầu chưa có nguồn.",
            "Phân biệt acceptance của story với Definition of Done của sản phẩm.",
            "Ghi owner, trạng thái xác nhận và vấn đề còn mở; không ký duyệt thay stakeholder."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.software-validation",
      "title": "UAT và quản lý thay đổi phần mềm",
      "phase": "ship",
      "prerequisiteIds": [
        "business-analyst.requirements"
      ],
      "resourceIds": [
        "resource.ba-standard",
        "resource.ba-scrum"
      ],
      "defaultResourceId": "resource.ba-standard",
      "description": "Xác nhận giải pháp bằng kịch bản, kiểm soát tác động thay đổi.",
      "outcome": "Hồ sơ BA phần mềm có UAT và change impact.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.software-validation.uat",
          "revision": 1,
          "title": "Soạn UAT cho mượn/trả và ngoại lệ",
          "minutes": 120,
          "acceptance": [
            "Ít nhất 8 case có precondition, bước, expected và dữ liệu; gồm từ chối/hủy/quá hạn.",
            "Test chỉ ghi kết quả khi thực hiện; mock/role-play ghi rõ giới hạn.",
            "Truy vết case tới story và mô hình; nêu quy tắc chấp nhận/reject."
          ]
        },
        {
          "id": "business-analyst.software-validation.change",
          "revision": 1,
          "title": "Đánh giá yêu cầu gia hạn thời gian mượn",
          "minutes": 90,
          "acceptance": [
            "Ghi thay đổi tới quy trình, dữ liệu, quyền, story và test; có lựa chọn và trade-off.",
            "Bàn giao scope, stakeholder map, biên bản giả lập, BPMN, backlog, traceability và UAT.",
            "Liệt kê quyết định chờ stakeholder; không tự biến đề xuất thành phê duyệt."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.data-requirements",
      "title": "Yêu cầu sản phẩm dữ liệu và KPI",
      "phase": "build",
      "prerequisiteIds": [
        "business-analyst.requirements",
        "data.quality"
      ],
      "resourceIds": [
        "resource.ba-standard",
        "resource.data-quality"
      ],
      "defaultResourceId": "resource.ba-standard",
      "description": "Chuyển quyết định nghiệp vụ thành KPI, grain và quy tắc dữ liệu.",
      "outcome": "Đặc tả báo cáo có nguồn, quyền và freshness.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.data-requirements.kpi",
          "revision": 1,
          "title": "Đặc tả dashboard vận hành mượn thiết bị",
          "minutes": 120,
          "acceptance": [
            "Định nghĩa tỷ lệ yêu cầu bị từ chối, tỷ lệ trả muộn và thời gian duyệt; có tử/mẫu, đơn vị, bộ lọc.",
            "Lập mapping trường nguồn → chỉ số, grain và tần suất cập nhật.",
            "Nêu data owner, quyền truy cập, mục đích dùng và cách xử lý dữ liệu thiếu."
          ]
        },
        {
          "id": "business-analyst.data-requirements.mock",
          "revision": 1,
          "title": "Vẽ báo cáo và xác nhận quyết định",
          "minutes": 90,
          "acceptance": [
            "Mockup có nhóm người xem, câu hỏi và hành động từ mỗi KPI.",
            "Case không dữ liệu, dữ liệu trễ và quyền hạn chế có cách hiển thị.",
            "Có biên bản walkthrough giả lập với điểm chấp nhận/chưa chấp nhận, không tự ký nghiệm thu."
          ]
        }
      ]
    },
    {
      "id": "business-analyst.data-validation",
      "title": "Nghiệm thu dữ liệu và đo giá trị",
      "phase": "ship",
      "prerequisiteIds": [
        "business-analyst.data-requirements"
      ],
      "resourceIds": [
        "resource.data-quality",
        "resource.ba-standard"
      ],
      "defaultResourceId": "resource.data-quality",
      "description": "Kiểm tra chỉ số bằng ví dụ tính tay và kế hoạch đánh giá giá trị.",
      "outcome": "Hồ sơ Data/BI BA có reconciliation, UAT và đo sau triển khai.",
      "optional": false,
      "work": [
        {
          "id": "business-analyst.data-validation.reconcile",
          "revision": 1,
          "title": "Tạo ví dụ nghiệm thu KPI",
          "minutes": 120,
          "acceptance": [
            "Dùng 20 yêu cầu giả lập có hủy/từ chối/quá hạn; tính expected ba KPI bằng bảng tính.",
            "Có case mẫu số 0, thiếu ngày và đổi bộ lọc; quy tắc không mơ hồ.",
            "Ma trận nhu cầu → KPI → trường dữ liệu → case kiểm thử đủ liên kết."
          ]
        },
        {
          "id": "business-analyst.data-validation.value",
          "revision": 1,
          "title": "Bàn giao kế hoạch đo giá trị",
          "minutes": 90,
          "acceptance": [
            "Ghi baseline giả lập, mục tiêu, kỳ đo và người chịu trách nhiệm; không bịa hiệu quả thực.",
            "Nêu chất lượng/freshness cần giám sát và cách xử lý khi KPI sai.",
            "Bàn giao requirement, mockup, glossary, mapping, UAT và change log."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.ba-standard",
      "title": "The Business Analysis Standard",
      "provider": "IIBA",
      "url": "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/the-foundation-for-effective-business-analysis/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "PDF Standard miễn phí qua form đăng ký; interactive KnowledgeHub dành cho thành viên. Không coi toàn bộ BABOK là tài liệu miễn phí.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.ba-intro",
      "title": "What is Business Analysis?",
      "provider": "IIBA",
      "url": "https://www.iiba.org/professional-development/career-centre/what-is-business-analysis/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Giới thiệu công khai về vai trò BA; dùng để định hướng trước Standard.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.ba-bpmn",
      "title": "BPMN primer",
      "provider": "Camunda",
      "url": "https://docs.camunda.io/docs/components/modeler/bpmn/bpmn-primer/",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Tài liệu công khai; bài chỉ vẽ mô hình, không cần mua/chạy nền tảng Camunda.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.ba-scrum",
      "title": "The Scrum Guide",
      "provider": "Scrum Guides",
      "url": "https://scrumguides.org/scrum-guide.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Hướng dẫn công khai; dùng phần Product Backlog/Definition of Done, không coi Scrum là toàn bộ nghiệp vụ BA.",
      "checkedAt": "2026-10-07"
    }
  ],
  "credentials": [
    {
      "id": "credential.ba-ecba",
      "name": "Entry Certificate in Business Analysis (ECBA)",
      "provider": "IIBA",
      "kind": "exam_certificate",
      "url": "https://www.iiba.org/business-analysis-certifications/ecba/",
      "cost": "paid",
      "prerequisites": "Mục tiêu kiến thức BA nền tảng; đọc handbook/roadmap hiện hành và chuẩn bị theo blueprint trước đăng ký.",
      "requirements": "Thi ECBA theo quy trình IIBA. Giá theo khu vực/ưu đãi sinh viên, xem trang chính thức; hoàn thành bộ hồ sơ mini không đồng nghĩa đạt chứng chỉ.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "credential.ba-cbda",
      "name": "Certification in Business Data Analytics (CBDA)",
      "provider": "IIBA",
      "kind": "exam_certificate",
      "url": "https://www.iiba.org/business-analysis-certifications/business-data-analytics-certification/",
      "cost": "unknown",
      "prerequisites": "Mục tiêu nâng cao sau portfolio Data/BI BA; cần chuẩn bị kiến thức phân tích dữ liệu trong bối cảnh kinh doanh.",
      "requirements": "Đăng ký/thi theo handbook và exam blueprint của IIBA. Chưa xác minh phí theo tài khoản/khu vực; xem điều kiện chính thức trước thanh toán.",
      "checkedAt": "2026-10-07"
    }
  ],
  "tracks": [
    {
      "id": "business-analyst.software-ba",
      "pathId": "business-analyst",
      "label": "IT / Software BA",
      "stageIds": [
        "business-analyst.discovery",
        "business-analyst.elicitation",
        "business-analyst.process",
        "business-analyst.requirements",
        "business-analyst.software-validation"
      ],
      "credentialIds": [
        "credential.ba-ecba"
      ],
      "roadmapLinks": [
        {
          "label": "IIBA Business Analysis Standard",
          "url": "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/the-foundation-for-effective-business-analysis/"
        }
      ],
      "portfolio": {
        "title": "Hồ sơ BA hệ thống mượn thiết bị",
        "acceptance": [
          "Problem/scope/stakeholders và biên bản khảo sát có nhãn giả lập.",
          "As-is/to-be gồm ngoại lệ, backlog và NFR có tiêu chí đo.",
          "Traceability tới UAT, change impact và danh sách quyết định chờ duyệt."
        ]
      }
    },
    {
      "id": "business-analyst.data-ba",
      "pathId": "business-analyst",
      "label": "Data / BI BA",
      "stageIds": [
        "business-analyst.discovery",
        "business-analyst.elicitation",
        "business-analyst.process",
        "business-analyst.requirements",
        "data.quality",
        "business-analyst.data-requirements",
        "business-analyst.data-validation"
      ],
      "credentialIds": [
        "credential.ba-ecba",
        "credential.ba-cbda"
      ],
      "roadmapLinks": [
        {
          "label": "IIBA Business Analysis Standard",
          "url": "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/the-foundation-for-effective-business-analysis/"
        }
      ],
      "portfolio": {
        "title": "Hồ sơ yêu cầu dashboard vận hành",
        "acceptance": [
          "KPI dictionary, grain/source mapping, owner, quyền và freshness.",
          "Mockup và dữ liệu giả lập có expected KPI, gồm mẫu số 0/dữ liệu thiếu.",
          "Traceability, UAT, change log và kế hoạch đo giá trị có baseline ghi rõ giả lập."
        ]
      }
    }
  ]
};
