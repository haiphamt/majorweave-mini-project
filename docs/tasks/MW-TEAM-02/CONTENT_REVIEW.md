# Rà soát Mobile / Game — 07/10/2026

Người phụ trách: Phạm Công Định. Codex hỗ trợ mở nguồn, đối chiếu bài và sửa dữ liệu theo yêu cầu của Định. Hai pack chuyển từ `draft` sang **`review`**; chỉ Hải nghiệm thu mới chuyển `ready`.

## Phương pháp và giới hạn

- Mở từng URL được giữ lại bằng web reader. Các trang Apple/Swift cần JavaScript được mở và đọc trong trình duyệt thật; không coi trang “requires JavaScript” là đã xác minh nội dung.
- Đối chiếu chủ đề/provider, truy cập công khai, loại tài liệu, điều kiện lab và những tuyên bố phí/chứng nhận. `checkedAt` là ngày kiểm tra trang, không chứng minh đã học hết khóa hoặc chạy native SDK.
- Ngày kiểm tra: **2026-10-07**. Giá/hạn mức không được đóng đinh bằng con số chưa xác minh. Tài liệu miễn phí không đồng nghĩa hosting, cloud build hoặc store miễn phí.
- Đã chạy planner cho toàn bộ 7 track, mọi nguồn được chọn, quỹ 2/20 giờ; đây là test domain. Chưa chạy các dự án học Android/iOS/Flutter/Unity/Unreal/Godot, và chưa có UI v2 để nghiệm thu 7 track trên app chính.
- Mỗi track có bài tích hợp portfolio 120 phút sau các bài xây dựng thành phần; đây là phần hoàn thiện dự án đã làm dần, không phải 120 phút để học cả nghề.

## Các sửa đổi có bằng chứng

| Phát hiện | Xử lý |
|---|---|
| [Associate Android Developer](https://developers.google.com/certification/associate-android-developer) ngừng nhận đăng ký | Bỏ mục tiêu thi mới và phí cũ. Portfolio Android vẫn đầy đủ. |
| [Codelab android-testing](https://developer.android.com/codelabs/android-testing) đã deprecated | Dùng [ViewModel testing](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-viewmodel) và thêm [Compose testing](https://developer.android.com/develop/ui/compose/testing). |
| [SwiftUI tutorial cũ](https://developer.apple.com/tutorials/swiftui) có thông báo lỗi thời | Thay bằng [Develop in Swift](https://developer.apple.com/tutorials/develop-in-swift), đã đọc bằng trình duyệt. |
| Bài dùng `@Observable` nhưng nguồn là Combine | Bổ sung [Observation](https://developer.apple.com/documentation/observation), giữ nguồn SwiftData; ghi điều kiện iOS 17+. |
| Retrofit URL Square trả 404 | Theo redirect từ [repo gốc](https://github.com/square/retrofit) tới [trang maintainer](https://lysine.dev/retrofit/); sửa provider. |
| Zustand URL cũ không đọc được | Dùng [README/examples chính thức](https://github.com/pmndrs/zustand). |
| Riverpod dùng API legacy | Chuyển bài sang NotifierProvider; [Riverpod 3](https://riverpod.dev/docs/whats_new) đánh dấu StateNotifierProvider là legacy. Tăng revision bài. |
| RN yêu cầu React Query/persistence nhưng thiếu nguồn | Thêm TanStack Query React Native, AsyncStorage và TypeScript; bỏ Redux như một lựa chọn thay thế cho bài bắt buộc Zustand. |
| Unity HUD dùng Canvas/TextMeshPro nhưng nguồn là UI Toolkit | Thay bằng uGUI; thêm hướng dẫn 2D trực tiếp. C# nền tảng không còn yêu cầu chạy MonoBehaviour trước khi cài Editor. |
| Unreal có placeholder Instructor/MegaGrants | Bỏ credential giả. Dùng nguồn C++/Blueprint/packaging cụ thể thay trang tổng hợp; portfolio enemy dùng component đã học. |
| Godot 3D có chặng nhưng không thuộc track | Đưa vào track như lựa chọn mở rộng; toán nền tảng bắt buộc vì các chặng sau cần nó. Bổ sung nguồn TileMapLayer. |
| Yêu cầu IPA/TestFlight/Play/EAS khiến lab phụ thuộc tiền/quyền | Có phương án simulator/local build. Không yêu cầu IPA từ tài khoản Apple miễn phí; store/TestFlight là lựa chọn khi đủ điều kiện. [Apple account](https://developer.apple.com/help/account/basics/about-your-developer-account), [Expo pricing](https://expo.dev/pricing). |
| Các giá Udemy/EAS, royalty Unreal và “LFS public miễn phí” quá rộng | Bỏ con số/khẳng định không cần thiết; ghi điều kiện dịch vụ, link nhà cung cấp, phân biệt tài liệu với sử dụng dịch vụ. |

## Quyết định chứng nhận

- **Android:** AAD đã retired; không đề xuất chương trình này cho người đăng ký mới.
- **iOS:** khảo sát Develop in Swift, tài liệu nền tảng và điều kiện Developer Program; không coi membership/phân phối app là chứng nhận kỹ năng. Chưa chọn kỳ thi phù hợp cho phạm vi mini.
- **Flutter / React Native:** khảo sát tài liệu Flutter/Dart, Riverpod, React Native/Expo; các nguồn là tài liệu/lab, không được tự gán là chứng chỉ. Chọn portfolio làm đầu ra, không khẳng định không tồn tại mọi chứng nhận bên thứ ba.
- **Unity:** giữ [Certified Associate: Game Developer](https://unity.com/products/unity-certifications/associate-game-developer) là mục tiêu bổ trợ sau portfolio, có phí và yêu cầu nền tảng. Bỏ mô tả “thi thực hành” chưa được trang cụ thể xác nhận.
- **Unreal / Godot:** các nguồn học đã khảo sát không cung cấp một kỳ thi phù hợp để gắn cho track này. Không biến instructor/grant thành chứng chỉ người học; dùng portfolio. Có thể bổ sung chương trình phù hợp sau một lần rà riêng.

## Hợp đồng nội dung và tương thích

- Track/work ID đang tồn tại được giữ. Bài đổi yêu cầu tăng revision; bài portfolio mới có ID riêng. `contentVersion=2026-10-07.review`.
- Bỏ những resource không khớp bài (Combine, Bloc, Redux, UI Toolkit) và hai credential không thích hợp. Pack chưa đăng ký trên app chính nên không tự migrate workspace. Nếu đã có dữ liệu thử tham chiếu ID bị bỏ: giữ snapshot plan/history, yêu cầu chọn nguồn mới trước tạo lại; không xóa tiến độ.
- Git Mobile và Git/LFS Game có bài khác nhau, giữ ID riêng. Không copy thêm Git của Backend hoặc sửa shared registry.
- Sổ bên dưới ghi URL cuối cùng đã mở và điều kiện truy cập. Bản web reader lỗi/redirect được thay bằng URL đã kiểm tra; không gán ngày cho một link chỉ xuất hiện trong kết quả tìm kiếm.

## Sổ nguồn đã mở

| ID | Nguồn đã mở | Ngày / cách đọc | Điều kiện đã ghi |
|---|---|---|---|
| `resource.mobile.typescript-basics` | [TypeScript — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.mobile.compose-testing` | [Test your Compose layout](https://developer.android.com/develop/ui/compose/testing) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.mobile.async-storage` | [AsyncStorage — persistent React Native storage](https://github.com/react-native-async-storage/async-storage) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.mobile.react-query-native` | [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.mobile.observation-docs` | [Observation — @Observable](https://developer.apple.com/documentation/observation) | 2026-10-07 · Browser + JavaScript | free · Tài liệu miễn phí; dùng Xcode tương thích và iOS 17+ cho bài @Observable/SwiftData. |
| `resource.mobile.git-docs` | [Git Documentation](https://git-scm.com/docs) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.kotlinlang-docs` | [Kotlin basic syntax](https://kotlinlang.org/docs/basic-syntax.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.kotlin-koans` | [Kotlin Koans](https://kotlinlang.org/docs/koans.html) | 2026-10-07 · Web reader | free · Bài tập miễn phí trên web/IDE; phù hợp người đã biết Java hoặc đã học cú pháp Kotlin cơ bản. |
| `resource.mobile.android-fundamentals` | [Android Basics with Compose (Google Codelab)](https://developer.android.com/courses/android-basics-compose/course) | 2026-10-07 · Web reader | free · Miễn phí; cần Android Studio. |
| `resource.mobile.android-developers` | [Android Developer Guides](https://developer.android.com/get-started/overview) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.compose-pathway` | [Jetpack Compose Pathway](https://developer.android.com/courses/jetpack-compose/course) | 2026-10-07 · Web reader | free · Miễn phí; cần Android Studio Hedgehog trở lên. |
| `resource.mobile.compose-docs` | [Jetpack Compose Documentation](https://developer.android.com/develop/ui/compose/documentation) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.android-architecture` | [Guide to App Architecture](https://developer.android.com/topic/architecture) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.room-docs` | [Room Persistence Library](https://developer.android.com/training/data-storage/room) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.retrofit-docs` | [Retrofit Documentation](https://lysine.dev/retrofit/) | 2026-10-07 · Web reader | free · Tài liệu và thư viện mã nguồn mở miễn phí; lab cần Android SDK và kết nối mạng hoặc API giả lập. |
| `resource.mobile.kotlin-coroutines-docs` | [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.android-testing` | [Write unit tests for ViewModel](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-viewmodel) | 2026-10-07 · Web reader | free · Codelab miễn phí; cần Android Studio, Kotlin, Compose và ViewModel. Codelab android-testing cũ đã deprecated. |
| `resource.mobile.play-console-docs` | [Create and set up your app — Google Play](https://support.google.com/googleplay/android-developer/answer/9859152) | 2026-10-07 · Web reader | free · Đọc miễn phí. Đưa ứng dụng lên Play cần tài khoản nhà phát triển, phí và điều kiện kiểm thử/xác minh hiện hành; bài có phương án build local. |
| `resource.mobile.swift-docs` | [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) | 2026-10-07 · Browser + JavaScript | free · Miễn phí. Cần macOS để dùng Xcode đầy đủ. |
| `resource.mobile.swift-tour` | [A Swift Tour](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/) | 2026-10-07 · Browser + JavaScript | free · Miễn phí, chạy trong Swift Playgrounds hoặc Xcode. |
| `resource.mobile.swiftui-tutorials` | [Develop in Swift](https://developer.apple.com/tutorials/develop-in-swift) | 2026-10-07 · Browser + JavaScript | free · Tutorial miễn phí; cần máy Mac chạy Xcode tương thích. Thay tutorial SwiftUI cũ mà Apple đánh dấu không còn theo thực hành hiện tại. |
| `resource.mobile.swiftui-docs` | [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui) | 2026-10-07 · Browser + JavaScript | free · Miễn phí, đọc trên web. |
| `resource.mobile.swiftdata-docs` | [SwiftData Documentation](https://developer.apple.com/documentation/swiftdata) | 2026-10-07 · Browser + JavaScript | free · Miễn phí. Yêu cầu iOS 17+ / macOS 14+. |
| `resource.mobile.urlsession-docs` | [URLSession Documentation](https://developer.apple.com/documentation/foundation/urlsession) | 2026-10-07 · Browser + JavaScript | free · Miễn phí, đọc trên web. |
| `resource.mobile.swift-concurrency-docs` | [Swift Concurrency (async/await)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) | 2026-10-07 · Browser + JavaScript | free · Miễn phí, đọc trên web. |
| `resource.mobile.xctest-docs` | [XCTest Documentation](https://developer.apple.com/documentation/xctest) | 2026-10-07 · Browser + JavaScript | free · Miễn phí. Cần Xcode. |
| `resource.mobile.appstore-connect-docs` | [Upload builds — App Store Connect](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/) | 2026-10-07 · Web reader | unknown · Tài liệu miễn phí; TestFlight/App Store cần quyền App Store Connect và Apple Developer Program. Không yêu cầu mua membership để hoàn thành lab simulator. |
| `resource.mobile.flutter-docs` | [Install Flutter](https://docs.flutter.dev/install) | 2026-10-07 · Web reader | free · SDK/tài liệu miễn phí. Android: SDK và emulator hoặc thiết bị; iOS: máy Mac và Xcode tương thích. |
| `resource.mobile.dart-tour` | [Dart Language Tour](https://dart.dev/language) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.flutter-widget-catalog` | [Flutter Widget Catalog](https://docs.flutter.dev/ui/widgets) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.flutter-codelabs` | [Flutter learning pathway](https://docs.flutter.dev/learn/pathway) | 2026-10-07 · Web reader | free · Miễn phí, làm codelab trên web. |
| `resource.mobile.riverpod-docs` | [Riverpod Documentation](https://riverpod.dev/docs/introduction/getting_started) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.dio-docs` | [Dio Package (pub.dev)](https://pub.dev/packages/dio) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên pub.dev. |
| `resource.mobile.hive-docs` | [Hive NoSQL Database (pub.dev)](https://pub.dev/packages/hive) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên pub.dev. |
| `resource.mobile.flutter-testing-docs` | [Flutter Testing Overview](https://docs.flutter.dev/testing/overview) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.github-actions-flutter` | [Flutter CI/CD with GitHub Actions](https://docs.flutter.dev/deployment/cd) | 2026-10-07 · Web reader | free · Miễn phí. GitHub Actions free tier giới hạn số phút/tháng. |
| `resource.mobile.rn-docs` | [React Native Documentation](https://reactnative.dev/docs/getting-started) | 2026-10-07 · Web reader | free · Miễn phí. Cần Android Studio hoặc Xcode tùy nền tảng. |
| `resource.mobile.expo-docs` | [Create an Expo project](https://docs.expo.dev/get-started/create-a-project/) | 2026-10-07 · Web reader | free · Tài liệu và khởi tạo project miễn phí; cần Node.js và thiết bị/emulator. Native iOS local cần macOS/Xcode. |
| `resource.mobile.rn-core-components` | [React Native Core Components and APIs](https://reactnative.dev/docs/components-and-apis) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.react-navigation-docs` | [React Navigation Documentation](https://reactnavigation.org/docs/getting-started) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.zustand-docs` | [Zustand — official README and examples](https://github.com/pmndrs/zustand) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.rn-testing-docs` | [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.mobile.eas-build-docs` | [EAS Build Documentation](https://docs.expo.dev/build/introduction/) | 2026-10-07 · Web reader | mixed · Tài liệu miễn phí. EAS Build cần tài khoản Expo; có hạn mức miễn phí và gói trả phí, xem trang giá hiện hành. Có thể build Android local nếu hết hạn mức. |

| `resource.game.godot-tilemaps` | [Using TileMaps / TileMapLayer](https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.game.unity-2d` | [2D game development in Unity](https://docs.unity3d.com/Manual/Unity2D.html) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.game.vector-math` | [Vector math — Godot documentation](https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html) | 2026-10-07 · Web reader | free · Tài liệu miễn phí. Học khái niệm vector/dot/cross chung; viết bài trong ngôn ngữ/engine đang chọn, không bắt track Unity/Unreal dùng GDScript. |
| `resource.game.unreal-packaging` | [Packaging Your Project](https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.game.unity-ugui` | [Unity UI (uGUI) — Canvas and controls](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html) | 2026-10-07 · Web reader | free · Tài liệu miễn phí, đọc trên web. |
| `resource.game.git-docs` | [Git Documentation](https://git-scm.com/docs) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.git-lfs` | [Git LFS (Large File Storage)](https://git-lfs.com/) | 2026-10-07 · Web reader | free · Git LFS là mã nguồn mở miễn phí; storage/bandwidth của dịch vụ hosting có hạn mức và có thể tính phí, kể cả repo public. |
| `resource.game.csharp-docs` | [C# Documentation (Microsoft)](https://learn.microsoft.com/en-us/dotnet/csharp/) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-learn` | [Unity Essentials](https://learn.unity.com/pathway/unity-essentials) | 2026-10-07 · Web reader | free · Pathway học miễn phí; tài khoản Unity dùng để lưu tiến độ. Kiểm tra điều kiện license của Editor trước khi dùng; lab không yêu cầu asset trả phí. |
| `resource.game.unity-manual` | [Unity Manual](https://docs.unity3d.com/Manual/index.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-scripting-api` | [Unity Scripting API Reference](https://docs.unity3d.com/ScriptReference/index.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-physics-docs` | [Unity Physics Documentation](https://docs.unity3d.com/Manual/PhysicsSection.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-test-framework` | [Unity Test Framework Documentation](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/index.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-addressables` | [Unity Addressables Documentation](https://docs.unity3d.com/Packages/com.unity.addressables@2.0/manual/index.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unity-game-dev-course` | [Complete C# Unity Game Developer 3D (Udemy)](https://www.udemy.com/course/unitycourse2/) | 2026-10-07 · Web reader | paid · Khóa GameDev.tv trên Udemy trả phí; giá theo khu vực/tài khoản/khuyến mại. Không bắt buộc mua khóa cho các bài miễn phí trong track. |
| `resource.game.cpp-tour` | [LearnCpp — C++ tutorials](https://www.learncpp.com) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unreal-docs` | [Programming with C++ in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine) | 2026-10-07 · Web reader | free · Tài liệu miễn phí. Lab cần Unreal Editor, compiler C++ và SDK phù hợp hệ điều hành; xem điều kiện license của Epic nếu phát hành thương mại. |
| `resource.game.unreal-blueprint-docs` | [Unreal Engine Blueprint Visual Scripting](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unreal-gameplay-framework` | [Gameplay Framework in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.unreal-optimization-docs` | [Testing and Optimizing Your Content](https://dev.epicgames.com/documentation/en-us/unreal-engine/testing-and-optimizing-your-content) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.godot-docs` | [Godot Documentation](https://docs.godotengine.org/en/stable/) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. Godot Engine là phần mềm mã nguồn mở MIT. |
| `resource.game.gdscript-docs` | [GDScript Reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.godot-your-first-2d` | [Your First 2D Game (Godot Tutorial)](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html) | 2026-10-07 · Web reader | free · Miễn phí, hướng dẫn chính thức theo bước. |
| `resource.game.godot-your-first-3d` | [Your First 3D Game (Godot Tutorial)](https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html) | 2026-10-07 · Web reader | free · Miễn phí, hướng dẫn chính thức theo bước. |
| `resource.game.godot-ui-docs` | [Godot UI and Control Nodes](https://docs.godotengine.org/en/stable/tutorials/ui/index.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.godot-signals-docs` | [Godot Signals and Groups](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html) | 2026-10-07 · Web reader | free · Miễn phí, đọc trên web. |
| `resource.game.godot-export-docs` | [Godot Export Documentation](https://docs.godotengine.org/en/stable/tutorials/export/index.html) | 2026-10-07 · Web reader | free · Miễn phí. Xuất HTML5 miễn phí; store cần tài khoản Google Play / Apple Developer. |
| `resource.game.godot-unit-test` | [GUT (Godot Unit Testing) Documentation](https://gut.readthedocs.io/en/latest/) | 2026-10-07 · Web reader | free · Miễn phí, cài qua Godot Asset Library. |
| `credential.game.unity-associate` | [Unity Certified Associate: Game Developer](https://unity.com/products/unity-certifications/associate-game-developer) | 2026-10-07 · Web reader | paid · Đăng ký kỳ thi qua đối tác Unity/Pearson VUE và đáp ứng điều kiện hiện hành. Có phí; xem giá tại thời điểm đăng ký. Không coi hoàn thành roadmap là đạt chứng chỉ. |


## Bao phủ nội dung

| Track | Chặng (gồm mở rộng) | Bài | Phút bài được chọn |
|---|---:|---:|---:|
| `mobile.android` | 7 | 12 | 1020 |
| `mobile.ios` | 6 | 9 | 765 |
| `mobile.flutter` | 6 | 9 | 765 |
| `mobile.react-native` | 6 | 8 | 675 |
| `game.unity` | 8 | 13 | 1110 |
| `game.unreal` | 6 | 11 | 960 |
| `game.godot` | 7 | 11 | 915 |

Các phút trên là bài thực hành chọn lọc và tích hợp portfolio; không phải thời lượng hoàn thành tất cả tài liệu hoặc khóa học.
