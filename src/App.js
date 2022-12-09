import React, { Component } from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuiltList from "./components/quilts/QuiltList";
import Header from "./Header";
import Login from "./Login";
import QuiltContextProvider from "./contexts/QuiltContext";
import CategoryContextProvider from "./contexts/CategoryContext";
import TagContextProvider from "./contexts/TagContext";
import { useAuthUser, RequireAuth } from "react-auth-kit";

function App() {
  const auth = useAuthUser();

  return (
    <div>
      <Header />
      <CategoryContextProvider>
        <TagContextProvider>
          <QuiltContextProvider>
          <BrowserRouter>
              <Routes>
                <Route
                  path={"/"}
                  exact={true}
                  element={
                    <RequireAuth loginPath={"/login"}>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route
                  path={"/quilts"}
                  exact={true}
                  element={
                    <RequireAuth loginPath={"/login"}>
                      <QuiltList />
                    </RequireAuth>
                  }
                />
                <Route path={"/login"} exact={true} element={<Login />} />
              </Routes>
            </BrowserRouter>
          </QuiltContextProvider>
        </TagContextProvider>
      </CategoryContextProvider>
    </div>
  );
}

export default App;
