import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import WebPageTitle from "../components/WebPageTitle";
import NavBar from "../components/NavBar";

function RegisterPage(props) {
  const [user, setCurrentUser] = useState({});
  const [input, setInput] = useState({
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
  });
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

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
      name: input.name,
      email: input.email,
      password: input.password,
      password_confirmation: input.password_confirmation,
      gender: input.gender,
      date_of_birth: input.date_of_birth,
      id_card_number: input.id_card_number,
      phone_number: input.phone_number,
      occupation: input.occupation,
      permanent_address: input.permanent_address,
    };

    axios
      .post("/register", data)
      .then(() => {
        setIsRegisterSuccess(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  //Redirect to Login page if user registers successfully
  if (isRegisterSuccess) {
    return <Redirect to={"/login"} />;
  }
  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <WebPageTitle pageTitle="Register" />
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">Register</h3>
          <form onSubmit={formSubmit}>
            <div class="form-group">
              <label for="inputName">Full name</label>
              <input
                type="text"
                class="form-control"
                name="name"
                id="inputName"
                onChange={handleInput}
                value={input.name}
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
                onChange={handleInput}
                value={input.email}
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
                onChange={handleInput}
                value={input.password}
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
                onChange={handleInput}
                value={input.password_confirmation}
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
                onChange={handleInput}
                value={input.gender}
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
                onChange={handleInput}
                value={input.date_of_birth}
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
                onChange={handleInput}
                value={input.id_card_number}
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
                onChange={handleInput}
                value={input.phone_number}
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
                onChange={handleInput}
                value={input.occupation}
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
                onChange={handleInput}
                value={input.permanent_address}
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

export default RegisterPage;
