"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware xac thuc JWT token
function authMiddleware(req, res, next) {
    try {
        // Lay token tu header: Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục.',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'default_secret';
        // Verify va decode token
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Gan payload vao req.user de cac handler sau dung
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
    }
}
//# sourceMappingURL=authMiddleware.js.map