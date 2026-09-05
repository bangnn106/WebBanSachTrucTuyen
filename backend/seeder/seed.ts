import bcrypt from 'bcryptjs';
import sql from 'mssql';
import dotenv from 'dotenv';
import { getPool } from '../config/database';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Bắt đầu nạp dữ liệu mẫu...\n');
    const pool = await getPool();

    // ===== 1. KIỂM TRA & THÊM VAI TRÒ =====
    const roles = await pool.request()
      .query('SELECT COUNT(*) AS count FROM vai_tro');

    if (roles.recordset[0].count === 0) {
      await pool.request().query(`
        INSERT INTO vai_tro (ten_vai_tro) VALUES
        (N'KHACH_HANG'), (N'NHAN_VIEN'), (N'QUAN_TRI_VIEN')
      `);
      console.log('✅ Đã thêm 3 vai trò.');
    } else {
      console.log('⏭️  Vai trò đã tồn tại, bỏ qua.');
    }

    // ===== 2. TẠO TÀI KHOẢN ADMIN =====
    const adminEmail = 'admin@bookstore.com';
    const existingAdmin = await pool.request()
      .input('email', sql.VarChar(255), adminEmail)
      .query('SELECT id FROM nguoi_dung WHERE email = @email');

    if (existingAdmin.recordset.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const adminRole = await pool.request()
        .query("SELECT id FROM vai_tro WHERE ten_vai_tro = N'QUAN_TRI_VIEN'");

      await pool.request()
        .input('ho_ten', sql.NVarChar(100), 'Quản Trị Viên')
        .input('email', sql.VarChar(255), adminEmail)
        .input('mat_khau', sql.VarChar(255), hashedPassword)
        .input('so_dien_thoai', sql.VarChar(10), '0901234567')
        .input('tinh_thanh', sql.NVarChar(100), 'Hồ Chí Minh')
        .input('quan_huyen', sql.NVarChar(100), 'Quận 1')
        .input('phuong_xa', sql.NVarChar(100), 'Phường Bến Nghé')
        .input('id_vai_tro', sql.Int, adminRole.recordset[0].id)
        .query(`
          INSERT INTO nguoi_dung
          (ho_ten, email, mat_khau, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, id_vai_tro)
          VALUES
          (@ho_ten, @email, @mat_khau, @so_dien_thoai, @tinh_thanh, @quan_huyen, @phuong_xa, @id_vai_tro)
        `);

      // Tạo giỏ hàng cho admin
      const adminUser = await pool.request()
        .input('email2', sql.VarChar(255), adminEmail)
        .query('SELECT id FROM nguoi_dung WHERE email = @email2');
      
      await pool.request()
        .input('id_nguoi_dung', sql.Int, adminUser.recordset[0].id)
        .query('INSERT INTO gio_hang (id_nguoi_dung) VALUES (@id_nguoi_dung)');

      console.log('✅ Đã tạo tài khoản Admin:');
      console.log('   📧 Email: admin@bookstore.com');
      console.log('   🔑 Mật khẩu: Admin@123');
    } else {
      console.log('⏭️  Admin đã tồn tại, bỏ qua.');
    }

    // ===== 3. THÊM THỂ LOẠI SÁCH =====
    const categories = [
      'Văn học', 'Kinh tế', 'Kỹ năng sống', 'Thiếu nhi',
      'Khoa học', 'Công nghệ', 'Ngoại ngữ', 'Tâm lý',
      'Lịch sử', 'Giáo khoa',
    ];

    for (const cat of categories) {
      const exists = await pool.request()
        .input('ten', sql.NVarChar(150), cat)
        .query('SELECT id FROM the_loai_sach WHERE ten_the_loai = @ten');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('ten', sql.NVarChar(150), cat)
          .query('INSERT INTO the_loai_sach (ten_the_loai) VALUES (@ten)');
      }
    }
    console.log(`✅ Đã kiểm tra/thêm ${categories.length} thể loại sách.`);

    // ===== 4. THÊM NHÀ XUẤT BẢN =====
    const publishers = [
      'NXB Kim Đồng', 'NXB Trẻ', 'NXB Tổng hợp TP.HCM',
      'NXB Giáo dục', 'NXB Lao động', 'NXB Hội Nhà văn',
    ];

    for (const pub of publishers) {
      const exists = await pool.request()
        .input('ten', sql.NVarChar(200), pub)
        .query('SELECT id FROM nha_xuat_ban WHERE ten_nxb = @ten');

      if (exists.recordset.length === 0) {
        await pool.request()
          .input('ten', sql.NVarChar(200), pub)
          .query('INSERT INTO nha_xuat_ban (ten_nxb) VALUES (@ten)');
      }
    }
    console.log(`✅ Đã kiểm tra/thêm ${publishers.length} nhà xuất bản.`);

    console.log('\n🎉 Nạp dữ liệu mẫu hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
}

seed();