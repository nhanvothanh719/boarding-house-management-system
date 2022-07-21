import React, { Fragment } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "./Loading";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function AvailableRoomDetails(props) {
  const [roomID] = useState(props.roomId);
  const [room, setRoom] = useState([]);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.AvailableRoomDetails + roomID).then(
      (response) => {
        if(response.data.status === 200) {
          console.log(response.data.images);
          setRoom(response.data.details[0]);
          setCategory(response.data.category[0]);
          setImages(response.data.images);
          console.log(images);
          setLoading(false);
        }
      }
    );
  }, [roomID]);

  var display_images = "";
  if (loading) {
    return <Loading />;
  } else {
    display_images = images.map((img) => {
      return(
        <Carousel.Item>
      <img
        src={`http://127.0.0.1:8000/${img.image_name}`}
        alt=""
        className="img-fluid customImage d-block"
        style={{ height: "100%" }}
      />
    </Carousel.Item>
      )
    })
  }
  return (
    <Fragment>
      <Container className="mb-5">
        <h1 className="mainTitle text-center text-uppercase">
          {" "}
          Details of room number {room["number"]}{" "}
        </h1>
        <div className="bottomLine"></div>
        <Row className="mb-3">
          <Col lg={8} md={12} sm={12} className="mb-3">
            <div className="about-thumb-wrap after-shape">
              <Carousel interval={5000}>
              {display_images}
              </Carousel>
            </div>
          </Col>
          <Col lg={4} md={12} sm={12}>
            <div className="td-sidebar">
              <div className="widget_feature">
                <h4 className="widget-title text-center">Room features</h4>
                <ul>
                  <li>
                    <span>Room number :</span> {room.number}{" "}
                  </li>
                  <li>
                    <span>Renter :</span>{" "}
                  </li>
                  <li>
                    <span>Status :</span> {room.status}{" "}
                  </li>
                  <li>
                    <span>Area :</span> {room.area}{" "}
                  </li>
                  <li>
                    <span>Categories :</span> {category.name}{" "}
                  </li>
                  <li>
                    <span>Conditioner: </span> {room.has_conditioner}{" "}
                  </li>
                  <li>
                    <span>Fridge: </span> {room.has_fridge}{" "}
                  </li>
                  <li>
                    <span>Wardrobe: </span> {room.has_wardrobe}{" "}
                  </li>
                  <li>
                    <span>Price:</span>{" "}
                  </li>
                </ul>
                <div className="price-wrap text-center">
                  <button className="btn btn-base btn-radius customButton">
                    RENT NOW
                  </button>
                </div>
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
      </Container>
    </Fragment>
  );
}

export default AvailableRoomDetails;
