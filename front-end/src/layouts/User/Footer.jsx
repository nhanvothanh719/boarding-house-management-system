import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { Col, Container, Row, Nav } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithubSquare,
  faGooglePlus,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelopeOpen,
  faHome,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <Fragment>
      <Container fluid={true} className="footerSection">
        <Row>
          <Col lg={3} md={6} sm={12} className="p-3 text-center">
            <h2 className="footerTextTitle">Follow us</h2>
            <hr className="bg-white" />
            <div className="socialContent">
              <Link to="/" className="social socialIcon">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </Link>
              <Link to="/" className="social socialIcon">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </Link>
              <Link to="/" className="social socialIcon">
                <FontAwesomeIcon icon={faGithubSquare} size="2x" />
              </Link>
              <Link to="/" className="social socialIcon">
                <FontAwesomeIcon icon={faGooglePlus} size="2x" />
              </Link>
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} className="p-3">
            <h2 className="footerTextTitle text-center">Contact address</h2>
            <hr className="bg-white" />
            <h6 className="footerText">
              <FontAwesomeIcon icon={faPhone} className="smallIcon" />
              Phone number: 0967-XXX-YYY
            </h6>
            <h6 className="footerText">
              <FontAwesomeIcon icon={faEnvelopeOpen} className="smallIcon" />
              Email 1: nhanvothanh719@gmail.com
            </h6>
            <h6 className="footerText">
              <FontAwesomeIcon icon={faEnvelopeOpen} className="smallIcon" />
              Email 2: nhanvtgcd191366@fpt.edu.vn
            </h6>
          </Col>
          <Col lg={2} md={6} sm={12} className="p-3">
            <h2 className="footerTextTitle text-center">Address</h2>
            <hr className="bg-white" />
            <h6 className="footerText">
              <FontAwesomeIcon icon={faHome} className="smallIcon" />
              1101 Dien Bien Phu Street, Thanh Khe Dong Ward, Thanh Khe
              District, Da Nang
            </h6>
          </Col>
          <Col lg={3} md={6} sm={12} className="p-3">
            <h2 className="footerTextTitle text-center">Policy</h2>
            <hr className="bg-white" />
            <h6>
              <Nav.Link>
                <NavLink
                  exact
                  activeStyle={{ color: "yellow" }}
                  to="/privacy-policy"
                  className="footerLink"
                >
                  <FontAwesomeIcon icon={faSave} className="smallIcon" />
                  Privacy policy
                </NavLink>
              </Nav.Link>
            </h6>
            <h6>
              <Nav.Link>
                <NavLink
                  exact
                  activeStyle={{ color: "yellow" }}
                  to="/all-terms-and-condition"
                  className="footerLink"
                >
                  <FontAwesomeIcon icon={faSave} className="smallIcon" />
                  Terms and conditions
                </NavLink>
              </Nav.Link>
            </h6>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Footer;
