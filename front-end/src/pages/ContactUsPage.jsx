import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import axios from "axios";
import { NavBar } from "../components/NavBar";

class ContactUsPage extends Component {
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
        console.log(response.data);
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
        <WebPageTitle pageTitle=" Contact us" />
        <PageTitle title="Contact us" />
        <ContactUs />
        <Footer />
      </Fragment>
    );
  }
}

export default ContactUsPage;
