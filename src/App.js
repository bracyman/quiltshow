import React, { useState } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useQuery } from "react-query";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import Login from "./Login";
import AuthService from "./services/AuthService";
import ShowService from "./services/ShowService";
import Configuration from "./configuration/Configuration";




function App() {
  const [authenticated, setAuthenticated] = useState(AuthService.loggedIn());
  const {data, status} = useQuery("selectedShow", async () => { return await ShowService.getSelectedShow(); });
  const {show, setShow} = useState(data);


  const logout = () => {
    AuthService.logout();
    setAuthenticated(false);
  };

  if(!authenticated) {
    return (
        <Login />
    );
  }
  else {
    if(status === "loading") {
      return (<p>Loading....</p>);
    }

    let selectedShow = show || data;
    return (
        <>
          <Header logout={logout} selectedShow={selectedShow} selectShow={setShow}/>
          <BrowserRouter>
              <Routes>
                <Route path={"/"} exact={true} element={ <Home show={selectedShow} /> } />
                <Route path={"/quilts"} exact={true} element={ <QuiltList show={selectedShow} /> } />
                <Route path={"/configuration"} exact={true} element={ <Configuration show={selectedShow} /> } />
              </Routes>
            </BrowserRouter>
        </>
    );
  }
}

export default App;
