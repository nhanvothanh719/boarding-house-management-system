import React, { Fragment, useState, useEffect } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../../RestAPI/AppUrl";
import { useHistory } from "react-router-dom";

export default function CreateRenter() {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    id_card_number: "",
    phone_number: "",
    occupation: "",
    permanent_address: "",
    role_id: "",
  });
  
  useEffect(() => {
    axios.get(AppUrl.ShowRoles).then((response) => {
      if (response.data.status === 200) {
        setRoles(response.data.allRoles);
      }
    });
  }, []);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRenterAvatar = (e) => {
    setAvatar({ avatar: e.target.files[0] });
  }

  const createRenter = (e) => {
    e.preventDefault();
    const renter = new FormData();
    renter.append("name", input.name);
    renter.append("email", input.email);
    renter.append("gender", input.gender);
    renter.append("date_of_birth", input.date_of_birth);
    renter.append("id_card_number", input.id_card_number);
    renter.append("phone_number", input.phone_number);
    renter.append("occupation", input.occupation);
    renter.append("permanent_address", input.permanent_address);
    renter.append("role_id", input.role_id);
    if(avatar.avatar) {
      renter.append('profile_picture', avatar.avatar);
    }

    axios
      .post(AppUrl.StoreRenter, renter)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          history.push("/admin/view-all-renters");
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
        <h1>Add new renter</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form
            encType="multipart/form-data"
            className="flexForm"
            onSubmit={createRenter}
            id="createRenterForm"
          >
            <div className="formInput">
              <label>Name:</label>
              <input
                type="text"
                className="inputItem"
                name="name"
                onChange={handleInput}
                value={input.name}
              />
            </div>
            <small className="text-danger">{errors.name}</small>
            <div className="formInput">
              <label>Email:</label>
              <input
                type="text"
                className="inputItem"
                name="email"
                onChange={handleInput}
                value={input.email}
              />
            </div>
            <small className="text-danger">{errors.email}</small>
            <div className="formInput">
              <label>Phone number:</label>
              <input
                type="text"
                className="inputItem"
                name="phone_number"
                onChange={handleInput}
                value={input.phone_number}
              />
            </div>
            <small className="text-danger">{errors.phone_number}</small>
            <div className="formInput">
              <label>Date of birth:</label>
              <input
                type="date"
                className="inputItem"
                name="date_of_birth"
                onChange={handleInput}
                value={input.date_of_birth}
              />
            </div>
            <small className="text-danger">{errors.date_of_birth}</small>
            <div className="formInput">
              <label>Occupation:</label>
              <input
                type="text"
                className="inputItem"
                name="occupation"
                onChange={handleInput}
                value={input.occupation}
              />
            </div>
            <small className="text-danger">{errors.occupation}</small>
            <div className="formInput">
              <label>ID card number:</label>
              <input
                type="text"
                className="inputItem"
                name="id_card_number"
                onChange={handleInput}
                value={input.id_card_number}
              />
            </div>
            <small className="text-danger">{errors.id_card_number}</small>
            <div className="formInput">
              <label>Permanent address:</label>
              <textarea
                type="text"
                className="inputItem"
                name="permanent_address"
                onChange={handleInput}
                value={input.permanent_address}
              />
            </div>
            <small className="text-danger">{errors.permanent_address}</small>
            <div className="formInput form-group">
              <label>Profile picture:</label>
              <input
                type="file"
                className="form-control"
                name="profile_picture"
                onChange={handleRenterAvatar}
              />
            </div>
            <small className="text-danger">{errors.profile_picture}</small>
            <div className="formInput">
              <label>Role:</label>
              <select
                className="form-control"
                name="role_id"
                onChange={handleInput}
                value={input.role_id}
              >
                <option selected>--- Select role ---</option>
                {roles.map((role) => {
                  return (
                    <option value={role.id} key={role.id}>
                      {" "}
                      {role.name}{" "}
                    </option>
                  );
                })}
              </select>
            </div>
            <small className="text-danger">{errors.roles}</small>
            <div className="formInput">
              <label>Gender:</label>
              <select
                class="form-control"
                name="gender"
                onChange={handleInput}
                value={input.gender}
              >
                <option selected>--- Select gender ---</option>
                <option value="0" key="0">
                  {" "}
                  Female{" "}
                </option>
                <option value="1" key="1">
                  {" "}
                  Male{" "}
                </option>
              </select>
            </div>
            <small className="text-danger">{errors.gender}</small>
            <button type="submit" className="formButton">
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
