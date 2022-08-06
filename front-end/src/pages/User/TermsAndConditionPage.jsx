import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import TermsAndCondition from "../../components/User/TermsAndCondition";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function TermsAndConditionPage() {

  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  
  return (
    <Fragment>
      <WebPageTitle pageTitle="Terms and conditions" />
      <PageTitle title="All terms and conditions" />
      <TermsAndCondition />
    </Fragment>
  );
}

export default TermsAndConditionPage;
