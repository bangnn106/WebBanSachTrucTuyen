"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useCart } from "@/contexts/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    ten_nguoi_nhan: "",
    so_dien_thoai: "",
    tinh_thanh: "",
    quan_huyen: "",
    phuong_xa: "",
    dia_chi_chi_tiet: "",
    ghi_chu: "",
  });

  /* Nếu giỏ hàng trống → quay lại */
  if (items.length === 0) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <i className="bi bi-cart-x" style={{ fontSize: 64, color: "#ccc" }} />
        <h4 className="mt-3">Giỏ hàng trống</h4>
        <p className="text-secondary">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
        </p>
        <Button variant="primary" onClick={() => router.push("/")}>
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    /*
      TODO: Khi có Backend API, gọi:
        POST /api/orders  →  sp_tao_don_hang_tu_gio
        Body: { ...form, items }
    */

    const maDon =
      "DH" +
      new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "") +
      Math.random().toString(36).substring(2, 10).toUpperCase();

    clearCart();

    /* Chuyển sang trang xác nhận */
    router.push(`/customer/checkout/${maDon}`);
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Breadcrumb */}
      <nav className="book-detail-breadcrumb mb-3">
        <a href="/">Trang chủ</a>
        <i className="bi bi-chevron-right mx-2" />
        <a href="/customer/cart">Giỏ hàng</a>
        <i className="bi bi-chevron-right mx-2" />
        <span>Thanh toán</span>
      </nav>

      <h2 className="fw-bold mb-4">
        <i className="bi bi-credit-card me-2" />
        Thanh toán
      </h2>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* ── CỘT TRÁI: FORM THÔNG TIN ── */}
          <Col lg={7}>
            <div className="checkout">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-person-lines-fill me-2" />
                Thông tin giao hàng
              </h5>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Tên người nhận <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="ten_nguoi_nhan"
                      value={form.ten_nguoi_nhan}
                      onChange={handleChange}
                      placeholder="Nhập họ tên"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="so_dien_thoai"
                      value={form.so_dien_thoai}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      required
                      pattern="[0-9]{10}"
                      title="Số điện thoại gồm 10 chữ số"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Tỉnh / Thành <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="tinh_thanh"
                      value={form.tinh_thanh}
                      onChange={handleChange}
                      placeholder="VD: TP. Hồ Chí Minh"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Quận / Huyện <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="quan_huyen"
                      value={form.quan_huyen}
                      onChange={handleChange}
                      placeholder="VD: Quận 1"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Phường / Xã <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="phuong_xa"
                      value={form.phuong_xa}
                      onChange={handleChange}
                      placeholder="VD: Phường Bến Nghé"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Địa chỉ chi tiết</Form.Label>
                    <Form.Control
                      name="dia_chi_chi_tiet"
                      value={form.dia_chi_chi_tiet}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường..."
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="ghi_chu"
                      value={form.ghi_chu}
                      onChange={handleChange}
                      placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Phương thức thanh toán */}
              <div className="mt-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-wallet2 me-2" />
                  Phương thức thanh toán
                </h5>

                <div className="checkout-payment-method active">
                  <Form.Check
                    type="radio"
                    id="cod"
                    name="payment"
                    label="Thanh toán khi nhận hàng (COD)"
                    checked
                    readOnly
                  />
                  <p className="mb-0 text-secondary ms-4 mt-1">
                    <small>
                      <i className="bi bi-info-circle me-1" />
                      Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </Col>

          {/* ── CỘT PHẢI: TÓM TẮT ĐƠN HÀNG ── */}
          <Col lg={5}>
            <div className="checkout-section">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-bag-check me-2" />
                Đơn hàng của bạn ({items.length} sản phẩm)
              </h5>

              <Table className="checkout-table" responsive>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id_sach}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Image
                            src={
                              item.anh_bia || "/images/book/imgbook1.jpg"
                            }
                            alt={item.ten_sach}
                            width={40}
                            height={50}
                            className="rounded"
                          />
                          <div>
                            <div className="checkout-item-name">
                              {item.ten_sach}
                            </div>
                            <small className="text-secondary">
                              x{item.so_luong}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="text-end fw-bold">
                        {(
                          item.gia_ban * item.so_luong
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <hr />

              <div className="checkout-summary-row">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="checkout-summary-row">
                <span>Phí vận chuyển:</span>
                <span className="text-success">Miễn phí</span>
              </div>

              <hr />

              <div className="checkout-summary-row checkout-summary-total">
                <span className="fw-bold fs-5">Tổng cộng:</span>
                <span className="checkout-total-price">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mt-3"
              >
                <i className="bi bi-check-circle me-2" />
                Đặt hàng
              </Button>

              <p className="text-center text-secondary mt-2 mb-0">
                <small>
                  <i className="bi bi-shield-check me-1" />
                  Thanh toán an toàn & bảo mật
                </small>
              </p>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
