"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nhapHang = nhapHang;
exports.layDanhSachNhapHang = layDanhSachNhapHang;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// NHAP HANG SACH (tao phieu nhap)
async function nhapHang(data, idNguoiNhap) {
    const result = await (0, database_1.executeProcedure)('sp_nhap_hang_sach', [
        { name: 'id_sach', type: mssql_1.default.Int, value: data.id_sach },
        { name: 'so_luong', type: mssql_1.default.Int, value: data.so_luong },
        { name: 'don_gia_nhap', type: mssql_1.default.Decimal(18, 2), value: data.don_gia_nhap || 0 },
        { name: 'id_nguoi_nhap', type: mssql_1.default.Int, value: idNguoiNhap },
        { name: 'ghi_chu', type: mssql_1.default.NVarChar(500), value: data.ghi_chu || null },
    ]);
    return result.recordset[0]; // { ma_phieu_nhap, thong_bao }
}
// LAY DANH SACH PHIEU NHAP HANG
async function layDanhSachNhapHang(filter) {
    const result = await (0, database_1.executeProcedure)('sp_lay_danh_sach_nhap_hang', [
        { name: 'id_sach', type: mssql_1.default.Int, value: filter.id_sach || null },
        { name: 'tu_ngay', type: mssql_1.default.Date, value: filter.tu_ngay || null },
        { name: 'den_ngay', type: mssql_1.default.Date, value: filter.den_ngay || null },
        { name: 'trang', type: mssql_1.default.Int, value: filter.trang || 1 },
        { name: 'kich_thuoc_trang', type: mssql_1.default.Int, value: filter.kich_thuoc_trang || 30 },
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
//# sourceMappingURL=nhaphang.service.js.map