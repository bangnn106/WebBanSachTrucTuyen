import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

// Tất cả route đơn hàng đều cần đăng nhập
router.use(authMiddleware);

// Tạo đơn hàng (chỉ khách hàng)
router.post('/', roleMiddleware('KHACH_HANG'), orderController.createOrder);

// Xem danh sách & chi tiết (tất cả role, logic phân quyền trong controller)
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// Cập nhật trạng thái (nhân viên/admin)
router.patch(
  '/:id/status',
  roleMiddleware('NHAN_VIEN', 'QUAN_TRI_VIEN'),
  orderController.updateOrderStatus
);

// Hủy đơn (tất cả role, logic kiểm tra trong SP)
router.patch('/:id/cancel', orderController.cancelOrder);

export default router;