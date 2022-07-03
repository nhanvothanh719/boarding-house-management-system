import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRoomDetails from "../components/AvailableRoomDetails";
import WebPageTitle from "../components/WebPageTitle";

export class AvailableRoomDetailsPage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Room details" />
        <PageTitle title="Room details" />
        <AvailableRoomDetails />
      </Fragment>
    );
  }
}

export default AvailableRoomDetailsPage;
