"use client";

import { Button } from "react-bootstrap";

interface Props {
  value: number;
  max: number;
  onChange: (v: number) => void;
}

export default function QuantityInput({ value, max, onChange }: Props) {
  return (
    <div className="quantity-input">
      <Button
        variant="outline-secondary"
        size="sm"
        className="quantity-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <i className="bi bi-dash" />
      </Button>

      <input
        type="number"
        className="quantity-value"
        value={value}
        min={1}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= 1 && n <= max) onChange(n);
        }}
      />

      <Button
        variant="outline-secondary"
        size="sm"
        className="quantity-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <i className="bi bi-plus" />
      </Button>
    </div>
  );
}
