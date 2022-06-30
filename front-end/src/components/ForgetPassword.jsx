import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

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
      <Container fluid={true} className="loginBackground">
        <Row>
        <Col lg={4} md={2} sm={2}></Col>
        <Col lg={4} md={8} sm={8}>
          <div id="logreg-forms">
          <form id="forgetPasswordForm" onSubmit={this.formSubmit}>
          <h3 class="mb-3 font-weight-normal"
              style={{ "text-align": "center" }}
              className="loginText">Forget Password</h3>
            { error }
            <div class="form-group">
              <label for="inputEmail" className="formLabel">Email address:</label>
              <input
                type="email"
                name="email"
                class="form-control"
                id="inputEmail"
                aria-describedby="emailHelp"
                placeholder="Email to reset password"
                onChange={(event) => {
                  this.setState({ email: event.target.value });
                }}
                required
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block formButton">
              Submit
            </button>
             <Link to="/login"> Have an account? </Link>
            <br />
          </form>
          </div>
        </Col>
        <Col lg={4} md={2} sm={2}></Col>
      </Row>
      </Container>
    );
  }
}

export default ForgetPassword;
