import React, { Component, Fragment } from "react";
import axios from "axios";
import "../assets/css/Login.css";
import { Link, Redirect } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import alert from "sweetalert";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";

class LoginPage extends Component {

  constructor() {
    super();
    this.state = {
      user: {},
      email: "",
      password: "",
      message: "",
    };
  }
  
  componentDidMount() {
    window.scroll(0, 0);
    //Get user credentials
    // if(RestClient.GetRequest(AppUrl.CheckAuthenticated).then((response) => (!response.is_admin)))
    // {
    //   axios
    //   .get("/get-user-profile")
    //   .then((response) => {
    //     console.log(response.data);
    //     this.setUser(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // }
  }

  setUser = (user) => {
    this.setState({ user: user });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("/login", data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        this.setState({
          isLogin: true,
        });
        this.props.setUser(response.data.user);
        alert("Success", response.data.message, "success");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    //Redirect to Profile page if user logs in successfully
    if (this.state.isLogin) {
      //return <Redirect to={"/user-profile"} />;
    }
    //Protect URL
    if (localStorage.getItem("token")) {
      return <Redirect to={"user-profile"} />;
    }
    return (
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Login" />
        <Container fluid={true} className="loginBackground">
          <Row>
            <Col lg={4} md={2} sm={2}></Col>
            <Col lg={4} md={8} sm={8}>
              <div id="logreg-forms">
                <form class="form-signin" onSubmit={this.formSubmit}>
                  <h1
                    class="mb-3 font-weight-normal"
                    style={{ "text-align": "center" }}
                    className="loginText"
                  >
                    - Sign in -
                  </h1>

                  <Row>
                    <Col>
                      <button class="btn facebook-btn social-btn" type="button">
                        <span class="font-weight-bolder">
                          <i class="fab fa-facebook-f"></i> Login with Facebook
                        </span>{" "}
                      </button>
                    </Col>
                    <Col>
                      <button class="btn google-btn social-btn" type="button">
                        <span class="font-weight-bolder">
                          <i class="fab fa-google-plus-g"></i> Login with Google
                        </span>{" "}
                      </button>
                    </Col>
                  </Row>
                  <p
                    style={{ "text-align": "center", margin: "5px" }}
                    className="loginText"
                  >
                    {" "}
                    --- OR ---
                    {" "}
                  </p>
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="Email address"
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                    }}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    placeholder="Password"
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                    required
                  />
                  <button
                    class="btn btn-success btn-block loginFormButton"
                    type="submit"
                  >
                    <i class="fas fa-sign-in-alt"></i> Sign in
                  </button>
                  <Link to="/forget-password" className="customLink">
                    Forgot password?
                  </Link>
                  <hr />
                  <button
                    class="btn btn-primary btn-block loginloginFormButton"
                    type="button"
                    id="btn-signup"
                  >
                    <Link
                      to="/register"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <i class="fas fa-user-plus"></i> Sign up
                    </Link>
                  </button>
                </form>
                <br />
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

export default LoginPage;
