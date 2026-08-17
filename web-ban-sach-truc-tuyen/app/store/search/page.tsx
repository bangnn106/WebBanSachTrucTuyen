"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { mockBooks } from "@/constants/testData";
import { priceRanges } from "@/constants/bookData";
import BookFilter from "@/components/books/bookFilter";
import BookGrid from "@/components/books/bookGrid";
import BookPagination from "@/components/books/bookPagination";

const PAGE_SIZE = 12;

function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [category, setCategory] = useState<number | null>(null);
  const [priceIdx, setPriceIdx] = useState<number | null>(null);
  const [sort, setSort] = useState("MOI_NHAT");
  const [page, setPage] = useState(1);

  /* Lọc + sắp xếp */
  const filtered = useMemo(() => {
    let result = mockBooks.filter((b) => b.trang_thai !== "Ngừng bán");

    /* Tìm kiếm theo từ khoá */
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (b) =>
          b.ten_sach.toLowerCase().includes(kw) ||
          b.tac_gia.toLowerCase().includes(kw) ||
          b.isbn.includes(kw)
      );
    }

    /* Lọc thể loại */
    if (category !== null) {
      result = result.filter((b) => b.id_the_loai === category);
    }

    /* Lọc khoảng giá */
    if (priceIdx !== null) {
      const range = priceRanges[priceIdx];
      result = result.filter(
        (b) => b.gia_ban >= range.min && b.gia_ban <= range.max
      );
    }

    /* Sắp xếp */
    switch (sort) {
      case "GIA_TANG":
        result.sort((a, b) => a.gia_ban - b.gia_ban);
        break;
      case "GIA_GIAM":
        result.sort((a, b) => b.gia_ban - a.gia_ban);
        break;
      case "BAN_CHAY":
        result.sort((a, b) => b.so_luong_da_ban - a.so_luong_da_ban);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [keyword, category, priceIdx, sort]);

  /* Phân trang */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedBooks = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <Container fluid="xl" className="py-4">
      {/* Breadcrumb */}
      <nav className="book-detail-breadcrumb mb-3">
        <a href="/">Trang chủ</a>
        <i className="bi bi-chevron-right mx-2" />
        <span>{keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Tất cả sách"}</span>
      </nav>

      <Row className="g-4">
        {/* Sidebar lọc */}
        <Col lg={3}>
          <BookFilter
            selectedCategory={category}
            selectedPrice={priceIdx}
            selectedSort={sort}
            onCategoryChange={(v) => { setCategory(v); setPage(1); }}
            onPriceChange={(v) => { setPriceIdx(v); setPage(1); }}
            onSortChange={(v) => { setSort(v); setPage(1); }}
          />
        </Col>

        {/* Danh sách sách */}
        <Col lg={9}>
          <div className="search-results-header mb-3">
            <h5 className="fw-bold mb-0">
              {keyword ? (
                <>Kết quả tìm kiếm cho &ldquo;{keyword}&rdquo;</>
              ) : (
                <>Tất cả sách</>
              )}
            </h5>
            <span className="text-secondary">
              ({filtered.length} sản phẩm)
            </span>
          </div>

          <BookGrid books={pagedBooks} />

          <BookPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
