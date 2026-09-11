"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { donHangAPI } from "@/lib/api";

const mauTrangThai: Record<string, string> = {
  "Chờ xác nhận": "warning",
  "Đang chuẩn bị": "info",
  "Đang giao": "primary",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

const luongTrangThai = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao"];

export default function AdminOrderPage() {
  const [donHangs, setDonHangs] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [locTrangThai, setLocTrangThai] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [thongBao, setThongBao] = useState("");

  //Modal chi tiet  const [showModal, setShowModal] = useState(false);
  const [chiTietDon, setChiTietDon] = useState<any>(null);
  const [chiTietSanPham, setChiTietSanPham] = useState<any[]>([]);

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

  useEffect(() => { taiDanhSach(); }, [trang, locTrangThai]);

  async function xemChiTiet(id: number) {
    try {
      const res = await donHangAPI.layChiTiet(id);
      setChiTietDon(res.data.don_hang);
      setChiTietSanPham(res.data.chi_tiet || []);
      setShowModal(true);
    } catch {}
  }

  async function doiTrangThai(id: number, trangThaiMoi: string) {
    try {
      await donHangAPI.capNhatTrangThai(id, trangThaiMoi);
      setThongBao(`Đã chuyển sang "${trangThaiMoi}"`);
      setTimeout(() => setThongBao(""), 3000);
      taiDanhSach();
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật trạng thái");
    }
  }

  async function huyDonHang(id: number) {
    const lyDo = prompt("Nhập lý do hủy:");
    if (!lyDo) return;
    try {
      await donHangAPI.huyDon(id, lyDo);
      setThongBao("Đã hủy đơn hàng.");
      setTimeout(() => setThongBao(""), 3000);
      taiDanhSach();
    } catch (err: any) {
      alert(err.message || "Không thể hủy đơn");
    }
  }

  return (
    <>
      <h4 className="fw-bold mb-4"><i className="bi bi-bag me-2" />Quản lý đơn hàng</h4>

      {thongBao && <Alert variant="success">{thongBao}</Alert>}

      {/* BO LOC */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <Form.Control
          placeholder="Tìm mã đơn, tên khách..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setTrang(1), taiDanhSach())}
          style={{ maxWidth: 250 }}
        />
        <Form.Select value={locTrangThai} onChange={(e) => { setLocTrangThai(e.target.value); setTrang(1); }} style={{ maxWidth: 200 }}>
          <option value="">Tất cả trạng thái</option>
          {luongTrangThai.map((tt) => <option key={tt} value={tt}>{tt}</option>)}
          <option value="Đã hủy">Đã hủy</option>
        </Form.Select>
        <Button variant="outline-primary" onClick={() => { setTrang(1); taiDanhSach(); }}>
          <i className="bi bi-search me-1" />Tìm
        </Button>
      </div>

      {dangTai ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th>
                <th className="text-end">Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {donHangs.map((dh: any) => {
                const viTriHienTai = luongTrangThai.indexOf(dh.trang_thai_don_hang);
                const trangThaiTiepTheo = viTriHienTai >= 0 && viTriHienTai < luongTrangThai.length - 1
                  ? luongTrangThai[viTriHienTai + 1] : null;

                return (
                  <tr key={dh.id}>
                    <td className="fw-bold">{dh.ma_don_hang}</td>
                    <td>{dh.ten_khach_hang || dh.ten_nguoi_nhan || "—"}</td>
                    <td>{new Date(dh.ngay_dat).toLocaleDateString("vi-VN")}</td>
                    <td className="text-end">{dh.tong_tien?.toLocaleString("vi-VN")} đ</td>
                    <td>
                      <Badge bg={mauTrangThai[dh.trang_thai_don_hang] || "secondary"}>
                        {dh.trang_thai_don_hang}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Button variant="outline-primary" size="sm" onClick={() => xemChiTiet(dh.id)}>
                          <i className="bi bi-eye" />
                        </Button>
                        {trangThaiTiepTheo && (
                          <Button variant="outline-success" size="sm" onClick={() => doiTrangThai(dh.id, trangThaiTiepTheo)}>
                            → {trangThaiTiepTheo}
                          </Button>
                        )}
                        {["Chờ xác nhận", "Đang chuẩn bị"].includes(dh.trang_thai_don_hang) && (
                          <Button variant="outline-danger" size="sm" onClick={() => huyDonHang(dh.id)}>
                            Hủy
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {donHangs.length === 0 && (
                <tr><td colSpan={6} className="text-center text-secondary py-4">Không có đơn hàng</td></tr>
              )}
            </tbody>
          </Table>

          {tongTrang > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button variant="outline-primary" size="sm" disabled={trang <= 1} onClick={() => setTrang(trang - 1)}>Trước</Button>
              <span className="d-flex align-items-center px-3">Trang {trang}/{tongTrang}</span>
              <Button variant="outline-primary" size="sm" disabled={trang >= tongTrang} onClick={() => setTrang(trang + 1)}>Sau</Button>
            </div>
          )}
        </>
      )}

      {/* MODAL CHI TIET */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng {chiTietDon?.ma_don_hang}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chiTietDon && (
            <>
              <p><strong>Người nhận:</strong> {chiTietDon.ten_nguoi_nhan} — {chiTietDon.so_dien_thoai_nhan}</p>
              <p><strong>Địa chỉ:</strong> {chiTietDon.dia_chi_giao_hang}</p>
              <p><strong>Trạng thái:</strong> <Badge bg={mauTrangThai[chiTietDon.trang_thai_don_hang]}>{chiTietDon.trang_thai_don_hang}</Badge></p>
              {chiTietDon.ghi_chu && <p><strong>Ghi chú:</strong> {chiTietDon.ghi_chu}</p>}

              <Table size="sm" bordered className="mt-3">
                <thead><tr><th>Sách</th><th className="text-center">SL</th><th className="text-end">Đơn giá</th><th className="text-end">Thành tiền</th></tr></thead>
                <tbody>
                  {chiTietSanPham.map((ct: any, i: number) => (
                    <tr key={i}>
                      <td>{ct.ten_sach}</td>
                      <td className="text-center">{ct.so_luong}</td>
                      <td className="text-end">{ct.don_gia?.toLocaleString("vi-VN")} đ</td>
                      <td className="text-end">{ct.thanh_tien?.toLocaleString("vi-VN")} đ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-end fw-bold fs-5 text-danger">
                Tổng: {chiTietDon.tong_tien?.toLocaleString("vi-VN")} đ
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
