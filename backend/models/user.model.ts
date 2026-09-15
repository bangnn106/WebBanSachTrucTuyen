// ENUM VAI TRO
export enum VaiTro {
  KHACH_HANG = 'KHACH_HANG',
  NHAN_VIEN = 'NHAN_VIEN',
  QUAN_TRI_VIEN = 'QUAN_TRI_VIEN',
}

// ENTITY NGUOI DUNG (map tu bang nguoi_dung voi PK id_nguoi_dung)
export interface NguoiDung {
  id_nguoi_dung: number;
  id: number; // Tuong thich nguoc
  ho_ten: string;
  email: string;
  mat_khau: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet: string | null;
  id_vai_tro: number;
  ten_vai_tro: string;
}

// DTOs

// DTO dang ky tai khoan
export interface DangKyDTO {
  ho_ten: string;
  email: string;
  mat_khau: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet?: string;
}

// DTO dang nhap
export interface DangNhapDTO {
  email: string;
  mat_khau: string;
}

// DTO cap nhat thong tin
export interface CapNhatNguoiDungDTO {
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet?: string;
}

// JWT PAYLOAD
export interface JwtPayload {
  id_nguoi_dung: number;
  id: number; // Tuong thich nguoc
  email: string;
  id_vai_tro: number;
  ten_vai_tro: string;
}