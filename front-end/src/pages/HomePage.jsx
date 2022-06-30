import React, { Component, Fragment } from "react";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <TopBanner />
        <Features />
        <WhyChooseUs />
        <ContactUs />
      </Fragment>
    );
  }
}

export default HomePage;
