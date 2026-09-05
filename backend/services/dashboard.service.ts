import sql from 'mssql';
import { executeProcedure } from '../config/database';

// ========== TỔNG QUAN DASHBOARD ==========
export async function tongQuan(tuNgay?: string, denNgay?: string) {
  const result = await executeProcedure('sp_dashboard_tong_quan', [
    { name: 'tu_ngay',  type: sql.Date, value: tuNgay || null },
    { name: 'den_ngay', type: sql.Date, value: denNgay || null },
  ]);
  return result.recordset[0];
}

// ========== THỐNG KÊ DOANH THU ==========
export async function doanhThu(
  tuNgay?: string,
  denNgay?: string,
  kieuThongKe: string = 'NGAY'
) {
  const result = await executeProcedure('sp_thong_ke_doanh_thu', [
    { name: 'tu_ngay',        type: sql.Date,         value: tuNgay || null },
    { name: 'den_ngay',       type: sql.Date,         value: denNgay || null },
    { name: 'kieu_thong_ke',  type: sql.NVarChar(10), value: kieuThongKe },
  ]);
  return result.recordset;
}

// ========== TOP SÁCH BÁN CHẠY ==========
export async function topSachBanChay(soLuongTop: number = 10) {
  const result = await executeProcedure('sp_top_sach_ban_chay', [
    { name: 'so_luong_top', type: sql.Int, value: soLuongTop },
  ]);
  return result.recordset;
}

// ========== THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI ==========
export async function donHangTheoTrangThai(tuNgay?: string, denNgay?: string) {
  const result = await executeProcedure('sp_thong_ke_don_hang_theo_trang_thai', [
    { name: 'tu_ngay',  type: sql.Date, value: tuNgay || null },
    { name: 'den_ngay', type: sql.Date, value: denNgay || null },
  ]);
  return result.recordset;
}