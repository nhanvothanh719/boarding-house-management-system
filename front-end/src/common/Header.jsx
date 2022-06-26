import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Nav from "./Nav";
import Home from "../components/Home";

class header extends Component {
  render() {
    return (
        <Router>
          <Nav />
          <div>
            <Switch>
              <Route exact path="/" component={ Home } />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default header;
