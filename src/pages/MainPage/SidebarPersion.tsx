import React from 'react';
import { Container, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { AppContext } from '../../contexts/app.context';
import { FaUser, FaIdCard, FaHeart, FaBell } from 'react-icons/fa';

const PersonalInfoPage = () => {
    return(
    <Container fluid className="p-0">
        <Col className="bg-light p-2 shadow-sm vh-100">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/personal-info" className="d-flex align-items-center py-2 text-dark fw-medium">
              <FaUser className="text-primary me-2" /> Thông tin cá nhân
            </Nav.Link>
            <Nav.Link as={Link} to="/account-info" className="d-flex align-items-center py-2 text-dark fw-medium">
              <FaIdCard className="text-primary me-2" /> Thông tin tài khoản
            </Nav.Link>
            <Nav.Link as="a" href="/favorites" className="d-flex align-items-center py-2 text-dark fw-medium">
              <FaHeart className="text-primary me-2" /> Trọ đã lưu
            </Nav.Link>
            <Nav.Link as="a" href="/notifications" className="d-flex align-items-center py-2 text-dark fw-medium">
              <FaBell className="text-primary me-2" /> Thông báo
            </Nav.Link>
            <Nav.Link as="a" href="/reviews" className="d-flex align-items-center py-2 text-dark fw-medium">
              <FaBell className="text-primary me-2" /> Quản lý đánh giá trọ
            </Nav.Link>
          </Nav>
        </Col>
    </Container>

 );
};
export default PersonalInfoPage;