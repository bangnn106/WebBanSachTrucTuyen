/* API CLIENT - Lop goi API tap trung cho toan bo frontend
   Tat ca request den backend deu di qua file nay. Token JWT duoc tu dong gan vao header. */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Base URL backend (khong co /api) dung de load anh tinh
const BACKEND_URL = API_URL.replace(/\/api$/, "");

/* Tao URL day du cho anh bia sach */
export function layUrlAnh(anhBia: string | null | undefined): string {
  if (!anhBia) return "/images/book/imgbook1.jpg"; // anh mac dinh
  // Neu da la URL day du (http/https) thi giu nguyen
  if (anhBia.startsWith("http")) return anhBia;
  // Neu la path tuong doi (/uploads/...) them base URL backend
  return `${BACKEND_URL}${anhBia}`;
}

/* Lay token da luu */
function layToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/* Ham goi API chung */
async function goiAPI(
  duongDan: string,
  tuyChon: RequestInit = {}
) {
  const token = layToken();
  const laFormData = tuyChon.body instanceof FormData;

  // Tao headers khong set Content-Type cho FormData (browser tu set)
  const headers: Record<string, string> = {};
  if (!laFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${duongDan}`, {
    ...tuyChon,
    headers: { ...headers, ...(tuyChon.headers as Record<string, string>) },
  });

  const data = await res.json();

  if (!res.ok) {
    // Tao loi co status va message de component xu ly
    const loi: any = new Error(data.message || "Đã xảy ra lỗi");
    loi.status = res.status;
    throw loi;
  }

  return data;
}

// Tao query string tu object (bo qua gia tri rong) 
function taoQuery(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : "";
}

/* CAC MODULE API */

// XAC THUC (dang nhap, dang ky, doi mat khau)
export const xacThucAPI = {
  dangNhap: (email: string, mat_khau: string) =>
    goiAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, mat_khau }),
    }),

  dangKy: (data: {
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_chi_tiet?: string;
  }) =>
    goiAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  layThongTinCuaToi: () => goiAPI("/auth/me"),

  doiMatKhau: (mat_khau_cu: string, mat_khau_moi: string) =>
    goiAPI("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ mat_khau_cu, mat_khau_moi }),
    }),
};

// SACH (tim kiem, chi tiet, them, sua, the loai, NXB)
export const sachAPI = {
  timKiem: (params: {
    tu_khoa?: string;
    id_the_loai?: number;
    id_nha_xuat_ban?: number;
    gia_tu?: number;
    gia_den?: number;
    trang_thai?: string;
    sap_xep?: string;
    trang?: number;
    kich_thuoc_trang?: number;
  } = {}) => goiAPI(`/books${taoQuery(params)}`),

  layChiTiet: (id: number) => goiAPI(`/books/${id}`),

  themMoi: (formData: FormData) =>
    goiAPI("/books", { method: "POST", body: formData }),

  capNhat: (id: number, formData: FormData) =>
    goiAPI(`/books/${id}`, { method: "PUT", body: formData }),

  capNhatTrangThai: (id: number, trang_thai: string) =>
    goiAPI(`/books/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ trang_thai }),
    }),

  layDanhSachTheLoai: () => goiAPI("/categories"),

  layDanhSachNhaXuatBan: () => goiAPI("/publishers"),
};

// GIO HANG (them, sua, xoa, lay gio)
export const gioHangAPI = {
  layGioHang: () => goiAPI("/cart"),

  themVaoGio: (id_sach: number, so_luong: number) =>
    goiAPI("/cart", {
      method: "POST",
      body: JSON.stringify({ id_sach, so_luong }),
    }),

  capNhatSoLuong: (idSach: number, so_luong: number) =>
    goiAPI(`/cart/${idSach}`, {
      method: "PUT",
      body: JSON.stringify({ so_luong }),
    }),

  xoaMotSach: (idSach: number) =>
    goiAPI(`/cart/${idSach}`, { method: "DELETE" }),

  xoaToanBo: () => goiAPI("/cart", { method: "DELETE" }),
};

// DON HANG (tao don, xem, cap nhat trang thai, huy) — dung ma_don_hang (string)
export const donHangAPI = {
  taoDonHang: (data: {
    ten_nguoi_nhan: string;
    so_dien_thoai_nhan: string;
    dia_chi_giao_hang: string;
    ghi_chu?: string;
  }) =>
    goiAPI("/orders", { method: "POST", body: JSON.stringify(data) }),

  layDanhSach: (params: {
    tu_khoa?: string;
    trang_thai?: string;
    tu_ngay?: string;
    den_ngay?: string;
    trang?: number;
    kich_thuoc_trang?: number;
  } = {}) => goiAPI(`/orders${taoQuery(params)}`),

  layChiTiet: (maDon: string) => goiAPI(`/orders/${maDon}`),

  capNhatTrangThai: (maDon: string, trang_thai_moi: string) =>
    goiAPI(`/orders/${maDon}/status`, {
      method: "PATCH",
      body: JSON.stringify({ trang_thai_moi }),
    }),

  huyDon: (maDon: string, ly_do?: string) =>
    goiAPI(`/orders/${maDon}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ ly_do }),
    }),
};

// THONG KE / DASHBOARD (doanh thu, top sach, don hang)
export const thongKeAPI = {
  tongQuan: (tu_ngay?: string, den_ngay?: string) =>
    goiAPI(`/dashboard/overview${taoQuery({ tu_ngay, den_ngay })}`),

  doanhThu: (tu_ngay?: string, den_ngay?: string, kieu_thong_ke?: string) =>
    goiAPI(
      `/dashboard/revenue${taoQuery({ tu_ngay, den_ngay, kieu_thong_ke })}`
    ),

  topSachBanChay: (so_luong_top?: number) =>
    goiAPI(`/dashboard/top-books${taoQuery({ so_luong_top })}`),

  thongKeDonHang: (tu_ngay?: string, den_ngay?: string) =>
    goiAPI(`/dashboard/order-stats${taoQuery({ tu_ngay, den_ngay })}`),
};

// NHAP HANG SACH (thay the khoHangAPI)
export const nhapHangAPI = {
  nhapHang: (id_sach: number, so_luong: number, don_gia_nhap?: number, ghi_chu?: string) =>
    goiAPI("/nhaphang", {
      method: "POST",
      body: JSON.stringify({ id_sach, so_luong, don_gia_nhap, ghi_chu }),
    }),

  nhapKho: (id_sach: number, so_luong: number, ghi_chu?: string, don_gia_nhap: number = 0) =>
    goiAPI("/nhaphang", {
      method: "POST",
      body: JSON.stringify({ id_sach, so_luong, don_gia_nhap, ghi_chu }),
    }),

  dieuChinhKho: (id_sach: number, so_luong_thay_doi: number, ly_do: string) =>
    goiAPI("/nhaphang", {
      method: "POST",
      body: JSON.stringify({ id_sach, so_luong: Math.abs(so_luong_thay_doi), ghi_chu: ly_do }),
    }),

  layDanhSach: (params: {
    id_sach?: number;
    tu_ngay?: string;
    den_ngay?: string;
    trang?: number;
    kich_thuoc_trang?: number;
  } = {}) => goiAPI(`/nhaphang${taoQuery(params)}`),

  layLichSu: (params: {
    id_sach?: number;
    tu_ngay?: string;
    den_ngay?: string;
    trang?: number;
    kich_thuoc_trang?: number;
  } = {}) => goiAPI(`/nhaphang${taoQuery(params)}`),
};

export const khoHangAPI = nhapHangAPI;

// NGUOI DUNG (cap nhat profile, danh sach user)
export const nguoiDungAPI = {
  capNhatProfile: (data: {
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_chi_tiet?: string;
  }) =>
    goiAPI("/users/me", { method: "PUT", body: JSON.stringify(data) }),

  layDanhSach: (params: {
    tu_khoa?: string;
    id_vai_tro?: number;
    trang?: number;
    kich_thuoc_trang?: number;
  } = {}) => goiAPI(`/users${taoQuery(params)}`),

  taoTaiKhoan: (data: {
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    id_vai_tro: number;
    tinh_thanh?: string;
    quan_huyen?: string;
    phuong_xa?: string;
    dia_chi_chi_tiet?: string;
  }) =>
    goiAPI("/users", { method: "POST", body: JSON.stringify(data) }),

  khoaMoKhoa: (id: number, khoa: boolean) =>
    goiAPI(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ khoa }),
    }),
};
