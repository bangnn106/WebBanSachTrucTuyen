import sql from 'mssql';
import { NhapHangDTO, DanhSachNhapHangDTO } from '../models/nhaphang.model';
export declare function nhapHang(data: NhapHangDTO, idNguoiNhap: number): Promise<any>;
export declare function layDanhSachNhapHang(filter: DanhSachNhapHangDTO): Promise<{
    items: sql.IRecordSet<any>;
    tong_ban_ghi: any;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}>;
