import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as userController from '../controllers/user.controller';

const router = Router();

//Cap nhat profile ban than (tat ca user a ang nhap)router.put('/me', authMiddleware, userController.updateProfile);

//Lay danh sach user (Admin only)router.get(
  '/',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  userController.getUsers
);

//Tao tai khoan moi (Admin only)router.post(
  '/',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  userController.createUser
);

//Khoa/mo khoa tai khoan (Admin only)router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  userController.toggleUserStatus
);

export default router;