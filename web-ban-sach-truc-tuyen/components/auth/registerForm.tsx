"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthProvider";

export default function RegisterForm() {
  const router = useRouter();
  const { dangKy } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    mat_khau_xac_nhan: "",
    so_dien_thoai: "",
    tinh_thanh: "",
    quan_huyen: "",
    phuong_xa: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.mat_khau !== form.mat_khau_xac_nhan) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.mat_khau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      //Goi API ang ky that      const { mat_khau_xac_nhan, ...duLieuGui } = form;
      await dangKy(duLieuGui);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 540 }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus" style={{ fontSize: 40, color: "var(--primary)" }} />
          <h2 className="mt-2">Đăng ký tài khoản</h2>
          <p className="text-secondary">Tạo tài khoản để mua sắm dễ dàng hơn</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
            <Form.Control name="ho_ten" value={form.ho_ten} onChange={handleChange} placeholder="Nhập họ tên" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Nhập email" required />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                <Form.Control type="password" name="mat_khau" value={form.mat_khau} onChange={handleChange} placeholder="Ít nhất 6 ký tự" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
                <Form.Control type="password" name="mat_khau_xac_nhan" value={form.mat_khau_xac_nhan} onChange={handleChange} placeholder="Nhập lại mật khẩu" required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
            <Form.Control name="so_dien_thoai" value={form.so_dien_thoai} onChange={handleChange} placeholder="Nhập số điện thoại" pattern="[0-9]{10}" title="Số điện thoại gồm 10 chữ số" required />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tỉnh/Thành <span className="text-danger">*</span></Form.Label>
                <Form.Control name="tinh_thanh" value={form.tinh_thanh} onChange={handleChange} placeholder="VD: TP.HCM" required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quận/Huyện <span className="text-danger">*</span></Form.Label>
                <Form.Control name="quan_huyen" value={form.quan_huyen} onChange={handleChange} placeholder="VD: Quận 1" required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phường/Xã <span className="text-danger">*</span></Form.Label>
                <Form.Control name="phuong_xa" value={form.phuong_xa} onChange={handleChange} placeholder="VD: P. Bến Nghé" required />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="w-100 mt-2" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Đang đăng ký...</>
            ) : (
              <><i className="bi bi-person-plus me-2" />Đăng ký</>
            )}
          </Button>
        </Form>

        <div className="auth-divider">hoặc</div>

        <p className="text-center mb-0">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-primary fw-bold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
