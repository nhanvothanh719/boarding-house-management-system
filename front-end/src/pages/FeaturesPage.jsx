import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Features from "../components/Features";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

function FeaturesPage(props) {
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
      <WebPageTitle pageTitle="Features" />
      <PageTitle title="Features page" />
      <Features />
      <Footer />
    </Fragment>
  );
}

export default FeaturesPage;
