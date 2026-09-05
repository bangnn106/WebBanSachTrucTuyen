import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/user.model';

// Mở rộng kiểu Request của Express để thêm field user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware xác thực JWT token
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Lấy token từ header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    // Verify và decode token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Gắn payload vào req.user để các handler sau dùng
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn.',
    });
  }
}