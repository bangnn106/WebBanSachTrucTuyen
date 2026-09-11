import sql from 'mssql';
import { NhapKhoDTO, DieuChinhKhoDTO, LichSuKhoDTO } from '../models/inventory.model';
export declare function nhapKho(data: NhapKhoDTO, idNguoiThucHien: number): Promise<any>;
export declare function dieuChinhKho(data: DieuChinhKhoDTO, idNguoiThucHien: number): Promise<any>;
export declare function layLichSuKho(filter: LichSuKhoDTO): Promise<{
    items: sql.IRecordSet<any>;
    tong_ban_ghi: any;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}>;
