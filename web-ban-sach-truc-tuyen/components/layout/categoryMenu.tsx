"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import { categoryMenus } from "@/constants/categoryMenu";

interface Props {
  show: boolean;
  onClose?: () => void;
}

export default function CategoryMenu({ show, onClose }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Dong menu khi bam phim Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }
    if (show) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [show, onClose]);

  if (!show) return null;

  const selectedCategory = categoryMenus[selectedTabIndex] || categoryMenus[0];

  return (
    <>
      {/* Lop phu backdrop de dong menu khi click ben ngoai */}
      <div
        className="category-menu-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="category-menu shadow-lg" role="dialog" aria-modal="true">
        <Row>
          {/* COT TRAI: TABS DANH MUC */}
          <Col lg={3} className="category-menu-left">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-grid-fill me-2 text-primary" />
                Danh mục sản phẩm
              </h5>
            </div>

            {/* Nut xem tat ca san pham */}
            <Link
              href="/store/search"
              onClick={onClose}
              className="category-menu-all-btn mb-3"
            >
              <i className="bi bi-collection me-2 text-primary fs-5" />
              <span>Tất cả sản phẩm</span>
              <i className="bi bi-arrow-right ms-auto text-secondary" />
            </Link>

            <div className="category-menu-list">
              {categoryMenus.map((category, index) => (
                <div
                  key={category.id || category.title}
                  className={`category-menu-item ${
                    index === selectedTabIndex ? "active" : ""
                  }`}
                  onClick={() => setSelectedTabIndex(index)}
                  role="button"
                  tabIndex={0}
                >
                  <i className={`bi ${category.icon || "bi-folder"} me-2`} />
                  <span className="flex-grow-1">{category.title}</span>
                  <i className="bi bi-chevron-right small text-muted ms-1" />
                </div>
              ))}
            </div>
          </Col>

          {/* COT PHAI: CHI TIET THE LOAI */}
          <Col lg={9} className="ps-lg-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div className="category-menu-title mb-0">
                <i
                  className={`bi ${
                    selectedCategory.icon || "bi-book"
                  } me-2 text-primary`}
                />
                {selectedCategory.title}
              </div>

              <Link
                href="/store/search"
                onClick={onClose}
                className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
              >
                <i className="bi bi-search me-1" />
                Xem tất cả sách →
              </Link>
            </div>

            <Row className="g-4">
              {selectedCategory.groups.map((group) => {
                const groupHref = group.id_the_loai
                  ? `/store/search?id_the_loai=${group.id_the_loai}`
                  : `/store/search?q=${encodeURIComponent(group.title)}`;

                return (
                  <Col
                    xl={4}
                    md={6}
                    className="sub-category-group"
                    key={group.title}
                  >
                    <Link
                      href={groupHref}
                      onClick={onClose}
                      className="sub-category-group-header mb-2"
                    >
                      <h6 className="fw-bold mb-0">
                        {group.title}
                        <i className="bi bi-chevron-right ms-1 text-primary small group-icon" />
                      </h6>
                    </Link>

                    <div className="sub-category-items-list mb-2">
                      {group.items.map((rawItem) => {
                        const itemName =
                          typeof rawItem === "string" ? rawItem : rawItem.name;
                        const itemHref =
                          typeof rawItem === "object" && rawItem.id_the_loai
                            ? `/store/search?id_the_loai=${rawItem.id_the_loai}`
                            : typeof rawItem === "object" && rawItem.keyword
                            ? `/store/search?q=${encodeURIComponent(
                                rawItem.keyword
                              )}`
                            : group.id_the_loai
                            ? `/store/search?id_the_loai=${
                                group.id_the_loai
                              }&q=${encodeURIComponent(itemName)}`
                            : `/store/search?q=${encodeURIComponent(itemName)}`;

                        return (
                          <Link
                            key={itemName}
                            href={itemHref}
                            onClick={onClose}
                            className="sub-category-link"
                          >
                            {itemName}
                          </Link>
                        );
                      })}
                    </div>

                    <Link
                      href={groupHref}
                      onClick={onClose}
                      className="view-all-link text-primary fw-semibold"
                    >
                      Xem tất cả <i className="bi bi-arrow-right ms-1" />
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}