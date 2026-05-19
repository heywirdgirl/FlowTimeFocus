# Agent Briefing

Goal: Giúp cải thiện, sửa lỗi và mở rộng TimeCycle (FlowTimeFocus) — app Next.js dùng XState cho timer và Firebase cho sync.

Priorities:
- Bảo toàn trạng thái timer (XState) khi thực hiện thay đổi code.
- Đảm bảo trải nghiệm guest → login → merge không mất dữ liệu.
- Giữ UI đơn giản, dễ chạy bằng `npm run dev`.

Context ngắn:
- Stack: Next.js, TypeScript, XState v5, Zustand, Firebase, TailwindCSS.

Operational notes:
- Khi làm thay đổi state machine, luôn mô phỏng các transition: start, pause, resume, skip, stop.
- Đối với database: viết migration nhẹ nếu thay schema.
