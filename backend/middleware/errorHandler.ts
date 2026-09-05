import { Request, Response, NextFunction } from 'express';

// ========== MAPPING MÃ LỖI SQL → HTTP STATUS ==========
// Khi Stored Procedure dùng THROW 50xxx, ta map sang HTTP status phù hợp
function mapSqlErrorToHttp(errorNumber: number): number {
  const mapping: Record<number, number> = {
    // --- Lỗi User/Auth ---
    50001: 409,  // Email đã tồn tại
    50002: 500,  // Chưa có vai trò KHACH_HANG
    50003: 404,  // Người dùng không tồn tại
    50004: 409,  // Email đã tồn tại (cập nhật)

    // --- Lỗi Sách ---
    50010: 409,  // ISBN đã tồn tại
    50011: 400,  // Giá sách không hợp lệ
    50012: 400,  // Số lượng tồn không được âm
    50013: 404,  // Thể loại không tồn tại
    50014: 404,  // NXB không tồn tại
    50015: 404,  // Sách không tồn tại
    50016: 409,  // ISBN trùng (cập nhật)
    50017: 400,  // Giá không hợp lệ (cập nhật)
    50018: 404,  // Thể loại không tồn tại (cập nhật)
    50019: 404,  // NXB không tồn tại (cập nhật)
    50020: 400,  // Trạng thái không hợp lệ
    50021: 404,  // Sách không tồn tại
    50022: 400,  // Không thể đặt Còn hàng khi tồn = 0

    // --- Lỗi Giỏ hàng ---
    50030: 400,  // Số lượng phải > 0
    50031: 404,  // Sách không tồn tại hoặc không còn bán
    50032: 400,  // Số lượng vượt quá tồn kho
    50033: 400,  // Số lượng phải > 0
    50034: 404,  // Sách không tồn tại
    50035: 400,  // Số lượng vượt quá tồn kho
    50036: 404,  // Sách không có trong giỏ
    50037: 404,  // Sách không có trong giỏ (xóa)

    // --- Lỗi Đơn hàng ---
    50040: 404,  // Không tìm thấy giỏ hàng
    50041: 400,  // Giỏ hàng đang trống
    50042: 400,  // Sách hết hàng/ngừng bán/không đủ số lượng
    50043: 404,  // Không tìm thấy đơn hàng
    50044: 404,  // Đơn hàng không tồn tại
    50045: 400,  // Không thể chuyển sang trạng thái này
    50046: 404,  // Đơn hàng không tồn tại (hủy)
    50047: 404,  // Người thực hiện không tồn tại
    50048: 403,  // Không có quyền hủy đơn hàng này
    50049: 400,  // Chỉ hủy được khi Chờ xác nhận/Đang chuẩn bị

    // --- Lỗi Kho ---
    50060: 400,  // Số lượng nhập phải > 0
    50061: 403,  // Không có quyền nhập kho
    50062: 404,  // Sách không tồn tại
    50063: 400,  // Số lượng điều chỉnh phải khác 0
    50064: 400,  // Phải nhập lý do
    50065: 403,  // Không có quyền điều chỉnh kho
    50066: 404,  // Sách không tồn tại (điều chỉnh)
    50067: 400,  // Tồn sau điều chỉnh < 0
  };

  return mapping[errorNumber] || 400;
}

// ========== GLOBAL ERROR HANDLER ==========
// Đặt SAU tất cả routes trong middleware chain
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Error:', err);

  // 1) Lỗi từ SQL Server (Stored Procedure THROW 50xxx)
  if (err.number && err.number >= 50000) {
    const httpStatus = mapSqlErrorToHttp(err.number);
    res.status(httpStatus).json({
      success: false,
      message: err.message,  // Thông điệp tiếng Việt từ SP
    });
    return;
  }

  // 2) Lỗi SQL Server khác (constraint violation, syntax...)
  if (err.number) {
    res.status(400).json({
      success: false,
      message: 'Lỗi cơ sở dữ liệu. Vui lòng kiểm tra lại dữ liệu.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
    return;
  }

  // 3) Lỗi Multer (file quá lớn)
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'File ảnh quá lớn. Kích thước tối đa là 5MB.',
    });
    return;
  }

  // 4) Lỗi có statusCode custom (từ service throw)
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 5) Lỗi không xác định
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi máy chủ.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}