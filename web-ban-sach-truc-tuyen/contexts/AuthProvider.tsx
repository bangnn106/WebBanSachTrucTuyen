/* AUTH PROVIDER: Quan ly dang nhap / dang ky / phan quyen
   Wrap toan bo app, cung cap thong tin user + token cho moi trang.
   Khi mount tu dong check token da luu va lay lai thong tin user. */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { xacThucAPI } from "@/lib/api";

/* Kieu du lieu User */
export interface ThongTinUser {
  id_nguoi_dung: number;
  id?: number;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  dia_chi_chi_tiet: string | null;
  ten_vai_tro: string; // "KHACH_HANG" | "NHAN_VIEN" | "QUAN_TRI_VIEN"
}

/* Kieu du lieu Context */
interface AuthContextType {
  user: ThongTinUser | null;       // null: chua dang nhap
  dangTai: boolean;                 // true khi dang load thong tin
  daDangNhap: boolean;              // shortcut: user ! null
  dangNhap: (email: string, matKhau: string) => Promise<ThongTinUser>;
  dangKy: (data: any) => Promise<void>;
  dangXuat: () => void;
  capNhatUser: () => Promise<void>; // refresh thong tin user tu server
}

const AuthContext = createContext<AuthContextType | null>(null);

/* Provider Component */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ThongTinUser | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const router = useRouter();

  /* Khi mount: kiem tra token da luu, neu co thi lay lai thong tin user */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      xacThucAPI
        .layThongTinCuaToi()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token het han hoac khong hop le -> xoa
          localStorage.removeItem("token");
        })
        .finally(() => setDangTai(false));
    } else {
      setDangTai(false);
    }
  }, []);

  /* Dang nhap: luu token + set user */
  const dangNhap = useCallback(
    async (email: string, matKhau: string): Promise<ThongTinUser> => {
      const res = await xacThucAPI.dangNhap(email, matKhau);
      const { token, user: thongTinUser } = res.data;
      localStorage.setItem("token", token);
      setUser(thongTinUser);
      return thongTinUser;
    },
    []
  );

  /* Dang ky (chi tao tai khoan, chua tu dang nhap) */
  const dangKy = useCallback(async (data: any) => {
    await xacThucAPI.dangKy(data);
  }, []);

  /* Dang xuat: xoa token + user + redirect ve login */
  const dangXuat = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("bookstore_cart");
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  /* Refresh thong tin user (vi du sau khi cap nhat profile) */
  const capNhatUser = useCallback(async () => {
    try {
      const res = await xacThucAPI.layThongTinCuaToi();
      setUser(res.data);
    } catch {
      // Bo qua loi
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        dangTai,
        daDangNhap: user !== null,
        dangNhap,
        dangKy,
        dangXuat,
        capNhatUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* Hook de dung trong component */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
