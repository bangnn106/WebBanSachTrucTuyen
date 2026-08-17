"use client";

import { Form } from "react-bootstrap";
import {
  theLoaiMap,
  priceRanges,
  sortOptions,
} from "@/constants/bookData";

interface Props {
  selectedCategory: number | null;
  selectedPrice: number | null;
  selectedSort: string;
  onCategoryChange: (id: number | null) => void;
  onPriceChange: (idx: number | null) => void;
  onSortChange: (val: string) => void;
}

export default function BookFilter({
  selectedCategory,
  selectedPrice,
  selectedSort,
  onCategoryChange,
  onPriceChange,
  onSortChange,
}: Props) {
  return (
    <aside className="book-filter">
      {/* Thể loại */}
      <div className="book-filter-section">
        <h6 className="book-filter-title">
          <i className="bi bi-bookmarks me-2" />
          Thể loại
        </h6>
        <Form.Check
          type="radio"
          id="cat-all"
          label="Tất cả"
          name="category"
          checked={selectedCategory === null}
          onChange={() => onCategoryChange(null)}
        />
        {Object.entries(theLoaiMap).map(([id, name]) => (
          <Form.Check
            key={id}
            type="radio"
            id={`cat-${id}`}
            label={name}
            name="category"
            checked={selectedCategory === Number(id)}
            onChange={() => onCategoryChange(Number(id))}
          />
        ))}
      </div>

      {/* Khoảng giá */}
      <div className="book-filter-section">
        <h6 className="book-filter-title">
          <i className="bi bi-currency-exchange me-2" />
          Khoảng giá
        </h6>
        <Form.Check
          type="radio"
          id="price-all"
          label="Tất cả"
          name="priceRange"
          checked={selectedPrice === null}
          onChange={() => onPriceChange(null)}
        />
        {priceRanges.map((range, idx) => (
          <Form.Check
            key={idx}
            type="radio"
            id={`price-${idx}`}
            label={range.label}
            name="priceRange"
            checked={selectedPrice === idx}
            onChange={() => onPriceChange(idx)}
          />
        ))}
      </div>

      {/* Sắp xếp */}
      <div className="book-filter-section">
        <h6 className="book-filter-title">
          <i className="bi bi-sort-down me-2" />
          Sắp xếp
        </h6>
        <Form.Select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="book-filter-select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      </div>
    </aside>
  );
}
