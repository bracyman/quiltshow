import React, { useState } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import Login from "./Login";
import AuthService from "./services/AuthService";

const queryClient = new QueryClient();

function App() {
  const [authenticated, setAuthenticated] = useState(AuthService.loggedIn());

  const logout = () => {
    AuthService.logout();
    setAuthenticated(false);
  }

  if(!authenticated) {
    return (
        <Login />
    );
  }
  else {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <Header logout={logout}/>
          <BrowserRouter>
              <Routes>
                <Route path={"/"} exact={true} element={ <Home /> } />
                <Route path={"/quilts"} exact={true} element={ <QuiltList /> } />
              </Routes>
            </BrowserRouter>
        </div>
      </QueryClientProvider>
    );
  }
}

export default App;
