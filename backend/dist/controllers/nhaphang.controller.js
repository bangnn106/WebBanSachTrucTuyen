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
exports.createImport = createImport;
exports.getImports = getImports;
const nhaphangService = __importStar(require("../services/nhaphang.service"));
// POST /api/nhaphang - Tao phieu nhap hang
async function createImport(req, res, next) {
    try {
        const { id_sach, so_luong, don_gia_nhap, ghi_chu } = req.body;
        if (!id_sach || !so_luong) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp id_sach và so_luong.',
            });
            return;
        }
        const result = await nhaphangService.nhapHang({
            id_sach: parseInt(id_sach),
            so_luong: parseInt(so_luong),
            don_gia_nhap: don_gia_nhap ? parseFloat(don_gia_nhap) : 0,
            ghi_chu,
        }, req.user.id);
        res.json({
            success: true,
            message: result.thong_bao,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/nhaphang - Lay danh sach phieu nhap
async function getImports(req, res, next) {
    try {
        const { id_sach, tu_ngay, den_ngay, trang, kich_thuoc_trang, } = req.query;
        const result = await nhaphangService.layDanhSachNhapHang({
            id_sach: id_sach ? parseInt(id_sach) : undefined,
            tu_ngay: tu_ngay,
            den_ngay: den_ngay,
            trang: trang ? parseInt(trang) : 1,
            kich_thuoc_trang: kich_thuoc_trang
                ? parseInt(kich_thuoc_trang) : 30,
        });
        res.json({
            success: true,
            message: 'Lấy danh sách phiếu nhập thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=nhaphang.controller.js.map