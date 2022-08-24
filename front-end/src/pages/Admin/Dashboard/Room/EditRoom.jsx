import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchCategoryEdit from "../../../../components/Search/SearchCategoryEdit";

import "../../../../assets/css/Dashboard/room.css";

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
  });
  const [checkbox, setCheckbox] = useState([]);
  //const [picture, setPicture] = useState("");
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
        setCheckbox(response.data.room);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-rooms");
      }
    });
    axios.get(AppUrl.GetRoomDetails + roomId).then((response) => {
      if (response.data.status === 200) {
        setRoomDetails(response.data.roomDetails);
        console.log(response.data.roomDetails.category);
        setRenters(response.data.allRenters);
        setRoomImages(response.data.roomImages);
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

  const handleCheckbox = (e) => {
    e.persist();
    setCheckbox({ ...checkbox, [e.target.name]: e.target.checked });
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
    room.append("category_id", selectedCategory.id);
    room.append("number", input.number);
    room.append("description", input.description);
    room.append("area", input.area);
    room.append("has_conditioner", checkbox.has_conditioner ? "1" : "0");
    room.append("has_fridge", checkbox.has_fridge ? "1" : "0");
    room.append("has_wardrobe", checkbox.has_wardrobe ? "1" : "0");

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
      <div className="roomInfoTop">
        <img
          src={`http://127.0.0.1:8000/${renter.profile_picture}`}
          alt="renter_profile_picture"
          className="renterInRoomImg"
        />
        <span className="renterName">{renter.name}</span>
      </div>
    );
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div className="room">
        <div className="titleContainer">
          <h1 className="roomTitle">{roomId}</h1>
        </div>
        <div className="roomTop">
          <div className="roomTopLeft">
            <div className="leftContainer">
              <div className="roomInfoTop">
                <span className="roomName">Room Details</span>
              </div>

              <div className="roomInfoBottom">
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Room number:</span>
                  <span className="roomInfoValue">{roomDetails.number}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Category:</span>
                  <span className="roomInfoValue">
                    {/* {roomDetails.category.name} */}
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
                  <span className="roomName">Renters in room</span>
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
                <input
                  type="checkbox"
                  name="has_conditioner"
                  onChange={handleCheckbox}
                  defaultChecked={checkbox.has_conditioner === 1 ? true : false}
                  id="inputHasConditioner"
                  style={{ display: "inline" }}
                />

                <label>Fridge:</label>
                <input
                  type="checkbox"
                  name="has_fridge"
                  onChange={handleCheckbox}
                  defaultChecked={checkbox.has_fridge === 1 ? true : false}
                  id="inputHasFridge"
                  style={{ display: "inline" }}
                />

                <label>Wardrobe:</label>
                <input
                  type="checkbox"
                  name="has_wardrobe"
                  onChange={handleCheckbox}
                  defaultChecked={checkbox.has_wardrobe === 1 ? true : false}
                  id="inputHasWardrobe"
                  style={{ display: "inline-block" }}
                />

                <label>Image:</label>
                <input
                  type="file"
                  name="image[]"
                  onChange={handleImages}
                  multiple
                />

                <button type="submit" className="roomButton">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="roomBottom">
          <form>
            <div className="roomFormRight">
              <div className="roomUpload">
                {room_images}
                <label for="file">{/* <Publish/> */}</label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
