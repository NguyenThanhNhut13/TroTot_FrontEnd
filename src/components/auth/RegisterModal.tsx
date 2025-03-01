import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface RegisterModalProps {
  show: boolean;
  handleClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký tài khoản mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Họ và Tên</Form.Label>
            <Form.Control type="text" placeholder="Nhập vào Họ và Tên" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email / Số điện thoại</Form.Label>
            <Form.Control type="text" placeholder="Nhập vào Email hoặc Số điện thoại" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" placeholder="Nhập vào mật khẩu" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control type="password" placeholder="Nhập vào mật khẩu" />
          </Form.Group>
          <Button variant="primary" className="w-100">Đăng ký</Button>
        </Form>
        <div className="text-center mt-3">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <a href="#" className="text-primary">Điều khoản & Cam kết</a> của Trọ Mới và xác nhận rằng bạn đã đọc{" "}
          <a href="#" className="text-primary">Chính sách bảo mật</a> của chúng tôi.
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

export default RegisterModal;
