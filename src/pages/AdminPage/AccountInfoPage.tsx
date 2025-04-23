import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { AppContext } from '../../contexts/app.context';
// import { useNavigate } from 'react-router-dom';
// import authApi from '../../apis/auth.api';
// import { useMutation } from '@tanstack/react-query';
import Sidebar from '../MainPage/SidebarPersion';

// Type for Form.Control elements in React-Bootstrap
type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

const AccountInfoPage = () => {
//   const { profile, setIsAuthenticated, setProfile } = useContext(AppContext);
//   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: 'Nhập số điện thoại của bạn.', // Placeholder as per screenshot
    email: 'ngovantoan0986@gmail.com', // Sample email from screenshot
    password: '********', // Placeholder for password
    accountStatus: true, // Checkbox for account status
  });


  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, accountStatus: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, field: string) => {
    e.preventDefault();
    alert(`${field} đã được cập nhật!`);
  };

  const handleChangePassword = () => {
    // Logic for changing password can be added here
    alert('Chức năng đổi mật khẩu đang được phát triển!');
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={3} >
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={9} className="p-4 p-md-2">
          <h2 className="text-primary fw-bold mb-3" style={{ fontSize: '1.75rem' }}>
            THÔNG TIN TÀI KHOẢN
          </h2>
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Quản lý và cập nhật thông tin tài khoản trên Trọ Mới
          </p>

          <Form className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '600px' }}>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Col xs={12} md={3}>
                <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                  Số điện thoại
                </Form.Label>
              </Col>
              <Col xs={12} md={7}>
                <Form.Control
                  type="text"
                  name="phone"
                //  autoComplete="off"
                //   value={formData.phone}
                
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại của bạn."
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                />
              </Col>
              <Col xs={12} md={4} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={(e: any) => handleSubmit(e, 'Số điện thoại')}
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 2rem' }}
                >
                  Cập nhật
                </Button>
              </Col>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Col xs={12} md={3}>
                <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                  Email
                </Form.Label>
              </Col>
              <Col xs={12} md={7}>
                <Form.Control
                  type="email"
                  name="email"
                //   autoComplete="off"
                //   value={formData.email}
                placeholder="Nhập email của bạn."
                  onChange={handleInputChange}
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                />
              </Col>
              <Col xs={12} md={4} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={(e: any) => handleSubmit(e, 'Email')}
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 2rem' }}
                >
                  Cập nhật
                </Button>
              </Col>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Col xs={12} md={3}>
                <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                  Mật khẩu
                </Form.Label>
              </Col>
              <Col xs={12} md={7}>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                />
              </Col>
              <Col xs={12} md={4} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={handleChangePassword}
                  className="rounded"
                  style={{ fontSize: '0.9rem', padding: '0.7rem 1.1rem' }}
                >
                  Đổi mật khẩu
                </Button>
              </Col>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Col xs={12} md={3}>
                <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                  Trạng thái tài khoản
                </Form.Label>
              </Col>
              <Col xs={12} md={9}>
                <Form.Check
                  type="checkbox"
                  label="Tài khoản đã xác thực"
                  checked={formData.accountStatus}
                  onChange={handleCheckboxChange}
                  style={{ fontSize: '0.9rem' }}
                />
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfoPage;