export interface book{
    id:number;
    ten_sach:string;
    isbn: string;
    tac_gia: string;
    mo_ta_ngan?: string | null;
    gia_goc: number;
    gia_ban: number;
    nam_xuat_ban?: number | null;
    ngon_ngu?: string | null;
    anh_bia:string | null;
    so_luong_da_ban: number;
    so_luong_ton: number;
    trang_thai: string;
    id_the_loai: number;
    id_nha_xuat_ban: number;
    /* optional display fields (from JOIN) */
    ten_the_loai?: string;
    ten_nxb?: string;
}

/* Cart item - matches sp_lay_chi_tiet_gio_hang output */
export interface CartItem {
    id_sach: number;
    ten_sach: string;
    anh_bia: string | null;
    gia_ban: number;
    so_luong: number;
    so_luong_ton: number;
}