import React, { Fragment, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

function NavBar() {
  const history = useHistory();
  const [navBarTitle, setNavBarTitle] = useState("brandName");
  const [navBarColor, setNavBarColor] = useState("navBar");
  const [navBarItemsListChange, setNavBarItemsListChange] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 300) {
        setNavBarTitle("brandName");
        setNavBarColor("navBar");
      } else if (window.scrollY > 300) {
        setNavBarTitle("brandNameScroll");
        setNavBarColor("navBarScroll");
      }});
      if (navBarItemsListChange) {
        setNavBarItemsListChange(false);
      }
      return () => {
        setNavBarTitle(("brandName"));
        setNavBarColor("navBar");
      };
  }, [navBarItemsListChange]);

  const logout = (e) => {
    e.preventDefault();
    axios.post("/logout").then((response) => {
      //Remove the token
      localStorage.clear();
      localStorage.removeItem('auth_token');
      //Remove all user data
      setNavBarItemsListChange(true);
      swal("Success", response.data.message, "success");
      history.push("/");
      //Refresh page
      window.location.reload();
    });
  };
  
  let login;
  let profile;
  let activities;

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

  if (localStorage.getItem("user_role") === "renter") {
    activities = (
      <Navbar className="customNavbar">
      <Container fluid>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown
              title="DETAILS"
              className="navItem"
            >
              <NavDropdown.Item href="/renter/view-room-details" className="customDropdownItem">Room details</NavDropdown.Item>
              <NavDropdown.Item href="/renter/register-optional-service" className="customDropdownItem">Services registration</NavDropdown.Item>
              <NavDropdown.Item href="/renter/view-all-invoices" className="customDropdownItem">Invoices payment</NavDropdown.Item>
              <NavDropdown.Item href="/renter/view-all-breach-histories" className="customDropdownItem">Breach histories</NavDropdown.Item>
              <NavDropdown.Item href="/renter/send-problem" className="customDropdownItem">Problem creating</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
  } else if (localStorage.getItem("user_role") === "admin") {
    activities = (
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
            {activities}
          </Nav>
          <Nav>{login}</Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  );
}

export default NavBar;
