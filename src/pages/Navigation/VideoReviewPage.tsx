import { useState, useEffect } from "react";
import mediaAPI from "../../apis/media.api";
import { Media } from "../../types/media.type";
import { Card, Col, Row, Badge } from "react-bootstrap"; // Import Bootstrap components
import { FaHeart, FaShare } from "react-icons/fa"; // Import icons for likes and shares

// Extend the Media type to include fields visible in the UI
interface ExtendedMedia extends Media {
  title: string; // For video title
  rating: number; // For star rating
  likes: number; // For number of likes
}

const VideoReviewPage = () => {
  const [videos, setVideos] = useState<ExtendedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await mediaAPI.getVideos();
        setVideos(
          response.data.data.map((video: Media) => ({
            ...video,
            title: (video as any).title || "Phòng rộng rãi, thoáng mát, full nội thất...",
            rating: (video as any).rating ?? 5.0, // Default or fetched rating
            likes: (video as any).likes ?? 0,     // Default or fetched likes
          }))
        );
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-4">
      {/* Header Section */}
      <h2 className="text-uppercase mb-2">Video Review</h2>
      <p className="text-muted mb-4">
        Khám phá ngay những chương trình cực hấp dẫn tại Trợ Mới để được nhận thêm ưu đãi và lựa chọn tuyệt vời cho cả 6 miền nhé!
      </p>

      {/* Tabs (Mocked as Buttons for Categories) */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Badge pill bg="primary" className="px-3 py-2">
          Tất cả
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Hồ Chí Minh
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Hà Nội
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Đà Nẵng
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Thừa Thiên Huế
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Bình Dương
        </Badge>
        <Badge pill bg="light" text="dark" className="px-3 py-2">
          Hải Phòng
        </Badge>
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <p className="text-center">No videos available.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={5} className="g-3">
          {videos.map((video) => (
            <Col key={video.publicId}>
              <Card className="h-100 border-0 shadow-sm">
                {/* Video Thumbnail */}
                <div className="position-relative">
                  <video
                    width="100%"
                    height="auto"
                    className="rounded-top"
                    poster={video.imageUrl} // Use imageUrl as thumbnail
                    onClick={(e) => e.currentTarget.play()} // Play on click
                  >
                    <source src={video.imageUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <FaShare className="text-white" />
                  </div>
                </div>

                {/* Card Body */}
                <Card.Body className="p-2">
                  <Card.Title className="text-muted small mb-1">
                    Bán Mới, Thành phố Hồ Chí Minh
                  </Card.Title>
                  <Card.Text className="mb-1" style={{ fontSize: "0.9rem" }}>
                    {video.title}
                  </Card.Text>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-warning">
                      {video.rating.toFixed(1)} <span className="text-muted">★</span>
                    </span>
                    <span className="text-muted">({video.likes.toLocaleString()} lượt thích)</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};


export default VideoReviewPage;

