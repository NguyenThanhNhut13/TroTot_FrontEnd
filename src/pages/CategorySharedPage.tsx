import { useState } from "react";
import { Card, Button, Row, Col, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface Post {
  id: number;
  title: string;
  image: string;
  price: string;
  address: string;
}

interface Props {
  posts: Post[];
  title: string;
}

const CategorySharedPage = ({ posts, title }: Props) => {
  const [filter, setFilter] = useState({
    keyword: "",
    price: "",
    area: "",
    sort: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  
  

  return (
    <div>


      {/* Header */}
      <h2 className="mb-3">{title}</h2>
      <p className="text-muted">Tìm kiếm {title} giá rẻ, an toàn, tiện lợi.</p>

      {/* Bộ lọc tìm kiếm */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Tìm theo từ khóa..."
              name="keyword"
              value={filter.keyword}
              onChange={handleChange}
            />
          </Col>
          <Col md={3}>
            <Form.Select name="price" value={filter.price} onChange={handleChange}>
              <option value="">Chọn mức giá</option>
              <option value="duoi-2tr">Dưới 2 triệu</option>
              <option value="2-4tr">2 - 4 triệu</option>
              <option value="tren-4tr">Trên 4 triệu</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="area" value={filter.area} onChange={handleChange}>
              <option value="">Chọn diện tích</option>
              <option value="duoi-20m2">Dưới 20m²</option>
              <option value="20-40m2">20 - 40m²</option>
              <option value="tren-40m2">Trên 40m²</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="sort" value={filter.sort} onChange={handleChange}>
              <option value="">Sắp xếp</option>
              <option value="moi-nhat">Mới nhất</option>
              <option value="gia-thap-den-cao">Giá thấp đến cao</option>
              <option value="gia-cao-den-thap">Giá cao đến thấp</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Danh sách bài đăng */}
      <Row>
        {posts.map((post) => (
          <Col md={4} key={post.id} className="mb-3">
            <Card>
              <Card.Img variant="top" src={post.image} alt={post.title} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  <strong>{post.price} VNĐ/tháng</strong> <br />
                  <small>{post.address}</small>
                </Card.Text>
                <Button variant="primary">Xem chi tiết</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Phân trang */}
      <Pagination className="mt-4">
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Next />
      </Pagination>
    </div>
  );
};

export default CategorySharedPage;
