import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as cartController from '../controllers/cart.controller';

const router = Router();

// Tất cả route giỏ hàng: đăng nhập + vai trò KHACH_HANG
router.use(authMiddleware, roleMiddleware('KHACH_HANG'));

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:idSach', cartController.updateCartItem);
router.delete('/:idSach', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;