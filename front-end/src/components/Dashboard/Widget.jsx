import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import BedIcon from "@mui/icons-material/Bed";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import "../../assets/css/Dashboard/widget.css";
import axios from "axios";
import AppUrl from "../../RestAPI/AppUrl";
import ReactVisibilitySensor from "react-visibility-sensor";

function Widget(props) {
  const [type] = useState(props.type);
  let data;
  switch (type) {
    case "renter":
      data = {
        widgetTitle: "renters",
        isMoney: false,
        widgetIcon: (
          <PersonAddAltIcon
            className="widgetIcon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "room":
      data = {
        widgetTitle: "rooms",
        isMoney: false,
        widgetIcon: (
          <BedIcon
            className="widgetIcon"
            style={{
              color: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.2)",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        widgetTitle: "earnings",
        isMoney: true,
        widgetIcon: (
          <AccountBalanceWalletOutlinedIcon
            className="widgetIcon"
            style={{
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        widgetTitle: "balance",
        isMoney: true,
        widgetIcon: (
          <AttachMoneyIcon
            className="widgetIcon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218, 165, 32, 0.2)",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }
  return (
    <Fragment>
      <div className="widget">
        <div className="widgetLeft">
          <span className="widgetTitle text-uppercase">{data.widgetTitle}</span>
          <span className="widgetCounter">
            {data.isMoney && "$"} {props.amount}
          </span>
        </div>
        <div className="widgetRight">
          {data.widgetIcon}
        </div>
      </div>
    </Fragment>
  );
}

export default Widget;
