export interface ChiTietGioHang {
    id: number;
    id_sach: number;
    ten_sach: string;
    anh_bia: string | null;
    gia_ban: number;
    so_luong: number;
    so_luong_ton: number;
    trang_thai: string;
    thanh_tien: number;
    tong_tien_gio_hang: number;
}
export interface ThemVaoGioDTO {
    id_sach: number;
    so_luong: number;
}
export interface CapNhatGioDTO {
    so_luong: number;
}
