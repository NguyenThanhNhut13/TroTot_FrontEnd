import React from 'react'
import { useRoutes } from 'react-router-dom'
import HomePage from './pages/MainPage/HomePage'
import CategoryPage from './pages/Navigation/CategoryPage'
import HomeLayOut from './pages/MainPage/HomeLayOut'
import PostRoomPage from './pages/CategoriesPage/PostRoomPage' // thêm import cho trang đăng tin
import RoomPostForm from './pages/CategoriesPage/RoomPostForm' // thêm import cho trang đăng tin

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '/',
      element: <HomeLayOut />, // chứa Header + Footer
      children: [
        {
          index: true, // tương đương path: ''
          element: <HomePage />
        },
        {
          path: 'category/:type',
          element: <CategoryPage />
        },
        {
          path:'/post-room',
          element: <PostRoomPage /> // thêm đường dẫn mới cho trang đăng tin
        },
        {
          path:'/post-room/:type',
          element: <RoomPostForm /> 
        }
      ]
    }
  ])
  return routeElement
}
