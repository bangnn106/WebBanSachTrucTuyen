import sql from 'mssql';
import { CapNhatNguoiDungDTO } from '../models/user.model';
export declare function capNhatNguoiDung(idNguoiDung: number, data: CapNhatNguoiDungDTO): Promise<any>;
export declare function layDanhSachNguoiDung(tuKhoa?: string, idVaiTro?: number, trang?: number, kichThuocTrang?: number): Promise<{
    items: sql.IRecordSet<any>;
    tong_ban_ghi: any;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}>;
export declare function taoTaiKhoan(data: {
    ho_ten: string;
    email: string;
    mat_khau: string;
    so_dien_thoai: string;
    id_vai_tro: number;
}): Promise<{
    id: any;
}>;
export declare function khoaMoKhoaTaiKhoan(idNguoiDung: number, khoa: boolean): Promise<{
    thong_bao: string;
}>;
