import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as cartController from '../controllers/cart.controller';

const router = Router();

// Tat ca route gio hang: dang nhap + vai tro KHACH_HANG
router.use(authMiddleware, roleMiddleware('KHACH_HANG'));

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:idSach', cartController.updateCartItem);
router.delete('/:idSach', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;