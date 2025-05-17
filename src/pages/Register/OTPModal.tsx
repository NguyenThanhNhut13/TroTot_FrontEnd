"use client";

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import authApi from '../../apis/auth.api';
import { toast } from 'react-toastify';

type OTPModalProps = {
  show: boolean;
  handleClose: () => void;
  credential: string;
  onVerifySuccess?: (token: string) => void; // Callback để báo thành công và trả token
};

const OTPModal: React.FC<OTPModalProps> = ({ show, handleClose, credential, onVerifySuccess }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const verifyOtpMutation = useMutation({
    mutationFn: (body: { type: string; credential: string; otp: string }) =>
      authApi.forgotPasswordVerifyOtp(body), // Dùng API forgotPasswordVerifyOtp thay vì verifyOtp
    onSuccess: (response) => {
      toast.success('Xác minh OTP thành công!');
      if (onVerifySuccess) {
        onVerifySuccess(response.data.data);  
      }
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xác minh thất bại');
    },
  });

  const handleVerify = () => {
    if (!otp.trim()) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoading(true);
    verifyOtpMutation.mutate(
      { type: "email_or_phone", credential, otp },
      {
        onSettled: () => setIsLoading(false),
      }
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác thực OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Nhập mã OTP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập mã OTP đã gửi"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleVerify} disabled={isLoading}>
          {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;