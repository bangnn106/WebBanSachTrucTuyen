"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Modal, Row, Col, Spinner, Table } from "react-bootstrap";
import { sachAPI } from "@/lib/api";

export default function AdminBookPage() {
  const [sachList, setSachList] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState("");
  const [thongBao, setThongBao] = useState("");

  // Du lieu cho form them/sua
  const [showModal, setShowModal] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [theLoais, setTheLoais] = useState<any[]>([]);
  const [nxbs, setNxbs] = useState<any[]>([]);
  const [formSach, setFormSach] = useState({
    ten_sach: "", isbn: "", tac_gia: "", mo_ta_ngan: "",
    gia_goc: "", gia_ban: "", nam_xuat_ban: "", ngon_ngu: "Tiếng Việt",
    so_luong_ton: "0", id_the_loai: "", id_nha_xuat_ban: "",
  });
  const [anhBia, setAnhBia] = useState<File | null>(null);

  function taiDanhSach() {
    setDangTai(true);
    sachAPI.timKiem({ tu_khoa: tuKhoa || undefined, trang, kich_thuoc_trang: 15 })
      .then((res) => {
        setSachList(res.data.items || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => { taiDanhSach(); }, [trang]);

  useEffect(() => {
    Promise.all([sachAPI.layDanhSachTheLoai(), sachAPI.layDanhSachNhaXuatBan()])
      .then(([resTL, resNXB]) => {
        setTheLoais(resTL.data || []);
        setNxbs(resNXB.data || []);
      })
      .catch(() => {});
  }, []);

  function moFormThem() {
    setEditId(null);
    setFormSach({
      ten_sach: "", isbn: "", tac_gia: "", mo_ta_ngan: "",
      gia_goc: "", gia_ban: "", nam_xuat_ban: "", ngon_ngu: "Tiếng Việt",
      so_luong_ton: "0", id_the_loai: "", id_nha_xuat_ban: "",
    });
    setAnhBia(null);
    setLoi("");
    setShowModal(true);
  }

  function moFormSua(sach: any) {
    setEditId(sach.id_sach || sach.id);
    setFormSach({
      ten_sach: sach.ten_sach, isbn: sach.isbn, tac_gia: sach.tac_gia,
      mo_ta_ngan: sach.mo_ta_ngan || "", gia_goc: String(sach.gia_goc),
      gia_ban: String(sach.gia_ban), nam_xuat_ban: sach.nam_xuat_ban ? String(sach.nam_xuat_ban) : "",
      ngon_ngu: sach.ngon_ngu || "Tiếng Việt", so_luong_ton: String(sach.so_luong_ton),
      id_the_loai: String(sach.id_the_loai), id_nha_xuat_ban: String(sach.id_nha_xuat_ban),
    });
    setAnhBia(null);
    setLoi("");
    setShowModal(true);
  }

  async function handleLuu() {
    setLoi("");
    setDangLuu(true);
    try {
      const fd = new FormData();
      Object.entries(formSach).forEach(([k, v]) => fd.append(k, v));
      if (anhBia) fd.append("anh_bia", anhBia);

      if (editId) {
        await sachAPI.capNhat(editId, fd);
        setThongBao("Cập nhật sách thành công!");
      } else {
        await sachAPI.themMoi(fd);
        setThongBao("Thêm sách thành công!");
      }
      setTimeout(() => setThongBao(""), 3000);
      setShowModal(false);
      taiDanhSach();
    } catch (err: any) {
      setLoi(err.message || "Lưu thất bại.");
    } finally {
      setDangLuu(false);
    }
  }

  async function doiTrangThai(id: number, trangThai: string) {
    try {
      await sachAPI.capNhatTrangThai(id, trangThai);
      taiDanhSach();
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật");
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-book me-2" />Quản lý sách</h4>
        <Button variant="primary" onClick={moFormThem}>
          <i className="bi bi-plus-lg me-1" />Thêm sách
        </Button>
      </div>

      {thongBao && <Alert variant="success">{thongBao}</Alert>}

      <div className="d-flex gap-2 mb-3">
        <Form.Control
          placeholder="Tìm tên sách, tác giả..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setTrang(1), taiDanhSach())}
          style={{ maxWidth: 300 }}
        />
        <Button variant="outline-primary" onClick={() => { setTrang(1); taiDanhSach(); }}>
          <i className="bi bi-search" />
        </Button>
      </div>

      {dangTai ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>ID</th><th>Tên sách</th><th>Tác giả</th>
                <th className="text-end">Giá bán</th><th className="text-center">Tồn</th>
                <th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sachList.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.id_sach || s.id}</td>
                  <td style={{ maxWidth: 250 }}>{s.ten_sach}</td>
                  <td>{s.tac_gia}</td>
                  <td className="text-end">{s.gia_ban?.toLocaleString("vi-VN")} đ</td>
                  <td className="text-center">{s.so_luong_ton}</td>
                  <td>
                    <Badge bg={s.trang_thai === "Còn hàng" ? "success" : s.trang_thai === "Hết hàng" ? "warning" : "secondary"}>
                      {s.trang_thai}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => moFormSua(s)}>
                        <i className="bi bi-pencil" />
                      </Button>
                      {s.trang_thai !== "Ngừng bán" ? (
                        <Button variant="outline-danger" size="sm" onClick={() => doiTrangThai(s.id_sach || s.id, "Ngừng bán")}>
                          Ngừng
                        </Button>
                      ) : (
                        <Button variant="outline-success" size="sm" onClick={() => doiTrangThai(s.id_sach || s.id, s.so_luong_ton > 0 ? "Còn hàng" : "Hết hàng")}>
                          Mở lại
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {tongTrang > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button variant="outline-primary" size="sm" disabled={trang <= 1} onClick={() => setTrang(trang - 1)}>Trước</Button>
              <span className="d-flex align-items-center px-3">Trang {trang}/{tongTrang}</span>
              <Button variant="outline-primary" size="sm" disabled={trang >= tongTrang} onClick={() => setTrang(trang + 1)}>Sau</Button>
            </div>
          )}
        </>
      )}

      {/* MODAL THEM/SUA SACH */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Sửa sách" : "Thêm sách mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loi && <Alert variant="danger">{loi}</Alert>}
          <Row className="g-3">
            <Col md={8}>
              <Form.Group><Form.Label>Tên sách *</Form.Label>
                <Form.Control value={formSach.ten_sach} onChange={(e) => setFormSach(p => ({...p, ten_sach: e.target.value}))} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>ISBN *</Form.Label>
                <Form.Control value={formSach.isbn} onChange={(e) => setFormSach(p => ({...p, isbn: e.target.value}))} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group><Form.Label>Tác giả *</Form.Label>
                <Form.Control value={formSach.tac_gia} onChange={(e) => setFormSach(p => ({...p, tac_gia: e.target.value}))} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>Giá gốc *</Form.Label>
                <Form.Control type="number" value={formSach.gia_goc} onChange={(e) => setFormSach(p => ({...p, gia_goc: e.target.value}))} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>Giá bán *</Form.Label>
                <Form.Control type="number" value={formSach.gia_ban} onChange={(e) => setFormSach(p => ({...p, gia_ban: e.target.value}))} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>Thể loại *</Form.Label>
                <Form.Select value={formSach.id_the_loai} onChange={(e) => setFormSach(p => ({...p, id_the_loai: e.target.value}))} required>
                  <option value="">Chọn thể loại</option>
                  {theLoais.map((tl: any) => <option key={tl.id_the_loai || tl.id} value={tl.id_the_loai || tl.id}>{tl.ten_the_loai}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>NXB *</Form.Label>
                <Form.Select value={formSach.id_nha_xuat_ban} onChange={(e) => setFormSach(p => ({...p, id_nha_xuat_ban: e.target.value}))} required>
                  <option value="">Chọn NXB</option>
                  {nxbs.map((nxb: any) => <option key={nxb.id_nha_xuat_ban || nxb.id} value={nxb.id_nha_xuat_ban || nxb.id}>{nxb.ten_nxb}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>Năm xuất bản</Form.Label>
                <Form.Control type="number" value={formSach.nam_xuat_ban} onChange={(e) => setFormSach(p => ({...p, nam_xuat_ban: e.target.value}))} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>Số lượng tồn</Form.Label>
                <Form.Control type="number" value={formSach.so_luong_ton} onChange={(e) => setFormSach(p => ({...p, so_luong_ton: e.target.value}))} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>Ngôn ngữ</Form.Label>
                <Form.Control value={formSach.ngon_ngu} onChange={(e) => setFormSach(p => ({...p, ngon_ngu: e.target.value}))} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group><Form.Label>Ảnh bìa</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setAnhBia((e.target as HTMLInputElement).files?.[0] || null)} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group><Form.Label>Mô tả ngắn</Form.Label>
                <Form.Control as="textarea" rows={3} value={formSach.mo_ta_ngan} onChange={(e) => setFormSach(p => ({...p, mo_ta_ngan: e.target.value}))} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleLuu} disabled={dangLuu}>
            {dangLuu ? "Đang lưu..." : editId ? "Cập nhật" : "Thêm sách"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
