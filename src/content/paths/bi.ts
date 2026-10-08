import type { ContentPack } from '../../domain/contracts';

// Depends on analystPack for data.quality/data.sql and shared resource IDs.
export const biPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-07.mw-team-04.1",
  "pathId": "bi",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "bi.model",
      "title": "Grain, KPI và mô hình sao",
      "phase": "foundation",
      "prerequisiteIds": [
        "data.sql"
      ],
      "resourceIds": [
        "resource.bi-star"
      ],
      "defaultResourceId": "resource.bi-star",
      "description": "Thiết kế facts/dimensions để báo cáo không nhân đôi số liệu.",
      "outcome": "Sơ đồ dữ liệu và bảng định nghĩa KPI.",
      "optional": false,
      "work": [
        {
          "id": "bi.model.star",
          "revision": 1,
          "title": "Thiết kế mô hình doanh thu cửa hàng",
          "minutes": 90,
          "acceptance": [
            "Vẽ fact order-line và dimension date/product/customer; ghi grain và khóa.",
            "Định nghĩa doanh thu thuần, số đơn và giá trị đơn bình quân, gồm bộ lọc và mẫu số.",
            "Dùng 10 dòng kiểm tra join không tăng tổng tiền."
          ]
        }
      ]
    },
    {
      "id": "bi.powerbi.prepare",
      "title": "Chuẩn bị dữ liệu Power BI",
      "phase": "build",
      "prerequisiteIds": [
        "bi.model"
      ],
      "resourceIds": [
        "resource.bi-desktop",
        "resource.data-powerquery"
      ],
      "defaultResourceId": "resource.bi-desktop",
      "description": "Nạp dữ liệu, Power Query và quan hệ trên Power BI Desktop.",
      "outcome": "PBIX có transform tái lập và mô hình đúng khóa.",
      "optional": false,
      "work": [
        {
          "id": "bi.powerbi.prepare.load",
          "revision": 1,
          "title": "Nạp orders/customers/products và sửa kiểu",
          "minutes": 120,
          "acceptance": [
            "Tạo CSV giả lập cho ít nhất 2 tháng và 3 nhóm sản phẩm; nạp bằng Power Query.",
            "Giữ bước sửa kiểu/ngày/null; quan hệ many-to-one không có đường lọc mơ hồ.",
            "Thay file nguồn cùng schema, refresh giữ được mô hình."
          ]
        }
      ]
    },
    {
      "id": "bi.powerbi.measures",
      "title": "DAX và ngữ cảnh lọc",
      "phase": "build",
      "prerequisiteIds": [
        "bi.powerbi.prepare"
      ],
      "resourceIds": [
        "resource.bi-dax"
      ],
      "defaultResourceId": "resource.bi-dax",
      "description": "Phân biệt measure và calculated column; kiểm tra KPI theo filter.",
      "outcome": "Measures khớp SQL ở tổng và phân nhóm.",
      "optional": false,
      "work": [
        {
          "id": "bi.powerbi.measures.kpi",
          "revision": 1,
          "title": "Viết ba measure và kiểm tra bộ lọc",
          "minutes": 120,
          "acceptance": [
            "Tạo Net Revenue, Order Count và Average Order Value với xử lý chia 0.",
            "Đối chiếu SQL ở toàn bộ dữ liệu, từng tháng và một nhóm sản phẩm.",
            "Ghi ví dụ filter context làm kết quả thay đổi và giải thích vì sao."
          ]
        }
      ]
    },
    {
      "id": "bi.powerbi.delivery",
      "title": "Dashboard Power BI và bàn giao",
      "phase": "ship",
      "prerequisiteIds": [
        "bi.powerbi.measures"
      ],
      "resourceIds": [
        "resource.bi-desktop"
      ],
      "defaultResourceId": "resource.bi-desktop",
      "description": "Bố trí báo cáo đáp ứng câu hỏi và quy trình refresh có kiểm tra.",
      "outcome": "PBIX và hướng dẫn sử dụng có bằng chứng đối chiếu.",
      "optional": false,
      "work": [
        {
          "id": "bi.powerbi.delivery.report",
          "revision": 1,
          "title": "Thiết kế dashboard doanh thu",
          "minutes": 120,
          "acceptance": [
            "Có trang overview và detail, slicer tháng/nhóm, đơn vị và tiêu đề rõ.",
            "Mỗi chart gắn một câu hỏi; bộ lọc không khiến KPI sai mẫu số.",
            "Ghi trường hợp không có dữ liệu và kiểm tra điều hướng bằng bàn phím."
          ]
        },
        {
          "id": "bi.powerbi.delivery.handoff",
          "revision": 1,
          "title": "Bàn giao và thử refresh/lỗi schema",
          "minutes": 75,
          "acceptance": [
            "Nộp PBIX, CSV giả lập, data dictionary, SQL và ảnh kết quả.",
            "Thử thêm dữ liệu tháng mới và file thiếu cột; ghi cách xử lý.",
            "Không bắt buộc publish service; nếu chia sẻ online phải kiểm tra license/quyền dữ liệu."
          ]
        }
      ]
    },
    {
      "id": "bi.tableau.prepare",
      "title": "Kết nối và tổ chức dữ liệu Tableau",
      "phase": "build",
      "prerequisiteIds": [
        "bi.model"
      ],
      "resourceIds": [
        "resource.bi-tableau-tutorial"
      ],
      "defaultResourceId": "resource.bi-tableau-tutorial",
      "description": "Kết nối bảng và kiểm tra kiểu, quan hệ, measure/dimension.",
      "outcome": "Workbook đúng dữ liệu và grain.",
      "optional": false,
      "work": [
        {
          "id": "bi.tableau.prepare.connect",
          "revision": 1,
          "title": "Kết nối CSV và đối chiếu tổng doanh thu",
          "minutes": 90,
          "acceptance": [
            "Kết nối dữ liệu giả lập orders/customers; khai báo quan hệ đúng grain.",
            "Chuyển ngày/tiền đúng kiểu và kiểm tra unmatched keys.",
            "Đối chiếu số dòng/tổng tiền với SQL trước khi vẽ."
          ]
        }
      ]
    },
    {
      "id": "bi.tableau.dashboard",
      "title": "Bộ lọc và dashboard Tableau",
      "phase": "build",
      "prerequisiteIds": [
        "bi.tableau.prepare"
      ],
      "resourceIds": [
        "resource.bi-tableau-tutorial"
      ],
      "defaultResourceId": "resource.bi-tableau-tutorial",
      "description": "Tạo calculated field, drill down và trình bày thông điệp.",
      "outcome": "Dashboard trả lời câu hỏi doanh thu có tương tác.",
      "optional": false,
      "work": [
        {
          "id": "bi.tableau.dashboard.views",
          "revision": 1,
          "title": "Xây ba view và dashboard",
          "minutes": 120,
          "acceptance": [
            "Có xu hướng tháng, xếp hạng sản phẩm và bảng chi tiết.",
            "Thêm bộ lọc tháng/nhóm và calculated field doanh thu thuần; kiểm tra tổng khớp SQL.",
            "Nhãn/tooltip có đơn vị; kiểm tra filter action và trạng thái rỗng."
          ]
        }
      ]
    },
    {
      "id": "bi.tableau.delivery",
      "title": "Story và chia sẻ Tableau",
      "phase": "ship",
      "prerequisiteIds": [
        "bi.tableau.dashboard"
      ],
      "resourceIds": [
        "resource.bi-tableau-tutorial",
        "resource.bi-tableau-public"
      ],
      "defaultResourceId": "resource.bi-tableau-tutorial",
      "description": "Bàn giao workbook và câu chuyện phân tích có giới hạn.",
      "outcome": "Workbook/story dùng dữ liệu giả lập, có hướng dẫn cập nhật.",
      "optional": false,
      "work": [
        {
          "id": "bi.tableau.delivery.publish",
          "revision": 1,
          "title": "Bàn giao workbook và story ba bước",
          "minutes": 90,
          "acceptance": [
            "Story gồm câu hỏi, bằng chứng và khuyến nghị; không kết luận nhân quả từ dashboard.",
            "Nộp workbook đóng gói và ảnh; mở lại trên máy/môi trường sạch với dữ liệu đi kèm.",
            "Nếu dùng Tableau Public, chỉ xuất dữ liệu giả lập vì dữ liệu/báo cáo công khai; không cần publish để pass."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.bi-star",
      "title": "Star schema guidance",
      "provider": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; dùng nguyên lý grain/fact/dimension cho hai công cụ.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.bi-desktop",
      "title": "Get started with Power BI Desktop",
      "provider": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Đọc miễn phí; lab cần máy Windows chạy Power BI Desktop. Chia sẻ trên service có điều kiện tài khoản/license riêng.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.bi-dax",
      "title": "Learn DAX basics",
      "provider": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-quickstart-learn-dax-basics",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí; làm bài trong Power BI Desktop sau khi nạp mô hình.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.bi-tableau-tutorial",
      "title": "Get Started with Tableau Desktop",
      "provider": "Tableau",
      "url": "https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm",
      "language": "en",
      "format": "course",
      "cost": "mixed",
      "level": "introductory",
      "accessNote": "Tài liệu miễn phí; làm bằng Desktop có license/trial hoặc bản Public với dữ liệu giả lập. Tùy bản có khác tính năng kết nối.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "resource.bi-tableau-public",
      "title": "Tableau Public: chia sẻ dữ liệu công khai",
      "provider": "Tableau",
      "url": "https://www.tableau.com/products/public",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Nền tảng Public miễn phí; cần tài khoản khi publish. Không đưa dữ liệu bí mật hoặc cá nhân lên Public.",
      "checkedAt": "2026-10-07"
    }
  ],
  "credentials": [
    {
      "id": "credential.bi-pl300",
      "name": "Microsoft Certified: Power BI Data Analyst Associate",
      "provider": "Microsoft",
      "kind": "exam_certificate",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
      "cost": "paid",
      "prerequisites": "Cần kỹ năng Power Query và DAX; chuẩn bị theo study guide hiện hành.",
      "requirements": "Thi PL-300 theo quy trình Microsoft; phí theo quốc gia/khu vực, kiểm tra lúc đặt lịch. Là mục tiêu bổ trợ, cần học thêm quản trị/bảo mật.",
      "checkedAt": "2026-10-07"
    },
    {
      "id": "credential.bi-tableau-foundations",
      "name": "Salesforce Certified Tableau Desktop Foundations",
      "provider": "Salesforce / Tableau",
      "kind": "exam_certificate",
      "url": "https://www.tableau.com/learn/certification",
      "cost": "unknown",
      "prerequisites": "Cần nền tảng Tableau Desktop; đối chiếu exam details chính thức trước đăng ký.",
      "requirements": "Trang Tableau hiện liệt kê chứng nhận Foundations. Trang exam details không trích xuất được nội dung trong lần kiểm tra; chưa xác minh phí/điều kiện chi tiết, không coi đây là chứng nhận miễn phí.",
      "checkedAt": "2026-10-07"
    }
  ],
  "tracks": [
    {
      "id": "bi.powerbi",
      "pathId": "bi",
      "label": "Power BI",
      "stageIds": [
        "data.quality",
        "data.sql",
        "bi.model",
        "bi.powerbi.prepare",
        "bi.powerbi.measures",
        "bi.powerbi.delivery"
      ],
      "credentialIds": [
        "credential.bi-pl300"
      ],
      "roadmapLinks": [
        {
          "label": "Power BI: star schema",
          "url": "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema"
        }
      ],
      "portfolio": {
        "title": "Dashboard doanh thu Power BI",
        "acceptance": [
          "PBIX có star schema, ba KPI DAX và filter đúng.",
          "CSV giả lập, SQL đối chiếu và quy trình refresh/lỗi schema.",
          "README về mục đích, grain, đơn vị, quyền chia sẻ và giới hạn phân tích."
        ]
      }
    },
    {
      "id": "bi.tableau",
      "pathId": "bi",
      "label": "Tableau",
      "stageIds": [
        "data.quality",
        "data.sql",
        "bi.model",
        "bi.tableau.prepare",
        "bi.tableau.dashboard",
        "bi.tableau.delivery"
      ],
      "credentialIds": [
        "credential.bi-tableau-foundations"
      ],
      "roadmapLinks": [
        {
          "label": "Tableau: tutorial theo bước",
          "url": "https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm"
        }
      ],
      "portfolio": {
        "title": "Workbook và story Tableau",
        "acceptance": [
          "Quan hệ/kiểu dữ liệu và tổng tiền được đối chiếu SQL.",
          "Dashboard tương tác và story có câu hỏi, phát hiện, khuyến nghị.",
          "Workbook mở lại được với dữ liệu giả lập; ghi rõ giới hạn Public."
        ]
      }
    }
  ]
};
