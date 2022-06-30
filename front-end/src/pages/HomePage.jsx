import React, { Component, Fragment } from "react";
import Header from "../common/Header";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";
import Footer from "../common/Footer";

export class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <Header />
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
