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
exports.searchBooks = searchBooks;
exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.updateBookStatus = updateBookStatus;
exports.getCategories = getCategories;
exports.getPublishers = getPublishers;
const bookService = __importStar(require("../services/book.service"));
// GET /api/books - Tim kiem sach (public)
async function searchBooks(req, res, next) {
    try {
        const { tu_khoa, id_the_loai, id_nha_xuat_ban, gia_tu, gia_den, trang_thai, sap_xep, trang, kich_thuoc_trang, } = req.query;
        const result = await bookService.timKiemSach({
            tu_khoa: tu_khoa,
            id_the_loai: id_the_loai ? parseInt(id_the_loai) : undefined,
            id_nha_xuat_ban: id_nha_xuat_ban ? parseInt(id_nha_xuat_ban) : undefined,
            gia_tu: gia_tu ? parseFloat(gia_tu) : undefined,
            gia_den: gia_den ? parseFloat(gia_den) : undefined,
            trang_thai: trang_thai,
            sap_xep: sap_xep,
            trang: trang ? parseInt(trang) : 1,
            kich_thuoc_trang: kich_thuoc_trang ? parseInt(kich_thuoc_trang) : 12,
        });
        res.json({
            success: true,
            message: 'Tìm kiếm sách thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/books/:id - Chi tiet sach (public)
async function getBookById(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const book = await bookService.laySachTheoId(id);
        res.json({
            success: true,
            message: 'Lấy thông tin sách thành công.',
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}
// POST /api/books - Them sach moi (Admin, co the upload anh)
async function createBook(req, res, next) {
    try {
        const data = req.body;
        // Neu co file upload → gan duong dan anh
        if (req.file) {
            data.anh_bia = `/uploads/books/${req.file.filename}`;
        }
        // Validate co ban
        if (!data.ten_sach || !data.isbn || !data.tac_gia ||
            !data.gia_goc || !data.gia_ban ||
            !data.id_the_loai || !data.id_nha_xuat_ban) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin sách bắt buộc.',
            });
            return;
        }
        const result = await bookService.themSach({
            ...data,
            gia_goc: parseFloat(data.gia_goc),
            gia_ban: parseFloat(data.gia_ban),
            nam_xuat_ban: data.nam_xuat_ban ? parseInt(data.nam_xuat_ban) : undefined,
            so_luong_ton: data.so_luong_ton ? parseInt(data.so_luong_ton) : 0,
            id_the_loai: parseInt(data.id_the_loai),
            id_nha_xuat_ban: parseInt(data.id_nha_xuat_ban),
        }, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Thêm sách thành công.',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
// PUT /api/books/:id - Cap nhat sach (Admin, co the upload anh moi)
async function updateBook(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        // Neu co upload anh moi
        if (req.file) {
            data.anh_bia = `/uploads/books/${req.file.filename}`;
        }
        if (!data.ten_sach || !data.isbn || !data.tac_gia ||
            !data.gia_goc || !data.gia_ban ||
            !data.id_the_loai || !data.id_nha_xuat_ban) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin sách bắt buộc.',
            });
            return;
        }
        const result = await bookService.capNhatSach(id, {
            ...data,
            gia_goc: parseFloat(data.gia_goc),
            gia_ban: parseFloat(data.gia_ban),
            nam_xuat_ban: data.nam_xuat_ban ? parseInt(data.nam_xuat_ban) : undefined,
            id_the_loai: parseInt(data.id_the_loai),
            id_nha_xuat_ban: parseInt(data.id_nha_xuat_ban),
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
// PATCH /api/books/:id/status - Cap nhat trang thai sach (Admin)
async function updateBookStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { trang_thai } = req.body;
        if (!trang_thai) {
            res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp trạng thái mới.',
            });
            return;
        }
        const result = await bookService.capNhatTrangThai(id, trang_thai);
        res.json({
            success: true,
            message: result.thong_bao,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/categories - Danh sach the loai (public)
async function getCategories(_req, res, next) {
    try {
        const categories = await bookService.layDanhSachTheLoai();
        res.json({
            success: true,
            message: 'Lấy danh sách thể loại thành công.',
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/publishers - Danh sach NXB (public)
async function getPublishers(_req, res, next) {
    try {
        const publishers = await bookService.layDanhSachNhaXuatBan();
        res.json({
            success: true,
            message: 'Lấy danh sách nhà xuất bản thành công.',
            data: publishers,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=book.controller.js.map