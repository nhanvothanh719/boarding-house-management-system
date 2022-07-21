import React, { Fragment, useEffect, useState } from "react";
import AppUrl from "../../../RestAPI/AppUrl";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

export default function CreateRoom() {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState(
    {
      number: "",
      category_id: "",
      status: "",
      description: "",
      area: "",
      has_conditioner: "",
      has_fridge: "",
      has_wardrobe: "",
    }
  );
  //const [checkboxes, setCheckboxes] = useState(false);
  const [picture, setPicture] = useState('');
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

  // const handleCheckbox = (e) => {
  //   e.persist();
  //   setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  // };

  //let imgs = [];

  const handleImage = (e) => {
    // setPicture([]);
    // if(e.target.files) {
    //   const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    //   setPicture((prevImages) => prevImages.concat(filesArray));
    //   Array.from(e.target.files).map(
    //     (file) => URL.revokeObjectURL(file)
    //   );
    //   //etPicture(e.target[0].files);
    // }
    //setPicture({ image: e.target.files[0] });
    
    // for (let i = 0; i < e.target.files.length; i++) {
    //    imgs.push(e.target.files[i]);
    // }
    // setPicture({ image: imgs });
    setPicture(e.target.files);
  }

  // const renderImages = (source) => {
  //   return source.map((photo) => {
  //     return <img className="p-2" alt="" src={photo} key={photo} style={{ width: "20%", height: "180px" }}></img>
  //   });
  // }

  // const handleImage = (e) => {
  //   setPicture( e.target.files[0] );
  // }

  const createRoom = (e) => {
    e.preventDefault();
    const newRoom = new FormData();
    for(let i = 0; i < picture.length; i++) {

      //Appends a new value onto an existing key inside a FormData object 
      //or adds the key if it does not already exist.
      newRoom.append(`image[${i}]`, picture[i]);
      console.log(picture[i]);
    }
    newRoom.append('category_id', input.category_id);
    newRoom.append('status', input.status);
    newRoom.append('number', input.number);
    newRoom.append('description', input.description);
    newRoom.append('area', input.area);
    newRoom.append('has_conditioner', input.has_conditioner);
    newRoom.append('has_fridge', input.has_fridge);
    newRoom.append('has_wardrobe', input.has_wardrobe);

    axios
      .post(AppUrl.StoreRoom, newRoom)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          history.push("/admin/view-all-rooms");
        } else if (response.data.status === 422) {
          swal("All fields are mandetory","", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 400) {
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Fragment>
      <div className="topContainer">
        <h1>Add new room</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          {/* Use multipart/form-data when your form includes any <input type="file"> elements */}
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
              <label>Status:</label>
              <select class="form-control" name="status" onChange={handleInput} value={input.status}>
                <option value="0" key="0"> Full </option>
                <option value="1" key="1"> Hectic </option>
                <option value="2" key="2" selected>
                  {" "}
                  Empty{" "}
                </option>
              </select>
            </div>
            <small className="text-danger">{errors.status}</small>
            <div className="formInput">
              <label>Category:</label>
              <select className="form-control" name="category_id" onChange={handleInput} value={input.category_id}>
                <option selected disabled>--- Select category ---</option>
                {categories.map((category) => { return (
                  <option value={category.id} key={category.id}> {category.name} </option>
                )})}
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
                //name="image[]"
                name="image[]"
                id="inputImage"
                onChange={handleImage}
                multiple
              />
            </div>
            {/* <div>{renderImages(picture)}</div> */}
            <small className="text-danger">{errors.image}</small>
            <button type="submit" className="formButton">
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
