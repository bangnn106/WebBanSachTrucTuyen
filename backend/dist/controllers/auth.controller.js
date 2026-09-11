"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
const authService = __importStar(require("../services/auth.service"));
// POST /api/auth/register
async function register(req, res, next) {
    try {
        const { ho_ten, email, mat_khau, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, } = req.body;
        // Validate dau vao co ban
        if (!ho_ten || !email || !mat_khau || !so_dien_thoai ||
            !tinh_thanh || !quan_huyen || !phuong_xa) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
            });
            return;
        }
        const result = await authService.dangKy({
            ho_ten, email, mat_khau, so_dien_thoai,
            tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
        });
        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error); // Chuyen loi cho errorHandler xu ly
    }
}
// POST /api/auth/login
async function login(req, res, next) {
    try {
        const { email, mat_khau } = req.body;
        if (!email || !mat_khau) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email và mật khẩu.',
            });
            return;
        }
        const result = await authService.dangNhap({ email, mat_khau });
        res.json({
            success: true,
            message: 'Đăng nhập thành công.',
            data: result, // { token, user }
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/auth/me (can dang nhap)
async function getMe(req, res, next) {
    try {
        const user = await authService.layThongTinHienTai(req.user.email);
        res.json({
            success: true,
            message: 'Lấy thông tin thành công.',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map