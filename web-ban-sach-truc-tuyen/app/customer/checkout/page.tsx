"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useCart } from "@/contexts/CartProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { donHangAPI, layUrlAnh } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, daDangNhap } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    ten_nguoi_nhan: user?.ho_ten || "",
    so_dien_thoai: user?.so_dien_thoai || "",
    tinh_thanh: user?.tinh_thanh || "",
    quan_huyen: user?.quan_huyen || "",
    phuong_xa: user?.phuong_xa || "",
    dia_chi_chi_tiet: user?.dia_chi_chi_tiet || "",
    ghi_chu: "",
  });

  /* Neu chua ang nhap redirect */
  if (!daDangNhap) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <i className="bi bi-person-lock" style={{ fontSize: 64, color: "#ccc" }} />
        <h4 className="mt-3">Vui lòng đăng nhập để thanh toán</h4>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/auth/login")}>
          Đăng nhập
        </Button>
      </Container>
    );
  }

  /* Neu gio hang trong quay lai */
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Goi API tao don hang that
      const diaChiDay = [form.dia_chi_chi_tiet, form.phuong_xa, form.quan_huyen, form.tinh_thanh]
        .filter(Boolean)
        .join(", ");

      const res = await donHangAPI.taoDonHang({
        ten_nguoi_nhan: form.ten_nguoi_nhan,
        so_dien_thoai_nhan: form.so_dien_thoai,
        dia_chi_giao_hang: diaChiDay,
        ghi_chu: form.ghi_chu || undefined,
      });

      // Xoa gio hang local
      clearCart();

      // Chuyen sang trang xac nhan voi ID don hang that
      const idDonHang = res.data.id_don_hang;
      router.push(`/customer/checkout/${idDonHang}`);
    } catch (err: any) {
      setError(err.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
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

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* COT TRAI: FORM THONG TIN */}
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

              {/* Phuong thuc thanh toan */}
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

          {/* COT PHAI: TOM TAT ON HANG */}
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
                            src={layUrlAnh(item.anh_bia)}
                            alt={item.ten_sach}
                            width={40}
                            height={50}
                            className="rounded"
                          />
                          <div>
                            <div className="checkout-item-name">{item.ten_sach}</div>
                            <small className="text-secondary">x{item.so_luong}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-end fw-bold">
                        {(item.gia_ban * item.so_luong).toLocaleString("vi-VN")} đ
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2" />
                    Đặt hàng
                  </>
                )}
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
