import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/MainPage/HomePage";
import CategoryPage from "./pages/Navigation/CategoryPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./App.css";
import useRouteElement from "./useRouteElement";
import { AppProvider } from './contexts/app.context';
import { WishlistProvider } from './contexts/wishlist.context';


function App() {
  const routeElement = useRouteElement();
  return (
    <AppProvider>
      <WishlistProvider>
        <div style={{ backgroundColor: "#f4f4f4" }}>{routeElement}</div>
      </WishlistProvider>
    </AppProvider>
  );
}

export default App;
