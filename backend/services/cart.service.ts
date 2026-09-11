import sql from 'mssql';
import { executeProcedure } from '../config/database';

//THEM SACH VAO GIO HANGexport async function themSachVaoGio(
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

//CAP NHAT SO LUONG SACH TRONG GIOexport async function capNhatSoLuongGio(
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

//XOA 1 SACH KHOI GIO HANGexport async function xoaSachKhoiGio(idNguoiDung: number, idSach: number) {
  const result = await executeProcedure('sp_xoa_sach_khoi_gio', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
    { name: 'id_sach',       type: sql.Int, value: idSach },
  ]);
  return result.recordset[0];
}

//XOA TOAN BO GIO HANGexport async function xoaToanBoGioHang(idNguoiDung: number) {
  const result = await executeProcedure('sp_xoa_toan_bo_gio_hang', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
  ]);
  return result.recordset[0];
}

//LAY CHI TIET GIO HANGexport async function layChiTietGioHang(idNguoiDung: number) {
  const result = await executeProcedure('sp_lay_chi_tiet_gio_hang', [
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
  ]);
  return result.recordset; //Mang cac san pham trong gio}