import React, { Component, Fragment } from "react";
import Footer from "../common/Footer";
import PageTitle from "../components/PageTitle";
import PrivacyPolicy from "../components/PrivacyPolicy";
import WebPageTitle from "../components/WebPageTitle";

class PrivacyPolicyPage extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Privacy policy" />
        <PageTitle title="Privacy Policy" />
        <PrivacyPolicy />
        <Footer/>
      </Fragment>
    );
  }
}

export default PrivacyPolicyPage;
