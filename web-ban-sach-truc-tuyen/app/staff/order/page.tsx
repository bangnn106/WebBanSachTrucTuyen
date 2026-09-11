"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Button, Form, Spinner, Table } from "react-bootstrap";
import { donHangAPI } from "@/lib/api";

const mauTrangThai: Record<string, string> = {
  "Chờ xác nhận": "warning",
  "Đang chuẩn bị": "info",
  "Đang giao": "primary",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

const luongTrangThai = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao"];

export default function StaffOrderPage() {
  const router = useRouter();
  const [donHangs, setDonHangs] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [locTrangThai, setLocTrangThai] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [thongBao, setThongBao] = useState("");
  const [loiThongBao, setLoiThongBao] = useState("");

  function taiDanhSach() {
    setDangTai(true);
    donHangAPI
      .layDanhSach({
        trang,
        kich_thuoc_trang: 15,
        trang_thai: locTrangThai || undefined,
        tu_khoa: tuKhoa || undefined,
      })
      .then((res) => {
        setDonHangs(res.data.items || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => {
    taiDanhSach();
  }, [trang, locTrangThai]);

  async function doiTrangThai(id: number, trangThaiMoi: string) {
    try {
      await donHangAPI.capNhatTrangThai(id, trangThaiMoi);
      setThongBao(`Đã chuyển sang "${trangThaiMoi}"`);
      setLoiThongBao("");
      setTimeout(() => setThongBao(""), 3000);
      taiDanhSach();
    } catch (err: any) {
      setLoiThongBao(err.message || "Không thể cập nhật trạng thái");
      setTimeout(() => setLoiThongBao(""), 4000);
    }
  }

  async function huyDonHang(id: number) {
    const lyDo = prompt("Nhập lý do hủy:");
    if (!lyDo) return;
    try {
      await donHangAPI.huyDon(id, lyDo);
      setThongBao("Đã hủy đơn hàng.");
      setLoiThongBao("");
      setTimeout(() => setThongBao(""), 3000);
      taiDanhSach();
    } catch (err: any) {
      setLoiThongBao(err.message || "Không thể hủy đơn");
      setTimeout(() => setLoiThongBao(""), 4000);
    }
  }

  return (
    <>
      <h4 className="fw-bold mb-4">
        <i className="bi bi-bag me-2" />Quản lý đơn hàng
      </h4>

      {thongBao && <Alert variant="success">{thongBao}</Alert>}
      {loiThongBao && <Alert variant="danger">{loiThongBao}</Alert>}

      {/* BO LOC */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <Form.Control
          placeholder="Tìm mã đơn, tên khách..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setTrang(1), taiDanhSach())}
          style={{ maxWidth: 250 }}
        />
        <Form.Select
          value={locTrangThai}
          onChange={(e) => {
            setLocTrangThai(e.target.value);
            setTrang(1);
          }}
          style={{ maxWidth: 200 }}
        >
          <option value="">Tất cả trạng thái</option>
          {luongTrangThai.map((tt) => (
            <option key={tt} value={tt}>{tt}</option>
          ))}
          <option value="Đã hủy">Đã hủy</option>
        </Form.Select>
        <Button
          variant="outline-primary"
          onClick={() => {
            setTrang(1);
            taiDanhSach();
          }}
        >
          <i className="bi bi-search me-1" />Tìm
        </Button>
      </div>

      {dangTai ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th className="text-end">Tổng tiền</th>
                <th>Trạng thái đơn</th>
                <th>Thanh toán</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {donHangs.map((dh: any) => {
                const viTriHienTai = luongTrangThai.indexOf(dh.trang_thai_don_hang);
                const trangThaiTiepTheo =
                  viTriHienTai >= 0 && viTriHienTai < luongTrangThai.length - 1
                    ? luongTrangThai[viTriHienTai + 1]
                    : null;

                return (
                  <tr key={dh.id}>
                    <td className="fw-bold">{dh.ma_don_hang}</td>
                    <td>{dh.ten_khach_hang || dh.ten_nguoi_nhan || "—"}</td>
                    <td>{new Date(dh.ngay_dat).toLocaleDateString("vi-VN")}</td>
                    <td className="text-end">
                      {dh.tong_tien?.toLocaleString("vi-VN")} đ
                    </td>
                    <td>
                      <Badge bg={mauTrangThai[dh.trang_thai_don_hang] || "secondary"}>
                        {dh.trang_thai_don_hang}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={
                          dh.trang_thai_thanh_toan === "Đã thanh toán"
                            ? "success"
                            : dh.trang_thai_thanh_toan === "Đã hoàn tiền"
                            ? "secondary"
                            : "outline-warning"
                        }
                        text={dh.trang_thai_thanh_toan === "Chưa thanh toán" ? "dark" : undefined}
                        className={dh.trang_thai_thanh_toan === "Chưa thanh toán" ? "border border-warning" : ""}
                      >
                        {dh.trang_thai_thanh_toan}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => router.push(`/staff/order/${dh.id}`)}
                        >
                          <i className="bi bi-eye" />
                        </Button>
                        {trangThaiTiepTheo && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => doiTrangThai(dh.id, trangThaiTiepTheo)}
                          >
                            → {trangThaiTiepTheo}
                          </Button>
                        )}
                        {["Chờ xác nhận", "Đang chuẩn bị"].includes(
                          dh.trang_thai_don_hang
                        ) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => huyDonHang(dh.id)}
                          >
                            Hủy
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {donHangs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-secondary py-4">
                    Không có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {tongTrang > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                disabled={trang <= 1}
                onClick={() => setTrang(trang - 1)}
              >
                Trước
              </Button>
              <span className="d-flex align-items-center px-3">
                Trang {trang}/{tongTrang}
              </span>
              <Button
                variant="outline-primary"
                size="sm"
                disabled={trang >= tongTrang}
                onClick={() => setTrang(trang + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
