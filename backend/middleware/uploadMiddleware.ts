import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Đảm bảo thư mục upload tồn tại
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'books');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Tạo tên file unique: timestamp-random.extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

// Chỉ cho phép upload file ảnh
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);    // chấp nhận file
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp).'));
  }
};

// Export middleware: upload 1 ảnh, field name = 'anh_bia', max 5MB
export const uploadBookImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
}).single('anh_bia');