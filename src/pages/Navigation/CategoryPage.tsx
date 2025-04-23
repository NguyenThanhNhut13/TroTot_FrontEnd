import { useParams, Link } from "react-router-dom";
import CategorySharedPage from "./CategorySharedPage";
import VideoReviewPage from "./VideoReviewPage";
import BlogPage from "./BlogPage";
import {
  SHARED_CATEGORIES,
  VIDEO_CATEGORY,
  BLOG_CATEGORY,
  categoryNameMap,
} from "../../data/categories";

const roomType: ("APARTMENT" | "WHOLE_HOUSE" | "BOARDING_HOUSE")[] = [
  "APARTMENT",
  "WHOLE_HOUSE",
  "BOARDING_HOUSE",
];
var i = 0;

const CategoryPage = () => {
  const { type } = useParams();

  if (!type) return <div>Không xác định danh mục.</div>;

  const categoryName = categoryNameMap[type] || type.replaceAll("-", " ");

  return (
    <div>
      {/* ✅ Breadcrumb */}
      <p className="text-muted mb-3">
        <Link to="/">Trang chủ</Link> / <Link to="/category">Danh mục</Link> /{" "}
        <strong>{categoryName}</strong>
      </p>

      {/* ✅ Giao diện tùy loại */}
      {SHARED_CATEGORIES.includes(type) && (
        <CategorySharedPage title={categoryName} roomType={roomType[i++]} />
      )}

      {type === VIDEO_CATEGORY && <VideoReviewPage />}
      {type === BLOG_CATEGORY && <BlogPage />}
    </div>
  );
};

export default CategoryPage;
