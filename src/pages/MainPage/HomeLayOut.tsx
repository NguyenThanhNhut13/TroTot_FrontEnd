import React from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Outlet } from 'react-router-dom'

export default function HomeLayOut() {
  return (
    <div>
      <Header />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
