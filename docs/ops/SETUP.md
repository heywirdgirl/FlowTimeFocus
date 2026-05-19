# Setup

Yêu cầu: Node.js 18+, npm

1) Cài dependency

```bash
npm install
```

2) Thiết lập Firebase (tạo project, Auth + Firestore) và điền biến môi trường vào `.env.local` theo `.env.example`.

3) Chạy dev server

```bash
npm run dev
```

Biến môi trường tối thiểu (để copy vào `.env.local`):

- NEXT_PUBLIC_FIREBASE_API_KEY=
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=

Ghi chú: project dùng Firestore trực tiếp; nếu cần API server, thêm routes dưới `app/api`.
