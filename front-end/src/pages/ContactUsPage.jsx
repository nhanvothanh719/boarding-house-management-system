import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import ContactUs from "../components/ContactUs";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import axios from "axios";
import NavBar from "../components/NavBar";

function ContactUsPage(props) {
  const [user, setCurrentUser] = useState({});

  useEffect(() => {
    window.scroll(0, 0);
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.user]);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <WebPageTitle pageTitle=" Contact us" />
      <PageTitle title="Contact us" />
      <ContactUs />
      <Footer />
    </Fragment>
  );
}

export default ContactUsPage;
