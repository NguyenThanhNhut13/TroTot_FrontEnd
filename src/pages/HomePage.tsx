import React from "react";
import CategoryList from "../components/category/CategoryList";

const HomePage = () => {
  return (
    <div>
      <h1>Chào mừng đến với Tromoi</h1>
      <p>
        Tìm kiếm nhà trọ, phòng trọ, nhà nguyên căn, căn hộ chung cư dễ dàng.
      </p>
      <CategoryList />
    </div>
  );
};

export default HomePage;
