// ========== ENTITY SÁCH ==========
export interface Sach {
  id: number;
  ten_sach: string;
  isbn: string;
  tac_gia: string;
  mo_ta_ngan: string | null;
  gia_goc: number;
  gia_ban: number;
  nam_xuat_ban: number | null;
  ngon_ngu: string | null;
  anh_bia: string | null;
  so_luong_da_ban: number;
  so_luong_ton: number;
  trang_thai: string;
  id_the_loai: number;
  id_nha_xuat_ban: number;
  // Các field JOIN thêm
  ten_the_loai?: string;
  ten_nxb?: string;
  tong_ban_ghi?: number;
}

// ========== DTOs ==========

export interface ThemSachDTO {
  ten_sach: string;
  isbn: string;
  tac_gia: string;
  mo_ta_ngan?: string;
  gia_goc: number;
  gia_ban: number;
  nam_xuat_ban?: number;
  ngon_ngu?: string;
  anh_bia?: string;
  so_luong_ton?: number;
  id_the_loai: number;
  id_nha_xuat_ban: number;
}

export interface CapNhatSachDTO {
  ten_sach: string;
  isbn: string;
  tac_gia: string;
  mo_ta_ngan?: string;
  gia_goc: number;
  gia_ban: number;
  nam_xuat_ban?: number;
  ngon_ngu?: string;
  anh_bia?: string;
  id_the_loai: number;
  id_nha_xuat_ban: number;
}

export interface TimKiemSachDTO {
  tu_khoa?: string;
  id_the_loai?: number;
  id_nha_xuat_ban?: number;
  gia_tu?: number;
  gia_den?: number;
  trang_thai?: string;
  sap_xep?: string;       // 'MOI_NHAT' | 'GIA_TANG' | 'GIA_GIAM' | 'BAN_CHAY'
  trang?: number;
  kich_thuoc_trang?: number;
}

// ========== ENTITIES PHỤ ==========

export interface TheLoai {
  id: number;
  ten_the_loai: string;
}

export interface NhaXuatBan {
  id: number;
  ten_nxb: string;
}