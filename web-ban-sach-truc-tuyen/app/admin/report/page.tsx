"use client";

import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner, Table, Form } from "react-bootstrap";
import { thongKeAPI } from "@/lib/api";

export default function AdminReportPage() {
  const [tongQuan, setTongQuan] = useState<any>(null);
  const [topSach, setTopSach] = useState<any[]>([]);
  const [thongKeDon, setThongKeDon] = useState<any[]>([]);
  const [doanhThu, setDoanhThu] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [kieuThongKe, setKieuThongKe] = useState("NGAY");

  useEffect(() => {
    Promise.all([
      thongKeAPI.tongQuan(),
      thongKeAPI.topSachBanChay(10),
      thongKeAPI.thongKeDonHang(),
      thongKeAPI.doanhThu(undefined, undefined, kieuThongKe),
    ])
      .then(([resTQ, resTS, resTKDH, resDT]) => {
        setTongQuan(resTQ.data);
        setTopSach(resTS.data || []);
        setThongKeDon(resTKDH.data || []);
        setDoanhThu(resDT.data || []);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }, [kieuThongKe]);

  if (dangTai) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  const cards = [
    { label: "Tổng doanh thu", value: tongQuan?.tong_doanh_thu, format: "tien", icon: "bi-currency-dollar", color: "#22c55e" },
    { label: "Tổng đơn hàng", value: tongQuan?.tong_don_hang, icon: "bi-bag-check", color: "#3b82f6" },
    { label: "Đơn đã giao", value: tongQuan?.don_da_giao, icon: "bi-check-circle", color: "#10b981" },
    { label: "Đơn đã hủy", value: tongQuan?.don_da_huy, icon: "bi-x-circle", color: "#ef4444" },
    { label: "Tổng khách hàng", value: tongQuan?.tong_khach_hang, icon: "bi-people", color: "#8b5cf6" },
    { label: "Tổng đầu sách", value: tongQuan?.tong_dau_sach, icon: "bi-book", color: "#f59e0b" },
    { label: "Sách tồn kho", value: tongQuan?.tong_sach_ton, icon: "bi-box-seam", color: "#06b6d4" },
    { label: "Sách đã bán", value: tongQuan?.tong_sach_da_ban, icon: "bi-cart-check", color: "#ec4899" },
  ];

  return (
    <>
      <h4 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2" />Tổng quan
      </h4>

      {/* THONG KE CARDS */}
      <Row className="g-3 mb-4">
        {cards.map((c, i) => (
          <Col key={i} sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12, background: c.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <i className={`bi ${c.icon}`} style={{ fontSize: 22, color: c.color }} />
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: 13 }}>{c.label}</div>
                  <div className="fw-bold fs-5">
                    {c.format === "tien"
                      ? (c.value || 0).toLocaleString("vi-VN") + " đ"
                      : (c.value || 0).toLocaleString("vi-VN")}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* THONG KE ON HANG THEO TRANG THAI */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3"><i className="bi bi-pie-chart me-2" />Đơn hàng theo trạng thái</h6>
              <Table size="sm">
                <thead>
                  <tr><th>Trạng thái</th><th className="text-end">SL</th><th className="text-end">Giá trị</th></tr>
                </thead>
                <tbody>
                  {thongKeDon.map((tk: any, i: number) => (
                    <tr key={i}>
                      <td>{tk.trang_thai_don_hang}</td>
                      <td className="text-end">{tk.so_luong_don}</td>
                      <td className="text-end">{(tk.tong_gia_tri || 0).toLocaleString("vi-VN")} đ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* TOP SACH BAN CHAY */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3"><i className="bi bi-trophy me-2" />Top 10 sách bán chạy</h6>
              <Table size="sm" hover>
                <thead>
                  <tr>
                    <th>#</th><th>Tên sách</th><th>Tác giả</th>
                    <th className="text-end">Đã bán</th><th className="text-end">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topSach.map((s: any, i: number) => (
                    <tr key={s.id_sach || s.id || i}>
                      <td>{i + 1}</td>
                      <td>{s.ten_sach}</td>
                      <td>{s.tac_gia}</td>
                      <td className="text-end">{s.tong_so_luong_ban}</td>
                      <td className="text-end">{(s.tong_doanh_thu || 0).toLocaleString("vi-VN")} đ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* DOANH THU */}
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-graph-up me-2" />Doanh thu</h6>
                <Form.Select size="sm" style={{ width: 150 }} value={kieuThongKe} onChange={(e) => setKieuThongKe(e.target.value)}>
                  <option value="NGAY">Theo ngày</option>
                  <option value="THANG">Theo tháng</option>
                </Form.Select>
              </div>
              <Table size="sm" hover>
                <thead>
                  <tr>
                    <th>{kieuThongKe === "NGAY" ? "Ngày" : "Tháng"}</th>
                    <th className="text-end">Số đơn đã giao</th>
                    <th className="text-end">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {doanhThu.map((dt: any, i: number) => (
                    <tr key={i}>
                      <td>
                        {kieuThongKe === "NGAY"
                          ? dt.ngay ? new Date(dt.ngay).toLocaleDateString("vi-VN") : "—"
                          : `${dt.thang}/${dt.nam}`}
                      </td>
                      <td className="text-end">{dt.so_don_da_giao}</td>
                      <td className="text-end">{(dt.doanh_thu || 0).toLocaleString("vi-VN")} đ</td>
                    </tr>
                  ))}
                  {doanhThu.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-secondary">Chưa có dữ liệu</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
