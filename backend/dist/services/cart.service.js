"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.themSachVaoGio = themSachVaoGio;
exports.capNhatSoLuongGio = capNhatSoLuongGio;
exports.xoaSachKhoiGio = xoaSachKhoiGio;
exports.xoaToanBoGioHang = xoaToanBoGioHang;
exports.layChiTietGioHang = layChiTietGioHang;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// THEM SACH VAO GIO HANG
async function themSachVaoGio(idNguoiDung, idSach, soLuong) {
    const result = await (0, database_1.executeProcedure)('sp_them_sach_vao_gio', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'id_sach', type: mssql_1.default.Int, value: idSach },
        { name: 'so_luong', type: mssql_1.default.Int, value: soLuong },
    ]);
    return result.recordset[0];
}
// CAP NHAT SO LUONG SACH TRONG GIO
async function capNhatSoLuongGio(idNguoiDung, idSach, soLuong) {
    const result = await (0, database_1.executeProcedure)('sp_cap_nhat_so_luong_gio', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'id_sach', type: mssql_1.default.Int, value: idSach },
        { name: 'so_luong', type: mssql_1.default.Int, value: soLuong },
    ]);
    return result.recordset[0];
}
// XOA 1 SACH KHOI GIO HANG
async function xoaSachKhoiGio(idNguoiDung, idSach) {
    const result = await (0, database_1.executeProcedure)('sp_xoa_sach_khoi_gio', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'id_sach', type: mssql_1.default.Int, value: idSach },
    ]);
    return result.recordset[0];
}
// XOA TOAN BO GIO HANG
async function xoaToanBoGioHang(idNguoiDung) {
    const result = await (0, database_1.executeProcedure)('sp_xoa_toan_bo_gio_hang', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
    ]);
    return result.recordset[0];
}
// LAY CHI TIET GIO HANG
async function layChiTietGioHang(idNguoiDung) {
    const result = await (0, database_1.executeProcedure)('sp_lay_chi_tiet_gio_hang', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
    ]);
    return result.recordset; // Mang cac san pham trong gio
}
//# sourceMappingURL=cart.service.js.map