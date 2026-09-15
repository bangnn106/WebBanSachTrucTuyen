import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { sendMail } from '../config/mail';
import {
  orderConfirmationTemplate,
  orderCancelledTemplate,
} from '../views/mailTemplates';
import { VaiTro } from '../models/user.model';

// POST /api/orders - Tao don hang tu gio (khach hang)
export async function createOrder(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { ten_nguoi_nhan, so_dien_thoai_nhan, dia_chi_giao_hang, ghi_chu } = req.body;

    if (!ten_nguoi_nhan || !so_dien_thoai_nhan || !dia_chi_giao_hang) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin giao hàng.',
      });
      return;
    }

    const result = await orderService.taoDonHangTuGio(req.user!.id, {
      ten_nguoi_nhan, so_dien_thoai_nhan, dia_chi_giao_hang, ghi_chu,
    });

    // Gui email xac nhan don hang (khong cho ket qua, khong crash neu loi)
    try {
      const detail = await orderService.layChiTietDonHang(result.ma_don_hang, null);
      await sendMail(
        req.user!.email,
        `Xác nhận đơn hàng ${result.ma_don_hang}`,
        orderConfirmationTemplate({
          ma_don_hang: result.ma_don_hang,
          ten_nguoi_nhan,
          dia_chi_giao_hang,
          so_dien_thoai_nhan,
          tong_tien: result.tong_tien,
          ngay_dat: new Date().toLocaleString('vi-VN'),
          chi_tiet: detail.chi_tiet,
        })
      );
    } catch {
      // Email loi khong anh huong response
    }

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders - Danh sach don hang
export async function getOrders(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { tu_khoa, trang_thai, tu_ngay, den_ngay, trang, kich_thuoc_trang } = req.query;

    // KHACH_HANG chi xem don cua minh, NHAN_VIEN/ADMIN xem tat ca
    const idNguoiDung =
      req.user!.ten_vai_tro === VaiTro.KHACH_HANG ? req.user!.id : null;

    const result = await orderService.layDanhSachDonHang(idNguoiDung, {
      tu_khoa: tu_khoa as string,
      trang_thai: trang_thai as string,
      tu_ngay: tu_ngay as string,
      den_ngay: den_ngay as string,
      trang: trang ? parseInt(trang as string) : 1,
      kich_thuoc_trang: kich_thuoc_trang ? parseInt(kich_thuoc_trang as string) : 20,
    });

    res.json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders/:maDon - Chi tiet don hang (dung ma_don_hang thay vi id)
export async function getOrderByMaDon(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const maDonHang = req.params.maDon;

    // KHACH_HANG chi xem don cua minh
    const idNguoiDung =
      req.user!.ten_vai_tro === VaiTro.KHACH_HANG ? req.user!.id : null;

    const result = await orderService.layChiTietDonHang(maDonHang, idNguoiDung);

    res.json({
      success: true,
      message: 'Lấy chi tiết đơn hàng thành công.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/orders/:maDon/status - Cap nhat trang thai (nhan vien/admin)
export async function updateOrderStatus(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const maDonHang = req.params.maDon;
    const { trang_thai_moi } = req.body;

    if (!trang_thai_moi) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái mới.',
      });
      return;
    }

    const result = await orderService.capNhatTrangThaiDonHang(
      maDonHang, trang_thai_moi
    );

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/orders/:maDon/cancel - Huy don hang
export async function cancelOrder(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const maDonHang = req.params.maDon;
    const { ly_do } = req.body;

    const result = await orderService.huyDonHang(
      maDonHang, req.user!.id, ly_do
    );

    // Gui email thong bao huy don
    try {
      const detail = await orderService.layChiTietDonHang(maDonHang, null);
      if (detail.don_hang?.email) {
        await sendMail(
          detail.don_hang.email,
          `Đơn hàng ${detail.don_hang.ma_don_hang} đã bị hủy`,
          orderCancelledTemplate({
            ma_don_hang: detail.don_hang.ma_don_hang,
            ten_nguoi_nhan: detail.don_hang.ten_nguoi_nhan,
            tong_tien: detail.don_hang.tong_tien,
            ly_do: ly_do || 'Không có lý do cụ thể',
          })
        );
      }
    } catch {
      // Email loi khong anh huong response
    }

    res.json({
      success: true,
      message: result.thong_bao,
    });
  } catch (error) {
    next(error);
  }
}