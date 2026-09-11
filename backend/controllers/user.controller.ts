import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

//PUT /api/users/me - Cap nhat profile ban thanexport async function updateProfile(
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

//GET /api/users - Lay danh sach user (Admin only)export async function getUsers(
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

//POST /api/users - Tao tai khoan moi (Admin only)export async function createUser(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai, id_vai_tro } = req.body;

    if (!ho_ten || !email || !mat_khau || !so_dien_thoai || !id_vai_tro) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }

    //Chi cho tao nhan vien (2) hoac admin (3)    if (![2, 3].includes(Number(id_vai_tro))) {
      res.status(400).json({
        success: false,
        message: 'Chỉ được tạo tài khoản Nhân viên hoặc Quản trị viên.',
      });
      return;
    }

    const result = await userService.taoTaiKhoan({
      ho_ten, email, mat_khau, so_dien_thoai,
      id_vai_tro: Number(id_vai_tro),
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

//PATCH /api/users/:id/status - Khoa/mo khoa tai khoan (Admin only)export async function toggleUserStatus(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const { khoa } = req.body; //true khoa, false mo khoa
    if (id === req.user!.id) {
      res.status(400).json({
        success: false,
        message: 'Không thể khóa chính tài khoản của bạn.',
      });
      return;
    }

    const result = await userService.khoaMoKhoaTaiKhoan(id, khoa);

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}