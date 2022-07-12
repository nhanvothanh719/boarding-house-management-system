import React, { Component } from "react";
import "../assets/css/error.css";
class Error extends Component {
  constructor(props) {
    super();
    this.state = {
      errorMessageTitle: props.errorMessageTitle,
      errorMessageText: props.errorMessageText,
      errorCode:props.errorCode,
    };
  }
  render() {
    return (
        <body>
          <div class="errorMessageMain">{this.props.errorMessageTitle}
          </div>
          <div class="errorMessage">{this.props.errorMessageText}</div>
          <div class="errorContainer">
            <div class="neon">{this.props.errorCode}</div>
            <div class="door-frame">
              <div class="door">
                <div class="rectangle">
              </div>
                <div class="handle">
                  </div>
                <div class="window">
                  <div class="eye">
                  </div>
                  <div class="eye eye2">
                  </div>
                  <div class="leaf">
                  </div> 
                </div>
              </div>  
            </div>
          </div>
        </body>
    );
  }
}

export default Error;
