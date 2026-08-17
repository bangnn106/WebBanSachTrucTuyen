"use client";

import { useParams } from "next/navigation";
import { Button, Container } from "react-bootstrap";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const maDon = params.maDon as string;

  return (
    <Container fluid="xl" className="py-5">
      <div className="checkout-success text-center">
        <div className="checkout-success-icon">
          <i className="bi bi-check-circle-fill" />
        </div>

        <h2 className="fw-bold mt-4 text-success">
          Đặt hàng thành công!
        </h2>

        <p className="text-secondary fs-5 mt-2">
          Cảm ơn bạn đã mua hàng tại BookStore
        </p>

        <div className="checkout-success-info">
          <p className="mb-1">
            Mã đơn hàng: <strong className="text-primary">{maDon}</strong>
          </p>
          <p className="mb-1">
            Phương thức thanh toán:{" "}
            <strong>Thanh toán khi nhận hàng (COD)</strong>
          </p>
          <p className="mb-0">
            Trạng thái: <strong className="text-warning">Chờ xác nhận</strong>
          </p>
        </div>

        <div className="mt-4 d-flex gap-3 justify-content-center">
          <Link href="/">
            <Button variant="outline-primary" size="lg">
              <i className="bi bi-house me-2" />
              Về trang chủ
            </Button>
          </Link>

          <Link href="/store/search">
            <Button variant="primary" size="lg">
              <i className="bi bi-bag me-2" />
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
