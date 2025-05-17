import { useState, useEffect } from "react";
import mediaAPI from "../../apis/media.api";
import { Media } from "../../types/media.type";

const VideoReviewPage = () => {
  const [videos, setVideos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await mediaAPI.getVideos();
        setVideos(response.data.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Video Reviews</h2>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        videos.map((video) => (
          <div key={video.publicId} className="mb-4">
            <h5>Video: {video.publicId}</h5>
            <video width="100%" controls>
              <source src={video.imageUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoReviewPage;