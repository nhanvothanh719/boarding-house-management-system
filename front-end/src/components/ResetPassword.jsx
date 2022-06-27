import React, { Component } from "react";
import axios from "axios";

class ResetPassword extends Component {
  state = {
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      token: this.state.token,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };

    axios
      .post("/reset-password", data)
      .then((response) => {
        this.setState({ message: response.data.message });
        //Delete input after submit the form
        document.getElementById("resetPasswordForm").reset();
      })
      .catch((error) => {
        this.setState({ message: error.response.data.message });
      });
  };

  render() {
    //Display error message
    let error = "";
    if (this.state.message) {
      error = (
        <div>
          <div class="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        </div>
      );
    }
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Reset Password</h3>
          <form id="resetPasswordForm" onSubmit={this.formSubmit}>
            {error}
            <div class="form-group">
              <label for="inputToken">Pin code</label>
              <input
                type="text"
                class="form-control"
                name="token"
                id="inputToken"
                onChange={(e) => {
                  this.setState({ token: e.target.value });
                }}
                required
              />
            </div>
            <div class="form-group">
              <label for="inputEmail">Email address</label>
              <input
                type="email"
                class="form-control"
                name="email"
                id="inputEmail"
                aria-describedby="emailHelp"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                required
              />
            </div>
            <div class="form-group">
              <label for="inputPassword">New password</label>
              <input
                type="password"
                class="form-control"
                name="password"
                id="inputPassword"
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
                required
              />
            </div>
            <div class="form-group">
              <label for="confirmedPassword">Confirmed password</label>
              <input
                type="password"
                name="password_confirmation"
                class="form-control"
                id="confirmedPassword"
                onChange={(e) => {
                  this.setState({ password_confirmation: e.target.value });
                }}
                required
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
