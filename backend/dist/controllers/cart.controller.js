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
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.updateCartItem = updateCartItem;
exports.removeFromCart = removeFromCart;
exports.clearCart = clearCart;
const cartService = __importStar(require("../services/cart.service"));
// GET /api/cart - Lay gio hang
async function getCart(req, res, next) {
    try {
        const items = await cartService.layChiTietGioHang(req.user.id);
        res.json({
            success: true,
            message: 'Lấy giỏ hàng thành công.',
            data: items,
        });
    }
    catch (error) {
        next(error);
    }
}
// POST /api/cart - Them sach vao gio
async function addToCart(req, res, next) {
    try {
        const { id_sach, so_luong } = req.body;
        if (!id_sach || !so_luong) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp id_sach và so_luong.',
            });
            return;
        }
        const result = await cartService.themSachVaoGio(req.user.id, parseInt(id_sach), parseInt(so_luong));
        res.status(201).json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// PUT /api/cart/:idSach - Cap nhat so luong
async function updateCartItem(req, res, next) {
    try {
        const idSach = parseInt(req.params.idSach);
        const { so_luong } = req.body;
        if (!so_luong) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp so_luong.',
            });
            return;
        }
        const result = await cartService.capNhatSoLuongGio(req.user.id, idSach, parseInt(so_luong));
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// DELETE /api/cart/:idSach - Xoa 1 sach khoi gio
async function removeFromCart(req, res, next) {
    try {
        const idSach = parseInt(req.params.idSach);
        const result = await cartService.xoaSachKhoiGio(req.user.id, idSach);
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// DELETE /api/cart - Xoa toan bo gio
async function clearCart(req, res, next) {
    try {
        const result = await cartService.xoaToanBoGioHang(req.user.id);
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=cart.controller.js.map