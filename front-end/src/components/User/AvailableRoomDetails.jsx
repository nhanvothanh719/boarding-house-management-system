import React, { Fragment, useState, useEffect } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import Fade from 'react-reveal/Fade';

import axios from "axios";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import Label from "@mui/icons-material/Label";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import KitchenIcon from "@mui/icons-material/Kitchen";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DangerousIcon from "@mui/icons-material/Dangerous";

import AppUrl from "../../RestAPI/AppUrl";
import Loading from "../Loading/Loading";
import RegisterRoomModal from "../Modals/Room/RegisterRoomModal";
import noImage from "../../assets/images/no_image.jpeg";

function AvailableRoomDetails(props) {
  const [roomID] = useState(props.roomId);
  const [room, setRoom] = useState({
    category: {},
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.AvailableRoomDetails + roomID).then((response) => {
      if (response.data.status === 200) {
        setRoom(response.data.room);
        setLoading(false);
      }
    });
  }, [roomID]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  var display_images = "";
  if (room.images.length === 0) {
    display_images = 
    <Carousel.Item>
      <img className="img-fluid customImage d-block" src={noImage} alt="room_image" />
    </Carousel.Item>
  } else {
    display_images = room.images.map((img) => {
      return (
        <Carousel.Item>
          <img
            src={`http://127.0.0.1:8000/${img.image_name}`}
            alt=""
            className="img-fluid customImage d-block"
            style={{ height: "100%" }}
          />
        </Carousel.Item>
      );
    });
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Container className="mb-5">
        <h1 className="mainTitle text-center text-uppercase">
          {" "}
          Details of room number {room["number"]}{" "}
        </h1>
        <div className="bottomLine"></div>
        <Fade top>
        <Row className="mb-3">
          <Col lg={8} md={12} sm={12} className="mb-3">
            <div className="about-thumb-wrap after-shape">
              <Carousel interval={5000}>{display_images}</Carousel>
            </div>
          </Col>
          <Col lg={4} md={12} sm={12}>
            <div className="td-sidebar">
              <div className="widget_feature">
                <h4 className="widget-title text-center">Room features</h4>
                <ul>
                  <li className="spaceDisplay">
                    <span>
                      <RoomPreferencesIcon className="mr-3" />
                      Room number :
                    </span>{" "}
                    {room.number}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <BeenhereIcon className="mr-3" />
                      Status :
                    </span>{" "}
                    {room.status.name}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <SquareFootIcon className="mr-3" />
                      Area :
                    </span>{" "}
                    {room.area}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <Label className="mr-3" />
                      Categories :
                    </span>{" "}
                    {room.category.name}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <HeatPumpIcon className="mr-3" />
                      Conditioner:{" "}
                    </span>{" "}
                    {room.has_conditioner ? (
                      <AssignmentTurnedInIcon />
                    ) : (
                      <DangerousIcon />
                    )}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <KitchenIcon className="mr-3" />
                      Fridge:{" "}
                    </span>{" "}
                    {room.has_fridge ? (
                      <AssignmentTurnedInIcon />
                    ) : (
                      <DangerousIcon />
                    )}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <CheckroomIcon className="mr-3" />
                      Wardrobe:{" "}
                    </span>{" "}
                    {room.has_wardrobe ? (
                      <AssignmentTurnedInIcon />
                    ) : (
                      <DangerousIcon />
                    )}{" "}
                  </li>
                  <li className="spaceDisplay">
                    <span>
                      <MonetizationOnIcon className="mr-3" />
                      Price:
                    </span>{" "}
                    ${room.category.price}{" "}
                  </li>
                </ul>
                <div className="price-wrap text-center">
                  <button
                    className="btn btn-base btn-radius customButton"
                    onClick={(e) => setShowCreateModal(true)}
                  >
                    RENT NOW
                  </button>
                </div>
                <RegisterRoomModal
                  isShown={showCreateModal}
                  roomNumber={room.number}
                  roomId={room.id}
                  setCreateModalStatus={setCreateModalStatus}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={1} md={2} sm={1}></Col>
          <Col lg={10} md={8} sm={10}>
            <p className="textTitle">Description:</p>
            <p className="textNormal"> {room.description} </p>
          </Col>
          <Col lg={1} md={2} sm={1}></Col>
        </Row>
        </Fade>
      </Container>
    </Fragment>
  );
}

export default AvailableRoomDetails;
