import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function CreateUserModal(props) {
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
  const [selectGender, setSelectGender] = useState('');
  const [selectRole, setSelectRole] = useState('');

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createUserModal")
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
      document.getElementById("createUserModal")
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

  const handleUserAvatar = (e) => {
    setAvatar({ image: e.target.files[0] });
  };

  const addUser = (e) => {
    e.preventDefault();
    props.setLoaderClass("");
    props.setDisplayComponentsClass("d-none");
    const renter = new FormData();
    renter.append("name", input.name);
    renter.append("email", input.email);
    renter.append(
      "date_of_birth",
      moment(dateOfBirth).utc().format("YYYY-MM-DD")
    );
    renter.append("gender", selectGender);
    renter.append("id_card_number", input.id_card_number);
    renter.append("phone_number", input.phone_number);
    renter.append("occupation", input.occupation);
    renter.append("permanent_address", input.permanent_address);
    renter.append("role_id", selectRole);
    if (avatar.image) {
      renter.append("profile_picture", avatar.image);
    }
    axios
      .post(AppUrl.StoreUser, renter)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setAvatar([]);
          setInput({
            name: "",
            email: "",
            gender: "",
            id_card_number: "",
            phone_number: "",
            occupation: "",
            permanent_address: "",
            role_id: "",  
          }); 
          setDateOfBirth(null);
          setSelectGender('');
          setSelectRole('');
          swal("Success", response.data.message, "success");
          props.updateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        }
        props.setDisplayComponentsClass("");
        props.setLoaderClass("d-none");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="createUserModal"
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
                <small className="text-danger customSmallError">{errors.name}</small>
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
                <small className="text-danger customSmallError">{errors.email}</small>
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
                <small className="text-danger customSmallError">{errors.phone_number}</small>
                <div>
                  <label className="customModalLabel">Date of birth:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of birth"
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
                <small className="text-danger customSmallError">{errors.date_of_birth}</small>
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
                <small className="text-danger customSmallError">{errors.occupation}</small>
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
                <small className="text-danger customSmallError">{errors.id_card_number}</small>
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
                <small className="text-danger customSmallError">
                  {errors.permanent_address}
                </small>
                <div className="formInput">
                  <label className="customModalLabel">Profile picture:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="profile_picture"
                    onChange={handleUserAvatar}
                    accept="image/*"
                  />
                </div>
                <small className="text-danger customSmallError">{errors.profile_picture}</small>
                <div>
                  <label className="customModalLabel">Gender:</label>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      //name="gender"
                      onChange={(e) => setSelectGender(e.target.value)}
                      value={selectGender}
                      required
                    >
                      <MenuItem
                        value={0}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Female
                      </MenuItem>
                      <MenuItem
                        value={1}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Male
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <small className="text-danger customSmallError">{errors.gender}</small>
                <div>
                  <label className="customModalLabel">Role:</label>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      //name="role_id"
                      onChange={(e) => setSelectRole(e.target.value)}
                      value={selectRole}
                      required
                    >
                      {rolesList.map((role) => {
                        return (
                          <MenuItem
                            value={role.id}
                            key={role.id}
                            style={{
                              display: "block",
                              padding: "5px 30px 5px",
                            }}
                          >
                            {role.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <small className="text-danger customSmallError">{errors.role_id}</small>
              </form>
            </div>
            <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              onClick={addUser}
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
