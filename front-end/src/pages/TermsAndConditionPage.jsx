import React, { Fragment, useEffect, useState } from "react";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import TermsAndCondition from "../components/TermsAndCondition";
import WebPageTitle from "../components/WebPageTitle";
import NavBar from "../components/NavBar";
import axios from "axios";

function TermsAndConditionPage(props) {
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
      <WebPageTitle pageTitle="Terms and conditions" />
      <PageTitle title="All terms and conditions" />
      <TermsAndCondition />
      <Footer />
    </Fragment>
  );
}

export default TermsAndConditionPage;
