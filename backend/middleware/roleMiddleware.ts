import { Request, Response, NextFunction } from 'express';

// Factory function: tao middleware kiem tra vai tro
// Cach dung: roleMiddleware('QUAN_TRI_VIEN', 'NHAN_VIEN')
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Phai qua authMiddleware truoc roi moi toi day
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Chưa xác thực người dùng.',
      });
      return;
    }

    // Kiem tra vai tro cua user co nam trong danh sach duoc phep khong
    if (!allowedRoles.includes(req.user.ten_vai_tro)) {
      res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập chức năng này.',
      });
      return;
    }

    next();
  };
}