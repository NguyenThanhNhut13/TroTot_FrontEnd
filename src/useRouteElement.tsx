import React from 'react'
import { useRoutes } from 'react-router-dom'
import HomePage from './pages/MainPage/HomePage'
import path from 'path'
import CategoryPage from './pages/Navigation/CategoryPage'
import HomeLayOut from './pages/MainPage/HomeLayOut'

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
        path:'/',
        element: <HomeLayOut/>
    },
    {
        path: '/category/:type',
        element: <CategoryPage />
    }
  ])
  return routeElement
}