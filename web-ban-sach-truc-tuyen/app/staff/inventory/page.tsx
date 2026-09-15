"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { khoHangAPI, sachAPI } from "@/lib/api";

export default function StaffInventoryPage() {
  const [lichSu, setLichSu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [thongBao, setThongBao] = useState("");
  const [loi, setLoi] = useState("");

  // Form nhap kho
  const [formNhap, setFormNhap] = useState({ id_sach: "", so_luong: "", don_gia_nhap: "", ly_do: "" });
  // Form dieu chinh
  const [formDieuChinh, setFormDieuChinh] = useState({ id_sach: "", so_luong_thay_doi: "", ly_do: "" });
  const [dangLuu, setDangLuu] = useState(false);

  // Danh sach sach de chon
  const [sachList, setSachList] = useState<any[]>([]);

  useEffect(() => {
    sachAPI.timKiem({ kich_thuoc_trang: 200 })
      .then((res) => setSachList(res.data.items || []))
      .catch(() => {});
  }, []);

  function taiLichSu() {
    setDangTai(true);
    khoHangAPI.layLichSu({ trang, kich_thuoc_trang: 20 })
      .then((res) => {
        setLichSu(res.data.items || res.data || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => { taiLichSu(); }, [trang]);

  async function handleNhapKho() {
    if (!formNhap.id_sach || !formNhap.so_luong) return;
    setDangLuu(true); setLoi("");
    try {
      await khoHangAPI.nhapKho(
        parseInt(formNhap.id_sach),
        parseInt(formNhap.so_luong),
        formNhap.ly_do || undefined,
        formNhap.don_gia_nhap ? parseFloat(formNhap.don_gia_nhap) : 0
      );
      setThongBao("Nhập kho thành công!");
      setFormNhap({ id_sach: "", so_luong: "", don_gia_nhap: "", ly_do: "" });
      taiLichSu();
    } catch (err: any) {
      setLoi(err.message || "Nhập kho thất bại");
    } finally {
      setDangLuu(false);
    }
  }

  async function handleDieuChinh() {
    if (!formDieuChinh.id_sach || !formDieuChinh.so_luong_thay_doi || !formDieuChinh.ly_do) return;
    setDangLuu(true); setLoi("");
    try {
      await khoHangAPI.dieuChinhKho(
        parseInt(formDieuChinh.id_sach),
        parseInt(formDieuChinh.so_luong_thay_doi),
        formDieuChinh.ly_do
      );
      setThongBao("Điều chỉnh kho thành công!");
      setFormDieuChinh({ id_sach: "", so_luong_thay_doi: "", ly_do: "" });
      taiLichSu();
    } catch (err: any) {
      setLoi(err.message || "Điều chỉnh thất bại");
    } finally {
      setDangLuu(false);
    }
  }

  const mauGiaoDich: Record<string, string> = {
    "Nhập kho": "success",
    "Xuất bán": "primary",
    "Hoàn do hủy đơn": "warning",
    "Điều chỉnh tăng": "info",
    "Điều chỉnh giảm": "danger",
  };

  return (
    <>
      <h4 className="fw-bold mb-4"><i className="bi bi-box-seam me-2" />Quản lý kho hàng</h4>

      {thongBao && <Alert variant="success" onClose={() => setThongBao("")} dismissible>{thongBao}</Alert>}
      {loi && <Alert variant="danger" onClose={() => setLoi("")} dismissible>{loi}</Alert>}

      <Row className="g-4 mb-4">
        {/* NHAP KHO */}
        <Col md={6}>
          <div className="bg-white p-3 rounded shadow-sm">
            <h6 className="fw-bold mb-3"><i className="bi bi-plus-circle me-2" />Nhập kho</h6>
            <Form.Select className="mb-2" value={formNhap.id_sach} onChange={(e) => setFormNhap(p => ({...p, id_sach: e.target.value}))}>
              <option value="">Chọn sách</option>
              {sachList.map((s: any) => <option key={s.id_sach || s.id} value={s.id_sach || s.id}>{s.ten_sach} (Tồn: {s.so_luong_ton})</option>)}
            </Form.Select>
            <Form.Control type="number" className="mb-2" placeholder="Số lượng nhập" min={1}
              value={formNhap.so_luong} onChange={(e) => setFormNhap(p => ({...p, so_luong: e.target.value}))} />
            <Form.Control type="number" className="mb-2" placeholder="Đơn giá nhập (VNĐ)" min={0} step={1000}
              value={formNhap.don_gia_nhap} onChange={(e) => setFormNhap(p => ({...p, don_gia_nhap: e.target.value}))} />
            <Form.Control className="mb-2" placeholder="Lý do (tuỳ chọn)"
              value={formNhap.ly_do} onChange={(e) => setFormNhap(p => ({...p, ly_do: e.target.value}))} />
            <Button variant="success" onClick={handleNhapKho} disabled={dangLuu}>
              <i className="bi bi-check me-1" />Nhập kho
            </Button>
          </div>
        </Col>

        {/* IEU CHINH KHO */}
        <Col md={6}>
          <div className="bg-white p-3 rounded shadow-sm">
            <h6 className="fw-bold mb-3"><i className="bi bi-arrow-left-right me-2" />Điều chỉnh kho</h6>
            <Form.Select className="mb-2" value={formDieuChinh.id_sach} onChange={(e) => setFormDieuChinh(p => ({...p, id_sach: e.target.value}))}>
              <option value="">Chọn sách</option>
              {sachList.map((s: any) => <option key={s.id_sach || s.id} value={s.id_sach || s.id}>{s.ten_sach} (Tồn: {s.so_luong_ton})</option>)}
            </Form.Select>
            <Form.Control type="number" className="mb-2" placeholder="SL thay đổi (dương: tăng, âm: giảm)"
              value={formDieuChinh.so_luong_thay_doi} onChange={(e) => setFormDieuChinh(p => ({...p, so_luong_thay_doi: e.target.value}))} />
            <Form.Control className="mb-2" placeholder="Lý do (bắt buộc)" required
              value={formDieuChinh.ly_do} onChange={(e) => setFormDieuChinh(p => ({...p, ly_do: e.target.value}))} />
            <Button variant="primary" onClick={handleDieuChinh} disabled={dangLuu}>
              <i className="bi bi-check me-1" />Điều chỉnh
            </Button>
          </div>
        </Col>
      </Row>

      {/* LICH SU KHO */}
      <h5 className="fw-bold mb-3"><i className="bi bi-clock-history me-2" />Lịch sử kho</h5>
      {dangTai ? (
        <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>Ngày</th><th>Sách</th><th>Loại GD</th>
                <th className="text-center">SL</th><th className="text-center">Trước</th>
                <th className="text-center">Sau</th><th>Người thực hiện</th><th>Lý do</th>
              </tr>
            </thead>
            <tbody>
              {lichSu.map((ls: any, i: number) => (
                <tr key={i}>
                  <td>{new Date(ls.ngay_thuc_hien).toLocaleString("vi-VN")}</td>
                  <td>{ls.ten_sach}</td>
                  <td><Badge bg={mauGiaoDich[ls.loai_giao_dich] || "secondary"}>{ls.loai_giao_dich}</Badge></td>
                  <td className="text-center">{ls.so_luong}</td>
                  <td className="text-center">{ls.ton_truoc}</td>
                  <td className="text-center">{ls.ton_sau}</td>
                  <td>{ls.ten_nguoi_thuc_hien || "—"}</td>
                  <td>{ls.ly_do || "—"}</td>
                </tr>
              ))}
              {lichSu.length === 0 && (
                <tr><td colSpan={8} className="text-center text-secondary py-4">Chưa có lịch sử</td></tr>
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
    </>
  );
}
