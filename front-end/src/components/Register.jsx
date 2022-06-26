import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Register extends Component {
  render() {
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Register</h3>
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Username</label>
              <input
                type="text"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="form-group">
              <label for="confirmedPassword">Confirmed password</label>
              <input
                type="password"
                class="form-control"
                id="confirmedPassword"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Register
            </button>
            Have an account? <Link to="/login"> Click here </Link>
            <br />
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
