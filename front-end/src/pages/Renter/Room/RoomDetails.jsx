import React, { Fragment, useEffect, useState } from "react";
import { Carousel, } from "react-bootstrap";

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

import AppUrl from "../../../RestAPI/AppUrl";
import axios from "axios";
import swal from "sweetalert";

import Loading from "../../../components/Loading/Loading";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";
import noImage from "../../../assets/images/no_image.jpeg";
import "../../../assets/css/Renter/details.css";
import Error from "../Error/Error";

export default function RoomDetails() {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState({
    number: "",
    area: "",
    description: "",
    category: {
      name: "",
      price: "",
    },
    images: []
  });
  const [otherRoommates, setOtherRoommates] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const errorMessage =
    "Oops. You has not assigned to any rooms. Please contact with the admin.";

  useEffect(() => {
    axios.get(AppUrl.GetRenterRoomInfo).then((response) => {
      if (response.data.status === 200) {
        setRoom(response.data.room);
        setOtherRoommates(response.data.roommates);
        console.log(response.data.room);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        setErrorDisplay(true);
      }
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  } else if (errorDisplay) {
    return (
      <Fragment>
        <Error errorMessage={errorMessage} />
      </Fragment>
    );
  } else {
  var display_images = "";
  if (room.images.length === 0) {
    display_images = 
    <Carousel.Item>
      <img className="img-fluid customImage d-block" src={noImage} alt="room_image" />
    </Carousel.Item>
  } else {
    display_images = room.images.map((img) => {
      return (
        <Carousel.Item>
          <img
            src={`http://127.0.0.1:8000/${img.image_name}`}
            alt=""
            className="img-fluid customImage d-block"
            style={{ height: "100%" }}
          />
        </Carousel.Item>
      );
    });
  }

    var display_other_roommates = "";
    display_other_roommates = otherRoommates.map((person) => {
      return (
        <div className="col">
              <div className="card" style={{ backgroundColor: "#14213d", borderRadius: "5%"}}>
                <div className="card-body text-center" >
                  <div className="p-4 border radius-20"  style={{ backgroundColor: "#fafafa", borderRadius: "5%"}}>
                    <img
                      src={`http://127.0.0.1:8000/${person.profile_picture}`}
                      className="imgAccountProfile rounded-circle img-thumbnail mb-2 shadow"
                      alt=""
                    />
                    <h5 className="mb-0 mt-3">{person.name}</h5>
                    <p className="mb-3" style={{ fontStyle: "italic"}}>{person.email}</p>
                    <div className="list-inline contacts-social mt-3 mb-3">
                      <p className="h5"><b><LocalPhoneIcon className="pr-1"/>{person.phone_number}</b></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      );
    });
  return (
    <Fragment>
      <WebPageTitle pageTitle="Room details" />
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="project-info-box">
              <p className="spaceDisplay">
                <b>Number:</b> {room.number}
              </p>
              <p className="spaceDisplay">
                <b>Area:</b> {room.area}
              </p>
              <p className="spaceDisplay">
                <b>Conditioner:</b> {room.has_conditioner === 1 ? "Yes" : "No"}
              </p>
              <p className="spaceDisplay">
                <b>Fridge:</b> {room.has_fridge === 1 ? "Yes" : "No"}
              </p>
              <p className="spaceDisplay">
                <b>Wardrobe:</b> {room.has_wardrobe === 1 ? "Yes" : "No"}
              </p>
            </div>

            <div className="project-info-box mt-0 mb-0">
              <p className="spaceDisplay"><b>Categories:</b> <span>{room.category.name}</span></p>
              <p className="mb-0 spaceDisplay">
                <b>Price:</b> <span>${room.category.price}</span>
              </p>
            </div>
          </div>
          <div className="col-md-7 pt-3">
            <Carousel interval={5000}>{display_images}</Carousel>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="project-info-box">
          <h5 className="customDetailTitle">ROOM DESCRIPTION</h5>
          <p className="mb-0">{room.description}</p>
        </div>
      </div>
      <div className="container">
        <div className="project-info-box">
          <h5 className="customDetailTitle">ROOMMATES</h5>
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
            {display_other_roommates}
          </div>
        </div>
      </div>
    </Fragment>
  );
  }
}
