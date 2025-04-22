import React from 'react'
import { useRoutes } from 'react-router-dom'
import HomePage from './pages/MainPage/HomePage'
import CategoryPage from './pages/Navigation/CategoryPage'
import HomeLayOut from './pages/MainPage/HomeLayOut'
import PostRoomPage from './pages/RoomPostPage/PostRoomPage' // thêm import cho trang đăng tin
import RoomPostForm from './pages/RoomPostPage/RoomPostForm' // thêm import cho trang đăng tin
import DepositPage from './pages/PayPage/DepositPage'


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
        },
        {
          path:'/deposit',
          element: <DepositPage /> // thêm đường dẫn mới cho trang đăng tin
        }
      ]
    }
  ])
  return routeElement
}
