import React from 'react'
import { useRoutes } from 'react-router-dom'
import HomePage from './pages/MainPage/HomePage'
import CategoryPage from './pages/Navigation/CategoryPage'
import HomeLayOut from './pages/MainPage/HomeLayOut'

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
        }
      ]
    }
  ])
  return routeElement
}
