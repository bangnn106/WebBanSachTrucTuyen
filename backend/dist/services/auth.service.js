"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dangKy = dangKy;
exports.dangNhap = dangNhap;
exports.layThongTinHienTai = layThongTinHienTai;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// TAO JWT TOKEN
function taoToken(payload) {
    return jsonwebtoken_1.default.sign({
        id: payload.id,
        email: payload.email,
        id_vai_tro: payload.id_vai_tro,
        ten_vai_tro: payload.ten_vai_tro,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
// DANG KY TAI KHOAN MOI
async function dangKy(data) {
    // 1. Hash mat khau truoc khi luu vao DB
    const hashedPassword = await bcryptjs_1.default.hash(data.mat_khau, 10);
    // 2. Goi SP dang ky (SP tu tao gio hang)
    const result = await (0, database_1.executeProcedure)('sp_dang_ky_nguoi_dung', [
        { name: 'ho_ten', type: mssql_1.default.NVarChar(100), value: data.ho_ten },
        { name: 'email', type: mssql_1.default.VarChar(255), value: data.email },
        { name: 'mat_khau', type: mssql_1.default.VarChar(255), value: hashedPassword },
        { name: 'so_dien_thoai', type: mssql_1.default.VarChar(10), value: data.so_dien_thoai },
        { name: 'tinh_thanh', type: mssql_1.default.NVarChar(100), value: data.tinh_thanh },
        { name: 'quan_huyen', type: mssql_1.default.NVarChar(100), value: data.quan_huyen },
        { name: 'phuong_xa', type: mssql_1.default.NVarChar(100), value: data.phuong_xa },
        { name: 'dia_chi_chi_tiet', type: mssql_1.default.NVarChar(255), value: data.dia_chi_chi_tiet || null },
    ]);
    return result.recordset[0]; // { id_nguoi_dung, thong_bao }
}
// DANG NHAP
async function dangNhap(data) {
    // 1. Tim user theo email
    const result = await (0, database_1.executeProcedure)('sp_lay_nguoi_dung_theo_email', [
        { name: 'email', type: mssql_1.default.VarChar(255), value: data.email },
    ]);
    if (result.recordset.length === 0) {
        throw { statusCode: 401, message: 'Email hoặc mật khẩu không đúng.' };
    }
    const user = result.recordset[0];
    // 2. So sanh mat khau voi hash trong DB
    const isMatch = await bcryptjs_1.default.compare(data.mat_khau, user.mat_khau);
    if (!isMatch) {
        throw { statusCode: 401, message: 'Email hoặc mật khẩu không đúng.' };
    }
    // 3. Tao JWT token
    const token = taoToken({
        id: user.id,
        email: user.email,
        id_vai_tro: user.id_vai_tro,
        ten_vai_tro: user.ten_vai_tro,
    });
    // 4. Tra token + info user (KHONG tra mat khau)
    return {
        token,
        user: {
            id: user.id,
            ho_ten: user.ho_ten,
            email: user.email,
            so_dien_thoai: user.so_dien_thoai,
            tinh_thanh: user.tinh_thanh,
            quan_huyen: user.quan_huyen,
            phuong_xa: user.phuong_xa,
            dia_chi_chi_tiet: user.dia_chi_chi_tiet,
            ten_vai_tro: user.ten_vai_tro,
        },
    };
}
// LAY THONG TIN USER HIEN TAI (tu token)
async function layThongTinHienTai(email) {
    const result = await (0, database_1.executeProcedure)('sp_lay_nguoi_dung_theo_email', [
        { name: 'email', type: mssql_1.default.VarChar(255), value: email },
    ]);
    if (result.recordset.length === 0) {
        throw { statusCode: 404, message: 'Không tìm thấy người dùng.' };
    }
    const user = result.recordset[0];
    // Loai bo mat khau truoc khi tra ve
    const { mat_khau, ...userInfo } = user;
    return userInfo;
}
//# sourceMappingURL=auth.service.js.map