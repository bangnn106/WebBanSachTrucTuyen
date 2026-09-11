"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { CartItem } from "@/types/book";
import { layUrlAnh } from "@/lib/api";
import QuantityInput from "./QuantityInput";

interface Props {
  item: CartItem;
  onQuantityChange: (idSach: number, qty: number) => void;
  onRemove: (idSach: number) => void;
}

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: Props) {
  const subtotal = item.gia_ban * item.so_luong;

  return (
    <div className="cart-item">
      {/* Anh */}
      <div className="cart-item-image">
        <Link href={`/store/book/${item.id_sach}`}>
          <Image
            src={layUrlAnh(item.anh_bia)}
            alt={item.ten_sach}
            width={80}
            height={100}
            className="cart-item-img"
          />
        </Link>
      </div>

      {/* Thong tin */}
      <div className="cart-item-info">
        <Link
          href={`/store/book/${item.id_sach}`}
          className="cart-item-name"
        >
          {item.ten_sach}
        </Link>

        <div className="cart-item-price">
          {item.gia_ban.toLocaleString("vi-VN")} đ
        </div>
      </div>

      {/* So luong */}
      <div className="cart-item-quantity">
        <QuantityInput
          value={item.so_luong}
          max={item.so_luong_ton}
          onChange={(qty) => onQuantityChange(item.id_sach, qty)}
        />
      </div>

      {/* Thanh tien */}
      <div className="cart-item-subtotal">
        {subtotal.toLocaleString("vi-VN")} đ
      </div>

      {/* Xoa */}
      <div className="cart-item-remove">
        <Button
          variant="link"
          className="text-danger p-0"
          onClick={() => onRemove(item.id_sach)}
        >
          <i className="bi bi-trash fs-5" />
        </Button>
      </div>
    </div>
  );
}
