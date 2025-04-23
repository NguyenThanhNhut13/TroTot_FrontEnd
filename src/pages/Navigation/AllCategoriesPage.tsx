import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Dropdown,
  InputGroup,
  Spinner,
  Container,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import roomApi from "../../apis/room.api.";
import { Listing } from "./CategorySharedPage";
import { Room, RoomSearchParams } from "../../types/room.type";
import { FaSearch, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const AllCategoriesPage = () => {
  const [activeTab, setActiveTab] = useState<
    "BOARDING_HOUSE" | "WHOLE_HOUSE" | "APARTMENT" | null
  >(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    const params = localStorage.getItem("searchParams");
    if (params) {
      try {
        const parsedParams = JSON.parse(params);
        setSearchParams(parsedParams);
        performSearch(parsedParams);
      } catch (error) {
        console.error("Error parsing search params:", error);
      }
    } else {
      // Nếu không có params, load tất cả
      performSearch({});
    }
  }, []);

  // Chuyển sang tab và lọc kết quả theo loại phòng
  const handleTabChange = (
    roomType: "BOARDING_HOUSE" | "WHOLE_HOUSE" | "APARTMENT" | null
  ) => {
    setActiveTab(roomType);

    if (searchParams) {
      // Thêm roomType vào searchParams và tìm kiếm lại
      const newParams = { ...searchParams, roomType };
      performSearch(newParams);
    } else {
      // Nếu không có searchParams, chỉ tìm theo roomType
      performSearch({ roomType });
    }
  };

  // Thực hiện tìm kiếm
  const performSearch = async (params: any) => {
    setIsLoading(true);
    try {
      const searchRoomParams: RoomSearchParams = {
        page: 0,
        size: 10,
      };

      // Thêm roomType nếu có
      if (params.roomType) {
        searchRoomParams.roomType = params.roomType;
      }

      // Thêm các params khác
      if (params.query) {
        searchRoomParams.street = params.query;
      }

      if (params.province) {
        searchRoomParams.city = params.province;
      }

      if (params.district) {
        searchRoomParams.district = params.district;
      }

      if (params.minPrice !== undefined) {
        searchRoomParams.minPrice = params.minPrice;
      }

      if (params.maxPrice !== undefined) {
        searchRoomParams.maxPrice = params.maxPrice;
      }

      if (params.areaRange) {
        searchRoomParams.areaRange = params.areaRange;
      }

      // Gọi API tìm kiếm
      const response = await roomApi.searchRooms(searchRoomParams);

      if (response.data && response.data.data && response.data.data.content) {
        // Transform API response
        const transformedListings = response.data.data.content.map(
          (item: Room) => ({
            image: item.imageUrls[0] || "https://via.placeholder.com/300x200",
            title: item.title,
            price: (item.price / 1000000).toFixed(1),
            area: item.area,
            location: `${item.district}, ${item.province}`,
            type: item.roomType,
          })
        );

        setListings(transformedListings);
        setTotalCount(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Error searching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-primary text-white py-4">
        <Container>
          <h1 className="fw-bold mb-4">KẾT QUẢ TÌM KIẾM</h1>
        </Container>
      </div>

      <Container className="mt-4">
        {searchParams && (
          <div className="alert alert-info mb-3">
            <strong>Kết quả tìm kiếm cho: </strong>
            {searchParams.query && <span>"{searchParams.query}" </span>}
            {searchParams.province && <span>tại {searchParams.province} </span>}
            {searchParams.minPrice && (
              <span>từ {searchParams.minPrice / 1000000} triệu </span>
            )}
            {searchParams.maxPrice && (
              <span>đến {searchParams.maxPrice / 1000000} triệu </span>
            )}
            {searchParams.areaRange && (
              <span>diện tích {searchParams.areaRange}m² </span>
            )}
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => {
                localStorage.removeItem("searchParams");
                setSearchParams(null);
                performSearch({});
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link
              active={activeTab === null}
              onClick={() => handleTabChange(null)}
            >
              Tất cả
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "BOARDING_HOUSE"}
              onClick={() => handleTabChange("BOARDING_HOUSE")}
            >
              Nhà trọ, phòng trọ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "WHOLE_HOUSE"}
              onClick={() => handleTabChange("WHOLE_HOUSE")}
            >
              Nhà nguyên căn
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "APARTMENT"}
              onClick={() => handleTabChange("APARTMENT")}
            >
              Căn hộ, chung cư
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="d-flex justify-content-between mb-3">
          <p className="mb-0">Tổng {totalCount} kết quả</p>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Listing results */}
        {!isLoading && listings.length === 0 && (
          <div className="alert alert-warning">
            Không tìm thấy kết quả phù hợp. Vui lòng thử lại với các tiêu chí
            khác.
          </div>
        )}

        {!isLoading &&
          listings.map((listing, index) => (
            <Card key={index} className="mb-3 border-0 shadow-sm">
              <div className="position-relative">
                {/* HOT label */}
                <div
                  className="position-absolute bg-danger text-white px-2 py-1"
                  style={{ top: "10px", left: "0" }}
                >
                  HOT
                </div>

                <Row className="g-0">
                  {/* Left - Image */}
                  <Col md={4}>
                    <Card.Img
                      src={listing.image}
                      alt={listing.title}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </Col>

                  {/* Right - Content */}
                  <Col md={8}>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title className="fw-bold mb-2">
                          {listing.title}
                        </Card.Title>
                        <FaHeart
                          className="text-muted"
                          style={{ cursor: "pointer" }}
                        />
                      </div>

                      <Card.Text className="text-danger fw-bold mb-2">
                        {listing.price} triệu/tháng
                      </Card.Text>

                      <div className="d-flex mb-2">
                        <span className="me-3">{listing.area}m²</span>
                        <span className="badge bg-info text-white me-2">
                          {listing.title === "BOARDING_HOUSE"
                            ? "Phòng trọ"
                            : listing.title === "WHOLE_HOUSE"
                            ? "Nhà nguyên căn"
                            : "Căn hộ"}
                        </span>
                      </div>

                      <div className="d-flex align-items-center text-muted mb-2">
                        <FaMapMarkerAlt className="me-1" />
                        {listing.location}
                      </div>

                      <Link
                        to={`/phong-tro/${index}`}
                        className="text-decoration-none"
                      >
                        <Button variant="primary" className="mt-1">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </Card.Body>
                  </Col>
                </Row>
              </div>
            </Card>
          ))}

        {/* Pagination */}
        {listings.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllCategoriesPage;
