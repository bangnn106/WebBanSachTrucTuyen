import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/user.model';

//Mo rong kieu Request cua Express e them field userdeclare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

//Middleware xac thuc JWT tokenexport function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    //Lay token tu header: Authorization: Bearer <token>    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    //Verify va decode token    const decoded = jwt.verify(token, secret) as JwtPayload;

    //Gan payload vao req.user e cac handler sau dung    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn.',
    });
  }
}