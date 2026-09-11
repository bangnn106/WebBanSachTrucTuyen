"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import { sachAPI, layUrlAnh } from "@/lib/api";
import { book } from "@/types/book";
import { useCart } from "@/contexts/CartProvider";
import QuantityInput from "@/components/cart/QuantityInput";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [sach, setSach] = useState<book | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const bookId = Number(params.id);

  //Goi API lay chi tiet sach  useEffect(() => {
    sachAPI
      .layChiTiet(bookId)
      .then((res) => setSach(res.data))
      .catch((err) => setLoi(err.message || "Không tìm thấy sách"))
      .finally(() => setDangTai(false));
  }, [bookId]);

  if (dangTai) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Đang tải...</p>
      </Container>
    );
  }

  if (loi || !sach) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <i className="bi bi-exclamation-circle fs-1 text-secondary" />
        <h3 className="mt-3">{loi || "Không tìm thấy sách"}</h3>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
          Về trang chủ
        </Button>
      </Container>
    );
  }

  const discount =
    sach.gia_goc > sach.gia_ban
      ? Math.round(((sach.gia_goc - sach.gia_ban) / sach.gia_goc) * 100)
      : 0;

  function handleAddToCart() {
    addToCart({
      id_sach: sach!.id,
      ten_sach: sach!.ten_sach,
      anh_bia: sach!.anh_bia,
      gia_ban: sach!.gia_ban,
      so_luong: quantity,
      so_luong_ton: sach!.so_luong_ton,
    });
    alert("Đã thêm vào giỏ hàng!");
  }

  function handleBuyNow() {
    addToCart({
      id_sach: sach!.id,
      ten_sach: sach!.ten_sach,
      anh_bia: sach!.anh_bia,
      gia_ban: sach!.gia_ban,
      so_luong: quantity,
      so_luong_ton: sach!.so_luong_ton,
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
        <span>{sach.ten_sach}</span>
      </nav>

      <div className="book-detail">
        <Row className="g-4">
          {/* COT TRAI: HINH ANH */}
          <Col lg={5}>
            <div className="book-detail-image-wrapper">
              <div className="book-detail-image-main">
                <Image
                  src={layUrlAnh(sach.anh_bia)}
                  alt={sach.ten_sach}
                  width={450}
                  height={550}
                  className="book-detail-img"
                  priority
                />
              </div>

              {/* Action buttons */}
              <div className="book-detail-actions mt-3">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="book-detail-btn-cart"
                  onClick={handleAddToCart}
                  disabled={sach.so_luong_ton <= 0}
                >
                  <i className="bi bi-cart-plus me-2" />
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="book-detail-btn-buy"
                  onClick={handleBuyNow}
                  disabled={sach.so_luong_ton <= 0}
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </Col>

          {/* COT PHAI: THONG TIN */}
          <Col lg={7}>
            {sach.so_luong_da_ban >= 200 && (
              <Badge bg="danger" className="me-2 mb-2">
                <i className="bi bi-fire me-1" />
                Bán chạy
              </Badge>
            )}

            <h1 className="book-detail-title">{sach.ten_sach}</h1>

            <div className="book-detail-meta">
              <span>
                Tác giả: <strong>{sach.tac_gia}</strong>
              </span>
              <span className="mx-3">|</span>
              <span>
                NXB: <strong>{sach.ten_nxb || "—"}</strong>
              </span>
            </div>

            {/* Gia */}
            <div className="book-detail-price-box">
              <span className="book-detail-price">
                {sach.gia_ban.toLocaleString("vi-VN")} đ
              </span>
              {discount > 0 && (
                <>
                  <span className="book-detail-original-price">
                    {sach.gia_goc.toLocaleString("vi-VN")} đ
                  </span>
                  <Badge bg="danger" className="book-detail-discount">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Trang thai ton kho */}
            <div className="book-detail-stock">
              {sach.so_luong_ton > 0 ? (
                <span className="text-success">
                  <i className="bi bi-check-circle-fill me-1" />
                  {sach.so_luong_ton} sản phẩm còn hàng
                </span>
              ) : (
                <span className="text-danger">
                  <i className="bi bi-x-circle-fill me-1" />
                  Hết hàng
                </span>
              )}
            </div>

            {/* Van chuyen */}
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

            {/* So luong */}
            {sach.so_luong_ton > 0 && (
              <div className="book-detail-quantity">
                <span className="fw-bold me-3">Số lượng:</span>
                <QuantityInput
                  value={quantity}
                  max={sach.so_luong_ton}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* BANG THONG TIN CHI TIET */}
            <div className="book-detail-info-table mt-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-info-circle me-2" />
                Thông tin chi tiết
              </h5>

              <Table bordered className="book-detail-table">
                <tbody>
                  <tr>
                    <td className="book-detail-table-label">Mã hàng (ISBN)</td>
                    <td>{sach.isbn}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Tác giả</td>
                    <td>{sach.tac_gia}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Nhà xuất bản</td>
                    <td>{sach.ten_nxb || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Thể loại</td>
                    <td>{sach.ten_the_loai || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Năm xuất bản</td>
                    <td>{sach.nam_xuat_ban || "—"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Ngôn ngữ</td>
                    <td>{sach.ngon_ngu || "Tiếng Việt"}</td>
                  </tr>
                  <tr>
                    <td className="book-detail-table-label">Đã bán</td>
                    <td>{sach.so_luong_da_ban}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Mo ta */}
            {sach.mo_ta_ngan && (
              <div className="book-detail-description mt-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-card-text me-2" />
                  Mô tả sản phẩm
                </h5>
                <p>{sach.mo_ta_ngan}</p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}
