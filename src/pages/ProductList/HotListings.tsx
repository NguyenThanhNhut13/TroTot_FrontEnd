import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

interface Listing {
  image: string;
  title: string;
  price: string;
  area: number;
  location: string;
}

interface HotListingsProps {
  hotListings: Listing[];
  title?: string;
}

const HotListings: React.FC<HotListingsProps> = ({ hotListings, title = "LỰA CHỌN CHỖ Ở HOT" }) => {
  return (
    <div className="hot-listings mt-4">
      <h2 className="text-primary">{title}</h2>
      {Array.from(
        { length: Math.ceil(hotListings.length / 5) },
        (_, rowIndex) => (
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
        )
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
