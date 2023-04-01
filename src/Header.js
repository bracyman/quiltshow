import React from "react";
import { Navbar, Nav, NavItem, NavLink, } from "react-bootstrap";
import AuthService from "./services/AuthService";
import DateUtils from "./utilities/DateUtils";

/**
 * The application header, providing navigation, user menu, sign out and show selection
 * Props
 *   - selectedShow: the currently selected show
 *   - changeSelectedShow: the function to call when a different show is selected
 * @param {*} props 
 * @returns 
 */
const Header = (props) => {
  const pages = [
    { route: "", name: "Quilts", accessLevel: "user" },
    { route: "reports", name: "Reports", accessLevel: "admin" },
    { route: "floorLayout", name: "Floor Layout", accessLevel: "admin" },
    { route: "configuration", name: "Configuration", accessLevel: "admin" },
  ];


  if (!AuthService.loggedIn()) {
    props.logout();
    return (<></>);
  }

  if (!props.selectedShow) {
    return (<></>);
  }
  else {
    let currentPage = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    return (
      <>
        <Navbar light expand="md" className="page-title">
          <Nav>
            <Navbar.Brand href="/">
              <img alt="EIHQ logo" src={props.selectedShow.logo || "/img/logo.jpg"} width="125px" />
              <span className="site-title">{props.selectedShow.name} {DateUtils.getYear(props.selectedShow.startDate)}</span>
            </Navbar.Brand>
          </Nav>
        </Navbar>
        <Navbar expand="md" className="site-navbar">
          <Nav navbar>
            {pages.filter(p => AuthService.userHasRole(p.accessLevel || "user")).map(page => (
              <NavItem key={page.route}>
                <NavLink
                  href={`/${page.route}`}
                  className={
                    currentPage === page.route ? "current" : ""
                  }
                >
                  {page.name}
                </NavLink>
              </NavItem>
            ))}
            <NavItem key="signout">
              <NavLink onClick={props.logout}>Sign Out</NavLink>
            </NavItem>
          </Nav>
        </Navbar>

      </>
    );
  }
}

export default Header;
