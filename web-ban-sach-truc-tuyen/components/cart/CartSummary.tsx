"use client";

import { Button } from "react-bootstrap";
import Link from "next/link";

interface Props {
  totalItems: number;
  totalPrice: number;
  onClear: () => void;
}

export default function CartSummary({
  totalItems,
  totalPrice,
  onClear,
}: Props) {
  return (
    <div className="cart-summary">
      <h5 className="fw-bold mb-3">
        <i className="bi bi-receipt me-2" />
        Tóm tắt đơn hàng
      </h5>

      <div className="cart-summary-row">
        <span>Số lượng sản phẩm:</span>
        <span className="fw-bold">{totalItems}</span>
      </div>

      <div className="cart-summary-row">
        <span>Phí vận chuyển:</span>
        <span className="text-success fw-bold">Miễn phí</span>
      </div>

      <hr />

      <div className="cart-summary-row cart-summary-total">
        <span>Tổng cộng:</span>
        <span className="cart-total-price">
          {totalPrice.toLocaleString("vi-VN")} đ
        </span>
      </div>

      <Link href="/customer/checkout" className="w-100">
        <Button
          variant="primary"
          size="lg"
          className="w-100 mt-3"
          disabled={totalItems === 0}
        >
          <i className="bi bi-credit-card me-2" />
          Tiến hành thanh toán
        </Button>
      </Link>

      <Button
        variant="outline-danger"
        size="sm"
        className="w-100 mt-2"
        onClick={onClear}
        disabled={totalItems === 0}
      >
        <i className="bi bi-trash me-1" />
        Xoá giỏ hàng
      </Button>
    </div>
  );
}
