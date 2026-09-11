import { DangKyDTO, DangNhapDTO } from '../models/user.model';
export declare function dangKy(data: DangKyDTO): Promise<any>;
export declare function dangNhap(data: DangNhapDTO): Promise<{
    token: string;
    user: {
        id: number;
        ho_ten: string;
        email: string;
        so_dien_thoai: string;
        tinh_thanh: string;
        quan_huyen: string;
        phuong_xa: string;
        dia_chi_chi_tiet: string | null;
        ten_vai_tro: string;
    };
}>;
export declare function layThongTinHienTai(email: string): Promise<any>;
