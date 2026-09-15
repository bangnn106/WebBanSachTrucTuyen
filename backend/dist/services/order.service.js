"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taoDonHangTuGio = taoDonHangTuGio;
exports.layDanhSachDonHang = layDanhSachDonHang;
exports.layChiTietDonHang = layChiTietDonHang;
exports.capNhatTrangThaiDonHang = capNhatTrangThaiDonHang;
exports.huyDonHang = huyDonHang;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// TAO DON HANG TU GIO HANG
async function taoDonHangTuGio(idNguoiDung, data) {
    const result = await (0, database_1.executeProcedure)('sp_tao_don_hang_tu_gio', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'ten_nguoi_nhan', type: mssql_1.default.NVarChar(150), value: data.ten_nguoi_nhan },
        { name: 'so_dien_thoai_nhan', type: mssql_1.default.VarChar(15), value: data.so_dien_thoai_nhan },
        { name: 'dia_chi_giao_hang', type: mssql_1.default.NVarChar(500), value: data.dia_chi_giao_hang },
        { name: 'ghi_chu', type: mssql_1.default.NVarChar(500), value: data.ghi_chu || null },
    ]);
    return result.recordset[0]; // { ma_don_hang, tong_tien, thong_bao }
}
// LAY DANH SACH DON HANG
async function layDanhSachDonHang(idNguoiDung, // null lay tat ca (nhan vien/admin)
filter) {
    const result = await (0, database_1.executeProcedure)('sp_lay_danh_sach_don_hang', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'tu_khoa', type: mssql_1.default.NVarChar(255), value: filter.tu_khoa || null },
        { name: 'trang_thai', type: mssql_1.default.NVarChar(30), value: filter.trang_thai || null },
        { name: 'tu_ngay', type: mssql_1.default.Date, value: filter.tu_ngay || null },
        { name: 'den_ngay', type: mssql_1.default.Date, value: filter.den_ngay || null },
        { name: 'trang', type: mssql_1.default.Int, value: filter.trang || 1 },
        { name: 'kich_thuoc_trang', type: mssql_1.default.Int, value: filter.kich_thuoc_trang || 20 },
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
// LAY CHI TIET DON HANG (dung ma_don_hang thay vi id)
// SP tra ve 2 recordsets: [0] thong tin don, [1] danh sach san pham
async function layChiTietDonHang(maDonHang, idNguoiDung // null khong gioi han (nhan vien/admin)
) {
    const result = await (0, database_1.executeProcedure)('sp_lay_chi_tiet_don_hang', [
        { name: 'ma_don_hang', type: mssql_1.default.VarChar(30), value: maDonHang },
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
    ]);
    return {
        don_hang: result.recordsets[0][0], // 1 object thong tin don
        chi_tiet: result.recordsets[1], // mang chi tiet san pham
    };
}
// CAP NHAT TRANG THAI DON HANG (nhan vien/admin)
async function capNhatTrangThaiDonHang(maDonHang, trangThaiMoi) {
    const result = await (0, database_1.executeProcedure)('sp_cap_nhat_trang_thai_don_hang', [
        { name: 'ma_don_hang', type: mssql_1.default.VarChar(30), value: maDonHang },
        { name: 'trang_thai_moi', type: mssql_1.default.NVarChar(30), value: trangThaiMoi },
    ]);
    return result.recordset[0]; // { thong_bao }
}
// HUY DON HANG
async function huyDonHang(maDonHang, idNguoiThucHien, lyDo) {
    const result = await (0, database_1.executeProcedure)('sp_huy_don_hang', [
        { name: 'ma_don_hang', type: mssql_1.default.VarChar(30), value: maDonHang },
        { name: 'id_nguoi_thuc_hien', type: mssql_1.default.Int, value: idNguoiThucHien },
        { name: 'ly_do', type: mssql_1.default.NVarChar(500), value: lyDo || null },
    ]);
    return result.recordset[0]; // { thong_bao }
}
//# sourceMappingURL=order.service.js.map