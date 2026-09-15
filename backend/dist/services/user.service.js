"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatNguoiDung = capNhatNguoiDung;
exports.layDanhSachNguoiDung = layDanhSachNguoiDung;
exports.taoTaiKhoan = taoTaiKhoan;
exports.khoaMoKhoaTaiKhoan = khoaMoKhoaTaiKhoan;
const mssql_1 = __importDefault(require("mssql"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
// CAP NHAT THONG TIN NGUOI DUNG
async function capNhatNguoiDung(idNguoiDung, data) {
    const result = await (0, database_1.executeProcedure)('sp_cap_nhat_nguoi_dung', [
        { name: 'id_nguoi_dung', type: mssql_1.default.Int, value: idNguoiDung },
        { name: 'ho_ten', type: mssql_1.default.NVarChar(100), value: data.ho_ten },
        { name: 'email', type: mssql_1.default.VarChar(255), value: data.email },
        { name: 'so_dien_thoai', type: mssql_1.default.VarChar(10), value: data.so_dien_thoai },
        { name: 'tinh_thanh', type: mssql_1.default.NVarChar(100), value: data.tinh_thanh },
        { name: 'quan_huyen', type: mssql_1.default.NVarChar(100), value: data.quan_huyen },
        { name: 'phuong_xa', type: mssql_1.default.NVarChar(100), value: data.phuong_xa },
        { name: 'dia_chi_chi_tiet', type: mssql_1.default.NVarChar(255), value: data.dia_chi_chi_tiet || null },
    ]);
    return result.recordset[0]; // { thong_bao }
}
// LAY DANH SACH NGUOI DUNG (Admin)
async function layDanhSachNguoiDung(tuKhoa, idVaiTro, trang = 1, kichThuocTrang = 20) {
    const result = await (0, database_1.executeProcedure)('sp_lay_danh_sach_nguoi_dung', [
        { name: 'tu_khoa', type: mssql_1.default.NVarChar(255), value: tuKhoa || null },
        { name: 'id_vai_tro', type: mssql_1.default.Int, value: idVaiTro || null },
        { name: 'trang', type: mssql_1.default.Int, value: trang },
        { name: 'kich_thuoc_trang', type: mssql_1.default.Int, value: kichThuocTrang },
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
// TAO TAI KHOAN MOI (Admin tao nhan vien/admin)
async function taoTaiKhoan(data) {
    const pool = await (0, database_1.getPool)();
    // Kiem tra email da ton tai chua
    const existing = await pool.request()
        .input('email', mssql_1.default.VarChar(255), data.email)
        .query('SELECT id_nguoi_dung FROM nguoi_dung WHERE email = @email');
    if (existing.recordset.length > 0) {
        throw { statusCode: 400, message: 'Email này đã được sử dụng.' };
    }
    // Hash mat khau
    const hashedPassword = await bcryptjs_1.default.hash(data.mat_khau, 10);
    // Tao tai khoan
    const result = await pool.request()
        .input('ho_ten', mssql_1.default.NVarChar(100), data.ho_ten)
        .input('email', mssql_1.default.VarChar(255), data.email)
        .input('mat_khau', mssql_1.default.VarChar(255), hashedPassword)
        .input('so_dien_thoai', mssql_1.default.VarChar(10), data.so_dien_thoai)
        .input('id_vai_tro', mssql_1.default.Int, data.id_vai_tro)
        .query(`
      INSERT INTO nguoi_dung (ho_ten, email, mat_khau, so_dien_thoai, id_vai_tro)
      OUTPUT INSERTED.id_nguoi_dung
      VALUES (@ho_ten, @email, @mat_khau, @so_dien_thoai, @id_vai_tro)
    `);
    const newUserId = result.recordset[0].id_nguoi_dung;
    // Tao gio hang cho user moi
    await pool.request()
        .input('id_nguoi_dung', mssql_1.default.Int, newUserId)
        .query('INSERT INTO gio_hang (id_nguoi_dung) VALUES (@id_nguoi_dung)');
    return { id_nguoi_dung: newUserId, id: newUserId };
}
// KHOA / MO KHOA TAI KHOAN (Admin)
async function khoaMoKhoaTaiKhoan(idNguoiDung, khoa) {
    const pool = await (0, database_1.getPool)();
    // Khong cho khoa chinh minh
    const result = await pool.request()
        .input('id', mssql_1.default.Int, idNguoiDung)
        .input('trang_thai', mssql_1.default.Bit, khoa ? 0 : 1)
        .query('UPDATE nguoi_dung SET trang_thai = @trang_thai WHERE id_nguoi_dung = @id');
    if (result.rowsAffected[0] === 0) {
        throw { statusCode: 404, message: 'Không tìm thấy người dùng.' };
    }
    return { thong_bao: khoa ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.' };
}
//# sourceMappingURL=user.service.js.map