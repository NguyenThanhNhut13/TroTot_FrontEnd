import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

const categories = [
  { name: "Nhà trọ", slug: "nha-tro-phong-tro" },
  { name: "Nhà nguyên căn", slug: "nha-nguyen-can" },
  { name: "Căn hộ chung cư", slug: "can-ho-chung-cu" },
  { name: "Video Review", slug: "video-review" },
  { name: "Blog", slug: "blog" }
];

const CategoryList = () => {
  return (
    <Row>
      {categories.map(category => (
        <Col md={4} key={category.slug} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{category.name}</Card.Title>
              <Link to={`/category/${category.slug}`} className="btn btn-primary">Xem danh mục</Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryList;