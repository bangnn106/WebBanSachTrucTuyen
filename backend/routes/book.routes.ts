import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { uploadBookImage } from '../middleware/uploadMiddleware';
import * as bookController from '../controllers/book.controller';

const router = Router();

// ===== PUBLIC ROUTES (không cần đăng nhập) =====
router.get('/', bookController.searchBooks);
router.get('/:id', bookController.getBookById);

// ===== ADMIN ROUTES =====
router.post(
  '/',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  uploadBookImage,
  bookController.createBook
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  uploadBookImage,
  bookController.updateBook
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('QUAN_TRI_VIEN'),
  bookController.updateBookStatus
);

export default router;