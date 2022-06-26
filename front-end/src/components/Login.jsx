import React, { Component } from "react";
import axios from 'axios';
import "../assets/css/Login.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: '',
    password: '',
    message: '',
  }

  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password, 
    };
    axios.post('/login', data)
    .then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  }
  render() {
    return (
        <div id="logreg-forms">
          <form class="form-signin" onSubmit={this.formSubmit}>
            <h1 class="h3 mb-3 font-weight-normal" style={{ "text-align": "center" }}>
              Sign in
            </h1>
            <div class="social-login row">
              <div class="px-md-1">
              <button class="btn facebook-btn social-btn" type="button">
                <span class="font-weight-bolder">
                  <i class="fab fa-facebook-f"></i> Sign in with Facebook
                </span>{" "}
              </button>
              </div>
              <div>
              <button class="btn google-btn social-btn" type="button">
                <span class="font-weight-bolder">
                  <i class="fab fa-google-plus-g"></i> Sign in with Google
                </span>{" "}
              </button>
              </div>
            </div>
            <p style={{ "text-align": "center" }}> OR </p>
            <input
              type="email"
              name="email"
              class="form-control"
              placeholder="Email address"
              onChange={(event) => {this.setState({email:event.target.value})}}
              required
            />
            <input
              type="password"
              name="password"
              class="form-control"
              placeholder="Password"
              onChange={(event) => {this.setState({password:event.target.value})}}
              required
            />
            <button class="btn btn-success btn-block" type="submit">
              <i class="fas fa-sign-in-alt"></i> Sign in
            </button>
            <Link to="/forget-password">Forgot password?</Link>
            <hr />
            <button
              class="btn btn-primary btn-block"
              type="button"
              id="btn-signup"
            >
              <i class="fas fa-user-plus"></i> Sign up New Account
            </button>
          </form>
          <br />
        </div>
    );
  }
}

export default Login;
