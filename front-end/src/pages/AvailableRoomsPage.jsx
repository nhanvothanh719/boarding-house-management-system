import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRooms from "../components/AvailableRooms";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

function AvailableRoomsPage(props) {
  const [user, setCurrentUser] = useState({});
  useEffect(() => {
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        console.log(response.data);
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
      <WebPageTitle pageTitle="Available rooms" />
      <PageTitle title="Rooms for rent" />
      <AvailableRooms />
      <Footer />
    </Fragment>
  );
}

export default AvailableRoomsPage;
