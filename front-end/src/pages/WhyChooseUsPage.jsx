import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import WhyChooseUs from "../components/WhyChooseUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

class WhyChooseUsPage extends Component {
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
        <WebPageTitle pageTitle="Why choose us" />
        <PageTitle title="Why Choose Us" />
        <WhyChooseUs />
        <Footer />
      </Fragment>
    );
  }
}

export default WhyChooseUsPage;
