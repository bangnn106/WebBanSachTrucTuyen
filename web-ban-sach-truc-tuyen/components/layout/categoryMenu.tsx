"use client";

import { Col, Row } from "react-bootstrap";
import { categoryMenus } from "@/constants/categoryMenu";

interface Props{
    show:boolean;
}

export default function CategoryMenu({show}:Props){
    if(!show) return null;

    const selectedCategory=categoryMenus[0];

     return (
    <div className="category-menu">
      <Row>
        <Col lg={3} className="category-menu-left">
          <h3 className="fw-bold mb-4">
            Danh mục sản phẩm
          </h3>

          {categoryMenus.map((category, index) => (
            <div
              key={category.title}
              className={`category-menu-item ${
                index === 0 ? "active" : ""
              }`}
            >
              {category.title}
            </div>
          ))}
        </Col>

        <Col lg={9}>
          <div className="category-menu-title">
            <i className="bi bi-book me-2 text-primary" />
            {selectedCategory.title}
          </div>

          <Row>
            {selectedCategory.groups.map((group) => (
              <Col
                xl={4}
                md={6}
                className="sub-category-group mb-4"
                key={group.title}
              >
                <h6>{group.title}</h6>

                {group.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}

                <a href="#" className="text-primary">
                  Xem tất cả
                </a>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}