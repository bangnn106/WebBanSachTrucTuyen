import sql from 'mssql';
import { executeProcedure } from '../config/database';

// ========== THÊM SÁCH VÀO GIỎ HÀNG ==========
export async function themSachVaoGio(
  idNguoiDung: number,
  idSach: number,
  soLuong: number
) {
  const result = await executeProcedure('sp_them_sach_vao_gio', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
    { name: 'id_sach',       type: sql.Int, value: idSach },
    { name: 'so_luong',      type: sql.Int, value: soLuong },
  ]);
  return result.recordset[0];
}

// ========== CẬP NHẬT SỐ LƯỢNG SÁCH TRONG GIỎ ==========
export async function capNhatSoLuongGio(
  idNguoiDung: number,
  idSach: number,
  soLuong: number
) {
  const result = await executeProcedure('sp_cap_nhat_so_luong_gio', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
    { name: 'id_sach',       type: sql.Int, value: idSach },
    { name: 'so_luong',      type: sql.Int, value: soLuong },
  ]);
  return result.recordset[0];
}

// ========== XÓA 1 SÁCH KHỎI GIỎ HÀNG ==========
export async function xoaSachKhoiGio(idNguoiDung: number, idSach: number) {
  const result = await executeProcedure('sp_xoa_sach_khoi_gio', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
    { name: 'id_sach',       type: sql.Int, value: idSach },
  ]);
  return result.recordset[0];
}

// ========== XÓA TOÀN BỘ GIỎ HÀNG ==========
export async function xoaToanBoGioHang(idNguoiDung: number) {
  const result = await executeProcedure('sp_xoa_toan_bo_gio_hang', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
  ]);
  return result.recordset[0];
}

// ========== LẤY CHI TIẾT GIỎ HÀNG ==========
export async function layChiTietGioHang(idNguoiDung: number) {
  const result = await executeProcedure('sp_lay_chi_tiet_gio_hang', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
  ]);
  return result.recordset; // Mảng các sản phẩm trong giỏ
}