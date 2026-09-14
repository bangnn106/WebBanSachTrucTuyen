export interface SubItem {
  name: string;
  id_the_loai?: number;
  keyword?: string;
}

export interface CategoryGroup {
  title: string;
  id_the_loai?: number;
  items: (string | SubItem)[];
}

export interface CategoryMenu {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  groups: CategoryGroup[];
}

export const categoryMenus: CategoryMenu[] = [
  {
    id: "sach-trong-nuoc",
    title: "Sách Trong Nước",
    icon: "bi-book",
    groups: [
      {
        title: "Văn học",
        id_the_loai: 1,
        items: [
          { name: "Tiểu thuyết", keyword: "Tiểu thuyết" },
          { name: "Truyện ngắn", keyword: "Truyện ngắn" },
          { name: "Thơ ca", keyword: "Thơ" },
          { name: "Kịch", keyword: "Kịch" },
        ],
      },
      {
        title: "Kinh tế",
        id_the_loai: 2,
        items: [
          { name: "Quản trị kinh doanh", keyword: "Quản trị" },
          { name: "Marketing", keyword: "Marketing" },
          { name: "Tài chính", keyword: "Tài chính" },
          { name: "Khởi nghiệp", keyword: "Khởi nghiệp" },
        ],
      },
      {
        title: "Tâm lý - Kỹ năng sống",
        id_the_loai: 3,
        items: [
          { name: "Kỹ năng sống", id_the_loai: 3 },
          { name: "Tâm lý học", id_the_loai: 8 },
          { name: "Tư duy tích cực", keyword: "Tư duy" },
          { name: "Đắc Nhân Tâm", keyword: "Đắc Nhân Tâm" },
        ],
      },
      {
        title: "Sách thiếu nhi",
        id_the_loai: 4,
        items: [
          { name: "Kiến thức bách khoa", keyword: "Bách khoa" },
          { name: "Truyện thiếu nhi", id_the_loai: 4 },
          { name: "Kĩ năng và tương tác", keyword: "Kỹ năng" },
          { name: "Hoàng Tử Bé", keyword: "Hoàng Tử Bé" },
        ],
      },
      {
        title: "Giáo khoa - Tham khảo",
        id_the_loai: 10,
        items: [
          { name: "Sách giáo khoa", id_the_loai: 10 },
          { name: "Sách tham khảo", keyword: "Tham khảo" },
          { name: "Toán Cao Cấp", keyword: "Toán" },
          { name: "Giáo trình đại học", keyword: "Giáo trình" },
        ],
      },
      {
        title: "Ngoại ngữ",
        id_the_loai: 7,
        items: [
          { name: "Tiếng Anh", id_the_loai: 7, keyword: "English" },
          { name: "Luyện thi IELTS / TOEIC", keyword: "IELTS" },
          { name: "Tiếng Nhật", keyword: "Tiếng Nhật" },
          { name: "Tiếng Hàn", keyword: "Tiếng Hàn" },
        ],
      },
    ],
  },
];