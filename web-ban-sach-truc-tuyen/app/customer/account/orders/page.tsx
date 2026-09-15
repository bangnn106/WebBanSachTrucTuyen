"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Spinner, Table } from "react-bootstrap";
import { donHangAPI } from "@/lib/api";

// Mau cho tung trang thai don hang
const mauTrangThai: Record<string, string> = {
  "Chờ xác nhận": "warning",
  "Đang chuẩn bị": "info",
  "Đang giao": "primary",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

export default function OrdersPage() {
  const router = useRouter();
  const [donHangs, setDonHangs] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);

  useEffect(() => {
    setDangTai(true);
    donHangAPI
      .layDanhSach({ trang, kich_thuoc_trang: 10 })
      .then((res) => {
        setDonHangs(res.data.items || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }, [trang]);

  return (
    <div className="account-card">
      <h5 className="fw-bold mb-4">
        <i className="bi bi-bag me-2" />Đơn hàng của tôi
      </h5>

      {dangTai ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : donHangs.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-bag-x" style={{ fontSize: 48, color: "#ccc" }} />
          <p className="mt-3 text-secondary">Bạn chưa có đơn hàng nào.</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Mua sắm ngay
          </Button>
        </div>
      ) : (
        <>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {donHangs.map((dh: any) => (
                <tr key={dh.ma_don_hang}>
                  <td className="fw-bold">{dh.ma_don_hang}</td>
                  <td>{new Date(dh.ngay_dat).toLocaleDateString("vi-VN")}</td>
                  <td>{dh.tong_tien?.toLocaleString("vi-VN")} đ</td>
                  <td>
                    <Badge bg={mauTrangThai[dh.trang_thai_don_hang] || "secondary"}>
                      {dh.trang_thai_don_hang}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => router.push(`/customer/account/orders/${dh.ma_don_hang}`)}
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {tongTrang > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button variant="outline-primary" size="sm" disabled={trang <= 1} onClick={() => setTrang(trang - 1)}>
                Trước
              </Button>
              <span className="d-flex align-items-center px-3">Trang {trang}/{tongTrang}</span>
              <Button variant="outline-primary" size="sm" disabled={trang >= tongTrang} onClick={() => setTrang(trang + 1)}>
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
