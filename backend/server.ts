import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { getPool } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';

// Load biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARES ==========

// Cho phép frontend gọi API (CORS)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body (form submit)
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (ảnh bìa sách đã upload)
app.use(express.static(path.join(__dirname, 'public')));

// ========== ROUTES ==========

// Mount tất cả API routes dưới prefix /api
app.use('/api', apiRoutes);

// Route kiểm tra server hoạt động
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API Website Bán Sách Trực Tuyến đang hoạt động! 📚',
  });
});

// ========== ERROR HANDLER ==========
// QUAN TRỌNG: Phải đặt SAU tất cả routes
app.use(errorHandler);

// ========== KHỞI ĐỘNG SERVER ==========
async function startServer() {
  try {
    // Kết nối database trước khi lắng nghe port
    await getPool();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📚 API endpoint:  http://localhost:${PORT}/api`);
      console.log(`📂 Static files:  http://localhost:${PORT}/uploads\n`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

startServer();