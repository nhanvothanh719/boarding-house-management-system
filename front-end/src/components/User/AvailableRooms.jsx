import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Zoom from 'react-reveal/Zoom';

import welcomeImg from "../../assets/images/welcome.png";
import AppUrl from "../../RestAPI/AppUrl";
import Loading from "../Loading/Loading";
import axios from "axios";

function AvailableRooms() {
  const [availableRoomsList, setAvailableRoomsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.AvailableRooms).then((response) => {
      if(response.data.status === 200) {
        setAvailableRoomsList(response.data.availableRooms);
        console.log(response.data.availableRooms);
      }
      setLoading(false);
    });
  }, []);

  const AvailableRoomsDisplay = availableRoomsList.map((room) => {
    return (
      <Col lg={4} md={6} sm={12}>
        <Zoom>
        <Card className="roomCard">
          <Card.Img variant="top" src={welcomeImg} />
          <Card.Body>
            <Card.Title className="cardName text-center">
              - Room {room.number} -
            </Card.Title>
            <Card.Text className="cardDescription limitText">
              {room.description}
            </Card.Text>
            <Link
              to={
                "/available-room-details/" +
                room.id +
                "/" +
                room.number
              }
            >
              <Button className="float-right customButton">
                View room details
              </Button>
            </Link>
          </Card.Body>
        </Card>
        </Zoom>
      </Col>
    );
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Container className="mb-5">
        <h1 className="mainTitle text-center"> ALL AVAILABLE ROOMS </h1>
        <div className="bottomLine"></div>
        <Row>{AvailableRoomsDisplay}</Row>
      </Container>
    </Fragment>
  );
}

export default AvailableRooms;
