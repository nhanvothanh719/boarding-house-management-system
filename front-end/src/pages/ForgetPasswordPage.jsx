import React, { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useEffect } from "react";

function ForgetPasswordPage(props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [user, setCurrentUser] = useState({});

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
      email: email,
    };

    axios
      .post("/forget-password", data)
      .then((response) => {
        setMessage(response.data.message);
        //Delete input after submit the form
        document.getElementById("forgetPasswordForm").reset();
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
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
              <form id="forgetPasswordForm" onSubmit={formSubmit}>
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
                      setEmail(event.target.value);
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

export default ForgetPasswordPage;
