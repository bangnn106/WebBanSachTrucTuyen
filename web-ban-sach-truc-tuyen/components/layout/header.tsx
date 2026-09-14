"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Container, Dropdown, Form } from "react-bootstrap";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryMenu from "./categoryMenu";
import { useAuth } from "@/contexts/AuthProvider";
import { useCart } from "@/contexts/CartProvider";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const { user, daDangNhap, dangXuat } = useAuth();
  const { totalItems } = useCart();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/store/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="site-header">
      <Container fluid="xl">
        <div className="main-header gap-4">
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/logo.jpg"
              alt="BookStore"
              width={230}
              height={70}
              className="logo-image"
            />
          </Link>

          {/* CATEGORY */}
          <button
            className="category-button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Danh mục sản phẩm"
          >
            <i className="bi bi-grid" />
            <i
              className={`bi ${
                showMenu ? "bi-chevron-up" : "bi-chevron-down"
              } fs-6 ms-2`}
            />
          </button>

          {/* SEARCH */}
          <Form className="search-wrapper flex-grow-1" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sách..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" className="search-button">
              <i className="bi bi-search fs-4" />
            </Button>
          </Form>

          {/* ACTIONS */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {/* Gio hang */}
            <Link href="/customer/cart" className="header-action" style={{ position: "relative" }}>
              <i className="bi bi-cart3" />
              <span>Giỏ hàng</span>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Tai khoan hien thi khac nhau khi a/chua ang nhap */}
            {daDangNhap ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="header-action text-decoration-none p-0 border-0"
                  style={{ boxShadow: "none" }}
                >
                  <i className="bi bi-person-circle" />
                  <span className="ms-1">{user!.ho_ten.split(" ").pop()}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-bold">{user!.ho_ten}</div>
                    <small className="text-secondary">{user!.email}</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />

                  {/* Menu theo vai tro */}
                  {user!.ten_vai_tro === "QUAN_TRI_VIEN" && (
                    <Dropdown.Item onClick={() => router.push("/admin/report")}>
                      <i className="bi bi-speedometer2 me-2" />Quản trị
                    </Dropdown.Item>
                  )}
                  {user!.ten_vai_tro === "NHAN_VIEN" && (
                    <Dropdown.Item onClick={() => router.push("/staff/order")}>
                      <i className="bi bi-clipboard-data me-2" />Quản lý
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item onClick={() => router.push("/customer/account")}>
                    <i className="bi bi-person me-2" />Tài khoản
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => router.push("/customer/account/orders")}>
                    <i className="bi bi-bag me-2" />Đơn hàng
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={dangXuat}>
                    <i className="bi bi-box-arrow-right me-2" />Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link href="/auth/login" className="header-action">
                <i className="bi bi-person" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </Container>

      <CategoryMenu show={showMenu} onClose={() => setShowMenu(false)} />
    </header>
  );
}
