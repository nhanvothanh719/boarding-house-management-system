import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgetPassword from "../components/ForgetPassword";
import UserProfile from "../components/UserProfile";

class header extends Component {
  state = {
    user: {},
  }

  componentDidMount() {
    //Get user credentials
    axios.get('/get-user-profile')
    .then((response) => {
      this.setUser(response.data)
    }).catch((error) => {
      console.log(error);
    })
  }

  setUser = (user) => {
    this.setState({user: user});
  }
 
  render() {
    return (
        <Router>
          <Nav user={this.state.user} setUser={this.setUser}/>
          <div>
            <Switch>
              <Route exact path="/" component={ Home } />
              <Route exact path="/login" component={ Login } />
              <Route exact path="/register" component={ Register } />
              <Route exact path="/forget-password" component={ ForgetPassword } />
              <Route exact path="/user-profile" component={ () => <UserProfile user={this.state.user} /> } />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default header;
