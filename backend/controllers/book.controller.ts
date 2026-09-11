import { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/book.service';

//GET /api/books - Tim kiem sach (public)export async function searchBooks(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const {
      tu_khoa, id_the_loai, id_nha_xuat_ban,
      gia_tu, gia_den, trang_thai, sap_xep,
      trang, kich_thuoc_trang,
    } = req.query;

    const result = await bookService.timKiemSach({
      tu_khoa: tu_khoa as string,
      id_the_loai: id_the_loai ? parseInt(id_the_loai as string) : undefined,
      id_nha_xuat_ban: id_nha_xuat_ban ? parseInt(id_nha_xuat_ban as string) : undefined,
      gia_tu: gia_tu ? parseFloat(gia_tu as string) : undefined,
      gia_den: gia_den ? parseFloat(gia_den as string) : undefined,
      trang_thai: trang_thai as string,
      sap_xep: sap_xep as string,
      trang: trang ? parseInt(trang as string) : 1,
      kich_thuoc_trang: kich_thuoc_trang ? parseInt(kich_thuoc_trang as string) : 12,
    });

    res.json({
      success: true,
      message: 'Tìm kiếm sách thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

//GET /api/books/:id - Chi tiet sach (public)export async function getBookById(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const book = await bookService.laySachTheoId(id);

    res.json({
      success: true,
      message: 'Lấy thông tin sách thành công.',
      data: book,
    });
  } catch (error) {
    next(error);
  }
}

//POST /api/books - Them sach moi (Admin, co the upload anh)export async function createBook(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const data = req.body;

    //Neu co file upload gan uong dan anh    if (req.file) {
      data.anh_bia = `/uploads/books/${req.file.filename}`;
    }

    //Validate co ban    if (!data.ten_sach || !data.isbn || !data.tac_gia ||
        !data.gia_goc || !data.gia_ban ||
        !data.id_the_loai || !data.id_nha_xuat_ban) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin sách bắt buộc.',
      });
      return;
    }

    const result = await bookService.themSach(
      {
        ...data,
        gia_goc: parseFloat(data.gia_goc),
        gia_ban: parseFloat(data.gia_ban),
        nam_xuat_ban: data.nam_xuat_ban ? parseInt(data.nam_xuat_ban) : undefined,
        so_luong_ton: data.so_luong_ton ? parseInt(data.so_luong_ton) : 0,
        id_the_loai: parseInt(data.id_the_loai),
        id_nha_xuat_ban: parseInt(data.id_nha_xuat_ban),
      },
      req.user!.id
    );

    res.status(201).json({
      success: true,
      message: 'Thêm sách thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

//PUT /api/books/:id - Cap nhat sach (Admin, co the upload anh moi)export async function updateBook(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    //Neu co upload anh moi    if (req.file) {
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
  } catch (error) {
    next(error);
  }
}

//PATCH /api/books/:id/status - Cap nhat trang thai sach (Admin)export async function updateBookStatus(
  req: Request, res: Response, next: NextFunction
) {
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
  } catch (error) {
    next(error);
  }
}

//GET /api/categories - Danh sach the loai (public)export async function getCategories(
  _req: Request, res: Response, next: NextFunction
) {
  try {
    const categories = await bookService.layDanhSachTheLoai();
    res.json({
      success: true,
      message: 'Lấy danh sách thể loại thành công.',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

//GET /api/publishers - Danh sach NXB (public)export async function getPublishers(
  _req: Request, res: Response, next: NextFunction
) {
  try {
    const publishers = await bookService.layDanhSachNhaXuatBan();
    res.json({
      success: true,
      message: 'Lấy danh sách nhà xuất bản thành công.',
      data: publishers,
    });
  } catch (error) {
    next(error);
  }
}