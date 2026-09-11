"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Badge, Button, Container, Spinner, Table } from "react-bootstrap";
import { donHangAPI } from "@/lib/api";

const mauTrangThai: Record<string, string> = {
  "Chờ xác nhận": "warning",
  "Đang chuẩn bị": "info",
  "Đang giao": "primary",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idDonHang = Number(params.id);

  const [donHang, setDonHang] = useState<any>(null);
  const [chiTiet, setChiTiet] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangHuy, setDangHuy] = useState(false);
  const [thongBao, setThongBao] = useState("");

  useEffect(() => {
    donHangAPI
      .layChiTiet(idDonHang)
      .then((res) => {
        setDonHang(res.data.don_hang);
        setChiTiet(res.data.chi_tiet || []);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }, [idDonHang]);

  async function handleHuyDon() {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    setDangHuy(true);
    try {
      await donHangAPI.huyDon(idDonHang, "Khách hàng yêu cầu hủy");
      setThongBao("Đã hủy đơn hàng thành công.");
      //Reload data      const res = await donHangAPI.layChiTiet(idDonHang);
      setDonHang(res.data.don_hang);
    } catch (err: any) {
      setThongBao(err.message || "Không thể hủy đơn hàng.");
    } finally {
      setDangHuy(false);
    }
  }

  if (dangTai) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  if (!donHang) {
    return (
      <div className="text-center py-5">
        <p>Không tìm thấy đơn hàng.</p>
        <Button variant="primary" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const coTheHuy = ["Chờ xác nhận", "Đang chuẩn bị"].includes(donHang.trang_thai_don_hang);

  return (
    <div className="account-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">
          <i className="bi bi-receipt me-2" />Chi tiết đơn hàng
        </h5>
        <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
          <i className="bi bi-arrow-left me-1" />Quay lại
        </Button>
      </div>

      {thongBao && <Alert variant="info">{thongBao}</Alert>}

      <table className="table table-borderless">
        <tbody>
          <tr>
            <td className="text-secondary" style={{ width: 180 }}>Mã đơn hàng:</td>
            <td className="fw-bold text-primary">{donHang.ma_don_hang}</td>
          </tr>
          <tr>
            <td className="text-secondary">Ngày đặt:</td>
            <td>{new Date(donHang.ngay_dat).toLocaleString("vi-VN")}</td>
          </tr>
          <tr>
            <td className="text-secondary">Người nhận:</td>
            <td>{donHang.ten_nguoi_nhan}</td>
          </tr>
          <tr>
            <td className="text-secondary">Số điện thoại:</td>
            <td>{donHang.so_dien_thoai_nhan}</td>
          </tr>
          <tr>
            <td className="text-secondary">Địa chỉ:</td>
            <td>{donHang.dia_chi_giao_hang}</td>
          </tr>
          <tr>
            <td className="text-secondary">Trạng thái:</td>
            <td>
              <Badge bg={mauTrangThai[donHang.trang_thai_don_hang] || "secondary"}>
                {donHang.trang_thai_don_hang}
              </Badge>
            </td>
          </tr>
          <tr>
            <td className="text-secondary">Thanh toán:</td>
            <td>COD - {donHang.trang_thai_thanh_toan}</td>
          </tr>
          {donHang.ghi_chu && (
            <tr>
              <td className="text-secondary">Ghi chú:</td>
              <td>{donHang.ghi_chu}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h6 className="fw-bold mt-4 mb-3">Sản phẩm đã đặt</h6>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>Sách</th>
            <th className="text-center">SL</th>
            <th className="text-end">Đơn giá</th>
            <th className="text-end">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {chiTiet.map((ct: any, i: number) => (
            <tr key={i}>
              <td>{ct.ten_sach}</td>
              <td className="text-center">{ct.so_luong}</td>
              <td className="text-end">{ct.don_gia?.toLocaleString("vi-VN")} đ</td>
              <td className="text-end">{ct.thanh_tien?.toLocaleString("vi-VN")} đ</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <span className="fw-bold fs-5">Tổng cộng:</span>
        <span className="fw-bold fs-5 text-danger">
          {donHang.tong_tien?.toLocaleString("vi-VN")} đ
        </span>
      </div>

      {coTheHuy && (
        <div className="mt-4">
          <Button variant="outline-danger" onClick={handleHuyDon} disabled={dangHuy}>
            {dangHuy ? "Đang hủy..." : <><i className="bi bi-x-circle me-2" />Hủy đơn hàng</>}
          </Button>
        </div>
      )}
    </div>
  );
}
