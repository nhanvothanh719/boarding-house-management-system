import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRoomDetails from "../components/AvailableRoomDetails";
import WebPageTitle from "../components/WebPageTitle";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from "axios";

export class AvailableRoomDetailsPage extends Component {
  constructor({ match }) {
    super();
    this.state = {
      RoomPassedID: match.params.roomID, //Get from URL
      RoomPassedNumber: match.params.roomNumber, //Get from URL
      user: {},
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        console.log(response.data);
        this.setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setUser = (user) => {
    this.setState({ user: user });
  };

  render() {
    return (
      <Fragment>
        <NavBar user={this.state.user} setUser={this.setUser} />
        <WebPageTitle pageTitle="Room details" />
        <PageTitle title={"Room " + this.state.RoomPassedNumber + " details"} />
        <AvailableRoomDetails roomId={this.state.RoomPassedID} />
        <Footer />
      </Fragment>
    );
  }
}

export default AvailableRoomDetailsPage;
