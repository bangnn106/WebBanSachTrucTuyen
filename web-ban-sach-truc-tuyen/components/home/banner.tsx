"use client";
import Image from "next/image";
import { Carousel, Col, Container, Row } from "react-bootstrap";

export default function Banner() {
  return (
    <Container fluid="xl" className="banner">

      <Row className="g-3">

        {/* BANNER CHÍNH */}
        <Col lg={8}>
          <Carousel>
            <Carousel.Item>
              <Image
                src="/images/banner/banner-left.jpg"
                alt="Khuyến mãi sách"
                width={1200}
                height={500}
                className="banner-main"
                priority
              />
            </Carousel.Item>
          </Carousel>
        </Col>

        {/* 2 BANNER PHỤ */}
        <Col lg={4}>
          <div className="d-flex flex-column gap-3">

            <Image
              src="/images/banner/banner-right.jpg"
              alt="Ưu đãi BookStore"
              width={600}
              height={250}
              className="banner-small"
            />

            <Image
              src="/images/banner/banner-right2.jpg"
              alt="Khuyến mãi BookStore"
              width={600}
              height={250}
              className="banner-small"
            />

          </div>
        </Col>

      </Row>
    </Container>
  );
}