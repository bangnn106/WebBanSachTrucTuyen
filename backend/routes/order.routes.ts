import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

// Tat ca route don hang deu can dang nhap
router.use(authMiddleware);

// Tao don hang (chi khach hang)
router.post('/', roleMiddleware('KHACH_HANG'), orderController.createOrder);

// Xem danh sach & chi tiet (tat ca role, logic phan quyen trong controller)
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// Cap nhat trang thai (nhan vien/admin)
router.patch(
  '/:id/status',
  roleMiddleware('NHAN_VIEN', 'QUAN_TRI_VIEN'),
  orderController.updateOrderStatus
);

// Huy don (tat ca role, logic kiem tra trong SP)
router.patch('/:id/cancel', orderController.cancelOrder);

export default router;