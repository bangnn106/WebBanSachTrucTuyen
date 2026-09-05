// ========== CHUẨN HÓA RESPONSE CHO TOÀN BỘ API ==========

// Response cơ bản
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Response có phân trang
export interface PaginatedResult<T> {
  items: T[];
  tong_ban_ghi: number;
  trang: number;
  kich_thuoc_trang: number;
  tong_trang: number;
}