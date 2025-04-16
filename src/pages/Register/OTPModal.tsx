import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

type OTPModalProps = {
  show: boolean
  handleClose: () => void
  credential: string
}

const OTPModal: React.FC<OTPModalProps> = ({ show, handleClose, credential }) => {
const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const verifyOtpMutation = useMutation({
    mutationFn: (body: { credential: string; otp: string }) =>
      authApi.verifyOtp(body),
    onSuccess: () => {
      toast.success('Xác minh OTP thành công!')
      handleClose()
        navigate('/')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xác minh thất bại')
    }
  })

  const handleVerify = () => {
    if (!otp.trim()) {
      toast.error('Vui lòng nhập mã OTP')
      return
    }

    setIsLoading(true)
    verifyOtpMutation.mutate(
      { credential, otp },
      {
        onSettled: () => setIsLoading(false)
      }
    )
  }

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
  )
}

export default OTPModal
