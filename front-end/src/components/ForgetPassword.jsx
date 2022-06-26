import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class ForgetPassword extends Component {
  render() {
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Forget Password</h3>
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
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
