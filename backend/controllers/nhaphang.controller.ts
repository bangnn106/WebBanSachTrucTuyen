import { Request, Response, NextFunction } from 'express';
import * as nhaphangService from '../services/nhaphang.service';

// POST /api/nhaphang - Tao phieu nhap hang
export async function createImport(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { id_sach, so_luong, don_gia_nhap, ghi_chu } = req.body;

    if (!id_sach || !so_luong) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_sach và so_luong.',
      });
      return;
    }

    const result = await nhaphangService.nhapHang(
      {
        id_sach: parseInt(id_sach),
        so_luong: parseInt(so_luong),
        don_gia_nhap: don_gia_nhap ? parseFloat(don_gia_nhap) : 0,
        ghi_chu,
      },
      req.user!.id
    );

    res.json({
      success: true,
      message: result.thong_bao,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/nhaphang - Lay danh sach phieu nhap
export async function getImports(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const {
      id_sach, tu_ngay, den_ngay, trang, kich_thuoc_trang,
    } = req.query;

    const result = await nhaphangService.layDanhSachNhapHang({
      id_sach: id_sach ? parseInt(id_sach as string) : undefined,
      tu_ngay: tu_ngay as string,
      den_ngay: den_ngay as string,
      trang: trang ? parseInt(trang as string) : 1,
      kich_thuoc_trang: kich_thuoc_trang
        ? parseInt(kich_thuoc_trang as string) : 30,
    });

    res.json({
      success: true,
      message: 'Lấy danh sách phiếu nhập thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
