"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, dangXuat } = useAuth();

  const links = [
    { href: "/customer/account", icon: "bi-person", label: "Thông tin tài khoản" },
    { href: "/customer/account/orders", icon: "bi-bag", label: "Đơn hàng của tôi" },
    { href: "/customer/account/password", icon: "bi-key", label: "Đổi mật khẩu" },
  ];

  return (
    <div className="account-sidebar">
      <div className="account-sidebar-card">
        <div className="account-sidebar-header">
          <div className="account-sidebar-avatar">
            <i className="bi bi-person" />
          </div>
          <div>
            <div className="account-sidebar-name">
              {user?.ho_ten || "Khách hàng"}
            </div>
            <small className="text-secondary">
              {user?.email || ""}
            </small>
          </div>
        </div>

        <nav className="account-sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`account-sidebar-link${pathname === link.href ? " active" : ""}`}
            >
              <i className={`bi ${link.icon}`} />
              {link.label}
            </Link>
          ))}
          <button
            className="account-sidebar-link text-danger"
            onClick={dangXuat}
            style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
          >
            <i className="bi bi-box-arrow-right" />
            Đăng xuất
          </button>
        </nav>
      </div>
    </div>
  );
}
