import React, { Component, Fragment } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import welcomeImg from "../assets/images/welcome.png";

class AvailableRooms extends Component {
  render() {
    return (
      <Fragment>
        <Container className="mb-5">
          <h1 className="mainTitle text-center"> ALL AVAILABLE ROOMS </h1>
          <div className="bottomLine"></div>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Card className="roomCard">
                <Card.Img variant="top" src={welcomeImg} />
                <Card.Body>
                  <Card.Title className="cardName text-center">- Room 101 -</Card.Title>
                  <Card.Text className="cardDescription">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <Button className="float-right customButton">View room details</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="roomCard">
                <Card.Img variant="top" src={welcomeImg} />
                <Card.Body>
                  <Card.Title className="cardName text-center">- Room 101 -</Card.Title>
                  <Card.Text className="cardDescription">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <Button className="float-right customButton">View room details</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="roomCard">
                <Card.Img variant="top" src={welcomeImg} />
                <Card.Body>
                  <Card.Title className="cardName text-center">- Room 101 -</Card.Title>
                  <Card.Text className="cardDescription">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <Button className="float-right customButton">View room details</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default AvailableRooms;
