import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'

import { schema, Schema } from '../../utils/rules'
import { ErrorResponse } from '../../types/utils.type'
import authApi from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'

type RegisterModalProps = {
  show: boolean
  handleClose: () => void
}

/// Define the form data type based on the schema

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

const RegisterModal: React.FC<RegisterModalProps> = ({ show, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký tài khoản mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Email / Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập vào Email hoặc Số điện thoại"
              {...register('email')}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập vào mật khẩu"
              {...register('password')}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register('confirm_password')}
              isInvalid={!!errors.confirm_password}
            />
            <Form.Control.Feedback type="invalid">{errors.confirm_password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <a href="#" className="text-primary">
            Điều khoản & Cam kết
          </a>{' '}
          và{' '}
          <a href="#" className="text-primary">
            Chính sách bảo mật
          </a>{' '}
          của Trọ Mới.
        </div>

        <div className="text-center mt-3">Hoặc đăng ký bằng</div>
        <div className="d-flex justify-content-center mt-2">
          <Button variant="light" className="me-2" onClick={() => {}} disabled>
            <i className="fab fa-google text-danger"></i> G
          </Button>
          <Button variant="light" disabled>
            <i className="fab fa-facebook text-primary"></i> F
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RegisterModal
