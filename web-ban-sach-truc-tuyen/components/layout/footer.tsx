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
              Liên hệ
            </h6>

            <p>Email: nhatbang1006.179@gmail.com</p>
            <p>Hotline: 0359 048 033</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}