# Music Web - Frontend (FE)

## 🎨 Giới thiệu dự án
Giao diện người dùng (UI) hiện đại và tương tác cao cho nền tảng nghe nhạc trực tuyến. Dự án tập trung vào trải nghiệm người dùng mượt mà, thiết kế sang trọng và tích hợp nhiều công nghệ hiển thị tiên tiến.

## 🚀 Công nghệ sử dụng
Dự án sử dụng bộ công nghệ (Tech Stack) mạnh mẽ nhất hiện nay:
- **Framework:** React 19 (với TypeScript)
- **Công cụ build:** Vite (siêu nhanh)
- **Quản lý trạng thái:** Zustand (nhẹ nhàng, hiệu quả)
- **Data Fetching:** TanStack Query (React Query)
- **Styling & UI:**
    - **Tailwind CSS v4:** Styling cực nhanh và hiện đại.
    - **Mantine UI & Material UI (MUI):** Thư viện component phong phú.
    - **Shadcn UI:** Custom components linh hoạt.
    - **Lucide & Tabler Icons:** Bộ icon đẹp mắt.
- **Trải nghiệm hình ảnh:** Three.js & React Three Fiber (cho các hiệu ứng 3D).
- **Quản lý Form:** React Hook Form & Zod.
- **Đa ngôn ngữ:** i18next (hỗ trợ nhiều ngôn ngữ).
- **Thông báo:** React Hot Toast & Mantine Notifications.
- **Routing:** React Router DOM (v7).

## ✨ Các tính năng đặc sắc
- **Giao diện nghe nhạc hiện đại:** Trình phát nhạc chất lượng cao với thanh điều hướng, điều khiển âm lượng và chế độ lặp.
- **Trang chủ sống động:** Hiển thị danh sách bài hát mới nhất, nghệ sĩ nổi tiếng và danh sách phát theo xu hướng.
- **AI Chatbot Interface:** Giao diện trò chuyện thông minh tích hợp trực tiếp với Gemini AI để hỗ trợ người dùng.
- **Quản lý cá nhân:** Xem lịch sử nghe nhạc, quản lý danh sách yêu thích và hồ sơ cá nhân.
- **Hệ thống Quản trị (Admin Dashboard):**
    - Biểu đồ thống kê.
    - Quản lý danh sách bài hát, album và nghệ sĩ.
    - Duyệt người dùng và phân quyền.
- **Hiệu ứng 3D:** Tích hợp Three.js cho các phần trang trí hoặc trình visualizer nhạc (tùy chọn).
- **Thiết kế Responsive:** Tương thích hoàn hảo trên mọi thiết bị từ Desktop đến Mobile.

## 📁 Cấu trúc thư mục
```text
src/
├── api/            # Cấu hình kết nối API
├── components/     # Các thành phần giao diện dùng chung (Button, Card, Input...)
├── config/         # Cấu hình dự án (Constants, Env)
├── hooks/          # Các custom hooks hữu ích
├── layouts/        # Bố cục trang (MainLayout, AuthLayout, AdminLayout)
├── lib/            # Cấu hình các thư viện bên thứ ba (lucide, utils)
├── pages/          # Các trang chính (Homepage, Login, AdminDashboard...)
├── routes/         # Cấu hình định tuyến với React Router
├── services/       # Xử lý gọi API và logic nghiệp vụ frontend
├── store/          # Quản lý trạng thái global với Zustand
├── theme/          # Cấu hình màu sắc, font chữ và theme Material/Mantine
├── types/          # Định nghĩa các interface/type TypeScript
└── App.tsx        # Thành phần gốc của ứng dụng
```

## 🛠️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- NPM hoặc Yarn

### 2. Các bước cài đặt
1. **Clone dự án:**
   ```bash
   git clone <repo-url>
   cd frontend
   ```
2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```
3. **Cấu hình môi trường:**
   Tạo tệp `.env` tại thư mục gốc:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. **Chạy dự án:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 🌟 Trải nghiệm người dùng
Dự án được chăm chút tỉ mỉ về phần nhìn với:
- **Hiệu ứng mờ (Glassmorphism):** Mang lại cảm giác cao cấp.
- **Micro-animations:** Các chuyển động nhỏ khi hover hoặc click.
- **Dark Mode:** Mặc định được thiết kế thân thiện với mắt.

---
*Giao diện đang được nâng cấp liên tục để mang lại trải nghiệm âm nhạc tốt nhất.*
