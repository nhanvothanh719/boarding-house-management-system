import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
  SupervisedUserCircle,
  Wc,
} from "@material-ui/icons";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

import "../../../../assets/css/Dashboard/user.css";

export default function EditUser({ match }) {
  const history = useHistory();
  const userId = match.params.userID;

  const [roles, setRoles] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [errors, setErrors] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    id_card_number: "",
    phone_number: "",
    occupation: "",
    permanent_address: "",
    role_id: "",
    profile_picture: "",
    date_of_birth: "",
  });
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
  const [loading, setLoading] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [userInfoChange, setUserInfoChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRoles).then((response) => {
      if (response.data.status === 200) {
        setRoles(response.data.allRoles);
      }
    });
    axios.get(AppUrl.EditRenter + userId).then((response) => {
      if (response.data.status === 200) {
        setInput(response.data.renter);
        setUserInfo(response.data.renter);
        setDateOfBirth(response.data.renter.date_of_birth);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-renters");
      } else if (response.data.status === 422) {
        swal("All fields are mandatory", "", "error");
        setErrors(response.data.errors);
      }
    });
    setLoading(false);
    if (userInfoChange) {
      setUserInfoChange(false);
    }
  }, [userId, history, userInfoChange]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRenterAvatar = (e) => {
    setAvatar({ image: e.target.files[0] });
  };

  const updateDetails = (e) => {
    e.preventDefault();
    const user = new FormData();
    user.append("name", input.name);
    user.append("email", input.email);
    user.append("gender", input.gender);
    user.append(
      "date_of_birth",
      moment(dateOfBirth).utc().format("YYYY-MM-DD")
    );
    user.append("id_card_number", input.id_card_number);
    user.append("phone_number", input.phone_number);
    user.append("occupation", input.occupation);
    user.append("permanent_address", input.permanent_address);
    user.append("role_id", input.role_id);
    if (avatar.image) {
      user.append("profile_picture", avatar.image);
    }

    axios
      .post(AppUrl.UpdateRenter + userId, user)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          setUserInfoChange(true);
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="customActionTitle">View & Edit personal details</h1>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={`http://127.0.0.1:8000/${input.profile_picture}`}
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{userInfo.name}</span>
                <span className="userShowUserTitle">{input.role_id === 0 ? "Admin" : "Renter"}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Renter Information</span>
              <div className="userShowInfo">
                <SupervisedUserCircle className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.id_card_number}</span>
              </div>
              <div className="userShowInfo">
                <Wc className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.gender === 1 ? "Male" : "Female"}</span>
              </div>
              <div className="userShowInfo">
                <CalendarToday className="userShowIcon" />
                <span className="userShowInfoTitle">{moment(userInfo.date_of_birth).format("DD-MM-YYYY")}</span>
              </div>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.occupation}</span>
              </div>
              <span className="userShowTitle">Contact Details</span>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.phone_number}</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.email}</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">{userInfo.permanent_address}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <form
              className="userUpdateForm"
              encType="multipart/form-data"
              onSubmit={updateDetails}
              id="createRenterForm"
            >
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Full name</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    name="name"
                    onChange={handleInput}
                    value={input.name}
                  />
                </div>
                <small className="text-danger">{errors.name}</small>
                <div className="userUpdateItem">
                  <label>Gender</label>
                  <select
                    className="userUpdateInput"
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
                <div className="userUpdateItem">
                  <label>ID card number</label>
                  <input
                    type="text"
                    name="id_card_number"
                    onChange={handleInput}
                    value={input.id_card_number}
                    className="userUpdateInput"
                  />
                </div>
                <small className="text-danger">{errors.id_card_number}</small>
                <div className="userUpdateItem">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    onChange={handleInput}
                    value={input.occupation}
                    className="userUpdateInput"
                  />
                </div>
                <small className="text-danger">{errors.occupation}</small>
                <div className="userUpdateItem">
                  <label>Date of birth</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    label="Date of birth"
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
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    className="userUpdateInput"
                    type="text"
                    name="email"
                    onChange={handleInput}
                    value={input.email}
                  />
                </div>
                <small className="text-danger">{errors.email}</small>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    className="userUpdateInput"
                    type="text"
                    name="phone_number"
                    onChange={handleInput}
                    value={input.phone_number}
                  />
                </div>
                <small className="text-danger">{errors.phone_number}</small>
                <div className="userUpdateItem">
                  <label>Address</label>
                  <textarea
                    type="text"
                    name="permanent_address"
                    onChange={handleInput}
                    value={input.permanent_address}
                    className="userUpdateInput"
                  />
                </div>
                <small className="text-danger">{errors.permanent_address}</small>
                <div className="userUpdateItem">
                  <label>Role</label>
                  <select
                name="role_id"
                className="userUpdateInput"
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
                <small className="text-danger">{errors.permanent_address}</small>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={`http://127.0.0.1:8000/${input.profile_picture}`}                    
                    alt=""
                  />
                  <label htmlFor="file">
                    <Publish className="userUpdateIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    name="profile_picture"
                    onChange={handleRenterAvatar}
                  />
                </div>
                <small className="text-danger">{errors.profile_picture}</small>
                <button type="submit" className="userUpdateButton">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
