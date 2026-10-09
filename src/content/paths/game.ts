// src/content/paths/game.ts
// ContentPack cho hướng Game Developer — 3 track: Unity/C#, Unreal/C++, Godot/GDScript.
// reviewStatus='review': đã rà nguồn và bài ngày 07/10/2026; chờ Hải nghiệm thu.
// Bằng chứng theo từng nguồn: docs/tasks/MW-TEAM-02/CONTENT_REVIEW.md.

import type { ContentPack } from '../../domain/contracts';

export const gamePack: ContentPack = {
  schemaVersion: 1,
  contentVersion: '2026-10-07.review',
  pathId: 'game',
  reviewStatus: 'review',

  // ─── Resources ────────────────────────────────────────────────────────────
  resources: [
    {
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí, đọc trên web.",
      "checkedAt": "2026-10-07",
      "id": "resource.game.godot-tilemaps",
      "title": "Using TileMaps / TileMapLayer",
      "provider": "Godot Engine",
      "url": "https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html"
    },
    {
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí, đọc trên web.",
      "checkedAt": "2026-10-07",
      "id": "resource.game.unity-2d",
      "title": "2D game development in Unity",
      "provider": "Unity Technologies",
      "url": "https://docs.unity3d.com/Manual/Unity2D.html"
    },
    {
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí. Học khái niệm vector/dot/cross chung; viết bài trong ngôn ngữ/engine đang chọn, không bắt track Unity/Unreal dùng GDScript.",
      "checkedAt": "2026-10-07",
      "id": "resource.game.vector-math",
      "title": "Vector math — Godot documentation",
      "provider": "Godot Engine",
      "url": "https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html"
    },
    {
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí, đọc trên web.",
      "checkedAt": "2026-10-07",
      "id": "resource.game.unreal-packaging",
      "title": "Packaging Your Project",
      "provider": "Epic Games",
      "url": "https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project"
    },
    {
      "language": "en",
      "format": "article",
      "cost": "free",
      "level": "intermediate",
      "accessNote": "Tài liệu miễn phí, đọc trên web.",
      "checkedAt": "2026-10-07",
      "id": "resource.game.unity-ugui",
      "title": "Unity UI (uGUI) — Canvas and controls",
      "provider": "Unity Technologies",
      "url": "https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html"
    },
    // ── Git chung ──────────────────────────────────────────────────────────
    {
      id: 'resource.game.git-docs',
      title: 'Git Documentation',
      provider: 'Git SCM',
      url: "https://git-scm.com/docs",
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.git-lfs',
      title: 'Git LFS (Large File Storage)',
      provider: 'GitHub',
      url: 'https://git-lfs.com/',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: "Git LFS là mã nguồn mở miễn phí; storage/bandwidth của dịch vụ hosting có hạn mức và có thể tính phí, kể cả repo public.",
      checkedAt: '2026-10-07',
    },

    // ── C# / Unity ─────────────────────────────────────────────────────────
    {
      id: 'resource.game.csharp-docs',
      title: 'C# Documentation (Microsoft)',
      provider: 'Microsoft',
      url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-learn',
      title: "Unity Essentials",
      provider: 'Unity Technologies',
      url: "https://learn.unity.com/pathway/unity-essentials",
      language: 'en', format: 'course', cost: 'free', level: 'introductory',
      accessNote: "Pathway học miễn phí; tài khoản Unity dùng để lưu tiến độ. Kiểm tra điều kiện license của Editor trước khi dùng; lab không yêu cầu asset trả phí.",
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-manual',
      title: 'Unity Manual',
      provider: 'Unity Technologies',
      url: 'https://docs.unity3d.com/Manual/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'mixed',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-scripting-api',
      title: 'Unity Scripting API Reference',
      provider: 'Unity Technologies',
      url: 'https://docs.unity3d.com/ScriptReference/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'mixed',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-physics-docs',
      title: 'Unity Physics Documentation',
      provider: 'Unity Technologies',
      url: 'https://docs.unity3d.com/Manual/PhysicsSection.html',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },

    {
      id: 'resource.game.unity-test-framework',
      title: 'Unity Test Framework Documentation',
      provider: 'Unity Technologies',
      url: 'https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-addressables',
      title: 'Unity Addressables Documentation',
      provider: 'Unity Technologies',
      url: 'https://docs.unity3d.com/Packages/com.unity.addressables@2.0/manual/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'advanced',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unity-game-dev-course',
      title: 'Complete C# Unity Game Developer 3D (Udemy)',
      provider: 'GameDev.tv / Udemy',
      url: 'https://www.udemy.com/course/unitycourse2/',
      language: 'en', format: 'course', cost: 'paid', level: 'introductory',
      accessNote: "Khóa GameDev.tv trên Udemy trả phí; giá theo khu vực/tài khoản/khuyến mại. Không bắt buộc mua khóa cho các bài miễn phí trong track.",
      checkedAt: '2026-10-07',
    },

    // ── C++ / Unreal ───────────────────────────────────────────────────────
    {
      id: 'resource.game.cpp-tour',
      title: "LearnCpp — C++ tutorials",
      provider: 'learncpp.com',
      url: 'https://www.learncpp.com',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unreal-docs',
      title: "Programming with C++ in Unreal Engine",
      provider: 'Epic Games',
      url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine",
      language: 'en', format: 'article', cost: 'free', level: 'mixed',
      accessNote: "Tài liệu miễn phí. Lab cần Unreal Editor, compiler C++ và SDK phù hợp hệ điều hành; xem điều kiện license của Epic nếu phát hành thương mại.",
      checkedAt: '2026-10-07',
    },

    {
      id: 'resource.game.unreal-blueprint-docs',
      title: 'Unreal Engine Blueprint Visual Scripting',
      provider: 'Epic Games',
      url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unreal-gameplay-framework',
      title: 'Gameplay Framework in Unreal Engine',
      provider: 'Epic Games',
      url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.unreal-optimization-docs',
      title: "Testing and Optimizing Your Content",
      provider: 'Epic Games',
      url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/testing-and-optimizing-your-content",
      language: 'en', format: 'article', cost: 'free', level: 'advanced',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },

    // ── GDScript / Godot ───────────────────────────────────────────────────
    {
      id: 'resource.game.godot-docs',
      title: 'Godot Documentation',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web. Godot Engine là phần mềm mã nguồn mở MIT.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.gdscript-docs',
      title: 'GDScript Reference',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html',
      language: 'en', format: 'article', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-your-first-2d',
      title: 'Your First 2D Game (Godot Tutorial)',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html',
      language: 'en', format: 'lab', cost: 'free', level: 'introductory',
      accessNote: 'Miễn phí, hướng dẫn chính thức theo bước.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-your-first-3d',
      title: 'Your First 3D Game (Godot Tutorial)',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html',
      language: 'en', format: 'lab', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, hướng dẫn chính thức theo bước.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-ui-docs',
      title: 'Godot UI and Control Nodes',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/tutorials/ui/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-signals-docs',
      title: 'Godot Signals and Groups',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, đọc trên web.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-export-docs',
      title: 'Godot Export Documentation',
      provider: 'Godot Engine',
      url: 'https://docs.godotengine.org/en/stable/tutorials/export/index.html',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí. Xuất HTML5 miễn phí; store cần tài khoản Google Play / Apple Developer.',
      checkedAt: '2026-10-07',
    },
    {
      id: 'resource.game.godot-unit-test',
      title: 'GUT (Godot Unit Testing) Documentation',
      provider: 'bitwes / GUT',
      url: 'https://gut.readthedocs.io/en/latest/',
      language: 'en', format: 'article', cost: 'free', level: 'intermediate',
      accessNote: 'Miễn phí, cài qua Godot Asset Library.',
      checkedAt: '2026-10-07',
    },
  ],

  // ─── Stages ───────────────────────────────────────────────────────────────
  stages: [

    // ── Chặng chung ─────────────────────────────────────────────────────────
    {
      id: 'game.shared.git',
      title: 'Git và Git LFS cho game development',
      phase: 'foundation',
      description: 'Commit, branch, merge và Git LFS để quản lý asset lớn (texture, audio, model).',
      outcome: 'Quản lý được lịch sử code + asset game trong cùng một repo.',
      prerequisiteIds: [],
      resourceIds: ['resource.game.git-docs', 'resource.game.git-lfs'],
      defaultResourceId: 'resource.game.git-docs',
      optional: false,
      work: [
        {
          id: 'game.shared.git.w01',
          revision: 1,
          title: 'Git cơ bản và cấu hình Git LFS cho asset',
          minutes: 60,
          acceptance: [
            'Tạo được repo, commit code và binary asset (ảnh, audio) qua Git LFS.',
            'Clone lại repo trên máy khác vẫn kéo được asset đúng.',
          ],
        },
      ],
    },

    {
      id: 'game.shared.math',
      title: 'Toán học cơ bản cho game (Vector, Ma trận, Tọa độ)',
      phase: 'foundation',
      description: "Vector 2D/3D, dot/cross product, hướng và hệ tọa độ. Áp dụng bằng C#, C++ hoặc GDScript theo track.",
      outcome: "Tính đúng hướng chuyển động và xử lý vector độ dài bằng 0 trong engine đang chọn.",
      prerequisiteIds: [],
      resourceIds: ["resource.game.vector-math"],
      defaultResourceId: "resource.game.vector-math",
      optional: false,
      work: [
        {
          id: 'game.shared.math.w01',
          revision: 2,
          title: 'Vector 2D/3D và toán học không gian',
          minutes: 90,
          acceptance: ["Tính hướng chuẩn hóa A đến B bằng C#/C++/GDScript theo track; kiểm tra A=B không tạo NaN.","Giải thích dot/cross product bằng ví dụ góc nhìn/hướng vuông góc; kiểm tra ít nhất 3 bộ tọa độ."],
        },
      ],
    },

    // ── Unity ──────────────────────────────────────────────────────────────
    {
      id: 'game.unity.csharp',
      title: 'C# cơ bản cho Unity',
      phase: 'foundation',
      description: 'Kiểu dữ liệu, class, interface, delegate, event và LINQ trong C#.',
      outcome: "Viết được chương trình C# có class, interface và event trước khi cài Unity Editor.",
      prerequisiteIds: ['game.shared.git'],
      resourceIds: ['resource.game.csharp-docs', 'resource.game.unity-learn'],
      defaultResourceId: 'resource.game.csharp-docs',
      optional: false,
      work: [
        {
          id: 'game.unity.csharp.w01',
          revision: 1,
          title: 'Class, interface, delegate và event trong C#',
          minutes: 90,
          acceptance: [
            'Viết được class Player implement interface IDamageable.',
            'Event OnDeath kích hoạt được và được lắng nghe từ script khác.',
          ],
        },
        {
          id: 'game.unity.csharp.w02',
          revision: 2,
          title: "Vòng lặp và event trong chương trình C# console",
          minutes: 60,
          acceptance: ["Viết vòng lặp đếm ngược và phát event OnFinished trong console app.","Có người nhận event cập nhật trạng thái; chưa yêu cầu Unity Editor ở chặng C# nền tảng."],
        },
      ],
    },
    {
      id: 'game.unity.setup',
      title: 'Unity Editor và dự án đầu tiên',
      phase: 'foundation',
      description: "Cài Unity Hub/Editor tương thích và module build đích; dùng template 2D, asset tự tạo hoặc miễn phí có license rõ. Làm quen Scene/GameObject/Prefab.",
      outcome: 'Tạo được dự án Unity, import asset và dựng được Scene đơn giản có ánh sáng.',
      prerequisiteIds: ['game.unity.csharp'],
      resourceIds: ['resource.game.unity-learn', 'resource.game.unity-manual'],
      defaultResourceId: 'resource.game.unity-learn',
      optional: false,
      work: [
        {
          id: 'game.unity.setup.w01',
          revision: 1,
          title: 'Tạo Scene, thêm GameObject và viết script đầu tiên',
          minutes: 90,
          acceptance: [
            'Scene có Cube di chuyển theo phím WASD bằng script C#.',
            'Prefab của Cube tạo được và tái sử dụng nhiều lần.',
          ],
        },
      ],
    },
    {
      id: 'game.unity.core2d',
      title: 'Lập trình game 2D với Unity',
      phase: 'build',
      description: 'Sprite, Tilemap, Rigidbody2D, Collider2D, Animator và Camera 2D.',
      outcome: 'Xây được prototype 2D platformer cơ bản có physics và animation.',
      prerequisiteIds: ['game.unity.setup', 'game.shared.math'],
      resourceIds: ['resource.game.unity-2d', 'resource.game.unity-physics-docs'],
      defaultResourceId: 'resource.game.unity-2d',
      optional: false,
      work: [
        {
          id: 'game.unity.core2d.w01',
          revision: 1,
          title: 'Sprite, Tilemap và Rigidbody2D movement',
          minutes: 90,
          acceptance: [
            'Player di chuyển trái phải và nhảy qua Physics2D đúng.',
            'Tilemap tạo được một màn chơi platformer đơn giản.',
          ],
        },
        {
          id: 'game.unity.core2d.w02',
          revision: 1,
          title: 'Animator, trigger và Camera follow',
          minutes: 90,
          acceptance: [
            'Animation chuyển đúng giữa Idle/Run/Jump bằng Animator Controller.',
            'Camera theo nhân vật không lệch.',
          ],
        },
      ],
    },
    {
      id: 'game.unity.ui',
      title: 'Giao diện người dùng (HUD và Menu)',
      phase: 'build',
      description: "uGUI: Canvas, Button và TextMeshPro cho HUD/menu.",
      outcome: 'Có màn hình menu và HUD hiển thị điểm/máu cập nhật theo game state.',
      prerequisiteIds: ['game.unity.core2d'],
      resourceIds: ["resource.game.unity-ugui","resource.game.unity-manual"],
      defaultResourceId: "resource.game.unity-ugui",
      optional: false,
      work: [
        {
          id: 'game.unity.ui.w01',
          revision: 1,
          title: 'Canvas, Button và TextMeshPro cho HUD',
          minutes: 90,
          acceptance: [
            'HUD hiển thị điểm tăng khi thu thập item.',
            'Menu có nút Play và Quit hoạt động đúng.',
          ],
        },
      ],
    },
    {
      id: 'game.unity.patterns',
      title: 'Design pattern: GameManager, Observer và Object Pool',
      phase: 'build',
      description: 'Singleton GameManager, Observer bằng event C#, Object Pooling cho đạn/enemy.',
      outcome: 'Code ít coupling, không memory leak khi spawn nhiều object.',
      prerequisiteIds: ['game.unity.ui'],
      resourceIds: ['resource.game.unity-scripting-api', 'resource.game.unity-learn'],
      defaultResourceId: 'resource.game.unity-scripting-api',
      optional: false,
      work: [
        {
          id: 'game.unity.patterns.w01',
          revision: 1,
          title: 'GameManager Singleton và Observer với C# event',
          minutes: 90,
          acceptance: [
            'GameManager giữ game state; script khác không gọi trực tiếp mà dùng event.',
          ],
        },
        {
          id: 'game.unity.patterns.w02',
          revision: 2,
          title: 'Object Pool cho đạn/enemy',
          minutes: 75,
          acceptance: ["Pool tái sử dụng object sau khi trả về; không Instantiate thêm khi số active chưa vượt pool đã cấp.","Ghi một phép đo Profiler trước/sau trên cùng thiết bị và scene; giải thích allocation còn lại, không cam kết FPS tuyệt đối."],
        },
      ],
    },
    {
      id: 'game.unity.publish',
      title: 'Kiểm thử, tối ưu và phát hành',
      phase: 'ship',
      description: 'Unity Test Framework (Play Mode/Edit Mode test), Profiler, build WebGL/Android.',
      outcome: "Game có test và build phân phối được; đo và ghi bottleneck trên thiết bị thử thay vì cam kết 60 FPS mọi máy.",
      prerequisiteIds: ['game.unity.patterns'],
      resourceIds: ['resource.game.unity-test-framework', 'resource.game.unity-addressables'],
      defaultResourceId: 'resource.game.unity-test-framework',
      optional: false,
      work: [
        {
          id: 'game.unity.publish.w01',
          revision: 1,
          title: 'Edit Mode test cho logic không phụ thuộc Scene',
          minutes: 75,
          acceptance: [
            'Ít nhất 3 Edit Mode test kiểm tra logic điểm số, HP và điều kiện thắng/thua.',
          ],
        },
        {
          id: 'game.unity.publish.w02',
          revision: 1,
          title: 'Profiler, tối ưu và build WebGL hoặc Android',
          minutes: 90,
          acceptance: [
            'Profiler không báo GC Alloc đáng kể trong gameplay.',
            'Build WebGL chạy được trong trình duyệt hoặc APK cài được trên thiết bị Android.',
          ],
        },
        {
          "id": "game.unity.portfolio.w01",
          "revision": 1,
          "title": "Tích hợp portfolio: 2D Platformer Game (Unity / C#)",
          "minutes": 120,
          "acceptance": [
            "Game 2D hoàn chỉnh có ít nhất 2 màn chơi, enemy AI và hệ thống điểm số.",
            "UI có màn hình chính, game over và điểm cao (local).",
            "Có ≥3 Edit Mode test cho logic game.",
            "Build WebGL hoặc APK chạy được, có hướng dẫn cài đặt/chơi.",
            "README ghi môi trường, cách chạy/test, nguồn asset và giới hạn; có ảnh hoặc video demo."
          ]
        },
      ],
    },

    // ── Unreal ─────────────────────────────────────────────────────────────
    {
      id: 'game.unreal.cpp',
      title: 'C++ cơ bản cho Unreal Engine',
      phase: 'foundation',
      description: "Cần máy phù hợp Unreal Editor, compiler C++ và SDK Windows cho đích Shipping Windows. Học class/template/con trỏ trước, rồi tạo UObject/Actor; không yêu cầu dịch vụ trả phí.",
      outcome: 'Viết được Actor C++ đơn giản, hiểu vòng đời UObject và cách Unreal quản lý bộ nhớ.',
      prerequisiteIds: ['game.shared.git'],
      resourceIds: ['resource.game.cpp-tour', 'resource.game.unreal-docs'],
      defaultResourceId: 'resource.game.cpp-tour',
      optional: false,
      work: [
        {
          id: 'game.unreal.cpp.w01',
          revision: 1,
          title: 'C++: con trỏ, class và template cơ bản',
          minutes: 90,
          acceptance: [
            'Viết được class Stack<T> dùng template, không memory leak.',
            'Phân biệt được stack allocation và heap allocation.',
          ],
        },
        {
          id: 'game.unreal.cpp.w02',
          revision: 1,
          title: 'UObject, UCLASS và vòng đời Actor',
          minutes: 90,
          acceptance: [
            'Tạo được AActor subclass bằng C++; BeginPlay và Tick hoạt động.',
            'UPROPERTY và UFUNCTION được khai báo đúng để Unreal quản lý.',
          ],
        },
      ],
    },
    {
      id: 'game.unreal.blueprint',
      title: 'Blueprint và Gameplay Framework',
      phase: 'foundation',
      description: 'Blueprint graph, Character, PlayerController, GameMode và Camera.',
      outcome: 'Prototype gameplay cơ bản bằng Blueprint, hiểu Gameplay Framework rõ ràng.',
      prerequisiteIds: ['game.unreal.cpp'],
      resourceIds: ["resource.game.unreal-blueprint-docs","resource.game.unreal-gameplay-framework"],
      defaultResourceId: "resource.game.unreal-blueprint-docs",
      optional: false,
      work: [
        {
          id: 'game.unreal.blueprint.w01',
          revision: 1,
          title: 'Blueprint Character di chuyển và nhảy',
          minutes: 90,
          acceptance: [
            'Character Blueprint di chuyển bằng WASD, nhảy bằng Space.',
            'Camera Spring Arm theo nhân vật đúng góc.',
          ],
        },
        {
          id: 'game.unreal.blueprint.w02',
          revision: 1,
          title: 'Gameplay Framework: GameMode, PlayerController và HUD',
          minutes: 90,
          acceptance: [
            'GameMode tùy chỉnh xử lý điều kiện thắng/thua.',
            'HUD Blueprint hiển thị điểm số cập nhật qua Blueprint event.',
          ],
        },
      ],
    },
    {
      id: 'game.unreal.cpp-gameplay',
      title: 'Lập trình gameplay với C++',
      phase: 'build',
      description: 'Kết hợp C++ và Blueprint, Ability System cơ bản, Delegate, Interface và Component pattern.',
      outcome: 'Gameplay logic phức tạp được viết bằng C++, Blueprint gọi lại để designer chỉnh.',
      prerequisiteIds: ['game.unreal.blueprint', 'game.shared.math'],
      resourceIds: ['resource.game.unreal-gameplay-framework', 'resource.game.unreal-docs'],
      defaultResourceId: 'resource.game.unreal-gameplay-framework',
      optional: false,
      work: [
        {
          id: 'game.unreal.cpp-gameplay.w01',
          revision: 1,
          title: 'C++ + Blueprint integration và Delegate',
          minutes: 90,
          acceptance: [
            'C++ Delegate kích hoạt và Blueprint lắng nghe, không compile warning.',
          ],
        },
        {
          id: 'game.unreal.cpp-gameplay.w02',
          revision: 1,
          title: 'Component pattern: Health, Combat, Interaction',
          minutes: 90,
          acceptance: [
            'Ba UActorComponent tách biệt; Actor lắp vào/tháo ra mà không cần sửa Component khác.',
          ],
        },
      ],
    },
    {
      id: 'game.unreal.publish',
      title: 'Tối ưu hiệu năng và đóng gói game',
      phase: 'ship',
      description: 'Unreal Insights, GPU Profiler, LOD, Nanite cơ bản và quy trình Package game.',
      outcome: 'Build game ra file exe/installer, không có obvious bottleneck theo Unreal Insights.',
      prerequisiteIds: ['game.unreal.cpp-gameplay'],
      resourceIds: ["resource.game.unreal-optimization-docs","resource.game.unreal-packaging"],
      defaultResourceId: 'resource.game.unreal-optimization-docs',
      optional: false,
      work: [
        {
          id: 'game.unreal.publish.w01',
          revision: 1,
          title: 'Profiling với Unreal Insights và tối ưu draw call',
          minutes: 90,
          acceptance: [
            'Chỉ ra được 1 bottleneck và cải thiện đo được bằng Profiler.',
          ],
        },
        {
          id: 'game.unreal.publish.w02',
          revision: 1,
          title: 'Package game cho Windows và cấu hình build settings',
          minutes: 60,
          acceptance: [
            'Game build thành công dạng Shipping, chạy được trên máy không cài Unreal.',
          ],
        },
        {
          "id": "game.unreal.portfolio.w01",
          "revision": 1,
          "title": "Tích hợp portfolio: 3D Third-Person Game Prototype (Unreal Engine / C++)",
          "minutes": 120,
          "acceptance": [
            "Character di chuyển, tấn công và có hệ thống HP bằng C++ Component.",
            "Ít nhất một enemy tuần tra đơn giản bằng Component/Blueprint và gây sát thương qua Health Component.",
            "Blueprint HUD hiển thị HP và điểm số cập nhật qua Delegate.",
            "Build Windows Shipping chạy được không cần cài Unreal Engine.",
            "README ghi môi trường, cách chạy/test, nguồn asset và giới hạn; có ảnh hoặc video demo."
          ]
        },
      ],
    },

    // ── Godot ──────────────────────────────────────────────────────────────
    {
      id: 'game.godot.gdscript',
      title: 'GDScript và Godot Editor cơ bản',
      phase: 'foundation',
      description: "Cài Godot 4.x và chọn GUT tương thích phiên bản; GDScript, Node/Scene, @export/@onready. Dùng asset tự tạo hoặc có license rõ.",
      outcome: 'Viết được GDScript script điều khiển Node, hiểu cây Node và Signals.',
      prerequisiteIds: ['game.shared.git'],
      resourceIds: ['resource.game.gdscript-docs', 'resource.game.godot-docs'],
      defaultResourceId: 'resource.game.gdscript-docs',
      optional: false,
      work: [
        {
          id: 'game.godot.gdscript.w01',
          revision: 1,
          title: 'GDScript: biến, hàm, class và @export',
          minutes: 75,
          acceptance: [
            'Script có @export var speed khi thay đổi trong Inspector cập nhật đúng.',
            'Phân biệt được _ready(), _process() và _physics_process().',
          ],
        },
        {
          id: 'game.godot.gdscript.w02',
          revision: 1,
          title: 'Node tree, Scene instancing và Signals',
          minutes: 75,
          acceptance: [
            'Tạo được Scene con, instance vào Scene cha bằng code và Inspector.',
            'Signal tự định nghĩa được phát và lắng nghe từ Node khác.',
          ],
        },
      ],
    },
    {
      id: 'game.godot.core2d',
      title: 'Lập trình game 2D với Godot',
      phase: 'build',
      description: 'Sprite2D, CharacterBody2D, CollisionShape2D, AnimationPlayer và TileMapLayer.',
      outcome: 'Prototype 2D platformer cơ bản chạy được với collision và animation.',
      prerequisiteIds: ['game.godot.gdscript', 'game.shared.math'],
      resourceIds: ['resource.game.godot-your-first-2d', 'resource.game.godot-tilemaps', 'resource.game.godot-docs'],
      defaultResourceId: 'resource.game.godot-your-first-2d',
      optional: false,
      work: [
        {
          id: 'game.godot.core2d.w01',
          revision: 1,
          title: 'CharacterBody2D di chuyển và nhảy',
          minutes: 90,
          acceptance: [
            'Player di chuyển trái phải, nhảy và rơi đúng với gravity.',
            'Collision với floor/wall không bị xuyên.',
          ],
        },
        {
          id: 'game.godot.core2d.w02',
          revision: 2,
          title: 'AnimationPlayer, TileMapLayer và enemy AI đơn giản',
          minutes: 90,
          acceptance: [
            'Idle/Run/Jump animation chuyển đúng.',
            'Enemy đi lại trên Platform tự quay đầu khi chạm tường.',
          ],
        },
      ],
    },
    {
      id: 'game.godot.core3d',
      title: 'Lập trình game 3D với Godot',
      phase: 'build',
      description: 'CharacterBody3D, MeshInstance3D, CollisionShape3D, Camera3D và Environment.',
      outcome: 'Prototype 3D game cơ bản có nhân vật di chuyển trong không gian 3D.',
      prerequisiteIds: ['game.godot.core2d'],
      resourceIds: ['resource.game.godot-your-first-3d', 'resource.game.godot-docs'],
      defaultResourceId: 'resource.game.godot-your-first-3d',
      optional: true,
      work: [
        {
          id: 'game.godot.core3d.w01',
          revision: 1,
          title: 'CharacterBody3D và camera 3rd-person',
          minutes: 90,
          acceptance: [
            'Nhân vật di chuyển theo hướng camera, nhảy và đứng đúng trên mặt phẳng.',
          ],
        },
      ],
    },
    {
      id: 'game.godot.ui-signals',
      title: 'UI và kiến trúc bằng Signals',
      phase: 'build',
      description: 'Control Node, CanvasLayer cho HUD, Autoload singleton và Signal để tách coupling.',
      outcome: 'HUD cập nhật đúng không phụ thuộc trực tiếp vào player script.',
      prerequisiteIds: ['game.godot.core2d'],
      resourceIds: ['resource.game.godot-ui-docs', 'resource.game.godot-signals-docs'],
      defaultResourceId: 'resource.game.godot-ui-docs',
      optional: false,
      work: [
        {
          id: 'game.godot.ui-signals.w01',
          revision: 1,
          title: 'CanvasLayer HUD, Autoload EventBus và Signals',
          minutes: 90,
          acceptance: [
            'HUD lắng nghe Signal từ EventBus Autoload; player không tham chiếu trực tiếp HUD.',
            'Màn hình game over hiện khi HP = 0.',
          ],
        },
      ],
    },
    {
      id: 'game.godot.publish',
      title: 'Kiểm thử với GUT và xuất game',
      phase: 'ship',
      description: 'GUT (Godot Unit Testing), xuất HTML5/Android và itch.io distribution.',
      outcome: 'Game có test GUT cơ bản, build HTML5 chạy được trong trình duyệt.',
      prerequisiteIds: ['game.godot.ui-signals'],
      resourceIds: ['resource.game.godot-unit-test', 'resource.game.godot-export-docs'],
      defaultResourceId: 'resource.game.godot-unit-test',
      optional: false,
      work: [
        {
          id: 'game.godot.publish.w01',
          revision: 1,
          title: 'GUT unit test cho logic điểm và HP',
          minutes: 75,
          acceptance: [
            'Ít nhất 3 GUT test kiểm tra logic điểm số và điều kiện thua.',
          ],
        },
        {
          id: 'game.godot.publish.w02',
          revision: 1,
          title: 'Export HTML5 và publish lên itch.io',
          minutes: 60,
          acceptance: [
            'Game HTML5 chạy được trong trình duyệt Chrome/Firefox.',
            'Upload được lên itch.io (public hoặc private link) có mô tả tối thiểu.',
          ],
        },
        {
          "id": "game.godot.portfolio.w01",
          "revision": 1,
          "title": "Tích hợp portfolio: 2D Action Game (Godot / GDScript)",
          "minutes": 120,
          "acceptance": [
            "Game 2D có nhân vật, enemy, thu thập item và điều kiện thắng/thua.",
            "Kiến trúc dùng Signal và Autoload EventBus, không coupling trực tiếp giữa các script.",
            "Có ≥3 GUT test cho logic game.",
            "Build HTML5 chạy được trong trình duyệt và được upload lên itch.io.",
            "README ghi môi trường, cách chạy/test, nguồn asset và giới hạn; có ảnh hoặc video demo."
          ]
        },
      ],
    },
  ],

  // ─── Credentials ─────────────────────────────────────────────────────────
  credentials: [
    {
      id: 'credential.game.unity-associate',
      name: 'Unity Certified Associate: Game Developer',
      provider: 'Unity Technologies',
      kind: 'exam_certificate',
      url: "https://unity.com/products/unity-certifications/associate-game-developer",
      cost: 'paid',
      prerequisites: "Đã làm game bằng C#, có dự án để phát hành và hiểu quy trình sản xuất game; mục tiêu bổ trợ sau portfolio.",
      requirements: "Đăng ký kỳ thi qua đối tác Unity/Pearson VUE và đáp ứng điều kiện hiện hành. Có phí; xem giá tại thời điểm đăng ký. Không coi hoàn thành roadmap là đạt chứng chỉ.",
      checkedAt: '2026-10-07',
    },

    // Unreal/Godot: chưa chọn chương trình thi phù hợp sau khảo sát; portfolio là đầu ra. Xem CONTENT_REVIEW.md.
  ],

  // ─── Tracks ───────────────────────────────────────────────────────────────
  tracks: [
    {
      id: 'game.unity',
      pathId: 'game',
      label: 'Unity / C#',
      stageIds: [
        'game.shared.git',
        'game.shared.math',
        'game.unity.csharp',
        'game.unity.setup',
        'game.unity.core2d',
        'game.unity.ui',
        'game.unity.patterns',
        'game.unity.publish',
      ],
      credentialIds: ['credential.game.unity-associate'],
      roadmapLinks: [
        { label: 'Game Developer Roadmap', url: 'https://roadmap.sh/game-developer' },
        { label: 'Unity Learn', url: 'https://learn.unity.com' },
      ],
      portfolio: {
        title: '2D Platformer Game (Unity / C#)',
        acceptance: [
          'Game 2D hoàn chỉnh có ít nhất 2 màn chơi, enemy AI và hệ thống điểm số.',
          'UI có màn hình chính, game over và điểm cao (local).',
          'Có ≥3 Edit Mode test cho logic game.',
          'Build WebGL hoặc APK chạy được, có hướng dẫn cài đặt/chơi.',
        ],
      },
    },
    {
      id: 'game.unreal',
      pathId: 'game',
      label: 'Unreal Engine / C++ và Blueprint',
      stageIds: [
        'game.shared.git',
        'game.shared.math',
        'game.unreal.cpp',
        'game.unreal.blueprint',
        'game.unreal.cpp-gameplay',
        'game.unreal.publish',
      ],
      credentialIds: [],
      roadmapLinks: [
        { label: 'Game Developer Roadmap', url: 'https://roadmap.sh/game-developer' },
        { label: 'Unreal C++ Documentation', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine' },
      ],
      portfolio: {
        title: '3D Third-Person Game Prototype (Unreal Engine / C++)',
        acceptance: [
          'Character di chuyển, tấn công và có hệ thống HP bằng C++ Component.',
          'Ít nhất một enemy tuần tra đơn giản bằng Component/Blueprint và gây sát thương qua Health Component.',
          'Blueprint HUD hiển thị HP và điểm số cập nhật qua Delegate.',
          'Build Windows Shipping chạy được không cần cài Unreal Engine.',
        ],
      },
    },
    {
      id: 'game.godot',
      pathId: 'game',
      label: 'Godot / GDScript',
      stageIds: ["game.shared.git","game.shared.math","game.godot.gdscript","game.godot.core2d","game.godot.core3d","game.godot.ui-signals","game.godot.publish"],
      credentialIds: [],
      roadmapLinks: [
        { label: 'Game Developer Roadmap', url: 'https://roadmap.sh/game-developer' },
        { label: 'Godot Documentation', url: 'https://docs.godotengine.org' },
      ],
      portfolio: {
        title: '2D Action Game (Godot / GDScript)',
        acceptance: [
          'Game 2D có nhân vật, enemy, thu thập item và điều kiện thắng/thua.',
          'Kiến trúc dùng Signal và Autoload EventBus, không coupling trực tiếp giữa các script.',
          'Có ≥3 GUT test cho logic game.',
          'Build HTML5 chạy được trong trình duyệt và được upload lên itch.io.',
        ],
      },
    },
  ],
};
