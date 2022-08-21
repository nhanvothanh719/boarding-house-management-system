import React, { Fragment } from "react";

import RenterGenderRate from "../../../../components/Charts/RenterGenderRate";
import UsedServiceCount from "../../../../components/Charts/UsedServiceCount";
import InvoicePaidRate from "../../../../components/Charts/InvoicePaidRate";
import RoomStatusRate from "../../../../components/Charts/RoomStatusRate";
import BreachReport from "../../../../components/Charts/BreachReport";
import Widget from "../../../../components/Dashboard/Widget";

import "../../../../assets/css/Dashboard/chart.css";
import BalanceVariation from "../../../../components/Charts/BalanceVariation";

function MainDashboard() {
  return (
    <Fragment>
      <div className="widgets">
        <Widget type="renter" />
        <Widget type="room" />
        <Widget type="earning" />
        <Widget type="balance" />
      </div>
      <BalanceVariation />
      <InvoicePaidRate />
      <RenterGenderRate />
      <BreachReport />
      <UsedServiceCount />
      <RoomStatusRate />
    </Fragment>
  );
}

export default MainDashboard;
