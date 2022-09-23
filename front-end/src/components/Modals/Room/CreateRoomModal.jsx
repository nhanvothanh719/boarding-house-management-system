import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import TextField from "@mui/material/TextField";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchCategory from "../../Search/SearchCategory";
import "../../../assets/css/modal.css";

export default function CreateRoomModal(props) {
  const [input, setInput] = useState({
    number: "",
    description: "",
    area: "",
    has_conditioner: "",
    has_fridge: "",
    has_wardrobe: "",
    category_id: ""
  });
  const [pictures, setPictures] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createRoomModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createRoomModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setPictures(e.target.files);
  };

  const getSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

  const addRoom = (e) => {
    e.preventDefault();
    const room = new FormData();
    if (pictures.length > 0) {
      for (let i = 0; i < pictures.length; i++) {
        //Appends a new value onto an existing key inside a FormData object
        //or adds the key if it does not already exist.
        room.append(`image[${i}]`, pictures[i]);
        console.log(pictures[i]);
      }
    } else {
      room.append('image', []);
    }
    if(selectedCategory === null) {
      setErrors({ category_id: "The category field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    room.append("category_id", selectedCategory.id);
    room.append("number", input.number);
    room.append("description", input.description);
    room.append("area", input.area);
    room.append("has_conditioner", input.has_conditioner);
    room.append("has_fridge", input.has_fridge);
    room.append("has_wardrobe", input.has_wardrobe);

    axios
      .post(AppUrl.StoreRoom, room)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setInput({
            number: "",
            description: "",
            area: "",
            has_conditioner: "",
            has_fridge: "",
            has_wardrobe: "",
            category_id: ""
          });
          setPictures([]);
          setSelectedCategory(null);
          swal("Success", response.data.message, "success");
          props.updateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="createRoomModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Create new room</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              {/* Use multipart/form-data when the form includes any <input type="file"> elements */}
              <form
                encType="multipart/form-data"
                className="flexForm"
                id="createCategoryForm"
              >
                <div>
                  <label className="customModalLabel">Room number:</label>
                  <TextField
                    label="Room number"
                    name="number"
                    onChange={handleInput}
                    value={input.number}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.number}</small>
                <div>
                  <label className="customModalLabel">Category:</label>
                  <SearchCategory getSelectedCategory={getSelectedCategory} />
                </div>
                <small className="text-danger customSmallError">{errors.category_id}</small>
                <div>
                  <label className="customModalLabel">Description:</label>
                  <TextField
                    label="Description"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    fullWidth
                    required
                    multiline
                  />
                </div>
                <small className="text-danger customSmallError">{errors.description}</small>
                <div>
                  <label className="customModalLabel">Area:</label>
                  <TextField
                    label="Area"
                    name="area"
                    onChange={handleInput}
                    value={input.area}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.area}</small>
                <div>
                  <label className="customModalLabel">Conditioner:</label>
                  <input
                    type="checkbox"
                    className="customCheckbox"
                    name="has_conditioner"
                    onChange={handleInput}
                    defaultChecked={input.has_conditioner === 1 ? true : false}
                    id="inputHasConditioner"
                  />
                </div>

                <div>
                  <label className="customModalLabel">Fridge:</label>
                  <input
                    type="checkbox"
                    className="customCheckbox"
                    name="has_fridge"
                    onChange={handleInput}
                    defaultChecked={input.has_fridge === 1 ? true : false}
                    id="inputHasFridge"
                  />
                </div>

                <div>
                  <label className="customModalLabel">Wardrobe:</label>
                  <input
                    type="checkbox"
                    className="customCheckbox"
                    name="has_wardrobe"
                    onChange={handleInput}
                    defaultChecked={input.has_wardrobe === 1 ? true : false}
                    id="inputHasWardrobe"
                  />
                </div>

                <div className="formInput form-group">
                  <label className="customModalLabel">Images:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image[]"
                    id="inputImage"
                    onChange={handleImage}
                    accept="image/*"
                    multiple
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={addRoom}
              >
                Create
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
