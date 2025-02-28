import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Post {
  id: number;
  title: string;
}

const CategoryPage = () => {
  const { type } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (type) {
      axios.get<Post[]>(`http://localhost:5000/posts?category=${type}`)
        .then(response => setPosts(response.data))
        .catch(error => console.error("Error fetching posts:", error));
    }
  }, [type]);

  return (
    <div>
      <h2>Trang chu / {type ? type.replace("-", " ") : "Không xác định"}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;