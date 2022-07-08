import React, { Component, Fragment } from "react";
import "../../assets/css/Dashboard/sidebar.css";
import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CommentIcon from '@mui/icons-material/Comment';
import CategoryIcon from '@mui/icons-material/Category';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FlagIcon from '@mui/icons-material/Flag';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';

class SideBar extends Component {
  render() {
    return (
      <Fragment>
        <div className="sideBar">
          <div className="top">
            <span className="logo">
            <NavLink exact to="/" className="brandNameScroll"> BeeHouse </NavLink>
            </span>
          </div>
          <hr className="customHr"/>
          <div className="center">
            <ul className="customUl" style={{listStyle: "none"}}>
            <p className="itemGroup text-uppercase">Main</p>
                <li className="customLi">
                    <DashboardIcon className="sideBarIcon"/>
                    <span className="itemName"> Dashboard </span>
                </li>
                <p className="itemGroup text-uppercase">Lists</p>
                <li className="customLi">
                    <GroupIcon className="sideBarIcon"/>
                    <span className="itemName"> Renters </span>
                </li>
                <li className="customLi">
                <MeetingRoomIcon className="sideBarIcon"/>
                    <span className="itemName"> Rooms </span>
                </li>
                <li className="customLi">
                <CommentIcon className="sideBarIcon"/>
                    <span className="itemName"> Suggestions </span>
                </li>
                <li className="customLi">
                <CategoryIcon className="sideBarIcon"/>
                    <span className="itemName"> Categories </span>
                </li>
                <li className="customLi">
                <TwoWheelerIcon className="sideBarIcon"/>
                    <span className="itemName"> Motorbikes </span>
                </li>
                <li className="customLi">
                <MiscellaneousServicesIcon className="sideBarIcon"/>
                    <span className="itemName"> Services </span>
                </li>
                <li className="customLi">
                <HandshakeIcon className="sideBarIcon"/>
                    <span className="itemName"> Contracts </span>
                </li>
                <li className="customLi">
                <ReportIcon className="sideBarIcon"/>
                    <span className="itemName"> Breaches </span>
                </li>
                <p className="itemGroup text-uppercase">Generating</p>
                <li className="customLi">
                <NotificationsActiveIcon className="sideBarIcon"/>
                    <span className="itemName"> Notifications </span>
                </li>
                <li className="customLi">
                <ReceiptIcon className="sideBarIcon"/>
                    <span className="itemName"> Invoices </span>
                </li>
                <li className="customLi">
                <FlagIcon className="sideBarIcon"/>
                    <span className="itemName"> Breaches </span>
                </li>
                <li className="customLi">
                <ShowChartIcon className="sideBarIcon"/>
                    <span className="itemName"> Profit </span>
                </li>
                <p className="itemGroup text-uppercase">User</p>
                <li className="customLi">
                <BadgeIcon className="sideBarIcon"/>
                    <span className="itemName"> Profile </span>
                </li>
                <li className="customLi">
                <LogoutIcon className="sideBarIcon"/>
                    <span className="itemName"> Sign out </span>
                </li>
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SideBar;
