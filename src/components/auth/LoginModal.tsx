import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chào mừng bạn đến với Trọ Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email hoặc Số điện thoại</Form.Label>
            <Form.Control type="text" placeholder="Nhập email hoặc số điện thoại" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" placeholder="Nhập mật khẩu" />
          </Form.Group>
          <div className="text-end">
            <a href="#" className="text-primary">Quên mật khẩu?</a>
          </div>
          <Button variant="danger" className="w-100 mt-3">Đăng nhập</Button>
        </Form>
        <div className="text-center mt-3">
          Chưa có tài khoản? <a href="#" className="text-primary">Đăng ký ngay</a>
        </div>
        <div className="text-center mt-3">Hoặc đăng ký bằng</div>
                <div className="d-flex justify-content-center mt-2">
                  <Button variant="light" className="me-2">
                    <i className="fab fa-google text-danger"></i> G
                  </Button>
                  <Button variant="light">
                    <i className="fab fa-facebook text-primary"></i> F
                  </Button>
                </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
