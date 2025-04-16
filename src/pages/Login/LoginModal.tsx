"use client";

import React, { useState, useContext } from "react";
import { Modal, Button as BsButton, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import authApi from "../../apis/auth.api";
import { loginSchema, LoginSchema } from "../../utils/rules";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.type";
import { AppContext } from "../../contexts/app.context";

type FormData = Pick<LoginSchema, "credential" | "password">;
const loginSchemaPick = loginSchema.pick(["credential", "password"]);

interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, handleClose }) => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchemaPick),
  });

  const loginMutation = useMutation({
  mutationFn: (body: FormData) => authApi.login(body),
});


  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const requestBody = {
      credential: data.credential,
  password: data.password,
    };

    loginMutation.mutate(requestBody, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        handleClose();
        window.location.reload();
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: "Server",
              });
            });
          }
        }
      },
    });
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chào mừng bạn đến với Trọ Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email hoặc Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              {...register("credential")}
              isInvalid={!!errors.credential}
              placeholder="Nhập email hoặc số điện thoại"
            />
            <Form.Control.Feedback type="invalid">
              {errors.credential?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              placeholder="Nhập mật khẩu"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-end">
            <a href="#" className="text-primary">
              Quên mật khẩu?
            </a>
          </div>

          <BsButton
            variant="danger"
            id="btn-login"
            className="w-100 mt-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </BsButton>
        </Form>

        <div className="text-center mt-3">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-primary">
            Đăng ký ngay
          </a>
        </div>
        <div className="text-center mt-3">Hoặc đăng ký bằng</div>
        <div className="d-flex justify-content-center mt-2">
          <BsButton variant="light" className="me-2" onClick={() => {}}>
            <i className="fab fa-google text-danger"></i> G
          </BsButton>
          <BsButton variant="light">
            <i className="fab fa-facebook text-primary"></i> F
          </BsButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
