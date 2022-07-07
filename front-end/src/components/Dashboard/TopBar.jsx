import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import "../../assets/css/Dashboard/topbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../assets/images/avatar.jpeg";

export class TopBar extends Component {
  render() {
    return (
      <Fragment>
        <div className="topBar">
            <div className="topBarWrapper">
                <NavLink exact to="/" className="brandNameScroll">
            BeeHouse
            </NavLink>
                <div className='topRight'>
                    <div className='topBarIconContainer'>
                    <FontAwesomeIcon icon={faBell} />
                        <span className='topIconBadge'>3</span>
                    </div>
                    <img src={Avatar} className="topAvatar" />
                </div>
            </div>
        </div>
      </Fragment>
    )
  }
}

export default TopBar