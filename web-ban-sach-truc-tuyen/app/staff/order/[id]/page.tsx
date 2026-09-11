"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Badge, Button, Image, Spinner, Table } from "react-bootstrap";
import { donHangAPI, layUrlAnh } from "@/lib/api";

const mauTrangThai: Record<string, string> = {
  "Chờ xác nhận": "warning",
  "Đang chuẩn bị": "info",
  "Đang giao": "primary",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

const luongTrangThai = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao"];

export default function StaffOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idDonHang = Number(params.id);

  const [donHang, setDonHang] = useState<any>(null);
  const [chiTiet, setChiTiet] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [thongBao, setThongBao] = useState("");
  const [loiThongBao, setLoiThongBao] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  function taiChiTiet() {
    setDangTai(true);
    donHangAPI
      .layChiTiet(idDonHang)
      .then((res) => {
        setDonHang(res.data.don_hang);
        setChiTiet(res.data.chi_tiet || []);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => {
    if (idDonHang) taiChiTiet();
  }, [idDonHang]);

  async function doiTrangThai(trangThaiMoi: string) {
    setDangXuLy(true);
    try {
      await donHangAPI.capNhatTrangThai(idDonHang, trangThaiMoi);
      setThongBao(`Đã chuyển sang "${trangThaiMoi}"`);
      setLoiThongBao("");
      taiChiTiet();
    } catch (err: any) {
      setLoiThongBao(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setDangXuLy(false);
    }
  }

  async function huyDonHang() {
    const lyDo = prompt("Nhập lý do hủy:");
    if (!lyDo) return;
    setDangXuLy(true);
    try {
      await donHangAPI.huyDon(idDonHang, lyDo);
      setThongBao("Đã hủy đơn hàng thành công.");
      setLoiThongBao("");
      taiChiTiet();
    } catch (err: any) {
      setLoiThongBao(err.message || "Không thể hủy đơn");
    } finally {
      setDangXuLy(false);
    }
  }

  if (dangTai) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!donHang) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-circle" style={{ fontSize: 48, color: "#ccc" }} />
        <p className="mt-3 text-secondary">Không tìm thấy đơn hàng.</p>
        <Button variant="primary" onClick={() => router.push("/staff/order")}>
          <i className="bi bi-arrow-left me-2" />Quay lại
        </Button>
      </div>
    );
  }

  const viTriHienTai = luongTrangThai.indexOf(donHang.trang_thai_don_hang);
  const trangThaiTiepTheo =
    viTriHienTai >= 0 && viTriHienTai < luongTrangThai.length - 1
      ? luongTrangThai[viTriHienTai + 1]
      : null;
  const coTheHuy = ["Chờ xác nhận", "Đang chuẩn bị"].includes(donHang.trang_thai_don_hang);

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          <i className="bi bi-receipt me-2" />Chi tiết đơn hàng
        </h4>
        <Button variant="outline-secondary" onClick={() => router.push("/staff/order")}>
          <i className="bi bi-arrow-left me-1" />Quay lại
        </Button>
      </div>

      {thongBao && (
        <Alert variant="success" onClose={() => setThongBao("")} dismissible>
          {thongBao}
        </Alert>
      )}
      {loiThongBao && (
        <Alert variant="danger" onClose={() => setLoiThongBao("")} dismissible>
          {loiThongBao}
        </Alert>
      )}

      <div className="bg-white rounded shadow-sm p-4 mb-4">
        {/* THONG TIN ON HANG */}
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h5 className="fw-bold text-primary mb-1">{donHang.ma_don_hang}</h5>
            <small className="text-secondary">
              Ngày đặt: {new Date(donHang.ngay_dat).toLocaleString("vi-VN")}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Badge
              bg={mauTrangThai[donHang.trang_thai_don_hang] || "secondary"}
              className="fs-6 px-3 py-2"
            >
              {donHang.trang_thai_don_hang}
            </Badge>
            <Badge
              bg={
                donHang.trang_thai_thanh_toan === "Đã thanh toán"
                  ? "success"
                  : donHang.trang_thai_thanh_toan === "Đã hoàn tiền"
                  ? "secondary"
                  : "warning"
              }
              className="fs-6 px-3 py-2"
            >
              {donHang.trang_thai_thanh_toan}
            </Badge>
          </div>
        </div>

        {/* TIMELINE TRANG THAI */}
        <div className="d-flex align-items-center gap-0 mb-4 flex-wrap">
          {luongTrangThai.map((tt, index) => {
            const viTri = luongTrangThai.indexOf(donHang.trang_thai_don_hang);
            const daQua = index <= viTri;
            const dangO = index === viTri;
            const biHuy = donHang.trang_thai_don_hang === "Đã hủy";

            return (
              <div key={tt} className="d-flex align-items-center">
                <div className="text-center" style={{ minWidth: 100 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: biHuy
                        ? "#e5e7eb"
                        : daQua
                        ? "#22c55e"
                        : "#e5e7eb",
                      color: daQua && !biHuy ? "#fff" : "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontWeight: "bold",
                      fontSize: 14,
                      border: dangO && !biHuy ? "3px solid #16a34a" : "none",
                    }}
                  >
                    {daQua && !biHuy ? (
                      <i className="bi bi-check" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <small
                    className="d-block mt-1"
                    style={{
                      fontSize: 11,
                      color: dangO && !biHuy ? "#16a34a" : "#6b7280",
                      fontWeight: dangO ? "bold" : "normal",
                    }}
                  >
                    {tt}
                  </small>
                </div>
                {index < luongTrangThai.length - 1 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: index < viTri && !biHuy ? "#22c55e" : "#e5e7eb",
                    }}
                  />
                )}
              </div>
            );
          })}
          {donHang.trang_thai_don_hang === "Đã hủy" && (
            <div className="ms-3">
              <Badge bg="danger" className="fs-6 px-3 py-2">
                <i className="bi bi-x-circle me-1" />Đã hủy
              </Badge>
            </div>
          )}
        </div>

        <hr />

        {/* THONG TIN GIAO HANG */}
        <h6 className="fw-bold mb-3">
          <i className="bi bi-geo-alt me-2" />Thông tin giao hàng
        </h6>
        <table className="table table-borderless mb-0">
          <tbody>
            <tr>
              <td className="text-secondary" style={{ width: 180 }}>Khách hàng:</td>
              <td>{donHang.ten_khach_hang || "—"}</td>
            </tr>
            <tr>
              <td className="text-secondary">Email:</td>
              <td>{donHang.email || "—"}</td>
            </tr>
            <tr>
              <td className="text-secondary">Người nhận:</td>
              <td className="fw-bold">{donHang.ten_nguoi_nhan}</td>
            </tr>
            <tr>
              <td className="text-secondary">Số điện thoại:</td>
              <td>{donHang.so_dien_thoai_nhan}</td>
            </tr>
            <tr>
              <td className="text-secondary">Địa chỉ giao:</td>
              <td>{donHang.dia_chi_giao_hang}</td>
            </tr>
            <tr>
              <td className="text-secondary">Phương thức TT:</td>
              <td>COD — Thanh toán khi nhận hàng</td>
            </tr>
            {donHang.ghi_chu && (
              <tr>
                <td className="text-secondary">Ghi chú:</td>
                <td className="fst-italic">{donHang.ghi_chu}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BANG SAN PHAM */}
      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <h6 className="fw-bold mb-3">
          <i className="bi bi-box me-2" />Sản phẩm ({chiTiet.length})
        </h6>
        <Table bordered hover>
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Sách</th>
              <th className="text-center" style={{ width: 80 }}>SL</th>
              <th className="text-end" style={{ width: 130 }}>Đơn giá</th>
              <th className="text-end" style={{ width: 140 }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {chiTiet.map((ct: any, i: number) => (
              <tr key={i}>
                <td className="text-center">{i + 1}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {ct.anh_bia && (
                      <Image
                        src={layUrlAnh(ct.anh_bia)}
                        alt={ct.ten_sach}
                        width={36}
                        height={48}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <span>{ct.ten_sach}</span>
                  </div>
                </td>
                <td className="text-center">{ct.so_luong}</td>
                <td className="text-end">{ct.don_gia?.toLocaleString("vi-VN")} đ</td>
                <td className="text-end fw-bold">{ct.thanh_tien?.toLocaleString("vi-VN")} đ</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold fs-5">
                Tổng cộng:
              </td>
              <td className="text-end fw-bold fs-5 text-danger">
                {donHang.tong_tien?.toLocaleString("vi-VN")} đ
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>

      {/* NUT HANH ONG */}
      {(trangThaiTiepTheo || coTheHuy) && (
        <div className="bg-white rounded shadow-sm p-4 d-flex gap-3 flex-wrap">
          {trangThaiTiepTheo && (
            <Button
              variant="success"
              onClick={() => doiTrangThai(trangThaiTiepTheo)}
              disabled={dangXuLy}
            >
              {dangXuLy ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                <i className="bi bi-arrow-right-circle me-2" />
              )}
              Chuyển sang &quot;{trangThaiTiepTheo}&quot;
            </Button>
          )}
          {coTheHuy && (
            <Button variant="outline-danger" onClick={huyDonHang} disabled={dangXuLy}>
              <i className="bi bi-x-circle me-2" />Hủy đơn hàng
            </Button>
          )}
        </div>
      )}
    </>
  );
}
