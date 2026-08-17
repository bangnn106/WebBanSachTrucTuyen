  "use client";

import Image from "next/image";
import Link from "next/link";
import { Button,Container,Form } from "react-bootstrap";
import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";
import CategoryMenu from "./categoryMenu";

export default function Header(){
    const [showMenu, setShowMenu] = useState(false);
    const [keyword, setKeyword] = useState("");
    const router = useRouter();

    function handleSearch(e:FormEvent){
        e.preventDefault(); /* chong reload khi submit form*/

        const q=keyword.trim();
        if(!q) return;  /*neu o tim kiem trong thi bo qua*/
        router.push(
            `/store/search?q=${encodeURIComponent(q)}`
        );
    }

    return(
         <header className="site-header">
      <Container fluid="xl">
        <div className="main-header gap-4">

          {/* LOGO: khi click se tro ve trang chu */} 
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/logo.jpg"
              alt="BookStore"
              width={230}
              height={70}
              className="logo-image"
            />
          </Link>

          {/* CATEGORY: khi an se dao nguoc gia tri showmenu */}
          <button
            className="category-button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Danh mục sản phẩm"
          >
            <i className="bi bi-grid" />

            <i
              className={`bi ${
                showMenu
                  ? "bi-chevron-up"
                  : "bi-chevron-down"
              } fs-6 ms-2`}
            />
          </button>

          {/* SEARCH */}
          <Form
            className="search-wrapper flex-grow-1"
            onSubmit={handleSearch}
          >
            <Form.Control
              type="text"
              placeholder="Tìm kiếm"
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
            />

            <Button
              type="submit"
              className="search-button"
            >
              <i className="bi bi-search fs-4" />
            </Button>
          </Form>

          {/* ACTIONS */}
          <div className="d-none d-lg-flex align-items-center gap-2">

            {/* Gio hang */}
            <Link href="/customer/cart" className="header-action">
                <i className="bi bi-cart3" />
                <span>Giỏ hàng</span>
            </Link>

            {/* Tai khoan */}
            <Link href="/login" className="header-action">
                <i className="bi bi-person" />
                <span>Tài khoản</span>
            </Link>

            </div>
        </div>
      </Container>

      <CategoryMenu show={showMenu} />
    </header>
    );

}
