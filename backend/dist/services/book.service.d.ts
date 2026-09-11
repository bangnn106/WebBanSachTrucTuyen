import sql from 'mssql';
import { ThemSachDTO, CapNhatSachDTO, TimKiemSachDTO } from '../models/book.model';
export declare function timKiemSach(filter: TimKiemSachDTO): Promise<{
    items: sql.IRecordSet<any>;
    tong_ban_ghi: any;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}>;
export declare function laySachTheoId(id: number): Promise<any>;
export declare function themSach(data: ThemSachDTO, idNguoiThucHien: number): Promise<any>;
export declare function capNhatSach(id: number, data: CapNhatSachDTO): Promise<any>;
export declare function capNhatTrangThai(id: number, trangThai: string): Promise<any>;
export declare function layDanhSachTheLoai(): Promise<sql.IRecordSet<any>>;
export declare function layDanhSachNhaXuatBan(): Promise<sql.IRecordSet<any>>;
