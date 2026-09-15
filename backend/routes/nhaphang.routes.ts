import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as nhaphangController from '../controllers/nhaphang.controller';

const router = Router();

// Tat ca route nhap hang: dang nhap + nhan vien hoac admin
router.use(authMiddleware, roleMiddleware('NHAN_VIEN', 'QUAN_TRI_VIEN'));

router.post('/', nhaphangController.createImport);
router.get('/', nhaphangController.getImports);

export default router;
