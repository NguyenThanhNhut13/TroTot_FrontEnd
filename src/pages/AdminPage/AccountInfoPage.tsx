import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Sidebar from "../MainPage/SidebarPersion";

// Type for Form.Control elements in React-Bootstrap
type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

const AccountInfoPage = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "ngovantoan0986@gmail.com",
    password: "********",
    accountStatus: true,
  });

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, accountStatus: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thông tin tài khoản đã được cập nhật!");
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={3} className="p-0 min-vh-100">
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={9} className="py-4 px-5">
          <h2 className="text-primary fw-bold mb-2">THÔNG TIN TÀI KHOẢN</h2>
          <p className="text-muted mb-4">
            Quản lý và cập nhật thông tin tài khoản trên Trọ Mới
          </p>

          <div className="bg-white p-4 rounded shadow-sm mb-5">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4 row align-items-center">
                <Form.Label column sm={3} className="ps-3">
                  Số điện thoại
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Nhập số điện thoại của bạn"
                    onChange={handleInputChange}
                    className="rounded"
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="rounded w-100"
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Form.Group>
            </Form>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4 row align-items-center">
                <Form.Label column sm={3} className="ps-3">
                  Email
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="rounded w-100"
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Form.Group>
            </Form>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4 row align-items-center">
                <Form.Label column sm={3} className="ps-3">
                  Mật khẩu
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    readOnly
                    className="rounded"
                  />
                </Col>
                <Col sm={2}>
                  <Button variant="outline-primary" className="rounded w-100">
                    Đổi mật khẩu
                  </Button>
                </Col>
              </Form.Group>
            </Form>

            <Form.Group className="row align-items-center">
              <Form.Label column sm={3} className="ps-3">
                Trạng thái tài khoản
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  id="account-status"
                  label="Tài khoản đã xác thực"
                  checked={formData.accountStatus}
                  onChange={handleCheckboxChange}
                  disabled
                />
              </Col>
            </Form.Group>
          </div>

          {/* Add space at the bottom */}
          <div style={{ height: "200px" }}></div>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfoPage;
