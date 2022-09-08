import React, { Fragment, useState } from "react";
import { Button, Card, Col, Container, Form, FormGroup, Row, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen, faHome, faPhone, } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";

import AppUrl from "../../RestAPI/AppUrl";
import axios from "axios";

function ContactUS() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const sendContactUs = (e) => {
    const data = {
      name: input.name,
      email: input.email,
      message: input.message,
    };
      
    axios.post(AppUrl.ContactUs, data)
      .then((result) => {
        //Delete input after submit the form
        document.getElementById("inputName").value = "";
        document.getElementById("inputEmail").value = "";
        document.getElementById("inputMessage").value = "";
        swal(
          "Success",
          "Your message is sent successfully. Thank you for contacting us.",
          "success"
        );
        //Delete input after submit the form
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  return (
    <Fragment>
      <Container>
        <h1 className="mainTitle text-center">CONTACT US</h1>
        <div className="bottomLine text-center"></div>
        <br />
        <Row>
          <Col lg={8} md={12} sm={12}>
            <Card border="dark" className="card">
              <Card.Header className="cardHeader">
                <h4 className="text-center">Contact form</h4>
              </Card.Header>
              <Card.Body className="cardBody">
                <Form id="contactUsForm">
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      <FormGroup>
                        <Form.Label for="inputName">Name:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputName"
                          name="name"
                          value={input.name}
                          onChange={handleInput}
                          required
                        />
                      </FormGroup>
                      <Form.Group style={{ "margin-top": "1rem" }}>
                        <Form.Label for="email">Email address:</Form.Label>
                        <div className="input-group">
                          <span className="input-group-addon">
                            <span className="glyphicon glyphicon-envelope"></span>
                          </span>
                          <Form.Control
                            type="email"
                            name="email"
                            id="inputEmail"
                            value={input.email}
                            onChange={handleInput}
                            required
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
                          id="inputMessage"
                          rows={6}
                          cols={25}
                          value={input.message}
                          onChange={handleInput}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                    <center>
                      <Button
                        onClick={sendContactUs}
                        className="customButton"
                        style={{ marginTop: "20px"}}
                      >
                        Submit
                      </Button>
                      </center>
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

export default ContactUS;
