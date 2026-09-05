import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

// GET /api/dashboard/overview
export async function getOverview(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { tu_ngay, den_ngay } = req.query;
    const data = await dashboardService.tongQuan(
      tu_ngay as string,
      den_ngay as string
    );

    res.json({
      success: true,
      message: 'Lấy tổng quan dashboard thành công.',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/revenue
export async function getRevenue(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { tu_ngay, den_ngay, kieu_thong_ke } = req.query;
    const data = await dashboardService.doanhThu(
      tu_ngay as string,
      den_ngay as string,
      (kieu_thong_ke as string) || 'NGAY'
    );

    res.json({
      success: true,
      message: 'Lấy thống kê doanh thu thành công.',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/top-books
export async function getTopBooks(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { so_luong_top } = req.query;
    const data = await dashboardService.topSachBanChay(
      so_luong_top ? parseInt(so_luong_top as string) : 10
    );

    res.json({
      success: true,
      message: 'Lấy top sách bán chạy thành công.',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/order-stats
export async function getOrderStats(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const { tu_ngay, den_ngay } = req.query;
    const data = await dashboardService.donHangTheoTrangThai(
      tu_ngay as string,
      den_ngay as string
    );

    res.json({
      success: true,
      message: 'Lấy thống kê đơn hàng thành công.',
      data,
    });
  } catch (error) {
    next(error);
  }
}