import React, { Component } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header.js";
import QuiltContextProvider from "./contexts/QuiltContext";
import CategoryContextProvider from "./contexts/CategoryContext";
import TagContextProvider from "./contexts/TagContext";

function App() {
  return (
    <div>
      <Header />
      <CategoryContextProvider>
      <TagContextProvider>
      <QuiltContextProvider>
        <Router>
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/quilts" exact={true} element={<QuiltList />} />
          </Routes>
        </Router>
      </QuiltContextProvider>
      </TagContextProvider>
      </CategoryContextProvider>
    </div>
  );
}

export default App;
