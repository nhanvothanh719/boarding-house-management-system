import React, { Component, Fragment } from "react";
import axios from "axios";
import "../assets/css/login.css";
import { Row, Container, Col } from "react-bootstrap";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

class ResetPasswordPage extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
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
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Reset password" />
        <Container fluid={true} className="loginBackground">
          <Row>
            <Col lg={4} md={2} sm={2}></Col>
            <Col lg={4} md={8} sm={8}>
              <div id="logreg-forms">
                <form id="resetPasswordForm" onSubmit={this.formSubmit}>
                  {error}
                  <h1
                    class="mb-3 font-weight-normal"
                    style={{ "text-align": "center" }}
                    className="loginText"
                  >
                    Reset Password
                  </h1>
                  <div class="form-group">
                    <label for="inputToken" className="formLabel">
                      Pin code:
                    </label>
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
                    <label for="inputEmail" className="formLabel">
                      Email address:
                    </label>
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
                    <label for="inputPassword" className="formLabel">
                      New password:
                    </label>
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
                    <label for="confirmedPassword" className="formLabel">
                      Confirmed password:
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      class="form-control"
                      id="confirmedPassword"
                      onChange={(e) => {
                        this.setState({
                          password_confirmation: e.target.value,
                        });
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

export default ResetPasswordPage;
