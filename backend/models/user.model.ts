//ENUM VAI TROexport enum VaiTro {
  KHACH_HANG = 'KHACH_HANG',
  NHAN_VIEN = 'NHAN_VIEN',
  QUAN_TRI_VIEN = 'QUAN_TRI_VIEN',
}

//ENTITY NGUOI DUNG (map tu bang nguoi dung)export interface NguoiDung {
  id: number;
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

//DTOs
//DTO ang ky tai khoanexport interface DangKyDTO {
  ho_ten: string;
  email: string;
  mat_khau: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet?: string;
}

//DTO ang nhapexport interface DangNhapDTO {
  email: string;
  mat_khau: string;
}

//DTO cap nhat thong tinexport interface CapNhatNguoiDungDTO {
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet?: string;
}

//JWT PAYLOADexport interface JwtPayload {
  id: number;
  email: string;
  id_vai_tro: number;
  ten_vai_tro: string;
}