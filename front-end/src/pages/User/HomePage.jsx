import React, { Fragment, useEffect } from "react";

import Features from "../../components/User/Features";
import TopBanner from "../../components/User/TopBanner";
import WhyChooseUs from "../../components/User/WhyChooseUs";
import ContactUs from "../../components/User/ContactUs";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function HomePage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Home" />
      <TopBanner />
      <Features />
      <WhyChooseUs />
      <ContactUs />
    </Fragment>
  );
}

export default HomePage;
