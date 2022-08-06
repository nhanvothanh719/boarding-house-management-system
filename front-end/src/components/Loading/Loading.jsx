import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

import LoadingIcon from "../../assets/images/loading_animation.svg";

function Loading() {
  return (
    <Fragment>
      <Container className="text-center">
        <Row>
          <Col>
            <img className="loadingAnimation" src={LoadingIcon} alt="" />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Loading;
