import { useParams , Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Post, mockPosts } from "../data/mockPosts";
import CategorySharedPage from "./CategorySharedPage";
import VideoReviewPage from "./VideoReviewPage";
import BlogPage from "./BlogPage";
import {
  SHARED_CATEGORIES,
  VIDEO_CATEGORY,
  BLOG_CATEGORY,
  categoryNameMap
} from "../data/categories";

const CategoryPage = () => {
  const { type } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (type) {
      const filtered = mockPosts.filter(p => p.category === type);
      setPosts(filtered);
    }
  }, [type]);

  if (!type) return <div>Không xác định danh mục.</div>;

  const categoryName = categoryNameMap[type] || type.replaceAll("-", " ");

  return (
    <div>
      {/* ✅ Breadcrumb */}
      <p className="text-muted mb-3">
        <Link to="/">Trang chủ</Link> / <Link to="/category">Danh mục</Link> / <strong>{categoryName}</strong>
      </p>

      {/* ✅ Giao diện tùy loại */}
      {SHARED_CATEGORIES.includes(type) && (
        <CategorySharedPage posts={posts} title={categoryName} />
      )}

      {type === VIDEO_CATEGORY && <VideoReviewPage posts={posts} />}
      {type === BLOG_CATEGORY && <BlogPage posts={posts} />}
    </div>
  );
};

export default CategoryPage;
