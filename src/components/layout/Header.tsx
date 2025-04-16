import React, { useState, useEffect, useContext } from 'react'
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from '../../pages/Login/LoginModal'
import RegisterModal from '../../pages/Register/RegisterModal'
import authApi from '../../apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { AppContext } from '../../contexts/app.context'
import { ref } from 'yup';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()

  const {setIsAuthenticated, setProfile, profile} = useContext(AppContext)
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
  
  // Khi gọi logout:
  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      logoutMutation.mutate({ refreshToken })
    }
  }
  

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
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
            </Nav>

            <Nav>
              {profile?.fullName ? (
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="text-white">
                    {profile.fullName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button
                    variant="link"
                    className="text-white"
                    onClick={() => setShowLogin(true)}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="link"
                    className="text-white"
                    onClick={() => setShowRegister(true)}
                  >
                    Đăng ký
                  </Button>
                </>
              )}

              <Button
                variant="warning"
                className="ms-3"
                onClick={() => navigate('/post-room')}
              >
                Đăng trọ ngay
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
