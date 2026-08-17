/* Mapping ID -> tên hiển thị (khớp với data trong SQL) */

export const theLoaiMap: Record<number, string> = {
  1: "Văn học",
  2: "Kỹ năng sống",
  3: "Lịch sử",
  4: "Thiếu nhi",
  5: "Giáo khoa - Tham khảo",
  6: "Ngoại ngữ",
};

export const nhaXuatBanMap: Record<number, string> = {
  1: "NXB Trẻ",
  2: "NXB Kim Đồng",
  3: "NXB Tổng hợp TP.HCM",
};

/* Danh sách khoảng giá cho filter */
export const priceRanges = [
  { label: "Dưới 50.000đ",    min: 0,      max: 50000 },
  { label: "50.000đ - 100.000đ", min: 50000,  max: 100000 },
  { label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { label: "Trên 200.000đ",   min: 200000, max: Infinity },
];

/* Danh sách option sắp xếp */
export const sortOptions = [
  { value: "MOI_NHAT",  label: "Mới nhất" },
  { value: "GIA_TANG",  label: "Giá tăng dần" },
  { value: "GIA_GIAM",  label: "Giá giảm dần" },
  { value: "BAN_CHAY",  label: "Bán chạy nhất" },
];
