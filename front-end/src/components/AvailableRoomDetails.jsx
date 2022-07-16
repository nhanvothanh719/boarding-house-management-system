import React, { Fragment } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import Image1 from "../assets/images/background.jpeg";
import Image2 from "../assets/images/login_background.jpeg";
import Image3 from "../assets/images/bottom_banner.png";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "./Loading";
import { useState } from "react";
import { useEffect } from "react";

function AvailableRoomDetails(props) {
  const [roomID] = useState(props.roomId);
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [hasConditioner, setHasConditioner] = useState("");
  const [hasFridge, setHasFridge] = useState("");
  const [hasWardrobe, setHasWardrobe] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RestClient.GetRequest(AppUrl.AvailableRoomDetails + roomID).then(
      (response) => {
        setNumber(response[0]["number"]);
        setStatus(response[0]["status"]);
        setDescription(response[0]["description"]);
        setArea(response[0]["area"]);
        setHasConditioner(response[0]["hasConditioner"]);
        setHasFridge(response[0]["hasFridge"]);
        setHasWardrobe(response[0]["hasWardrobe"]);
        setLoading(false);
      }
    );
  }, [roomID]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Container className="mb-5">
        <h1 className="mainTitle text-center text-uppercase">
          {" "}
          Details of room number {number}{" "}
        </h1>
        <div className="bottomLine"></div>
        <Row className="mb-3">
          <Col lg={8} md={12} sm={12} className="mb-3">
            <div className="about-thumb-wrap after-shape">
              <Carousel interval={5000}>
                <Carousel.Item>
                  <img
                    src={Image1}
                    alt=""
                    className="img-fluid customImage d-block"
                    style={{ height: "100%" }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={Image2}
                    alt=""
                    className="img-fluid customImage d-block"
                    style={{ height: "100%" }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={Image3}
                    alt=""
                    className="img-fluid customImage d-block"
                    style={{ height: "100%" }}
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
          <Col lg={4} md={12} sm={12}>
            <div class="td-sidebar">
              <div class="widget_feature">
                <h4 class="widget-title text-center">Room features</h4>
                <ul>
                  <li>
                    <span>Room number :</span> {number}{" "}
                  </li>
                  <li>
                    <span>Renter :</span>{" "}
                  </li>
                  <li>
                    <span>Status :</span> {status}{" "}
                  </li>
                  <li>
                    <span>Area :</span> {area}{" "}
                  </li>
                  <li>
                    <span>Categories :</span>{" "}
                  </li>
                  <li>
                    <span>Conditioner: </span> {hasConditioner}{" "}
                  </li>
                  <li>
                    <span>Fridge: </span> {hasFridge}{" "}
                  </li>
                  <li>
                    <span>Wardrobe: </span> {hasWardrobe}{" "}
                  </li>
                  <li>
                    <span>Price:</span>{" "}
                  </li>
                </ul>
                <div class="price-wrap text-center">
                  <button class="btn btn-base btn-radius customButton">
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
            <p className="textNormal"> {description} </p>
          </Col>
          <Col lg={1} md={2} sm={1}></Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default AvailableRoomDetails;
