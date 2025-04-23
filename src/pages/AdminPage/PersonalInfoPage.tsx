import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AppContext } from '../../contexts/app.context';
import Sidebar from '../MainPage/SidebarPersion';

// Define the shape of the form data
interface FormData {
  fullName: string;
  gender: string;
  dob: string;
  citizenId: string;
  address: string;
}

// Type for Form.Control elements in React-Bootstrap
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PersonalInfoPage = () => {
  const { profile } = useContext(AppContext);
//   const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: profile?.fullName || '',
    gender: '',
    dob: '',
    citizenId: '',
    address: '',
  });


  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to update personal information (e.g., API call) can be added here
    alert('Thông tin đã được cập nhật!');
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
          <h3 className="text-primary fw-bold mb-2" style={{ fontSize: '1.75rem' }}>
            THÔNG TIN CÁ NHÂN
          </h3>
          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            Cập nhật thông tin cá nhân của bạn để tìm kiếm các thông tin phù hợp nhất.
          </p>
          <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '600px' }}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                Họ tên
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Ngô Văn Toàn"
                className="rounded"
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                Giới tính
              </Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="rounded"
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                Ngày sinh
              </Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="rounded"
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium" style={{ fontSize: '0.9rem' }}>
                Địa chỉ
              </Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Nhập địa chỉ của bạn"
                value={formData.address}
                onChange={handleInputChange}
                className="rounded"
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="rounded px-4 py-2"
              style={{ fontSize: '0.9rem', backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              Cập nhật
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalInfoPage;