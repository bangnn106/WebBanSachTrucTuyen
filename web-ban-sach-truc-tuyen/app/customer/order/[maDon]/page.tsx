"use client";

import { Container } from "react-bootstrap";
import OrderStatusBadge from "@/components/order/orderStatusBadge";

export default function TrackOrderPage() {
  const order = {
    ma_don_hang: "",
    ngay_dat: "",
    trang_thai: "DANG_GIAO",
    tong_tien: 285000,
  };

  return (
    <Container fluid="xl" className="py-5">
      <div className="account-card mx-auto" style={{ maxWidth: 600 }}>
        <div className="text-center mb-4">
          <i className="bi bi-truck" style={{ fontSize: 48, color: "var(--primary)" }} />
          <h4 className="fw-bold mt-2">Tra cứu đơn hàng</h4>
        </div>

        <div className="border rounded-3 p-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary">Mã đơn hàng:</span>
            <span className="fw-bold">{order.ma_don_hang}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary">Ngày đặt:</span>
            <span>{order.ngay_dat}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary">Trạng thái:</span>
            <OrderStatusBadge status={order.trang_thai} />
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <span className="fw-bold">Tổng cộng:</span>
            <span className="fw-bold text-primary fs-5">{order.tong_tien.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
