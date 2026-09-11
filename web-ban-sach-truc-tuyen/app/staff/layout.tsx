"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthProvider";

const menuItems = [
  { href: "/staff/order", icon: "bi-bag", label: "Đơn hàng" },
  { href: "/staff/inventory", icon: "bi-box-seam", label: "Kho hàng" },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, dangTai, daDangNhap, dangXuat } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  //Kiem tra quyen: NHAN VIEN hoac QUAN TRI VIEN  useEffect(() => {
    if (!dangTai && (!daDangNhap || !["NHAN_VIEN", "QUAN_TRI_VIEN"].includes(user?.ten_vai_tro || ""))) {
      router.push("/auth/login");
    }
  }, [dangTai, daDangNhap, user, router]);

  if (dangTai || !daDangNhap || !["NHAN_VIEN", "QUAN_TRI_VIEN"].includes(user?.ten_vai_tro || "")) {
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
          width: 240,
          background: "#0f172a",
          color: "#fff",
          padding: "20px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1e293b" }}>
          <h5 className="fw-bold mb-1">📋 Staff Panel</h5>
          <small style={{ color: "#94a3b8" }}>{user?.ho_ten}</small>
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
                background: pathname.startsWith(item.href) ? "#1e293b" : "transparent",
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

        <div style={{ padding: "20px", marginTop: "auto", borderTop: "1px solid #1e293b" }}>
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

      {/* MAIN */}
      <main style={{ flex: 1, background: "#f1f5f9", padding: 24, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
