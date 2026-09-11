export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
export interface PaginatedResult<T> {
    items: T[];
    tong_ban_ghi: number;
    trang: number;
    kich_thuoc_trang: number;
    tong_trang: number;
}
