import React, { Component, Fragment } from "react";
import "../assets/css/error.css";
import { NavLink } from 'react-router-dom';

class Error extends Component {
  constructor(props) {
    super();
    this.state = {
      errorMessageTitle: props.errorMessageTitle,
      errorMessageText: props.errorMessageText,
      errorCode: props.errorCode,
    };
  }
  render() {
    return (
      <Fragment>
        <div className="errorContent">
        <div className="errorMessageMain">{this.props.errorMessageTitle}</div>
        <div className="errorMessage">{this.props.errorMessageText}</div>
        <button className="button goBackBtn">
        <NavLink to="/home" className="customLinkError">Go to Home page</NavLink>
        </button>
        </div>
        <div className="errorContainer">
          <div className="neon">{this.props.errorCode}</div>
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
}

export default Error;
