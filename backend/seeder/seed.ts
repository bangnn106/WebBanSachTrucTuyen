import bcrypt from 'bcryptjs';
import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { getPool } from '../config/database';

dotenv.config();

//HAM TAI ANH TU URL VE THU MUC UPLOADSfunction taiAnh(url: string, tenFile: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'books');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, tenFile);

    //Neu file a ton tai, bo qua    if (fs.existsSync(filePath)) {
      resolve(`/uploads/books/${tenFile}`);
      return;
    }

    const client = url.startsWith('https') ? https : http;
    const request = (reqUrl: string) => {
      client.get(reqUrl, (res) => {
        //Xu ly redirect (301, 302)        if (res.statusCode && [301, 302].includes(res.statusCode) && res.headers.location) {
          request(res.headers.location);
          return;
        }
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(`/uploads/books/${tenFile}`);
        });
        fileStream.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

//DANH SACH SACH MAUconst danhSachSach = [
  //Van hoc  { ten: 'Đắc Nhân Tâm', tac_gia: 'Dale Carnegie', gia_goc: 108000, gia_ban: 86000, the_loai: 'Văn học', nxb: 'NXB Tổng hợp TP.HCM', isbn: '978-604-0-01', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Cuốn sách nổi tiếng nhất mọi thời đại về nghệ thuật đối nhân xử thế, được hàng triệu người trên thế giới yêu thích.' },
  { ten: 'Nhà Giả Kim', tac_gia: 'Paulo Coelho', gia_goc: 79000, gia_ban: 63000, the_loai: 'Văn học', nxb: 'NXB Hội Nhà văn', isbn: '978-604-0-02', nam: 2019, ngon_ngu: 'Tiếng Việt', mo_ta: 'Câu chuyện theo chân Santiago, một cậu bé chăn cừu Andalusia trong chuyến phiêu lưu đi tìm kho báu.' },
  { ten: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', tac_gia: 'Rosie Nguyễn', gia_goc: 95000, gia_ban: 95000, the_loai: 'Văn học', nxb: 'NXB Hội Nhà văn', isbn: '978-604-0-03', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Cuốn sách dành cho những người trẻ muốn tìm ra con đường riêng cho mình.' },

  //Kinh te  { ten: 'Nghĩ Giàu Làm Giàu', tac_gia: 'Napoleon Hill', gia_goc: 120000, gia_ban: 96000, the_loai: 'Kinh tế', nxb: 'NXB Tổng hợp TP.HCM', isbn: '978-604-0-04', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Cuốn sách kinh điển về tư duy làm giàu, truyền cảm hứng cho hàng triệu doanh nhân.' },
  { ten: 'Cha Giàu Cha Nghèo', tac_gia: 'Robert Kiyosaki', gia_goc: 130000, gia_ban: 110000, the_loai: 'Kinh tế', nxb: 'NXB Trẻ', isbn: '978-604-0-05', nam: 2019, ngon_ngu: 'Tiếng Việt', mo_ta: 'Bài học về tài chính cá nhân và đầu tư thông qua câu chuyện hai người cha.' },
  { ten: 'Bí Mật Tư Duy Triệu Phú', tac_gia: 'T. Harv Eker', gia_goc: 99000, gia_ban: 79000, the_loai: 'Kinh tế', nxb: 'NXB Trẻ', isbn: '978-604-0-06', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Làm chủ cuộc chơi tiền bạc với tư duy đúng đắn.' },

  //Ky nang song  { ten: 'Đọc Vị Bất Kỳ Ai', tac_gia: 'David J. Lieberman', gia_goc: 89000, gia_ban: 71000, the_loai: 'Kỹ năng sống', nxb: 'NXB Lao động', isbn: '978-604-0-07', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Phương pháp đọc hiểu tâm lý và hành vi của người khác.' },
  { ten: 'Sức Mạnh Của Thói Quen', tac_gia: 'Charles Duhigg', gia_goc: 115000, gia_ban: 92000, the_loai: 'Kỹ năng sống', nxb: 'NXB Lao động', isbn: '978-604-0-08', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Hiểu về khoa học đằng sau thói quen để thay đổi cuộc sống.' },
  { ten: 'Không Diệt Không Sinh Đừng Sợ Hãi', tac_gia: 'Thích Nhất Hạnh', gia_goc: 85000, gia_ban: 85000, the_loai: 'Kỹ năng sống', nxb: 'NXB Hội Nhà văn', isbn: '978-604-0-09', nam: 2018, ngon_ngu: 'Tiếng Việt', mo_ta: 'Thiền sư Thích Nhất Hạnh chia sẻ cách nhìn sâu sắc về sống và chết.' },

  //Thieu nhi  { ten: 'Hoàng Tử Bé', tac_gia: 'Antoine de Saint-Exupéry', gia_goc: 65000, gia_ban: 52000, the_loai: 'Thiếu nhi', nxb: 'NXB Kim Đồng', isbn: '978-604-0-10', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Câu chuyện triết lý nhẹ nhàng về tình bạn và tình yêu, dành cho mọi lứa tuổi.' },
  { ten: 'Dế Mèn Phiêu Lưu Ký', tac_gia: 'Tô Hoài', gia_goc: 55000, gia_ban: 55000, the_loai: 'Thiếu nhi', nxb: 'NXB Kim Đồng', isbn: '978-604-0-11', nam: 2019, ngon_ngu: 'Tiếng Việt', mo_ta: 'Tác phẩm văn học thiếu nhi kinh điển Việt Nam về hành trình của chú Dế Mèn.' },

  //Khoa hoc  { ten: 'Lược Sử Thời Gian', tac_gia: 'Stephen Hawking', gia_goc: 135000, gia_ban: 108000, the_loai: 'Khoa học', nxb: 'NXB Trẻ', isbn: '978-604-0-12', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Cuốn sách phổ biến khoa học nổi tiếng nhất, giải thích vũ trụ cho người đọc phổ thông.' },
  { ten: 'Sapiens: Lược Sử Loài Người', tac_gia: 'Yuval Noah Harari', gia_goc: 199000, gia_ban: 159000, the_loai: 'Khoa học', nxb: 'NXB Tổng hợp TP.HCM', isbn: '978-604-0-13', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Hành trình từ loài vượn không đáng kể đến chủ nhân của thế giới.' },

  //Cong nghe  { ten: 'Clean Code', tac_gia: 'Robert C. Martin', gia_goc: 250000, gia_ban: 200000, the_loai: 'Công nghệ', nxb: 'NXB Lao động', isbn: '978-604-0-14', nam: 2020, ngon_ngu: 'Tiếng Anh', mo_ta: 'Cẩm nang về cách viết code sạch, dễ đọc và dễ bảo trì cho lập trình viên.' },
  { ten: 'JavaScript: The Good Parts', tac_gia: 'Douglas Crockford', gia_goc: 180000, gia_ban: 180000, the_loai: 'Công nghệ', nxb: 'NXB Lao động', isbn: '978-604-0-15', nam: 2019, ngon_ngu: 'Tiếng Anh', mo_ta: 'Khám phá những phần hay nhất của ngôn ngữ JavaScript.' },

  //Ngoai ngu  { ten: 'English Grammar In Use', tac_gia: 'Raymond Murphy', gia_goc: 160000, gia_ban: 128000, the_loai: 'Ngoại ngữ', nxb: 'NXB Giáo dục', isbn: '978-604-0-16', nam: 2021, ngon_ngu: 'Tiếng Anh', mo_ta: 'Sách ngữ pháp tiếng Anh bán chạy nhất thế giới, phù hợp tự học.' },
  { ten: 'IELTS Trainer', tac_gia: 'Cambridge', gia_goc: 220000, gia_ban: 176000, the_loai: 'Ngoại ngữ', nxb: 'NXB Giáo dục', isbn: '978-604-0-17', nam: 2022, ngon_ngu: 'Tiếng Anh', mo_ta: '6 bài test thực hành IELTS với hướng dẫn chi tiết.' },

  //Tam ly  { ten: 'Tâm Lý Học Đám Đông', tac_gia: 'Gustave Le Bon', gia_goc: 75000, gia_ban: 60000, the_loai: 'Tâm lý', nxb: 'NXB Hội Nhà văn', isbn: '978-604-0-18', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Tác phẩm kinh điển nghiên cứu về hành vi và tâm lý đám đông.' },
  { ten: 'Tư Duy Nhanh Và Chậm', tac_gia: 'Daniel Kahneman', gia_goc: 189000, gia_ban: 151000, the_loai: 'Tâm lý', nxb: 'NXB Trẻ', isbn: '978-604-0-19', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Hai hệ thống tư duy chi phối mọi quyết định của con người.' },

  //Lich su  { ten: 'Việt Nam Sử Lược', tac_gia: 'Trần Trọng Kim', gia_goc: 150000, gia_ban: 120000, the_loai: 'Lịch sử', nxb: 'NXB Tổng hợp TP.HCM', isbn: '978-604-0-20', nam: 2019, ngon_ngu: 'Tiếng Việt', mo_ta: 'Bộ sử Việt Nam được viết bằng chữ quốc ngữ đầu tiên, tổng hợp lịch sử dân tộc.' },
  { ten: 'Guns, Germs and Steel', tac_gia: 'Jared Diamond', gia_goc: 210000, gia_ban: 168000, the_loai: 'Lịch sử', nxb: 'NXB Trẻ', isbn: '978-604-0-21', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Lý giải vì sao một số nền văn minh phát triển vượt trội so với những nền khác.' },

  //Giao khoa  { ten: 'Toán Cao Cấp Tập 1', tac_gia: 'Nguyễn Đình Trí', gia_goc: 85000, gia_ban: 85000, the_loai: 'Giáo khoa', nxb: 'NXB Giáo dục', isbn: '978-604-0-22', nam: 2020, ngon_ngu: 'Tiếng Việt', mo_ta: 'Giáo trình toán cao cấp dành cho sinh viên đại học khối kỹ thuật.' },
  { ten: 'Giáo Trình Triết Học Mác-Lênin', tac_gia: 'Bộ GD&ĐT', gia_goc: 68000, gia_ban: 68000, the_loai: 'Giáo khoa', nxb: 'NXB Giáo dục', isbn: '978-604-0-23', nam: 2021, ngon_ngu: 'Tiếng Việt', mo_ta: 'Giáo trình chính thức dành cho sinh viên các trường đại học và cao đẳng.' },
];

async function seed() {
  try {
    console.log('🌱 Bắt đầu nạp dữ liệu mẫu...\n');
    const pool = await getPool();

    //1. KIEM TRA & THEM VAI TRO    const roles = await pool.request()
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

    //2. TAO TAI KHOAN ADMIN    const adminEmail = 'admin@bookstore.com';
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

      //Tao gio hang cho admin      const adminUser = await pool.request()
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

    //3. TAO TAI KHOAN NHAN VIEN    const staffEmail = 'nhanvien@bookstore.com';
    const existingStaff = await pool.request()
      .input('email', sql.VarChar(255), staffEmail)
      .query('SELECT id FROM nguoi_dung WHERE email = @email');

    if (existingStaff.recordset.length === 0) {
      const hashedPassword = await bcrypt.hash('Staff@123', 10);

      const staffRole = await pool.request()
        .query("SELECT id FROM vai_tro WHERE ten_vai_tro = N'NHAN_VIEN'");

      await pool.request()
        .input('ho_ten', sql.NVarChar(100), 'Nhân Viên')
        .input('email', sql.VarChar(255), staffEmail)
        .input('mat_khau', sql.VarChar(255), hashedPassword)
        .input('so_dien_thoai', sql.VarChar(10), '0907654321')
        .input('tinh_thanh', sql.NVarChar(100), 'Hồ Chí Minh')
        .input('quan_huyen', sql.NVarChar(100), 'Quận 3')
        .input('phuong_xa', sql.NVarChar(100), 'Phường 1')
        .input('id_vai_tro', sql.Int, staffRole.recordset[0].id)
        .query(`
          INSERT INTO nguoi_dung
          (ho_ten, email, mat_khau, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, id_vai_tro)
          VALUES
          (@ho_ten, @email, @mat_khau, @so_dien_thoai, @tinh_thanh, @quan_huyen, @phuong_xa, @id_vai_tro)
        `);

      //Tao gio hang cho nhan vien      const staffUser = await pool.request()
        .input('email2', sql.VarChar(255), staffEmail)
        .query('SELECT id FROM nguoi_dung WHERE email = @email2');
      
      await pool.request()
        .input('id_nguoi_dung', sql.Int, staffUser.recordset[0].id)
        .query('INSERT INTO gio_hang (id_nguoi_dung) VALUES (@id_nguoi_dung)');

      console.log('✅ Đã tạo tài khoản Nhân viên:');
      console.log('   📧 Email: nhanvien@bookstore.com');
      console.log('   🔑 Mật khẩu: Staff@123');
    } else {
      console.log('⏭️  Nhân viên đã tồn tại, bỏ qua.');
    }

    //4. THEM THE LOAI SACH    const categories = [
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

    //5. THEM NHA XUAT BAN    const publishers = [
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

    //6. THEM SACH MAU + ANH BIA    const sachCount = await pool.request()
      .query('SELECT COUNT(*) AS count FROM sach');

    if (sachCount.recordset[0].count > 0) {
      console.log(`⏭️  Đã có ${sachCount.recordset[0].count} sách trong DB, bỏ qua.`);
    } else {
      console.log('📖 Đang tải ảnh bìa và thêm sách...');

      //Lay ID the loai & nha xuat ban      const theLoaiResult = await pool.request()
        .query('SELECT id, ten_the_loai FROM the_loai_sach');
      const nxbResult = await pool.request()
        .query('SELECT id, ten_nxb FROM nha_xuat_ban');

      const theLoaiMap: Record<string, number> = {};
      theLoaiResult.recordset.forEach((r: any) => { theLoaiMap[r.ten_the_loai] = r.id; });

      const nxbMap: Record<string, number> = {};
      nxbResult.recordset.forEach((r: any) => { nxbMap[r.ten_nxb] = r.id; });

      //Lay ID admin e ghi nhan nguoi tao      const adminUser = await pool.request()
        .input('email', sql.VarChar(255), 'admin@bookstore.com')
        .query('SELECT id FROM nguoi_dung WHERE email = @email');
      const idAdmin = adminUser.recordset[0]?.id || 1;

      let demThanhCong = 0;

      for (let i = 0; i < danhSachSach.length; i++) {
        const sach = danhSachSach[i];

        try {
          //Tai anh bia placeholder (moi cuon co seed khac nhau e anh khac nhau)          const tenFileAnh = `seed-book-${i + 1}.jpg`;
          const anhUrl = `https://picsum.photos/seed/book${i + 1}/400/600`;
          let anhBia: string;

          try {
            anhBia = await taiAnh(anhUrl, tenFileAnh);
            console.log(`   📸 Đã tải ảnh: ${tenFileAnh}`);
          } catch {
            //Neu khong tai uoc anh, van them sach voi anh null            anhBia = '';
            console.log(`   ⚠️  Không tải được ảnh cho "${sach.ten}", sách vẫn được thêm.`);
          }

          const idTheLoai = theLoaiMap[sach.the_loai];
          const idNxb = nxbMap[sach.nxb];

          if (!idTheLoai || !idNxb) {
            console.log(`   ⚠️  Bỏ qua "${sach.ten}" — không tìm thấy thể loại hoặc NXB.`);
            continue;
          }

          //Them sach bang INSERT truc tiep (khong can stored procedure)          await pool.request()
            .input('ten_sach', sql.NVarChar(255), sach.ten)
            .input('isbn', sql.VarChar(20), sach.isbn)
            .input('tac_gia', sql.NVarChar(255), sach.tac_gia)
            .input('mo_ta_ngan', sql.NVarChar(2000), sach.mo_ta)
            .input('gia_goc', sql.Decimal(18, 2), sach.gia_goc)
            .input('gia_ban', sql.Decimal(18, 2), sach.gia_ban)
            .input('nam_xuat_ban', sql.SmallInt, sach.nam)
            .input('ngon_ngu', sql.NVarChar(50), sach.ngon_ngu)
            .input('anh_bia', sql.NVarChar(1000), anhBia || null)
            .input('so_luong_ton', sql.Int, Math.floor(Math.random() * 80) + 20) //20-100 cuon            .input('id_the_loai', sql.Int, idTheLoai)
            .input('id_nha_xuat_ban', sql.Int, idNxb)
            .input('trang_thai', sql.NVarChar(20), 'Còn hàng')
            .query(`
              INSERT INTO sach
              (ten_sach, isbn, tac_gia, mo_ta_ngan, gia_goc, gia_ban, nam_xuat_ban, ngon_ngu, anh_bia, so_luong_ton, id_the_loai, id_nha_xuat_ban, trang_thai)
              VALUES
              (@ten_sach, @isbn, @tac_gia, @mo_ta_ngan, @gia_goc, @gia_ban, @nam_xuat_ban, @ngon_ngu, @anh_bia, @so_luong_ton, @id_the_loai, @id_nha_xuat_ban, @trang_thai)
            `);

          demThanhCong++;
          console.log(`   ✅ [${demThanhCong}/${danhSachSach.length}] ${sach.ten}`);
        } catch (err: any) {
          console.log(`   ❌ Lỗi thêm "${sach.ten}": ${err.message}`);
        }
      }

      console.log(`\n📚 Đã thêm ${demThanhCong}/${danhSachSach.length} cuốn sách mẫu.`);
    }

    console.log('\n🎉 Nạp dữ liệu mẫu hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
}

seed();