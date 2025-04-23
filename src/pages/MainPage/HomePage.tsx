import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  Card,
  Container,
} from "react-bootstrap";
import RoomList from "../../components/banner/RoomList";
import HotListings from "../ProductList/HotListings";
import ProvinceListings from "../../components/common/ProvinceListings ";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { FaDollarSign, FaMap, FaSearch, FaRulerCombined } from "react-icons/fa";

interface Location {
  id: number;
  name: string;
}

const HomePage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Chọn Tỉnh/TP...");
  const [selectedDistrict, setSelectedDistrict] = useState("Quận/Huyện...");
  const [selectedStreet, setSelectedStreet] = useState("Đường phố...");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả mức giá");
  const [selectedArea, setSelectedArea] = useState("Tất cả diện tích");
  const [selectedCategory, setSelectedCategory] = useState("tat-ca");

  const provinces = [
    { name: "Hồ Chí Minh", rooms: 4180 },
    { name: "Hà Nội", rooms: 1473 },
    { name: "Đà Nẵng", rooms: 821 },
    { name: "Cần Thơ", rooms: 165 },
    { name: "Bình Dương", rooms: 105 },
    { name: "Đồng Nai", rooms: 31 },
    { name: "Hải Phòng", rooms: 25 },
    { name: "Long An", rooms: 22 },
    { name: "Quảng Nam", rooms: 6 },
    { name: "Thừa Thiên Huế", rooms: 450 },
    { name: "Khánh Hòa", rooms: 30 },
    { name: "Bà Rịa - Vũng Tàu", rooms: 4 },
  ];

  useEffect(() => {
    const mockData = [
      { id: 1, name: "Hồ Chí Minh" },
      { id: 2, name: "Hà Nội" },
      { id: 3, name: "Đà Nẵng" },
    ];
    setLocations(mockData);
  }, []);

  return (
    <div>
      <div
        className="banner position-relative"
        style={{
          background: "linear-gradient(to right, #00052e, #010c3a, #1a237e)",
          backgroundImage:
            "url('https://tromoi.com/frontend/home/images/banner_default.jpg')",
          backgroundSize: "cover",
          padding: "50px 0 20px",
          overflow: "hidden",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="text-white">
              <h1
                className="fw-bold"
                style={{ fontSize: "3rem", lineHeight: 1.2 }}
              >
                TÌM NHANH, KIẾM DỄ
              </h1>
              <h1
                className="fw-bold mb-4"
                style={{ fontSize: "3rem", lineHeight: 1.2 }}
              >
                TRỌ MỚI TOÀN QUỐC
              </h1>
              <p className="mb-4" style={{ fontSize: "1.1rem" }}>
                Trang thông tin và cho thuê phòng trọ nhanh chóng, hiệu quả với
                <br />
                hơn 500 tin đăng mới và 30.000 lượt xem mỗi ngày
              </p>
            </Col>
          </Row>
          <div className="">
            <Row className="mb-0 ">
              <Col>
                <div className="d-flex bg-transparent">
                  <Button
                    variant="primary"
                    className="d-inline-block py-3  border-0 fw-bold"
                    onClick={() => setSelectedCategory("tat-ca")}
                    style={{
                      backgroundColor:
                        selectedCategory === "tat-ca" ? "#0046a8" : "#e5ecf6",
                      color:
                        selectedCategory === "tat-ca" ? "#ffffff" : "#0046a8",
                      padding: "0 60px",
                      borderRadius: "8px 8px 0 0",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant="light"
                    className="d-inline-block py-3 border-0 fw-bold"
                    onClick={() => setSelectedCategory("nha-tro-phong-tro")}
                    style={{
                      backgroundColor:
                        selectedCategory === "nha-tro-phong-tro"
                          ? "#0046a8"
                          : "#e5ecf6",
                      color:
                        selectedCategory === "nha-tro-phong-tro"
                          ? "#ffffff"
                          : "#0046a8",
                      marginLeft: "2px",
                      padding: "0 60px",
                      borderRadius: "8px 8px 0 0",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    Nhà trọ, phòng trọ
                  </Button>
                  <Button
                    variant="light"
                    className="d-inline-block py-3 border-0 fw-bold"
                    onClick={() => setSelectedCategory("nha-nguyen-can")}
                    style={{
                      backgroundColor:
                        selectedCategory === "nha-nguyen-can"
                          ? "#0046a8"
                          : "#e5ecf6",
                      color:
                        selectedCategory === "nha-nguyen-can"
                          ? "#ffffff"
                          : "#0046a8",
                      marginLeft: "2px",
                      padding: "0 60px",
                      borderRadius: "8px 8px 0 0",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    Nhà nguyên căn
                  </Button>
                  <Button
                    variant="light"
                    className="d-inline-block py-3  border-0 fw-bold"
                    onClick={() => setSelectedCategory("can-ho-chung-cu")}
                    style={{
                      backgroundColor:
                        selectedCategory === "can-ho-chung-cu"
                          ? "#0046a8"
                          : "#e5ecf6",
                      color:
                        selectedCategory === "can-ho-chung-cu"
                          ? "#ffffff"
                          : "#0046a8",
                      marginLeft: "2px",
                      padding: "0 60px",
                      borderRadius: "8px 8px 0 0",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    Căn hộ
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="g-0">
              <Col>
                <div
                  className="d-flex p-2 align-items-center"
                  style={{
                    backgroundColor: "#0046a8",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  <div className="flex-grow-1 px-1">
                    <div className="input-group rounded-3 overflow-hidden">
                      <span className="input-group-text bg-white border-0">
                        <FaSearch color="#0046a8" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Bạn muốn tìm trọ ở đâu?"
                        className="border-0 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex-grow-1 px-1">
                    <div className="input-group rounded-3 overflow-hidden">
                      <Dropdown className="w-100">
                        <Dropdown.Toggle className="bg-white text-secondary border-0 w-100 text-start d-flex align-items-center justify-content-between">
                          <span className="input-group-text bg-white border-0">
                            <FaMap color="#0046a8" />
                          </span>
                          <span>Địa điểm</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100 p-0">
                          <div>
                            <Form.Select
                              value={selectedProvince}
                              onChange={(e) =>
                                setSelectedProvince(e.target.value)
                              }
                              className="border-0 border-bottom rounded-0"
                            >
                              <option>Chọn Tỉnh/TP...</option>
                              <option>Hồ Chí Minh</option>
                              <option>Hà Nội</option>
                              <option>Đà Nẵng</option>
                            </Form.Select>

                            <Form.Select
                              value={selectedDistrict}
                              onChange={(e) =>
                                setSelectedDistrict(e.target.value)
                              }
                              className="border-0 border-bottom rounded-0"
                            >
                              <option>Quận/Huyện...</option>
                              <option>Quận 1</option>
                              <option>Quận 2</option>
                              <option>Quận 3</option>
                            </Form.Select>

                            <Form.Select
                              value={selectedStreet}
                              onChange={(e) =>
                                setSelectedStreet(e.target.value)
                              }
                              className="border-0 border-bottom rounded-0"
                            >
                              <option>Đường phố...</option>
                              <option>Nguyễn Huệ</option>
                              <option>Lê Lợi</option>
                              <option>Đồng Khởi</option>
                            </Form.Select>

                            <div className="d-flex justify-content-between p-2">
                              <Button
                                variant="link"
                                className="text-decoration-none"
                                onClick={() => {
                                  setSelectedProvince("Chọn Tỉnh/TP...");
                                  setSelectedDistrict("Quận/Huyện...");
                                  setSelectedStreet("Đường phố...");
                                }}
                              >
                                <i className="fas fa-redo"></i> Đặt lại
                              </Button>
                              <Button variant="primary">Tìm ngay</Button>
                            </div>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="flex-grow-1 px-1">
                    <div className="input-group rounded-3 overflow-hidden">
                      <Dropdown className="w-100">
                        <Dropdown.Toggle className="bg-white text-secondary border-0 w-100 text-start d-flex align-items-center justify-content-between">
                          <span className="input-group-text bg-white border-0">
                            <FaDollarSign color="#0046a8" />
                          </span>
                          <span>Mức giá</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100 p-3">
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="pe-2 flex-grow-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Từ"
                                  className="rounded"
                                />
                              </div>
                              <div className="px-2">→</div>
                              <div className="ps-2 flex-grow-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Đến"
                                  className="rounded"
                                />
                              </div>
                            </div>

                            <Form.Check
                              type="radio"
                              id="price-all"
                              name="price-range"
                              label="Tất cả mức giá"
                              defaultChecked
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-under-1m"
                              name="price-range"
                              label="Dưới 1 triệu"
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-1-10m"
                              name="price-range"
                              label="1 - 10 triệu"
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-10-30m"
                              name="price-range"
                              label="10 - 30 triệu"
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-30-50m"
                              name="price-range"
                              label="30 - 50 triệu"
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-50m-plus"
                              name="price-range"
                              label="Trên 50 triệu"
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              id="price-100m-plus"
                              name="price-range"
                              label="Trên 100 triệu"
                              className="mb-2"
                            />
                          </div>

                          <div className="d-flex justify-content-between pt-2 border-top">
                            <Button
                              variant="link"
                              className="text-decoration-none"
                            >
                              <i className="fas fa-redo"></i> Đặt lại
                            </Button>
                            <Button variant="primary">Tìm ngay</Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="flex-grow-1 px-1">
                    <div className="input-group rounded-3 overflow-hidden">
                      <Dropdown className="w-100">
                        <Dropdown.Toggle className="bg-white text-secondary border-0 w-100 text-start d-flex align-items-center justify-content-between">
                          <span className="input-group-text bg-white border-0">
                            <span style={{ color: "#0046a8" }}>m²</span>
                          </span>
                          <span>Diện tích</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100 p-3">
                          <Form.Check
                            type="radio"
                            id="area-under-20"
                            name="area-range"
                            label="Dưới 20 m²"
                            className="mb-2"
                          />
                          <Form.Check
                            type="radio"
                            id="area-20-40"
                            name="area-range"
                            label="20m² - 40 m²"
                            className="mb-2"
                          />
                          <Form.Check
                            type="radio"
                            id="area-40-60"
                            name="area-range"
                            label="40m² - 60 m²"
                            className="mb-2"
                          />
                          <Form.Check
                            type="radio"
                            id="area-60-80"
                            name="area-range"
                            label="60m² - 80 m²"
                            className="mb-2"
                          />
                          <Form.Check
                            type="radio"
                            id="area-80-plus"
                            name="area-range"
                            label="Trên 80 m²"
                            className="mb-2"
                          />

                          <div className="d-flex justify-content-between pt-2 border-top mt-2">
                            <Button
                              variant="link"
                              className="text-decoration-none"
                            >
                              <i className="fas fa-redo"></i> Đặt lại
                            </Button>
                            <Button variant="primary">Tìm ngay</Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="flex-shrink-0 px-1">
                    <Button
                      variant="danger"
                      className="py-2 px-4 border-0 rounded-3 fw-bold"
                      style={{ backgroundColor: "#ff5a00" }}
                    >
                      <FaSearch className="me-2" /> Tìm kiếm
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Banner Section with Images */}
      <Container className="mt-4">
        <Row className="g-3 mb-5">
          <Col md={4}>
            <div className="bg-primary bg-opacity-10 rounded p-2 text-center">
              <img
                src="https://tromoi.com/frontend/home/images/banners/banner_tang_30.webp"
                alt="Promotion"
                className="img-fluid"
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="bg-primary bg-opacity-10 rounded p-2 text-center">
              <img
                src="https://tromoi.com/frontend/home/images/banners/banner_dang_tro_nhanh.jpg"
                alt="Fast Booking"
                className="img-fluid"
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="bg-primary bg-opacity-10 rounded p-2 text-center">
              <img
                src="https://tromoi.com/frontend/home/images/banners/banner_video_review.jpg"
                alt="Video Reviews"
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <HotListings roomType="APARTMENT" title="LỰA CHỌN CHỖ Ở HOT" />

      <RoomList />

      <HotListings roomType="WHOLE_HOUSE" title="NHÀ NGUYÊN CĂN CHO THUÊ" />

      <HotListings
        roomType="BOARDING_HOUSE"
        title="CĂN HỘ, CHUNG CƯ CHO THUÊ"
      />

      <ProvinceListings provinces={provinces} />
    </div>
  );
};

export default HomePage;
