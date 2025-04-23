import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaArrowUp,
  FaMapLocation,
} from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-light text-dark mt-5 pt-5 border-top position-relative">
      <div className="container">
        <div className="row gy-4">
          {/* Cột 1: Logo + App */}
          <div className="col-md-3 text-center text-md-start">
            <img
              src="https://i.postimg.cc/jd8xtGKZ/tr-mi.jpg"
              alt="Trọ Mới"
              className="mb-2"
              style={{ height: 100, width: 120 }}
            />
            <p>
              Thành viên của{" "}
              <a href="https://aaa.vn" className="text-primary">
                ohi.vn
              </a>
            </p>
            
            <p className="fw-bold text-primary mt-3 mb-1">
              TẢI APP TRỌ MỚI HOST NGAY
            </p>
          </div>

          {/* Cột 2: Thông tin */}
          <div className="col-md-3">
            <h6 className="text-primary fw-bold">THÔNG TIN</h6>
            <ul className="list-unstyled">
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Điều khoản & Cam kết
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Quy chế hoạt động
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Giải quyết khiếu nại
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Chính sách bảo mật
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hệ thống */}
          <div className="col-md-3">
            <h6 className="text-primary fw-bold">HỆ THỐNG</h6>
            <ul className="list-unstyled">
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Hệ thống phòng trọ
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Bảng phí
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Gói hội viên
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Hướng dẫn
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Thanh toán VNPAY
                </button>
              </li>
              <li>
                <button className="btn btn-link text-decoration-none text-dark p-0">
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="col-md-3">
            <h6 className="text-primary fw-bold">KẾT NỐI VỚI CHÚNG TÔI</h6>
            <ul className="list-unstyled">
              <li>
                <FaPhone /> 033.266.1579 - 035.866.1579
              </li>
              <li>
                <SiZalo /> 0332661579
              </li>
              <li>
                <FaEnvelope /> info@tromoi.com
              </li>
              <li>
                <FaFacebook /> tromoitoanquoc - tromoihue
              </li>
              <li>
                <FaTiktok /> tromoi.com - @tromoi.hcm
              </li>
              <li>
                <FaYoutube /> @tromoi
              </li>
              <li>
                <FaMapLocation /> VP HCM: 19 Đường Số 23, Q6, TP HCM
              </li>
              <li>
                <FaMapLocation /> VP HCM: 19 Đường Số 23, Q6, TP HCM
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="text-center border-top pt-3 mt-4 d-flex justify-content-center align-items-center"
          style={{
            fontSize: 15,
            backgroundColor: "blue", 
            color: "white", 
            height: "60px", 
          }}
        >
          <h4>&copy; 2025 Tromoi. All rights reserved.</h4>
        </div>
      </div>

      {/* Nút cuộn lên đầu trang */}
      <button
        className="btn btn-light shadow rounded-circle position-fixed bottom-0 end-0 m-4"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
