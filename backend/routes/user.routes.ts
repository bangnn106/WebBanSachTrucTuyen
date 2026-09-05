import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as userController from '../controllers/user.controller';

const router = Router();

// Cập nhật profile bản thân (tất cả user đã đăng nhập)
router.put('/me', authMiddleware, userController.updateProfile);

// Lấy danh sách user (Admin only)
router.get(
  '/',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  userController.getUsers
);

export default router;