import React, { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Pulse from 'react-reveal/Pulse';

function PageTitle(props) {
  return (
    <Fragment>
      <Container fluid={true} className="pageTitle p-0">
        <div className="pageTitleCover">
          <Container className="pageTitleContent">
            <Pulse>
            <Row>
              <Col className="text-center">
                <h1 className="pageTitleText">{props.title}</h1>
              </Col>
            </Row>
            </Pulse>
          </Container>
        </div>
      </Container>
    </Fragment>
  );
}

export default PageTitle;
