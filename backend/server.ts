import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { getPool } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';

// Load bien moi truong tu file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// Cho phep frontend goi API (CORS)
app.use(cors());

// Parse Json body
app.use(express.json());

// Parse URL-encoded body (form submit)
app.use(express.urlencoded({ extended: true }));

// Phuc vu file tinh (anh bia sach da upload)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
// Mount tat ca API routes duoi prefix /api
app.use('/api', apiRoutes);
// Route kiem tra server hoat dong
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API Website Bán Sách Trực Tuyến đang hoạt động!',
  });
});


app.use(errorHandler);

// Khoi dong server
async function startServer() {
  try {
    // Ket noi database truoc khi lang nghe port
    await getPool();
    app.listen(PORT, () => {
      console.log(`\nServer đang chạy tại: http://localhost:${PORT}`);
      console.log(`API endpoint:  http://localhost:${PORT}/api`);
      console.log(`Static files:  http://localhost:${PORT}/uploads\n`);
    });
  } catch (error) {
    console.error('Không thể khởi động server:', error);
    process.exit(1);
  }
}

startServer();