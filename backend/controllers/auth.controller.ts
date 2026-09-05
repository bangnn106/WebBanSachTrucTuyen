import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// POST /api/auth/register
export async function register(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const {
      ho_ten, email, mat_khau, so_dien_thoai,
      tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
    } = req.body;

    // Validate đầu vào cơ bản
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai ||
        !tinh_thanh || !quan_huyen || !phuong_xa) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
      });
      return;
    }

    const result = await authService.dangKy({
      ho_ten, email, mat_khau, so_dien_thoai,
      tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet,
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công.',
      data: result,
    });
  } catch (error) {
    next(error);   // Chuyển lỗi cho errorHandler xử lý
  }
}

// POST /api/auth/login
export async function login(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu.',
      });
      return;
    }

    const result = await authService.dangNhap({ email, mat_khau });

    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: result,   // { token, user }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me (cần đăng nhập)
export async function getMe(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const user = await authService.layThongTinHienTai(req.user!.email);

    res.json({
      success: true,
      message: 'Lấy thông tin thành công.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}