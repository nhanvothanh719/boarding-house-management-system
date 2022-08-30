import React, { Fragment, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

function NavBar() {
  const history = useHistory();
  const [navBarTitle, setNavBarTitle] = useState("brandName");
  const [navBarColor, setNavBarColor] = useState("navBar");

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 300) {
        setNavBarTitle("brandName");
        setNavBarColor("navBar");
      } else if (window.scrollY > 300) {
        setNavBarTitle("brandNameScroll");
        setNavBarColor("navBarScroll");
      }});
      return () => {
        setNavBarTitle(("brandName"));
        setNavBarColor("navBar");
      };
  }, []);

  const logout = (e) => {
    e.preventDefault();
    axios.post("/logout").then((response) => {
      //Remove the token
      // localStorage.removeItem('auth_token');
      localStorage.clear();
      //Remove all user data
      swal("Success", response.data.message, "success");
      history.push("/");
    });
  };
  
  let login;
  let profile;
  let dashboard;
  let renterActivities;

  if (localStorage.getItem("auth_token")) {
    login = (
      <Nav.Link>
        <NavLink
          className="navItem"
          to="/"
          onClick={logout}
          exact
          activeStyle={{ color: "yellow" }}
        >
          LOGOUT
        </NavLink>
      </Nav.Link>
    );
    profile = (
      <Nav.Link>
        <NavLink
          to="/user-profile"
          exact
          activeStyle={{ color: "yellow" }}
          className="navItem"
        >
          PROFILE
        </NavLink>
      </Nav.Link>
    );
    renterActivities = (
      <Navbar className="customNavbar">
      <Container fluid>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown
              title="DETAILS"
              className="navItem"
            >
              <NavDropdown.Item href="#action/3.1" className="customDropdownItem">Room details</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" className="customDropdownItem">Suggestions</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3" className="customDropdownItem">Services registration</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
    dashboard = (
      <Nav.Link>
      <NavLink
        to="/admin/dashboard"
        exact
        activeStyle={{ color: "yellow" }}
        className="navItem"
      >
        DASHBOARD
      </NavLink>
    </Nav.Link>
    );
  } else {
    login = (
      <Nav.Link>
        <NavLink
          to="/login"
          exact
          activeStyle={{ color: "yellow" }}
          className="navItem"
        >
          LOGIN
        </NavLink>
      </Nav.Link>
    );
  }

  return (
    <Fragment>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="lg"
        variant="dark"
        className={navBarColor}
      >
        <Navbar.Brand>
          <NavLink exact to="/" className={navBarTitle}>
            BeeHouse
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              <NavLink
                to="/"
                exact
                activeStyle={{ color: "yellow" }}
                className="navItem"
              >
                HOME
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/features"
                exact
                activeStyle={{ color: "yellow" }}
                className="navItem"
              >
                FEATURES
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/why-choose-us"
                exact
                activeStyle={{ color: "yellow" }}
                className="navItem"
              >
                WHY CHOOSE US?
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/available-rooms"
                exact
                activeStyle={{ color: "yellow" }}
                className="navItem"
              >
                AVAILABLE ROOMS
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/contact-us"
                exact
                activeStyle={{ color: "yellow" }}
                className="navItem"
              >
                CONTACT US
              </NavLink>
            </Nav.Link>
            {profile}
            {renterActivities}
            {dashboard}
          </Nav>
          <Nav>{login}</Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  );
}

export default NavBar;
