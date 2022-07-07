import React, { Component, Fragment } from "react";
import Footer from "../common/Footer";
import PageTitle from "../components/PageTitle";
import TermsAndCondition from "../components/TermsAndCondition";
import WebPageTitle from "../components/WebPageTitle";

class TermsAndConditionPage extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Terms and conditions" />
        <PageTitle title="All terms and conditions" />
        <TermsAndCondition />
        <Footer/>
      </Fragment>
    );
  }
}

export default TermsAndConditionPage;
