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
exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.cancelOrder = cancelOrder;
const orderService = __importStar(require("../services/order.service"));
const mail_1 = require("../config/mail");
const mailTemplates_1 = require("../views/mailTemplates");
const user_model_1 = require("../models/user.model");
// POST /api/orders - Tao don hang tu gio (khach hang)
async function createOrder(req, res, next) {
    try {
        const { ten_nguoi_nhan, so_dien_thoai_nhan, dia_chi_giao_hang, ghi_chu } = req.body;
        if (!ten_nguoi_nhan || !so_dien_thoai_nhan || !dia_chi_giao_hang) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin giao hàng.',
            });
            return;
        }
        const result = await orderService.taoDonHangTuGio(req.user.id, {
            ten_nguoi_nhan, so_dien_thoai_nhan, dia_chi_giao_hang, ghi_chu,
        });
        // Gui email xac nhan don hang (khong cho ket qua, khong crash neu loi)
        try {
            const detail = await orderService.layChiTietDonHang(result.id_don_hang, null);
            await (0, mail_1.sendMail)(req.user.email, `Xác nhận đơn hàng ${result.ma_don_hang}`, (0, mailTemplates_1.orderConfirmationTemplate)({
                ma_don_hang: result.ma_don_hang,
                ten_nguoi_nhan,
                dia_chi_giao_hang,
                so_dien_thoai_nhan,
                tong_tien: result.tong_tien,
                ngay_dat: new Date().toLocaleString('vi-VN'),
                chi_tiet: detail.chi_tiet,
            }));
        }
        catch {
            // Email loi khong anh huong response
        }
        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/orders - Danh sach don hang
async function getOrders(req, res, next) {
    try {
        const { tu_khoa, trang_thai, tu_ngay, den_ngay, trang, kich_thuoc_trang } = req.query;
        // KHACH_HANG chi xem don cua minh, NHAN_VIEN/ADMIN xem tat ca
        const idNguoiDung = req.user.ten_vai_tro === user_model_1.VaiTro.KHACH_HANG ? req.user.id : null;
        const result = await orderService.layDanhSachDonHang(idNguoiDung, {
            tu_khoa: tu_khoa,
            trang_thai: trang_thai,
            tu_ngay: tu_ngay,
            den_ngay: den_ngay,
            trang: trang ? parseInt(trang) : 1,
            kich_thuoc_trang: kich_thuoc_trang ? parseInt(kich_thuoc_trang) : 20,
        });
        res.json({
            success: true,
            message: 'Lấy danh sách đơn hàng thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/orders/:id - Chi tiet don hang
async function getOrderById(req, res, next) {
    try {
        const idDonHang = parseInt(req.params.id);
        // KHACH_HANG chi xem don cua minh
        const idNguoiDung = req.user.ten_vai_tro === user_model_1.VaiTro.KHACH_HANG ? req.user.id : null;
        const result = await orderService.layChiTietDonHang(idDonHang, idNguoiDung);
        res.json({
            success: true,
            message: 'Lấy chi tiết đơn hàng thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// PATCH /api/orders/:id/status - Cap nhat trang thai (nhan vien/admin)
async function updateOrderStatus(req, res, next) {
    try {
        const idDonHang = parseInt(req.params.id);
        const { trang_thai_moi } = req.body;
        if (!trang_thai_moi) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp trạng thái mới.',
            });
            return;
        }
        const result = await orderService.capNhatTrangThaiDonHang(idDonHang, trang_thai_moi);
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// PATCH /api/orders/:id/cancel - Huy don hang
async function cancelOrder(req, res, next) {
    try {
        const idDonHang = parseInt(req.params.id);
        const { ly_do } = req.body;
        const result = await orderService.huyDonHang(idDonHang, req.user.id, ly_do);
        // Gui email thong bao huy don
        try {
            const detail = await orderService.layChiTietDonHang(idDonHang, null);
            if (detail.don_hang?.email) {
                await (0, mail_1.sendMail)(detail.don_hang.email, `Đơn hàng ${detail.don_hang.ma_don_hang} đã bị hủy`, (0, mailTemplates_1.orderCancelledTemplate)({
                    ma_don_hang: detail.don_hang.ma_don_hang,
                    ten_nguoi_nhan: detail.don_hang.ten_nguoi_nhan,
                    tong_tien: detail.don_hang.tong_tien,
                    ly_do: ly_do || 'Không có lý do cụ thể',
                }));
            }
        }
        catch {
            // Email loi khong anh huong response
        }
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.controller.js.map