import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

class navBar extends Component {
  constructor() {
    super();
    this.state={
      navBarTitle: "branchName",
    }
  }
  onScroll = () => {
    if(window.scrollY > 100) {
      this.setState({navBarTitle:'brandNameScroll'});
    } else if(window.scrollY < 100) {
      this.setState({navBarTitle:'brandName'});
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  state = {
    isLogout: "",
  };
  logout = () => {
    //Remove the token
    localStorage.clear();
    //Remove all user data
    this.props.setUser(null);
  };
  render() {
    let buttons;
    let profile;
    if (localStorage.getItem("token")) {
      buttons = (
        <div>
          <Link class="nav-link" to="/" onClick={this.logout}>
            Logout
          </Link>
        </div>
      );
      profile = (
        <div>
          <Link class="nav-link" to="/user-profile">
            Profile
          </Link>
        </div>
      );
    } else {
      buttons = (
        <div>
          <ul class="navbar-nav mr-auto">
            <Link class="nav-link" to="/login">
              Login
            </Link>
            <li class="nav-item">
              <Link class="nav-link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <Fragment>
        {/* <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link class="nav-link" to="/">
            MyApp
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <Link class="nav-link" to="/">
                  Home <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li class="nav-item">{profile}</li>
            </ul>
            <span class="navbar-text">{buttons}</span>
          </div>
        </nav> */}

        <Navbar
          collapseOnSelect
          fixed="top"
          expand="lg"
          bg="dark"
          variant="dark"
        >
          <Navbar.Brand className={this.state.navBarTitle} href="#home">BeeHouse</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#features">Home</Nav.Link>
              <Nav.Link href="#">Features</Nav.Link>
              <Nav.Link href="#pricing">Contact us</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Nav>
              <Nav.Link href="">LOGIN</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Fragment>
    );
  }
}

export default navBar;
