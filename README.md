# Flow Time App

Đây là một ứng dụng giúp bạn tập trung làm việc theo chu kỳ, tương tự như phương pháp Pomodoro. Bạn có thể tạo ra các chu kỳ làm việc (Cycles) bao gồm nhiều phiên (Phases) với thời gian và âm thanh tùy chỉnh.

## Cấu trúc thư mục

Dự án được xây dựng trên nền tảng Next.js và có cấu trúc như sau:

```
.
├── .next/          # Thư mục build của Next.js (được .gitignore bỏ qua)
├── .idx/           # Thư mục cấu hình của Project IDX (được .gitignore bỏ qua)
├── node_modules/   # Thư mục chứa các thư viện (được .gitignore bỏ qua)
├── public/
│   └── sounds/     # Chứa các file âm thanh tĩnh
├── src/
│   ├── app/        # Thư mục chính cho các trang và layout của Next.js 13+
│   │   ├── history/  # Trang xem lịch sử luyện tập
│   │   ├── layout.tsx # Layout chung của ứng dụng
│   │   └── page.tsx   # Trang chủ của ứng dụng
│   ├── components/
│   │   ├── app/      # Các component dành riêng cho ứng dụng (vd: Timer, CycleList)
│   │   └── ui/       # Các component UI chung (Button, Card, Dialog, v.v.)
│   ├── contexts/     # Chứa các React Context để quản lý state
│   ├── dal/          # Data Access Layer: Các module để tương tác với Firestore
│   ├── hooks/        # Chứa các custom React Hooks
│   ├── lib/          # Các hàm tiện ích, định nghĩa types, và cấu hình Firebase
│   └── ai/           # Các tệp liên quan đến tính năng AI với Genkit
├── .gitignore      # Các file và thư mục được Git bỏ qua
├── firebase.json   # Cấu hình cho Firebase CLI
├── firestore.rules # Quy tắc bảo mật cho Cloud Firestore
├── next.config.ts  # File cấu hình của Next.js
├── package.json    # Thông tin dự án và các dependencies
└── tsconfig.json   # Cấu hình cho TypeScript
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

## Các file quan trọng

*   `src/app/page.tsx`: Component chính render giao diện người dùng của ứng dụng.
*   `src/lib/types.ts`: Định nghĩa các kiểu dữ liệu cốt lõi (`Phase`, `Cycle`, `UserProfile`, v.v.).
*   `src/contexts/*.tsx`: Quản lý trạng thái toàn cục của ứng dụng, ví dụ như thông tin xác thực người dùng (`auth-context`), chu kỳ hiện tại (`cycle-context`), và bộ đếm thời gian (`timer-context`).
*   `src/lib/firebase.ts`: Cấu hình và khởi tạo kết nối đến Firebase.
*   `src/components/app/flow-time-app.tsx`: Component chính bao bọc toàn bộ logic và giao diện của ứng dụng hẹn giờ.

## package.json

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3000",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@genkit-ai/googleai": "^1.14.1",
    "@genkit-ai/next": "^1.14.1",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.10.0",
    "framer-motion": "^11.5.7",
    "genkit": "^1.14.1",
    "howler": "^2.2.4",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^13.0.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/howler": "^2.2.11",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^10.0.0",
    "genkit-cli": "^1.14.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```
