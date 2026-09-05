import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import bookRoutes from './book.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import inventoryRoutes from './inventory.routes';
import dashboardRoutes from './dashboard.routes';

// Import thêm cho catalog routes
import * as bookController from '../controllers/book.controller';

const router = Router();

// ===== GOM TẤT CẢ ROUTES =====
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/dashboard', dashboardRoutes);

// ===== CATALOG ROUTES (public, nằm ngoài /books) =====
router.get('/categories', bookController.getCategories);
router.get('/publishers', bookController.getPublishers);

export default router;