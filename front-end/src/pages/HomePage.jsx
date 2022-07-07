import React, { Component, Fragment } from "react";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../common/Footer";

class HomePage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Home" />
        <TopBanner />
        <Features />
        <WhyChooseUs />
        <ContactUs />
        <Footer/>
      </Fragment>
    );
  }
}

export default HomePage;
