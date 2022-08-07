import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";
import Features from "../../components/User/Features";

function FeaturesPage() {

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Features" />
      <PageTitle title="Features page" />
      <Features />
    </Fragment>
  );
}

export default FeaturesPage;
