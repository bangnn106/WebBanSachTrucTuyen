"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const index_1 = __importDefault(require("./routes/index"));
// Load bien moi truong tu file .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// MIDDLEWARES
// Cho phep frontend goi API (CORS)
app.use((0, cors_1.default)());
// Parse JSON body
app.use(express_1.default.json());
// Parse URL-encoded body (form submit)
app.use(express_1.default.urlencoded({ extended: true }));
// Phuc vu file tinh (anh bia sach da upload)
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// ROUTES
// Mount tat ca API routes duoi prefix /api
app.use('/api', index_1.default);
// Route kiem tra server hoat dong
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'API Website Bán Sách Trực Tuyến đang hoạt động! 📚',
    });
});
// ERROR HANDLER
// QUAN TRONG: Phai dat SAU tat ca routes
app.use(errorHandler_1.errorHandler);
// KHOI DONG SERVER
async function startServer() {
    try {
        // Ket noi database truoc khi lang nghe port
        await (0, database_1.getPool)();
        app.listen(PORT, () => {
            console.log(`\n🚀 Server đang chạy tại: http://localhost:${PORT}`);
            console.log(`📚 API endpoint:  http://localhost:${PORT}/api`);
            console.log(`📂 Static files:  http://localhost:${PORT}/uploads\n`);
        });
    }
    catch (error) {
        console.error('❌ Không thể khởi động server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map