"use client";

import { Container, Row, Col } from "react-bootstrap";

const categories = [
  { icon: "bi-book", label: "Văn học" },
  { icon: "bi-briefcase", label: "Kinh tế" },
  { icon: "bi-emoji-smile", label: "Tâm lý" },
  { icon: "bi-backpack", label: "Thiếu nhi" },
  { icon: "bi-journal-bookmark", label: "Giáo khoa" },
  { icon: "bi-translate", label: "Ngoại ngữ" },
  { icon: "bi-gift", label: "Quà tặng" },
  { icon: "bi-stars", label: "Bán chạy" },
];

export default function CategoryHighlight() {
  return (
    <Container fluid="xl" className="mt-3">
      <div className="category-highlight">
        <Row className="g-2 justify-content-center">
          {categories.map((cat) => (
            <Col key={cat.label} xs={3} sm={3} md className="text-center">
              <a href="/store/search" className="category-highlight-item">
                <div className="category-highlight-icon">
                  <i className={`bi ${cat.icon}`} />
                </div>
                <span className="category-highlight-label">{cat.label}</span>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}
