"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthProvider";

export default function LoginForm() {
  const router = useRouter();
  const { dangNhap } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Goi API dang nhap that
      const user = await dangNhap(email, password);

      // Chuyen huong theo vai tro
      if (user.ten_vai_tro === "QUAN_TRI_VIEN") {
        router.push("/admin/report");
      } else if (user.ten_vai_tro === "NHAN_VIEN") {
        router.push("/staff/order");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="bi bi-book" style={{ fontSize: 40, color: "var(--primary)" }} />
          <h2 className="mt-2">Đăng nhập</h2>
          <p className="text-secondary">Chào mừng bạn quay trở lại!</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2" />
                Đăng nhập
              </>
            )}
          </Button>
        </Form>

        <div className="auth-divider">hoặc</div>

        <p className="text-center mb-0">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="text-primary fw-bold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
