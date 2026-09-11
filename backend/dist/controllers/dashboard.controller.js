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
exports.getOverview = getOverview;
exports.getRevenue = getRevenue;
exports.getTopBooks = getTopBooks;
exports.getOrderStats = getOrderStats;
const dashboardService = __importStar(require("../services/dashboard.service"));
// GET /api/dashboard/overview
async function getOverview(req, res, next) {
    try {
        const { tu_ngay, den_ngay } = req.query;
        const data = await dashboardService.tongQuan(tu_ngay, den_ngay);
        res.json({
            success: true,
            message: 'Lấy tổng quan dashboard thành công.',
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/dashboard/revenue
async function getRevenue(req, res, next) {
    try {
        const { tu_ngay, den_ngay, kieu_thong_ke } = req.query;
        const data = await dashboardService.doanhThu(tu_ngay, den_ngay, kieu_thong_ke || 'NGAY');
        res.json({
            success: true,
            message: 'Lấy thống kê doanh thu thành công.',
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/dashboard/top-books
async function getTopBooks(req, res, next) {
    try {
        const { so_luong_top } = req.query;
        const data = await dashboardService.topSachBanChay(so_luong_top ? parseInt(so_luong_top) : 10);
        res.json({
            success: true,
            message: 'Lấy top sách bán chạy thành công.',
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/dashboard/order-stats
async function getOrderStats(req, res, next) {
    try {
        const { tu_ngay, den_ngay } = req.query;
        const data = await dashboardService.donHangTheoTrangThai(tu_ngay, den_ngay);
        res.json({
            success: true,
            message: 'Lấy thống kê đơn hàng thành công.',
            data,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=dashboard.controller.js.map