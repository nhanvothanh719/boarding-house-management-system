import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRoomDetails from "../components/AvailableRoomDetails";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

function AvailableRoomDetailsPage({ match }, props) {
  const [RoomPassedID] = useState(match.params.roomID); //Get from URL
  const [RoomPassedNumber] = useState(match.params.roomNumber); //Get from URL
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
      <WebPageTitle pageTitle="Room details" />
      <PageTitle title={"Room " + RoomPassedNumber + " details"} />
      <AvailableRoomDetails roomId={RoomPassedID} />
      <Footer />
    </Fragment>
  );
}

export default AvailableRoomDetailsPage;
