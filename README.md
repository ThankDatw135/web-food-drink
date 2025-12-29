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

- ✅ **Xác thực**: Đăng ký/Đăng nhập với JWT Authentication
- ✅ **Quản lý hồ sơ**: Upload và cập nhật avatar cá nhân, chỉnh sửa thông tin
- ✅ **Đổi mật khẩu**: Thay đổi mật khẩu với validation mạnh mẽ
- ✅ Tìm kiếm sản phẩm **Real-time** với debounce (500ms)
- ✅ **Lọc theo danh mục**: Tất cả, Đồ ăn, Đồ uống
- ✅ **Phân trang**: Homepage với 20 sản phẩm/trang
- ✅ Thêm vào giỏ hàng với **Toast Notifications** đẹp mắt
- ✅ **Giỏ hàng**: Quản lý số lượng, xóa sản phẩm, badge hiển thị tổng số
- ✅ **Thanh toán**: Trang checkout riêng với thông tin giao hàng
- ✅ **Lịch sử đơn hàng**: Xem danh sách đơn hàng với phân trang, mỗi user có số thứ tự đơn hàng riêng
- ✅ **Về chúng tôi**: Trang giới thiệu về FreshFood với câu chuyện, sứ mệnh, giá trị cốt lõi

### 🔐 Quản Trị Viên

- ✅ Trang đăng nhập Admin riêng biệt với bảo mật cao
- ✅ **Dashboard**: Biểu đồ doanh thu theo tuần/tháng và thống kê chi tiết (Chart.js)
- ✅ **Thống kê**: Tổng doanh thu, đơn hàng, sản phẩm, phân bố theo danh mục
- ✅ **Quản lý sản phẩm**: CRUD với Image Preview, phân trang, tìm kiếm và lọc
- ✅ **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng với phân trang
- ✅ **Upload ảnh**: Hỗ trợ upload ảnh sản phẩm và avatar (Multer)

### 🔥 Công Nghệ Nổi Bật

- ✅ **Phân trang thông minh**: Pagination cho tất cả danh sách (sản phẩm, đơn hàng)
- ✅ **Số thứ tự đơn hàng theo user**: Mỗi người dùng có hệ thống đánh số đơn hàng riêng
- ✅ **Glassmorphism UI**: Hiệu ứng blur, gradient, animations mượt mà
- ✅ **Dockerized**: Triển khai 1 lệnh, chạy mọi nơi
- ✅ **Responsive Design**: Tối ưu cho mọi thiết bị
- ✅ **LocalStorage Cart**: Giỏ hàng được lưu local, đồng bộ với backend

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
cd web-food-drink
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
| **Cài Đặt**          | `http://localhost:3005/html/settings.html`  | Đổi mật khẩu, cài đặt        |
| **Giỏ Hàng**         | `http://localhost:3005/html/cart.html`      | Xem & quản lý giỏ hàng       |
| **Thanh Toán**       | `http://localhost:3005/html/checkout.html`  | Trang thanh toán             |
| **Lịch Sử Đơn**      | `http://localhost:3005/html/history.html`   | Xem lịch sử đơn hàng         |
| **Về Chúng Tôi**     | `http://localhost:3005/html/about.html`     | Giới thiệu về FreshFood      |
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
2. **Dashboard**: Xem thống kê doanh thu theo tuần/tháng, biểu đồ, phân bố danh mục
3. **Products**:
   - Thêm món mới (có preview ảnh)
   - Sửa/Xóa sản phẩm
   - Upload ảnh → lưu vào `uploads/images/`
   - Phân trang và tìm kiếm sản phẩm
4. **Orders**:
   - Xem danh sách đơn hàng với phân trang
   - Cập nhật trạng thái đơn hàng (pending, paid, delivered, cancelled)
   - Xem chi tiết từng đơn hàng với thông tin user và sản phẩm

### ⚙️ Cài Đặt Người Dùng

1. Truy cập `/html/settings.html`
2. **Đổi mật khẩu**:
   - Nhập mật khẩu hiện tại
   - Nhập mật khẩu mới (tối thiểu 6 ký tự, có chữ hoa, chữ thường, số)
   - Xác nhận và cập nhật

---

## 📂 Cấu Trúc Dự Án

```
web-food-drink/
├── backend/
│   ├── config/
│   │   ├── server.js          # Entry point
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/           # Business logic
│   │   ├── authController.js       # Register, Login
│   │   ├── userController.js       # Profile, Avatar, Change Password
│   │   ├── cartController.js       # Cart operations
│   │   ├── orderController.js      # Order creation, history
│   │   └── adminController.js      # Dashboard stats, orders management
│   ├── routes/                # API endpoints
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── setupRoutes.js
│   ├── middleware/            # Auth, Upload, Admin
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── adminMiddleware.js
│   ├── .env                   # Environment variables
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── html/                  # User pages
│   │   ├── index.html         # Homepage with products
│   │   ├── login.html         # User login
│   │   ├── register.html      # User registration
│   │   ├── cart.html          # Shopping cart
│   │   ├── checkout.html      # Checkout page
│   │   ├── profile.html       # User profile
│   │   ├── history.html       # Order history
│   │   ├── settings.html      # User settings
│   │   └── about.html         # About us
│   ├── admin/                 # Admin pages
│   │   ├── index.html         # Dashboard with charts
│   │   ├── login.html         # Admin login
│   │   ├── products.html      # Product management
│   │   └── orders.html        # Order management
│   ├── css/
│   │   ├── style.css          # Main Glassmorphism styles
│   │   └── auth.css           # Authentication styles
│   ├── js/
│   │   ├── config.js          # API configuration
│   │   ├── api.js             # API wrapper
│   │   ├── main.js            # Toast, Search, Pagination
│   │   ├── auth.js            # Login/Register logic
│   │   └── cart.js            # Cart management
├── database/
│   ├── init.sql               # Database schema + seed data
│   ├── migrations/            # Database migrations
│   └── *.sql                  # Additional SQL scripts
├── uploads/
│   ├── images/                # Product images
│   └── avatars/               # User avatars
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register           # Đăng ký
POST /api/auth/login              # Đăng nhập
```

### User

```
GET    /api/users/profile         # Lấy thông tin user
PUT    /api/users/profile         # Cập nhật thông tin user
POST   /api/users/avatar          # Upload avatar
PUT    /api/users/change-password # Đổi mật khẩu
```

### Products

```
GET    /api/products              # Lấy danh sách (có search, category & pagination)
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
DELETE /api/orders/:orderId       # Xóa đơn hàng
```

### Admin

```
GET    /api/admin/stats                      # Dashboard statistics
GET    /api/admin/revenue/monthly            # Monthly revenue (12 months)
GET    /api/admin/revenue/weekly             # Weekly revenue (7 days)
GET    /api/admin/categories                 # Get all categories
GET    /api/admin/categories/distribution    # Category distribution
GET    /api/admin/orders                     # Lấy tất cả đơn hàng (có phân trang)
PUT    /api/admin/orders/:orderId/status     # Cập nhật trạng thái đơn hàng
```

### Setup

```
GET    /api/setup-admin           # Tạo tài khoản admin mặc định
GET    /api/health                # Kiểm tra kết nối database
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

- [x] JWT Authentication
- [x] Pagination cho tất cả danh sách
- [x] Upload avatar
- [x] Quản lý đơn hàng (Admin)
- [x] Số thứ tự đơn hàng theo user
- [x] Real-time search với debounce
- [x] Category filtering (food/drink)
- [x] Toast notifications
- [x] Admin dashboard với biểu đồ
- [x] Trang About Us
- [x] Trang Settings với đổi mật khẩu
- [x] Trang Checkout riêng biệt
- [x] LocalStorage cart sync

### 🚧 Đang Phát Triển

- [ ] Payment gateway (VNPay/Momo)
- [ ] Email notifications cho đơn hàng
- [ ] Order tracking real-time
- [ ] Product reviews & ratings
- [ ] Coupon/Discount system (database schema đã có)
- [ ] Multi-language support (EN/VI)
- [ ] Admin analytics dashboard nâng cao
- [ ] Export reports (PDF/Excel)
- [ ] Google OAuth integration
- [ ] Forgot password với OTP

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
- [Docker](https://www.docker.com/) - Containerization
- [MySQL](https://www.mysql.com/) - Database

---

**⭐ Nếu project hữu ích, hãy cho một Star nhé!**
