"use client";

import { useState, FormEvent } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { xacThucAPI } from "@/lib/api";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    mat_khau_cu: "",
    mat_khau_moi: "",
    xac_nhan_mat_khau: "",
  });
  const [loading, setLoading] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [loi, setLoi] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoi("");
    setThongBao("");

    if (form.mat_khau_moi !== form.xac_nhan_mat_khau) {
      setLoi("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    if (form.mat_khau_moi.length < 6) {
      setLoi("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      await xacThucAPI.doiMatKhau(form.mat_khau_cu, form.mat_khau_moi);
      setThongBao("Đổi mật khẩu thành công!");
      setForm({ mat_khau_cu: "", mat_khau_moi: "", xac_nhan_mat_khau: "" });
    } catch (err: any) {
      setLoi(err.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="account-card">
      <h5 className="fw-bold mb-4">
        <i className="bi bi-key me-2" />Đổi mật khẩu
      </h5>

      {thongBao && <Alert variant="success">{thongBao}</Alert>}
      {loi && <Alert variant="danger">{loi}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu hiện tại</Form.Label>
          <Form.Control
            type="password"
            name="mat_khau_cu"
            value={form.mat_khau_cu}
            onChange={handleChange}
            placeholder="Nhập mật khẩu hiện tại"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="mat_khau_moi"
            value={form.mat_khau_moi}
            onChange={handleChange}
            placeholder="Ít nhất 6 ký tự"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="xac_nhan_mat_khau"
            value={form.xac_nhan_mat_khau}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2" />Đang xử lý...</>
          ) : (
            <><i className="bi bi-check-lg me-2" />Đổi mật khẩu</>
          )}
        </Button>
      </Form>
    </div>
  );
}
