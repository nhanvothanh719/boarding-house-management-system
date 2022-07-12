import React, { Component, Fragment } from "react";
import Error from "../components/Error";

class Error_404 extends Component {
  state = {
    errorMessageTitle: "Page Not Found",
    errorMessageText:
      "We're sorry, the page you were looking for isn't found here. The link you followed may either be broken or no longer exists. Please try again, or take a look at our.",
    errorCode: "404",
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

export default Error_404;