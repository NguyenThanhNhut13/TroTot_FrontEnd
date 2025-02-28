import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:type" element={<CategoryPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
