import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

// Tất cả route dashboard: chỉ Admin
router.use(authMiddleware, roleMiddleware('QUAN_TRI_VIEN'));

router.get('/overview', dashboardController.getOverview);
router.get('/revenue', dashboardController.getRevenue);
router.get('/top-books', dashboardController.getTopBooks);
router.get('/order-stats', dashboardController.getOrderStats);

export default router;