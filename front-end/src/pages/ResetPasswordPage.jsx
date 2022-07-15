import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Row, Container, Col } from "react-bootstrap";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function ResetPasswordPage(props) {
  const [user, setCurrentUser] = useState({});
  const [input, setInput] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.user]);

  const setUser = (user) => {
    setCurrentUser(user);
  };

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
        setMessage(response.data.message);
        //Delete input after submit the form
        document.getElementById("resetPasswordForm").reset();
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
        <div class="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <WebPageTitle pageTitle="Reset password" />
      <Container fluid={true} className="loginBackground">
        <Row>
          <Col lg={4} md={2} sm={2}></Col>
          <Col lg={4} md={8} sm={8}>
            <div id="logreg-forms">
              <form id="resetPasswordForm" onSubmit={formSubmit}>
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
                    onChange={handleInput}
                    value={input.token}
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
                    onChange={handleInput}
                    value={input.email}
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
                    onChange={handleInput}
                    value={input.password}
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
                    onChange={handleInput}
                    value={input.password_confirmation}
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

export default ResetPasswordPage;
