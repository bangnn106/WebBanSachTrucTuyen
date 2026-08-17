import {
  Col,
  Container,
  Row,
} from "react-bootstrap";

import BookCard from "./bookCard";

import { book } from "@/types/book";

interface Props {
  title: string;
  books: book[];
}

export default function BookSection({
  title,
  books,
}: Props) {
  return (
    <Container fluid="xl">
      <section className="book-section">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="book-section-title">
            {title}
          </h2>

          <a href="/store/search" className="text-primary fw-bold">
            Xem tất cả &rarr;
          </a>
        </div>

        <Row className="g-3">

          {books.map((book) => (
            <Col
              key={book.id}
              xl={2}
              lg={3}
              md={4}
              sm={6}
              xs={6}
            >
              <BookCard book={book} />
            </Col>
          ))}

        </Row>

      </section>
    </Container>
  );
}