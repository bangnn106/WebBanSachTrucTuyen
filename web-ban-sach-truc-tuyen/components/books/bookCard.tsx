"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Card } from "react-bootstrap";
import { book } from "@/types/book";

interface Props {
  book: book;
}

export default function BookCard({
  book,
}: Props) {

  const discount =
    book.gia_goc > book.gia_ban
      ? Math.round(
          ((book.gia_goc - book.gia_ban) /
            book.gia_goc) *
            100
        )
      : 0;

  return (
    <Card className="book-card p-2">

      <div className="book-image-wrapper position-relative">

        <Link href={`/store/book/${book.id}`}>
          <Image
            src={
              book.anh_bia ||
              "/images/book/imgbook1.jpg"
            }
            alt={book.ten_sach}
            width={180}
            height={230}
            className="book-image"
          />
        </Link>

        {discount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 end-0"
          >
            -{discount}%
          </Badge>
        )}
      </div>

      <Card.Body className="px-1 pb-2">

        <Link href={`/store/book/${book.id}`}>
          <div className="book-card-title">
            {book.ten_sach}
          </div>
        </Link>

        <div className="book-author mb-1">
          {book.tac_gia}
        </div>

        <div className="d-flex align-items-baseline">
          <span className="book-price">
            {book.gia_ban.toLocaleString("vi-VN")}đ
          </span>

          {book.gia_goc > book.gia_ban && (
            <span className="book-original-price">
              {book.gia_goc.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <div className="book-sold">
          Đã bán {book.so_luong_da_ban}
        </div>

        <Button
          variant="outline-primary"
          size="sm"
          className="w-100 mt-2"
          disabled={book.so_luong_ton <= 0}
        >
          <i className="bi bi-cart-plus me-1" />
          {book.so_luong_ton > 0
            ? "Thêm vào giỏ"
            : "Hết hàng"}
        </Button>

      </Card.Body>
    </Card>
  );
}
