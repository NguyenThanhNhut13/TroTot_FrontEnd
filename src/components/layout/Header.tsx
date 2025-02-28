import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          TROMOI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
            <Nav.Link as={Link} to="/category/blog">
              Blog
            </Nav.Link>
            <Nav.Link as={Link} to="/category/sign-in">
              Đăng nhập
            </Nav.Link>
            <Nav.Link as={Link} to="/category/sign-up">
              Đăng ký
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
