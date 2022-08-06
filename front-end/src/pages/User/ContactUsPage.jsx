import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";
import ContactUs from "../../components/User/ContactUs";

function ContactUsPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle=" Contact us" />
      <PageTitle title="Contact us" />
      <ContactUs />
    </Fragment>
  );
}

export default ContactUsPage;
