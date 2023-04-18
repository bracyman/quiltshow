import React, { useState } from "react";
import "./App.css";
import { HashRouter, Route, Routes, } from "react-router-dom";
import { useQuery } from "react-query";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import Headless from "./Headless";
import ReportRunner from "./ReportRunner";
import Login from "./Login";
import AuthService from "./services/AuthService";
import ShowService from "./services/ShowService";
import Configuration from "./configuration/Configuration";
import ReportBuilder from "./reports/ReportBuilder";
import Layout from "./components/floorLayout/Layout";
import QuiltHangingTool from "./components/hanging/QuiltHangingTool";



function App() {
  const [authenticated, setAuthenticated] = useState(AuthService.loggedIn());
  const { data, status } = useQuery("selectedShow", async () => { return await ShowService.getSelectedShow(); });
  const { show, setShow } = useState(data);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const logout = () => {
    AuthService.logout();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <Login />
    );
  }
  else {
    if (status === "loading") {
      return (<p>Loading....</p>);
    }

    let selectedShow = show || data;
    return (
      <HashRouter>
        <Routes>
          <Route path={"/"} element={params.headless ? <Headless logout={logout} selectedShow={selectedShow} selectShow={setShow} /> : <Header logout={logout} selectedShow={selectedShow} selectShow={setShow} />} >
            <Route index element={<QuiltList show={selectedShow} />} />
            <Route path={"login"} element={<Login />} />
            <Route path={"reports"} element={<ReportRunner show={selectedShow} />} />
            <Route path={"reportBuilder"} element={<ReportBuilder show={selectedShow} />} />
            <Route path={"configuration"} element={<Configuration show={selectedShow} />} />
            <Route path={"floorLayout"} element={<Layout show={selectedShow} />} />
            <Route path={"hangingTool"} element={<QuiltHangingTool />} />
          </Route>
        </Routes>
      </HashRouter>
    );
  }
}

export default App;
