import React, { use, useContext, useEffect, useState } from "react"; 
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";
import PurchasePostModal from "../RoomPostPage/PurchaseSlot"; 
import "../../assets/styles/Sidebar.css"; 
import { number } from "yup";
import paymentAPI from "../../apis/payment.api";
import { toast } from "react-toastify";
import userApi from "../../apis/user.api";

const Sidebar = () => {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false); // Trạng thái hiển thị modal
  const [total, setTotal] = useState<number>(0);


  useEffect(() => {
    const userId = profile?.id;
    if (userId) {
    const getTotal = async () => {
      try{
        const response  = await paymentAPI.getWallet(userId);
        await userApi.getProfile();
        setTotal(response.data.data.balance);
      }catch (error) {
        toast.error("Lỗi khi lấy thông tin ví");
      }
    }
    getTotal()}
  })

  const sidebarItems = [
    { icon: "📊", label: "Thông tin chung", path: "/profile" },
    { icon: "📋", label: "Quản lý tin", path: "/manage-posts" },
    { icon: "💬", label: "Quản lý đánh giá", path: "/manage-reviews" },
    { icon: "⏳", label: "Lịch sử", path: "/history" },
  ];

  const handleSidebarClick = (path: string) => {
    navigate(path);
  };

  const handleDepositClick = () => {
    navigate("/deposit");
  };

  const handlePurchasePostClick = () => {
    setShowPurchaseModal(true); // Hiển thị modal
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  

  return (
    <div className="sidebar p-3">
      <div className="text-center mb-3">
        <img
          src="https://i.postimg.cc/L60YJ5L1/hinh-nen-buon-danbo.jpg"
          alt="Avatar"
          style={{ width: 60, height: 60, borderRadius: "50%" }}
        />
        <h5 className="mt-2 mb-1">{profile?.fullName || "Null"}</h5>
        <p className="text-muted" style={{ fontSize: 14 }}>
          ID: #{profile?.id || "29721"}
        </p>
      </div>

      <div className="mb-3 px-2">
        <div className="d-flex justify-content-between">
          <span>TK chính:</span>
          <span className="text-danger fw-bold">{formatVND(total)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>TK khuyến mãi:</span>
          <span className="text-danger fw-bold">0 đ</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Số lượng tin:</span>
          <span className="text-danger fw-bold">{profile?.numberOfPosts}</span>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 px-2">
        <Button
          variant="outline-primary"
          className="flex-fill"
          onClick={handlePurchasePostClick} // Thêm sự kiện onClick
        >
          Mua số lượng tin đăng
        </Button>
        <Button
          variant="primary"
          className="flex-fill"
          onClick={handleDepositClick}
        >
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

      {/* Modal mua số lượng tin đăng */}
      <PurchasePostModal
        total={total}
        show={showPurchaseModal}
        onHide={() => setShowPurchaseModal(false)}
      />
    </div>
  );
};

export default Sidebar;