import { Post } from "../../data/mockPosts";

interface Props {
  posts: Post[];
}

const BlogPage = ({ posts }: Props) => {
  return (
    <div>
      <h2>Blog</h2>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
