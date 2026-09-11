import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Dam bao thu muc upload ton tai
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'books');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cau hinh noi luu file va ten file
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Tao ten file unique: timestamp-random.extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

// Chi cho phep upload file anh
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);    // chap nhan file
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp).'));
  }
};

// Export middleware: upload 1 anh, field name 'anh_bia', max 5MB
export const uploadBookImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
}).single('anh_bia');