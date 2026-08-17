import TopBanner from "@/components/layout/topBanner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBanner />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
