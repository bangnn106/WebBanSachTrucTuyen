import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

// PUT /api/users/me - Cập nhật profile bản thân
export async function updateProfile(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const {
      ho_ten, email, so_dien_thoai,
      tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
    } = req.body;

    if (!ho_ten || !email || !so_dien_thoai ||
        !tinh_thanh || !quan_huyen || !phuong_xa) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
      });
      return;
    }

    const result = await userService.capNhatNguoiDung(req.user!.id, {
      ho_ten, email, so_dien_thoai,
      tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
    });

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/users - Lấy danh sách user (Admin only)
export async function getUsers(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { tu_khoa, id_vai_tro, trang, kich_thuoc_trang } = req.query;

    const result = await userService.layDanhSachNguoiDung(
      tu_khoa as string | undefined,
      id_vai_tro ? parseInt(id_vai_tro as string) : undefined,
      trang ? parseInt(trang as string) : 1,
      kich_thuoc_trang ? parseInt(kich_thuoc_trang as string) : 20
    );

    res.json({
      success: true,
      message: 'Lấy danh sách người dùng thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}