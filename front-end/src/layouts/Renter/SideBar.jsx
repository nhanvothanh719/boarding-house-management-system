import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

import ApartmentIcon from "@mui/icons-material/Apartment";
import NightShelterIcon from '@mui/icons-material/NightShelter';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PaidIcon from '@mui/icons-material/Paid';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import "../../assets/css/Renter/sidebar.css";

export default function SideBar() {
  return (
    <Fragment>
      <div className="renterSideBar">
        <div className="top">
          <span className="logo">
            <NavLink exact to="/" className="customLogo">
              <ApartmentIcon /> BeeHouse{" "}
            </NavLink>
          </span>
        </div>
        <hr className="customHr" />
        <div className="center">
          <ul className="customUl" style={{ listStyle: "none" }}>
            <p className="renterItemGroup text-uppercase">View</p>
            <NavLink
              exact
              to="/renter/view-room-details"
              style={{ textDecoration: "none", color: "#f1f1f1" }}
              activeStyle={{ textDecoration: "none", color: "#fca311" }}
            >
              <li className="customLi">
                <NightShelterIcon className="sideBarIcon" />
                <span className="itemName"> Room details </span>
              </li>
            </NavLink>
            <NavLink
              exact
              to="/renter/view-room-contract"
              style={{ textDecoration: "none", color: "#f1f1f1" }}
              activeStyle={{ textDecoration: "none", color: "#fca311" }}
            >
              <li className="customLi">
                <HandshakeIcon className="sideBarIcon" />
                <span className="itemName"> Room contract </span>
              </li>
            </NavLink>
            <p className="renterItemGroup text-uppercase">Make</p>
            <NavLink
              exact
              to="/renter/view-all-invoices"
              style={{ textDecoration: "none", color: "#f1f1f1" }}
              activeStyle={{ textDecoration: "none", color: "#fca311" }}
            >
              <li className="customLi">
                <PaidIcon className="sideBarIcon" />
                <span className="itemName"> Invoice payment </span>
              </li>
            </NavLink>
            <NavLink
              exact
              to="/renter/register-optional-service"
              style={{ textDecoration: "none", color: "#f1f1f1" }}
              activeStyle={{ textDecoration: "none", color: "#fca311" }}
            >
              <li className="customLi">
                <LocalLaundryServiceIcon className="sideBarIcon" />
                <span className="itemName"> Service registration </span>
              </li>
            </NavLink>
            <p className="renterItemGroup text-uppercase">Send</p>
            <NavLink
              exact
              to="/renter/send-problem"
              style={{ textDecoration: "none", color: "#f1f1f1" }}
              activeStyle={{ textDecoration: "none", color: "#fca311" }}
            >
              <li className="customLi">
                <ReportProblemIcon className="sideBarIcon" />
                <span className="itemName"> Problems </span>
              </li>
            </NavLink>            
          </ul>
        </div>
      </div>
    </Fragment>
  )
}