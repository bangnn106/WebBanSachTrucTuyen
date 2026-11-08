  "use client";

import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Banner from "@/components/home/banner";
import BookSection from "@/components/books/bookSection";
import TopBanner from "@/components/layout/topBanner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { sachAPI } from "@/lib/api";
import { book } from "@/types/book";

export default function HomePage() {
  const [sachMoi, setSachMoi] = useState<book[]>([]);
  const [sachBanChay, setSachBanChay] = useState<book[]>([]);
  const [sachGiamGia, setSachGiamGia] = useState<book[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    async function taiDuLieu() {
      try {
        // Goi 3 API song song de tai nhanh hon
        const [resMoi, resChay, resTatCa] = await Promise.all([
          sachAPI.timKiem({ sap_xep: "MOI_NHAT", kich_thuoc_trang: 6 }),
          sachAPI.timKiem({ sap_xep: "BAN_CHAY", kich_thuoc_trang: 6 }),
          sachAPI.timKiem({ kich_thuoc_trang: 50 }),
        ]);

        setSachMoi(resMoi.data.items || []);
        setSachBanChay(resChay.data.items || []);

        // Loc sach dang giam gia (gia ban < gia goc)
        const tatCa = resTatCa.data.items || [];
        const giamGia = tatCa
          .filter((s: book) => s.gia_ban < s.gia_goc)
          .slice(0, 6);
        setSachGiamGia(giamGia);
      } catch {
        // Neu API loi hien thi rong
      } finally {
        setDangTai(false);
      }
    }
    taiDuLieu();
  }, []);

  if (dangTai) {
    return (
      <>
        <TopBanner />
        <Header />
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBanner />
      <Header />
      <Banner />

      {sachMoi.length > 0 && (
        <BookSection title="📚 Sách mới" books={sachMoi} />
      )}

      {sachBanChay.length > 0 && (
        <BookSection title="🔥 Sách bán chạy" books={sachBanChay} />
      )}

      {sachGiamGia.length > 0 && (
        <BookSection title="🏷️ Sách đang giảm giá" books={sachGiamGia} />
      )}

      <Footer />
    </>
  );
}