"use client";

import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthProvider";
import { nguoiDungAPI } from "@/lib/api";

export default function AccountPage() {
  const { user, capNhatUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    tinh_thanh: "",
    quan_huyen: "",
    phuong_xa: "",
    dia_chi_chi_tiet: "",
  });

  //Load du lieu tu user khi mount  useEffect(() => {
    if (user) {
      setForm({
        ho_ten: user.ho_ten,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        tinh_thanh: user.tinh_thanh,
        quan_huyen: user.quan_huyen,
        phuong_xa: user.phuong_xa,
        dia_chi_chi_tiet: user.dia_chi_chi_tiet || "",
      });
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      await nguoiDungAPI.capNhatProfile(form);
      await capNhatUser(); //Refresh thong tin user trong AuthContext      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="account-card">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-person me-2" />Thông tin cá nhân
          </h5>
          {!editing && (
            <Button variant="outline-primary" size="sm" onClick={() => setEditing(true)}>
              <i className="bi bi-pencil me-1" />Chỉnh sửa
            </Button>
          )}
        </div>

        {saved && <Alert variant="success">Cập nhật thông tin thành công!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Họ và tên</Form.Label>
              <Form.Control name="ho_ten" value={form.ho_ten} onChange={handleChange} disabled={!editing} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Email</Form.Label>
              <Form.Control value={form.email} disabled />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Số điện thoại</Form.Label>
              <Form.Control name="so_dien_thoai" value={form.so_dien_thoai} onChange={handleChange} disabled={!editing} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Tỉnh/Thành</Form.Label>
              <Form.Control name="tinh_thanh" value={form.tinh_thanh} onChange={handleChange} disabled={!editing} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Quận/Huyện</Form.Label>
              <Form.Control name="quan_huyen" value={form.quan_huyen} onChange={handleChange} disabled={!editing} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-secondary small">Phường/Xã</Form.Label>
              <Form.Control name="phuong_xa" value={form.phuong_xa} onChange={handleChange} disabled={!editing} />
            </Form.Group>
          </Col>
        </Row>

        {editing && (
          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-1" />Đang lưu...</> : <><i className="bi bi-check-lg me-1" />Lưu thay đổi</>}
            </Button>
            <Button variant="outline-secondary" onClick={() => setEditing(false)}>Hủy</Button>
          </div>
        )}
      </div>
    </>
  );
}
