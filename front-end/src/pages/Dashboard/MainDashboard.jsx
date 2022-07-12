import React, { Component, Fragment } from "react";
import Widget from "../../components/Dashboard/Widget";

export class MainDashboard extends Component {
  render() {
    return (
      <Fragment>
        <div className="widgets">
          <Widget type="renter" />
          <Widget type="room" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
      </Fragment>
    );
  }
}

export default MainDashboard;
