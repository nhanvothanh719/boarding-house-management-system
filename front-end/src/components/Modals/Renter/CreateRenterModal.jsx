import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";

export default function CreateRenterModal(props) {
  const [rolesList, setRolesList] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    email: "",
    gender: "",
    id_card_number: "",
    phone_number: "",
    occupation: "",
    permanent_address: "",
    role_id: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [customValidation, setCustomValidation] = useState("");

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createRenterModal")
      );
      model.show();
      axios.get(AppUrl.ShowRoles).then((response) => {
        if (response.data.status === 200) {
          setRolesList(response.data.allRoles);
        }
      });
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createRenterModal")
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

  const handleRenterAvatar = (e) => {
    setAvatar({ image: e.target.files[0] });
  };

  const addRenter = (e) => {
    e.preventDefault();
    const renter = new FormData();
    renter.append("name", input.name);
    renter.append("email", input.email);
    renter.append(
      "date_of_birth",
      moment(dateOfBirth).utc().format("YYYY-MM-DD")
    );
    renter.append("gender", input.gender);
    renter.append("id_card_number", input.id_card_number);
    renter.append("phone_number", input.phone_number);
    renter.append("occupation", input.occupation);
    renter.append("permanent_address", input.permanent_address);
    if(!input.role_id) {
        setCustomValidation("Role cannot be null");
        setTimeout(() => {
            displayModal();
          }, 1000);
    }
    else {
        renter.append("role_id", input.role_id);
    }
    if (avatar.image) {
      renter.append("profile_picture", avatar.image);
    }
    axios
      .post(AppUrl.StoreRenter, renter)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
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
        id="createRenterModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Create new user</h5>
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
              <form encType="multipart/form-data">
                <div>
                  <label className="customModalLabel">Name:</label>
                  <TextField
                    label="Name"
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.name}</small>
                <div>
                  <label className="customModalLabel">Email:</label>
                  <TextField
                    label="Email"
                    name="email"
                    value={input.email}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.email}</small>
                <div>
                  <label className="customModalLabel">Phone number:</label>
                  <TextField
                    label="Phone number"
                    name="phone_number"
                    value={input.phone_number}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.phone_number}</small>
                <div>
                  <label className="customModalLabel">Date of birth:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      renderInput={(props) => (
                        <TextField fullWidth required {...props} />
                      )}
                      value={dateOfBirth}
                      name="date_of_birth"
                      onChange={(selectedDate) => {
                        setDateOfBirth(selectedDate);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <small className="text-danger">{errors.date_of_birth}</small>
                <div>
                  <label className="customModalLabel">Occupation:</label>
                  <TextField
                    label="Occupation"
                    name="occupation"
                    value={input.occupation}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.occupation}</small>
                <div>
                  <label className="customModalLabel">ID card number:</label>
                  <TextField
                    label="ID card number"
                    name="id_card_number"
                    value={input.id_card_number}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.id_card_number}</small>
                <div>
                  <label className="customModalLabel">Permanent address:</label>
                  <TextField
                    label="Permanent address"
                    name="permanent_address"
                    value={input.permanent_address}
                    onChange={handleInput}
                    fullWidth
                    required
                    multiline
                  />
                </div>
                <small className="text-danger">
                  {errors.permanent_address}
                </small>
                <div className="formInput form-group">
                  <label className="customModalLabel">Profile picture:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="profile_picture"
                    onChange={handleRenterAvatar}
                  />
                </div>
                <small className="text-danger">{errors.profile_picture}</small>
                <div>
                  <label className="customModalLabel">Role:</label>
                  <select
                    className="form-control"
                    name="role_id"
                    onChange={handleInput}
                    value={input.role_id}
                  >
                    <option selected>--- Select role ---</option>
                    {rolesList.map((role) => {
                      return (
                        <option value={role.id} key={role.id}>
                          {" "}
                          {role.name}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <small className="text-danger">{errors.role_id}</small>
                <div>
                  <label className="customModalLabel">Gender:</label>
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
                <small className="text-danger">{customValidation}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={addRenter}
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
