import React, { Fragment, useEffect, useState } from "react";

import RenterGenderRate from "../../../../components/Charts/RenterGenderRate";
import UsedServiceCount from "../../../../components/Charts/UsedServiceCount";
import InvoicePaidRate from "../../../../components/Charts/InvoicePaidRate";
import RoomStatusRate from "../../../../components/Charts/RoomStatusRate";
import BreachReport from "../../../../components/Charts/BreachReport";
import Widget from "../../../../components/Dashboard/Widget";

import "../../../../assets/css/Dashboard/chart.css";
import BalanceVariation from "../../../../components/Charts/BalanceVariation";
import axios from "axios";
import AppUrl from "../../../../RestAPI/AppUrl";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

function MainDashboard() {
  const [displayData, setDisplayData] = useState({});
  const [currentBalance, setCurrentBalance] = useState("");

  useEffect(() => {
    axios.get(AppUrl.GetWidgetsData).then(
      (response) => {
        if(response.data.status === 200) {
          setDisplayData(response.data.results);
        }
      });
      axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
        if (response.data.status === 200) {
          setCurrentBalance(response.data.currentBalance);
        }
      });
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Dashboard" />
      <div className="widgets">
        <Widget type="renter" amount={displayData.rentersTotal}/>
        <Widget type="room" amount={displayData.roomsTotal}/>
        <Widget type="earning" amount={displayData.earnedAmount} />
        <Widget type="balance" amount={currentBalance} />
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
