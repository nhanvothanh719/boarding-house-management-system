import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import LanguageIcon from "@mui/icons-material/Language";

import "../../assets/css/Renter/topbar.css";
import AppUrl from "../../RestAPI/AppUrl";
import DefaultAvatar from "../../assets/images/default_avatar.png";

function TopBar() {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    axios.get(AppUrl.GetUserProfile).then((response) => {
      if (response.data.status === 200) {
        setAvatar(response.data.currentUser.profile_picture);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="renterTopBar">
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
            <img 
            src={
              avatar !== null ? `http://127.0.0.1:8000/${avatar}` : DefaultAvatar
            }  
            className="topAvatar" 
            alt="" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TopBar;
