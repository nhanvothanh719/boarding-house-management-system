import React, { Fragment } from "react";
import { useState } from "react";
import Error from "../components/Error";

function Error_403() {
  const [errorMessageTitle, ] = useState(
    "You are not authorized"
  );
  const [errorMessageText, ] = useState(
    "You tried to access a page you did not have prior authorization for."
  );
  const [errorCode, ] = useState("403");
  return (
    <Fragment>
      <Error
        errorMessageTitle={errorMessageTitle}
        errorMessageText={errorMessageText}
        errorCode={errorCode}
      />
    </Fragment>
  );
}

export default Error_403;
