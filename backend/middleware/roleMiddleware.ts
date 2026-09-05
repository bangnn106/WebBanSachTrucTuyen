import { Request, Response, NextFunction } from 'express';

// Factory function: tạo middleware kiểm tra vai trò
// Cách dùng: roleMiddleware('QUAN_TRI_VIEN', 'NHAN_VIEN')
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Phải qua authMiddleware trước rồi mới tới đây
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Chưa xác thực người dùng.',
      });
      return;
    }

    // Kiểm tra vai trò của user có nằm trong danh sách được phép không
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