import React, { useState } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { useQuery } from "react-query";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import ReportRunner from "./ReportRunner";
import Login from "./Login";
import AuthService from "./services/AuthService";
import ShowService from "./services/ShowService";
import Configuration from "./configuration/Configuration";
import ReportBuilder from "./reports/ReportBuilder";



function App() {
  const [authenticated, setAuthenticated] = useState(AuthService.loggedIn());
  const {data, status} = useQuery("selectedShow", async () => { return await ShowService.getSelectedShow(); });
  const {show, setShow} = useState(data);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

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
          {params.headless ? <></> : <Header logout={logout} selectedShow={selectedShow} selectShow={setShow}/>}
          <BrowserRouter>
              <Routes>
                <Route path={"/"} exact={true} element={ <QuiltList show={selectedShow} /> } />
                <Route path={"/reports"} exact={true} element={ <ReportRunner show={selectedShow} /> } />
                <Route path={"/reportBuilder"} exact={true} element={<ReportBuilder show={selectedShow} /> } />
                <Route path={"/configuration"} exact={true} element={ <Configuration show={selectedShow} /> } />
              </Routes>
            </BrowserRouter>
        </>
    );
  }
}

export default App;
