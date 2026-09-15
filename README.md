# 📚 Website Bán Sách Trực Tuyến

Website thương mại điện tử bán sách trực tuyến với đầy đủ chức năng: duyệt sách, tìm kiếm, giỏ hàng, đặt hàng, quản lý kho, báo cáo doanh thu, gửi email thông báo.

## 🏗️ Kiến trúc hệ thống

```
WebBanSachTrucTuyen/
├── Database/               # Script tạo CSDL SQL Server
│   └── DBWebBanSach.sql
├── backend/                # REST API (Node.js + Express + TypeScript)
│   ├── config/             # Cấu hình DB, Mail
│   ├── controllers/        # Xử lý request
│   ├── middleware/         # Auth, upload, error handler
│   ├── models/            # Định nghĩa kiểu dữ liệu
│   ├── routes/            # Định tuyến API
│   ├── services/          # Logic nghiệp vụ (gọi Stored Procedures)
│   ├── seeder/            # Dữ liệu mẫu
│   └── views/             # Template email
└── web-ban-sach-truc-tuyen/  # Frontend (Next.js 16 + React 19 + Bootstrap 5)
    ├── app/               # Các trang (App Router)
    ├── components/        # Component tái sử dụng
    ├── contexts/          # Auth context
    ├── lib/               # Hàm gọi API
    └── types/             # Định nghĩa TypeScript
```

## 📋 Yêu cầu hệ thống

| Phần mềm | Phiên bản |
|-----------|-----------|
| **Node.js** | >= 18.x |
| **SQL Server** | 2019 trở lên |
| **SQL Server Management Studio (SSMS)** | Khuyến nghị |
| **npm** | >= 9.x (đi kèm Node.js) |

## 🚀 Hướng dẫn cài đặt và chạy

### Bước 1: Tạo cơ sở dữ liệu

1. Mở **SQL Server Management Studio (SSMS)**.
2. Kết nối SQL Server bằng tài khoản `sa` (SQL Server Authentication).
3. Mở file `Database/DBWebBanSach.sql`.
4. Nhấn **Execute (F5)** để chạy toàn bộ script — sẽ tạo:
   - Database `WebBanSach`
   - Tất cả bảng (vai_tro, nguoi_dung, sach, don_hang, ...)
   - Tất cả Stored Procedures
   - Indexes

### Bước 2: Cấu hình Backend

1. Mở terminal, di chuyển vào thư mục backend:

```bash
cd backend
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ file mẫu:

```bash
copy .env.example .env
```

4. Mở file `.env` và chỉnh sửa thông tin phù hợp:

```env
# === SERVER ===
PORT=5000

# === SQL SERVER ===
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=<mật_khẩu_sa_của_bạn>
DB_NAME=WebBanSach
DB_PORT=1433

# === JWT ===
JWT_SECRET=bookstore_jwt_secret_key_2026
JWT_EXPIRES_IN=7d

# === NODEMAILER (Gmail) ===
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=<email_gmail_của_bạn>
MAIL_PASS=<app_password_gmail>
MAIL_FROM=<email_gmail_của_bạn>
```

> **Lưu ý về MAIL_PASS**: Đây không phải mật khẩu Gmail thông thường. Bạn cần tạo **App Password**:
> 1. Vào https://myaccount.google.com/security
> 2. Bật **Xác minh 2 bước** (2-Step Verification)
> 3. Vào **Mật khẩu ứng dụng** (App Passwords) → tạo mật khẩu cho "Mail"
> 4. Copy mật khẩu 16 ký tự, dán vào `MAIL_PASS`

### Bước 3: Nạp dữ liệu mẫu (tuỳ chọn)

```bash
cd backend
npm run seed
```

Lệnh này sẽ tạo dữ liệu mẫu gồm: vai trò, tài khoản admin/nhân viên, thể loại sách, nhà xuất bản, và một số đầu sách.

### Bước 4: Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

Nếu kết nối thành công sẽ thấy:
```
✅ Kết nối SQL Server thành công!
🚀 Server đang chạy tại: http://localhost:5000
📚 API endpoint:  http://localhost:5000/api
```

### Bước 5: Cấu hình Frontend

1. Mở terminal mới, di chuyển vào thư mục frontend:

```bash
cd web-ban-sach-truc-tuyen
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Kiểm tra file `.env.local` (thường đã có sẵn):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Bước 6: Chạy Frontend

```bash
cd web-ban-sach-truc-tuyen
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 🔑 Tài khoản mặc định (sau khi seed)

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Quản trị viên | admin@bookstore.com | Admin@123 |
| Nhân viên | staff@bookstore.com | Staff@123 |

> Bạn có thể đăng ký tài khoản khách hàng mới trực tiếp trên giao diện.

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** — REST API
- **TypeScript** — Type-safe
- **SQL Server** — Cơ sở dữ liệu (Stored Procedures)
- **mssql** — Driver kết nối SQL Server
- **JWT** — Xác thực người dùng
- **Nodemailer** — Gửi email thông báo
- **Multer** — Upload ảnh bìa sách
- **bcryptjs** — Mã hóa mật khẩu

### Frontend
- **Next.js 16** — React Framework (App Router)
- **React 19** — UI Library
- **React Bootstrap 5** — UI Components
- **Bootstrap Icons** — Icon library
- **TypeScript** — Type-safe

## 📧 Chức năng gửi email

Hệ thống tự động gửi email cho khách hàng khi:
- **Đặt đơn hàng** thành công → Email xác nhận kèm chi tiết sản phẩm
- **Hủy đơn hàng** → Email thông báo hủy kèm lý do

## 📁 API Endpoints chính

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/books` | Danh sách sách |
| GET | `/api/books/:id` | Chi tiết sách |
| POST | `/api/cart` | Thêm vào giỏ hàng |
| GET | `/api/cart` | Xem giỏ hàng |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders` | Danh sách đơn hàng |
| POST | `/api/nhaphang` | Nhập hàng sách |
| GET | `/api/dashboard` | Báo cáo tổng quan |

## 📞 Liên hệ

- **Email**: nhatbang1006.179@gmail.com
- **Hotline**: 0359 048 033
