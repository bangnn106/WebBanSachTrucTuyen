import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-white mt-5 border-top py-5">
      <Container>
        <Row>
          <Col md={4}>
            <h4 className="fw-bold text-primary">
              BookStore
            </h4>

            <p className="text-secondary">
              Website bán sách trực tuyến
            </p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold">
              Hỗ trợ khách hàng
            </h6>

            <p>Chính sách mua hàng</p>
            <p>Chính sách đổi trả</p>
            <p>Điều khoản sử dụng</p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold">
              Liên hệ
            </h6>

            <p>Email: bookstore@gmail.com</p>
            <p>Hotline: 0123 456 789</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}