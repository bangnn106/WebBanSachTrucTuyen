export interface categoryGroup{
    title:string;
    items:string[];
}

export interface categoryMenu{
    title:string;
    groups:categoryGroup[];
}

export const categoryMenus: categoryMenu[] = [
  {
    title: "Sách Trong Nước",
    groups: [
      {
        title: "Văn học",
        items: [
          "Tiểu thuyết",
          "Truyện ngắn",
          "Thơ ca",
          "Kịch",
        ],
      },
      {
        title: "Kinh tế",
        items: [
          "Quản trị kinh doanh",
          "Marketing",
          "Tài chính",
          "Khởi nghiệp",
        ],
      },
      {
        title: "Tâm lý - Kỹ năng sống",
        items: [
          "Kỹ năng sống",
          "Tâm lý",
        ],
      },
      {
        title: "Sách thiếu nhi",
        items: [
          "Kiến thức bách khoa",
          "Truyện thiếu nhi",
          "Kĩ năng và tương tác",
        ],
      },
      {
        title: "Giáo khoa - Tham khảo",
        items: [
          "Sách giáo khoa",
          "Sách tham khảo",
        ],
      },
      {
        title: "Ngoại ngữ",
        items: [
          "Tiếng Anh",
          "Tiếng Nhật",
          "Tiếng Hàn",
          "Tiếng Trung",
        ],
      },
    ],
  },
];