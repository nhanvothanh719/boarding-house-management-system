import React, { Component, Fragment } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import Image1 from '../assets/images/background.jpeg';
import Image2 from '../assets/images/login_background.jpeg';
import Image3 from '../assets/images/bottom_banner.png';
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";

export class AvailableRoomDetails extends Component {
  constructor(props) {
    super();
    this.state = {
      roomID: props.roomId,
      number: "",
      status: "",
      description: "",
      area: "",
      hasConditioner: "",
      hasFridge: "",
      hasWardrobe: "",
    }
  }

  componentDidMount() {
    RestClient.GetRequest(AppUrl.AvailableRoomDetails + this.state.roomID)
    .then(result => {
      this.setState({
        number : result[0]['number'],
        status : result[0]['status'],
        description : result[0]['description'],
        area : result[0]['area'],
        hasConditioner : result[0]['hasConditioner'],
        hasFridge : result[0]['hasFridge'],
        hasWardrobe : result[0]['hasWardrobe'],
      })
    });
  }

  render() {
    return (
      <Fragment>
        <Container className="mb-5">
          <h1 className="mainTitle text-center text-uppercase"> Details of room number {this.state.number} </h1>
          <div className="bottomLine"></div>
          <Row className="mb-3">
            <Col lg={8} md={12} sm={12} className="mb-3">
              <div className="about-thumb-wrap after-shape">
                <Carousel interval={5000}>
                  <Carousel.Item>
                  <img src={Image1} alt="" className="img-fluid customImage d-block"/>
                  </Carousel.Item>
                  <Carousel.Item>
                  <img src={Image2} alt="" className="img-fluid customImage d-block"/>
                  </Carousel.Item>
                  <Carousel.Item>
                  <img src={Image3} alt="" className="img-fluid customImage d-block"/>
                  </Carousel.Item>
                </Carousel>
                
              </div>
            </Col>
            <Col lg={4} md={12} sm={12}>
            <div class="td-sidebar">
                        <div class="widget_feature">
                            <h4 class="widget-title text-center">Room features</h4>                                 
                            <ul>
                                <li><span>Room number :</span> {this.state.number} </li>
                                <li><span>Renter :</span>  </li>
                                <li><span>Status :</span> {this.state.status} </li>
                                <li><span>Area :</span> {this.state.area} </li>
                                <li><span>Categories :</span> </li>
                                <li><span>Conditioner: </span> {this.state.hasConditioner} </li>
                                <li><span>Fridge: </span> {this.state.hasFridge} </li>
                                <li><span>Wardrobe: </span> {this.state.hasWardrobe} </li>
                                <li><span>Price:</span> </li>
                            </ul>
                            <div class="price-wrap text-center">
                                <button class="btn btn-base btn-radius customButton">RENT NOW</button>
                            </div>
                        </div>
                    </div>
            </Col>
          </Row>
          <Row >
          <Col lg={1} md={2} sm={1}></Col>
          <Col lg={10} md={8} sm={10}>
            <p className="textTitle">Description:</p>
            <p className="textNormal"> {this.state.description} </p>
          </Col>
          <Col lg={1} md={2} sm={1}></Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default AvailableRoomDetails;
