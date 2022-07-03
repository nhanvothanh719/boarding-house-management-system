import React, { Component, Fragment } from "react";
import { Link, NavLink, } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class navBar extends Component {
  constructor() {
    super();
    this.state = {
      navBarTitle: "brandName",
      navBarColor: "navBar",
      navBarItem: "navItem",
    };
  }
  onScroll = () => {
    if (window.scrollY < 300) {
      this.setState({ navBarTitle: "brandName" });
      this.setState({ navBarColor: "navBar" });
      this.setState({ navBarItem: "navItem" });
    } else if (window.scrollY > 300) {
      this.setState({ navBarTitle: "brandNameScroll" });
      this.setState({ navBarColor: "navBarScroll" });
      this.setState({ navBarItem: "navItemScroll" });
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
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
    let login;
    let profile;
    if (localStorage.getItem("token")) {
      login = (
        <Nav.Link>
          <NavLink
            className={this.state.navBarItem}
            to="/"
            onClick={this.logout}
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
            className={this.state.navBarItem}
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
              className={this.state.navBarItem}
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
          className={this.state.navBarColor}
        >
          <Navbar.Brand >
            <NavLink exact to="/" className={this.state.navBarTitle}>
            BeeHouse
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <NavLink
                  to="/"
                  exact
                  activeStyle={{ color: "yellow" }}
                  className={this.state.navBarItem}
                >
                  HOME
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/features"
                  exact
                  activeStyle={{ color: "yellow" }}
                  className={this.state.navBarItem}
                >
                  FEATURES
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/why-choose-us"
                  exact
                  activeStyle={{ color: "yellow" }}
                  className={this.state.navBarItem}
                >
                  WHY CHOOSE US?
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/available-rooms"
                  exact
                  activeStyle={{ color: "yellow" }}
                  className={this.state.navBarItem}
                >
                  AVAILABLE ROOMS
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/contact-us"
                  exact
                  activeStyle={{ color: "yellow" }}
                  className={this.state.navBarItem}
                >
                  CONTACT US
                </NavLink>
              </Nav.Link>
              {profile}
            </Nav>
            <Nav>{login}</Nav>
          </Navbar.Collapse>
        </Navbar>
      </Fragment>
    );
  }
}

export default navBar;
