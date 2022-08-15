import React, { Fragment } from "react";

import CountRentersByGender from "../../../../components/Charts/CountRentersByGender";
import CountRoomsByStatus from "../../../../components/Charts/CountRoomsByStatus";
import CountUsedServices from "../../../../components/Charts/CountUsedServices";
import GetPaidInvoicesRate from "../../../../components/Charts/GetPaidInvoicesRate";
import ReportBreaches from "../../../../components/Charts/ReportBreaches";
import Widget from "../../../../components/Dashboard/Widget";

function MainDashboard() {
  return (
    <Fragment>
      <div className="widgets">
        <Widget type="renter" />
        <Widget type="room" />
        <Widget type="earning" />
        <Widget type="balance" />
      </div>
      <CountRentersByGender/>
      <CountRoomsByStatus/>
      <CountUsedServices/>
      <GetPaidInvoicesRate/>
      <ReportBreaches/>
    </Fragment>
  );
}

export default MainDashboard;
