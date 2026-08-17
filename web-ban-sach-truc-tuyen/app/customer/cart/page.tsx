"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useCart } from "@/contexts/CartProvider";
import CartList from "@/components/cart/cartList";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useCart();

  return (
    <Container fluid="xl" className="py-4">
      {/* Breadcrumb */}
      <nav className="book-detail-breadcrumb mb-3">
        <a href="/">Trang chủ</a>
        <i className="bi bi-chevron-right mx-2" />
        <span>Giỏ hàng</span>
      </nav>

      <h2 className="fw-bold mb-4">
        <i className="bi bi-cart3 me-2" />
        Giỏ hàng ({totalItems} sản phẩm)
      </h2>

      <Row className="g-4">
        {/* Danh sách sản phẩm */}
        <Col lg={8}>
          <CartList
            items={items}
            onQuantityChange={updateQuantity}
            onRemove={removeFromCart}
          />
        </Col>

        {/* Tóm tắt đơn hàng */}
        <Col lg={4}>
          {items.length > 0 && (
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              onClear={clearCart}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
