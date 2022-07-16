import React, { Fragment } from "react";
import "../../assets/css/Dashboard/topbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../assets/images/avatar.jpeg";
import LanguageIcon from "@mui/icons-material/Language";

function TopBar() {
  return (
    <Fragment>
      <div className="topBar">
        <div className="topBarWrapper">
          <div>
            <LanguageIcon />
            Language: English
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
