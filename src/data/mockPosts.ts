export interface Post {
  id: number;
  title: string;
  image: string;
  price: string;
  category: string;
  address: string;
  description?: string; // Optional for Blog posts
  videoUrl?: string; // Optional for Video posts
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Bán nhà mặt phố Nguyễn Trãi",
    image: "https://example.com/image1.jpg",
    price: "2 tỷ",
    category: "bat-dong-san",
    address: "Hà Nội",
  },
  {
    id: 2,
    title: "Cho thuê căn hộ chung cư Times City",
    image: "https://example.com/image2.jpg",
    price: "10 triệu/tháng",
    category: "bat-dong-san",
    address: "Hà Nội",
  },
  {
    id: 3,
    title: "Bán xe máy Honda SH 2020",
    image: "https://example.com/image3.jpg",
    price: "70 triệu",
    category: "oto-xe-may",
    address: "TP.HCM",
  },
  {
    id: 4,
    title: "Cho thuê xe ô tô tự lái",
    image: "https://example.com/image4.jpg",
    price: "1 triệu/ngày",
    category: "oto-xe-may",
    address: "Đà Nẵng",
  },
];
