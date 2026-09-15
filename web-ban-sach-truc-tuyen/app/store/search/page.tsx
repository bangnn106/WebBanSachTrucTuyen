"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import BookCard from "@/components/books/bookCard";
import { sachAPI } from "@/lib/api";
import { book } from "@/types/book";

interface TheLoai { id_the_loai: number; id?: number; ten_the_loai: string; }
interface NhaXuatBan { id_nha_xuat_ban: number; id?: number; ten_nxb: string; }

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State cho bo loc
  const [tuKhoa, setTuKhoa] = useState(searchParams.get("q") || "");
  const [idTheLoai, setIdTheLoai] = useState(searchParams.get("id_the_loai") || "");
  const [sapXep, setSapXep] = useState("MOI_NHAT");
  const [trang, setTrang] = useState(1);

  // State cho du lieu
  const [danhSachSach, setDanhSachSach] = useState<book[]>([]);
  const [tongTrang, setTongTrang] = useState(0);
  const [danhSachTheLoai, setDanhSachTheLoai] = useState<TheLoai[]>([]);
  const [dangTai, setDangTai] = useState(true);

  // Load danh sach the loai khi mount
  useEffect(() => {
    sachAPI.layDanhSachTheLoai()
      .then((res) => setDanhSachTheLoai(res.data || []))
      .catch(() => {});
  }, []);

  // Load sach khi params thay doi
  useEffect(() => {
    setDangTai(true);
    sachAPI
      .timKiem({
        tu_khoa: tuKhoa || undefined,
        id_the_loai: idTheLoai ? parseInt(idTheLoai) : undefined,
        sap_xep: sapXep,
        trang,
        kich_thuoc_trang: 12,
      })
      .then((res) => {
        setDanhSachSach(res.data.items || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => setDanhSachSach([]))
      .finally(() => setDangTai(false));
  }, [tuKhoa, idTheLoai, sapXep, trang]);

  // Cap nhat tuKhoa khi URL thay doi
  useEffect(() => {
    setTuKhoa(searchParams.get("q") || "");
    setIdTheLoai(searchParams.get("id_the_loai") || "");
    setTrang(1);
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setTrang(1);
    router.push(`/store/search?q=${encodeURIComponent(tuKhoa)}`);
  }

  return (
    <Container fluid="xl" className="py-4">
      <nav className="book-detail-breadcrumb mb-3">
        <a href="/">Trang chủ</a>
        <i className="bi bi-chevron-right mx-2" />
        <span>Tìm kiếm sách</span>
      </nav>

      <Row className="g-4">
        {/* BO LOC BEN TRAI */}
        <Col lg={3}>
          <div className="p-3 border rounded bg-white">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-funnel me-2" />Bộ lọc
            </h5>

            <Form onSubmit={handleSearch}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Từ khóa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tìm sách..."
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Thể loại</Form.Label>
                <Form.Select
                  value={idTheLoai}
                  onChange={(e) => { setIdTheLoai(e.target.value); setTrang(1); }}
                >
                  <option value="">Tất cả thể loại</option>
                  {danhSachTheLoai.map((tl) => (
                    <option key={tl.id_the_loai || tl.id} value={tl.id_the_loai || tl.id}>{tl.ten_the_loai}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Sắp xếp</Form.Label>
                <Form.Select
                  value={sapXep}
                  onChange={(e) => { setSapXep(e.target.value); setTrang(1); }}
                >
                  <option value="MOI_NHAT">Mới nhất</option>
                  <option value="BAN_CHAY">Bán chạy</option>
                  <option value="GIA_TANG">Giá tăng dần</option>
                  <option value="GIA_GIAM">Giá giảm dần</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                <i className="bi bi-search me-2" />Tìm kiếm
              </Button>
            </Form>
          </div>
        </Col>

        {/* DANH SACH SACH */}
        <Col lg={9}>
          <h4 className="fw-bold mb-3">
            {tuKhoa && idTheLoai
              ? `Kết quả "${tuKhoa}" - ${danhSachTheLoai.find((t) => String(t.id_the_loai || t.id) === idTheLoai)?.ten_the_loai || ""}`
              : tuKhoa
              ? `Kết quả tìm kiếm "${tuKhoa}"`
              : idTheLoai
              ? `Thể loại: ${danhSachTheLoai.find((t) => String(t.id_the_loai || t.id) === idTheLoai)?.ten_the_loai || "Sách theo thể loại"}`
              : "Tất cả sách"}
          </h4>

          {dangTai ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : danhSachSach.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2" />
              Không tìm thấy sách nào phù hợp.
            </Alert>
          ) : (
            <>
              <Row className="g-3">
                {danhSachSach.map((s) => (
                  <Col key={s.id_sach || s.id} xs={6} md={4} lg={3}>
                    <BookCard book={s} />
                  </Col>
                ))}
              </Row>

              {/* PHAN TRANG */}
              {tongTrang > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={trang <= 1}
                    onClick={() => setTrang(trang - 1)}
                  >
                    <i className="bi bi-chevron-left" /> Trước
                  </Button>
                  <span className="d-flex align-items-center px-3">
                    Trang {trang} / {tongTrang}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={trang >= tongTrang}
                    onClick={() => setTrang(trang + 1)}
                  >
                    Sau <i className="bi bi-chevron-right" />
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container fluid="xl" className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Đang tải...</p>
        </Container>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
