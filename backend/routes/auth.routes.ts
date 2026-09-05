import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;