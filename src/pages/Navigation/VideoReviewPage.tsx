import { Post } from "../../data/mockPosts";

interface Props {
  posts: Post[];
}

const VideoReviewPage = ({ posts }: Props) => {
  return (
    <div>
      <h2>Video Review</h2>
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <h5>{post.title}</h5>
          <video width="100%" controls>
            <source src={post.videoUrl} type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoReviewPage;
