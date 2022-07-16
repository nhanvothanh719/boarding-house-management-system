import React, { Fragment } from "react";
import "../assets/css/error.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Error(props) {
  const [errorMessageTitle] = useState(props.errorMessageTitle);
  const [errorMessageText] = useState(props.errorMessageText);
  const [errorCode] = useState(props.errorCode);
  return (
    <Fragment>
      <div className="errorContent">
        <div className="errorMessageMain">{errorMessageTitle}</div>
        <div className="errorMessage">{errorMessageText}</div>
        <button className="button goBackBtn">
          <NavLink to="/home" className="customLinkError">
            Go to Home page
          </NavLink>
        </button>
      </div>
      <div className="errorContainer">
        <div className="neon">{errorCode}</div>
        <div className="door-frame">
          <div className="door">
            <div className="rectangle"></div>
            <div className="handle"></div>
            <div className="window">
              <div className="eye"></div>
              <div className="eye eye2"></div>
              <div className="leaf"></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Error;
