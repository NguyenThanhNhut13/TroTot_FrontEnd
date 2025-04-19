import React, { useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";

interface RoomType {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
}

const PostRoomPage = () => {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();

  const roomTypes: RoomType[] = [
    {
      icon: "../../assets/images/nhatro.png",
      title: "Nhà trọ, phòng trọ",
      description:
        "Cho thuê nhà trọ, phòng trọ sạch sẽ, an ninh, giá hợp lý, phù hợp cho sinh viên và người đi làm.",
      link: "/post-room/nha-tro-phong-tro",
    },
    {
      icon: "../../assets/images/nhanguyencan.png",
      title: "Nhà nguyên căn",
      description:
        "Cho thuê nhà nguyên căn rộng rãi, sạch sẽ, an ninh đảm bảo, lý tưởng cho người thuê dài hạn.",
      link: "/post-room",
    },
    {
      icon: "../../assets/images/canho.png",
      title: "Căn hộ",
      description:
        "Cho thuê căn hộ tiện nghi, hiện đại, an ninh tốt, sạch sẽ, phù hợp cho gia đình hoặc người thuê dài hạn.",
      link: "/post-room",
    },
  ];

  const sidebarItems: SidebarItem[] = [
    { icon: "📊", label: "Thông tin chung", path: "/profile" },
    { icon: "📋", label: "Quản lý tin", path: "/manage-posts" },
    { icon: "💬", label: "Quản lý đánh giá", path: "/manage-reviews" },
    { icon: "⏳", label: "Lịch sử", path: "/history" },
    { icon: "💵", label: "Bảng phí đăng tin", path: "/pricing" },
  ];

  const handleSidebarClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="main-content d-flex">
      {/* Sidebar */}
      <div
        className="sidebar p-3"
        style={{
          width: "800px", // Đặt kích thước giống RoomPostForm
          backgroundColor: "#fff",
          borderRight: "1px solid #eee",
          borderRadius: "10px",
        }}
      >
        <div className="text-center mb-3">
          <img
            src="../../assets/images/anhmau.jpg"
            alt="Avatar"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <h5 className="mt-2 mb-1">{profile?.fullName || "Ngô Văn Toàn"}</h5>
          <p className="text-muted" style={{ fontSize: 14 }}>
            ID: #{profile?.id || "29721"}
          </p>
        </div>

        <div className="mb-3 px-2">
          <div className="d-flex justify-content-between">
            <span>TK chính:</span>
            <span className="text-danger fw-bold">0 đ</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>TK khuyến mãi:</span>
            <span className="text-danger fw-bold">0 đ</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Số lượng tin:</span>
            <span className="text-danger fw-bold">0/1 Tin</span>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3 px-2">
          <Button variant="outline-primary" className="flex-fill">
            Mua số lượng tin đăng
          </Button>
          <Button variant="primary" className="flex-fill">
            Nạp tiền
          </Button>
        </div>

        <div className="sidebar-menu">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center py-2 px-3 mb-1"
              style={{
                borderRadius: 8,
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
              }}
              onClick={() => handleSidebarClick(item.path)}
            >
              <span>
                <span style={{ marginRight: 8 }}>{item.icon}</span>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="content p-4 flex-grow-1">
        <h2 className="text-center mb-4">CHỌN LOẠI HÌNH</h2>
        <Row className="justify-content-center">
          {roomTypes.map((room, index) => (
            <Col key={index} md={4} className="mb-4">
              <div className="room-type text-center p-3 h-100 border rounded shadow-sm">
                <img
                  src={room.icon}
                  alt={room.title}
                  style={{ width: "50px", height: "50px", margin: "0 auto" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/50";
                  }}
                />
                <h5 className="mt-3">{room.title}</h5>
                <p className="text-muted" style={ {fontSize:15}}>{room.description}</p>
                <Link to={room.link} onClick={() => console.log("Navigating to:", room.link)} style={{ textDecoration: "none",justifyContent: "space-between", }}>
                  <Button variant="primary" >Đăng ngay</Button>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PostRoomPage;