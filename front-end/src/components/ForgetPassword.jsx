import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class ForgetPassword extends Component {
  state = {
    email: "",
    message: "",
  };
  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
    };

    axios
      .post("/forget-password", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Forget Password</h3>
          <form onSubmit={this.formSubmit}>
            <div class="form-group">
              <label for="inputEmail">Email address</label>
              <input
                type="email"
                name="email"
                class="form-control"
                id="inputEmail"
                aria-describedby="emailHelp"
                onChange={(event) => {
                  this.setState({ email: event.target.value });
                }}
                required
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Submit
            </button>
            Have an account? <Link to="/login"> Click here </Link>
            <br />
          </form>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
