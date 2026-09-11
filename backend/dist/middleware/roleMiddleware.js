"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
// Factory function: tao middleware kiem tra vai tro
// Cach dung: roleMiddleware('QUAN_TRI_VIEN', 'NHAN_VIEN')
function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        // Phai qua authMiddleware truoc roi moi toi day
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Chưa xác thực người dùng.',
            });
            return;
        }
        // Kiem tra vai tro cua user co nam trong danh sach duoc phep khong
        if (!allowedRoles.includes(req.user.ten_vai_tro)) {
            res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập chức năng này.',
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=roleMiddleware.js.map