# PRD — TimeCycle Web App

**Version:** 1.0  
**Stack:** Next.js 15 (App Router) · TypeScript · Zustand · XState v5 · Firebase Auth + Firestore · Shadcn UI · Tailwind CSS  
**Status:** In Development

---

## 1. Product Overview

TimeCycle là webapp giúp người dùng tạo và chạy các chu kỳ tập trung tùy chỉnh (work / break / breathing / meditation) với timer được điều khiển bởi state machine.

---

## 2. Core Features

### Timer
- State machine: `idle → running ⇄ paused → finished` (XState v5)
- Hiển thị thời gian còn lại + tên phase đang chạy
- Background color đổi theo loại phase (focus / rest)
- Nút: Start / Pause / Resume / Skip phase / Stop

### Cycle Builder
- Tạo cycle với nhiều phase tùy chỉnh (tên + thời gian)
- CRUD đầy đủ: tạo / sửa / xóa / nhân bản cycle
- 3 template có sẵn: Classic Pomodoro, Wim Hof Breathing, Meditation

### Auth & Sync
- Guest mode: state in-memory, không lưu
- Đăng nhập bằng email → sync cycles lên Firestore
- Tự động sync khi đăng nhập, merge nếu đã có guest data

### Settings
- Light / Dark theme
- (Mở rộng Phase 2)

---

## 3. Ngoài Phạm Vi (KHÔNG làm trong v1)

- ❌ Session history / thống kê
- ❌ Push notification / âm thanh
- ❌ Chia sẻ cycle với người khác
- ❌ Social login (Google, GitHub)
- ❌ Subscription / thanh toán
- ❌ Mobile app native
- ❌ Analytics dashboard
- ❌ Import / export cycle

---

## 4. User Stories

| # | Story |
|---|-------|
| 1 | Là khách, tôi muốn dùng app không cần đăng ký, để thử ngay |
| 2 | Là khách, tôi muốn tạo cycle mới, để chạy ngay phiên làm việc |
| 3 | Là user, tôi muốn đăng ký bằng email, để lưu cycle của mình |
| 4 | Là user, tôi muốn chọn template có sẵn, để bắt đầu nhanh |
| 5 | Là user, tôi muốn chỉnh sửa cycle đã tạo, để thay đổi thời gian |
| 6 | Là user, tôi muốn xóa cycle không dùng, để giữ danh sách gọn |
| 7 | Là user, tôi muốn Pause/Resume timer, để linh hoạt khi bị gián đoạn |
| 8 | Là user, tôi muốn Skip phase, để chuyển nhanh khi cần |

---

## 5. Error Handling

| Tình huống | Xử lý |
|---|---|
| Mất mạng khi đang chạy timer | Timer tiếp tục (client-side), hiện banner "Offline" |
| Mất mạng khi sync Firestore | Retry tự động khi có mạng lại, không block UI |
| Firebase Auth lỗi | Hiện toast lỗi, giữ nguyên guest state |
| Cycle không có phase | Disable nút Start, hiện tooltip "Thêm ít nhất 1 phase" |
| Timer đang chạy mà user xóa cycle | Dừng timer, về màn hình chọn cycle |

---

## 6. Data Schema (Firestore)

```
users/{userId}
  - email: string
  - createdAt: timestamp

users/{userId}/cycles/{cycleId}
  - id: string
  - name: string
  - phases: [{ id, name, duration: number (giây), type: 'focus'|'rest'|'breathing' }]
  - createdAt: timestamp
  - updatedAt: timestamp
  - isTemplate: boolean
```

**Quan hệ:** 1 user → nhiều cycles · 1 cycle → nhiều phases (embedded array, không tách bảng)

---

## 7. State Management

| Loại state | Công cụ | Ví dụ |
|---|---|---|
| Timer states (idle/running/paused) | XState v5 | Không dùng Zustand cho timer |
| Cycle list, user data | Zustand | `cycle-store`, `auth-store` |
| UI local (modal open/close) | useState | Không đẩy lên global store |

**Quy tắc cứng:** Không dùng Zustand để quản lý trạng thái timer. XState là source of truth duy nhất cho timer.

---

## 8. Auth Flow

```
Vào app
  ├── Guest → dùng in-memory state
  └── Đăng nhập/đăng ký
        ├── Thành công → sync Firestore → vào dashboard
        └── Lỗi → hiện toast, ở lại form

Đang dùng guest có data → đăng nhập
  └── Merge guest cycles vào Firestore (không xóa)

Session hết hạn → Firebase tự refresh token
  └── Nếu refresh thất bại → logout, giữ cycles local trong session
```
