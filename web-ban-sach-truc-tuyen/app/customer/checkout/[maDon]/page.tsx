"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Button, Container, Spinner, Table } from "react-bootstrap";
import { donHangAPI } from "@/lib/api";

export default function OrderConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const idDonHang = Number(params.maDon);

  const [donHang, setDonHang] = useState<any>(null);
  const [chiTiet, setChiTiet] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    if (!idDonHang) return;
    donHangAPI
      .layChiTiet(idDonHang)
      .then((res) => {
        setDonHang(res.data.don_hang);
        setChiTiet(res.data.chi_tiet || []);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }, [idDonHang]);

  if (dangTai) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!donHang) {
    return (
      <Container fluid="xl" className="py-5 text-center">
        <i className="bi bi-exclamation-circle fs-1 text-secondary" />
        <h4 className="mt-3">Không tìm thấy đơn hàng</h4>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
          Về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-5">
      <div className="text-center mb-4">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 64 }} />
        <h2 className="mt-3 fw-bold">Đặt hàng thành công!</h2>
        <p className="text-secondary">
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
        </p>
      </div>

      <div className="bg-white border rounded p-4 mx-auto" style={{ maxWidth: 600 }}>
        <h5 className="fw-bold mb-3">
          <i className="bi bi-receipt me-2" />Thông tin đơn hàng
        </h5>

        <table className="table table-borderless mb-3">
          <tbody>
            <tr>
              <td className="text-secondary">Mã đơn hàng:</td>
              <td className="fw-bold text-primary">{donHang.ma_don_hang}</td>
            </tr>
            <tr>
              <td className="text-secondary">Người nhận:</td>
              <td>{donHang.ten_nguoi_nhan}</td>
            </tr>
            <tr>
              <td className="text-secondary">SĐT:</td>
              <td>{donHang.so_dien_thoai_nhan}</td>
            </tr>
            <tr>
              <td className="text-secondary">Địa chỉ:</td>
              <td>{donHang.dia_chi_giao_hang}</td>
            </tr>
            <tr>
              <td className="text-secondary">Trạng thái:</td>
              <td>
                <Badge bg="warning" text="dark">{donHang.trang_thai_don_hang}</Badge>
              </td>
            </tr>
            <tr>
              <td className="text-secondary">Thanh toán:</td>
              <td>COD - {donHang.trang_thai_thanh_toan}</td>
            </tr>
          </tbody>
        </table>

        {chiTiet.length > 0 && (
          <Table size="sm" bordered>
            <thead>
              <tr>
                <th>Sách</th>
                <th className="text-center">SL</th>
                <th className="text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {chiTiet.map((ct: any, i: number) => (
                <tr key={i}>
                  <td>{ct.ten_sach}</td>
                  <td className="text-center">{ct.so_luong}</td>
                  <td className="text-end">{ct.thanh_tien?.toLocaleString("vi-VN")} đ</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <span className="fw-bold fs-5">Tổng cộng:</span>
          <span className="fw-bold fs-5 text-danger">
            {donHang.tong_tien?.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      <div className="text-center mt-4 d-flex justify-content-center gap-3">
        <Button variant="outline-primary" onClick={() => router.push("/customer/account/orders")}>
          <i className="bi bi-bag me-2" />Đơn hàng của tôi
        </Button>
        <Button variant="primary" onClick={() => router.push("/")}>
          <i className="bi bi-house me-2" />Tiếp tục mua sắm
        </Button>
      </div>
    </Container>
  );
}
