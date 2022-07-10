import React, { Component, Fragment } from "react";
import "../../assets/css/Dashboard/datatable.css";
import Datatable from "../../components/Dashboard/Datatable/Datatable";

export class RentersList extends Component {
  render() {
    return (
      <Fragment>
        <Datatable />
      </Fragment>
    );
  }
}

export default RentersList;
