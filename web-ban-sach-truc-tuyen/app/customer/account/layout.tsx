"use client";

import { Container } from "react-bootstrap";
import CustomerSidebar from "@/components/layout/customerSidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container fluid="xl">
      <div className="account-layout">
        <CustomerSidebar />
        <div className="account-content">{children}</div>
      </div>
    </Container>
  );
}
