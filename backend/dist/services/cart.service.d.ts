import sql from 'mssql';
export declare function themSachVaoGio(idNguoiDung: number, idSach: number, soLuong: number): Promise<any>;
export declare function capNhatSoLuongGio(idNguoiDung: number, idSach: number, soLuong: number): Promise<any>;
export declare function xoaSachKhoiGio(idNguoiDung: number, idSach: number): Promise<any>;
export declare function xoaToanBoGioHang(idNguoiDung: number): Promise<any>;
export declare function layChiTietGioHang(idNguoiDung: number): Promise<sql.IRecordSet<any>>;
