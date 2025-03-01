import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface RoomCardProps {
  image: string;
  location: string;
  title: string;
  price: string;
  rating: number;
  link: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ image, location, title, price, rating, link }) => {
  return (
    <Card className="shadow-lg rounded-3 overflow-hidden" style={{ width: "18rem" }}>
      <div className="position-relative">
        <Card.Img variant="top" src={image} className="object-fit-cover" height={250} />
        
        {/* Thay thế FaPlay bằng hình ảnh */}
        <Button
          variant="light"
          className="position-absolute start-0 top-50 translate-middle-y"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            padding: "5px",
            width: "40px",
            height: "40px",
          }}
        >
          <img src="/images/play-icon.png" alt="Play" style={{ width: "24px", height: "24px" }} />
        </Button>
      </div>
      <Card.Body>
        <Card.Text className="text-muted small">{location}</Card.Text>
        <Card.Title>
          <Link to={link} className="text-dark text-decoration-none">{title}</Link>
        </Card.Title>
        <Card.Text className="text-danger fw-bold">{price}</Card.Text>
        <div className="d-flex align-items-center">
          <img src="/images/star-icon.png" alt="Star" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
          <span>{rating}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;
