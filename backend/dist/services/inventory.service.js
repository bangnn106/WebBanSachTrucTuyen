"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nhapKho = nhapKho;
exports.dieuChinhKho = dieuChinhKho;
exports.layLichSuKho = layLichSuKho;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// NHAP KHO
async function nhapKho(data, idNguoiThucHien) {
    const result = await (0, database_1.executeProcedure)('sp_nhap_kho', [
        { name: 'id_sach', type: mssql_1.default.Int, value: data.id_sach },
        { name: 'so_luong', type: mssql_1.default.Int, value: data.so_luong },
        { name: 'id_nguoi_thuc_hien', type: mssql_1.default.Int, value: idNguoiThucHien },
        { name: 'ly_do', type: mssql_1.default.NVarChar(500), value: data.ly_do || null },
    ]);
    return result.recordset[0]; // { thong_bao }
}
// DIEU CHINH KHO
async function dieuChinhKho(data, idNguoiThucHien) {
    const result = await (0, database_1.executeProcedure)('sp_dieu_chinh_kho', [
        { name: 'id_sach', type: mssql_1.default.Int, value: data.id_sach },
        { name: 'so_luong_thay_doi', type: mssql_1.default.Int, value: data.so_luong_thay_doi },
        { name: 'id_nguoi_thuc_hien', type: mssql_1.default.Int, value: idNguoiThucHien },
        { name: 'ly_do', type: mssql_1.default.NVarChar(500), value: data.ly_do },
    ]);
    return result.recordset[0]; // { ton_truoc, ton_sau, thong_bao }
}
// LAY LICH SU KHO
async function layLichSuKho(filter) {
    const result = await (0, database_1.executeProcedure)('sp_lay_lich_su_kho', [
        { name: 'id_sach', type: mssql_1.default.Int, value: filter.id_sach || null },
        { name: 'loai_giao_dich', type: mssql_1.default.NVarChar(30), value: filter.loai_giao_dich || null },
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
//# sourceMappingURL=inventory.service.js.map