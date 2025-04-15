import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from '../../pages/Login/LoginModal'
import RegisterModal from '../../pages/Register/RegisterModal'

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [userProfile, setUserProfile] = useState<{ displayName: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const profileStr = localStorage.getItem('profile')
    if (profileStr) {
      try {
        const parsedProfile = JSON.parse(profileStr)
        setUserProfile(parsedProfile)
      } catch (error) {
        console.error('Lỗi khi parse localStorage.profile:', error)
      }
    }
  }, [showLogin]) // Mỗi khi modal login đóng, check lại localStorage

  const handleLogout = () => {
    localStorage.removeItem('profile')
    localStorage.removeItem('authToken')
    setUserProfile(null)
    navigate('/')
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
              {userProfile ? (
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="text-white">
                    {userProfile.displayName}
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
