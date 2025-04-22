import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/PurchasePostModal.css";

interface PurchasePostModalProps {
  show: boolean;
  onHide: () => void;
}

const PurchasePostModal: React.FC<PurchasePostModalProps> = ({
  show,
  onHide,
}) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    { name: "Thẻ 2Trọ", price: 20000, discount: 0 },
    { name: "Thẻ 5Trọ", price: 90000, discount: 10000 },
    { name: "Thẻ 10Trọ", price: 170000, discount: 30000 },
  ];

  const handleSelectPackage = (packageName: string) => {
    setSelectedPackage(packageName);
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert("Vui lòng chọn một gói!");
      return;
    }

    // Điều hướng đến trang nạp tiền với thông tin gói đã chọn
    navigate("/deposit", {
      state: {
        package: selectedPackage,
        amount: packages.find((p) => p.name === selectedPackage)?.price,
      },
    });
    onHide(); // Đóng modal
  };

  const totalAmount = selectedPackage
    ? packages.find((p) => p.name === selectedPackage)?.price || 0
    : 0;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>BẢNG GIÁ MUA SỐ LƯỢNG ĐĂNG TIN</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {packages.map((pkg) => (
            <Col key={pkg.name} xs={4}>
              <div
                className={`package-option ${
                  selectedPackage === pkg.name ? "selected" : ""
                }`}
                onClick={() => handleSelectPackage(pkg.name)}
              >
                <h6>{pkg.name}</h6>
                <h5>{pkg.price.toLocaleString()} đ</h5>
                {pkg.discount > 0 && (
                  <p>Tiết kiệm {pkg.discount.toLocaleString()} đ</p>
                )}
              </div>
            </Col>
          ))}
        </Row>
        <div className="mt-3 text-center">
          <p>Số dư TK chính: 0 đ</p>
          <h5>Số tiền thanh toán: {totalAmount.toLocaleString()} đ</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handlePurchase}>
          Mua gói
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchasePostModal;
