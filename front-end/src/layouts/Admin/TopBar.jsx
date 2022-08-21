import React, { Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../assets/images/avatar.jpeg";
import LanguageIcon from "@mui/icons-material/Language";

import "../../assets/css/Dashboard/topbar.css";

function TopBar() {
  return (
    <Fragment>
      <div className="topBar">
        <div className="topBarWrapper">
          <div className="language">
            <LanguageIcon />
            <em style={{ paddingLeft: "10px" }}>Language: English</em>
          </div>
          <div className="topRight">
            <div className="topBarIconContainer">
              <FontAwesomeIcon icon={faBell} />
              <span className="topCounter">3</span>
            </div>
            <img src={Avatar} className="topAvatar" alt="" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TopBar;
