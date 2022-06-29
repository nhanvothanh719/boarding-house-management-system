import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer, faSmile, faWifi } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

class WhyChooseUs extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        { month: "Sep", userAmount: 10 },
        { month: "Oct", userAmount: 58 },
        { month: "Nov", userAmount: 102 },
      ],
    };
  }
  render() {
    return (
      <Fragment>
        <Container fluid={true} className="bottomBanner p-0 text-center">
          <div className="bottomBannerCover">
            <br/><br/>
            <h1 className="mainBottomTitle"> WHY CHOOSE US?</h1>
            <div className="bottomBottomLine text-center"></div>
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
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <AreaChart
                        data={this.state.data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="userAmount"
                          stroke="#FFA233"
                          fill="#FFA233"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="smallTitle">Current users: </p>
                  <div className="countNumber">
                    <CountUp start={0} end={100}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    +
                  </div>
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
