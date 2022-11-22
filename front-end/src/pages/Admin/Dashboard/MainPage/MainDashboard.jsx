import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";

import RenterGenderRate from "../../../../components/Charts/AdminCharts/RenterGenderRate";
import UsedServiceCount from "../../../../components/Charts/AdminCharts/UsedServiceCount";
import InvoicePaidRate from "../../../../components/Charts/AdminCharts/InvoicePaidRate";
import RoomStatusRate from "../../../../components/Charts/AdminCharts/RoomStatusRate";
import BreachReport from "../../../../components/Charts/AdminCharts/BreachReport";
import BalanceVariation from "../../../../components/Charts/AdminCharts/BalanceVariation";
import Widget from "../../../../components/Dashboard/Widget";
import "../../../../assets/css/Dashboard/chart.css";
import AppUrl from "../../../../RestAPI/AppUrl";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

function MainDashboard() {
  const [rentersAmount, setRentersAmount] = useState("");
  const [roomsAmount, setRoomsAmount] = useState("");
  const [earnedAmount, setEarnedAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");

  useEffect(() => {
    axios.get(AppUrl.CountRenters).then(
      (response) => {
        if(response.data.status == 200) {
          setRentersAmount(response.data.total);
        }
      });
      axios.get(AppUrl.CountRooms).then(
        (response) => {
          if(response.data.status == 200) {
            setRoomsAmount(response.data.total);
          }
        });
        axios.get(AppUrl.GetEarnedAmount).then(
          (response) => {
            if(response.data.status == 200) {
              setEarnedAmount(response.data.amount);
            }
          });
      axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
        if (response.data.status == 200) {
          setCurrentBalance(response.data.currentBalance);
        }
      });
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Dashboard" />
      <div className="widgets">
        <Widget type="renter" amount={rentersAmount}/>
        <Widget type="room" amount={roomsAmount}/>
        <Widget type="earning" amount={earnedAmount} />
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
