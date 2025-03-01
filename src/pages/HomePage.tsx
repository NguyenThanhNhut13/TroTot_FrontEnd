import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Dropdown, Card } from "react-bootstrap";
import RoomList from "../components/banner/RoomList";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Chọn Tỉnh/TP...");
  const [selectedDistrict, setSelectedDistrict] = useState("Quận/Huyện...");
  const [selectedStreet, setSelectedStreet] = useState("Đường phố...");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả mức giá");
  const [selectedArea, setSelectedArea] = useState("Tất cả diện tích");
  const [selectedCategory, setSelectedCategory] = useState("tat-ca");

  const hotListings = [
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà nguyên căn tại D19, Trường ...",
      price: "16 triệu/tháng",
      area: 125,
      location: "Quận 9, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà Trọ 416/23 Dương Quảng Hàm",
      price: "4 triệu/tháng",
      area: 20,
      location: "Gò Vấp, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà trọ đường Mã Lò, Bình Tân",
      price: "3.2 triệu/tháng",
      area: 20,
      location: "Bình Tân, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà nguyên căn tại D19, Trường ...",
      price: "16 triệu/tháng",
      area: 125,
      location: "Quận 9, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà Trọ 416/23 Dương Quảng Hàm",
      price: "4 triệu/tháng",
      area: 20,
      location: "Gò Vấp, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà trọ đường Mã Lò, Bình Tân",
      price: "3.2 triệu/tháng",
      area: 20,
      location: "Bình Tân, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà nguyên căn tại D19, Trường ...",
      price: "16 triệu/tháng",
      area: 125,
      location: "Quận 9, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà Trọ 416/23 Dương Quảng Hàm",
      price: "4 triệu/tháng",
      area: 20,
      location: "Gò Vấp, Thành phố Hồ Chí Minh",
    },
    {
      image: "https://via.placeholder.com/300",
      title: "Nhà trọ đường Mã Lò, Bình Tân",
      price: "3.2 triệu/tháng",
      area: 20,
      location: "Bình Tân, Thành phố Hồ Chí Minh",
    },
  ];

  useEffect(() => {
    fetch("https://api.example.com/locations")
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  return (
    <div>
      <div className="banner text-center p-5 bg-danger text-white">
        <h1>Tìm nhanh, kiếm dễ - Trọ mới toàn quốc</h1>
        <p>Hơn 500 tin đăng mới và 30.000 lượt xem mỗi ngày</p>
      </div>

      <div className="filter-bar p-3 text-white">
        <Row className="mb-3">
          <Col style={{ padding: "0px" }}>
            <Button
              className="bd-0"
              onClick={() => setSelectedCategory("tat-ca")}
              style={{
                padding: "15px 40px",
                marginLeft: "5px",
                backgroundColor:
                  selectedCategory === "tat-ca" ? "#0046a8" : "#e5ecf6",
                border: "none",
                color: selectedCategory === "tat-ca" ? "white" : "#0046a8",
              }}
            >
              Tất cả
            </Button>
            <Button
              className="bd-0"
              onClick={() => setSelectedCategory("nha-tro-phong-tro")}
              style={{
                padding: "15px 40px",
                marginLeft: "5px",
                backgroundColor:
                  selectedCategory === "nha-tro-phong-tro"
                    ? "#0046a8"
                    : "#e5ecf6",
                border: "none",
                color:
                  selectedCategory === "nha-tro-phong-tro"
                    ? "white"
                    : "#0046a8",
              }}
            >
              Nhà trọ, phòng trọ
            </Button>
            <Button
              className="bd-0"
              onClick={() => setSelectedCategory("nha-nguyen-can")}
              style={{
                padding: "15px 40px",
                marginLeft: "5px",
                backgroundColor:
                  selectedCategory === "nha-nguyen-can" ? "#0046a8" : "#e5ecf6",
                border: "none",
                color:
                  selectedCategory === "nha-nguyen-can" ? "white" : "#0046a8",
              }}
            >
              Nhà nguyên căn
            </Button>
            <Button
              className="bd-0"
              onClick={() => setSelectedCategory("can-ho-chung-cu")}
              style={{
                padding: "15px 40px",
                marginLeft: "5px",
                backgroundColor:
                  selectedCategory === "can-ho-chung-cu"
                    ? "#0046a8"
                    : "#e5ecf6",
                border: "none",
                color:
                  selectedCategory === "can-ho-chung-cu" ? "white" : "#0046a8",
              }}
            >
              Căn hộ chung cư
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{ padding: "30px", backgroundColor: "#0046a8" }}>
            <Form>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Bạn muốn tìm trọ ở đâu?"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ padding: "10px" }}
                  />
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="w-100"
                      style={{ padding: "10px" }}
                    >
                      {selectedProvince}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item
                        onClick={() => setSelectedProvince("Hồ Chí Minh")}
                      >
                        Hồ Chí Minh
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSelectedProvince("Hà Nội")}
                      >
                        Hà Nội
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="w-100"
                      style={{ padding: "10px" }}
                    >
                      {selectedPrice}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item
                        onClick={() => setSelectedPrice("Dưới 1 triệu")}
                      >
                        Dưới 1 triệu
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSelectedPrice("1 - 10 triệu")}
                      >
                        1 - 10 triệu
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="w-100"
                      style={{ padding: "10px" }}
                    >
                      {selectedArea}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item
                        onClick={() => setSelectedArea("Dưới 20m²")}
                      >
                        Dưới 20m²
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setSelectedArea("20 - 40m²")}
                      >
                        20 - 40m²
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Button variant="warning" style={{ padding: "10px" }}>
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>

      {/* Lua chọn */}
      <div className="hot-listings mt-4">
        <h2 className="text-primary">LỰA CHỌN CHỖ Ở HOT</h2>
        {Array.from(
          { length: Math.ceil(hotListings.length / 5) },
          (_, rowIndex) => (
            <Row key={rowIndex} className="mb-4">
              {hotListings
                .slice(rowIndex * 5, rowIndex * 5 + 5)
                .map((listing, index) => (
                  <Col
                    key={index}
                    md={2}
                    lg={2}
                    xl={2}
                    className="mb-4"
                    style={{ width: "20%" }}
                  >
                    <Card style={{ height: "100%" }}>
                      <Card.Img
                        variant="top"
                        src={listing.image}
                        alt={listing.title}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{listing.title}</Card.Title>
                        <Card.Text className="flex-grow-1">
                          <strong>Giá:</strong> {listing.price} <br />
                          <strong>Diện tích:</strong> {listing.area}m² <br />
                          <strong>Địa chỉ:</strong> {listing.location}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )
        )}
        <div className="mt-3">
          <Button variant="primary">
            <i className="fas fa-arrow-right"></i> Xem tất cả
          </Button>
        </div>
      </div>

      <RoomList />
      {/* Nha nguyen can */}
      <div className="hot-listings mt-4">
        <h2 className="text-primary">NHÀ NGUYÊN CĂN CHO THUÊ</h2>
        {Array.from(
          { length: Math.ceil(hotListings.length / 5) },
          (_, rowIndex) => (
            <Row key={rowIndex} className="mb-4">
              {hotListings
                .slice(rowIndex * 5, rowIndex * 5 + 5)
                .map((listing, index) => (
                  <Col
                    key={index}
                    md={2}
                    lg={2}
                    xl={2}
                    className="mb-4"
                    style={{ width: "20%" }}
                  >
                    <Card style={{ height: "100%" }}>
                      <Card.Img
                        variant="top"
                        src={listing.image}
                        alt={listing.title}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{listing.title}</Card.Title>
                        <Card.Text className="flex-grow-1">
                          <strong>Giá:</strong> {listing.price} <br />
                          <strong>Diện tích:</strong> {listing.area}m² <br />
                          <strong>Địa chỉ:</strong> {listing.location}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )
        )}
        <div className="mt-3">
          <Button variant="primary">
            <i className="fas fa-arrow-right"></i> Xem tất cả
          </Button>
        </div>
      </div>

      {/* Can ho, chung cu cho thue */}
      <div className="hot-listings mt-4">
        <h2 className="text-primary">CĂN HỘ, CHUNG CƯ CHO THUÊ</h2>
        {Array.from(
          { length: Math.ceil(hotListings.length / 5) },
          (_, rowIndex) => (
            <Row key={rowIndex} className="mb-4">
              {hotListings
                .slice(rowIndex * 5, rowIndex * 5 + 5)
                .map((listing, index) => (
                  <Col
                    key={index}
                    md={2}
                    lg={2}
                    xl={2}
                    className="mb-4"
                    style={{ width: "20%" }}
                  >
                    <Card style={{ height: "100%" }}>
                      <Card.Img
                        variant="top"
                        src={listing.image}
                        alt={listing.title}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{listing.title}</Card.Title>
                        <Card.Text className="flex-grow-1">
                          <strong>Giá:</strong> {listing.price} <br />
                          <strong>Diện tích:</strong> {listing.area}m² <br />
                          <strong>Địa chỉ:</strong> {listing.location}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )
        )}
        <div className="mt-3">
          <Button variant="primary">
            <i className="fas fa-arrow-right"></i> Xem tất cả
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
