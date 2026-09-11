export declare function orderConfirmationTemplate(data: {
    ma_don_hang: string;
    ten_nguoi_nhan: string;
    dia_chi_giao_hang: string;
    so_dien_thoai_nhan: string;
    tong_tien: number;
    ngay_dat: string;
    chi_tiet: Array<{
        ten_sach: string;
        so_luong: number;
        don_gia: number;
        thanh_tien: number;
    }>;
}): string;
export declare function orderCancelledTemplate(data: {
    ma_don_hang: string;
    ten_nguoi_nhan: string;
    tong_tien: number;
    ly_do: string;
}): string;
