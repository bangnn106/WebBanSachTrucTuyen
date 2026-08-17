"use client";

import { CartItem } from "@/types/book";
import CartItemRow from "./cartItem";

interface Props {
  items: CartItem[];
  onQuantityChange: (idSach: number, qty: number) => void;
  onRemove: (idSach: number) => void;
}

export default function CartList({
  items,
  onQuantityChange,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="cart-empty text-center py-5">
        <i className="bi bi-cart-x" style={{ fontSize: 64, color: "#ccc" }} />
        <p className="mt-3 text-secondary fs-5">
          Giỏ hàng của bạn đang trống
        </p>
        <a href="/" className="btn btn-primary mt-2">
          Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  return (
    <div className="cart-list">
      {/* Header */}
      <div className="cart-list-header">
        <span className="cart-col-product">Sản phẩm</span>
        <span className="cart-col-price">Đơn giá</span>
        <span className="cart-col-qty">Số lượng</span>
        <span className="cart-col-subtotal">Thành tiền</span>
        <span className="cart-col-remove"></span>
      </div>

      {items.map((item) => (
        <CartItemRow
          key={item.id_sach}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
