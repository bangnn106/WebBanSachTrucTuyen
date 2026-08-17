import Banner from "@/components/home/banner";
import CategoryHighlight from "@/components/home/categoryHighlight";
import BookSection from "@/components/books/bookSection";
import TopBanner from "@/components/layout/topBanner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { mockBooks } from "@/constants/testData";

export default function HomePage() {

  const bestSellers = [...mockBooks]
    .filter((book) => book.trang_thai !== "Ngừng bán")
    .sort(
      (a, b) =>
        b.so_luong_da_ban -
        a.so_luong_da_ban
    )
    .slice(0, 6);

  const saleBooks = mockBooks
    .filter(
      (book) =>
        book.gia_ban < book.gia_goc &&
        book.trang_thai !== "Ngừng bán"
    )
    .slice(0, 6);

  const newBooks = [...mockBooks]
    .filter((book) => book.trang_thai !== "Ngừng bán")
    .reverse()
    .slice(0, 6);

  return (
    <>
      <TopBanner />
      <Header />
      <Banner />
      <CategoryHighlight />

      <BookSection
        title="📚 Sách mới"
        books={newBooks}
      />

      <BookSection
        title="🔥 Sách bán chạy"
        books={bestSellers}
      />

      <BookSection
        title="🏷️ Sách đang giảm giá"
        books={saleBooks}
      />
      <Footer />
    </>
  );
}