# Flow Time App

Đây là một ứng dụng giúp bạn tập trung làm việc theo chu kỳ, tương tự như phương pháp Pomodoro. Bạn có thể tạo ra các chu kỳ làm việc (Cycles) bao gồm nhiều phiên (Phases) với thời gian và âm thanh tùy chỉnh.

## Cấu trúc thư mục

```
.
├── README.md
├── components.json
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .idx
│   ├── dev.nix
│   ├── icon.png
│   └── mcp.json
├── docs
│   └── blueprint.md
├── public
│   └── sounds
│       ├── instant-win.wav
│       └── winning-notification.wav
└── src
    ├── ai
    │   ├── dev.ts
    │   ├── genkit.ts
    │   └── flows
    │       └── smart-session-recommendation.ts
    ├── app
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── firestore-test
    │       └── page.tsx
    ├── components
    │   ├── app
    │   │   ├── cycle-list.tsx
    │   │   ├── cycle-progress-bar.tsx
    │   │   ├── email-auth-dialog.tsx
    │   │   ├── flow-time-app.tsx
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   ├── homepage.tsx
    │   │   ├── settings-sheet.tsx
    │   │   ├── sortable-phase-card.tsx
    │   │   ├── task-manager.tsx
    │   │   ├── theme-toggle.tsx
    │   │   └── timer-display.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ... (các components UI khác)
    ├── contexts
    │   ├── auth-context.tsx
    │   ├── cycle-context.tsx
    │   ├── settings-context.tsx
    │   └── timer-context.tsx
    ├── hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    └── lib
        ├── firebase.ts
        ├── mock-data.ts
        ├── placeholder-images.json
        ├── placeholder-images.ts
        ├── types.ts
        └── utils.ts
```

## Các tính năng cốt lõi

Ứng dụng được xây dựng dựa trên các khái niệm chính sau:

*   **`Phase` (Phiên):** Đây là một khoảng thời gian tập trung hoặc nghỉ ngơi. Mỗi `Phase` có:
    *   `id`: Mã định danh duy nhất.
    *   `title`: Tên của phiên (ví dụ: "Làm việc sâu", "Nghỉ ngắn").
    *   `duration`: Thời lượng của phiên (tính bằng phút).
    *   `soundFile`: Âm thanh được phát khi kết thúc phiên.

*   **`Cycle` (Chu kỳ):** Đây là một chuỗi các `Phase` được sắp xếp theo một thứ tự nhất định. Một `Cycle` đại diện cho một quy trình làm việc hoàn chỉnh.
    *   `id`: Mã định danh duy nhất.
    *   `name`: Tên của chu kỳ (ví dụ: "Chu kỳ Pomodoro buổi sáng").
    *   `phases`: Một mảng các `Phase` tạo nên chu kỳ.
    *   `isPublic`: Cho biết chu kỳ này là công khai hay riêng tư.
    *   `authorId`, `authorName`: Thông tin về người tạo chu kỳ.

*   **`TrainingHistory` (Lịch sử luyện tập):** Ghi lại lịch sử hoàn thành các `Cycle` của người dùng, giúp theo dõi hiệu suất và sự tiến bộ.
    *   `cycleId`: ID của chu kỳ đã thực hiện.
    *   `startTime`, `endTime`: Thời gian bắt đầu và kết thúc.
    *   `status`: Trạng thái hoàn thành ("completed" hoặc "interrupted").

*   **`UserProfile` (Hồ sơ người dùng):** Lưu trữ thông tin của người dùng, bao gồm:
    *   `privateCycles`: Các chu kỳ riêng tư do người dùng tạo.
    *   `trainingHistory`: Lịch sử luyện tập của người dùng.
    *   `audioLibrary`: Thư viện âm thanh cá nhân.

Các file quan trọng:

*   `src/app/page.tsx`: Component chính render giao diện người dùng của ứng dụng.
*   `src/lib/types.ts`: Định nghĩa các kiểu dữ liệu cốt lõi (`Phase`, `Cycle`, `UserProfile`, v.v.).
*   `src/contexts/*.tsx`: Quản lý trạng thái toàn cục của ứng dụng, ví dụ như thông tin xác thực người dùng (`auth-context`), chu kỳ hiện tại (`cycle-context`), và bộ đếm thời gian (`timer-context`).
*   `src/lib/firebase.ts`: Cấu hình và khởi tạo kết nối đến Firebase.
*   `src/components/app/flow-time-app.tsx`: Component chính bao bọc toàn bộ logic và giao diện của ứng dụng hẹn giờ.
