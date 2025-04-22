import React from "react";
import Slider from "react-slick";
import RoomCard from "./RoomCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const rooms = [
  {
    image: "/images/room1.jpg",
    location: "Gò Vấp, TP.HCM",
    title: "Nhà trọ số 88 Phạm Ngũ Lão",
    price: "1.8 triệu/tháng",
    rating: 4.5,
    link: "/phong-tro/88-pham-ngu-lao",
  },
  {
    image: "/images/room2.jpg",
    location: "Tân Bình, TP.HCM",
    title: "Nhà trọ cao cấp có thang máy",
    price: "4.8 triệu/tháng",
    rating: 4.5,
    link: "/phong-tro/100-hong-ha",
  },
  {
    image: "/images/room3.jpg",
    location: "Gò Vấp, TP.HCM",
    title: "Trọ cao cấp giá rẻ gần trung tâm",
    price: "3.3 triệu/tháng",
    rating: 4.5,
    link: "/phong-tro/537-nguyen-oanh",
  },
  {
    image: "/images/room4.jpg",
    location: "Gò Vấp, TP.HCM",
    title: "Ký túc xá giá rẻ nhưng riêng tư",
    price: "1.9 triệu/tháng",
    rating: 4.5,
    link: "/phong-tro/ktx-tran-thi-nghi",
  },
  {
    image: "/images/room5.jpg",
    location: "Quận 10, TP.HCM",
    title: "Phòng trọ phải rửa bát ngoài ban công",
    price: "3.5 triệu/tháng",
    rating: 4.1,
    link: "/phong-tro/474-41-nguyen-tri-phuong",
  },
];

const CustomArrow = ({ className, onClick }: any) => (
  <div className={className} onClick={onClick} style={{ zIndex: 2 }}>
    <span style={{ fontSize: '2rem' }}>{className?.includes("next") ? "›" : "‹"}</span>
  </div>
);


const RoomList: React.FC = () => {
  const settings = {
    dots: false, // Không hiển thị chấm tròn
    infinite: true, // Cho phép lặp lại danh sách
    speed: 500,
    slidesToShow: 3, // Hiển thị 3 card mỗi lần
    slidesToScroll: 1, // Cuộn từng card một
    nextArrow: <CustomArrow />,
prevArrow: <CustomArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } }, // Tablet lớn
      { breakpoint: 768, settings: { slidesToShow: 2 } }, // Tablet nhỏ
      { breakpoint: 576, settings: { slidesToShow: 1 } }, // Mobile
    ],
  };

  

  return (
    <div className="room-list-container">
      <h2 className="text-center mb-4 text-white">TRẢI NGHIỆM TRỌ MỚI TẠI CÁC TỈNH THÀNH</h2>
      <Slider {...settings}>
        {rooms.map((room, index) => (
          <div key={index} className="px-2">
            <RoomCard {...room} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RoomList;
