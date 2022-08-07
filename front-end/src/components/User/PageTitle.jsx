import React, { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";

function PageTitle(props) {
  return (
    <Fragment>
      <Container fluid={true} className="pageTitle p-0">
        <div className="pageTitleCover">
          <Container className="pageTitleContent">
            <Row>
              <Col className="text-center">
                <h1 className="pageTitleText">{props.title}</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </Fragment>
  );
}

export default PageTitle;
