import fs from 'fs';
import path from 'path';
import sql from 'mssql';
import dotenv from 'dotenv';
import { getPool } from '../config/database';

dotenv.config();

//Mapping: index (1-based) -> ten file moi (khong dau, slug)const danhSachDoiTen: { index: number; tenMoi: string; tenSach: string }[] = [
  { index: 1,  tenMoi: 'dac-nhan-tam.jpg',                    tenSach: 'Đắc Nhân Tâm' },
  { index: 2,  tenMoi: 'nha-gia-kim.jpg',                     tenSach: 'Nhà Giả Kim' },
  { index: 3,  tenMoi: 'tuoi-tre-dang-gia-bao-nhieu.jpg',     tenSach: 'Tuổi Trẻ Đáng Giá Bao Nhiêu' },
  { index: 4,  tenMoi: 'nghi-giau-lam-giau.jpg',              tenSach: 'Nghĩ Giàu Làm Giàu' },
  { index: 5,  tenMoi: 'cha-giau-cha-ngheo.jpg',              tenSach: 'Cha Giàu Cha Nghèo' },
  { index: 6,  tenMoi: 'bi-mat-tu-duy-trieu-phu.jpg',         tenSach: 'Bí Mật Tư Duy Triệu Phú' },
  { index: 7,  tenMoi: 'doc-vi-bat-ky-ai.jpg',                tenSach: 'Đọc Vị Bất Kỳ Ai' },
  { index: 8,  tenMoi: 'suc-manh-cua-thoi-quen.jpg',          tenSach: 'Sức Mạnh Của Thói Quen' },
  { index: 9,  tenMoi: 'khong-diet-khong-sinh-dung-so-hai.jpg', tenSach: 'Không Diệt Không Sinh Đừng Sợ Hãi' },
  { index: 10, tenMoi: 'hoang-tu-be.jpg',                     tenSach: 'Hoàng Tử Bé' },
  { index: 11, tenMoi: 'de-men-phieu-luu-ky.jpg',             tenSach: 'Dế Mèn Phiêu Lưu Ký' },
  { index: 12, tenMoi: 'luoc-su-thoi-gian.jpg',               tenSach: 'Lược Sử Thời Gian' },
  { index: 13, tenMoi: 'sapiens-luoc-su-loai-nguoi.jpg',      tenSach: 'Sapiens: Lược Sử Loài Người' },
  { index: 14, tenMoi: 'clean-code.jpg',                      tenSach: 'Clean Code' },
  { index: 15, tenMoi: 'javascript-the-good-parts.jpg',       tenSach: 'JavaScript: The Good Parts' },
  { index: 16, tenMoi: 'english-grammar-in-use.jpg',          tenSach: 'English Grammar In Use' },
  { index: 17, tenMoi: 'ielts-trainer.jpg',                   tenSach: 'IELTS Trainer' },
  { index: 18, tenMoi: 'tam-ly-hoc-dam-dong.jpg',             tenSach: 'Tâm Lý Học Đám Đông' },
  { index: 19, tenMoi: 'tu-duy-nhanh-va-cham.jpg',            tenSach: 'Tư Duy Nhanh Và Chậm' },
  { index: 20, tenMoi: 'viet-nam-su-luoc.jpg',                tenSach: 'Việt Nam Sử Lược' },
  { index: 21, tenMoi: 'guns-germs-and-steel.jpg',            tenSach: 'Guns, Germs and Steel' },
  { index: 22, tenMoi: 'toan-cao-cap-tap-1.jpg',              tenSach: 'Toán Cao Cấp Tập 1' },
  { index: 23, tenMoi: 'giao-trinh-triet-hoc-mac-lenin.jpg',  tenSach: 'Giáo Trình Triết Học Mác-Lênin' },
];

async function doiTenAnh() {
  try {
    console.log('Bat dau doi ten anh bia sach...\n');
    const pool = await getPool();
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'books');

    let thanhCong = 0;

    for (const item of danhSachDoiTen) {
      const fileCu = path.join(uploadDir, `seed-book-${item.index}.jpg`);
      const fileMoi = path.join(uploadDir, item.tenMoi);
      const duongDanDB = `/uploads/books/${item.tenMoi}`;

      //Buoc 1: Doi ten file      if (fs.existsSync(fileCu)) {
        fs.renameSync(fileCu, fileMoi);
        console.log(`  [File] seed-book-${item.index}.jpg -> ${item.tenMoi}`);
      } else if (fs.existsSync(fileMoi)) {
        console.log(`  [File] ${item.tenMoi} da ton tai, bo qua.`);
      } else {
        console.log(`  [File] Khong tim thay seed-book-${item.index}.jpg, bo qua.`);
        continue;
      }

      //Buoc 2: Cap nhat DB      await pool.request()
        .input('anh_bia_moi', sql.NVarChar(1000), duongDanDB)
        .input('ten_sach', sql.NVarChar(255), item.tenSach)
        .query('UPDATE sach SET anh_bia = @anh_bia_moi WHERE ten_sach = @ten_sach');

      console.log(`  [DB] ${item.tenSach} -> ${duongDanDB}`);
      thanhCong++;
    }

    console.log(`\nHoan tat! Da doi ten ${thanhCong}/${danhSachDoiTen.length} anh.`);
    process.exit(0);
  } catch (error) {
    console.error('Loi:', error);
    process.exit(1);
  }
}

doiTenAnh();
