import sql from 'mssql';
import { executeProcedure } from '../config/database';
import { CapNhatNguoiDungDTO } from '../models/user.model';

// ========== CẬP NHẬT THÔNG TIN NGƯỜI DÙNG ==========
export async function capNhatNguoiDung(
  idNguoiDung: number,
  data: CapNhatNguoiDungDTO
) {
  const result = await executeProcedure('sp_cap_nhat_nguoi_dung', [
    { name: 'id_nguoi_dung',    type: sql.Int,           value: idNguoiDung },
    { name: 'ho_ten',           type: sql.NVarChar(100), value: data.ho_ten },
    { name: 'email',            type: sql.VarChar(255),  value: data.email },
    { name: 'so_dien_thoai',    type: sql.VarChar(10),   value: data.so_dien_thoai },
    { name: 'tinh_thanh',       type: sql.NVarChar(100), value: data.tinh_thanh },
    { name: 'quan_huyen',       type: sql.NVarChar(100), value: data.quan_huyen },
    { name: 'phuong_xa',        type: sql.NVarChar(100), value: data.phuong_xa },
    { name: 'dia_chi_chi_tiet', type: sql.NVarChar(255), value: data.dia_chi_chi_tiet || null },
  ]);

  return result.recordset[0]; // { thong_bao }
}

// ========== LẤY DANH SÁCH NGƯỜI DÙNG (Admin) ==========
export async function layDanhSachNguoiDung(
  tuKhoa?: string,
  idVaiTro?: number,
  trang: number = 1,
  kichThuocTrang: number = 20
) {
  const result = await executeProcedure('sp_lay_danh_sach_nguoi_dung', [
    { name: 'tu_khoa',          type: sql.NVarChar(255), value: tuKhoa || null },
    { name: 'id_vai_tro',       type: sql.Int,           value: idVaiTro || null },
    { name: 'trang',            type: sql.Int,           value: trang },
    { name: 'kich_thuoc_trang', type: sql.Int,           value: kichThuocTrang },
  ]);

  const items = result.recordset;
  const tongBanGhi = items.length > 0 ? items[0].tong_ban_ghi : 0;

  return {
    items,
    tong_ban_ghi: tongBanGhi,
    trang,
    kich_thuoc_trang: kichThuocTrang,
    tong_trang: Math.ceil(tongBanGhi / kichThuocTrang),
  };
}