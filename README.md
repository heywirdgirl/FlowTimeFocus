# FlowTime Focus

Đây là một ứng dụng quản lý thời gian được xây dựng bằng Next.js và Firebase Studio, giúp bạn tập trung vào công việc và nghỉ ngơi một cách hiệu quả.

## Cây thư mục

```
.
├── .env                  # Tệp chứa các biến môi trường
├── src
│   ├── ai                # Các tệp liên quan đến AI với Genkit
│   │   ├── flows         # Logic AI chính
│   │   └── genkit.ts     # Cấu hình Genkit
│   ├── app               # Các tuyến đường và layout chính của Next.js
│   │   ├── globals.css   # CSS toàn cục
│   │   ├── layout.tsx    # Layout gốc
│   │   └── page.tsx      # Trang chủ
│   ├── components        # Các thành phần React
│   │   ├── app           # Các thành phần cụ thể của ứng dụng
│   │   └── ui            # Các thành phần giao diện người dùng từ ShadCN
│   ├── contexts          # Các context provider của React
│   └── lib               # Các hàm tiện ích và tệp dùng chung
├── package.json          # Danh sách các gói phụ thuộc và script
└── tailwind.config.ts    # Cấu hình Tailwind CSS
```

## Các thư viện đã cài đặt

Dưới đây là danh sách các thư viện chính được sử dụng trong dự án:

- **Next.js**: Framework React để xây dựng ứng dụng web.
- **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **TypeScript**: Ngôn ngữ lập trình dựa trên JavaScript với kiểu tĩnh.
- **Tailwind CSS**: Framework CSS tiện ích để tạo kiểu nhanh chóng.
- **ShadCN/UI**: Bộ sưu tập các thành phần giao diện người dùng có thể tái sử dụng.
- **Genkit**: Toolkit để xây dựng các tính năng AI.
- **Lucide React**: Thư viện biểu tượng.
- **Zod**: Thư viện xác thực schema.
- **Framer Motion**: Thư viện hoạt ảnh cho React.
- **React Hook Form**: Thư viện quản lý biểu mẫu.
- **Tone.js**: Framework để tạo nhạc và âm thanh tương tác trong trình duyệt.

## Biến môi trường

Để chạy ứng dụng, bạn cần tạo một tệp `.env` ở thư mục gốc của dự án và điền vào các biến sau. Hiện tại, chưa có biến môi trường nào được yêu cầu.

```bash
# Không có biến môi trường nào được yêu cầu vào lúc này.
```

## Bắt đầu

Để bắt đầu, hãy xem qua `src/app/page.tsx`.
