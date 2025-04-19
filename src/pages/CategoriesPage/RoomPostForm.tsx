import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import { Form, Button, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RoomPostForm = () => {
  const { profile } = useContext(AppContext);
  const [currentTab, setCurrentTab] = useState("general");
  const navigate = useNavigate();

  // State cho các dropdown và địa chỉ chi tiết
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");

  // State cho thông tin liên hệ
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Dữ liệu mẫu cho dropdown (có thể thay bằng API)
  const provinces = ["Chọn Tỉnh/TP...", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"];
  const districts = ["Quận/Huyện...", "Quận 1", "Quận 7", "Quận Ba Đình"];
  const wards = [
    "Phường/Xã...",
    "Phường Bến Nghé",
    "Phường Tân Phú",
    "Phường Cống Vị",
  ];
  const streets = [
    "Đường phố...",
    "Đường Lê Lợi",
    "Đường Nguyễn Huệ",
    "Đường Điện Biên Phủ",
  ];

  // Xử lý kéo thả hoặc chọn file (chỉ để minh họa, cần thêm logic thực tế)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Xử lý file ở đây (ví dụ: upload lên server)
      console.log("Files selected:", files);
    }
  };

  return (
    <div className="main-content d-flex">
      {/* Sidebar */}
      <div
        className="sidebar p-3"
        style={{
          width: "330px",
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
          {[
            { icon: "📊", label: "Thông tin chung", path: "/profile" },
            { icon: "📋", label: "Quản lý tin", path: "/manage-posts" },
            { icon: "💬", label: "Quản lý đánh giá", path: "/manage-reviews" },
            { icon: "⏳", label: "Lịch sử", path: "/history" },
            { icon: "💵", label: "Bảng phí đăng tin", path: "/pricing" },
          ].map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center py-2 px-3 mb-1"
              style={{
                borderRadius: 8,
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
              }}
              onClick={() => navigate(item.path)}
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
        <Tabs
          activeKey={currentTab}
          onSelect={(k) => setCurrentTab(k || "")}
          className="mb-4"
        >
          <Tab eventKey="general" title="Thông tin chung"></Tab>
        </Tabs>

        <h4 className="mb-3" style={{ color: "blue" }}>
          THÔNG TIN CHUNG
        </h4>
        <h5>Tên nhà trọ, phòng trọ</h5>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="Nhập tên nhà trọ" />
        </Form.Group>

        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Trọ tự quản</h5>
                <Form.Select>
                  <option>Lựa chọn</option>
                  <option value="1">Có</option>
                  <option value="0">Không</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <h5>Diện tích</h5>
                <div className="d-flex align-items-center">
                  <Form.Control type="text" placeholder="Diện tích" />
                  <Button variant="outline-primary" className="ms-2">
                    m²
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <h5>Giá cho thuê</h5>
                <Form.Control type="text" placeholder="Giá cho thuê" />
                <div className="mt-2 d-flex gap-2 flex-wrap">
                  {[100000, 1000000, 10000000, 100000000].map((price) => (
                    <Button key={price} variant="outline-primary">
                      {price.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <div className="mt-2">
                  <span>Tổng trị giá: </span>
                  <span className="fw-bold">0 đ</span>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <h5>Tổng số phòng</h5>
                <Form.Control type="text" placeholder="Tổng số phòng" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <h5>Nội dung mô tả</h5>
            <Form.Control as="textarea" rows={3} placeholder="Nội dung mô tả" />
          </Form.Group>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              ĐỐI TƯỢNG NHÀ TRỌ
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              <Form.Check inline label="Đi học" type="checkbox" />
              <Form.Check inline label="Đi làm" type="checkbox" />
              <Form.Check inline label="Gia đình" type="checkbox" />
              <Form.Check inline label="Cặp đôi" type="checkbox" />
            </div>
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              TIỆN NGHI NHÀ TRỌ
            </h5>
            <Row>
              <Col md={3}>
                <Form.Check label="Wifi" type="checkbox" />
                <Form.Check label="Bình nóng lạnh" type="checkbox" />
                <Form.Check label="Bãi để xe riêng" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Kệ bếp" type="checkbox" />
                <Form.Check label="Vệ sinh trong" type="checkbox" />
                <Form.Check label="Camera an ninh" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Máy giặt" type="checkbox" />
                <Form.Check label="Phòng tắm" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Thang máy" type="checkbox" />
                <Form.Check label="Tủ quần áo" type="checkbox" />
              </Col>
            </Row>
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              MÔI TRƯỜNG XUNG QUANH
            </h5>
            <Row>
              <Col md={3}>
                <Form.Check label="Chợ" type="checkbox" />
                <Form.Check label="Công viên" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Siêu thị" type="checkbox" />
                <Form.Check label="Bến xe Bus" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Bệnh viện" type="checkbox" />
                <Form.Check label="Trung tâm thể thao" type="checkbox" />
              </Col>
              <Col md={3}>
                <Form.Check label="Trường học" type="checkbox" />
              </Col>
            </Row>
          </div>

          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              ĐỊA ĐIỂM
            </h5>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tỉnh/TP</Form.Label>
                  <Form.Select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    {provinces.map((prov, index) => (
                      <option key={index} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Quận/Huyện</Form.Label>
                  <Form.Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {districts.map((dist, index) => (
                      <option key={index} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Phường/Xã</Form.Label>
                  <Form.Select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  >
                    {wards.map((w, index) => (
                      <option key={index} value={w}>
                        {w}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Đường phố</Form.Label>
                  <Form.Select
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  >
                    {streets.map((str, index) => (
                      <option key={index} value={str}>
                        {str}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Địa chỉ"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
              />
            </Form.Group>
          </div>

          {/* Thêm phần HÌNH ẢNH TỔNG QUAN */}
          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              HÌNH ẢNH TỔNG QUAN
            </h5>
            <div
              style={{
                border: "2px dashed #007bff",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
              }}
            >
              <div>
                <i
                  className="bi bi-cloud-upload"
                  style={{ fontSize: "24px", color: "#007bff" }}
                ></i>
                <p style={{ color: "#007bff", margin: "10px 0" }}>
                  KÉO THẢ HÌNH ẢNH (Hoặc chọn hình ảnh)
                </p>
              </div>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload"
              />
              <Form.Label
                htmlFor="file-upload"
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                }}
              >
                Hướng dẫn đăng ảnh
              </Form.Label>
            </div>
          </div>

          {/* Thêm phần THÔNG TIN LIÊN HỆ */}
          <div className="mb-3">
            <h5 className="mb-3" style={{ color: "blue" }}>
              THÔNG TIN LIÊN HỆ
            </h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Họ tên"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ của bạn"
                    value={detailedAddress} // Có thể tái sử dụng địa chỉ từ phần ĐỊA ĐIỂM
                    onChange={(e) => setDetailedAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary">Lưu</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RoomPostForm;
