import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import bookRoutes from './book.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import nhaphangRoutes from './nhaphang.routes';
import dashboardRoutes from './dashboard.routes';

// Import them cho catalog routes
import * as bookController from '../controllers/book.controller';

const router = Router();

// GOM TAT CA ROUTES
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/nhaphang', nhaphangRoutes);
router.use('/dashboard', dashboardRoutes);

// CATALOG ROUTES (public, nam ngoai /books)
router.get('/categories', bookController.getCategories);
router.get('/publishers', bookController.getPublishers);

export default router;