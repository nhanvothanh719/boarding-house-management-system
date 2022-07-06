import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRoomDetails from "../components/AvailableRoomDetails";
import WebPageTitle from "../components/WebPageTitle";

export class AvailableRoomDetailsPage extends Component {
  constructor({match}) {
    super();
    this.state = {
      RoomPassedID : match.params.roomID, //Get from URL 
      RoomPassedNumber : match.params.roomNumber, //Get from URL 
    }
  }

  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Room details" />
        <PageTitle title={"Room " + this.state.RoomPassedNumber + " details"} />
        <AvailableRoomDetails roomId={this.state.RoomPassedID}/>
      </Fragment>
    );
  }
}

export default AvailableRoomDetailsPage;
