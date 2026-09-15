export declare enum VaiTro {
    KHACH_HANG = "KHACH_HANG",
    NHAN_VIEN = "NHAN_VIEN",
    QUAN_TRI_VIEN = "QUAN_TRI_VIEN"
}
export interface NguoiDung {
    id_nguoi_dung: number;
    id: number;
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_chi_tiet: string | null;
    id_vai_tro: number;
    ten_vai_tro: string;
}
export interface DangKyDTO {
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_chi_tiet?: string;
}
export interface DangNhapDTO {
    email: string;
    mat_khau: string;
}
export interface CapNhatNguoiDungDTO {
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_chi_tiet?: string;
}
export interface JwtPayload {
    id_nguoi_dung: number;
    id: number;
    email: string;
    id_vai_tro: number;
    ten_vai_tro: string;
}
