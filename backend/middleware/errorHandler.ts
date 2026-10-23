import { Request, Response, NextFunction } from 'express';

// Mapping ma loi sql voi http 

function mapSqlErrorToHttp(errorNumber: number): number {
  const mapping: Record<number, number> = {
    //Loi User/Auth
    50001: 409,  // Email da ton tai
    50002: 500,  // Chua co vai tro KHACH_HANG
    50003: 404,  // Nguoi dung khong ton tai
    50004: 409,  // Email da ton tai (cap nhat)
    //Loi Sach
    50010: 409,  // ISBN da ton tai
    50011: 400,  // Gia sach khong hop le
    50012: 400,  // So luong ton khong duoc am
    50013: 404,  // The loai khong ton tai
    50014: 404,  // NXB khong ton tai
    50015: 404,  // Sach khong ton tai
    50016: 409,  // ISBN trung (cap nhat)
    50017: 400,  // Gia khong hop le (cap nhat)
    50018: 404,  // The loai khong ton tai (cap nhat)
    50019: 404,  // NXB khong ton tai (cap nhat)
    50020: 400,  // Trang thai khong hop le
    50021: 404,  // Sach khong ton tai
    50022: 400,  // Khong the dat Con hang khi ton = 0
    //Loi Gio hang
    50030: 400,  // So luong phai > 0
    50031: 404,  // Sach khong ton tai hoac khong con ban
    50032: 400,  // So luong vuot qua ton kho
    50033: 400,  // So luong phai > 0
    50034: 404,  // Sach khong ton tai
    50035: 400,  // So luong vuot qua ton kho
    50036: 404,  // Sach khong co trong gio
    50037: 404,  // Sach khong co trong gio (xoa)
    //Loi Don hang
    50040: 404,  // Khong tim thay gio hang
    50041: 400,  // Gio hang dang trong
    50042: 400,  // Sach het hang/ngung ban/khong du so luong
    50043: 404,  // Khong tim thay don hang
    50044: 404,  // Don hang khong ton tai
    50045: 400,  // Khong the chuyen sang trang thai nay
    50046: 404,  // Don hang khong ton tai (huy)
    50047: 404,  // Nguoi thuc hien khong ton tai
    50048: 403,  // Khong co quyen huy don hang nay
    50049: 400,  // Chi huy duoc khi Cho xac nhan/Dang chuan bi
    //Loi Kho
    50060: 400,  // So luong nhap phai > 0
    50061: 403,  // Khong co quyen nhap kho
    50062: 404,  // Sach khong ton tai
    50063: 400,  // So luong dieu chinh phai khac 0
    50064: 400,  // Phai nhap ly do
    50065: 403,  // Khong co quyen dieu chinh kho
    50066: 404,  // Sach khong ton tai (dieu chinh)
    50067: 400,  // Ton sau dieu chinh < 0
  };
  return mapping[errorNumber] || 400;
}


export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  // Loi tu SQL Server (Stored Procedure Throw 50xxx)
  if (err.number && err.number >= 50000) {
    const httpStatus = mapSqlErrorToHttp(err.number);
    res.status(httpStatus).json({
      success: false,
      message: err.message,  
    });
    return;
  }

  // Loi SQL Server khac
  if (err.number) {
    res.status(400).json({
      success: false,
      message: 'Lỗi cơ sở dữ liệu. Vui lòng kiểm tra lại dữ liệu.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
    return;
  }

  //Loi Multer (file qua lon)
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'File ảnh quá lớn. Kích thước tối đa là 5MB.',
    });
    return;
  }

  //Loi co statusCode custom (tu service throw)
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Loi khong xac dinh
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi máy chủ.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}