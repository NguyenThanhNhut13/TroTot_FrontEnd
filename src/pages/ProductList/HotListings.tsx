import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import roomApi from "../../apis/room.api."; // update path if needed
import { Room } from "../../types/room.type"; // kiểu gốc từ API

interface Listing {
  image: string;
  title: string;
  price: string;
  area: number;
  location: string;
}

interface HotListingsProps {
  title?: string;
  page?: number;
  size?: number;
  sort?: string;
  roomType?: 'APARTMENT' | 'WHOLE_HOUSE' | 'BOARDING_HOUSE';
}


const HotListings: React.FC<HotListingsProps> = ({
  title = "LỰA CHỌN CHỖ Ở HOT",
  page = 0,
  size = 6,
  sort = "createdAt,desc",
  roomType,
}) => {
  const [hotListings, setHotListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await roomApi.getRooms({ page, size, sort, roomType });
        const rooms = res.data.data.content;

        const mapped: Listing[] = rooms.map((room: Room) => ({
          image: room.images?.[0]?.imageUrl || "https://via.placeholder.com/150",
          title: room.title,
          price: `${room.price.toLocaleString()} VNĐ`,
          area: room.area,
          location: room.address ?? "Đang cập nhật",
        }));

        setHotListings(mapped);
      } catch (error) {
        console.error("Error fetching hot listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [page, size, sort, roomType]); // Re-fetch if params change


  return (
    <div className="hot-listings mt-4">
      <h2 className="text-primary">{title}</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        Array.from({ length: Math.ceil(hotListings.length / 5) }, (_, rowIndex) => (
          <Row key={rowIndex} className="mb-4">
            {hotListings
              .slice(rowIndex * 5, rowIndex * 5 + 5)
              .map((listing: Listing, index: number) => (
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
        ))
      )}

      <div className="mt-3">
        <Button variant="primary">
          <i className="fas fa-arrow-right"></i> Xem tất cả
        </Button>
      </div>
    </div>
  );
};

export default HotListings;
