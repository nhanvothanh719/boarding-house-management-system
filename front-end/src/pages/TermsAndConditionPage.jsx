import React, { Component, Fragment } from "react";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import TermsAndCondition from "../components/TermsAndCondition";
import WebPageTitle from "../components/WebPageTitle";
import NavBar from "../components/NavBar";
import axios from "axios";

class TermsAndConditionPage extends Component {
  constructor() {
    super();
    this.state = {
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

  render() {
    return (
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Terms and conditions" />
        <PageTitle title="All terms and conditions" />
        <TermsAndCondition />
        <Footer />
      </Fragment>
    );
  }
}

export default TermsAndConditionPage;
