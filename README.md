# 🍔 FreshFood - E-commerce F&B Platform

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-yellow?logo=firebase)](https://firebase.google.com/)

Website thương mại điện tử F&B hiện đại, bảo mật, chạy trên Docker với thiết kế Glassmorphism và tích hợp Firebase để đồng bộ dữ liệu.

![FreshFood Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200&h=400)

---

## ✨ Tính Năng Chính

### 👥 Người Dùng

- ✅ **Xác thực đa dạng**: Đăng ký/Đăng nhập với JWT Authentication hoặc Google OAuth
- ✅ **Quản lý hồ sơ**: Upload và cập nhật avatar cá nhân
- ✅ Tìm kiếm sản phẩm **Real-time** (tự động lọc khi gõ)
- ✅ Thêm vào giỏ hàng với **Toast Notifications** đẹp mắt
- ✅ Thanh toán COD với thông tin giao hàng
- ✅ **Lịch sử đơn hàng**: Xem danh sách đơn hàng với phân trang, mỗi user có số thứ tự đơn hàng riêng
- ✅ **Lịch sử hoạt động**: Theo dõi các hoạt động cá nhân với phân trang

### 🔐 Quản Trị Viên

- ✅ Trang đăng nhập Admin riêng biệt với bảo mật cao
- ✅ **Dashboard**: Biểu đồ doanh thu và thống kê chi tiết (Chart.js)
- ✅ **Quản lý sản phẩm**: CRUD với Image Preview và phân trang
- ✅ **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng với phân trang
- ✅ **Upload ảnh**: Hỗ trợ upload ảnh sản phẩm và avatar (Multer)
- ✅ **Lọc và tìm kiếm**: Tìm kiếm sản phẩm, lọc theo trạng thái

### 🔥 Công Nghệ Nổi Bật

- ✅ **Phân trang thông minh**: Pagination cho tất cả danh sách (sản phẩm, đơn hàng, lịch sử)
- ✅ **Số thứ tự đơn hàng theo user**: Mỗi người dùng có hệ thống đánh số đơn hàng riêng
- ✅ **Glassmorphism UI**: Hiệu ứng blur, gradient, animations mượt mà
- ✅ **Dockerized**: Triển khai 1 lệnh, chạy mọi nơi
- ✅ **Responsive Design**: Tối ưu cho mọi thiết bị
- ✅ **Email OTP**: Hệ thống gửi OTP qua email cho reset mật khẩu

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER CONTAINER                      │
├──────────────────┬──────────────────────────────────────┤
│   Frontend       │   Backend (Node.js + Express)        │
│   (Vanilla JS)   │   ├─ REST API                        │
│   ├─ HTML/CSS    │   ├─ JWT Auth + Google OAuth         │
│   ├─ Toast UI    │   ├─ Multer Upload                   │
│   └─ Real-time   │   ├─ Email Service (OTP)             │
│      Search      │   └─ Pagination System               │
├──────────────────┼──────────────────────────────────────┤
│                  │   MySQL 8.0                           │
│                  │   (Primary Database)                  │
│                  │   Port: 3307                          │
└──────────────────┴──────────────────────────────────────┘
```

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Git](https://git-scm.com/)

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd webbandoannuocuong
```

### Bước 2: Build & Run Docker

```bash
docker-compose up -d --build
```

### Bước 3: Tạo Tài Khoản Admin

Truy cập: `http://localhost:3005/api/setup-admin`

Tài khoản mặc định:

- **Email:** `admin@example.com`
- **Password:** `admin`

---

## 📖 Hướng Dẫn Sử Dụng

### 🌐 Truy Cập Website

| Trang                | URL                                         | Mô Tả                        |
| -------------------- | ------------------------------------------- | ---------------------------- |
| **Trang Chủ**        | `http://localhost:3005/html/index.html`     | Danh sách sản phẩm, tìm kiếm |
| **Đăng Ký**          | `http://localhost:3005/html/register.html`  | Tạo tài khoản mới            |
| **Đăng Nhập**        | `http://localhost:3005/html/login.html`     | Đăng nhập khách hàng         |
| **Hồ Sơ**            | `http://localhost:3005/html/profile.html`   | Quản lý thông tin cá nhân    |
| **Giỏ Hàng**         | `http://localhost:3005/html/cart.html`      | Xem & quản lý giỏ hàng       |
| **Lịch Sử Đơn**      | `http://localhost:3005/html/history.html`   | Xem lịch sử đơn hàng         |
| **Admin Login**      | `http://localhost:3005/admin/login.html`    | Đăng nhập quản trị           |
| **Admin Dashboard**  | `http://localhost:3005/admin/index.html`    | Bảng điều khiển              |
| **Quản Lý Sản Phẩm** | `http://localhost:3005/admin/products.html` | CRUD sản phẩm                |
| **Quản Lý Đơn Hàng** | `http://localhost:3005/admin/orders.html`   | Quản lý đơn hàng             |

### 🛒 Quy Trình Mua Hàng

1. **Duyệt sản phẩm** → Tìm kiếm real-time với phân trang
2. **Thêm vào giỏ** → Toast notification hiện lên
3. **Xem giỏ hàng** → Điều chỉnh số lượng
4. **Thanh toán** → Nhập thông tin giao hàng
5. **Hoàn tất** → Đơn hàng được lưu với số thứ tự riêng cho mỗi user

### 🔧 Quản Lý Admin

1. Đăng nhập tại `/admin/login.html`
2. **Dashboard**: Xem thống kê doanh thu và biểu đồ
3. **Products**:
   - Thêm món mới (có preview ảnh)
   - Sửa/Xóa sản phẩm
   - Upload ảnh → lưu vào `uploads/`
   - Phân trang và tìm kiếm sản phẩm
4. **Orders**:
   - Xem danh sách đơn hàng với phân trang
   - Cập nhật trạng thái đơn hàng
   - Xem chi tiết từng đơn hàng

---

## 📂 Cấu Trúc Dự Án

```
webbandoannuocuong/
├── backend/
│   ├── config/
│   │   ├── server.js          # Entry point
│   │   └── db.js              # MySQL pool
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── middleware/            # Auth, Upload
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── adminAuth.js
│   ├── .env                   # Environment vars
│   └── package.json
├── frontend/
│   ├── html/                  # Client pages
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── cart.html
│   │   ├── profile.html
│   │   └── history.html
│   ├── admin/                 # Admin pages
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── products.html
│   │   └── orders.html
│   ├── css/
│   │   └── style.css          # Glassmorphism styles
│   ├── js/
│   │   ├── api.js             # API wrapper
│   │   ├── main.js            # Toast, Search
│   │   ├── auth.js            # Login/Register
│   │   └── cart.js            # Cart logic
├── database/
│   └── init.sql               # Schema + seed data
├── uploads/                   # Product images & avatars
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register           # Đăng ký
POST /api/auth/login              # Đăng nhập
POST /api/auth/google             # Đăng nhập Google OAuth
POST /api/auth/forgot-password    # Quên mật khẩu (gửi OTP)
POST /api/auth/reset-password     # Reset mật khẩu với OTP
```

### User

```
GET    /api/user/profile          # Lấy thông tin user
PUT    /api/user/profile          # Cập nhật thông tin user
POST   /api/user/avatar           # Upload avatar
GET    /api/user/history          # Lịch sử hoạt động (có phân trang)
```

### Products

```
GET    /api/products              # Lấy danh sách (có search & pagination)
GET    /api/products/:id          # Lấy chi tiết sản phẩm
POST   /api/products              # Thêm sản phẩm (Admin)
PUT    /api/products/:id          # Sửa sản phẩm (Admin)
DELETE /api/products/:id          # Xóa sản phẩm (Admin)
```

### Cart

```
GET    /api/cart                  # Lấy giỏ hàng
POST   /api/cart                  # Thêm vào giỏ
PUT    /api/cart/:productId       # Cập nhật số lượng
DELETE /api/cart/:productId       # Xóa khỏi giỏ
```

### Orders

```
POST   /api/orders                # Tạo đơn hàng
GET    /api/orders                # Lấy đơn hàng của user (có phân trang)
GET    /api/orders/:id            # Chi tiết đơn hàng
```

### Admin

```
GET    /api/admin/orders          # Lấy tất cả đơn hàng (có phân trang)
PUT    /api/admin/orders/:id      # Cập nhật trạng thái đơn hàng
GET    /api/admin/stats           # Thống kê doanh thu
```

---

## 🎨 Thiết Kế UI

### Color Palette

```css
--primary: #ff4757        /* Coral Red */
--secondary: #2ed573      /* Mint Green */
--bg-dark: #0f0f12        /* Deep Black */
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
```

### Glassmorphism Effect

- **Backdrop Blur**: 10px
- **Border**: 1px solid rgba(255,255,255,0.1)
- **Shadow**: 0 8px 32px rgba(0,0,0,0.37)

---

## 🔒 Bảo Mật

- ✅ Password hashing với **bcryptjs** (10 salt rounds)
- ✅ JWT tokens với expiry
- ✅ Protected routes với middleware
- ✅ Role-based access (User/Admin)
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS configured

---

## 🐳 Docker Configuration

### Ports

- **App**: `3005` (external) → `3000` (internal)
- **MySQL**: `3307` (external) → `3306` (internal)

### Volumes

```yaml
- ./backend:/usr/src/app
- ./frontend:/usr/src/frontend
- ./uploads:/usr/src/uploads
- /usr/src/app/node_modules
```

### Environment Variables

```env
PORT=3000
DB_HOST=db
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=food_beverage_db
JWT_SECRET=toptotalsecrethahaha
```

---

## 🛠️ Troubleshooting

### Lỗi: Port đã được sử dụng

```bash
# Kiểm tra port đang chạy
netstat -ano | findstr :3005
# Kill process
taskkill /PID <PID> /F
```

### Lỗi: Database connection failed

```bash
# Restart containers
docker-compose restart
# Xem logs
docker-compose logs db
```

---

## 📝 TODO / Roadmap

### ✅ Đã Hoàn Thành

- [x] Google OAuth integration
- [x] Email OTP cho reset password
- [x] Pagination cho tất cả danh sách
- [x] Upload avatar
- [x] Quản lý đơn hàng (Admin)
- [x] Số thứ tự đơn hàng theo user
- [x] Lịch sử hoạt động user

### 🚧 Đang Phát Triển

- [ ] Payment gateway (VNPay/Momo)
- [ ] Email notifications cho đơn hàng
- [ ] Order tracking real-time
- [ ] Product reviews & ratings
- [ ] Coupon/Discount system
- [ ] Multi-language support (EN/VI)
- [ ] Admin analytics dashboard nâng cao
- [ ] Export reports (PDF/Excel)

---

## 👨‍💻 Tác Giả

Phát triển bởi **AI Assistant** với sự hỗ trợ của Google Gemini, Github Copilot, Kiro, và các nguồn mở khác.

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) - Ảnh sản phẩm mẫu
- [Font Awesome](https://fontawesome.com/) - Icons
- [Chart.js](https://www.chartjs.org/) - Dashboard charts
- [Google OAuth](https://developers.google.com/identity) - Authentication
- [Nodemailer](https://nodemailer.com/) - Email service

---

