import React, { Fragment, useEffect, useState } from "react";
import { Carousel, } from "react-bootstrap";

import AppUrl from "../../../RestAPI/AppUrl";
import axios from "axios";
import Loading from "../../../components/Loading/Loading";
import "../../../assets/css/Renter/details.css";

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

  useEffect(() => {
    axios.get(AppUrl.GetRenterRoomInfo).then((response) => {
      if (response.data.status === 200) {
        setRoom(response.data.room);
        setOtherRoommates(response.data.roommates);
      }
    });
    setLoading(false);
  }, []);

  var display_images = "";
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

    var display_other_roommates = "";
    display_other_roommates = otherRoommates.map((person) => {
      return (
        <div className="col">
              <div className="card radius-15">
                <div className="card-body text-center">
                  <div className="p-4 border radius-15">
                    <img
                      src={`http://127.0.0.1:8000/${person.profile_picture}`}
                      className="imgAccountProfile rounded-circle img-thumbnail mb-2 shadow"
                      alt=""
                    />
                    <h5 className="mb-0 mt-5">{person.name}</h5>
                    <p className="mb-3">{person.email}</p>
                    <div className="list-inline contacts-social mt-3 mb-3">
                      <p>{person.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      );
    });

  if(loading) {
    return <Loading/>
  }
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="project-info-box">
              <p>
                <b>Number:</b> {room.number}
              </p>
              <p>
                <b>Area:</b> {room.area}
              </p>
              <p>
                <b>Conditioner:</b> {room.has_conditioner === 1 ? "Yes" : "No"}
              </p>
              <p>
                <b>Fridge:</b> {room.has_fridge === 1 ? "Yes" : "No"}
              </p>
              <p>
                <b>Wardrobe:</b> {room.has_wardrobe === 1 ? "Yes" : "No"}
              </p>
            </div>

            <div className="project-info-box mt-0 mb-0">
              <p><b>Categories:</b> <span>{room.category.name}</span></p>
              <p className="mb-0">
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
          <h5>DESCRIPTION</h5>
          <p className="mb-0">{room.description}</p>
        </div>
      </div>
      <div className="container">
        <div className="project-info-box">
          <h5>OTHER ROOMMATES</h5>
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
            {display_other_roommates}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
