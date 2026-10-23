USE [master]
GO 
CREATE DATABASE WebBanSach
GO 
ALTER DATABASE WebBanSach
SET AUTO_CLOSE OFF -- Giu cho csdl luon mo -> tranh csdl lien tuc dong mo lai db khi co request moi
GO 
ALTER DATABASE WebBanSach
SET AUTO_SHRINK OFF -- Tat chuc nang tu dong thu nho (shrink) kich thuoc file du lieu va file log. shrink gay pha,m  
GO 
ALTER DATABASE WebBanSach
SET AUTO_UPDATE_STATISTICS ON  -- Tu dong cap nhat so lieu thong ke (statistics)
GO 
ALTER DATABASE WebBanSach
SET TRUSTWORTHY OFF  -- khog cho phep db truy cap tai nguyen nam ngoai pham vi db cua chinh no
GO 
ALTER DATABASE WebBanSach
SET PAGE_VERIFY CHECKSUM  -- Tinh toan va ghi mot ma kiem tra (checksum) vao header cua moi trang du lieu  -> giup phat hien som loi hong vat li
GO
ALTER DATABASE WebBanSach
SET AUTO_CREATE_STATISTICS ON  -- Cho phep tu dong thong ke cac cot rieng le dc su dung trong WHERE hoac JOIN neu cot do chua co thong ke
GO 
ALTER DATABASE WebBanSach
SET AUTO_UPDATE_STATISTICS_ASYNC OFF  -- Cap naht thong ke theo co che dong bo
GO 

USE WebBanSach
GO 

-- table vai tro
    CREATE TABLE vai_tro (
        id_vai_tro INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        ten_vai_tro NVARCHAR(50) UNIQUE NOT NULL
    )
GO

-- table nguoi dung
    CREATE TABLE nguoi_dung (
        id_nguoi_dung INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        ho_ten NVARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mat_khau VARCHAR(255) NOT NULL,
        so_dien_thoai VARCHAR(10) NOT NULL,
        tinh_thanh NVARCHAR(100) NOT NULL,
        quan_huyen NVARCHAR(100) NOT NULL,
        phuong_xa NVARCHAR(100) NOT NULL,
        dia_chi_chi_tiet NVARCHAR(255) NULL,
        id_vai_tro INT NOT NULL,
        CONSTRAINT fk_nguoi_dung_vai_tro FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id_vai_tro)
    )
GO 

-- table the loai
    CREATE TABLE the_loai_sach (
        id_the_loai INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        ten_the_loai NVARCHAR(150) UNIQUE NOT NULL
    )
GO

-- table nha xuat ban
    CREATE TABLE nha_xuat_ban (
        id_nha_xuat_ban INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        ten_nxb NVARCHAR(200) UNIQUE NOT NULL
    )
GO

-- table sach 
-- (bo cot so_luong_da_ban, tinh qua query khi can)
    CREATE TABLE sach (
        id_sach INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        ten_sach NVARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        tac_gia NVARCHAR(255) NOT NULL,
        mo_ta_ngan NVARCHAR(2000) NULL,
        gia_goc DECIMAL(18, 2) NOT NULL,
        gia_ban DECIMAL(18, 2) NOT NULL,
        nam_xuat_ban INT NULL,
        ngon_ngu NVARCHAR(50) NULL,
        anh_bia NVARCHAR(1000) NULL,
        so_luong_ton INT NOT NULL DEFAULT 0,
        trang_thai NVARCHAR(20) NOT NULL DEFAULT N'Hết hàng',
        id_the_loai INT NOT NULL,
        id_nha_xuat_ban INT NOT NULL,
        CONSTRAINT ck_sach_gia_goc CHECK (gia_goc >= 0),
        CONSTRAINT ck_sach_gia_ban CHECK (
            gia_ban >= 0
            AND gia_ban <= gia_goc
        ),
        CONSTRAINT ck_sach_so_luong_ton CHECK (so_luong_ton >= 0),
        CONSTRAINT ck_sach_nam_xuat_ban CHECK (
            nam_xuat_ban IS NULL
            OR nam_xuat_ban BETWEEN 1000 AND 2100
        ),
        CONSTRAINT ck_sach_trang_thai CHECK (
            trang_thai IN (
                N'Còn hàng',
                N'Hết hàng',
                N'Ngừng bán'
            )
        ),
        CONSTRAINT fk_sach_the_loai FOREIGN KEY (id_the_loai) REFERENCES the_loai_sach(id_the_loai),
        CONSTRAINT fk_sach_nha_xuat_ban FOREIGN KEY (id_nha_xuat_ban) REFERENCES nha_xuat_ban(id_nha_xuat_ban)
    )
GO 

-- table gio hang
    CREATE TABLE gio_hang (
        id_gio_hang INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
        id_nguoi_dung INT NOT NULL UNIQUE,
        CONSTRAINT fk_gio_hang_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung)
    )
GO 

-- table chi tiet gio hang 
    CREATE TABLE chi_tiet_gio_hang (
        id_gio_hang INT NOT NULL,
        id_sach INT NOT NULL,
        so_luong INT NOT NULL,
        PRIMARY KEY (id_gio_hang, id_sach),
        CONSTRAINT ck_ctgh_so_luong CHECK (so_luong > 0),
        CONSTRAINT fk_ctgh_gio_hang FOREIGN KEY (id_gio_hang) REFERENCES gio_hang(id_gio_hang) ON DELETE CASCADE,
        CONSTRAINT fk_ctgh_sach FOREIGN KEY (id_sach) REFERENCES sach(id_sach)
    )
GO 

-- table don hang
    CREATE TABLE don_hang (
        ma_don_hang VARCHAR(30) PRIMARY KEY NOT NULL,
        tong_tien DECIMAL(18, 2) NOT NULL,
        ten_nguoi_nhan NVARCHAR(150) NOT NULL,
        so_dien_thoai_nhan VARCHAR(15) NOT NULL,
        dia_chi_giao_hang NVARCHAR(500) NOT NULL,
        ghi_chu NVARCHAR(500) NULL,
        trang_thai_don_hang NVARCHAR(30) NOT NULL DEFAULT N'Chờ xác nhận',
        trang_thai_thanh_toan NVARCHAR(30) NOT NULL DEFAULT N'Chưa thanh toán',
        ngay_dat DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        id_nguoi_dung INT NOT NULL,
        CONSTRAINT ck_don_hang_tong_tien CHECK (tong_tien >= 0),
        CONSTRAINT ck_don_hang_trang_thai_thanh_toan CHECK (
            trang_thai_thanh_toan IN (
                N'Chưa thanh toán',
                N'Đã thanh toán',
                N'Đã hoàn tiền'
            )
        ),
        CONSTRAINT ck_don_hang_trang_thai CHECK (
            trang_thai_don_hang IN (
                N'Chờ xác nhận',
                N'Đang chuẩn bị',
                N'Đang giao',
                N'Đã giao',
                N'Đã hủy'
            )
        ),
        CONSTRAINT fk_don_hang_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung)
    )
GO 

-- table chi tiet don hang 
    CREATE TABLE chi_tiet_don_hang (
        ma_don_hang VARCHAR(30) NOT NULL,
        id_sach INT NOT NULL,
        don_gia DECIMAL(18, 2) NOT NULL,
        so_luong INT NOT NULL,
        thanh_tien AS (
            CONVERT(DECIMAL(18, 2), don_gia * so_luong)
        ) PERSISTED,
        PRIMARY KEY (ma_don_hang, id_sach),
        CONSTRAINT ck_ctdh_don_gia CHECK (don_gia >= 0),
        CONSTRAINT ck_ctdh_so_luong CHECK (so_luong > 0),
        CONSTRAINT fk_ctdh_don_hang FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang),
        CONSTRAINT fk_ctdh_sach FOREIGN KEY (id_sach) REFERENCES sach(id_sach)
    )
GO 

-- table nhap hang sach 
    CREATE TABLE nhap_hang_sach (
        ma_phieu_nhap VARCHAR(30) PRIMARY KEY NOT NULL,
        so_luong INT NOT NULL,
        don_gia_nhap DECIMAL(18, 2) NOT NULL DEFAULT 0,
        tong_tien_nhap AS (
            CONVERT(DECIMAL(18, 2), don_gia_nhap * so_luong)
        ) PERSISTED,
        ghi_chu NVARCHAR(500) NULL,
        ngay_nhap DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        id_sach INT NOT NULL,
        id_nguoi_nhap INT NOT NULL,
        CONSTRAINT ck_nhs_so_luong CHECK (so_luong > 0),
        CONSTRAINT ck_nhs_don_gia CHECK (don_gia_nhap >= 0),
        CONSTRAINT fk_nhs_sach FOREIGN KEY (id_sach) REFERENCES sach(id_sach),
        CONSTRAINT fk_nhs_nguoi_nhap FOREIGN KEY (id_nguoi_nhap) REFERENCES nguoi_dung(id_nguoi_dung)
    )
GO 

-- them cac vai tro
INSERT INTO vai_tro (ten_vai_tro)
VALUES (N'KHACH_HANG'),
    (N'NHAN_VIEN'),
    (N'QUAN_TRI_VIEN')
GO 

-- index (chi muc) ho tro tim kiem va thong ke
CREATE INDEX ix_sach_ten_sach ON sach(ten_sach)
GO 
CREATE INDEX ix_sach_id_the_loai ON sach(id_the_loai)
GO 
CREATE INDEX ix_sach_id_nha_xuat_ban ON sach(id_nha_xuat_ban)
GO 
CREATE INDEX ix_don_hang_nguoi_dung_ngay_dat ON don_hang(id_nguoi_dung, ngay_dat DESC)
GO 
CREATE INDEX ix_don_hang_trang_thai_ngay_dat ON don_hang(trang_thai_don_hang, ngay_dat DESC)
GO 
CREATE INDEX ix_nhap_hang_sach_ngay ON nhap_hang_sach(id_sach, ngay_nhap DESC)
GO 

-- STORED PROCEDURE

-- Dang ky tai khoan khach hang va tao gio hang
CREATE OR ALTER PROCEDURE sp_dang_ky_nguoi_dung 
    @ho_ten NVARCHAR(100),
    @email VARCHAR(255),
    @mat_khau VARCHAR(255),
    @so_dien_thoai VARCHAR(10),
    @tinh_thanh NVARCHAR(100),
    @quan_huyen NVARCHAR(100),
    @phuong_xa NVARCHAR(100),
    @dia_chi_chi_tiet NVARCHAR(255) = NULL 
AS 
BEGIN
SET NOCOUNT ON
SET XACT_ABORT ON 

IF EXISTS (
        SELECT 1
        FROM nguoi_dung
        WHERE email = @email
    ) THROW 50001, N'Email đã tồn tại.',1

DECLARE @id_vai_tro INT
DECLARE @id_nguoi_dung INT

SELECT @id_vai_tro = id_vai_tro
FROM vai_tro
WHERE ten_vai_tro = N'KHACH_HANG' 

IF @id_vai_tro IS NULL THROW 50002, N'Chưa có vai trò KHACH_HANG.', 1 

BEGIN TRY 
BEGIN TRANSACTION
-- them thong tin nguoi dung vao bang nguoi_dung 
INSERT INTO nguoi_dung (
        ho_ten,
        email,
        mat_khau,
        so_dien_thoai,
        tinh_thanh,
        quan_huyen,
        phuong_xa,
        dia_chi_chi_tiet,
        id_vai_tro
    )
VALUES (
        @ho_ten,
        @email,
        @mat_khau,
        @so_dien_thoai,
        @tinh_thanh,
        @quan_huyen,
        @phuong_xa,
        @dia_chi_chi_tiet,
        @id_vai_tro
    )
-- lay id nguoi dung vua sinh tu dong 
SET @id_nguoi_dung = SCOPE_IDENTITY()

-- tu dong tao gio hang gan voi nguoi dung nay
INSERT INTO gio_hang(id_nguoi_dung)
VALUES (@id_nguoi_dung) 

COMMIT TRANSACTION

SELECT @id_nguoi_dung AS id_nguoi_dung,
    N'Đăng ký tài khoản thành công.' AS thong_bao
END TRY 

BEGIN CATCH 
IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION -- kiem tra giao dich dang mo co dang do hay khong, neu co loi ROLLBACK se hoan tac toan bo thao tac da ghi vao database, tra du lieu trang thai sach se
THROW
END CATCH
END
GO 



-- Lay nguoi dung theo email (backend kiem tra dang nhap)
CREATE OR ALTER PROCEDURE sp_lay_nguoi_dung_theo_email 
    @email VARCHAR(255) AS BEGIN
-- tat thong bao so dong tra ve 
SET NOCOUNT ON
-- nd: nguoi dung; vt: vai tro 
SELECT nd.id_nguoi_dung,
    nd.ho_ten,
    nd.email,
    nd.mat_khau,
    nd.so_dien_thoai,
    nd.tinh_thanh,
    nd.quan_huyen,
    nd.phuong_xa,
    nd.dia_chi_chi_tiet,
    vt.id_vai_tro,
    vt.ten_vai_tro
FROM nguoi_dung nd
    JOIN vai_tro vt ON vt.id_vai_tro = nd.id_vai_tro
WHERE nd.email = @email
END
GO 


-- Cap nhat thong tin nguoi dung
CREATE OR ALTER PROCEDURE sp_cap_nhat_nguoi_dung 
    @id_nguoi_dung INT,
    @ho_ten NVARCHAR(100),
    @email VARCHAR(255),
    @so_dien_thoai VARCHAR(10),
    @tinh_thanh NVARCHAR(100),
    @quan_huyen NVARCHAR(100),
    @phuong_xa NVARCHAR(100),
    @dia_chi_chi_tiet NVARCHAR(255) = NULL 
AS BEGIN
SET NOCOUNT ON 
IF NOT EXISTS (
        SELECT 1
        FROM nguoi_dung
        WHERE id_nguoi_dung = @id_nguoi_dung
    ) THROW 50003, N'Người dùng không tồn tại.', 1 
IF EXISTS (
        SELECT 1
        FROM nguoi_dung
        WHERE email = @email
            AND id_nguoi_dung <> @id_nguoi_dung
    ) THROW 50004, N'Email đã tồn tại!',1
UPDATE nguoi_dung
SET ho_ten = @ho_ten,
    email = @email,
    so_dien_thoai = @so_dien_thoai,
    tinh_thanh = @tinh_thanh,
    quan_huyen = @quan_huyen,
    phuong_xa = @phuong_xa,
    dia_chi_chi_tiet = @dia_chi_chi_tiet
WHERE id_nguoi_dung = @id_nguoi_dung

SELECT N'Cập nhật thông tin thành công.' AS thong_bao
END
GO 


-- Lay danh sach nguoi dung co tim kiem va phan trang
CREATE OR ALTER PROCEDURE sp_lay_danh_sach_nguoi_dung 
    @tu_khoa NVARCHAR(255) = NULL,
    @id_vai_tro INT = NULL,
    @trang INT = 1,
    @kich_thuoc_trang INT = 20 
AS BEGIN

SET NOCOUNT ON 
IF @trang < 1
    SET @trang = 1 
IF @kich_thuoc_trang < 1
    SET @kich_thuoc_trang = 20

SELECT 
    nd.id_nguoi_dung,
    nd.ho_ten,
    nd.email,
    nd.so_dien_thoai,
    nd.tinh_thanh,
    nd.quan_huyen,
    nd.phuong_xa,
    nd.dia_chi_chi_tiet,
    vt.ten_vai_tro,
    COUNT(*) OVER() AS tong_ban_ghi  -- tra ve so luong ban ghi thoa man dieu kien loc ma khong can viet cau lenh SELECT COUNT(*) phu 
FROM nguoi_dung nd
    JOIN vai_tro vt ON vt.id_vai_tro = nd.id_vai_tro
WHERE (
        -- Loc 
        @id_vai_tro IS NULL
        OR nd.id_vai_tro = @id_vai_tro
    )

AND (
        -- Tim kiem
        @tu_khoa IS NULL
        OR nd.ho_ten COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR nd.email LIKE '%' + CONVERT(VARCHAR(255), @tu_khoa) + '%'
        OR nd.so_dien_thoai LIKE '%' + CONVERT(VARCHAR(20), @tu_khoa) + '%'
    )

ORDER BY nd.id_nguoi_dung DESC 
OFFSET (@trang - 1) * @kich_thuoc_trang ROWS 
FETCH NEXT @kich_thuoc_trang ROWS ONLY
END
GO


-- Them sach (khong tu dong nhap kho, phai tao phieu nhap rieng)
CREATE OR ALTER PROCEDURE sp_them_sach 
    @ten_sach NVARCHAR(255),
    @isbn VARCHAR(20),
    @tac_gia NVARCHAR(255),
    @mo_ta_ngan NVARCHAR(2000) = NULL,
    @gia_goc DECIMAL(18, 2),
    @gia_ban DECIMAL(18, 2),
    @nam_xuat_ban SMALLINT = NULL,
    @ngon_ngu NVARCHAR(50) = NULL,
    @anh_bia NVARCHAR(1000) = NULL,
    @so_luong_ton INT = 0,
    @id_the_loai INT,
    @id_nha_xuat_ban INT,
    @id_nguoi_thuc_hien INT = NULL 
AS BEGIN
SET NOCOUNT ON
SET XACT_ABORT ON
IF EXISTS (
        SELECT 1 FROM sach WHERE isbn = @isbn
    ) THROW 50010, N'ISBN đã tồn tại.', 1 

IF @gia_goc < 0 OR @gia_ban < 0 OR @gia_ban > @gia_goc 
THROW 50011, N'Giá sách không hợp lệ.',1 

IF @so_luong_ton < 0 
THROW 50012, N'Số lượng tồn không được âm.',1 

IF NOT EXISTS (
        SELECT 1 FROM the_loai_sach WHERE id_the_loai = @id_the_loai
    ) THROW 50013, N'Thể loại sách không tồn tại.', 1 

IF NOT EXISTS (
        SELECT 1 FROM nha_xuat_ban WHERE id_nha_xuat_ban = @id_nha_xuat_ban
    ) THROW 50014, N'Nhà xuất bản không tồn tại.', 1

-- Tu dong tinh toan trang thai sach
DECLARE @id_sach INT
DECLARE @trang_thai NVARCHAR(20)

SET @trang_thai = CASE
        WHEN @so_luong_ton > 0 THEN N'Còn hàng'
        ELSE N'Hết hàng'
    END

INSERT INTO sach (
        ten_sach,
        isbn,
        tac_gia,
        mo_ta_ngan,
        gia_goc,
        gia_ban,
        nam_xuat_ban,
        ngon_ngu,
        anh_bia,
        so_luong_ton,
        trang_thai,
        id_the_loai,
        id_nha_xuat_ban
    )
VALUES (
        @ten_sach,
        @isbn,
        @tac_gia,
        @mo_ta_ngan,
        @gia_goc,
        @gia_ban,
        @nam_xuat_ban,
        @ngon_ngu,
        @anh_bia,
        @so_luong_ton,
        @trang_thai,
        @id_the_loai,
        @id_nha_xuat_ban
    )
SET @id_sach = SCOPE_IDENTITY()

SELECT @id_sach AS id_sach, N'Thêm sách thành công.' AS thong_bao
END
GO 


-- Cap nhat thong tin sach (khong cap nhat ton kho)
CREATE OR ALTER PROCEDURE sp_cap_nhat_sach 
    @id_sach INT,
    @ten_sach NVARCHAR(255),
    @isbn VARCHAR(20),
    @tac_gia NVARCHAR(255),
    @mo_ta_ngan NVARCHAR(2000) = NULL,
    @gia_goc DECIMAL(18, 2),
    @gia_ban DECIMAL(18, 2),
    @nam_xuat_ban SMALLINT = NULL,
    @ngon_ngu NVARCHAR(50) = NULL,
    @anh_bia NVARCHAR(1000) = NULL,
    @id_the_loai INT,
    @id_nha_xuat_ban INT 
AS BEGIN

SET NOCOUNT ON 

IF NOT EXISTS (
        SELECT 1 FROM sach WHERE id_sach = @id_sach
    ) THROW 50015, N'Sách không tồn tại.',1 

IF EXISTS (
        SELECT 1 FROM sach WHERE isbn = @isbn AND id_sach <> @id_sach
    ) THROW 50016, N'ISBN đã được sử dụng cho sách khác.', 1 

IF @gia_goc < 0 OR @gia_ban < 0 OR @gia_ban > @gia_goc 
THROW 50017, N'Giá sách không hợp lệ.', 1 

IF NOT EXISTS (
        SELECT 1 FROM the_loai_sach WHERE id_the_loai = @id_the_loai
    ) THROW 50018, N'Thể loại sách không tồn tại.', 1 

IF NOT EXISTS (
        SELECT 1 FROM nha_xuat_ban WHERE id_nha_xuat_ban = @id_nha_xuat_ban
    ) THROW 50019, N'Nhà xuất bản không tồn tại.', 1


UPDATE sach
SET ten_sach = @ten_sach,
    isbn = @isbn,
    tac_gia = @tac_gia,
    mo_ta_ngan = @mo_ta_ngan,
    gia_goc = @gia_goc,
    gia_ban = @gia_ban,
    nam_xuat_ban = @nam_xuat_ban,
    ngon_ngu = @ngon_ngu,
    anh_bia = ISNULL(@anh_bia, anh_bia),
    id_the_loai = @id_the_loai,
    id_nha_xuat_ban = @id_nha_xuat_ban
WHERE id_sach = @id_sach

SELECT N'Cập nhật sách thành công' AS thong_bao
END
GO


-- Cap nhat trang thai sach
CREATE OR ALTER PROCEDURE sp_cap_nhat_trang_thai_sach 
    @id_sach INT,
    @trang_thai NVARCHAR(20) 
AS BEGIN

SET NOCOUNT ON 

-- Kiem tra trang thai co nam trong danh muc cho phep khong
IF @trang_thai NOT IN (N'Còn hàng', N'Hết hàng', N'Ngừng bán') 
THROW 50020, N'Trạng thái sách không hợp lệ.', 1 

IF NOT EXISTS (
        SELECT 1 FROM sach WHERE id_sach = @id_sach
    ) THROW 50021, N'Sách không tồn tại.', 1 

IF @trang_thai = N'Còn hàng'
AND EXISTS (
        SELECT 1 FROM sach WHERE id_sach = @id_sach AND so_luong_ton = 0
    ) THROW 50022, N'Không thể đặt Còn hàng khi số lượng tồn bằng 0.', 1


UPDATE sach
SET trang_thai = @trang_thai
WHERE id_sach = @id_sach

SELECT N'Cập nhật trạng thái sách thành công.' AS thong_bao
END
GO 


-- Tim kiem, loc, sap xep va phan trang sach (tinh so_luong_da_ban qua query)
CREATE OR ALTER PROCEDURE sp_tim_kiem_sach 
    @tu_khoa NVARCHAR(255) = NULL,
    @id_the_loai INT = NULL,
    @id_nha_xuat_ban INT = NULL,
    @gia_tu DECIMAL(18, 2) = NULL,
    @gia_den DECIMAL(18, 2) = NULL,
    @trang_thai NVARCHAR(20) = NULL,
    @sap_xep VARCHAR(20) = 'MOI_NHAT',
    @trang INT = 1,
    @kich_thuoc_trang INT = 12 
AS BEGIN
SET NOCOUNT ON 
IF @trang < 1
    SET @trang = 1 
IF @kich_thuoc_trang < 1
    SET @kich_thuoc_trang = 12
SELECT 
    s.id_sach,
    s.ten_sach,
    s.isbn,
    s.tac_gia,
    s.mo_ta_ngan,
    s.gia_goc,
    s.gia_ban,
    s.nam_xuat_ban,
    s.ngon_ngu,
    s.anh_bia,
    ISNULL(ban.tong_da_ban, 0) AS so_luong_da_ban,
    s.so_luong_ton,
    s.trang_thai,
    tls.id_the_loai,
    tls.ten_the_loai,
    nxb.id_nha_xuat_ban,
    nxb.ten_nxb,
    COUNT(*) OVER() AS tong_ban_ghi  -- Dem tong so sach thoa dieu kien lap de phan trang 
FROM sach s
    JOIN the_loai_sach tls ON tls.id_the_loai = s.id_the_loai
    JOIN nha_xuat_ban nxb ON nxb.id_nha_xuat_ban = s.id_nha_xuat_ban

    LEFT JOIN (
        SELECT ctdh.id_sach,
            SUM(ctdh.so_luong) AS tong_da_ban
        FROM chi_tiet_don_hang ctdh
            JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
        WHERE dh.trang_thai_don_hang = N'Đã giao'
        GROUP BY ctdh.id_sach
    ) ban ON ban.id_sach = s.id_sach
WHERE (
        @tu_khoa IS NULL
        OR s.ten_sach COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR s.tac_gia COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR s.mo_ta_ngan COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR tls.ten_the_loai COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR s.isbn LIKE '%' + CONVERT(VARCHAR(255), @tu_khoa) + '%'
    )
    AND (
        @id_the_loai IS NULL
        OR s.id_the_loai = @id_the_loai
    )
    AND (
        @id_nha_xuat_ban IS NULL
        OR s.id_nha_xuat_ban = @id_nha_xuat_ban
    )
    AND (
        @gia_tu IS NULL
        OR s.gia_ban >= @gia_tu
    )
    AND (
        @gia_den IS NULL
        OR s.gia_ban <= @gia_den
    )
    AND (
        @trang_thai IS NULL
        OR s.trang_thai = @trang_thai
    )

-- Sap xeo dong va phan trang
ORDER BY CASE
        WHEN @sap_xep = 'GIA_TANG' THEN s.gia_ban
    END ASC,
    CASE
        WHEN @sap_xep = 'GIA_GIAM' THEN s.gia_ban
    END DESC,
    CASE
        WHEN @sap_xep = 'BAN_CHAY' THEN ISNULL(ban.tong_da_ban, 0)
    END DESC, -- Neu khong thoa dieu kien nao thi mac dinh la moi nhat 
    s.id_sach DESC OFFSET (@trang - 1) * @kich_thuoc_trang ROWS FETCH NEXT @kich_thuoc_trang ROWS ONLY
END
GO 


-- Them sach vao gio hang, neu da co thi tang so luong
CREATE OR ALTER PROCEDURE sp_them_sach_vao_gio 
    @id_nguoi_dung INT,
    @id_sach INT,
    @so_luong INT 
AS BEGIN

SET NOCOUNT ON
SET XACT_ABORT ON 

IF @so_luong <= 0 THROW 50030, N'Số lượng phải lớn hơn 0.', 1

DECLARE @id_gio_hang INT
DECLARE @so_luong_ton INT
DECLARE @so_luong_hien_tai INT

SELECT @so_luong_ton = so_luong_ton
FROM sach
WHERE id_sach = @id_sach
    AND trang_thai = N'Còn hàng' 

IF @so_luong_ton IS NULL THROW 50031, N'Sách không tồn tại hoặc không còn bán.', 1 

-- Mo Transaction va dam bao nguoi dung co gio hang 
BEGIN TRY 
BEGIN TRANSACTION
SELECT @id_gio_hang = id_gio_hang
FROM gio_hang
WHERE id_nguoi_dung = @id_nguoi_dung 

IF @id_gio_hang IS NULL 
BEGIN
    INSERT INTO gio_hang(id_nguoi_dung)
    VALUES (@id_nguoi_dung)
    SET @id_gio_hang = SCOPE_IDENTITY()
END

-- Kiem tra vuot qua ton kho 
SELECT @so_luong_hien_tai = so_luong
FROM chi_tiet_gio_hang
WHERE id_gio_hang = @id_gio_hang
    AND id_sach = @id_sach
SET @so_luong_hien_tai = ISNULL(@so_luong_hien_tai, 0) 

IF @so_luong_hien_tai + @so_luong > @so_luong_ton 
THROW 50032, N'Số lượng trong giỏ vượt quá tồn kho.', 1 

-- Thuc hien cong don hoac them moi 
IF @so_luong_hien_tai > 0 
BEGIN
UPDATE chi_tiet_gio_hang
SET so_luong = so_luong + @so_luong
WHERE id_gio_hang = @id_gio_hang
    AND id_sach = @id_sach
END
ELSE 
BEGIN
INSERT INTO chi_tiet_gio_hang (
        id_gio_hang,
        id_sach,
        so_luong
    )
VALUES (
        @id_gio_hang,
        @id_sach,
        @so_luong
    )
END 

COMMIT TRANSACTION
SELECT N'Thêm sách vào giỏ hàng thành công.' AS thong_bao
END TRY 

-- Bat ngoai le va huy giao dich 
BEGIN CATCH 
    IF @@TRANCOUNT > 0 
        ROLLBACK TRANSACTION 
    THROW
END CATCH
END
GO 


-- Cap nhat so luong sach trong gio
CREATE OR ALTER PROCEDURE sp_cap_nhat_so_luong_gio 
    @id_nguoi_dung INT,
    @id_sach INT,
    @so_luong INT 
AS BEGIN

SET NOCOUNT ON 

IF @so_luong <= 0 THROW 50033, N'Số lượng phải lớn hơn 0.', 1

DECLARE @so_luong_ton INT

SELECT @so_luong_ton = so_luong_ton
FROM sach
WHERE id_sach = @id_sach
    AND trang_thai = N'Còn hàng' 

IF @so_luong_ton IS NULL THROW 50034, N'Sách không tồn tại hoặc không còn bán.', 1 
IF @so_luong > @so_luong_ton THROW 50035, N'Số lượng yêu cầu vượt quá tồn kho.', 1

-- cth: chi tiet hang 
UPDATE cth
SET cth.so_luong = @so_luong
FROM chi_tiet_gio_hang cth
    JOIN gio_hang gh ON gh.id_gio_hang = cth.id_gio_hang
WHERE gh.id_nguoi_dung = @id_nguoi_dung
    AND cth.id_sach = @id_sach 

-- Kiem tra ket qua thuc thi (ROWCOUNT kiem tra so dong du lieu bi tac dong)
IF @@ROWCOUNT = 0 THROW 50036, N'Sách không có trong giỏ hàng.', 1
SELECT N'Cập nhật số lượng thành công.' AS thong_bao
END
GO 


-- Xoa mot sach khoi gio hang
CREATE OR ALTER PROCEDURE sp_xoa_sach_khoi_gio 
    @id_nguoi_dung INT,
    @id_sach INT AS BEGIN
SET NOCOUNT ON

    DELETE cth
FROM chi_tiet_gio_hang cth
    JOIN gio_hang gh ON gh.id_gio_hang = cth.id_gio_hang
WHERE gh.id_nguoi_dung = @id_nguoi_dung
    AND cth.id_sach = @id_sach 
IF @@ROWCOUNT = 0 THROW 50037, N'Sách không có trong giỏ hàng.', 1
SELECT N'Xóa sách khỏi giỏ hàng thành công.' AS thong_bao
END
GO


-- Xoa toan bo gio hang
CREATE OR ALTER PROCEDURE sp_xoa_toan_bo_gio_hang 
    @id_nguoi_dung INT 
AS BEGIN

SET NOCOUNT ON

DELETE cth

FROM chi_tiet_gio_hang cth
    JOIN gio_hang gh ON gh.id_gio_hang = cth.id_gio_hang
WHERE gh.id_nguoi_dung = @id_nguoi_dung

SELECT N'Đã xóa toàn bộ giỏ hàng.' AS thong_bao
END
GO 


-- Lay chi tiet gio hang
CREATE OR ALTER PROCEDURE sp_lay_chi_tiet_gio_hang 
    @id_nguoi_dung INT
AS BEGIN

SET NOCOUNT ON

SELECT 
    s.id_sach,
    s.ten_sach,
    s.anh_bia,
    s.gia_ban,
    cth.so_luong,
    s.so_luong_ton,
    s.trang_thai,
    CONVERT(DECIMAL(18, 2), s.gia_ban * cth.so_luong) AS thanh_tien,

    CONVERT (
        DECIMAL(18, 2),
        SUM(s.gia_ban * cth.so_luong) OVER()
    ) AS tong_tien_gio_hang

-- Ket noi ca bang, loc theo nguoi dung va sap xep 
FROM gio_hang gh
    JOIN chi_tiet_gio_hang cth ON cth.id_gio_hang = gh.id_gio_hang
    JOIN sach s ON s.id_sach = cth.id_sach
WHERE gh.id_nguoi_dung = @id_nguoi_dung
ORDER BY cth.id_sach DESC
END
GO 


-- Tao don hang tu gio hang (dung ma_don_hang lam PK)
CREATE OR ALTER PROCEDURE sp_tao_don_hang_tu_gio 
    @id_nguoi_dung INT,
    @ten_nguoi_nhan NVARCHAR(150),
    @so_dien_thoai_nhan VARCHAR(15),
    @dia_chi_giao_hang NVARCHAR(500),
    @ghi_chu NVARCHAR(500) = NULL 
AS BEGIN

SET NOCOUNT ON
SET XACT_ABORT ON

DECLARE @id_gio_hang INT
DECLARE @ma_don_hang VARCHAR(30)
DECLARE @tong_tien DECIMAL(18, 2)


SELECT @id_gio_hang = id_gio_hang
FROM gio_hang
WHERE id_nguoi_dung = @id_nguoi_dung 

IF @id_gio_hang IS NULL 
THROW 50040, N'Không tìm thấy giỏ hàng.', 1 

-- Su dung Bang bien va co che khoa chong tranh chap (UPDLOCK, HOLDLOCK) 
BEGIN TRY 
BEGIN TRANSACTION

-- Bang @du_lieu_gio chup lai trang thai sach trong gio 
DECLARE @du_lieu_gio TABLE (
        id_sach INT PRIMARY KEY,
        don_gia DECIMAL(18, 2),
        so_luong INT,
        ton_truoc INT
    )
INSERT INTO @du_lieu_gio (
        id_sach,
        don_gia,
        so_luong,
        ton_truoc
    )
SELECT s.id_sach,
    s.gia_ban,
    cth.so_luong,
    s.so_luong_ton
FROM chi_tiet_gio_hang cth
    JOIN sach s WITH (UPDLOCK, HOLDLOCK) ON s.id_sach = cth.id_sach  -- Ngan chan hien tuong Race Condition (2 nguoi cung mua 1 cuon sach cuoi tai cung mot tich tac)
                                                                     -- Cac giao dich khac muon sua hoac mua phai cho don hang hoan tat
WHERE cth.id_gio_hang = @id_gio_hang 

IF NOT EXISTS (
        SELECT 1
        FROM @du_lieu_gio
    ) THROW 50041, N'Giỏ hàng đang trống.', 1 
    
IF EXISTS (
        SELECT 1
        FROM @du_lieu_gio dl
            JOIN sach s ON s.id_sach = dl.id_sach
        WHERE s.trang_thai <> N'Còn hàng'
            OR dl.so_luong > dl.ton_truoc
    ) THROW 50042, N'Có sách đã hết hàng, ngừng bán hoặc không đủ số lượng.', 1

-- Tinh tong tien va sinh ma don 
SELECT @tong_tien = SUM(don_gia * so_luong)
FROM @du_lieu_gio
SET @ma_don_hang = CONCAT (
        'DH',
        CONVERT(CHAR(8), GETDATE(), 112),
        UPPER(
            RIGHT(
                REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''),
                8
            )
        )
    )
-- Luu thong tin chinh vao bang don_hang
INSERT INTO don_hang (
        ma_don_hang,
        tong_tien,
        ten_nguoi_nhan,
        so_dien_thoai_nhan,
        dia_chi_giao_hang,
        ghi_chu,
        id_nguoi_dung
    )
VALUES (
        @ma_don_hang,
        @tong_tien,
        @ten_nguoi_nhan,
        @so_dien_thoai_nhan,
        @dia_chi_giao_hang,
        @ghi_chu,
        @id_nguoi_dung
    )

-- Sao chep cac mat hang vao bang chi_tiet_don_hang 
INSERT INTO chi_tiet_don_hang (
        ma_don_hang,
        id_sach,
        don_gia,
        so_luong
    )
SELECT @ma_don_hang,
    id_sach,
    don_gia,
    so_luong
FROM @du_lieu_gio 

-- Tru ton kho truc tiep va tu dong doi trng thai sach neu ve 0 
UPDATE s
SET s.so_luong_ton = s.so_luong_ton - dl.so_luong,
    s.trang_thai = CASE
        WHEN s.so_luong_ton - dl.so_luong = 0 THEN N'Hết hàng'
        ELSE N'Còn hàng'
    END
FROM sach s
    JOIN @du_lieu_gio dl ON dl.id_sach = s.id_sach

-- Xoa sach cac mat hang trong gio sau khi dat hang thanh cong 
DELETE FROM chi_tiet_gio_hang
WHERE id_gio_hang = @id_gio_hang COMMIT TRANSACTION
SELECT @ma_don_hang AS ma_don_hang,
    @tong_tien AS tong_tien,
    N'Tạo đơn hàng thành công.' AS thong_bao
END TRY 
BEGIN CATCH 
IF @@TRANCOUNT > 0 
    ROLLBACK TRANSACTION 
THROW
END CATCH
END
GO 


-- Lay danh sach don hang cho khach hang hoac nhan vien
CREATE OR ALTER PROCEDURE sp_lay_danh_sach_don_hang 
    @id_nguoi_dung INT = NULL,
    @tu_khoa NVARCHAR(255) = NULL,
    @trang_thai NVARCHAR(30) = NULL,
    @tu_ngay DATE = NULL,
    @den_ngay DATE = NULL,
    @trang INT = 1,
    @kich_thuoc_trang INT = 20 
AS BEGIN

SET NOCOUNT ON 
IF @trang < 1
    SET @trang = 1 
IF @kich_thuoc_trang < 1
    SET @kich_thuoc_trang = 20

-- Lay thong tin don hang va dem tong ban ghi voi Count 
SELECT dh.ma_don_hang,
    dh.tong_tien,
    dh.ten_nguoi_nhan,
    dh.so_dien_thoai_nhan,
    dh.dia_chi_giao_hang,
    dh.trang_thai_don_hang,
    dh.trang_thai_thanh_toan,
    dh.ngay_dat,
    nd.id_nguoi_dung,
    nd.ho_ten AS ten_khach_hang,
    COUNT(*) OVER() AS tong_ban_ghi
FROM don_hang dh
    JOIN nguoi_dung nd ON nd.id_nguoi_dung = dh.id_nguoi_dung

WHERE (
        @id_nguoi_dung IS NULL
        OR dh.id_nguoi_dung = @id_nguoi_dung
    )
    AND (
        @trang_thai IS NULL
        OR dh.trang_thai_don_hang = @trang_thai
    )
    -- Xu li khoang ngay voi ky thuat tranh mat du lieu gio 
    AND (
        @tu_ngay IS NULL
        OR dh.ngay_dat >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR dh.ngay_dat < DATEADD(DAY, 1, @den_ngay)
    )
    -- Tim kiem tu khoa va phan trang 
    AND (
        @tu_khoa IS NULL
        OR dh.ma_don_hang LIKE '%' + CONVERT(VARCHAR(255), @tu_khoa) + '%'
        OR dh.ten_nguoi_nhan COLLATE SQL_Latin1_General_CP1_CI_AI LIKE N'%' + @tu_khoa + N'%' COLLATE SQL_Latin1_General_CP1_CI_AI
        OR dh.so_dien_thoai_nhan LIKE '%' + CONVERT(VARCHAR(20), @tu_khoa) + '%'
    )
ORDER BY dh.ngay_dat DESC 
OFFSET (@trang - 1) * @kich_thuoc_trang ROWS 
FETCH NEXT @kich_thuoc_trang ROWS ONLY
END
GO 


-- Lay chi tiet don hang (dung ma_don_hang thay vi id)
CREATE OR ALTER PROCEDURE sp_lay_chi_tiet_don_hang 
    @ma_don_hang VARCHAR(30),
    @id_nguoi_dung INT = NULL 
AS BEGIN

SET NOCOUNT ON 

IF NOT EXISTS (
        SELECT 1
        FROM don_hang
        WHERE ma_don_hang = @ma_don_hang
            AND (
                @id_nguoi_dung IS NULL
                OR id_nguoi_dung = @id_nguoi_dung
            )
    ) THROW 50043, N'Không tìm thấy đơn hàng.', 1 
    
-- 1: thong tin don hang
SELECT dh.ma_don_hang,
    dh.tong_tien,
    dh.ten_nguoi_nhan,
    dh.so_dien_thoai_nhan,
    dh.dia_chi_giao_hang,
    dh.ghi_chu,
    dh.trang_thai_don_hang,
    dh.trang_thai_thanh_toan,
    dh.ngay_dat,
    nd.id_nguoi_dung,
    nd.ho_ten AS ten_khach_hang,
    nd.email
FROM don_hang dh
    JOIN nguoi_dung nd ON nd.id_nguoi_dung = dh.id_nguoi_dung
WHERE dh.ma_don_hang = @ma_don_hang 

-- 2: chi tiet san pham (lay ten_sach tu bang sach qua JOIN)
SELECT ctdh.id_sach,
    s.ten_sach,
    s.anh_bia,
    ctdh.don_gia,
    ctdh.so_luong,
    ctdh.thanh_tien
FROM chi_tiet_don_hang ctdh
    JOIN sach s ON s.id_sach = ctdh.id_sach
WHERE ctdh.ma_don_hang = @ma_don_hang
ORDER BY ctdh.id_sach
END
GO 

-- Cap nhat trang thai don hang theo dung thu tu
CREATE OR ALTER PROCEDURE sp_cap_nhat_trang_thai_don_hang 
    @ma_don_hang VARCHAR(30),
    @trang_thai_moi NVARCHAR(30) 
AS BEGIN

SET NOCOUNT ON
SET XACT_ABORT ON

DECLARE @trang_thai_cu NVARCHAR(30)
SELECT @trang_thai_cu = trang_thai_don_hang
FROM don_hang
WHERE ma_don_hang = @ma_don_hang 

IF @trang_thai_cu IS NULL THROW 50044, N'Đơn hàng không tồn tại.', 1 

-- Kiem soat luong chuyen doi trang thai 
IF NOT (
        (
            @trang_thai_cu = N'Chờ xác nhận'
            AND @trang_thai_moi = N'Đang chuẩn bị'
        )
        OR (
            @trang_thai_cu = N'Đang chuẩn bị'
            AND @trang_thai_moi = N'Đang giao'
        )
        OR (
            @trang_thai_cu = N'Đang giao'
            AND @trang_thai_moi = N'Đã giao'
        )
    ) THROW 50045, N'Không thể chuyển sang trạng thái này.', 1

-- Cap nhat trang thai va tu dong thanh toan 
UPDATE don_hang
SET trang_thai_don_hang = @trang_thai_moi,
    trang_thai_thanh_toan = CASE
        WHEN @trang_thai_moi = N'Đã giao' THEN N'Đã thanh toán'
        ELSE trang_thai_thanh_toan
    END
WHERE ma_don_hang = @ma_don_hang
SELECT N'Cập nhật trạng thái đơn hàng thành công.' AS thong_bao
END
GO 


-- Huy don hang va hoan lai ton kho (truc tiep, khong ghi bang nhat ky)
CREATE OR ALTER PROCEDURE sp_huy_don_hang 
    @ma_don_hang VARCHAR(30),
    @id_nguoi_thuc_hien INT,
    @ly_do NVARCHAR(500) = NULL 

AS BEGIN

SET NOCOUNT ON
SET XACT_ABORT ON

DECLARE @trang_thai_hien_tai NVARCHAR(30)
DECLARE @id_chu_don INT
DECLARE @ten_vai_tro NVARCHAR(50)

-- Kiem tra su ton tai cua don hang va nguoi thuc hien 
SELECT @trang_thai_hien_tai = trang_thai_don_hang,
    @id_chu_don = id_nguoi_dung
FROM don_hang
WHERE ma_don_hang = @ma_don_hang 

IF @trang_thai_hien_tai IS NULL 
THROW 50046, N'Đơn hàng không tồn tại.', 1

SELECT @ten_vai_tro = vt.ten_vai_tro
FROM nguoi_dung nd
    JOIN vai_tro vt ON vt.id_vai_tro = nd.id_vai_tro
WHERE nd.id_nguoi_dung = @id_nguoi_thuc_hien 

IF @ten_vai_tro IS NULL THROW 50047, N'Người thực hiện không tồn tại.', 1 
    
-- Kiem tra quyen va dieu kien trang thai duoc phep huy 
IF @id_nguoi_thuc_hien <> @id_chu_don
    AND @ten_vai_tro NOT IN (N'NHAN_VIEN', N'QUAN_TRI_VIEN') 
    THROW 50048, N'Bạn không có quyền hủy đơn hàng này.', 1 
    
IF @trang_thai_hien_tai NOT IN (N'Chờ xác nhận', N'Đang chuẩn bị') 
    THROW 50049, N'Chỉ có thể hủy đơn đang chờ xác nhận hoặc đang chuẩn bị.', 1 

BEGIN TRY 
BEGIN TRANSACTION 

-- Hoan lai ton kho truc tiep
UPDATE s
SET s.so_luong_ton = s.so_luong_ton + ctdh.so_luong,
    s.trang_thai = CASE
        WHEN s.trang_thai = N'Ngừng bán' THEN N'Ngừng bán'
        ELSE N'Còn hàng'
    END
FROM sach s
    JOIN chi_tiet_don_hang ctdh ON ctdh.id_sach = s.id_sach
WHERE ctdh.ma_don_hang = @ma_don_hang

-- Cap nhat trang thai don hang 
UPDATE don_hang
SET trang_thai_don_hang = N'Đã hủy',
    trang_thai_thanh_toan = CASE
        WHEN trang_thai_thanh_toan = N'Đã thanh toán' THEN N'Đã hoàn tiền'
        ELSE trang_thai_thanh_toan
    END,
    ghi_chu = CASE
        WHEN @ly_do IS NULL THEN ghi_chu
        WHEN ghi_chu IS NULL THEN N'Lý do hủy: ' + @ly_do
        ELSE ghi_chu + N' | Lý do hủy: ' + @ly_do
    END

WHERE ma_don_hang = @ma_don_hang COMMIT TRANSACTION
SELECT N'Hủy đơn hàng và hoàn kho thành công.' AS thong_bao
END TRY 

BEGIN CATCH 
IF @@TRANCOUNT > 0 
    ROLLBACK TRANSACTION 
    THROW
END CATCH
END
GO 

-- Nhap hang sach (tao phieu nhap)
CREATE OR ALTER PROCEDURE sp_nhap_hang_sach 
    @id_sach INT,
    @so_luong INT,
    @don_gia_nhap DECIMAL(18, 2) = 0,
    @id_nguoi_nhap INT,
    @ghi_chu NVARCHAR(500) = NULL 
AS BEGIN

SET NOCOUNT ON
SET XACT_ABORT ON 

IF @so_luong <= 0 
    THROW 50060, N'Số lượng nhập phải lớn hơn 0.', 1 
    
-- Kiem tra quyen 
IF NOT EXISTS (
        SELECT 1
        FROM nguoi_dung nd
            JOIN vai_tro vt ON vt.id_vai_tro = nd.id_vai_tro
        WHERE nd.id_nguoi_dung = @id_nguoi_nhap
            AND vt.ten_vai_tro IN (N'NHAN_VIEN', N'QUAN_TRI_VIEN')
    ) THROW 50061, N'Người dùng không có quyền nhập hàng.', 1 
    
BEGIN TRY 
BEGIN TRANSACTION
DECLARE @trang_thai_cu NVARCHAR(20)
DECLARE @ma_phieu_nhap VARCHAR(30)

-- Khoa du lieu va kiem tra trang thai ton tai 
SELECT @trang_thai_cu = trang_thai
FROM sach WITH (UPDLOCK, HOLDLOCK)
WHERE id_sach = @id_sach IF @trang_thai_cu IS NULL 
THROW 50062, N'Sách không tồn tại.', 1 

-- Tao ma phieu nhap
SET @ma_phieu_nhap = CONCAT (
        'PN', -- PN: phieu nhap
        CONVERT(CHAR(8), GETDATE(), 112),
        UPPER(
            RIGHT(
                REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 8
            )
        )
    ) 
-- Tang ton kho
UPDATE sach
SET so_luong_ton = so_luong_ton + @so_luong,
    trang_thai = CASE
        WHEN @trang_thai_cu = N'Ngừng bán' THEN N'Ngừng bán'
        ELSE N'Còn hàng'
    END
WHERE id_sach = @id_sach 

-- Ghi phieu nhap
INSERT INTO nhap_hang_sach (
        ma_phieu_nhap,
        so_luong,
        don_gia_nhap,
        ghi_chu,
        id_sach,
        id_nguoi_nhap
    )
VALUES (
        @ma_phieu_nhap,
        @so_luong,
        @don_gia_nhap,
        ISNULL(@ghi_chu, N'Nhập hàng sách'),
        @id_sach,
        @id_nguoi_nhap
    ) COMMIT TRANSACTION
SELECT @ma_phieu_nhap AS ma_phieu_nhap,
    N'Nhập hàng thành công.' AS thong_bao
END TRY
BEGIN CATCH 
IF @@TRANCOUNT > 0 
    ROLLBACK TRANSACTION 
THROW
END CATCH
END
GO 

-- Lay danh sach phieu nhap hang
CREATE OR ALTER PROCEDURE sp_lay_danh_sach_nhap_hang 
    @id_sach INT = NULL,
    @tu_ngay DATE = NULL,
    @den_ngay DATE = NULL,
    @trang INT = 1,
    @kich_thuoc_trang INT = 30 
AS BEGIN

SET NOCOUNT ON 

IF @trang < 1
    SET @trang = 1 
IF @kich_thuoc_trang < 1
    SET @kich_thuoc_trang = 30

-- Lay thong tin phieu nhap kem tong so dong 
SELECT nhs.ma_phieu_nhap,
    nhs.so_luong,
    nhs.don_gia_nhap,
    nhs.tong_tien_nhap,
    nhs.ghi_chu,
    nhs.ngay_nhap,
    s.id_sach,
    s.ten_sach,
    nd.ho_ten AS nguoi_nhap,
    COUNT(*) OVER() AS tong_ban_ghi
FROM nhap_hang_sach nhs
    JOIN sach s ON s.id_sach = nhs.id_sach
    JOIN nguoi_dung nd ON nd.id_nguoi_dung = nhs.id_nguoi_nhap
-- Bo loc theo ma sach va thoi gian 
WHERE (
        @id_sach IS NULL
        OR nhs.id_sach = @id_sach
    )
    AND (
        @tu_ngay IS NULL
        OR nhs.ngay_nhap >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR nhs.ngay_nhap < DATEADD(DAY, 1, @den_ngay)
    )
-- Sap xep va phan trang du lieu 
ORDER BY nhs.ngay_nhap DESC 
OFFSET (@trang - 1) * @kich_thuoc_trang ROWS 
FETCH NEXT @kich_thuoc_trang ROWS ONLY
END
GO 


-- Tong quan (tinh so_luong_da_ban qua query)
CREATE OR ALTER PROCEDURE sp_dashboard_tong_quan 
    @tu_ngay DATE = NULL,
    @den_ngay DATE = NULL 
AS BEGIN

SET NOCOUNT ON

-- Thong ke doanh thu va phan loai so luong don hang 
SELECT ISNULL (
        SUM (
            CASE
                WHEN dh.trang_thai_don_hang = N'Đã giao' THEN dh.tong_tien
                ELSE 0
            END
        ),
        0
    ) AS tong_doanh_thu,
    COUNT(dh.ma_don_hang) AS tong_don_hang,
    ISNULL(
        SUM(
            CASE
                WHEN dh.trang_thai_don_hang = N'Đã giao' THEN 1
                ELSE 0
            END
        ),
        0
    ) AS don_da_giao,
    ISNULL(
        SUM(
            CASE
                WHEN dh.trang_thai_don_hang = N'Đã hủy' THEN 1
                ELSE 0
            END
        ),
        0
    ) AS don_da_huy,

-- Cac chi so tong quan 
    (
        SELECT COUNT(*)
        FROM nguoi_dung nd
            JOIN vai_tro vt ON vt.id_vai_tro = nd.id_vai_tro
        WHERE vt.ten_vai_tro = N'KHACH_HANG'
    ) AS tong_khach_hang,
    (
        SELECT COUNT(*)
        FROM sach
    ) AS tong_dau_sach,
    (
        SELECT ISNULL(SUM(so_luong_ton), 0)
        FROM sach
    ) AS tong_sach_ton,
    (
        SELECT ISNULL(SUM(ctdh.so_luong), 0)
        FROM chi_tiet_don_hang ctdh
            JOIN don_hang dh2 ON dh2.ma_don_hang = ctdh.ma_don_hang
        WHERE dh2.trang_thai_don_hang = N'Đã giao'
    ) AS tong_sach_da_ban
-- Loc ngay chinh xac 
FROM don_hang dh
WHERE (
        @tu_ngay IS NULL
        OR dh.ngay_dat >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR dh.ngay_dat < DATEADD(DAY, 1, @den_ngay)
    )
END
GO 


-- Thong ke doanh thu theo ngay hoac theo thang
CREATE OR ALTER PROCEDURE sp_thong_ke_doanh_thu 
    @tu_ngay DATE = NULL,
    @den_ngay DATE = NULL,
    @kieu_thong_ke NVARCHAR(10) = N'NGAY' 
AS BEGIN

SET NOCOUNT ON 

-- Thong ke gom nhom theo thang 
IF @kieu_thong_ke = N'THANG' 
BEGIN
SELECT YEAR(ngay_dat) AS nam,
    MONTH(ngay_dat) AS thang,
    COUNT(*) AS so_don_da_giao,
    SUM(tong_tien) AS doanh_thu
FROM don_hang
WHERE trang_thai_don_hang = N'Đã giao'
    AND (
        @tu_ngay IS NULL
        OR ngay_dat >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR ngay_dat < DATEADD(DAY, 1, @den_ngay)
    )
GROUP BY YEAR(ngay_dat),
    MONTH(ngay_dat)
ORDER BY nam,
    thang
END
ELSE 

-- Thong ke gom nhom theo ngay 
BEGIN
SELECT CAST(ngay_dat AS DATE) AS ngay,
    COUNT(*) AS so_don_da_giao,
    SUM(tong_tien) AS doanh_thu
FROM don_hang
WHERE trang_thai_don_hang = N'Đã giao'
    AND (
        @tu_ngay IS NULL
        OR ngay_dat >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR ngay_dat < DATEADD(DAY, 1, @den_ngay)
    )
GROUP BY CAST(ngay_dat AS DATE)
ORDER BY ngay
END
END
GO 


-- Thong ke sach ban chay (tinh so_luong_da_ban qua query)
CREATE OR ALTER PROCEDURE sp_top_sach_ban_chay 
    @so_luong_top INT = 10 
    
AS BEGIN

SET NOCOUNT ON 

IF @so_luong_top < 1
    SET @so_luong_top = 10

SELECT TOP (@so_luong_top) 
    s.id_sach,
    s.ten_sach,
    s.tac_gia,
    s.gia_goc,
    s.gia_ban,
    s.anh_bia,
    s.so_luong_ton,
    s.trang_thai,
    SUM(ctdh.so_luong) AS tong_so_luong_ban,
    SUM(ctdh.thanh_tien) AS tong_doanh_thu

-- Ket noi cac bang, loc don hop le va gom nhom 
FROM chi_tiet_don_hang ctdh
    JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
    JOIN sach s ON s.id_sach = ctdh.id_sach
WHERE dh.trang_thai_don_hang = N'Đã giao'
    AND s.trang_thai <> N'Ngừng bán'
GROUP BY s.id_sach,
    s.ten_sach,
    s.tac_gia,
    s.gia_goc,
    s.gia_ban,
    s.anh_bia,
    s.so_luong_ton,
    s.trang_thai

-- Sap xep theo thu bac ban chay 
ORDER BY tong_so_luong_ban DESC,
    tong_doanh_thu DESC
END
GO 

-- Thong ke don hang theo trang thai
CREATE OR ALTER PROCEDURE sp_thong_ke_don_hang_theo_trang_thai 
    @tu_ngay DATE = NULL,
    @den_ngay DATE = NULL 
AS BEGIN

SET NOCOUNT ON

--Tinh tong so luong don hang va tong gia tri theo trang thai 
SELECT trang_thai_don_hang,
    COUNT(*) AS so_luong_don,
    ISNULL(SUM(tong_tien), 0) AS tong_gia_tri
FROM don_hang

-- Loc theo thoi gian va gom nhom du lieu 
WHERE (
        @tu_ngay IS NULL
        OR ngay_dat >= @tu_ngay
    )
    AND (
        @den_ngay IS NULL
        OR ngay_dat < DATEADD(DAY, 1, @den_ngay)
    )
GROUP BY trang_thai_don_hang

-- Sap xep theo dung quy trinh van hanh 
ORDER BY CASE -- Neu chi dung order thong thuong thi se mac dinh sap xep a-z 
        trang_thai_don_hang
        WHEN N'Chờ xác nhận' THEN 1
        WHEN N'Đang chuẩn bị' THEN 2
        WHEN N'Đang giao' THEN 3
        WHEN N'Đã giao' THEN 4
        WHEN N'Đã hủy' THEN 5
        ELSE 6
    END
END
GO