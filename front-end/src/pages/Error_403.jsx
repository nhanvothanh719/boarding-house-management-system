import React, { Component, Fragment } from "react";
import Error from "../components/Error";

class Error_403 extends Component {
  state = {
    errorMessageTitle: "You are not authorized.",
    errorMessageText:
      "You tried to access a page you did not have prior authorization for.",
    errorCode: "403",
  };
  render() {
    return (
      <Fragment>
        <Error
          errorMessageTitle={this.state.errorMessageTitle}
          errorMessageText={this.state.errorMessageText}
          errorCode={this.state.errorCode}
        />
      </Fragment>
    );
  }
}

export default Error_403;
