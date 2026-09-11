//ENTITY QUAN LY KHOexport interface QuanLiKho {
  id: number;
  loai_giao_dich: string;
  so_luong: number;
  ton_truoc: number;
  ton_sau: number;
  ly_do: string | null;
  ngay_thuc_hien: Date;
  id_sach: number;
  ten_sach?: string;
  nguoi_thuc_hien?: string;
  ma_don_hang?: string;
  tong_ban_ghi?: number;
}

//DTOs
export interface NhapKhoDTO {
  id_sach: number;
  so_luong: number;
  ly_do?: string;
}

export interface DieuChinhKhoDTO {
  id_sach: number;
  so_luong_thay_doi: number;   //duong tang, am giam  ly_do: string;                //bat buoc}

export interface LichSuKhoDTO {
  id_sach?: number;
  loai_giao_dich?: string;
  tu_ngay?: string;
  den_ngay?: string;
  trang?: number;
  kich_thuoc_trang?: number;
}