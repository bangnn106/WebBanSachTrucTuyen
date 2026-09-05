// ========== ENTITY ĐƠN HÀNG ==========
export interface DonHang {
  id: number;
  ma_don_hang: string;
  tong_tien: number;
  ten_nguoi_nhan: string;
  so_dien_thoai_nhan: string;
  dia_chi_giao_hang: string;
  ghi_chu: string | null;
  trang_thai_don_hang: string;
  trang_thai_thanh_toan: string;
  ngay_dat: Date;
  id_nguoi_dung: number;
  ten_khach_hang?: string;
  email?: string;
  tong_ban_ghi?: number;
}

// ========== CHI TIẾT ĐƠN HÀNG ==========
export interface ChiTietDonHang {
  id: number;
  id_sach: number;
  ten_sach: string;
  anh_bia: string | null;
  don_gia: number;
  so_luong: number;
  thanh_tien: number;
}

// ========== DTOs ==========

export interface TaoDonHangDTO {
  ten_nguoi_nhan: string;
  so_dien_thoai_nhan: string;
  dia_chi_giao_hang: string;
  ghi_chu?: string;
}

export interface DanhSachDonHangDTO {
  tu_khoa?: string;
  trang_thai?: string;
  tu_ngay?: string;
  den_ngay?: string;
  trang?: number;
  kich_thuoc_trang?: number;
}