import { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../services/inventory.service';

// POST /api/inventory/import - Nhập kho
export async function importStock(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { id_sach, so_luong, ly_do } = req.body;

    if (!id_sach || !so_luong) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_sach và so_luong.',
      });
      return;
    }

    const result = await inventoryService.nhapKho(
      { id_sach: parseInt(id_sach), so_luong: parseInt(so_luong), ly_do },
      req.user!.id
    );

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/inventory/adjust - Điều chỉnh kho
export async function adjustStock(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { id_sach, so_luong_thay_doi, ly_do } = req.body;

    if (!id_sach || so_luong_thay_doi === undefined || !ly_do) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_sach, so_luong_thay_doi và ly_do.',
      });
      return;
    }

    const result = await inventoryService.dieuChinhKho(
      {
        id_sach: parseInt(id_sach),
        so_luong_thay_doi: parseInt(so_luong_thay_doi),
        ly_do,
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

// GET /api/inventory/history - Lịch sử kho
export async function getHistory(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const {
      id_sach, loai_giao_dich, tu_ngay, den_ngay, trang, kich_thuoc_trang,
    } = req.query;

    const result = await inventoryService.layLichSuKho({
      id_sach: id_sach ? parseInt(id_sach as string) : undefined,
      loai_giao_dich: loai_giao_dich as string,
      tu_ngay: tu_ngay as string,
      den_ngay: den_ngay as string,
      trang: trang ? parseInt(trang as string) : 1,
      kich_thuoc_trang: kich_thuoc_trang
        ? parseInt(kich_thuoc_trang as string) : 30,
    });

    res.json({
      success: true,
      message: 'Lấy lịch sử kho thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}