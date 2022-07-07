import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../common/Footer";

class ContactUsPage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle=" Contact us" />
        <PageTitle title="Contact us" />
        <ContactUs />
        <Footer/>
      </Fragment>
    );
  }
}

export default ContactUsPage;
