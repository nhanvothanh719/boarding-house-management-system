import React, { Component, Fragment } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import welcomeImg from "../assets/images/welcome.png";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "./Loading";

class AvailableRooms extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    RestClient.GetRequest(AppUrl.AvailableRooms).then((result) => {
      this.setState({ data: result, loading: false });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }
    const AvailableRooms = this.state.data;
    const AvailableRoomsDisplay = AvailableRooms.map(AvailableRooms => {
      return (
        <Col lg={4} md={6} sm={12}>
          <Card className="roomCard">
            <Card.Img variant="top" src={welcomeImg} />
            <Card.Body>
              <Card.Title className="cardName text-center">
                - Room {AvailableRooms.number} -
              </Card.Title>
              <Card.Text className="cardDescription">
              {AvailableRooms.description}
              </Card.Text>
              <Link to={"/available-room-details/" + AvailableRooms.id + "/" + AvailableRooms.number}>
                <Button className="float-right customButton">
                  View room details
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      );
    });
    return (
      <Fragment>
        <Container className="mb-5">
          <h1 className="mainTitle text-center"> ALL AVAILABLE ROOMS </h1>
          <div className="bottomLine"></div>
          <Row>
            {AvailableRoomsDisplay}
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default AvailableRooms;
