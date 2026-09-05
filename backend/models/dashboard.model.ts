// ========== TỔNG QUAN DASHBOARD ==========
export interface TongQuanDashboard {
  tong_doanh_thu: number;
  tong_don_hang: number;
  don_da_giao: number;
  don_da_huy: number;
  tong_khach_hang: number;
  tong_dau_sach: number;
  tong_sach_ton: number;
  tong_sach_da_ban: number;
}

// ========== DOANH THU THEO NGÀY/THÁNG ==========
export interface DoanhThuThongKe {
  ngay?: string;
  nam?: number;
  thang?: number;
  so_don_da_giao: number;
  doanh_thu: number;
}

// ========== SÁCH BÁN CHẠY ==========
export interface SachBanChay {
  id: number;
  ten_sach: string;
  tac_gia: string;
  gia_goc: number;
  gia_ban: number;
  anh_bia: string | null;
  so_luong_ton: number;
  trang_thai: string;
  tong_so_luong_ban: number;
  tong_doanh_thu: number;
}

// ========== ĐƠN HÀNG THEO TRẠNG THÁI ==========
export interface DonHangTheoTrangThai {
  trang_thai_don_hang: string;
  so_luong_don: number;
  tong_gia_tri: number;
}