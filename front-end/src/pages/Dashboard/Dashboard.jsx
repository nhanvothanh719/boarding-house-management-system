import React, { Component, Fragment } from "react";
import SideBar from "../../components/Dashboard/SideBar";
import TopBar from "../../components/Dashboard/TopBar";
import "../../assets/css/Dashboard/common.css";
import Widget from "../../components/Dashboard/Widget";

export class Dashboard extends Component {
  render() {
    return (
      <Fragment>
        <div className="home">
          <SideBar />
          <div className="homeContainer">
            <TopBar />
            <div className="widgets">
              <Widget type="renter" />
              <Widget type="room" />
              <Widget type="earning" />
              <Widget type="balance" />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
