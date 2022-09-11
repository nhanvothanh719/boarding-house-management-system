import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Zoom from 'react-reveal/Zoom';

import contractManagement from "../../assets/images/contract_management.png";
import tenantManagement from "../../assets/images/tenant_management.png";
import roomManagement from "../../assets/images/room_management.png";
import waterManagement from "../../assets/images/water_management.png";
import invoiceManagement from "../../assets/images/invoice_management.png";
import statisticMonitor from "../../assets/images/statistics_monitor.png";

function Features() {
  return (
    <Fragment>
      <Container className="text-center">
        <h1 className="mainTitle"> OUTSTANDING FEATURES</h1>
        <div className="bottomLine"></div>
        <Zoom>
        <Row>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard">
              <img src={tenantManagement} className="cardImage" alt="" />
              <h3 className="cardName">Tenant management</h3>
              <p className="cardDescription">
                Tenant information management function, including personal
                information, and contact information.
              </p>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard">
              <img src={contractManagement} className="cardImage" alt="" />
              <h3 className="cardName">Contract management</h3>
              <p className="cardDescription">
                The function of managing information about the rental contract,
                including rooms, tenants, services, deposits, etc.
              </p>
            </div>
          </Col>
          <Col lg={4} md={12} sm={12}>
            <div className="featureCard">
              <img src={waterManagement} className="cardImage" alt="" />
              <h3 className="cardName">Electricity/ water management</h3>
              <p className="cardDescription">
                The function of managing the electricity and water of each room
                monthly, calculating the amount to be paid.
              </p>
            </div>
          </Col>
        </Row>
        <Row style={{ "margin-bottom": "40px" }}>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard">
              <img src={roomManagement} className="cardImage" alt="" />
              <h3 className="cardName">Room management</h3>
              <p className="cardDescription">
                The function of managing room information by zone, room rate,
                and equipment in the room of the application.
              </p>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <div className="featureCard">
              <img src={invoiceManagement} className="cardImage" alt="" />
              <h3 className="cardName">Invoice management</h3>
              <p className="cardDescription">
                The function of managing monthly bills, including expenses such
                as electricity, water, and other services.
              </p>
            </div>
          </Col>
          <Col lg={4} md={12} sm={12}>
            <div className="featureCard">
              <img src={statisticMonitor} className="cardImage" alt="" />
              <h3 className="cardName">Statistical report generating</h3>
              <p className="cardDescription">
                The function of monitoring the business and operating situation
                of the boarding house in general.
              </p>
            </div>
          </Col>
        </Row>
        </Zoom>
      </Container>
    </Fragment>
  );
}

export default Features;
