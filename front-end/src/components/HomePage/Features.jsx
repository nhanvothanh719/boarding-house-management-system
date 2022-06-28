import React, { Component, Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
// Import images
import contractManagement from "../../assets/images/contract_management.png";
import tenantManagement from "../../assets/images/tenant_management.png";
import roomManagement from "../../assets/images/room_management.png";
import waterManagement from "../../assets/images/water_management.png";
import invoiceManagement from "../../assets/images/invoice_management.png";
import statisticMonitor from "../../assets/images/statistics_monitor.png";

export class Features extends Component {
  render() {
    return (
      <Fragment>
        <Container className="text-center">
          <h1 className="mainTitle"> OUTSTANDING FEATURES</h1>
          <div className="bottomLine"></div>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={tenantManagement} className="cardImage" alt="" />
                <h3 className="featureName">Tenant management</h3>
                <p className="featureDescription">Tenant information management function, including personal information, and contact information.</p>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={contractManagement} className="cardImage" alt="" />
                <h3 className="featureName">Contract management</h3>
                <p className="featureDescription">The function of managing information about the rental contract, including rooms, tenants, services, deposits, etc.</p>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={roomManagement} className="cardImage" alt="" />
                <h3 className="featureName">Room management</h3>
                <p className="featureDescription">The function of managing room information by zone, room rate, and equipment in the room of the inn management software.</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={waterManagement} className="cardImage" alt="" />
                <h3 className="featureName">Electricity/ water management</h3>
                <p className="featureDescription">The function of managing the electricity and water of each room on a monthly basis, automatically calculates the amount to be paid.</p>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={invoiceManagement} className="cardImage" alt="" />
                <h3 className="featureName">Invoice management</h3>
                <p className="featureDescription">The function of managing monthly bills, including expenses such as electricity, water, and other services.</p>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="featureCard">
                <img src={statisticMonitor} className="cardImage" alt="" />
                <h3 className="featureName">Statistical report generating</h3>
                <p className="featureDescription">The function of monitoring the business and operating situation of the boarding house in general.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default Features;
