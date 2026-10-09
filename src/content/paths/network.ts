import type { ContentPack } from '../../domain/contracts';

// MW-TEAM-05: nội dung chờ review; registry/app do Hải tích hợp.
export const networkPack: ContentPack = {
  "schemaVersion": 1,
  "contentVersion": "2026-10-09.team05-review",
  "pathId": "network",
  "reviewStatus": "review",
  "stages": [
    {
      "id": "network.ipv4",
      "title": "IPv4 và subnetting",
      "phase": "foundation",
      "description": "Kế hoạch IPv4 không trùng subnet và có giải thích prefix/gateway.",
      "outcome": "Kế hoạch IPv4 không trùng subnet và có giải thích prefix/gateway.",
      "prerequisiteIds": [
        "cs.networking"
      ],
      "resourceIds": [
        "resource.network.cidr"
      ],
      "defaultResourceId": "resource.network.cidr",
      "optional": false,
      "work": [
        {
          "id": "network.ipv4.address-plan",
          "revision": 1,
          "title": "Chia địa chỉ cho ba mạng lab",
          "minutes": 90,
          "acceptance": [
            "Bảng có network/prefix/host range/broadcast/gateway.",
            "Kiểm ba cặp subnet không chồng lấn và đủ số host dự kiến."
          ]
        },
        {
          "id": "network.ipv4.cidr-verify",
          "revision": 1,
          "title": "Kiểm tra longest prefix và aggregation",
          "minutes": 60,
          "acceptance": [
            "Có hai route khớp và giải thích route được chọn.",
            "Tổng hợp prefix chỉ khi vùng địa chỉ thực sự liên tục/phù hợp."
          ]
        }
      ]
    },
    {
      "id": "network.ipv6",
      "title": "IPv6 và dual stack",
      "phase": "foundation",
      "description": "Phân biệt IPv6 header/address với IPv4 và kiểm được kết nối local.",
      "outcome": "Phân biệt IPv6 header/address với IPv4 và kiểm được kết nối local.",
      "prerequisiteIds": [
        "network.ipv4"
      ],
      "resourceIds": [
        "resource.network.ipv6"
      ],
      "defaultResourceId": "resource.network.ipv6",
      "optional": false,
      "work": [
        {
          "id": "network.ipv6.ipv6-lab",
          "revision": 1,
          "title": "Lập addressing IPv6 cho topology local",
          "minutes": 90,
          "acceptance": [
            "Phân biệt địa chỉ link-local/global hoặc ULA trong lab và prefix.",
            "Có kết quả ping IPv6 giữa hai namespace/VM, không yêu cầu Internet IPv6."
          ]
        },
        {
          "id": "network.ipv6.dual-stack",
          "revision": 1,
          "title": "So sánh luồng IPv4 và IPv6",
          "minutes": 60,
          "acceptance": [
            "Có packet/header mẫu và chỉ ra điểm khác biệt về địa chỉ/broadcast.",
            "Ghi route/interface được chọn cho từng giao thức."
          ]
        }
      ]
    },
    {
      "id": "network.switching",
      "title": "Bridge, VLAN và phân đoạn mạng",
      "phase": "build",
      "description": "Hai VLAN/segment được tách và kiểm forwarding trong VM lab.",
      "outcome": "Hai VLAN/segment được tách và kiểm forwarding trong VM lab.",
      "prerequisiteIds": [
        "network.ipv4",
        "cs.os-linux"
      ],
      "resourceIds": [
        "resource.network.bridge"
      ],
      "defaultResourceId": "resource.network.bridge",
      "optional": false,
      "work": [
        {
          "id": "network.switching.bridge-vlan",
          "revision": 1,
          "title": "Tạo hai segment trên Linux bridge lab",
          "minutes": 120,
          "acceptance": [
            "Topology và cấu hình được lưu, traffic cùng segment đi được.",
            "Traffic khác segment không đi nếu chưa có routing; chỉ thao tác VM riêng."
          ]
        },
        {
          "id": "network.switching.l2-debug",
          "revision": 1,
          "title": "Kiểm FDB và tình huống sai VLAN",
          "minutes": 60,
          "acceptance": [
            "Quan sát MAC/FDB hoặc bằng chứng simulator tương đương.",
            "Gây sai VLAN trong lab rồi tìm/sửa, không kết luận từ ping duy nhất."
          ]
        }
      ]
    },
    {
      "id": "network.routing",
      "title": "Static routing và gateway",
      "phase": "build",
      "description": "Topology ba subnet đi được theo route rõ và có đường về.",
      "outcome": "Topology ba subnet đi được theo route rõ và có đường về.",
      "prerequisiteIds": [
        "network.switching"
      ],
      "resourceIds": [
        "resource.network.static"
      ],
      "defaultResourceId": "resource.network.static",
      "optional": false,
      "work": [
        {
          "id": "network.routing.static-routes",
          "revision": 1,
          "title": "Cấu hình FRR static route cho topology",
          "minutes": 120,
          "acceptance": [
            "Có route table trước/sau và sơ đồ hop.",
            "Ping/traceroute qua router và đường về đúng; tài nguyên nằm trong VM/namespace."
          ]
        },
        {
          "id": "network.routing.route-failure",
          "revision": 1,
          "title": "Chẩn đoán thiếu route và sai gateway",
          "minutes": 90,
          "acceptance": [
            "Hai lỗi có expected/actual và cách khoanh vùng.",
            "Ghi cấu hình cuối và cách tái tạo topology từ đầu."
          ]
        }
      ]
    },
    {
      "id": "network.ospf",
      "title": "Dynamic routing với OSPF",
      "phase": "build",
      "description": "Router lab hình thành neighbor và cập nhật route khi thay đường.",
      "outcome": "Router lab hình thành neighbor và cập nhật route khi thay đường.",
      "prerequisiteIds": [
        "network.routing"
      ],
      "resourceIds": [
        "resource.network.ospf"
      ],
      "defaultResourceId": "resource.network.ospf",
      "optional": false,
      "work": [
        {
          "id": "network.ospf.ospf-neighbors",
          "revision": 1,
          "title": "Thiết lập OSPF area cho ba router FRR",
          "minutes": 120,
          "acceptance": [
            "Neighbor đạt trạng thái phù hợp và prefix quảng bá đúng.",
            "Ghi router ID/area/interface, không quảng bá mạng ngoài lab."
          ]
        },
        {
          "id": "network.ospf.convergence",
          "revision": 1,
          "title": "Thử thay topology và quan sát hội tụ",
          "minutes": 90,
          "acceptance": [
            "Ngắt một link lab và ghi thay đổi route/khôi phục.",
            "Nêu thời gian quan sát và hạn chế, không hứa hội tụ thực tế từ simulator."
          ]
        }
      ]
    },
    {
      "id": "network.dns",
      "title": "DNS và dịch vụ mạng",
      "phase": "build",
      "description": "Zone DNS lab được kiểm authoritative answer và lỗi cấu hình.",
      "outcome": "Zone DNS lab được kiểm authoritative answer và lỗi cấu hình.",
      "prerequisiteIds": [
        "network.routing",
        "cs.os-linux"
      ],
      "resourceIds": [
        "resource.network.dns"
      ],
      "defaultResourceId": "resource.network.dns",
      "optional": false,
      "work": [
        {
          "id": "network.dns.zone-file",
          "revision": 1,
          "title": "Tạo zone local với bản ghi A/AAAA",
          "minutes": 90,
          "acceptance": [
            "named-checkconf/zone hoặc công cụ tương đương qua.",
            "dig tới DNS VM trả record đúng với zone riêng, không đổi DNS hệ thống chính."
          ]
        },
        {
          "id": "network.dns.dns-failure",
          "revision": 1,
          "title": "Phân biệt NXDOMAIN, timeout và sai record",
          "minutes": 60,
          "acceptance": [
            "Ba tình huống có output và lý do khác nhau.",
            "Có log truy vấn đã loại dữ liệu riêng và cách revert config lab."
          ]
        }
      ]
    },
    {
      "id": "network.capture",
      "title": "Packet capture và troubleshooting",
      "phase": "ship",
      "description": "PCAP và báo cáo chứng minh đường đi/giao thức thay vì chỉ chụp ping.",
      "outcome": "PCAP và báo cáo chứng minh đường đi/giao thức thay vì chỉ chụp ping.",
      "prerequisiteIds": [
        "network.dns",
        "network.ipv6"
      ],
      "resourceIds": [
        "resource.network.capture"
      ],
      "defaultResourceId": "resource.network.capture",
      "optional": false,
      "work": [
        {
          "id": "network.capture.pcap",
          "revision": 1,
          "title": "Bắt traffic DNS và TCP trong lab",
          "minutes": 90,
          "acceptance": [
            "PCAP có request/response và bộ lọc được ghi.",
            "Xác định IP/port/protocol cho hai luồng; không nộp token hoặc traffic người khác."
          ]
        },
        {
          "id": "network.capture.troubleshoot",
          "revision": 1,
          "title": "Điều tra lỗi end-to-end bằng nhiều lớp",
          "minutes": 90,
          "acceptance": [
            "Kiểm interface, route, DNS và TCP với bằng chứng từng lớp.",
            "Kết luận từ capture/log, ghi điều kiện tái hiện và xác nhận sau sửa."
          ]
        }
      ]
    },
    {
      "id": "network.inventory",
      "title": "Python và inventory mạng",
      "phase": "build",
      "description": "Inventory JSON được validate trước khi kết nối thiết bị.",
      "outcome": "Inventory JSON được validate trước khi kết nối thiết bị.",
      "prerequisiteIds": [
        "network.capture",
        "language.python",
        "cs.git"
      ],
      "resourceIds": [
        "resource.network.ipaddress"
      ],
      "defaultResourceId": "resource.network.ipaddress",
      "optional": false,
      "work": [
        {
          "id": "network.inventory.inventory-validator",
          "revision": 1,
          "title": "Kiểm inventory IP/subnet bằng Python",
          "minutes": 90,
          "acceptance": [
            "Từ chối địa chỉ lỗi/subnet trùng và ghi device ID gây lỗi.",
            "Test có IPv4, IPv6 và input thiếu trường."
          ]
        },
        {
          "id": "network.inventory.dry-run",
          "revision": 1,
          "title": "Tạo báo cáo kế hoạch thay đổi offline",
          "minutes": 90,
          "acceptance": [
            "In diff/intended change từ inventory, không chạy lệnh cấu hình.",
            "Lưu baseline và file kết quả có version; không để credential trong JSON/Git."
          ]
        }
      ]
    },
    {
      "id": "network.ssh",
      "title": "Thu thập trạng thái qua SSH",
      "phase": "build",
      "description": "Script đọc trạng thái của VM/thiết bị được phép, có timeout và lỗi riêng.",
      "outcome": "Script đọc trạng thái của VM/thiết bị được phép, có timeout và lỗi riêng.",
      "prerequisiteIds": [
        "network.inventory"
      ],
      "resourceIds": [
        "resource.network.ssh"
      ],
      "defaultResourceId": "resource.network.ssh",
      "optional": false,
      "work": [
        {
          "id": "network.ssh.readonly-ssh",
          "revision": 1,
          "title": "Đọc interface/route của hai VM lab",
          "minutes": 120,
          "acceptance": [
            "Driver Netmiko phù hợp và lệnh chỉ đọc trên Linux VM hoặc thiết bị lab.",
            "Kết quả lưu theo device; timeout/auth failure được phân biệt, không có password trong log."
          ]
        },
        {
          "id": "network.ssh.ssh-test",
          "revision": 1,
          "title": "Kiểm host không sẵn sàng và kết nối lại",
          "minutes": 60,
          "acceptance": [
            "Một host lỗi không làm mất kết quả host còn lại.",
            "Có quy tắc host-key/credential và hướng dẫn lab SSH, không quét dải IP ngoài inventory."
          ]
        }
      ]
    },
    {
      "id": "network.ansible",
      "title": "Automation có kiểm soát với Ansible",
      "phase": "ship",
      "description": "Playbook có inventory, kiểm trước/sau và rollback trên lab phù hợp.",
      "outcome": "Playbook có inventory, kiểm trước/sau và rollback trên lab phù hợp.",
      "prerequisiteIds": [
        "network.ssh"
      ],
      "resourceIds": [
        "resource.network.ansible"
      ],
      "defaultResourceId": "resource.network.ansible",
      "optional": false,
      "work": [
        {
          "id": "network.ansible.playbook",
          "revision": 1,
          "title": "Viết playbook cho thay đổi nhỏ trong VM lab",
          "minutes": 120,
          "acceptance": [
            "Chọn module đúng platform; dry run/diff nếu module hỗ trợ.",
            "Có backup cấu hình và giới hạn inventory; không ghi đè config thiết bị thật."
          ]
        },
        {
          "id": "network.ansible.idempotence",
          "revision": 1,
          "title": "Kiểm idempotence và rollback",
          "minutes": 90,
          "acceptance": [
            "Lần chạy thứ hai không tạo thay đổi không cần thiết.",
            "Khôi phục baseline và xác nhận route/interface, nêu module không hỗ trợ check mode."
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "id": "resource.network.cidr",
      "title": "CIDR address assignment: RFC 4632",
      "provider": "IETF / RFC Editor",
      "url": "https://www.rfc-editor.org/rfc/rfc4632",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "RFC công khai; tập trung prefix/aggregation, dùng bảng subnet do sinh viên tự lập; không lấy class A/B/C làm cách cấp phát hiện đại.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.ipv6",
      "title": "IPv6 specification: RFC 8200",
      "provider": "IETF / RFC Editor",
      "url": "https://www.rfc-editor.org/rfc/rfc8200",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "RFC công khai; xem cấu trúc header và chuyển tiếp, không yêu cầu đọc hết RFC trong một bài.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.bridge",
      "title": "Ethernet bridging and VLAN filtering",
      "provider": "Linux Kernel Project",
      "url": "https://docs.kernel.org/networking/bridge.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu Linux công khai; lab namespace/bridge cần Linux VM và quyền quản trị trong VM riêng, không thay cấu hình mạng máy học thật.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.static",
      "title": "FRRouting static routes",
      "provider": "FRRouting Project",
      "url": "https://docs.frrouting.org/en/latest/static.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "FRR mã nguồn mở; chạy trong Linux VM/container lab. Có thể dùng simulator hợp pháp, ghi rõ công cụ và khác biệt cú pháp.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.ospf",
      "title": "FRRouting OSPFv2",
      "provider": "FRRouting Project",
      "url": "https://docs.frrouting.org/en/latest/ospfd.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "advanced",
      "accessNote": "Tài liệu công khai; topology FRR 3 router trong VM/namespace, không cần thiết bị Cisco thật.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.dns",
      "title": "BIND: configurations and zone files",
      "provider": "Internet Systems Consortium",
      "url": "https://bind9.readthedocs.io/en/latest/chapter3.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Đọc công khai; BIND/dig chạy trên VM riêng. Zone thử nghiệm local; không thay DNS tổ chức hoặc công bố zone lab.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.capture",
      "title": "Wireshark introduction",
      "provider": "Wireshark Foundation",
      "url": "https://www.wireshark.org/docs/wsug_html_chunked/ChapterIntroduction.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "introductory",
      "accessNote": "Wireshark miễn phí; quyền capture tùy OS. Chỉ bắt traffic lab của mình, loại bỏ token/dữ liệu cá nhân khỏi pcap nộp bài.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.ipaddress",
      "title": "Python ipaddress library",
      "provider": "Python Software Foundation",
      "url": "https://docs.python.org/3/library/ipaddress.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Thư viện chuẩn Python, không cần package trả phí; kiểm inventory JSON và subnet offline.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.ssh",
      "title": "Netmiko official repository",
      "provider": "Kirk Byers / Netmiko Maintainers",
      "url": "https://github.com/ktbyers/netmiko",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Mã nguồn/tài liệu công khai; cần Python và SSH tới thiết bị/VM lab được phép, driver phải phù hợp. Lab Linux chỉ đọc ip/route; không mặc định simulator Packet Tracer nhận SSH từ host.",
      "checkedAt": "2026-10-09"
    },
    {
      "id": "resource.network.ansible",
      "title": "Ansible network getting started",
      "provider": "Ansible Community",
      "url": "https://docs.ansible.com/projects/ansible/latest/network/getting_started/index.html",
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "advanced",
      "accessNote": "Đọc miễn phí; Ansible chạy ở Linux/WSL control node. Chọn module phù hợp thiết bị; lab VM Linux dùng module Linux, không giả IOS bằng lệnh Linux.",
      "checkedAt": "2026-10-09"
    }
  ],
  "credentials": [
    {
      "id": "credential.network.ccna",
      "name": "Cisco Certified Network Associate (CCNA)",
      "provider": "Cisco",
      "kind": "exam_certificate",
      "url": "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
      "cost": "paid",
      "prerequisites": "Nắm network/access/IP services/security và automation theo exam topics; portfolio lab không thay kỳ thi.",
      "requirements": "Đăng ký/vượt kỳ thi CCNA hiện hành; trang kiểm tra ghi 120 phút và 300 USD, xác nhận version/giá khi đăng ký. Không yêu cầu mua router cho portfolio local.",
      "checkedAt": "2026-10-09"
    }
  ],
  "tracks": [
    {
      "id": "network.network",
      "pathId": "network",
      "label": "Mạng và mô phỏng",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "network.ipv4",
        "network.ipv6",
        "network.switching",
        "network.routing",
        "network.ospf",
        "network.dns",
        "network.capture"
      ],
      "credentialIds": [
        "credential.network.ccna"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html"
        }
      ],
      "portfolio": {
        "title": "Topology dual stack và báo cáo troubleshooting",
        "acceptance": [
          "Sơ đồ/subnet/route/DNS và cấu hình FRR/Linux lab có thể dựng lại.",
          "Có capture của luồng thành công và lỗi, giải thích đường về và hội tụ trong lab.",
          "PCAP đã loại thông tin riêng; README ghi thiết bị/công cụ/phạm vi và hạn chế simulator."
        ]
      }
    },
    {
      "id": "network.automation",
      "pathId": "network",
      "label": "Network Automation / Python",
      "stageIds": [
        "cs.git",
        "cs.networking",
        "cs.os-linux",
        "web.http",
        "language.python",
        "network.ipv4",
        "network.ipv6",
        "network.switching",
        "network.routing",
        "network.ospf",
        "network.dns",
        "network.capture",
        "network.inventory",
        "network.ssh",
        "network.ansible"
      ],
      "credentialIds": [
        "credential.network.ccna"
      ],
      "roadmapLinks": [
        {
          "label": "Khung tham khảo",
          "url": "https://docs.ansible.com/projects/ansible/latest/network/getting_started/index.html"
        }
      ],
      "portfolio": {
        "title": "Inventory và pipeline thay đổi mạng lab",
        "acceptance": [
          "Inventory validator từ chối input lỗi; readonly SSH có kết quả nhiều host và lỗi timeout.",
          "Playbook module đúng platform có diff/backup/idempotence/rollback lab.",
          "Không lưu password trong repo; chỉ tác động inventory được phép, báo giới hạn driver/check mode."
        ]
      }
    }
  ]
};
