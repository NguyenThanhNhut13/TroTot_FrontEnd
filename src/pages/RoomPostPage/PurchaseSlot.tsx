import React, { useContext, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "../../contexts/app.context";
import { toast } from "react-toastify";
import paymentAPI from "../../apis/payment.api";

interface PurchasePostModalProps {
  show: boolean;
  onHide: () => void;
  total?: number;
}

const PurchasePostModal: React.FC<PurchasePostModalProps> = ({
  total,
  show,
  onHide,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(1);
  const { profile } = useContext(AppContext);

  const packages = [
    { name: "Thêm 1 Trọ", price: 20000, discount: 0, amount: 1 },
    { name: "Thêm 5 Trọ", price: 90000, discount: 10000, amount: 5 },
    { name: "Thêm 10 Trọ", price: 170000, discount: 30000, amount: 10 },
  ];

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleSelectPackage = (packageAmount: number) => {
    setSelectedPackage(packageAmount);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Vui lòng chọn gói đăng tin trước khi thanh toán!");
      return;
    }

    // Gọi API thanh toán ở đây
    const response = await paymentAPI.purchaseSlot({ amount: selectedPackage });
    if (response.data.data.success) {
      toast.success("Mua gói thành công!");
    } else {
      toast.error("Mua gói thất bại!");
    }
    onHide(); // Đóng modal
  };

  const totalAmount = selectedPackage
    ? packages.find((p) => p.amount === selectedPackage)?.price || 0
    : 0;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="modal-dialog-centered"
      size="lg"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title
          className="w-100 text-center fw-bold fs-4"
          style={{ color: "#0056b3" }}
        >
          BẢNG GIÁ MUA SỐ LƯỢNG ĐĂNG TIN
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <Row className="g-4 mb-4 justify-content-center">
          {packages.map((pkg) => (
            <Col key={pkg.name} md={4} className="px-3">
              <div
                className="position-relative h-100"
                style={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    selectedPackage === pkg.amount
                      ? "0 0 0 3px #0d6efd, 0 5px 15px rgba(0,0,0,0.1)"
                      : "0 5px 15px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  transform:
                    selectedPackage === pkg.amount
                      ? "translateY(-5px)"
                      : "none",
                }}
                onClick={() => handleSelectPackage(pkg.amount)}
              >
                <div
                  style={{
                    backgroundColor:
                      selectedPackage === pkg.amount ? "#0d6efd" : "#f8f9fa",
                    borderBottom: "1px solid #eaeaea",
                    padding: "15px 10px",
                    textAlign: "center",
                  }}
                >
                  <h5
                    className="mb-0 fw-bold"
                    style={{
                      color:
                        selectedPackage === pkg.amount ? "#fff" : "#0d6efd",
                    }}
                  >
                    {pkg.name}
                  </h5>
                </div>

                <div className="p-4 text-center bg-white">
                  <h3 className="fw-bold mb-1" style={{ color: "#ff5a00" }}>
                    {pkg.price.toLocaleString()} đ
                  </h3>

                  {pkg.discount > 0 && (
                    <div
                      className="mt-2 py-1 px-2 d-inline-block"
                      style={{
                        backgroundColor: "#e8f7ee",
                        color: "#28a745",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                      }}
                    >
                      Tiết kiệm {pkg.discount.toLocaleString()} đ
                    </div>
                  )}
                </div>

                {selectedPackage === pkg.amount && (
                  <div
                    className="position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span style={{ color: "#0d6efd", fontSize: "14px" }}>
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        <div
          className="p-3 rounded mb-3"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #eaeaea",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              TK chính: <span className="fw-bold">{formatVND(total || 0)}</span>
            </p>
            <p className="mb-0">
              Số tiền thanh toán:{" "}
              <span
                className="fw-bold"
                style={{ color: "#ff5a00", fontSize: "1.1rem" }}
              >
                {totalAmount.toLocaleString()} đ
              </span>
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4 pt-0">
        <Button
          variant="outline-secondary"
          onClick={onHide}
          className="px-4 py-2"
          style={{ borderRadius: "6px", fontWeight: "500" }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="primary"
          onClick={handlePurchase}
          className="px-4 py-2 ms-3"
          style={{
            borderRadius: "6px",
            fontWeight: "500",
            backgroundColor: "#0d6efd",
            border: "none",
          }}
          disabled={!selectedPackage}
        >
          Mua gói
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchasePostModal;
