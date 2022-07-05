import React, { Component, Fragment } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import Image1 from '../assets/images/background.jpeg';
import Image2 from '../assets/images/login_background.jpeg';
import Image3 from '../assets/images/bottom_banner.png';

export class AvailableRoomDetails extends Component {
  constructor(props) {
    super();
    this.state = {
      RoomID: props.roomId,
    }
  }

  render() {
    return (
      <Fragment>
        <Container className="mb-5">
          <h1 className="mainTitle text-center text-uppercase"> Details of room number 101 </h1>
          <div className="bottomLine"></div>
          <Row className="mb-3">
            <Col lg={8} md={4} sm={12} className="mb-3">
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
            <Col lg={4} md={4} sm={12}>
            <div class="td-sidebar">
                        <div class="widget_feature">
                            <h4 class="widget-title text-center">Room features</h4>                                 
                            <ul>
                                <li><span>Room ID :</span> {this.state.RoomID} </li>
                                <li><span>Room number :</span> 101 </li>
                                <li><span>Renter :</span> 0 </li>
                                <li><span>Status :</span> Available </li>
                                <li><span>Categories:</span> Technology</li>
                                <li><span>Price:</span> $99.99</li>
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
            <p className="textNormal">he quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax my big quiz. Quick, Baz, get my woven flax jodhpurs! "Now fax quiz Jack!" my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls.</p>
          </Col>
          <Col lg={1} md={2} sm={1}></Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default AvailableRoomDetails;
