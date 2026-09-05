import sql from 'mssql';
import { executeProcedure } from '../config/database';
import { NhapKhoDTO, DieuChinhKhoDTO, LichSuKhoDTO } from '../models/inventory.model';

// ========== NHẬP KHO ==========
export async function nhapKho(data: NhapKhoDTO, idNguoiThucHien: number) {
  const result = await executeProcedure('sp_nhap_kho', [
    { name: 'id_sach',            type: sql.Int,           value: data.id_sach },
    { name: 'so_luong',           type: sql.Int,           value: data.so_luong },
    { name: 'id_nguoi_thuc_hien', type: sql.Int,           value: idNguoiThucHien },
    { name: 'ly_do',              type: sql.NVarChar(500), value: data.ly_do || null },
  ]);
  return result.recordset[0]; // { thong_bao }
}

// ========== ĐIỀU CHỈNH KHO ==========
export async function dieuChinhKho(data: DieuChinhKhoDTO, idNguoiThucHien: number) {
  const result = await executeProcedure('sp_dieu_chinh_kho', [
    { name: 'id_sach',            type: sql.Int,           value: data.id_sach },
    { name: 'so_luong_thay_doi',  type: sql.Int,           value: data.so_luong_thay_doi },
    { name: 'id_nguoi_thuc_hien', type: sql.Int,           value: idNguoiThucHien },
    { name: 'ly_do',              type: sql.NVarChar(500), value: data.ly_do },
  ]);
  return result.recordset[0]; // { ton_truoc, ton_sau, thong_bao }
}

// ========== LẤY LỊCH SỬ KHO ==========
export async function layLichSuKho(filter: LichSuKhoDTO) {
  const result = await executeProcedure('sp_lay_lich_su_kho', [
    { name: 'id_sach',          type: sql.Int,          value: filter.id_sach || null },
    { name: 'loai_giao_dich',   type: sql.NVarChar(30), value: filter.loai_giao_dich || null },
    { name: 'tu_ngay',          type: sql.Date,         value: filter.tu_ngay || null },
    { name: 'den_ngay',         type: sql.Date,         value: filter.den_ngay || null },
    { name: 'trang',            type: sql.Int,          value: filter.trang || 1 },
    { name: 'kich_thuoc_trang', type: sql.Int,          value: filter.kich_thuoc_trang || 30 },
  ]);

  const items = result.recordset;
  const tongBanGhi = items.length > 0 ? items[0].tong_ban_ghi : 0;
  const trang = filter.trang || 1;
  const kichThuocTrang = filter.kich_thuoc_trang || 30;

  return {
    items,
    tong_ban_ghi: tongBanGhi,
    trang,
    kich_thuoc_trang: kichThuocTrang,
    tong_trang: Math.ceil(tongBanGhi / kichThuocTrang),
  };
}