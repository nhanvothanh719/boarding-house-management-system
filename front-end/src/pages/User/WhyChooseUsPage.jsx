import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import WhyChooseUs from "../../components/User/WhyChooseUs";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function WhyChooseUsPage(props) {

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Why choose us" />
      <PageTitle title="Why Choose Us" />
      <WhyChooseUs />
    </Fragment>
  );
}

export default WhyChooseUsPage;
