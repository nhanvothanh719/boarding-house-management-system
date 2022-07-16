import React, { Fragment, useEffect, useState } from "react";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

function HomePage() {
  const [user, setCurrentUser] = useState({});

  useEffect(() => {
    window.scroll(0, 0);
    //Get user credentials
    // axios
    //   .get("/get-user-profile")
    //   .then((response) => {
    //     setUser(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });

  const setUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <WebPageTitle pageTitle="Home" />
      <TopBanner />
      <Features />
      <WhyChooseUs />
      <ContactUs />
      <Footer />
    </Fragment>
  );
}

export default HomePage;
