"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBookImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Dam bao thu muc upload ton tai
const uploadDir = path_1.default.join(__dirname, '..', 'public', 'uploads', 'books');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Cau hinh noi luu file va ten file
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Tao ten file unique: timestamp-random.extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
    },
});
// Chi cho phep upload file anh
const fileFilter = (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // chap nhan file
    }
    else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp).'));
    }
};
// Export middleware: upload 1 anh, field name 'anh_bia', max 5MB
exports.uploadBookImage = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('anh_bia');
//# sourceMappingURL=uploadMiddleware.js.map