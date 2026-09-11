"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tongQuan = tongQuan;
exports.doanhThu = doanhThu;
exports.topSachBanChay = topSachBanChay;
exports.donHangTheoTrangThai = donHangTheoTrangThai;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// TONG QUAN DASHBOARD
async function tongQuan(tuNgay, denNgay) {
    const result = await (0, database_1.executeProcedure)('sp_dashboard_tong_quan', [
        { name: 'tu_ngay', type: mssql_1.default.Date, value: tuNgay || null },
        { name: 'den_ngay', type: mssql_1.default.Date, value: denNgay || null },
    ]);
    return result.recordset[0];
}
// THONG KE DOANH THU
async function doanhThu(tuNgay, denNgay, kieuThongKe = 'NGAY') {
    const result = await (0, database_1.executeProcedure)('sp_thong_ke_doanh_thu', [
        { name: 'tu_ngay', type: mssql_1.default.Date, value: tuNgay || null },
        { name: 'den_ngay', type: mssql_1.default.Date, value: denNgay || null },
        { name: 'kieu_thong_ke', type: mssql_1.default.NVarChar(10), value: kieuThongKe },
    ]);
    return result.recordset;
}
// TOP SACH BAN CHAY
async function topSachBanChay(soLuongTop = 10) {
    const result = await (0, database_1.executeProcedure)('sp_top_sach_ban_chay', [
        { name: 'so_luong_top', type: mssql_1.default.Int, value: soLuongTop },
    ]);
    return result.recordset;
}
// THONG KE DON HANG THEO TRANG THAI
async function donHangTheoTrangThai(tuNgay, denNgay) {
    const result = await (0, database_1.executeProcedure)('sp_thong_ke_don_hang_theo_trang_thai', [
        { name: 'tu_ngay', type: mssql_1.default.Date, value: tuNgay || null },
        { name: 'den_ngay', type: mssql_1.default.Date, value: denNgay || null },
    ]);
    return result.recordset;
}
//# sourceMappingURL=dashboard.service.js.map