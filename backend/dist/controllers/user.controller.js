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
exports.updateProfile = updateProfile;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.toggleUserStatus = toggleUserStatus;
const userService = __importStar(require("../services/user.service"));
// PUT /api/users/me - Cap nhat profile ban than
async function updateProfile(req, res, next) {
    try {
        const { ho_ten, email, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, } = req.body;
        if (!ho_ten || !email || !so_dien_thoai ||
            !tinh_thanh || !quan_huyen || !phuong_xa) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
            });
            return;
        }
        const result = await userService.capNhatNguoiDung(req.user.id, {
            ho_ten, email, so_dien_thoai,
            tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
        });
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/users - Lay danh sach user (Admin only)
async function getUsers(req, res, next) {
    try {
        const { tu_khoa, id_vai_tro, trang, kich_thuoc_trang } = req.query;
        const result = await userService.layDanhSachNguoiDung(tu_khoa, id_vai_tro ? parseInt(id_vai_tro) : undefined, trang ? parseInt(trang) : 1, kich_thuoc_trang ? parseInt(kich_thuoc_trang) : 20);
        res.json({
            success: true,
            message: 'Lấy danh sách người dùng thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// POST /api/users - Tao tai khoan moi (Admin only)
async function createUser(req, res, next) {
    try {
        const { ho_ten, email, mat_khau, so_dien_thoai, id_vai_tro } = req.body;
        if (!ho_ten || !email || !mat_khau || !so_dien_thoai || !id_vai_tro) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
            return;
        }
        // Chi cho tao nhan vien (2) hoac admin (3)
        if (![2, 3].includes(Number(id_vai_tro))) {
            res.status(400).json({
                success: false,
                message: 'Chỉ được tạo tài khoản Nhân viên hoặc Quản trị viên.',
            });
            return;
        }
        const result = await userService.taoTaiKhoan({
            ho_ten, email, mat_khau, so_dien_thoai,
            id_vai_tro: Number(id_vai_tro),
        });
        res.status(201).json({
            success: true,
            message: 'Tạo tài khoản thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// PATCH /api/users/:id/status - Khoa/mo khoa tai khoan (Admin only)
async function toggleUserStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { khoa } = req.body; // true: khoa, false: mo khoa
        if (id === req.user.id) {
            res.status(400).json({
                success: false,
                message: 'Không thể khóa chính tài khoản của bạn.',
            });
            return;
        }
        const result = await userService.khoaMoKhoaTaiKhoan(id, khoa);
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.controller.js.map