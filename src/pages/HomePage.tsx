import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Dropdown } from "react-bootstrap";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả mức giá");
  const [selectedArea, setSelectedArea] = useState("Tất cả diện tích");
  const [selectedCategory, setSelectedCategory] = useState("tat-ca");

  useEffect(() => {
    fetch("https://api.example.com/provinces") // Thay URL bằng API thật
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://api.example.com/districts?province=${selectedProvince}`)
        .then((response) => response.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
      setStreets([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://api.example.com/streets?district=${selectedDistrict}`)
        .then((response) => response.json())
        .then((data) => setStreets(data))
        .catch((error) => console.error("Error fetching streets:", error));
    } else {
      setStreets([]);
    }
  }, [selectedDistrict]);

  return (
    <div>
      {/* Banner */}
      <div className="banner text-center p-5 bg-danger text-white">
        <h1>Tìm nhanh, kiếm dễ - Trọ mới toàn quốc</h1>
        <p>Hơn 500 tin đăng mới và 30.000 lượt xem mỗi ngày</p>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="filter-bar bg-primary p-3 text-white">
        <Row>
          <Col md={3}>
            <Button 
              variant={selectedCategory === "tat-ca" ? "warning" : "light"} 
              onClick={() => setSelectedCategory("tat-ca")}
            >
              Tất cả
            </Button>
            <Button 
              variant={selectedCategory === "nha-tro" ? "warning" : "light"} 
              onClick={() => setSelectedCategory("nha-tro")}
            >
              Nhà trọ, phòng trọ
            </Button>
            <Button 
              variant={selectedCategory === "nha-nguyen-can" ? "warning" : "light"} 
              onClick={() => setSelectedCategory("nha-nguyen-can")}
            >
              Nhà nguyên căn
            </Button>
            <Button 
              variant={selectedCategory === "can-ho-chung-cu" ? "warning" : "light"} 
              onClick={() => setSelectedCategory("can-ho-chung-cu")}
            >
              Căn hộ chung cư
            </Button>
          </Col>
          <Col md={9}>
            <Form>
              <Row>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="w-100">
                      {selectedProvince || "Chọn Tỉnh/TP..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {locations.map((province, index) => (
                        <Dropdown.Item key={index} onClick={() => setSelectedProvince(province)}>
                          {province}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="w-100" disabled={!selectedProvince}>
                      {selectedDistrict || "Quận/Huyện..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {districts.map((district, index) => (
                        <Dropdown.Item key={index} onClick={() => setSelectedDistrict(district)}>
                          {district}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="w-100" disabled={!selectedDistrict}>
                      {selectedStreet || "Đường phố..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {streets.map((street, index) => (
                        <Dropdown.Item key={index} onClick={() => setSelectedStreet(street)}>
                          {street}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Button variant="warning">Tìm kiếm</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
