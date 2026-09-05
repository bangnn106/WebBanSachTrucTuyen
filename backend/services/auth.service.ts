import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { executeProcedure } from '../config/database';
import { DangKyDTO, DangNhapDTO, JwtPayload, NguoiDung } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ========== TẠO JWT TOKEN ==========
function taoToken(payload: JwtPayload): string {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      id_vai_tro: payload.id_vai_tro,
      ten_vai_tro: payload.ten_vai_tro,
    } as object,
    JWT_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
}

// ========== ĐĂNG KÝ TÀI KHOẢN MỚI ==========
export async function dangKy(data: DangKyDTO) {
  // 1. Hash mật khẩu trước khi lưu vào DB
  const hashedPassword = await bcrypt.hash(data.mat_khau, 10);

  // 2. Gọi SP đăng ký (SP tự tạo giỏ hàng)
  const result = await executeProcedure('sp_dang_ky_nguoi_dung', [
    { name: 'ho_ten',           type: sql.NVarChar(100), value: data.ho_ten },
    { name: 'email',            type: sql.VarChar(255),  value: data.email },
    { name: 'mat_khau',         type: sql.VarChar(255),  value: hashedPassword },
    { name: 'so_dien_thoai',    type: sql.VarChar(10),   value: data.so_dien_thoai },
    { name: 'tinh_thanh',       type: sql.NVarChar(100), value: data.tinh_thanh },
    { name: 'quan_huyen',       type: sql.NVarChar(100), value: data.quan_huyen },
    { name: 'phuong_xa',        type: sql.NVarChar(100), value: data.phuong_xa },
    { name: 'dia_chi_chi_tiet', type: sql.NVarChar(255), value: data.dia_chi_chi_tiet || null },
  ]);

  return result.recordset[0]; // { id_nguoi_dung, thong_bao }
}

// ========== ĐĂNG NHẬP ==========
export async function dangNhap(data: DangNhapDTO) {
  // 1. Tìm user theo email
  const result = await executeProcedure('sp_lay_nguoi_dung_theo_email', [
    { name: 'email', type: sql.VarChar(255), value: data.email },
  ]);

  if (result.recordset.length === 0) {
    throw { statusCode: 401, message: 'Email hoặc mật khẩu không đúng.' };
  }

  const user: NguoiDung = result.recordset[0];

  // 2. So sánh mật khẩu với hash trong DB
  const isMatch = await bcrypt.compare(data.mat_khau, user.mat_khau);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Email hoặc mật khẩu không đúng.' };
  }

  // 3. Tạo JWT token
  const token = taoToken({
    id: user.id,
    email: user.email,
    id_vai_tro: user.id_vai_tro,
    ten_vai_tro: user.ten_vai_tro,
  });

  // 4. Trả token + info user (KHÔNG trả mật khẩu)
  return {
    token,
    user: {
      id: user.id,
      ho_ten: user.ho_ten,
      email: user.email,
      so_dien_thoai: user.so_dien_thoai,
      tinh_thanh: user.tinh_thanh,
      quan_huyen: user.quan_huyen,
      phuong_xa: user.phuong_xa,
      dia_chi_chi_tiet: user.dia_chi_chi_tiet,
      ten_vai_tro: user.ten_vai_tro,
    },
  };
}

// ========== LẤY THÔNG TIN USER HIỆN TẠI (từ token) ==========
export async function layThongTinHienTai(email: string) {
  const result = await executeProcedure('sp_lay_nguoi_dung_theo_email', [
    { name: 'email', type: sql.VarChar(255), value: email },
  ]);

  if (result.recordset.length === 0) {
    throw { statusCode: 404, message: 'Không tìm thấy người dùng.' };
  }

  const user = result.recordset[0];
  // Loại bỏ mật khẩu trước khi trả về
  const { mat_khau, ...userInfo } = user;
  return userInfo;
}