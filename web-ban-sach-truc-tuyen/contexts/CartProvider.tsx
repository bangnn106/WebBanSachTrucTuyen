/* CART PROVIDER Quan ly gio hang - Chua ang nhap luu gio vao localStorage - a ang nhap goi API backend that Khi ang nhap merge gio localStorage vao gio DB */
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
import { useAuth } from "@/contexts/AuthProvider";
import { gioHangAPI } from "@/lib/api";

/* Context shape */
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

/* Helper: oc/ghi localStorage */
function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* Provider */
export function CartProvider({ children }: { children: ReactNode }) {
  const { daDangNhap, dangTai: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* Load gio khi mount hoac khi trang thai ang nhap thay oi */
  useEffect(() => {
    if (authLoading) return; //Cho auth load xong
    if (daDangNhap) {
      //a ang nhap load gio tu API      gioHangAPI
        .layGioHang()
        .then((res) => {
          const apiItems: CartItem[] = (res.data || []).map((item: any) => ({
            id_sach: item.id_sach,
            ten_sach: item.ten_sach,
            anh_bia: item.anh_bia,
            gia_ban: item.gia_ban,
            so_luong: item.so_luong,
            so_luong_ton: item.so_luong_ton,
          }));
          setItems(apiItems);

          //Merge gio localStorage vao API (neu co)          const localItems = loadLocalCart();
          if (localItems.length > 0) {
            Promise.all(
              localItems.map((li) =>
                gioHangAPI.themVaoGio(li.id_sach, li.so_luong).catch(() => {})
              )
            ).then(() => {
              localStorage.removeItem(STORAGE_KEY);
              //Reload gio sau khi merge              gioHangAPI.layGioHang().then((res2) => {
                const merged: CartItem[] = (res2.data || []).map((item: any) => ({
                  id_sach: item.id_sach,
                  ten_sach: item.ten_sach,
                  anh_bia: item.anh_bia,
                  gia_ban: item.gia_ban,
                  so_luong: item.so_luong,
                  so_luong_ton: item.so_luong_ton,
                }));
                setItems(merged);
              });
            });
          }
        })
        .catch(() => {
          //Neu API loi dung localStorage          setItems(loadLocalCart());
        })
        .finally(() => setLoaded(true));
    } else {
      //Chua ang nhap dung localStorage      setItems(loadLocalCart());
      setLoaded(true);
    }
  }, [daDangNhap, authLoading]);

  /* Persist vao localStorage khi chua ang nhap */
  useEffect(() => {
    if (loaded && !daDangNhap) {
      saveLocalCart(items);
    }
  }, [items, loaded, daDangNhap]);

  /* Them sach vao gio */
  const addToCart = useCallback(
    (newItem: CartItem) => {
      if (daDangNhap) {
        gioHangAPI
          .themVaoGio(newItem.id_sach, newItem.so_luong)
          .then(() =>
            gioHangAPI.layGioHang().then((res) => {
              setItems(
                (res.data || []).map((i: any) => ({
                  id_sach: i.id_sach,
                  ten_sach: i.ten_sach,
                  anh_bia: i.anh_bia,
                  gia_ban: i.gia_ban,
                  so_luong: i.so_luong,
                  so_luong_ton: i.so_luong_ton,
                }))
              );
            })
          )
          .catch(() => {});
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.id_sach === newItem.id_sach);
          if (existing) {
            return prev.map((i) =>
              i.id_sach === newItem.id_sach
                ? {
                    ...i,
                    so_luong: Math.min(
                      i.so_luong + newItem.so_luong,
                      i.so_luong_ton
                    ),
                  }
                : i
            );
          }
          return [...prev, newItem];
        });
      }
    },
    [daDangNhap]
  );

  /* Cap nhat so luong */
  const updateQuantity = useCallback(
    (idSach: number, qty: number) => {
      if (qty <= 0) return;
      if (daDangNhap) {
        gioHangAPI
          .capNhatSoLuong(idSach, qty)
          .then(() =>
            gioHangAPI.layGioHang().then((res) => {
              setItems(
                (res.data || []).map((i: any) => ({
                  id_sach: i.id_sach,
                  ten_sach: i.ten_sach,
                  anh_bia: i.anh_bia,
                  gia_ban: i.gia_ban,
                  so_luong: i.so_luong,
                  so_luong_ton: i.so_luong_ton,
                }))
              );
            })
          )
          .catch(() => {});
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.id_sach === idSach
              ? { ...i, so_luong: Math.min(qty, i.so_luong_ton) }
              : i
          )
        );
      }
    },
    [daDangNhap]
  );

  /* Xoa 1 sach */
  const removeFromCart = useCallback(
    (idSach: number) => {
      if (daDangNhap) {
        gioHangAPI
          .xoaMotSach(idSach)
          .then(() => setItems((prev) => prev.filter((i) => i.id_sach !== idSach)))
          .catch(() => {});
      } else {
        setItems((prev) => prev.filter((i) => i.id_sach !== idSach));
      }
    },
    [daDangNhap]
  );

  /* Xoa toan bo gio */
  const clearCart = useCallback(() => {
    if (daDangNhap) {
      gioHangAPI
        .xoaToanBo()
        .then(() => setItems([]))
        .catch(() => {});
    } else {
      setItems([]);
    }
  }, [daDangNhap]);

  /* Tinh tong */
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

/* Hook */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng trong CartProvider");
  return ctx;
}
