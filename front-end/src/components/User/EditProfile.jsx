import React, { Fragment, useEffect } from "react";
import Slide from 'react-reveal/Slide';

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

import AppUrl from "../../RestAPI/AppUrl";
import { useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Publish } from "@material-ui/icons";

export default function EditProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [errors, setErrors] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfoChange, setUserInfoChange] = useState(false);
  const [role, setRole] = useState({});

  useEffect(() => {
    axios.get(AppUrl.GetUserProfile).then((response) => {
      if (response.data.status === 200) {
        setRole(response.data.currentUser.role);
        setUserInfo(response.data.currentUser);
        setAvatar(response.data.currentUser.profile_picture);
      }
    });
    setLoading(false);
    if (userInfoChange) {
      setUserInfoChange(false);
    }
  }, [userInfoChange]);

  const handleInput = (e) => {
    e.persist();
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    setAvatar({ image: e.target.files[0] });
  };

  const updateDetails = (e) => {
    e.preventDefault();
    const user = {
      name: userInfo.name,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      occupation: userInfo.occupation,
      permanent_address: userInfo.permanent_address,
      date_of_birth: userInfo.date_of_birth,
    };
    axios
      .put(AppUrl.UpdateUserProfile, user)
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
    const user = new FormData();
    if (avatar.image) {
      user.append("profile_picture", avatar.image);
      axios
        .post(AppUrl.UpdateUserAvatar, user)
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
    }
  };

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
        <Slide left>
        <Row>
          <Col lg={4} md={12} sm={12}>
            <Form id="updateUserAvatar" encType="multipart/form-data">
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className="smallIcon"
                    />
                    Avatar
                  </h4>
                </Card.Header>
                <Card.Body className="cardBody text-center">
                  <Col md={12}>
                    <img
                      src={`http://127.0.0.1:8000/${userInfo.profile_picture}`}
                      className="imgAccountProfile rounded-circle img-thumbnail mb-2"
                      alt=" "
                      style={{ objectFit: "cover" }}
                    ></img>
                    <div className="mt-3">
                      <label htmlFor="file">
                        <Publish className="userUpdateIcon" />
                      </label>
                      <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        name="profile_picture"
                        onChange={handleAvatar}
                        accept="image/*"
                      />
                      <Button
                        type="submit"
                        onClick={updateAvatar}
                        className="customButton"
                      >
                        Change avatar
                      </Button>
                    </div>
                  </Col>
                  <small className="text-danger"> {errors.profile_picture} </small>
                </Card.Body>
              </Card>
            </Form>
          </Col>

          <Col lg={8} md={12} sm={12}>
            <Form id="updateUserProfile">
              <Card border="dark" className="card">
                <Card.Header className="cardHeader">
                  <h4 className="text-center">
                    <FontAwesomeIcon
                      icon={faAddressCard}
                      className="smallIcon"
                    />
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
                          name="name"
                          id="inputName"
                          onChange={handleInput}
                          value={userInfo.name}
                          required
                        />
                      </FormGroup>
                      <small className="text-danger"> {errors.name} </small>
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
                            name="email"
                            id="inputEmail"
                            onChange={handleInput}
                            value={userInfo.email}
                            required
                          />
                        </div>
                      </Form.Group>
                      <small className="text-danger"> {errors.email} </small>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Phone number:</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone_number"
                          id="inputPhoneNumber"
                          onChange={handleInput}
                          value={userInfo.phone_number}
                          required
                        />
                      </FormGroup>
                      <small className="text-danger">{errors.phone_number}</small>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">ID card number:</Form.Label>
                        <Form.Control
                          type="text"
                          name="id_card_number"
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
                          name="date_of_birth"
                          id="inputDateOfBirth"
                          onChange={handleInput}
                          value={userInfo.date_of_birth}
                          required
                        />
                      </FormGroup>
                      <small className="text-danger">{errors.date_of_birth}</small>
                      <FormGroup style={{ "margin-top": "1rem" }}>
                        <Form.Label for="inputName">Occupation:</Form.Label>
                        <Form.Control
                          type="text"
                          name="occupation"
                          id="inputOccupation"
                          onChange={handleInput}
                          value={userInfo.occupation}
                          required
                        />
                      </FormGroup>
                      <small className="text-danger">{errors.occupation}</small>
                      <Form.Group style={{ "margin-top": "1rem" }}>
                        <Form.Label for="name">Permanent address:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="permanent_address"
                          id="inputAddress"
                          rows={5}
                          cols={23}
                          onChange={handleInput}
                          value={userInfo.permanent_address}
                          required
                        ></Form.Control>
                      </Form.Group>
                      <small className="text-danger">{errors.permanent_address}</small>
                    </Col>
                    <Col md={12}>
                      <center>
                        <Button
                          type="submit"
                          onClick={updateDetails}
                          className="customButton"
                          style={{ marginTop: "20px" }}
                        >
                          Update profile
                        </Button>
                      </center>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          </Col>
        </Row>
        </Slide>
      </Container>
    </Fragment>
  );
}
