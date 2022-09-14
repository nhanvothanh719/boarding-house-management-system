import React, { Fragment, useEffect, useState } from "react";
import { Row, Container, Col } from "react-bootstrap";

import axios from "axios";

import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";
import NavBar from "../../layouts/User/NavBar";
import Footer from "../../layouts/User/Footer";
import swal from "sweetalert";

function ResetPasswordPage(props) {
  const [input, setInput] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();
    const data = {
      token: input.token,
      email: input.email,
      password: input.password,
      password_confirmation: input.password_confirmation,
    };

    axios
      .post("/reset-password", data)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          document.getElementById("resetPasswordForm").reset();
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        } else if (response.data.status === 403) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  //Display error message
  let error = "";
  if (message) {
    error = (
      <div>
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <NavBar/>
      <WebPageTitle pageTitle="Reset password" />
      <Container fluid={true} className="loginBackground">
        <Row>
          <Col lg={4} md={2} sm={2}></Col>
          <Col lg={4} md={8} sm={8}>
            <div id="logreg-forms">
              <form id="resetPasswordForm" onSubmit={formSubmit}>
                {error}
                <h1
                  className="mb-3 font-weight-normal loginText"
                  style={{ "textAlign": "center" }}
                >
                  Reset Password
                </h1>
                <div className="form-group">
                  <label for="inputToken" className="formLabel">
                    Pin code:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="token"
                    id="inputToken"
                    onChange={handleInput}
                    value={input.token}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="inputEmail" className="formLabel">
                    Email address:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="inputEmail"
                    aria-describedby="emailHelp"
                    onChange={handleInput}
                    value={input.email}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="inputPassword" className="formLabel">
                    New password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="inputPassword"
                    onChange={handleInput}
                    value={input.password}
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="confirmedPassword" className="formLabel">
                    Confirmed password:
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    className="form-control"
                    id="confirmedPassword"
                    onChange={handleInput}
                    value={input.password_confirmation}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block loginFormButton"
                >
                  Submit
                </button>
              </form>
            </div>
          </Col>
          <Col lg={4} md={2} sm={2}></Col>
        </Row>
      </Container>
      <Footer/>
    </Fragment>
  );
}

export default ResetPasswordPage;
