import React, { Fragment, useEffect, useState } from "react";
import AppUrl from "../../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";
import Loading from "../../../components/Loading";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";

export default function RoomDetails({ match }) {
  const history = useHistory();
  const roomId = match.params.roomID;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState({});
  const [renters, setRenters] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.GetRoomDetails + roomId).then((response) => {
      if (response.data.status === 200) {
        setDetails(response.data.roomDetails);
        setImages(response.data.roomImages);
        setCategory(response.data.category);
        setRenters(response.data.allRenters);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-services");
      }
      setLoading(false);
    });
  }, [roomId, history]);

  if (loading) {
    return <Loading />;
  }

  const room_images = images.map((image) => {
    return (
      <ul class="list-group">
        <li class="list-group-item">
          <img
            src={`http://127.0.0.1:8000/${image.image_name}`}
            alt="room_image"
          />
          <p>{image.image_name}</p>
        </li>
      </ul>
    );
  });

  const ChangeDateFormat = (date) => {
    return date.split("-").reverse().join("/"); 
  }

  const all_renters = renters.map((renter) => {
    return (
      <ul class="list-group">
        <li class="list-group-item">
          <p>Name: {renter.name}</p>
          <p>Email: {renter.email}</p>
          <img
            src={`http://127.0.0.1:8000/${renter.profile_picture}`}
            alt="room_image"
          />
          <p>Date of birth: {ChangeDateFormat(renter.date_of_birth)}</p>
          <p>Gender: {renter.gender === 1 ? "Male" : "Female"}</p>
          <p>ID card number: {renter.id_card_number}</p>
          <p>Occupation: {renter.occupation}</p>
          <p>Permanent address: {renter.permanent_address}</p>
        </li>
      </ul>
    );
  });

  return (
    <Fragment>
      <p>All details of room {roomId}</p>
      <ul class="list-group">
        <li class="list-group-item">Room number: {roomId}</li>
        <li class="list-group-item">Description: {details.description}</li>
        <li class="list-group-item">Area: {details.area}</li>
        <li class="list-group-item">
          Conditioner: {details.has_conditioner === 1 ? "Yes" : "No"}
        </li>
        <li class="list-group-item">
          Wardrobe: {details.has_wardrobe === 1 ? "Yes" : "No"}
        </li>
        <li class="list-group-item">
          Fridge: {details.has_fridge === 1 ? "Yes" : "No"}
        </li>
        <li class="list-group-item">Status: {details.status}</li>
      </ul>
      <p>List of images</p>
      {room_images}
      <p>List of renters</p>
      {all_renters}
    </Fragment>
  );
}
