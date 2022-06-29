import React, { Component, Fragment } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer, faSmile, faWifi } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

class WhyChooseUs extends Component {
  render() {
    return (
      <Fragment>
        <Container fluid={true} className="bottomBanner p-0 text-center">
          <div className="bottomBannerCover">
            <Row>
              <Col lg={8} md={12} sm={12}>
                <Row className="bottomBannerItem">
                  <Col md={4} sm={4}>
                    <FontAwesomeIcon icon={faWifi} className="bigIcon" />
                    <h3 className="bottomBannerTitle">Convenient</h3>
                    <hr className="bg-white" />
                    <p className="bottomBannerDescription">
                      Users can use the system anytime, anywhere; data is
                      centrally managed and is guaranteed to be kept absolutely
                      safe.
                    </p>
                  </Col>
                  <Col md={4} sm={4}>
                    <FontAwesomeIcon icon={faComputer} className="bigIcon" />
                    <h3 className="bottomBannerTitle">Multi-platform</h3>
                    <hr className="bg-white" />
                    <p className="bottomBannerDescription">
                      The system is designed to be flexible to work on desktops,
                      laptops, tablets, and mobile devices.
                    </p>
                  </Col>
                  <Col md={4} sm={4}>
                    <FontAwesomeIcon icon={faSmile} className="bigIcon" />
                    <h3 className="bottomBannerTitle">Easy to use</h3>
                    <hr className="bg-white" />
                    <p className="bottomBannerDescription">
                      The simple, friendly and smart interface helps the
                      landlord manage the building easily and quickly.
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col lg={4} md={12} sm={12}>
                <Row className="bottomBannerItem">
                  <h1 className="countNumber">
                    <CountUp start={0} end={100}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                  </h1>
                  <h4 className="smallTitle">Current users</h4>
                  <hr className="bg-white w-30" />
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default WhyChooseUs;
