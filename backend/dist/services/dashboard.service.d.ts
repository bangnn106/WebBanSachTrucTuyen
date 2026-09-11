import sql from 'mssql';
export declare function tongQuan(tuNgay?: string, denNgay?: string): Promise<any>;
export declare function doanhThu(tuNgay?: string, denNgay?: string, kieuThongKe?: string): Promise<sql.IRecordSet<any>>;
export declare function topSachBanChay(soLuongTop?: number): Promise<sql.IRecordSet<any>>;
export declare function donHangTheoTrangThai(tuNgay?: string, denNgay?: string): Promise<sql.IRecordSet<any>>;
