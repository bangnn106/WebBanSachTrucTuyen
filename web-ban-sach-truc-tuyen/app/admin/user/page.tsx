"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Form, Spinner, Table } from "react-bootstrap";
import { nguoiDungAPI } from "@/lib/api";

const tenVaiTro: Record<string, string> = {
  KHACH_HANG: "Khách hàng",
  NHAN_VIEN: "Nhân viên",
  QUAN_TRI_VIEN: "Quản trị viên",
};

const mauVaiTro: Record<string, string> = {
  KHACH_HANG: "success",
  NHAN_VIEN: "info",
  QUAN_TRI_VIEN: "danger",
};

export default function AdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locVaiTro, setLocVaiTro] = useState("");

  function taiDanhSach() {
    setDangTai(true);
    nguoiDungAPI
      .layDanhSach({
        tu_khoa: tuKhoa || undefined,
        id_vai_tro: locVaiTro ? parseInt(locVaiTro) : undefined,
        trang,
        kich_thuoc_trang: 20,
      })
      .then((res) => {
        setUsers(res.data.items || res.data || []);
        setTongTrang(res.data.tong_trang || 0);
      })
      .catch(() => {})
      .finally(() => setDangTai(false));
  }

  useEffect(() => { taiDanhSach(); }, [trang, locVaiTro]);

  return (
    <>
      <h4 className="fw-bold mb-4"><i className="bi bi-people me-2" />Quản lý người dùng</h4>

      <div className="d-flex gap-3 mb-3 flex-wrap">
        <Form.Control
          placeholder="Tìm tên, email, SĐT..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setTrang(1), taiDanhSach())}
          style={{ maxWidth: 250 }}
        />
        <Form.Select value={locVaiTro} onChange={(e) => { setLocVaiTro(e.target.value); setTrang(1); }} style={{ maxWidth: 180 }}>
          <option value="">Tất cả vai trò</option>
          <option value="1">Khách hàng</option>
          <option value="2">Nhân viên</option>
          <option value="3">Quản trị viên</option>
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
                <th>ID</th><th>Họ tên</th><th>Email</th>
                <th>SĐT</th><th>Địa chỉ</th><th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id_nguoi_dung || u.id}>
                  <td>{u.id_nguoi_dung || u.id}</td>
                  <td className="fw-bold">{u.ho_ten}</td>
                  <td>{u.email}</td>
                  <td>{u.so_dien_thoai}</td>
                  <td>{[u.phuong_xa, u.quan_huyen, u.tinh_thanh].filter(Boolean).join(", ")}</td>
                  <td>
                    <Badge bg={mauVaiTro[u.ten_vai_tro] || "secondary"}>
                      {tenVaiTro[u.ten_vai_tro] || u.ten_vai_tro}
                    </Badge>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="text-center text-secondary py-4">Không có người dùng</td></tr>
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
