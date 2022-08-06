import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function EditRoom({ match }) {
  const history = useHistory();
  const roomId = match.params.roomID;

  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    number: "",
    category_id: "",
    description: "",
    area: "",
  });
  const [checkbox, setCheckbox] = useState([]);
  const [picture, setPicture] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.data.status === 200) {
        setCategories(response.data.allCategories);
      }
    });

    axios.get(AppUrl.EditRoom + roomId).then((response) => {
      if (response.data.status === 200) {
        setInput(response.data.room);
        setCheckbox(response.data.room);
        setOldImages(response.data.images);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-services");
      }
      setLoading(false);
    });
  }, [roomId, history]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    e.persist();
    setCheckbox({ ...checkbox, [e.target.name]: e.target.checked });
  };

  const handleImage = (e) => {
    setPicture(e.target.files);
  };

  const updateRoom = (e) => {
    e.preventDefault();
    const room = new FormData();
    for (let i = 0; i < picture.length; i++) {
      //Appends a new value onto an existing key inside a FormData object
      //or adds the key if it does not already exist.
      room.append(`image[${i}]`, picture[i]);
      console.log(picture[i]);
    }
    room.append("category_id", input.category_id);
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
          history.push("/admin/view-all-rooms");
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

  var display_images = "";
  if (loading) {
    return <Loading />;
  } else {
    display_images = oldImages.map((img) => {
      return (
        <img
          src={`http://127.0.0.1:8000/${img.image_name}`}
          alt=""
          style={{ height: "100%" }}
        />
      );
    });
  }
  return (
    <Fragment>
      <div className="topContainer">
        <h1>Edit room</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          {/* Use multipart/form-data when the form includes any <input type="file"> elements */}
          <form
            encType="multipart/form-data"
            className="flexForm"
            onSubmit={updateRoom}
            id="createCategoryForm"
          >

            <div className="formInput">
              <label>Room number:</label>
              <input
                type="text"
                className="inputItem"
                name="number"
                onChange={handleInput}
                value={input.number}
                id="inputRoomNumber"
              />
            </div>
            <small className="text-danger">{errors.number}</small>
            <div className="formInput">
              <label>Category:</label>
              <select
                className="form-control"
                name="category_id"
                onChange={handleInput}
                value={input.category_id}
              >
                {categories.map((category) => {
                  return (
                    <option value={category.id} key={category.id}>
                      {" "}
                      {category.name}{" "}
                    </option>
                  );
                })}
              </select>
            </div>
            <small className="text-danger">{errors.category_id}</small>
            <div className="formInput">
              <label>Description:</label>
              <textarea
                type="text"
                className="inputItem"
                name="description"
                onChange={handleInput}
                value={input.description}
                id="inputDescription"
              />
            </div>
            <small className="text-danger">{errors.description}</small>
            <div className="formInput">
              <label>Area:</label>
              <input
                type="text"
                className="inputItem"
                name="area"
                onChange={handleInput}
                value={input.area}
                id="inputArea"
              />
            </div>
            <small className="text-danger">{errors.area}</small>
            <div className="formInput">
              <label>Conditioner:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="has_conditioner"
                onChange={handleCheckbox}
                defaultChecked={checkbox.has_conditioner === 1 ? true : false}
                id="inputHasConditioner"
              />
            </div>

            <div className="formInput">
              <label>Fridge:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="has_fridge"
                onChange={handleCheckbox}
                defaultChecked={checkbox.has_fridge === 1 ? true : false}
                id="inputHasFridge"
              />
            </div>

            <div className="formInput">
              <label>Wardrobe:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="has_wardrobe"
                onChange={handleCheckbox}
                defaultChecked={checkbox.has_wardrobe === 1 ? true : false}
                id="inputHasWardrobe"
              />
            </div>

            <div className="formInput form-group">
              <label>Image:</label>
              <input
                type="file"
                className="form-control"
                name="image[]"
                id="inputImage"
                onChange={handleImage}
                multiple
              />
            </div>
            <small className="text-danger">{errors.image}</small>
            {display_images}
            <button type="submit" className="formButton">
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
