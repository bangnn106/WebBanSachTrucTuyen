"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { CartItem } from "@/types/book";

/* ── Context shape ── */
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (idSach: number, qty: number) => void;
  removeFromCart: (idSach: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "bookstore_cart";

/* ── Helper: đọc cart từ localStorage ── */
function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ── Helper: ghi cart vào localStorage ── */
function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ──────────────────────────────────────────
   Provider
   Khi có Backend API, thay các hàm bên dưới
   bằng fetch() tới các endpoint tương ứng:
     POST   /api/cart          → sp_them_sach_vao_gio
     PATCH  /api/cart/:idSach  → sp_cap_nhat_so_luong_gio
     DELETE /api/cart/:idSach  → sp_xoa_sach_khoi_gio
     DELETE /api/cart          → sp_xoa_toan_bo_gio_hang
     GET    /api/cart          → sp_lay_chi_tiet_gio_hang
   ────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* Load cart khi mount */
  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  /* Persist khi items thay đổi */
  useEffect(() => {
    if (loaded) saveCart(items);
  }, [items, loaded]);

  /* Thêm sách vào giỏ */
  const addToCart = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id_sach === newItem.id_sach);
      if (existing) {
        return prev.map((i) =>
          i.id_sach === newItem.id_sach
            ? { ...i, so_luong: Math.min(i.so_luong + newItem.so_luong, i.so_luong_ton) }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  /* Cập nhật số lượng */
  const updateQuantity = useCallback((idSach: number, qty: number) => {
    if (qty <= 0) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id_sach === idSach
          ? { ...i, so_luong: Math.min(qty, i.so_luong_ton) }
          : i
      )
    );
  }, []);

  /* Xoá 1 sách */
  const removeFromCart = useCallback((idSach: number) => {
    setItems((prev) => prev.filter((i) => i.id_sach !== idSach));
  }, []);

  /* Xoá toàn bộ giỏ */
  const clearCart = useCallback(() => setItems([]), []);

  /* Tính tổng */
  const totalItems = items.reduce((s, i) => s + i.so_luong, 0);
  const totalPrice = items.reduce((s, i) => s + i.gia_ban * i.so_luong, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ── Hook ── */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng trong CartProvider");
  return ctx;
}
