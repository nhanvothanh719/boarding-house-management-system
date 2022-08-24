import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchCategory from "../../../../components/Search/SearchCategory";
import SearchCategoryEdit from "../../../../components/Search/SearchCategoryEdit";

export default function EditRooms({ match }) {
  const history = useHistory();
  const roomId = match.params.roomID;
  const [input, setInput] = useState({
    number: "",
    description: "",
    category_id: "",
    area: "",
  });
  const [checkbox, setCheckbox] = useState([]);
  const [picture, setPicture] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
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

  const getSelectedCategory = (category) => {
    setSelectedCategory(category);
  }

  const updateRoom = (e) => {
    e.preventDefault();
    const room = new FormData();
    for (let i = 0; i < picture.length; i++) {
      //Appends a new value onto an existing key inside a FormData object
      //or adds the key if it does not already exist.
      room.append(`image[${i}]`, picture[i]);
      console.log(picture[i]);
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
