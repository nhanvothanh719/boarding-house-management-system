import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import ContactUs from "../components/ContactUs";

class ContactUsPage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <PageTitle title="Contact us page" />
        <ContactUs />
      </Fragment>
    );
  }
}

export default ContactUsPage;
