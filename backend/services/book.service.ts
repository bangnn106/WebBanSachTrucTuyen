import sql from 'mssql';
import { executeProcedure, executeQuery } from '../config/database';
import { ThemSachDTO, CapNhatSachDTO, TimKiemSachDTO } from '../models/book.model';

// ========== TÌM KIẾM SÁCH (public, phân trang & lọc) ==========
export async function timKiemSach(filter: TimKiemSachDTO) {
  const result = await executeProcedure('sp_tim_kiem_sach', [
    { name: 'tu_khoa',          type: sql.NVarChar(255),     value: filter.tu_khoa || null },
    { name: 'id_the_loai',      type: sql.Int,               value: filter.id_the_loai || null },
    { name: 'id_nha_xuat_ban',  type: sql.Int,               value: filter.id_nha_xuat_ban || null },
    { name: 'gia_tu',           type: sql.Decimal(18, 2),    value: filter.gia_tu ?? null },
    { name: 'gia_den',          type: sql.Decimal(18, 2),    value: filter.gia_den ?? null },
    { name: 'trang_thai',       type: sql.NVarChar(20),      value: filter.trang_thai || null },
    { name: 'sap_xep',          type: sql.VarChar(20),       value: filter.sap_xep || 'MOI_NHAT' },
    { name: 'trang',            type: sql.Int,               value: filter.trang || 1 },
    { name: 'kich_thuoc_trang', type: sql.Int,               value: filter.kich_thuoc_trang || 12 },
  ]);

  const items = result.recordset;
  const tongBanGhi = items.length > 0 ? items[0].tong_ban_ghi : 0;
  const trang = filter.trang || 1;
  const kichThuocTrang = filter.kich_thuoc_trang || 12;

  return {
    items,
    tong_ban_ghi: tongBanGhi,
    trang,
    kich_thuoc_trang: kichThuocTrang,
    tong_trang: Math.ceil(tongBanGhi / kichThuocTrang),
  };
}

// ========== LẤY CHI TIẾT 1 CUỐN SÁCH THEO ID ==========
export async function laySachTheoId(id: number) {
  const result = await executeQuery(
    `SELECT s.*, tls.ten_the_loai, nxb.ten_nxb
     FROM sach s
     JOIN the_loai_sach tls ON tls.id = s.id_the_loai
     JOIN nha_xuat_ban nxb ON nxb.id = s.id_nha_xuat_ban
     WHERE s.id = @id`,
    [{ name: 'id', type: sql.Int, value: id }]
  );

  if (result.recordset.length === 0) {
    throw { statusCode: 404, message: 'Sách không tồn tại.' };
  }

  return result.recordset[0];
}

// ========== THÊM SÁCH MỚI (Admin) ==========
export async function themSach(data: ThemSachDTO, idNguoiThucHien: number) {
  const result = await executeProcedure('sp_them_sach', [
    { name: 'ten_sach',           type: sql.NVarChar(255),   value: data.ten_sach },
    { name: 'isbn',               type: sql.VarChar(20),     value: data.isbn },
    { name: 'tac_gia',            type: sql.NVarChar(255),   value: data.tac_gia },
    { name: 'mo_ta_ngan',         type: sql.NVarChar(2000),  value: data.mo_ta_ngan || null },
    { name: 'gia_goc',            type: sql.Decimal(18, 2),  value: data.gia_goc },
    { name: 'gia_ban',            type: sql.Decimal(18, 2),  value: data.gia_ban },
    { name: 'nam_xuat_ban',       type: sql.SmallInt,        value: data.nam_xuat_ban || null },
    { name: 'ngon_ngu',           type: sql.NVarChar(50),    value: data.ngon_ngu || null },
    { name: 'anh_bia',            type: sql.NVarChar(1000),  value: data.anh_bia || null },
    { name: 'so_luong_ton',       type: sql.Int,             value: data.so_luong_ton || 0 },
    { name: 'id_the_loai',        type: sql.Int,             value: data.id_the_loai },
    { name: 'id_nha_xuat_ban',    type: sql.Int,             value: data.id_nha_xuat_ban },
    { name: 'id_nguoi_thuc_hien', type: sql.Int,             value: idNguoiThucHien },
  ]);

  return result.recordset[0]; // { id_sach, thong_bao }
}

// ========== CẬP NHẬT THÔNG TIN SÁCH (Admin) ==========
export async function capNhatSach(id: number, data: CapNhatSachDTO) {
  const result = await executeProcedure('sp_cap_nhat_sach', [
    { name: 'id_sach',         type: sql.Int,              value: id },
    { name: 'ten_sach',        type: sql.NVarChar(255),    value: data.ten_sach },
    { name: 'isbn',            type: sql.VarChar(20),      value: data.isbn },
    { name: 'tac_gia',         type: sql.NVarChar(255),    value: data.tac_gia },
    { name: 'mo_ta_ngan',      type: sql.NVarChar(2000),   value: data.mo_ta_ngan || null },
    { name: 'gia_goc',         type: sql.Decimal(18, 2),   value: data.gia_goc },
    { name: 'gia_ban',         type: sql.Decimal(18, 2),   value: data.gia_ban },
    { name: 'nam_xuat_ban',    type: sql.SmallInt,         value: data.nam_xuat_ban || null },
    { name: 'ngon_ngu',        type: sql.NVarChar(50),     value: data.ngon_ngu || null },
    { name: 'anh_bia',         type: sql.NVarChar(1000),   value: data.anh_bia || null },
    { name: 'id_the_loai',     type: sql.Int,              value: data.id_the_loai },
    { name: 'id_nha_xuat_ban', type: sql.Int,              value: data.id_nha_xuat_ban },
  ]);

  return result.recordset[0]; // { thong_bao }
}

// ========== CẬP NHẬT TRẠNG THÁI SÁCH (Admin) ==========
export async function capNhatTrangThai(id: number, trangThai: string) {
  const result = await executeProcedure('sp_cap_nhat_trang_thai_sach', [
    { name: 'id_sach',    type: sql.Int,          value: id },
    { name: 'trang_thai', type: sql.NVarChar(20), value: trangThai },
  ]);
  return result.recordset[0]; // { thong_bao }
}

// ========== LẤY DANH SÁCH THỂ LOẠI ==========
export async function layDanhSachTheLoai() {
  const result = await executeQuery(
    'SELECT id, ten_the_loai FROM the_loai_sach ORDER BY ten_the_loai'
  );
  return result.recordset;
}

// ========== LẤY DANH SÁCH NHÀ XUẤT BẢN ==========
export async function layDanhSachNhaXuatBan() {
  const result = await executeQuery(
    'SELECT id, ten_nxb FROM nha_xuat_ban ORDER BY ten_nxb'
  );
  return result.recordset;
}