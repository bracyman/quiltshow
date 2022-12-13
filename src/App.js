import React, { Component } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import Login from "./Login";
import AuthService from "./services/AuthService";

function App() {

  if(!AuthService.loggedIn()) {
    return (
        <Login />
    );
  }
  else {
    return (
        <div>
          <Header />
          <BrowserRouter>
              <Routes>
                <Route path={"/"} exact={true} element={ <Home /> } />
                <Route path={"/quilts"} exact={true} element={ <QuiltList /> } />
              </Routes>
            </BrowserRouter>
        </div>
    );
  }
}

export default App;
