import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import omit from "lodash/omit";

import { schema, Schema } from "../../utils/rules";
import { ErrorResponse } from "../../types/utils.type";
import authApi from "../../apis/auth.api";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";

type RegisterModalProps = {
  show: boolean;
  handleClose: () => void;
};

/// Define the form data type based on the schema

type FormData = Pick<
  Schema,
  "credential" | "fullname" | "password" | "confirmPassword"
>;
const registerSchema = schema.pick(["credential", "fullname", "password", "confirmPassword"]);

const RegisterModal: React.FC<RegisterModalProps> = ({ show, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: FormData) =>
      authApi.registerAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    registerAccountMutation.mutate(data, {
      onSuccess: () => {
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
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
            <Form.Label>Email hoặc SĐT</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập vào Email hoặc Số điện thoại"
              {...register("credential")}
              isInvalid={!!errors.credential}
            />
            <Form.Control.Feedback type="invalid">
              {errors.credential?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ tên"
              {...register("fullname")}
              isInvalid={!!errors.fullname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullname?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register("confirmPassword")}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <a href="#" className="text-primary">
            Điều khoản & Cam kết
          </a>{" "}
          và{" "}
          <a href="#" className="text-primary">
            Chính sách bảo mật
          </a>{" "}
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
  );
};

export default RegisterModal;
