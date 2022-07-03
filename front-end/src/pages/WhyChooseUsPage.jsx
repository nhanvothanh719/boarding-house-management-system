import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import WhyChooseUs from "../components/WhyChooseUs";
import WebPageTitle from "../components/WebPageTitle";

class WhyChooseUsPage extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Why choose us" />
        <PageTitle title="Why Choose Us" />
        <WhyChooseUs />
      </Fragment>
    );
  }
}

export default WhyChooseUsPage;
