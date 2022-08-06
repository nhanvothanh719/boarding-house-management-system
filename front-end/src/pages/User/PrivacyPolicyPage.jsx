import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import PrivacyPolicy from "../../components/User/PrivacyPolicy";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function PrivacyPolicyPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Privacy policy" />
      <PageTitle title="Privacy Policy" />
      <PrivacyPolicy />
    </Fragment>
  );
}

export default PrivacyPolicyPage;
