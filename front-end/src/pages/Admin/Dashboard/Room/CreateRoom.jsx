import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../../RestAPI/AppUrl";

export default function CreateRoom() {
  const history = useHistory();

  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    number: "",
    category_id: "",
    description: "",
    area: "",
    has_conditioner: "",
    has_fridge: "",
    has_wardrobe: "",
  });
  const [pictures, setPictures] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.data.status === 200) {
        setCategories(response.data.allCategories);
      }
    });
  }, []);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setPictures(e.target.files);
  };

  const createRoom = (e) => {
    e.preventDefault();
    const newRoom = new FormData();
    if(pictures) {
      for (let i = 0; i < pictures.length; i++) {
        //Appends a new value onto an existing key inside a FormData object
        //or adds the key if it does not already exist.
        newRoom.append(`image[${i}]`, pictures[i]);
        console.log(pictures[i]);
      }
    }
    newRoom.append("category_id", input.category_id);
    newRoom.append("number", input.number);
    newRoom.append("description", input.description);
    newRoom.append("area", input.area);
    newRoom.append("has_conditioner", input.has_conditioner);
    newRoom.append("has_fridge", input.has_fridge);
    newRoom.append("has_wardrobe", input.has_wardrobe);

    axios
      .post(AppUrl.StoreRoom, newRoom)
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

  return (
    <Fragment>
      <div className="topContainer">
        <h1>Add new room</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          {/* Use multipart/form-data when the form includes any <input type="file"> elements */}
          <form
            encType="multipart/form-data"
            className="flexForm"
            onSubmit={(e) => createRoom(e)}
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
                <option selected>--- Select category ---</option>
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
                onChange={handleInput}
                defaultChecked={input.has_conditioner === 1 ? true : false}
                id="inputHasConditioner"
              />
            </div>

            <div className="formInput">
              <label>Fridge:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="has_fridge"
                onChange={handleInput}
                defaultChecked={input.has_fridge === 1 ? true : false}
                id="inputHasFridge"
              />
            </div>

            <div className="formInput">
              <label>Wardrobe:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="has_wardrobe"
                onChange={handleInput}
                defaultChecked={input.has_wardrobe === 1 ? true : false}
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
            <button type="submit" className="formButton">
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
