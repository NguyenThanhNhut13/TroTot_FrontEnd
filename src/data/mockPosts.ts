export interface Post {
    id: number;
    title: string;
    description?: string;
    category: string;
    videoUrl?: string;
  }
  
  export const mockPosts: Post[] = [
    { id: 1, title: "Phòng trọ quận 5", category: "nha-tro-phong-tro" },
    { id: 2, title: "Nhà nguyên căn Tân Phú", category: "nha-nguyen-can" },
    { id: 3, title: "Căn hộ chung cư Vinhomes", category: "can-ho-chung-cu" },
    {
      id: 4,
      title: "Review căn hộ Landmark",
      category: "video-review",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Cận cảnh căn hộ cao cấp Landmark 81"
    },
    {
      id: 5,
      title: "Kinh nghiệm thuê nhà trọ",
      category: "blog",
      description: "Hướng dẫn đầy đủ và thực tế"
    }
  ];
  