import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../auth/LoginModal" // Import popup đăng nhập

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          {/* Logo bên trái */}
          <Navbar.Brand as={Link} to="/">TROMOI</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Danh mục căn trái */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/category/nha-tro-phong-tro">
                Nhà trọ, phòng trọ
              </Nav.Link>
              <Nav.Link as={Link} to="/category/nha-nguyen-can">
                Nhà nguyên căn
              </Nav.Link>
              <Nav.Link as={Link} to="/category/can-ho-chung-cu">
                Căn hộ chung cư
              </Nav.Link>
              <Nav.Link as={Link} to="/category/video-review">
                Video Review
              </Nav.Link>
              <Nav.Link as={Link} to="/category/blog">Blog</Nav.Link>
            </Nav>

            {/* Nút chức năng bên phải */}
            <Nav>
              <Button variant="link" className="text-white" onClick={() => setShowLogin(true)}>
                Đăng nhập
              </Button>
              <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              <Button 
                variant="warning" 
                className="ms-3" 
                onClick={() => navigate("/post-room")}
              >
                Đăng trọ ngay
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Popup đăng nhập */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
