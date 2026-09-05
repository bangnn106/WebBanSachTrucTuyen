import sql from 'mssql';
import { executeProcedure } from '../config/database';
import { TaoDonHangDTO, DanhSachDonHangDTO } from '../models/order.model';

// ========== TẠO ĐƠN HÀNG TỪ GIỎ HÀNG ==========
export async function taoDonHangTuGio(
  idNguoiDung: number,
  data: TaoDonHangDTO
) {
  const result = await executeProcedure('sp_tao_don_hang_tu_gio', [
    { name: 'id_nguoi_dung',      type: sql.Int,           value: idNguoiDung },
    { name: 'ten_nguoi_nhan',     type: sql.NVarChar(150), value: data.ten_nguoi_nhan },
    { name: 'so_dien_thoai_nhan', type: sql.VarChar(15),   value: data.so_dien_thoai_nhan },
    { name: 'dia_chi_giao_hang',  type: sql.NVarChar(500), value: data.dia_chi_giao_hang },
    { name: 'ghi_chu',            type: sql.NVarChar(500), value: data.ghi_chu || null },
  ]);

  return result.recordset[0]; // { id_don_hang, ma_don_hang, tong_tien, thong_bao }
}

// ========== LẤY DANH SÁCH ĐƠN HÀNG ==========
export async function layDanhSachDonHang(
  idNguoiDung: number | null,    // null = lấy tất cả (nhân viên/admin)
  filter: DanhSachDonHangDTO
) {
  const result = await executeProcedure('sp_lay_danh_sach_don_hang', [
    { name: 'id_nguoi_dung',    type: sql.Int,           value: idNguoiDung },
    { name: 'tu_khoa',          type: sql.NVarChar(255), value: filter.tu_khoa || null },
    { name: 'trang_thai',       type: sql.NVarChar(30),  value: filter.trang_thai || null },
    { name: 'tu_ngay',          type: sql.Date,          value: filter.tu_ngay || null },
    { name: 'den_ngay',         type: sql.Date,          value: filter.den_ngay || null },
    { name: 'trang',            type: sql.Int,           value: filter.trang || 1 },
    { name: 'kich_thuoc_trang', type: sql.Int,           value: filter.kich_thuoc_trang || 20 },
  ]);

  const items = result.recordset;
  const tongBanGhi = items.length > 0 ? items[0].tong_ban_ghi : 0;
  const trang = filter.trang || 1;
  const kichThuocTrang = filter.kich_thuoc_trang || 20;

  return {
    items,
    tong_ban_ghi: tongBanGhi,
    trang,
    kich_thuoc_trang: kichThuocTrang,
    tong_trang: Math.ceil(tongBanGhi / kichThuocTrang),
  };
}

// ========== LẤY CHI TIẾT ĐƠN HÀNG ==========
// SP trả về 2 recordsets: [0] thông tin đơn, [1] danh sách sản phẩm
export async function layChiTietDonHang(
  idDonHang: number,
  idNguoiDung: number | null    // null = không giới hạn (nhân viên/admin)
) {
  const result = await executeProcedure('sp_lay_chi_tiet_don_hang', [
    { name: 'id_don_hang',   type: sql.Int, value: idDonHang },
    { name: 'id_nguoi_dung', type: sql.Int, value: idNguoiDung },
  ]);

  return {
    don_hang: (result.recordsets as any[])[0][0],    // 1 object thông tin đơn
    chi_tiet: (result.recordsets as any[])[1],        // mảng chi tiết sản phẩm
  };
}

// ========== CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (nhân viên/admin) ==========
export async function capNhatTrangThaiDonHang(
  idDonHang: number,
  trangThaiMoi: string
) {
  const result = await executeProcedure('sp_cap_nhat_trang_thai_don_hang', [
    { name: 'id_don_hang',     type: sql.Int,          value: idDonHang },
    { name: 'trang_thai_moi',  type: sql.NVarChar(30), value: trangThaiMoi },
  ]);
  return result.recordset[0]; // { thong_bao }
}

// ========== HỦY ĐƠN HÀNG ==========
export async function huyDonHang(
  idDonHang: number,
  idNguoiThucHien: number,
  lyDo?: string
) {
  const result = await executeProcedure('sp_huy_don_hang', [
    { name: 'id_don_hang',        type: sql.Int,           value: idDonHang },
    { name: 'id_nguoi_thuc_hien', type: sql.Int,           value: idNguoiThucHien },
    { name: 'ly_do',              type: sql.NVarChar(500), value: lyDo || null },
  ]);
  return result.recordset[0]; // { thong_bao }
}