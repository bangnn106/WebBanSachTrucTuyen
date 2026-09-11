"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//Trang staff mac dinh -> chuyen den quan ly don hangexport default function StaffPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/staff/order");
  }, [router]);
  return null;
}
