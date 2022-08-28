import React, { Fragment, useEffect } from "react";

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faAddressCard } from "@fortawesome/free-solid-svg-icons";

import RestClient from "../../RestAPI/RestClient";
import AppUrl from "../../RestAPI/AppUrl";
import { useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";

export default function EditProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [errors, setErrors] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [loading, setLoading] = useState([]);
  const [userInfoChange, setUserInfoChange] = useState(false);
  const [role, setRole] = useState({});

  useEffect(() => {
  axios.get(AppUrl.GetUserProfile).then((response) => {
    if (response.data.status === 200) {
      setRole(response.data.currentUser.role);
      setUserInfo(response.data.currentUser);
      setCurrentAvatar(response.data.currentUser.profile_picture);
    }
  })
  setLoading(false);
  }, []);

  const updateDetails = (e) => {
    e.preventDefault();
    const user = new FormData();
    user.append("name", userInfo.name);
    user.append("email", userInfo.email);
    user.append("phone_number", userInfo.phone_number);
    user.append("occupation", userInfo.occupation);
    user.append("permanent_address", userInfo.permanent_address);
    user.append("date_of_birth", userInfo.date_of_birth);
    axios
      .post(AppUrl.UpdateRenter + userInfo.id, user)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          setUserInfoChange(true);
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateAvatar = (e) => {
    e.preventDefault();
    // user.append(
    //   "date_of_birth",
    //   moment(dateOfBirth).utc().format("YYYY-MM-DD")
    // );
    // if (avatar.image) {
    //   user.append("profile_picture", avatar.image);
    // }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Container>
        <h1 className="mainTitle text-center text-uppercase">
          Edit user profile
        </h1>
        <div className="bottomLine text-center"></div>
        <br />
        <Form id="updateUserProfile">
          <Row>
            <Col lg={4} md={12} sm={12}>
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">
                  <FontAwesomeIcon icon={faCircleUser} className="smallIcon" />
                    Avatar
                    </h4>
                </Card.Header>
                <Card.Body className="cardBody text-center">
                  <Col md={12}>
                    <img 
                    src={`http://127.0.0.1:8000/${currentAvatar}`}
                    className="imgAccountProfile rounded-circle img-thumbnail mb-2"
                    alt=" "
                    style={{ objectFit: "cover"}}
                    >
                    </img>
                    <div className="mt-3">
                    <Button
                      //onClick={sendContactUs}
                      className="customButton"
                    >
                      Change avatar
                    </Button>
                    </div>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={8} md={12} sm={12}>
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">
                  <FontAwesomeIcon icon={faAddressCard} className="smallIcon" />
                    Profile settings
                    </h4>
                </Card.Header>
                <Card.Body className="cardBody">
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      <FormGroup>
                        <Form.Label for="inputName">Name:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputName"
                          value={userInfo.name}
                          required
                        />
                      </FormGroup>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Role as:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputRole"
                          value={role.name}
                          disabled
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
                            id="inputEmail"
                            value={userInfo.email}
                            required
                          />
                        </div>
                      </Form.Group>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Phone number:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputPhoneNumber"
                          value={userInfo.phone_number}
                          required
                        />
                      </FormGroup>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">ID card number:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputIdCardNumber"
                          value={userInfo.id_card_number}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                    <FormGroup>
                        <Form.Label for="inputName">Gender:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputGender"
                          value={userInfo.gender === 1 ? "Male" : "Female"}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Date of birth:</Form.Label>
                        <Form.Control
                          type="date"
                          id="inputDateOfBirth"
                          value={userInfo.date_of_birth}
                        />
                      </FormGroup>
                    <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Occupation:</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputOccupation"
                          value={userInfo.occupation}
                          required
                        />
                      </FormGroup>
                      <Form.Group style={{ "margin-top": "1rem" }}>
                        <Form.Label for="name">Permanent address:</Form.Label>
                        <Form.Control
                          as="textarea"
                          id="inputAddress"
                          rows={5}
                          cols={23}
                          value={userInfo.permanent_address}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <center>
                      <Button
                        //onClick={sendContactUs}
                        className="customButton"
                        style={{ marginTop: "20px"}}
                      >
                        Update profile
                      </Button>
                      </center>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
}
