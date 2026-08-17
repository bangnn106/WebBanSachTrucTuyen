"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";

import { mockBooks } from "@/constants/testData";
import { theLoaiMap, nhaXuatBanMap } from "@/constants/bookData";
import { useCart } from "@/contexts/CartProvider";
import QuantityInput from "@/components/cart/QuantityInput";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const bookId = Number(params.id);
  const book = mockBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <i className="bi bi-exclamation-circle fs-1 text-secondary" />
        <h3 className="mt-3">Không tìm thấy sách</h3>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
          Về trang chủ
        </Button>
      </Container>
    );
  }

  const discount =
    book.gia_goc > book.gia_ban
      ? Math.round(((book.gia_goc - book.gia_ban) / book.gia_goc) * 100)
      : 0;

  function handleAddToCart() {
    addToCart({
      id_sach: book!.id,
      ten_sach: book!.ten_sach,
      anh_bia: book!.anh_bia,
      gia_ban: book!.gia_ban,
      so_luong: quantity,
      so_luong_ton: book!.so_luong_ton,
    });
    alert("Đã thêm vào giỏ hàng!");
  }

  function handleBuyNow() {
    addToCart({
      id_sach: book!.id,
      ten_sach: book!.ten_sach,
      anh_bia: book!.anh_bia,
      gia_ban: book!.gia_ban,
      so_luong: quantity,
      so_luong_ton: book!.so_luong_ton,
    });
    router.push("/customer/cart");
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Breadcrumb */}
      <nav className="book-detail-breadcrumb mb-3">
        <a href="/">Trang chủ</a>
        <i className="bi bi-chevron-right mx-2" />
        <a href="/store/search">Sách</a>
        <i className="bi bi-chevron-right mx-2" />
        <span>{book.ten_sach}</span>
      </nav>

      <div className="book-detail">
        <Row className="g-4">
          {/* ── CỘT TRÁI: HÌNH ẢNH ── */}
          <Col lg={5}>
            <div className="book-detail-image-section">
              <div className="book-detail-image-main">
                <Image
                  src={book.anh_bia || "/images/book/imgbook1.jpg"}
                  alt={book.ten_sach}
                  width={450}
                  height={550}
                  className="book-detail-img"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="book-detail-thumbnails">
                <div className="book-detail-thumb active">
                  <Image
                    src={book.anh_bia || "/images/book/imgbook1.jpg"}
                    alt={book.ten_sach}
                    width={60}
                    height={75}
                  />
                </div>
                <div className="book-detail-thumb">
                  <Image
                    src={book.anh_bia || "/images/book/imgbook1.jpg"}
                    alt={book.ten_sach}
                    width={60}
                    height={75}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="book-detail-actions mt-3">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="book-detail-btn-cart"
                  onClick={handleAddToCart}
                  disabled={book.so_luong_ton <= 0}
                >
                  <i className="bi bi-cart-plus me-2" />
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="book-detail-btn-buy"
                  onClick={handleBuyNow}
                  disabled={book.so_luong_ton <= 0}
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </Col>

          {/* ── CỘT PHẢI: THÔNG TIN ── */}
          <Col lg={7}>
            {/* Badges */}
            {book.so_luong_da_ban >= 200 && (
              <Badge bg="danger" className="me-2 mb-2">
                <i className="bi bi-fire me-1" />
                Bán chạy
              </Badge>
            )}

            <h1 className="book-detail-title">{book.ten_sach}</h1>

            {/* Meta: nhà cung cấp, tác giả */}
            <div className="book-detail-meta">
              <span>
                Tác giả: <strong>{book.tac_gia}</strong>
              </span>
              <span className="mx-3">|</span>
              <span>
                NXB: <strong>{nhaXuatBanMap[book.id_nha_xuat_ban] || "—"}</strong>
              </span>
            </div>

            {/* Giá */}
            <div className="book-detail-price-box">
              <span className="book-detail-price">
                {book.gia_ban.toLocaleString("vi-VN")} đ
              </span>

              {discount > 0 && (
                <>
                  <span className="book-detail-original-price">
                    {book.gia_goc.toLocaleString("vi-VN")} đ
                  </span>
                  <Badge bg="danger" className="book-detail-discount">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Trạng thái tồn kho */}
            <div className="book-detail-stock">
              {book.so_luong_ton > 0 ? (
                <span className="text-success">
                  <i className="bi bi-check-circle-fill me-1" />
                  {book.so_luong_ton} sản phẩm còn hàng
                </span>
              ) : (
                <span className="text-danger">
                  <i className="bi bi-x-circle-fill me-1" />
                  Hết hàng
                </span>
              )}
            </div>

            {/* Vận chuyển */}
            <div className="book-detail-shipping">
              <h6 className="fw-bold mb-2">
                <i className="bi bi-truck me-2" />
                Thông tin vận chuyển
              </h6>
              <p className="mb-1 text-secondary">
                <i className="bi bi-box-seam me-2" />
                Giao hàng tiêu chuẩn
              </p>
              <p className="mb-0 text-secondary">
                Dự kiến giao: <strong>3 - 5 ngày</strong>
              </p>
            </div>

            {/* Số lượng */}
            {book.so_luong_ton > 0 && (
              <div className="book-detail-quantity">
                <span className="fw-bold me-3">Số lượng:</span>
                <QuantityInput
                  value={quantity}
                  max={book.so_luong_ton}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* ── BẢNG THÔNG TIN CHI TIẾT ── */}
            <div className="book-detail-info-table mt-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-info-circle me-2" />
                Thông tin chi tiết
              </h5>

              <Table bordered className="book-detail-table">
                <tbody>
                  <tr>
                    <td className="book-detail-table-label">Mã hàng (ISBN)</td>
                    <td>{book.isbn}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Tác giả</td>
                    <td>{book.tac_gia}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Nhà xuất bản</td>
                    <td>{nhaXuatBanMap[book.id_nha_xuat_ban] || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Thể loại</td>
                    <td>{theLoaiMap[book.id_the_loai] || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Năm xuất bản</td>
                    <td>{book.nam_xuat_ban || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Ngôn ngữ</td>
                    <td>{book.ngon_ngu || "Tiếng Việt"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Đã bán</td>
                    <td>{book.so_luong_da_ban}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Mô tả */}
            {book.mo_ta_ngan && (
              <div className="book-detail-description mt-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-card-text me-2" />
                  Mô tả sản phẩm
                </h5>
                <p>{book.mo_ta_ngan}</p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}
