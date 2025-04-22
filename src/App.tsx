import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/MainPage/HomePage";
import CategoryPage from "./pages/Navigation/CategoryPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./App.css";
import useRouteElement from "./useRouteElement";

function App() {
  const routeElement = useRouteElement();
  return (
      <div>{routeElement}</div>
  );
}

export default App;
