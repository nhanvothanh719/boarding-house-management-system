import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

class ForgetPasswordPage extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      message: "",
      user: {},
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        this.setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setUser = (user) => {
    this.setState({ user: user });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
    };

    axios
      .post("/forget-password", data)
      .then((response) => {
        this.setState({ message: response.data.message });
        //Delete input after submit the form
        document.getElementById("forgetPasswordForm").reset();
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
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Forget password" />
        <Container
          fluid={true}
          className="loginBackground"
          style={{ minHeight: "622px" }}
        >
          <Row>
            <Col lg={4} md={2} sm={2}></Col>
            <Col lg={4} md={8} sm={8}>
              <div id="logreg-forms">
                <form id="forgetPasswordForm" onSubmit={this.formSubmit}>
                  <h3
                    class="mb-3 font-weight-normal"
                    style={{ "text-align": "center" }}
                    className="loginText"
                  >
                    Forget Password
                  </h3>
                  {error}
                  <div class="form-group">
                    <label for="inputEmail" className="formLabel">
                      Email address:
                    </label>
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
                  <button
                    type="submit"
                    class="btn btn-primary btn-block loginFormButton"
                  >
                    Submit
                  </button>
                  <Link to="/login" className="customLink">
                    {" "}
                    Have an account?{" "}
                  </Link>
                  <br />
                </form>
              </div>
            </Col>
            <Col lg={4} md={2} sm={2}></Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default ForgetPasswordPage;
