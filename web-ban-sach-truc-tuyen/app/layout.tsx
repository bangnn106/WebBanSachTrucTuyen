import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthProvider";
import { CartProvider } from "@/contexts/CartProvider";

export const metadata: Metadata = {
  title: "Nhà Sách Trực Tuyến",
  description: "Mua sách online giá tốt, giao hàng tận nơi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {/* AuthProvider boc ngoai e CartProvider co the dung useAuth */}
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
