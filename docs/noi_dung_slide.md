# NỘI DUNG VIẾT TRONG TỪNG SLIDE (DÀNH CHO POWERPOINT / CANVA)

---

## SLIDE 1: TRANG TIÊU ĐỀ
### WEBSITE BÁN SÁCH TRỰC TUYẾN
**Hệ Thống Thương Mại Điện Tử & Quản Trị Kho Hàng Chuyên Biệt**

* **Sinh viên thực hiện:** [Tên của bạn]
* **Giảng viên hướng dẫn:** [Tên Thầy/Cô]
* **Công nghệ chủ đạo:** Next.js 16 • Express.js TypeScript • Microsoft SQL Server
* **Năm thực hiện:** 2026

---

## SLIDE 2: ĐẶT VẤN ĐỀ
### Thực Trạng & Thách Thức Bán Sách Trực Tuyến

* **Quản lý tồn kho phức tạp:**
  * Sách có nhiều đầu mục, nhiều lần tái bản, giá vốn biến động.
  * Dễ thất thoát, sai lệch số lượng nếu cập nhật thủ công.
* **Trải nghiệm tìm kiếm hạn chế:**
  * Độc giả có nhu cầu lọc đa chiều: Tác giả, Thể loại, NXB, Mã ISBN, khoảng giá.
  * Thiếu công cụ tìm kiếm tối ưu trên các website thông thường.
* **Xử lý đơn hàng thiếu tự động:**
  * Chưa có email xác nhận tức thì kèm hóa đơn chi tiết.
  * Thiếu minh bạch trạng thái đơn, tỷ lệ hủy đơn cao.

---

## SLIDE 3: MỤC TIÊU ĐỀ TÀI
### Giải Pháp & Đối Tượng Phục Vụ

* **Khách hàng (Customer):**
  * Tra cứu, lọc sách đa tiêu chí nhanh chóng.
  * Giỏ hàng đồng bộ trực tiếp trên Database theo tài khoản.
  * Đặt hàng với địa chỉ 3 cấp; nhận email xác nhận tự động.
* **Nhân viên kho (Staff):**
  * Tạo phiếu nhập kho theo đơn giá và số lượng thực nhận.
  * Tự động cộng tồn kho và cập nhật trạng thái sách qua giao tác an toàn.
  * Quản lý tiến độ đơn hàng và cập nhật trạng thái vận chuyển.
* **Quản trị viên (Admin):**
  * Dashboard thống kê doanh thu theo thời gian thực.
  * Báo cáo top sách bán chạy và phân bổ trạng thái đơn.
  * Quản lý danh mục sách và phân quyền tài khoản người dùng (RBAC).

---

## SLIDE 4: KIẾN TRÚC HỆ THỐNG
### Mô Hình Kiến Trúc 3 Lớp (3-Tier Architecture)

* **1. Client Tier (Giao diện người dùng - Port 3000):**
  * Framework: Next.js 16 (App Router) + React 19.
  * UI Library: React-Bootstrap 5 + Tailwind CSS (Responsive, Mobile-first).
* **2. Application Tier (Máy chủ API - Port 5000):**
  * Runtime & Framework: Node.js + Express.js (TypeScript).
  * Tiện ích: JSON Web Token (JWT), Multer (Upload ảnh bìa), Nodemailer (Email tự động).
* **3. Data Tier (Cơ sở dữ liệu - Port 1433):**
  * Hệ quản trị: Microsoft SQL Server 2019+.
  * 11 bảng chuẩn hóa 3NF; đóng gói 100% logic qua **Stored Procedures**.

---

## SLIDE 5: CÔNG NGHỆ CHỦ CHỐT
### Công Nghệ Sử Dụng & Lý Do Lựa Chọn

* **Next.js 16 & React 19:**
  * App Router thế hệ mới, hỗ trợ Server Components.
  * Tối ưu hóa SEO cho từng đầu sách, tốc độ tải trang nhanh.
* **Express.js & TypeScript:**
  * Non-blocking I/O hiệu năng cao.
  * Kiểm soát kiểu dữ liệu chặt chẽ (Type-safe), giảm thiểu lỗi runtime.
* **Microsoft SQL Server:**
  * Xử lý Stored Procedures xuất sắc, tính toàn vẹn giao dịch (ACID) cao.
  * Bảo đảm tính chính xác tuyệt đối cho dữ liệu kho hàng và hóa đơn.
* **Nodemailer (Gmail SMTP):**
  * Tự động gửi email biên lai đặt hàng và thông báo hủy đơn tức thời.

---

## SLIDE 6: THIẾT KẾ CƠ SỞ DỮ LIỆU
### 11 Bảng Chuẩn Hóa 3NF & Ràng Buộc Toàn Vẹn

* **Phân nhóm bảng dữ liệu:**
  * Danh mục: `sach`, `the_loai_sach`, `nha_xuat_ban`
  * Đơn hàng & Giỏ: `gio_hang`, `chi_tiet_gio_hang`, `don_hang`, `chi_tiet_don_hang`
  * Quản lý kho & Người dùng: `nhap_hang_sach`, `nguoi_dung`, `vai_tro`
* **Ràng buộc toàn vẹn nghiêm ngặt (Check Constraints):**
  * `CHECK (gia_ban <= gia_goc)`: Ngăn chặn lỗi giá bán cao hơn giá bìa.
  * `CHECK (so_luong_ton >= 0)`: Chống tình trạng âm kho hàng.
  * `CHECK (trang_thai IN ('Còn hàng', 'Hết hàng', 'Ngừng bán'))`.

---

## SLIDE 7: KỸ THUẬT TỐI ƯU DATABASE
### An Toàn Giao Tác & Tăng Tốc Truy Vấn

* **Cột tính toán lưu trữ vật lý (PERSISTED Column):**
  * Bảng `chi_tiet_don_hang`: `thanh_tien AS (don_gia * so_luong) PERSISTED`.
  * Tính và lưu trực tiếp xuống đĩa, tăng tốc độ truy vấn tổng doanh thu.
* **Hệ thống chỉ mục B-Tree (Indexes):**
  * `ix_sach_ten_sach`: Tăng tốc độ tìm kiếm theo tên sách.
  * `ix_don_hang_ngay_dat`: Tối ưu lọc báo cáo doanh thu theo thời gian.
  * Giảm độ phức tạp thuật toán từ quét bảng O(N) xuống O(log N).
* **An toàn giao tác tuyệt đối:**
  * Bọc toàn bộ quy trình Đặt hàng và Nhập kho trong `BEGIN TRANSACTION`.
  * Tự động `ROLLBACK` khi xảy ra sự cố; chống hoàn toàn **SQL Injection**.

---

## SLIDE 8: PHÂN HỆ KHÁCH HÀNG
### Quy Trình Mua Sắm & Trải Nghiệm Khách Hàng

* **1. Khám phá sách thông minh:**
  * Trang chủ: Danh mục Sách mới, Sách bán chạy, Sách đang giảm giá.
  * Bộ lọc đa tiêu chí: Lọc theo thể loại, NXB, khoảng giá, sắp xếp theo giá.
* **2. Giỏ hàng đồng bộ Database:**
  * Lưu trữ theo tài khoản người dùng, giữ nguyên dữ liệu khi đổi thiết bị.
  * Kiểm tra tồn kho thời gian thực, ngăn chặn đặt vượt số lượng còn lại.
* **3. Thanh toán thuận tiện:**
  * Nhập địa chỉ giao hàng chuẩn 3 cấp (Tỉnh/Thành - Quận/Huyện - Phường/Xã).
* **4. Theo dõi đơn hàng:**
  * Xem trạng thái đơn (Chờ xác nhận, Đang giao, Đã giao, Đã hủy).
  * Khách hàng chủ động hủy đơn khi đơn chưa vận chuyển.

---

## SLIDE 9: PHÂN HỆ QUẢN LÝ KHO & NHẬP HÀNG
### Nghiệp Vụ Nhập Kho & Chống Thất Thoát

* **Nguyên tắc cốt lõi:**
  * Tuyệt đối **không sửa số lượng tồn thủ công** trong cơ sở dữ liệu.
  * Mọi biến động kho đều phải có phiếu nhập kho hoặc đơn hàng đối ứng.
* **Quy trình nhập hàng (`sp_nhap_hang_sach`):**
  * 1. Nhân viên chọn sách, nhập đơn giá nhập và số lượng thực nhận.
  * 2. Hệ thống mở `BEGIN TRANSACTION`.
  * 3. Ghi phiếu nhập vào bảng `nhap_hang_sach` (lưu vết người nhập, ngày giờ).
  * 4. Tự động cộng dồn vào `so_luong_ton` của bảng `sach`.
  * 5. Tự động đổi trạng thái từ "Hết hàng" sang "Còn hàng".
  * 6. `COMMIT TRANSACTION` (hoặc `ROLLBACK` nếu có lỗi).

---

## SLIDE 10: PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN)
### Báo Cáo Doanh Thu & Kiểm Soát Hệ Thống

* **Dashboard Báo cáo Doanh thu:**
  * Biểu đồ doanh thu trực quan theo mốc thời gian (ngày, tháng).
  * Thống kê tổng số đơn hàng, số sách đã bán, tỷ lệ giao hàng thành công.
* **Thống kê Top Sách Bán Chạy:**
  * Tự động xếp hạng đầu sách có doanh số và số lượng bán cao nhất.
  * Hỗ trợ người quản lý lên kế hoạch tái bản và nhập hàng kịp thời.
* **Quản trị Người dùng & Phân quyền:**
  * Tạo tài khoản nhân viên mới, phân quyền truy cập theo vai trò (RBAC).
  * Khóa / mở khóa tài khoản người dùng khi phát hiện vi phạm.

---

## SLIDE 11: TỰ ĐỘNG HÓA & BẢO MẬT
### Email Tự Động & Cơ Chế Bảo Vệ Dữ Liệu

* **Hệ thống Email tự động (Nodemailer):**
  * Gửi email biên lai chi tiết ngay khi khách bấm Đặt hàng.
  * Tự động gửi email thông báo lý do khi đơn hàng bị hủy.
  * Chạy bất đồng bộ (Non-blocking): Không làm nghẽn luồng phản hồi API.
* **Bảo mật đa tầng:**
  * **bcryptjs**: Băm mật khẩu một chiều an toàn với 10 Salt Rounds.
  * **JSON Web Token (JWT)**: Xác thực phiên làm việc không trạng thái (hạn 7 ngày).
  * **Role-based Middleware**: Kiểm soát chặt chẽ quyền hạn từng API endpoint.

---

## SLIDE 12: MINH HỌA GIAO DIỆN & DEMO
### Kịch Bản Demo Trực Tiếp Hệ Thống

* **Các màn hình chính trên hệ thống:**
  * Trang chủ & Chi tiết sách (Giao diện khách hàng).
  * Giỏ hàng & Trang thanh toán địa chỉ 3 cấp.
  * Trang quản lý kho & lập phiếu nhập hàng (Giao diện nhân viên).
  * Dashboard báo cáo doanh thu & danh mục sách (Giao diện Admin).
* **3 Bước Demo trực tiếp:**
  * **Bước 1**: Khách hàng chọn sách → Đặt hàng → Nhận email xác nhận tức thì.
  * **Bước 2**: Nhân viên đăng nhập → Duyệt đơn hàng → Lập phiếu nhập kho.
  * **Bước 3**: Admin kiểm tra Dashboard thấy số liệu doanh thu cập nhật tức thì.

---

## SLIDE 13: ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC
### Mức Độ Hoàn Thiện & Chỉ Số Đạt Được

* **100% Tính năng cốt lõi:**
  * Hoàn thành trọn vẹn quy trình mua bán, nhập kho, duyệt đơn và thống kê.
* **25+ REST API Endpoints:**
  * Thiết kế chuẩn RESTful, mã lỗi HTTP chuẩn mực (200, 201, 400, 401, 403, 500).
* **100% An toàn giao tác (ACID):**
  * Không để xảy ra tình trạng âm kho hay sai lệch số liệu tài chính.
* **Giao diện Responsive:**
  * Tương thích mượt mà trên cả máy tính, máy tính bảng và điện thoại.

---

## SLIDE 14: ĐỊNH HƯỚNG PHÁT TRIỂN
### Lộ Trình Mở Rộng Hệ Thống

* **Mở rộng tính năng kinh doanh:**
  * [ ] Tích hợp cổng thanh toán trực tuyến: VNPAY, MoMo, ZaloPay, thẻ Stripe.
  * [ ] Hệ thống Đánh giá & Bình luận sao (Product Reviews).
  * [ ] Tính năng Mã giảm giá (Coupon/Voucher) và tích lũy điểm thưởng.
* **Nâng cấp hạ tầng & Hiệu năng:**
  * [ ] Caching bộ nhớ đệm với **Redis** để giảm tải truy vấn cho Database.
  * [ ] Đóng gói toàn bộ ứng dụng bằng **Docker & Docker Compose**.
  * [ ] Viết bộ kiểm thử tự động (Unit Test / Integration Test) với Jest.

---

## SLIDE 15: KẾT LUẬN & HỎI ĐÁP (Q & A)
### XIN CHÂN THÀNH CẢM ƠN!
**PHẦN HỎI ĐÁP & ĐÓNG GÓP Ý KIẾN (Q & A)**

* Cảm ơn quý Thầy / Cô trong Hội đồng và các bạn đã chú ý theo dõi!
* Rất mong nhận được các ý kiến nhận xét và đóng góp từ quý Thầy / Cô.

* **Sinh viên thực hiện:** [Tên của bạn]
* **Email:** nhatbang1006.179@gmail.com
* **GitHub:** github.com/bangnn106/WebBanSachTrucTuyen
