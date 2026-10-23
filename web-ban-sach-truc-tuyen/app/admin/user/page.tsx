"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import { nguoiDungAPI } from "@/lib/api";

const tenVaiTro: Record<string, string> = {
  KHACH_HANG: "Khách hàng",
  NHAN_VIEN: "Nhân viên",
  QUAN_TRI_VIEN: "Quản trị viên",
};

const mauVaiTro: Record<string, string> = {
  KHACH_HANG: "success",
  NHAN_VIEN: "info",
  QUAN_TRI_VIEN: "danger",
};

export default function AdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locVaiTro, setLocVaiTro] = useState("");
  const [thongBao, setThongBao] = useState("");

  // Modal them tai khoan
  const [showModal, setShowModal] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");
  const [formUser, setFormUser] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    so_dien_thoai: "",
    id_vai_tro: "2", // Mac dinh: Nhan vien
    tinh_thanh: "Hồ Chí Minh",
    quan_huyen: "Quận 1",
    phuong_xa: "Phường Bến Nghé",
    dia_chi_chi_tiet: "",
  });

  function taiDanhSach() {
    setDangTai(true);
    nguoiDungAPI
      .layDanhSach({
        tu_khoa: tuKhoa || undefined,
        id_vai_tro: locVaiTro ? parseInt(locVaiTro) : undefined,
        trang,
        kich_thuoc_trang: 20,
      })
      .then((res) => {
        setUsers(res.data.items || res.data || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => { taiDanhSach(); }, [trang, locVaiTro]);

  function moFormThem() {
    setFormUser({
      ho_ten: "",
      email: "",
      mat_khau: "",
      so_dien_thoai: "",
      id_vai_tro: "2",
      tinh_thanh: "Hồ Chí Minh",
      quan_huyen: "Quận 1",
      phuong_xa: "Phường Bến Nghé",
      dia_chi_chi_tiet: "",
    });
    setLoi("");
    setShowModal(true);
  }

  async function handleLuu() {
    setLoi("");
    if (!formUser.ho_ten || !formUser.email || !formUser.mat_khau || !formUser.so_dien_thoai) {
      setLoi("Vui lòng điền đầy đủ thông tin bắt buộc (*).");
      return;
    }

    if (formUser.mat_khau.length < 6) {
      setLoi("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setDangLuu(true);
    try {
      await nguoiDungAPI.taoTaiKhoan({
        ho_ten: formUser.ho_ten,
        email: formUser.email,
        mat_khau: formUser.mat_khau,
        so_dien_thoai: formUser.so_dien_thoai,
        id_vai_tro: parseInt(formUser.id_vai_tro),
        tinh_thanh: formUser.tinh_thanh,
        quan_huyen: formUser.quan_huyen,
        phuong_xa: formUser.phuong_xa,
        dia_chi_chi_tiet: formUser.dia_chi_chi_tiet || undefined,
      });

      setThongBao("Tạo tài khoản thành công! Dữ liệu đã được lưu vào hệ thống.");
      setTimeout(() => setThongBao(""), 4000);
      setShowModal(false);
      taiDanhSach();
    } catch (err: any) {
      setLoi(err.message || "Tạo tài khoản thất bại.");
    } finally {
      setDangLuu(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0"><i className="bi bi-people me-2" />Quản lý người dùng</h4>
        <Button variant="primary" onClick={moFormThem}>
          <i className="bi bi-person-plus me-1" />Thêm tài khoản
        </Button>
      </div>

      {thongBao && <Alert variant="success" onClose={() => setThongBao("")} dismissible>{thongBao}</Alert>}

      <div className="d-flex gap-3 mb-3 flex-wrap">
        <Form.Control
          placeholder="Tìm tên, email, SĐT..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setTrang(1), taiDanhSach())}
          style={{ maxWidth: 250 }}
        />
        <Form.Select value={locVaiTro} onChange={(e) => { setLocVaiTro(e.target.value); setTrang(1); }} style={{ maxWidth: 180 }}>
          <option value="">Tất cả vai trò</option>
          <option value="1">Khách hàng</option>
          <option value="2">Nhân viên</option>
          <option value="3">Quản trị viên</option>
        </Form.Select>
        <Button variant="outline-primary" onClick={() => { setTrang(1); taiDanhSach(); }}>
          <i className="bi bi-search me-1" />Tìm
        </Button>
      </div>

      {dangTai ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>ID</th><th>Họ tên</th><th>Email</th>
                <th>SĐT</th><th>Địa chỉ</th><th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id_nguoi_dung || u.id}>
                  <td>{u.id_nguoi_dung || u.id}</td>
                  <td className="fw-bold">{u.ho_ten}</td>
                  <td>{u.email}</td>
                  <td>{u.so_dien_thoai}</td>
                  <td>{[u.dia_chi_chi_tiet, u.phuong_xa, u.quan_huyen, u.tinh_thanh].filter(Boolean).join(", ")}</td>
                  <td>
                    <Badge bg={mauVaiTro[u.ten_vai_tro] || "secondary"}>
                      {tenVaiTro[u.ten_vai_tro] || u.ten_vai_tro}
                    </Badge>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="text-center text-secondary py-4">Không có người dùng</td></tr>
              )}
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

      {/* MODAL THEM TAI KHOAN */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-person-plus me-2" />Thêm tài khoản mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loi && <Alert variant="danger">{loi}</Alert>}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Họ tên *</Form.Label>
                <Form.Control
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formUser.ho_ten}
                  onChange={(e) => setFormUser(p => ({ ...p, ho_ten: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email đăng nhập *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="nhanvien@bookstore.com"
                  value={formUser.email}
                  onChange={(e) => setFormUser(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mật khẩu ban đầu *</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={formUser.mat_khau}
                  onChange={(e) => setFormUser(p => ({ ...p, mat_khau: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Số điện thoại *</Form.Label>
                <Form.Control
                  placeholder="0912345678"
                  value={formUser.so_dien_thoai}
                  onChange={(e) => setFormUser(p => ({ ...p, so_dien_thoai: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Vai trò *</Form.Label>
                <Form.Select
                  value={formUser.id_vai_tro}
                  onChange={(e) => setFormUser(p => ({ ...p, id_vai_tro: e.target.value }))}
                >
                  <option value="2">Nhân viên</option>
                  <option value="3">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tỉnh / Thành phố</Form.Label>
                <Form.Control
                  value={formUser.tinh_thanh}
                  onChange={(e) => setFormUser(p => ({ ...p, tinh_thanh: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Quận / Huyện</Form.Label>
                <Form.Control
                  value={formUser.quan_huyen}
                  onChange={(e) => setFormUser(p => ({ ...p, quan_huyen: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Phường / Xã</Form.Label>
                <Form.Control
                  value={formUser.phuong_xa}
                  onChange={(e) => setFormUser(p => ({ ...p, phuong_xa: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Địa chỉ chi tiết</Form.Label>
                <Form.Control
                  placeholder="Số nhà, tên đường (tùy chọn)"
                  value={formUser.dia_chi_chi_tiet}
                  onChange={(e) => setFormUser(p => ({ ...p, dia_chi_chi_tiet: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleLuu} disabled={dangLuu}>
            {dangLuu ? "Đang tạo..." : "Lưu vào hệ thống"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
