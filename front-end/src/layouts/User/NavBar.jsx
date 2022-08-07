import React, { Fragment, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

function NavBar() {
  const history = useHistory();
  const [navBarTitle, setNavBarTitle] = useState("brandName");
  const [navBarColor, setNavBarColor] = useState("navBar");
  const [navBarItem, setNavBarItem] = useState("navItem");

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 300) {
        setNavBarTitle("brandName");
        setNavBarColor("navBar");
        setNavBarItem("navItem");
      } else if (window.scrollY > 300) {
        setNavBarTitle("brandNameScroll");
        setNavBarColor("navBarScroll");
        setNavBarItem("navItemScroll");
      }});
  }, []);

  const logout = (e) => {
    e.preventDefault();
    axios.post("/logout").then((response) => {
      //Remove the token
      localStorage.removeItem('auth_token');
      //Remove all user data
      swal("Success", response.data.message, "success");
      history.push("/");
    });
  };
  
  let login;
  let profile;
  if (localStorage.getItem("auth_token")) {
    login = (
      <Nav.Link>
        <NavLink
          className={navBarItem}
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
          className={navBarItem}
        >
          PROFILE
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
          className={navBarItem}
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
                className={navBarItem}
              >
                HOME
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/features"
                exact
                activeStyle={{ color: "yellow" }}
                className={navBarItem}
              >
                FEATURES
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/why-choose-us"
                exact
                activeStyle={{ color: "yellow" }}
                className={navBarItem}
              >
                WHY CHOOSE US?
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/available-rooms"
                exact
                activeStyle={{ color: "yellow" }}
                className={navBarItem}
              >
                AVAILABLE ROOMS
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink
                to="/contact-us"
                exact
                activeStyle={{ color: "yellow" }}
                className={navBarItem}
              >
                CONTACT US
              </NavLink>
            </Nav.Link>
            {profile}
            <Nav.Link>
              <NavLink
                to="/admin/dashboard"
                exact
                activeStyle={{ color: "yellow" }}
                className={navBarItem}
              >
                DASHBOARD
              </NavLink>
            </Nav.Link>
          </Nav>
          <Nav>{login}</Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  );
}

export default NavBar;
