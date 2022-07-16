import React, { Fragment, useEffect, useState } from "react";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import PrivacyPolicy from "../components/PrivacyPolicy";
import WebPageTitle from "../components/WebPageTitle";
import NavBar from "../components/NavBar";
import axios from "axios";

function PrivacyPolicyPage(props) {
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
      <WebPageTitle pageTitle="Privacy policy" />
      <PageTitle title="Privacy Policy" />
      <PrivacyPolicy />
      <Footer />
    </Fragment>
  );
}

export default PrivacyPolicyPage;
