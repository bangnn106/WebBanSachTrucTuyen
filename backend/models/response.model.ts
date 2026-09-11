//CHUAN HOA RESPONSE CHO TOAN BO API
//Response co banexport interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

//Response co phan trangexport interface PaginatedResult<T> {
  items: T[];
  tong_ban_ghi: number;
  trang: number;
  kich_thuoc_trang: number;
  tong_trang: number;
}