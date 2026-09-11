import sql from 'mssql';
import bcrypt from 'bcryptjs';
import { executeProcedure, getPool } from '../config/database';
import { CapNhatNguoiDungDTO } from '../models/user.model';

// CAP NHAT THONG TIN NGUOI DUNG
export async function capNhatNguoiDung(
  idNguoiDung: number,
  data: CapNhatNguoiDungDTO
) {
  const result = await executeProcedure('sp_cap_nhat_nguoi_dung', [
    { name: 'id_nguoi_dung',    type: sql.Int,           value: idNguoiDung },
    { name: 'ho_ten',           type: sql.NVarChar(100), value: data.ho_ten },
    { name: 'email',            type: sql.VarChar(255),  value: data.email },
    { name: 'so_dien_thoai',    type: sql.VarChar(10),   value: data.so_dien_thoai },
    { name: 'tinh_thanh',       type: sql.NVarChar(100), value: data.tinh_thanh },
    { name: 'quan_huyen',       type: sql.NVarChar(100), value: data.quan_huyen },
    { name: 'phuong_xa',        type: sql.NVarChar(100), value: data.phuong_xa },
    { name: 'dia_chi_chi_tiet', type: sql.NVarChar(255), value: data.dia_chi_chi_tiet || null },
  ]);

  return result.recordset[0]; // { thong_bao }
}

// LAY DANH SACH NGUOI DUNG (Admin)
export async function layDanhSachNguoiDung(
  tuKhoa?: string,
  idVaiTro?: number,
  trang: number = 1,
  kichThuocTrang: number = 20
) {
  const result = await executeProcedure('sp_lay_danh_sach_nguoi_dung', [
    { name: 'tu_khoa',          type: sql.NVarChar(255), value: tuKhoa || null },
    { name: 'id_vai_tro',       type: sql.Int,           value: idVaiTro || null },
    { name: 'trang',            type: sql.Int,           value: trang },
    { name: 'kich_thuoc_trang', type: sql.Int,           value: kichThuocTrang },
  ]);

  const items = result.recordset;
  const tongBanGhi = items.length > 0 ? items[0].tong_ban_ghi : 0;

  return {
    items,
    tong_ban_ghi: tongBanGhi,
    trang,
    kich_thuoc_trang: kichThuocTrang,
    tong_trang: Math.ceil(tongBanGhi / kichThuocTrang),
  };
}

// TAO TAI KHOAN MOI (Admin tao nhan vien/admin)
export async function taoTaiKhoan(data: {
  ho_ten: string;
  email: string;
  mat_khau: string;
  so_dien_thoai: string;
  id_vai_tro: number;
}) {
  const pool = await getPool();

  // Kiem tra email da ton tai chua
  const existing = await pool.request()
    .input('email', sql.VarChar(255), data.email)
    .query('SELECT id FROM nguoi_dung WHERE email = @email');

  if (existing.recordset.length > 0) {
    throw { statusCode: 400, message: 'Email này đã được sử dụng.' };
  }

  // Hash mat khau
  const hashedPassword = await bcrypt.hash(data.mat_khau, 10);

  // Tao tai khoan
  const result = await pool.request()
    .input('ho_ten', sql.NVarChar(100), data.ho_ten)
    .input('email', sql.VarChar(255), data.email)
    .input('mat_khau', sql.VarChar(255), hashedPassword)
    .input('so_dien_thoai', sql.VarChar(10), data.so_dien_thoai)
    .input('id_vai_tro', sql.Int, data.id_vai_tro)
    .query(`
      INSERT INTO nguoi_dung (ho_ten, email, mat_khau, so_dien_thoai, id_vai_tro)
      OUTPUT INSERTED.id
      VALUES (@ho_ten, @email, @mat_khau, @so_dien_thoai, @id_vai_tro)
    `);

  const newUserId = result.recordset[0].id;

  // Tao gio hang cho user moi
  await pool.request()
    .input('id_nguoi_dung', sql.Int, newUserId)
    .query('INSERT INTO gio_hang (id_nguoi_dung) VALUES (@id_nguoi_dung)');

  return { id: newUserId };
}

// KHOA / MO KHOA TAI KHOAN (Admin)
export async function khoaMoKhoaTaiKhoan(idNguoiDung: number, khoa: boolean) {
  const pool = await getPool();

  // Khong cho khoa chinh minh
  const result = await pool.request()
    .input('id', sql.Int, idNguoiDung)
    .input('trang_thai', sql.Bit, khoa ? 0 : 1)
    .query('UPDATE nguoi_dung SET trang_thai = @trang_thai WHERE id = @id');

  if (result.rowsAffected[0] === 0) {
    throw { statusCode: 404, message: 'Không tìm thấy người dùng.' };
  }

  return { thong_bao: khoa ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.' };
}