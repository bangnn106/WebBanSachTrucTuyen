// CHI TIET GIO HANG (output tu sp_lay_chi_tiet_gio_hang, bo cot id rieng)
export interface ChiTietGioHang {
  id_sach: number;
  ten_sach: string;
  anh_bia: string | null;
  gia_ban: number;
  so_luong: number;
  so_luong_ton: number;
  trang_thai: string;
  thanh_tien: number;
  tong_tien_gio_hang: number;
}

// DTOs

export interface ThemVaoGioDTO {
  id_sach: number;
  so_luong: number;
}

export interface CapNhatGioDTO {
  so_luong: number;
}