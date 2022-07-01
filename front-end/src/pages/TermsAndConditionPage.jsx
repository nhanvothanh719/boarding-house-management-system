import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import TermsAndCondition from "../components/TermsAndCondition";

class TermsAndConditionPage extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    return (
      <Fragment>
        <PageTitle title="All terms and condition" />
        <TermsAndCondition />
      </Fragment>
    );
  }
}

export default TermsAndConditionPage;
