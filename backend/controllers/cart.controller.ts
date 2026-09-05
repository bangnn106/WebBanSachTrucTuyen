import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';

// GET /api/cart - Lấy giỏ hàng
export async function getCart(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const items = await cartService.layChiTietGioHang(req.user!.id);
    res.json({
      success: true,
      message: 'Lấy giỏ hàng thành công.',
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/cart - Thêm sách vào giỏ
export async function addToCart(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { id_sach, so_luong } = req.body;

    if (!id_sach || !so_luong) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_sach và so_luong.',
      });
      return;
    }

    const result = await cartService.themSachVaoGio(
      req.user!.id,
      parseInt(id_sach),
      parseInt(so_luong)
    );

    res.status(201).json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/cart/:idSach - Cập nhật số lượng
export async function updateCartItem(
  req: Request, res: Response, next: NextFunction
) {
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

    const result = await cartService.capNhatSoLuongGio(
      req.user!.id,
      idSach,
      parseInt(so_luong)
    );

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cart/:idSach - Xóa 1 sách khỏi giỏ
export async function removeFromCart(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const idSach = parseInt(req.params.idSach);
    const result = await cartService.xoaSachKhoiGio(req.user!.id, idSach);

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cart - Xóa toàn bộ giỏ
export async function clearCart(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const result = await cartService.xoaToanBoGioHang(req.user!.id);
    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}