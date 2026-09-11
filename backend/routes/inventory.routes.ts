import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as inventoryController from '../controllers/inventory.controller';

const router = Router();

// Tat ca route kho: dang nhap + nhan vien hoac admin
router.use(authMiddleware, roleMiddleware('NHAN_VIEN', 'QUAN_TRI_VIEN'));

router.post('/import', inventoryController.importStock);
router.post('/adjust', inventoryController.adjustStock);
router.get('/history', inventoryController.getHistory);

export default router;