import React, { Component } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header.js";
import QuiltContextProvider from "./contexts/QuiltContext";

function App() {
  return (
    <div>
      <Header />
      <QuiltContextProvider>
        <Router>
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/quiltEntry" exact={true} element={<QuiltList />} />
          </Routes>
        </Router>
      </QuiltContextProvider>
    </div>
  );
}

export default App;
