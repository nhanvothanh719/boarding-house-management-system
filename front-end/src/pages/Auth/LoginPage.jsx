import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import axios from "axios";
import swal from "sweetalert";

import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";
import NavBar from "../../layouts/User/NavBar";
import Footer from "../../layouts/User/Footer";
import AppUrl from "../../RestAPI/AppUrl";
import "../../assets/css/Login.css";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    axios
      .post(AppUrl.Login, data)
      .then((response) => {
        if (response.data.status === 200) {
          localStorage.setItem("auth_token", response.data.token);
          console.log(response.data);
          setIsLogin(true);
          setIsAdmin(response.data.isAdmin);
          swal("Success", response.data.message, "success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Redirect to Profile page if user logs in successfully
  if (isLogin) {
    if (isAdmin === true) {
      return <Redirect to={"/admin/dashboard"} />;
    } else {
      return <Redirect to={"/home"} />;
    }
  }
  return (
    <Fragment>
      <NavBar/>
      <WebPageTitle pageTitle="Login" />
      <Container fluid={true} className="loginBackground">
        <Row>
          <Col lg={4} md={2} sm={2}></Col>
          <Col lg={4} md={8} sm={8}>
            <div id="logreg-forms">
              <form className="form-signin" onSubmit={formSubmit}>
                <h1
                  className="mb-3 font-weight-normal loginText"
                  style={{ "textAlign": "center" }}
                >
                  - Sign in -
                </h1>

                <Row>
                  <Col>
                    <button className="btn facebook-btn social-btn" type="button">
                      <span className="font-weight-bolder">
                        <i className="fab fa-facebook-f"></i> Login with Facebook
                      </span>{" "}
                    </button>
                  </Col>
                  <Col>
                    <button className="btn google-btn social-btn" type="button">
                      <span className="font-weight-bolder">
                        <i className="fab fa-google-plus-g"></i> Login with Google
                      </span>{" "}
                    </button>
                  </Col>
                </Row>
                <p
                  style={{ "textAlign": "center", margin: "5px" }}
                  className="loginText"
                >
                  {" "}
                  --- OR ---{" "}
                </p>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  required
                />
                <button
                  className="btn btn-success btn-block loginFormButton"
                  type="submit"
                >
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </button>
                <Link to="/forget-password" className="customLink">
                  Forgot password?
                </Link>
                <hr />
                <button
                  className="btn btn-primary btn-block loginFormButton"
                  type="button"
                  id="btn-signup"
                >
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <i className="fas fa-user-plus"></i> Sign up
                  </Link>
                </button>
              </form>
              <br />
            </div>
          </Col>
          <Col lg={4} md={2} sm={2}></Col>
        </Row>
      </Container>
      <Footer/>
    </Fragment>
  );
}

export default LoginPage;
