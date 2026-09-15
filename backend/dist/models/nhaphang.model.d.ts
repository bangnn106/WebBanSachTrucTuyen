export interface NhapHangSach {
    ma_phieu_nhap: string;
    so_luong: number;
    don_gia_nhap: number;
    tong_tien_nhap: number;
    ghi_chu: string | null;
    ngay_nhap: Date;
    id_sach: number;
    ten_sach?: string;
    nguoi_nhap?: string;
    tong_ban_ghi?: number;
}
export interface NhapHangDTO {
    id_sach: number;
    so_luong: number;
    don_gia_nhap?: number;
    ghi_chu?: string;
}
export interface DanhSachNhapHangDTO {
    id_sach?: number;
    tu_ngay?: string;
    den_ngay?: string;
    trang?: number;
    kich_thuoc_trang?: number;
}
