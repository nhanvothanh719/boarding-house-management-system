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
        this.setState({message: response.data.message});
        //Delete input after submit the form
        document.getElementById("forgetPasswordForm").reset();
      })
      .catch((error) => {
        this.setState({message: error.response.data.message});
      });
  };
  render() {
    //Display error message
    let error="";
    if (this.state.message) {
      error = (
        <div>
          <div class="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        </div>
      )
    }
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Forget Password</h3>
          <form id="forgetPasswordForm" onSubmit={this.formSubmit}>
            { error }
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
