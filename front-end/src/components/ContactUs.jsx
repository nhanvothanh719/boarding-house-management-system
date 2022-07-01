import React, { Component, Fragment } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpen,
  faHome,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

export class ContactUS extends Component {
  render() {
    return (
      <Fragment>
        <Container>
          <h1 className="mainTitle text-center">CONTACT US</h1>
          <div className="bottomLine text-center"></div>
          <br/>
          <Row>
            <Col lg={8} md={12} sm={12}>
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">Contact form</h4>
                </Card.Header>
                <Card.Body className="cardBody">
                  <Form>
                    <Row>
                      <Col lg={6} md={6} sm={6}>
                        <FormGroup>
                          <Form.Label for="name">Name:</Form.Label>
                          <Form.Control
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            required="required"
                          />
                        </FormGroup>
                        <Form.Group style={{ "margin-top": "1rem"}}>
                          <Form.Label for="email">Email address:</Form.Label>
                          <div class="input-group">
                            <span class="input-group-addon">
                              <span class="glyphicon glyphicon-envelope"></span>
                            </span>
                            <Form.Control
                              type="email"
                              id="email"
                              placeholder="Enter your email"
                              required="required"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg={6} md={6} sm={6}>
                        <Form.Group>
                          <Form.Label for="name">Message:</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            id="message"
                            rows={6}
                            cols={25}
                            required
                            placeholder="Message"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Button type="submit" id="btnContactUs" className="customButton">
                          Send Message
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={12} sm={12}>
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">Contact information</h4>
                </Card.Header>
                <Card.Body className="cardBody">
                  <h6>
                    <FontAwesomeIcon icon={faHome} className="smallIcon" />
                    1101 Dien Bien Phu Street, Thanh Khe Dong Ward, Thanh Khe
                    District, Da Nang
                  </h6>
                  <h6 className="">
                    <FontAwesomeIcon icon={faPhone} className="smallIcon" />
                    Phone number: 0967-XXX-YYY
                  </h6>
                  <h6 className="">
                    <FontAwesomeIcon
                      icon={faEnvelopeOpen}
                      className="smallIcon"
                    />
                    Email address 1: nhanvothanh719@gmail.com
                  </h6>
                  <h6 className="">
                    <FontAwesomeIcon
                      icon={faEnvelopeOpen}
                      className="smallIcon"
                    />
                    Email address 2: nhanvtgcd191366@fpt.edu.vn
                  </h6>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default ContactUS;
