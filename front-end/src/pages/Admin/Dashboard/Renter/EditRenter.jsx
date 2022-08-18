import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function EditRenter({ match }) {
  const history = useHistory();
  const renterId = match.params.renterID; 

  const [roles, setRoles] = useState([]);
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
    profile_picture: "",
  });
  const [loading, setLoading] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowRoles).then((response) => {
      if (response.data.status === 200) {
        setRoles(response.data.allRoles);
      }
    });

    axios.get(AppUrl.EditRenter + renterId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.renter);
          console.log(response.data.renter);
          setDateOfBirth(response.data.renter.date_of_birth);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
          history.push("/admin/view-all-renters");
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        }
        setLoading(false);
      });
  }, [renterId, history]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRenterAvatar = (e) => {
    setAvatar({ avatar: e.target.files[0] });
  };

  const updateRenter = (e) => {
    e.preventDefault();
    const renter = new FormData();
    renter.append("name", input.name);
    renter.append("email", input.email);
    renter.append("gender", input.gender);
    renter.append("date_of_birth",  moment(dateOfBirth).utc().format("YYYY-MM-DD"));
    renter.append("id_card_number", input.id_card_number);
    renter.append("phone_number", input.phone_number);
    renter.append("occupation", input.occupation);
    renter.append("permanent_address", input.permanent_address);
    renter.append("role_id", input.role_id);
    if (avatar.avatar) {
      renter.append("profile_picture", avatar.avatar);
    }

    axios
      .post(AppUrl.UpdateRenter + renterId, renter)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          history.push("/admin/view-all-renters");
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if(loading) {
    return <Loading />;
  }

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
            onSubmit={updateRenter}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      renderInput={(props) => <TextField {...props} />}
                      value={dateOfBirth}
                      name="date_of_birth"
                      onChange={(selectedDate) => {
                        setDateOfBirth(selectedDate);
                      }}
                    />
                  </LocalizationProvider>
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
            <img src={`http://127.0.0.1:8000/${input.profile_picture}`} alt= "" style={{width: "60px", height: "60px", borderRadius: "50%"}}/>
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
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
