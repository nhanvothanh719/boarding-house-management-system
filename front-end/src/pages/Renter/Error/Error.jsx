import React, { Fragment } from "react";
import Flash from 'react-reveal/Flash';
import { Container } from "react-bootstrap";

import error from "../../../assets/images/error.png";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";

export default function Error(props) {
  return (
    <Fragment>
      <WebPageTitle pageTitle="Error" />
      <Container className="text-center">
        <Flash>
        <img className="errorIcon" src={error} alt="error" />
        </Flash>
        <p className="errorMessageDisplay">{props.errorMessage}</p>
      </Container>
    </Fragment>
  );
}
