"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timKiemSach = timKiemSach;
exports.laySachTheoId = laySachTheoId;
exports.themSach = themSach;
exports.capNhatSach = capNhatSach;
exports.capNhatTrangThai = capNhatTrangThai;
exports.layDanhSachTheLoai = layDanhSachTheLoai;
exports.layDanhSachNhaXuatBan = layDanhSachNhaXuatBan;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// TIM KIEM SACH (public, phan trang & loc)
async function timKiemSach(filter) {
    const result = await (0, database_1.executeProcedure)('sp_tim_kiem_sach', [
        { name: 'tu_khoa', type: mssql_1.default.NVarChar(255), value: filter.tu_khoa || null },
        { name: 'id_the_loai', type: mssql_1.default.Int, value: filter.id_the_loai || null },
        { name: 'id_nha_xuat_ban', type: mssql_1.default.Int, value: filter.id_nha_xuat_ban || null },
        { name: 'gia_tu', type: mssql_1.default.Decimal(18, 2), value: filter.gia_tu ?? null },
        { name: 'gia_den', type: mssql_1.default.Decimal(18, 2), value: filter.gia_den ?? null },
        { name: 'trang_thai', type: mssql_1.default.NVarChar(20), value: filter.trang_thai || null },
        { name: 'sap_xep', type: mssql_1.default.VarChar(20), value: filter.sap_xep || 'MOI_NHAT' },
        { name: 'trang', type: mssql_1.default.Int, value: filter.trang || 1 },
        { name: 'kich_thuoc_trang', type: mssql_1.default.Int, value: filter.kich_thuoc_trang || 12 },
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
// LAY CHI TIET 1 CUON SACH THEO ID
async function laySachTheoId(id) {
    const result = await (0, database_1.executeQuery)(`SELECT s.*, tls.ten_the_loai, nxb.ten_nxb
     FROM sach s
     JOIN the_loai_sach tls ON tls.id_the_loai = s.id_the_loai
     JOIN nha_xuat_ban nxb ON nxb.id_nha_xuat_ban = s.id_nha_xuat_ban
     WHERE s.id_sach = @id`, [{ name: 'id', type: mssql_1.default.Int, value: id }]);
    if (result.recordset.length === 0) {
        throw { statusCode: 404, message: 'Sách không tồn tại.' };
    }
    return result.recordset[0];
}
// THEM SACH MOI (Admin)
async function themSach(data, idNguoiThucHien) {
    const result = await (0, database_1.executeProcedure)('sp_them_sach', [
        { name: 'ten_sach', type: mssql_1.default.NVarChar(255), value: data.ten_sach },
        { name: 'isbn', type: mssql_1.default.VarChar(20), value: data.isbn },
        { name: 'tac_gia', type: mssql_1.default.NVarChar(255), value: data.tac_gia },
        { name: 'mo_ta_ngan', type: mssql_1.default.NVarChar(2000), value: data.mo_ta_ngan || null },
        { name: 'gia_goc', type: mssql_1.default.Decimal(18, 2), value: data.gia_goc },
        { name: 'gia_ban', type: mssql_1.default.Decimal(18, 2), value: data.gia_ban },
        { name: 'nam_xuat_ban', type: mssql_1.default.SmallInt, value: data.nam_xuat_ban || null },
        { name: 'ngon_ngu', type: mssql_1.default.NVarChar(50), value: data.ngon_ngu || null },
        { name: 'anh_bia', type: mssql_1.default.NVarChar(1000), value: data.anh_bia || null },
        { name: 'so_luong_ton', type: mssql_1.default.Int, value: data.so_luong_ton || 0 },
        { name: 'id_the_loai', type: mssql_1.default.Int, value: data.id_the_loai },
        { name: 'id_nha_xuat_ban', type: mssql_1.default.Int, value: data.id_nha_xuat_ban },
        { name: 'id_nguoi_thuc_hien', type: mssql_1.default.Int, value: idNguoiThucHien },
    ]);
    return result.recordset[0]; // { id_sach, thong_bao }
}
// CAP NHAT THONG TIN SACH (Admin)
async function capNhatSach(id, data) {
    const result = await (0, database_1.executeProcedure)('sp_cap_nhat_sach', [
        { name: 'id_sach', type: mssql_1.default.Int, value: id },
        { name: 'ten_sach', type: mssql_1.default.NVarChar(255), value: data.ten_sach },
        { name: 'isbn', type: mssql_1.default.VarChar(20), value: data.isbn },
        { name: 'tac_gia', type: mssql_1.default.NVarChar(255), value: data.tac_gia },
        { name: 'mo_ta_ngan', type: mssql_1.default.NVarChar(2000), value: data.mo_ta_ngan || null },
        { name: 'gia_goc', type: mssql_1.default.Decimal(18, 2), value: data.gia_goc },
        { name: 'gia_ban', type: mssql_1.default.Decimal(18, 2), value: data.gia_ban },
        { name: 'nam_xuat_ban', type: mssql_1.default.SmallInt, value: data.nam_xuat_ban || null },
        { name: 'ngon_ngu', type: mssql_1.default.NVarChar(50), value: data.ngon_ngu || null },
        { name: 'anh_bia', type: mssql_1.default.NVarChar(1000), value: data.anh_bia || null },
        { name: 'id_the_loai', type: mssql_1.default.Int, value: data.id_the_loai },
        { name: 'id_nha_xuat_ban', type: mssql_1.default.Int, value: data.id_nha_xuat_ban },
    ]);
    return result.recordset[0]; // { thong_bao }
}
// CAP NHAT TRANG THAI SACH (Admin)
async function capNhatTrangThai(id, trangThai) {
    const result = await (0, database_1.executeProcedure)('sp_cap_nhat_trang_thai_sach', [
        { name: 'id_sach', type: mssql_1.default.Int, value: id },
        { name: 'trang_thai', type: mssql_1.default.NVarChar(20), value: trangThai },
    ]);
    return result.recordset[0]; // { thong_bao }
}
// LAY DANH SACH THE LOAI
async function layDanhSachTheLoai() {
    const result = await (0, database_1.executeQuery)('SELECT id_the_loai, id_the_loai AS id, ten_the_loai FROM the_loai_sach ORDER BY ten_the_loai');
    return result.recordset;
}
// LAY DANH SACH NHA XUAT BAN
async function layDanhSachNhaXuatBan() {
    const result = await (0, database_1.executeQuery)('SELECT id_nha_xuat_ban, id_nha_xuat_ban AS id, ten_nxb FROM nha_xuat_ban ORDER BY ten_nxb');
    return result.recordset;
}
//# sourceMappingURL=book.service.js.map