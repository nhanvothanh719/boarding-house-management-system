import React, { Component, Fragment } from "react";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    //Get user credentials
    // axios
    //   .get("/get-user-profile")
    //   .then((response) => {
    //     this.setUser(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  setUser = (user) => {
    this.setState({ user: user });
  };

  render() {
    return (
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Home" />
        <TopBanner />
        <Features />
        <WhyChooseUs />
        <ContactUs />
        <Footer />
      </Fragment>
    );
  }
}

export default HomePage;
