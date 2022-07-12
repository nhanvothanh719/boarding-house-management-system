import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import WebPageTitle from "../components/WebPageTitle";
import NavBar from "../components/NavBar";

class RegisterPage extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      gender: "",
      date_of_birth: "",
      id_card_number: "",
      phone_number: "",
      occupation: "",
      permanent_address: "",
      message: "",
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
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
      gender: this.state.gender,
      date_of_birth: this.state.date_of_birth,
      id_card_number: this.state.id_card_number,
      phone_number: this.state.phone_number,
      occupation: this.state.occupation,
      permanent_address: this.state.permanent_address,
    };

    axios
      .post("/register", data)
      .then(() => {
        this.setState({
          isRegisterSuccess: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    //Redirect to Login page if user registers successfully
    if (this.state.isRegisterSuccess) {
      return <Redirect to={"/login"} />;
    }
    return (
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Register" />
        <div class="row">
          <div class="jumbotron col-lg-4 offset-lg-4">
            <h3 class="text-center">Register</h3>
            <form onSubmit={this.formSubmit}>
              <div class="form-group">
                <label for="inputName">Full name</label>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  id="inputName"
                  aria-describedby="emailHelp"
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="inputEmail">Email address</label>
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
                <label for="inputPassword">Password</label>
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
                <label for="confirmedPassword">Confirmed password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  class="form-control"
                  id="confirmedPassword"
                  onChange={(e) => {
                    this.setState({ password_confirmation: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="gender">Gender</label>
                <input
                  type="text"
                  name="gender"
                  class="form-control"
                  id="gender"
                  onChange={(e) => {
                    this.setState({ gender: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="date_of_birth">Date of birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  class="form-control"
                  id="date_of_birth"
                  onChange={(e) => {
                    this.setState({ date_of_birth: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="id_card_number">ID card number</label>
                <input
                  type="text"
                  name="id_card_number"
                  class="form-control"
                  id="id_card_number"
                  onChange={(e) => {
                    this.setState({ id_card_number: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="phone_number">Phone number</label>
                <input
                  type="text"
                  name="phone_number"
                  class="form_control"
                  id="phone_number"
                  onChange={(e) => {
                    this.setState({ phone_number: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="gender">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  class="form-control"
                  id="occupation"
                  onChange={(e) => {
                    this.setState({ occupation: e.target.value });
                  }}
                  required
                />
              </div>
              <div class="form-group">
                <label for="permanent_address">Address</label>
                <input
                  type="text"
                  name="permanent_address"
                  class="form-control"
                  id="permanent_address"
                  onChange={(e) => {
                    this.setState({ permanent_address: e.target.value });
                  }}
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Register
              </button>
              Have an account? <Link to="/login"> Click here </Link>
              <br />
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RegisterPage;
