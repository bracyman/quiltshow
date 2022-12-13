import React, { useState } from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import AuthService from "./services/AuthService";

function Header(props) {
  let pages = [
    { route: "quilts", name: "Quilts" },
    { route: "reports", name: "Reports" },
    { route: "layout", name: "Floor Layout" },
    { route: "configuration", name: "Configuration" },
  ];


  if(!AuthService.loggedIn()) {
    return (<></>);
  }

  return (
    <>
      <Navbar light expand="md" className="page-title">
        <Nav>
          <NavbarBrand href="/quilts">
            <img src="/img/logo.jpg" width="125px" />
            <span className="site-title">Quilt Show 2023</span>
          </NavbarBrand>
        </Nav>
      </Navbar>
      <Navbar expand="md" className="site-navbar">
        <Nav navbar>
          {pages.map(page => (
            <NavItem key={page.route}>
              <NavLink
                href={`/${page.route}`}
                className={
                  window.location.href.endsWith(page.route) ? "current" : ""
                }
              >
                {page.name}
              </NavLink>
            </NavItem>
          ))}
          <NavItem key="signOut"><button onClick={() => AuthService.logout()}>Sign Out</button></NavItem>
        </Nav>
      </Navbar>
    </>
  );
}

export default Header;
