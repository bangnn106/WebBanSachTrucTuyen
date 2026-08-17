"use client";

import { Col, Row } from "react-bootstrap";
import BookCard from "./bookCard";
import { book } from "@/types/book";

interface Props {
  books: book[];
}

export default function BookGrid({ books }: Props) {
  if (books.length === 0) {
    return (
      <div className="book-grid-empty text-center py-5">
        <i className="bi bi-search fs-1 text-secondary" />
        <p className="mt-3 text-secondary">
          Không tìm thấy sách phù hợp.
        </p>
      </div>
    );
  }

  return (
    <Row className="g-3">
      {books.map((b) => (
        <Col key={b.id} xl={3} lg={4} md={4} sm={6} xs={6}>
          <BookCard book={b} />
        </Col>
      ))}
    </Row>
  );
}
