import sql from 'mssql';
import { executeProcedure } from '../config/database';
import { NhapHangDTO, DanhSachNhapHangDTO } from '../models/nhaphang.model';

// NHAP HANG SACH (tao phieu nhap)
export async function nhapHang(data: NhapHangDTO, idNguoiNhap: number) {
  const result = await executeProcedure('sp_nhap_hang_sach', [
    { name: 'id_sach',        type: sql.Int,           value: data.id_sach },
    { name: 'so_luong',       type: sql.Int,           value: data.so_luong },
    { name: 'don_gia_nhap',   type: sql.Decimal(18,2), value: data.don_gia_nhap || 0 },
    { name: 'id_nguoi_nhap',  type: sql.Int,           value: idNguoiNhap },
    { name: 'ghi_chu',        type: sql.NVarChar(500), value: data.ghi_chu || null },
  ]);
  return result.recordset[0]; // { ma_phieu_nhap, thong_bao }
}

// LAY DANH SACH PHIEU NHAP HANG
export async function layDanhSachNhapHang(filter: DanhSachNhapHangDTO) {
  const result = await executeProcedure('sp_lay_danh_sach_nhap_hang', [
    { name: 'id_sach',          type: sql.Int,  value: filter.id_sach || null },
    { name: 'tu_ngay',          type: sql.Date, value: filter.tu_ngay || null },
    { name: 'den_ngay',         type: sql.Date, value: filter.den_ngay || null },
    { name: 'trang',            type: sql.Int,  value: filter.trang || 1 },
    { name: 'kich_thuoc_trang', type: sql.Int,  value: filter.kich_thuoc_trang || 30 },
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
