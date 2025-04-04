import { Post } from "../data/mockPosts";

interface Props {
  posts: Post[];
  title: string;
}

const CategorySharedPage = ({ posts, title }: Props) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul className="list-group">
        {posts.map(post => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySharedPage;
