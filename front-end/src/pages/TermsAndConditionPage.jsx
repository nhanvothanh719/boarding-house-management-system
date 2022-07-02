import React, { Component, Fragment } from "react";
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
      </Fragment>
    );
  }
}

export default TermsAndConditionPage;
