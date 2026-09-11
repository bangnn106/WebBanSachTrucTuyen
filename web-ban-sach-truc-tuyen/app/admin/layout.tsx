"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthProvider";

const menuItems = [
  { href: "/admin/report", icon: "bi-speedometer2", label: "Tổng quan" },
  { href: "/admin/order", icon: "bi-bag", label: "Đơn hàng" },
  { href: "/admin/book", icon: "bi-book", label: "Quản lý sách" },
  { href: "/admin/inventory", icon: "bi-box-seam", label: "Kho hàng" },
  { href: "/admin/user", icon: "bi-people", label: "Người dùng" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, dangTai, daDangNhap, dangXuat } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Kiem tra quyen: chi QUAN TRI VIEN moi vao duoc
  useEffect(() => {
    if (!dangTai && (!daDangNhap || user?.ten_vai_tro !== "QUAN_TRI_VIEN")) {
      router.push("/auth/login");
    }
  }, [dangTai, daDangNhap, user, router]);

  if (dangTai || !daDangNhap || user?.ten_vai_tro !== "QUAN_TRI_VIEN") {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 250,
          background: "#1e293b",
          color: "#fff",
          padding: "20px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #334155" }}>
          <h5 className="fw-bold mb-1">📚 Admin Panel</h5>
          <small style={{ color: "#94a3b8" }}>{user.ho_ten}</small>
        </div>

        <nav style={{ marginTop: 16 }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                color: pathname.startsWith(item.href) ? "#fff" : "#94a3b8",
                background: pathname.startsWith(item.href) ? "#334155" : "transparent",
                textDecoration: "none",
                fontSize: 14,
                borderLeft: pathname.startsWith(item.href) ? "3px solid #3b82f6" : "3px solid transparent",
              }}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "20px", marginTop: "auto", borderTop: "1px solid #334155" }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, display: "block", marginBottom: 8 }}>
            <i className="bi bi-house me-2" />Về trang chủ
          </Link>
          <button
            onClick={dangXuat}
            style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0 }}
          >
            <i className="bi bi-box-arrow-right me-2" />Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, background: "#f1f5f9", padding: 24, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
