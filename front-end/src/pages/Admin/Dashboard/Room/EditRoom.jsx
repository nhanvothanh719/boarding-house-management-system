import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import { Publish } from "@material-ui/icons";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchCategoryEdit from "../../../../components/Search/SearchCategoryEdit";
import DefaultAvatar from "../../../../assets/images/default_avatar.png";

import "../../../../assets/css/Dashboard/room.css";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function EditRoom({ match }) {
  const history = useHistory();
  const roomId = match.params.roomID;

  const [input, setInput] = useState({
    number: "",
    description: "",
    category: {},
    area: "",
  });
  const [roomDetails, setRoomDetails] = useState({
    number: "",
    description: "",
    category: {},
    area: "",
    has_conditioner: "",
    has_fridge: "",
    has_wardrobe: "",
    images: [],
    renters: [],
  });
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [roomImages, setRoomImages] = useState([]);
  const [renters, setRenters] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [roomDetailsChange, setRoomDetailsChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.EditRoom + roomId).then((response) => {
      if (response.data.status === 200) {
        setInput(response.data.room);
        setRoomDetails(response.data.room);
        setSelectedCategory(response.data.room.category);
        setRoomImages(response.data.room.images);
        setRenters(response.data.room.renters);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-rooms");
      }
    });
    setLoading(false);
    if (roomDetailsChange) {
      setRoomDetailsChange(false);
    }
  }, [roomId, history, roomDetailsChange]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setUploadedPictures(e.target.files);
  };

  const getSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

  const updateRoom = (e) => {
    e.preventDefault();
    const room = new FormData();
    for (let i = 0; i < uploadedPictures.length; i++) {
      //Appends a new value onto an existing key inside a FormData object
      //or adds the key if it does not already exist.
      room.append(`image[${i}]`, uploadedPictures[i]);
      //console.log(pictures[i]);
    }
    if (selectedCategory === null) {
      room.append("category_id", input.category.id);
    } else {
      room.append("category_id", selectedCategory.id);
    }
    room.append("number", input.number);
    room.append("description", input.description);
    room.append("area", input.area);
    room.append("has_conditioner", input.has_conditioner);
    room.append("has_fridge", input.has_fridge);
    room.append("has_wardrobe", input.has_wardrobe);

    axios
      .post(AppUrl.UpdateRoom + roomId, room) //Use POST (instead of PUT) when create a new instance
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          setRoomDetailsChange(true);
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 400) {
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const room_images = roomImages.map((img) => {
    return (
      <img
        src={`http://127.0.0.1:8000/${img.image_name}`}
        alt=""
        className="roomUploadImg"
      />
    );
  });

  const all_renters = renters.map((renter) => {
    return (
      <Link
        className="customDashboardLink"
        to={`/admin/edit-user/${renter.id}`}
        style={{ fontWeight: "600" }}
      >
        <div className="roomInfoTop">
          <span>
            <img
              src={renter.profile_picture ? `http://127.0.0.1:8000/${renter.profile_picture}`  : DefaultAvatar}
              alt="renter_profile_picture"
              className="renterInRoomImg"
            />
          </span>
          <span>{renter.name}</span>
        </div>
      </Link>
    );
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Room details" />
      <div className="room">
        <div className="titleContainer">
          <h1 className="customActionTitle">View & Edit room details</h1>
        </div>
        <div className="roomTop">
          <div className="roomTopLeft">
            <div className="leftContainer">
              <div className="roomInfoTop">
                <span className="customFieldTitle">Room Details</span>
              </div>

              <div className="roomInfoBottom">
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Room number:</span>
                  <span className="roomInfoValue">{roomDetails.number}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Category:</span>
                  <span className="roomInfoValue">
                    {roomDetails.category.name}
                  </span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Description:</span>
                  <span className="roomInfoValue">
                    {roomDetails.description}
                  </span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Area:</span>
                  <span className="roomInfoValue">{roomDetails.area}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Conditioner:</span>
                  <span className="roomInfoValue">
                    {roomDetails.has_conditioner === 1 ? "Yes" : "No"}
                  </span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Fridge:</span>
                  <span className="roomInfoValue">
                    {roomDetails.has_fridge === 1 ? "Yes" : "No"}
                  </span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Wardrobe:</span>
                  <span className="roomInfoValue">
                    {roomDetails.has_wardrobe === 1 ? "Yes" : "No"}
                  </span>
                </div>
                <div className="roomInfoTop">
                  <span className="customFieldTitle">Renters in room</span>
                </div>
                {all_renters}
              </div>
            </div>
          </div>
          <div className="roomTopRight">
            <form
              encType="multipart/form-data"
              onSubmit={updateRoom}
              id="createCategoryForm"
            >
              <div className="roomFormLeft">
                <label>Room number:</label>
                <input
                  type="text"
                  name="number"
                  onChange={handleInput}
                  value={input.number}
                />
                <small className="text-danger">{errors.number}</small>

                <label>Category:</label>
                <SearchCategoryEdit
                  getSelectedCategory={getSelectedCategory}
                  currentCategory={input.category}
                />
                <small className="text-danger">{errors.category_id}</small>

                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  onChange={handleInput}
                  value={input.description}
                />
                <small className="text-danger">{errors.description}</small>

                <label>Area:</label>
                <input
                  type="text"
                  name="area"
                  onChange={handleInput}
                  value={input.area}
                />
                <small className="text-danger">{errors.area}</small>

                <label>Conditioner:</label>
                <select
                  name="has_conditioner"
                  onChange={handleInput}
                  value={input.has_conditioner}
                  className="form-control"
                >
                  <option value="0" key="0">
                    {" "}
                    No{" "}
                  </option>
                  <option value="1" key="1">
                    {" "}
                    Yes{" "}
                  </option>
                </select>

                <label>Fridge:</label>
                <select
                  name="has_fridge"
                  onChange={handleInput}
                  value={input.has_fridge}
                  className="form-control"
                >
                  <option value="0" key="0">
                    {" "}
                    No{" "}
                  </option>
                  <option value="1" key="1">
                    {" "}
                    Yes{" "}
                  </option>
                </select>

                <label>Wardrobe:</label>

                <select
                  name="has_wardrobe"
                  onChange={handleInput}
                  value={input.has_wardrobe}
                  className="form-control"
                >
                  <option value="0" key="0">
                    {" "}
                    No{" "}
                  </option>
                  <option value="1" key="1">
                    {" "}
                    Yes{" "}
                  </option>
                </select>
                <label>Images:</label>
                <label htmlFor="file">
                  <Publish
                    className="userUpdateIcon"
                    style={{ fontSize: "35px" }}
                  />
                </label>
                <input
                  type="file"
                  id="file"
                  name="image[]"
                  onChange={handleImages}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
                <button type="submit" className="roomButton">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="roomBottom">
            <div className="roomFormRight">
              <span className="customFieldTitle">Room images</span>
              <div className="roomUpload">{room_images}</div>
            </div>
        </div>
      </div>
    </Fragment>
  );
}
