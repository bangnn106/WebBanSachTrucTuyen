"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Spinner } from "react-bootstrap";
import { sachAPI } from "@/lib/api";

interface TheLoai {
  id: number;
  ten_the_loai: string;
}

//Bieu tuong cho mot so the loai pho bienconst bieuTuong: Record<string, string> = {
  "Văn học": "📖",
  "Kinh tế": "💰",
  "Tâm lý": "🧠",
  "Thiếu nhi": "🧒",
  "Khoa học": "🔬",
  "Ngoại ngữ": "🌐",
  "Kỹ năng sống": "💡",
  "Lịch sử": "🏛️",
  "Giáo khoa": "📝",
  "Truyện tranh": "🎨",
};

export default function CategoryHighlight() {
  const [danhSach, setDanhSach] = useState<TheLoai[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    sachAPI
      .layDanhSachTheLoai()
      .then((res) => setDanhSach(res.data || []))
      .catch(() => {})
      .finally(() => setDangTai(false));
  }, []);

  if (dangTai) {
    return (
      <Container fluid="xl" className="py-4 text-center">
        <Spinner animation="border" size="sm" />
      </Container>
    );
  }

  if (danhSach.length === 0) return null;

  return (
    <section className="category-highlight">
      <Container fluid="xl">
        <h3 className="section-title">📂 Danh mục nổi bật</h3>
        <div className="category-grid">
          {danhSach.map((tl) => (
            <Link
              key={tl.id}
              href={`/store/search?id_the_loai=${tl.id}`}
              className="category-card"
            >
              <span className="category-icon">
                {bieuTuong[tl.ten_the_loai] || "📚"}
              </span>
              <span className="category-name">{tl.ten_the_loai}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
