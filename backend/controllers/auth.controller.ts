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

    // Validate dau vao co ban
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
    next(error);   // Chuyen loi cho errorHandler xu ly
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

// GET /api/auth/me (can dang nhap)
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

// POST /api/auth/change-password
export async function changePassword(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { mat_khau_cu, mat_khau_moi } = req.body;

    if (!mat_khau_cu || !mat_khau_moi) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.',
      });
      return;
    }

    if (mat_khau_moi.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      });
      return;
    }

    const result = await authService.doiMatKhau(req.user!.email, mat_khau_cu, mat_khau_moi);
    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}