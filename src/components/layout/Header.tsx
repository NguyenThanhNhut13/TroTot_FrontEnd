import React, { useState, useEffect, useContext } from 'react'
import { Navbar, Nav, Button, Container, Dropdown, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from '../../pages/Login/LoginModal'
import RegisterModal from '../../pages/Register/RegisterModal'
import authApi from '../../apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { AppContext } from '../../contexts/app.context'
import { FaBell, FaHeart } from 'react-icons/fa'

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()

  const { setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setProfile(null)
      navigate('/')
    }
  })

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      logoutMutation.mutate({ refreshToken })
    }
    window.location.reload()
  }

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="me-4">
            <img 
              src="https://tromoi.com/logo_mobile.png" 
              alt="TroMoi" 
              height="40" 
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/category/nha-tro-phong-tro" className="fw-medium mx-2">
                Nhà Trọ, Phòng Trọ
              </Nav.Link>
              <Nav.Link as={Link} to="/category/nha-nguyen-can" className="fw-medium mx-2">
                Nhà Nguyên Căn
              </Nav.Link>
              <Nav.Link as={Link} to="/category/can-ho-chung-cu" className="fw-medium mx-2">
                Căn Hộ
              </Nav.Link>
              <Nav.Link as={Link} to="/category/video-review" className="fw-medium mx-2">
                Video Review
              </Nav.Link>
              <Nav.Link as={Link} to="/category/blog" className="fw-medium mx-2">
                Blog
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center">
              <Nav.Link className="position-relative me-3">
                <FaBell size={20} />
                <Badge bg="danger" pill className="position-absolute top-0 start-75 translate-middle">
                  0
                </Badge>
              </Nav.Link>
              
              <Nav.Link className="me-3">
                <FaHeart size={20} />
              </Nav.Link>

              {profile?.fullName ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0">
                    <img 
                      src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" 
                      alt="User" 
                      width="30" 
                      height="30" 
                      className="rounded-circle me-2" 
                    />
                    <span>{profile.fullName}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">Tài khoản</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button
                    variant="link"
                    className="text-dark text-decoration-none"
                    onClick={() => setShowLogin(true)}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="link"
                    className="text-dark text-decoration-none"
                    onClick={() => setShowRegister(true)}
                  >
                    Đăng ký
                  </Button>
                </>
              )}

              <Button
                variant="primary"
                className="ms-3"
                onClick={() => navigate('/post-room')}
                style={{ backgroundColor: "#00B4F1", borderColor: "#00B4F1" }}
              >
                <i className="fa fa-paper-plane me-1"></i> Đăng tin ngay
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
    </>
  )
}

export default Header
