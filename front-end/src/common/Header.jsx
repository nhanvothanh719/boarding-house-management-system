import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgetPassword from "../components/ForgetPassword";
import UserProfile from "../components/UserProfile";

class header extends Component {
  render() {
    return (
        <Router>
          <Nav />
          <div>
            <Switch>
              <Route exact path="/" component={ Home } />
              <Route exact path="/login" component={ Login } />
              <Route exact path="/register" component={ Register } />
              <Route exact path="/forget-password" component={ ForgetPassword } />
              <Route exact path="/user-profile" component={ UserProfile } />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default header;
