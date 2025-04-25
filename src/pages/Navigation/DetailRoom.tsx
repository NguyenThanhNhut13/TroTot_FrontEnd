import React, { useState, useEffect, use } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Carousel,
  Table,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaRuler,
  FaPhone,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaRegCalendarAlt,
  FaUserAlt,
  FaAngleRight,
} from "react-icons/fa";
import roomApi from "../../apis/room.api.";
import { RoomGetByID } from "../../types/room.type";
import { toast } from "react-toastify";
import RoomMap from "../../components/common/Map/RoomMap";
import addressAPI from "../../apis/address.api";
import { get } from "lodash";

export default function DetailRoom() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<RoomGetByID | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  // Fetch room details by ID
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await roomApi.getRoomById(Number(id));
        if (response?.data?.data) {
          setRoom(response.data.data);
        }

      } catch (error) {
        console.error("Error fetching room details:", error);
        setError("Không thể tải thông tin phòng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

 const [similarRooms, setSimilarRooms] = useState<any[]>([]);
  useEffect(() => {
    if(!room) 
      return
    const getSimilarRoom = async () => {
      try{
        const response = await roomApi.aiGetSimilarRoom(room.id);
        setSimilarRooms(response.data.data)

      }catch(error){
        console.log(error)
      }
    }
    getSimilarRoom()
  }, [room])

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    // If not logged in, show login prompt
    const isLoggedIn = false; // Replace with actual auth check
    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để lưu phòng trọ yêu thích");
      return;
    }

    setIsFavorite(!isFavorite);
    // Call API to add/remove from favorites
    // ...
  };

  // Handle share button click
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: room?.title,
          text: `Xem phòng trọ: ${room?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Đã sao chép liên kết vào clipboard"))
        .catch(() => toast.error("Không thể sao chép liên kết"));
    }
  };

  // Show loading spinner when data is being fetched
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Show error message if there was an error
  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  // Show not found message if room is null
  if (!room) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning">Không tìm thấy phòng trọ này.</div>
      </Container>
    );
  }

  // if (room) {
  //   const getMapForWard = async () => {
      
  //     const reponseForward = await addressAPI.getMapForward(`${ room.address.houseNumber }, ${room.address.street},${room.address.ward}, ${room.address.district},${" "}${room.address.province}`);
  //     setLongitude(reponseForward.data.data.longitude);
  //     setLatitude(reponseForward.data.data.latitude);
  //     console.log(longitude, latitude);
  //   }

  //   getMapForWard()
  // }

  // Create an array of imageUrls for the carousel
  const imageUrls = room.images.map((image) => image.imageUrl);

  return (
    <Container className="py-4">
      <Row>
        {/* Main Content */}
        <Col lg={9}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link
                  to={`/${
                    room.roomType === "BOARDING_HOUSE"
                      ? "phong-tro"
                      : room.roomType === "WHOLE_HOUSE"
                      ? "nha-nguyen-can"
                      : "can-ho"
                  }`}
                >
                  {room.roomType === "BOARDING_HOUSE"
                    ? "Phòng trọ"
                    : room.roomType === "WHOLE_HOUSE"
                    ? "Nhà nguyên căn"
                    : "Căn hộ"}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {room.title}
              </li>
            </ol>
          </nav>

          {/* Room Title Section */}
          <div className="mb-4">
            <h1 className="h3 fw-bold">{room.title}</h1>
            <div className="d-flex align-items-center mt-2">
              <FaMapMarkerAlt className="text-secondary me-1" />
              <span className="text-secondary">
                {room.address.houseNumber}, {room.address.street},{" "}
                {room.address.ward}, {room.address.district},{" "}
                {room.address.province}
              </span>
            </div>
          </div>

          {/* Image Carousel */}
          <Card className="border-0 shadow-sm mb-4">
            <Carousel
              activeIndex={activeIndex}
              onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
              interval={null}
              className="room-carousel"
            >
              {imageUrls.map((image, index) => (
                <Carousel.Item key={index}>
                  <div
                    style={{
                      height: "500px",
                      backgroundColor: "#f8f9fa",
                      position: "relative",
                    }}
                  >
                    <img
                      className="d-block w-100 h-100"
                      src={image}
                      alt={`Hình ${index + 1} của ${room.title}`}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>

            {/* Thumbnail Preview */}
            <div className="d-flex mt-2 p-2 justify-content-start overflow-auto">
              {imageUrls.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    cursor: "pointer",
                    width: "80px",
                    height: "60px",
                    marginRight: "10px",
                    border:
                      activeIndex === index
                        ? "2px solid #007bff"
                        : "1px solid #dee2e6",
                    padding: "2px",
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Room Details */}
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="h-100 bg-light border-0">
                <Card.Body className="text-center">
                  <div className="text-primary h5 mb-1">Giá thuê</div>
                  <div className="h3 text-danger fw-bold">
                    {room.price} đ/tháng
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="h-100 bg-light border-0">
                <Card.Body className="text-center">
                  <div className="text-primary h5 mb-1">Diện tích</div>
                  <div className="h3 fw-bold">{room.area} m²</div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="h-100 bg-light border-0">
                <Card.Body className="text-center">
                  <div className="text-primary h5 mb-1">Đặt cọc</div>
                  <div className="h3 fw-bold">{room.deposit} đ</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Room Specification */}
          <h4 className="mb-3 fw-bold">Thông tin mô tả</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <p style={{ whiteSpace: "pre-line" }}>{room.description}</p>
            </Card.Body>
          </Card>

          {/* Room Features */}
          <h4 className="mb-3 fw-bold">Đặc điểm phòng trọ</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Table striped>
                <tbody>
                  <tr>
                    <td width="30%">Loại phòng:</td>
                    <td>
                      {room.roomType === "BOARDING_HOUSE"
                        ? "Phòng trọ"
                        : room.roomType === "WHOLE_HOUSE"
                        ? "Nhà nguyên căn"
                        : "Căn hộ"}
                    </td>
                  </tr>
                  <tr>
                    <td>Đối tượng cho thuê:</td>
                    <td>
                      {room.forGender === "ALL"
                        ? "Tất cả"
                        : room.forGender === "MALE"
                        ? "Nam"
                        : "Nữ"}
                    </td>
                  </tr>
                  <tr>
                    <td>Số phòng:</td>
                    <td>{room.totalRooms} phòng</td>
                  </tr>
                  <tr>
                    <td>Số người tối đa:</td>
                    <td>{room.maxPeople} người</td>
                  </tr>
                  <tr>
                    <td>Số phòng ngủ:</td>
                    <td>{room.numberOfBedrooms} phòng</td>
                  </tr>
                  <tr>
                    <td>Số phòng tắm:</td>
                    <td>{room.numberOfBathrooms} phòng</td>
                  </tr>
                  <tr>
                    <td>Nhà bếp:</td>
                    <td>{room.numberOfKitchens} phòng</td>
                  </tr>
                  <tr>
                    <td>Phòng khách:</td>
                    <td>{room.numberOfLivingRooms} phòng</td>
                  </tr>
                  <tr>
                    <td>Trọ tự quản:</td>
                    <td>{room.selfManaged ? "Có" : "Không"}</td>
                  </tr>
                  <tr>
                    <td>Ngày đăng:</td>
                    <td>{room.createdAt}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Amenities */}
          <h4 className="mb-3 fw-bold">Tiện nghi</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row>
                {room.amenities.map((amenity, index) => (
                  <Col md={4} key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaAngleRight className="text-primary me-2" />
                      <span>{amenity.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Target Audience */}
          <h4 className="mb-3 fw-bold">Đối tượng thuê phù hợp</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row>
                {room.targetAudiences.map((audience, index) => (
                  <Col md={4} key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaAngleRight className="text-primary me-2" />
                      <span>{audience.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Surrounding Environment */}
          <h4 className="mb-3 fw-bold">Khu vực xung quanh</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row>
                {room.surroundingAreas.map((area, index) => (
                  <Col md={4} key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaAngleRight className="text-primary me-2" />
                      <span>{area.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Location Map (placeholder) */}
          <h4 className="mb-3 fw-bold">Vị trí trên bản đồ</h4>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div
                className="map-container"
                style={{
                  height: "400px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div className="text-center text-muted">
                  <RoomMap latitude={10.7958642}  longitude={106.7067786}/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={3}>
          {/* Contact Info */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex mb-3">
                <div
                  className="avatar me-3 bg-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaUserAlt className="text-primary" />
                </div>
                <div>
                  <h5 className="mb-1">{room.posterName}</h5>
                  <div className="small">
                    <FaRegCalendarAlt className="me-1" /> Đã đăng:{" "}
                    {room.createdAt}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={() => setShowPhone(!showPhone)}
                >
                  <FaPhone className="me-2" />
                  {showPhone ? room.posterPhone : "Hiện số điện thoại"}
                </Button>

                <Button
                  variant={isFavorite ? "danger" : "outline-danger"}
                  className="w-100 mb-2"
                  onClick={async () => {
                  // If not logged in, show login prompt
                  const isLoggedIn = localStorage.getItem('accessToken'); // Basic auth check
                  if (!isLoggedIn) {
                    toast.info("Vui lòng đăng nhập để lưu phòng trọ yêu thích");
                    return;
                  }

                  try {
                    if (!isFavorite) {
                    await roomApi.addToWishList(room.id);
                    toast.success("Đã lưu tin thành công");
                    } else {
                    toast.success("Đã xóa tin khỏi danh sách yêu thích");
                    }
                    setIsFavorite(!isFavorite);
                  } catch (error) {
                    console.error("Error updating wishlist:", error);
                    toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
                  }
                  }}
                >
                  {isFavorite ? (
                  <FaHeart className="me-2" />
                  ) : (
                  <FaRegHeart className="me-2" />
                  )}
                  {isFavorite ? "Đã lưu" : "Lưu tin"}
                </Button>

                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={handleShare}
                >
                  <FaShareAlt className="me-2" /> Chia sẻ
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Similar Rooms Recommendations (placeholder) */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="mb-0">Phòng trọ tương tự</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {similarRooms.length > 0 ? (
              similarRooms.map((similarRoom, index) => (
                <ListGroup.Item key={similarRoom.id} action className="py-3">
                <Link to={`/detail-room/${similarRoom.id}`} className="text-decoration-none text-dark">
                  <Row className="g-2">
                  <Col xs={4}>
                    <div
                    style={{
                      height: "60px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}
                    >
                    {similarRoom.images && similarRoom.images.length > 0 && (
                      <img 
                      src={similarRoom.images[0]?.imageUrl} 
                      alt={similarRoom.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div
                    className="small fw-bold mb-1"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    >
                    {similarRoom.title}
                    </div>
                    <div className="small text-danger">
                    {similarRoom.price} đ/tháng
                    </div>
                    <div className="d-flex align-items-center">
                    <div className="small text-secondary me-2">
                      {similarRoom.area} m²
                    </div>
                    <div className="small text-secondary text-truncate">
                      <FaMapMarkerAlt size={10} className="me-1" />
                      {similarRoom.address?.district}, {similarRoom.address?.province}
                    </div>
                    </div>
                  </Col>
                  </Row>
                </Link>
                </ListGroup.Item>
              ))
              ) : (
              [1, 2, 3].map((item) => (
                <ListGroup.Item key={item} action className="py-3">
                <Row className="g-2">
                  <Col xs={4}>
                  <div
                    style={{
                    height: "60px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    }}
                  ></div>
                  </Col>
                  <Col xs={8}>
                  <div
                    className="small fw-bold mb-1"
                    style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    }}
                  >
                    Phòng trọ quận {room.address.district} gần{" "}
                    {item === 1
                    ? "trường đại học"
                    : item === 2
                    ? "bệnh viện"
                    : "siêu thị"}
                  </div>
                  <div className="small text-danger">
                    {room.price - item * 200000} đ/tháng
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="small text-secondary me-2">
                    {room.area - item} m²
                    </div>
                    <div className="small text-secondary text-truncate">
                    <FaMapMarkerAlt size={10} className="me-1" />
                    {room.address.district}, {room.address.province}
                    </div>
                  </div>
                  </Col>
                </Row>
                </ListGroup.Item>
              ))
              )}
            </ListGroup>
            <Card.Footer className="bg-white text-center">
              <Link
                to={`/${
                  room.roomType === "BOARDING_HOUSE"
                    ? "phong-tro"
                    : room.roomType === "WHOLE_HOUSE"
                    ? "nha-nguyen-can"
                    : "can-ho"
                }`}
                className="text-decoration-none"
              >
                Xem thêm <FaAngleRight />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
