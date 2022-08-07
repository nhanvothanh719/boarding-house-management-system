import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import BedIcon from "@mui/icons-material/Bed";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import "../../assets/css/Dashboard/widget.css";

function Widget(props) {
  const [type] = useState(props.type);
  let data;
  let amount = 100;
  switch (type) {
    case "renter":
      data = {
        widgetTitle: "renters",
        isMoney: false,
        linkDescription: "View all",
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
        linkDescription: "View all",
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
        linkDescription: "View details",
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
        linkDescription: "View details",
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
            {data.isMoney && "$"} {amount}
          </span>
        </div>
        <div className="widgetRight">
          {data.widgetIcon}
          <Link to="/" className="widgetLink">
            {data.linkDescription}
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default Widget;
