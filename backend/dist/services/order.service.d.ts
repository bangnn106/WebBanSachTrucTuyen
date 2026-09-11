import sql from 'mssql';
import { TaoDonHangDTO, DanhSachDonHangDTO } from '../models/order.model';
export declare function taoDonHangTuGio(idNguoiDung: number, data: TaoDonHangDTO): Promise<any>;
export declare function layDanhSachDonHang(idNguoiDung: number | null, // null lay tat ca (nhan vien/admin)
filter: DanhSachDonHangDTO): Promise<{
    items: sql.IRecordSet<any>;
    tong_ban_ghi: any;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}>;
export declare function layChiTietDonHang(idDonHang: number, idNguoiDung: number | null): Promise<{
    don_hang: any;
    chi_tiet: any;
}>;
export declare function capNhatTrangThaiDonHang(idDonHang: number, trangThaiMoi: string): Promise<any>;
export declare function huyDonHang(idDonHang: number, idNguoiThucHien: number, lyDo?: string): Promise<any>;
