import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import TextField from "@mui/material/TextField";

import AppUrl from "../../../RestAPI/AppUrl";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function RegisterRoomModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone_number: "",
  });
  const [senderGender, setSenderGender] = useState(0);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addRoomRentModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addRoomRentModal")
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

  const handleGenderChange = (event) => {
    setSenderGender(event.target.value);
  };

  const makeNewRentRegistration = (e) => {
    e.preventDefault();
    const room_rent_registration = {
      sender_name: input.sender_name,
      sender_gender: senderGender,
      sender_email: input.sender_email,
      sender_phone_number: input.sender_phone_number,
      registered_room_id: props.roomId,
    };
    axios
      .post(AppUrl.StoreRoomRentRegistration, room_rent_registration)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          swal("Success", response.data.message, "success");
          props.updateCreateModalStatus(true);
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
        id="addRoomRentModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Register for a new room rent
              </h5>
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
              <form className="">
                <div>
                  <label className="customModalLabel">Name:</label>
                  <TextField
                    label="Name"
                    name="sender_name"
                    value={input.sender_name}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                  <small className="text-danger">{errors.sender_name}</small>
                </div>
                <div>
                <label className="customModalLabel">Gender:</label>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={senderGender}
                    label="Gender"
                    onChange={handleGenderChange}
                    style={{display: "block"}}
                  >
                    <MenuItem value={0}>Female</MenuItem>
                    <MenuItem value={1}>Male</MenuItem>
                  </Select>
                </FormControl>
                </div>
                <div>
                  <label className="customModalLabel">Email:</label>
                  <TextField
                    label="Email"
                    name="sender_email"
                    value={input.sender_email}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.sender_email}</small>
                <div>
                  <label className="customModalLabel">Phone number:</label>
                  <TextField
                    label="Phone number"
                    name="sender_phone_number"
                    value={input.sender_phone_number}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">
                  {errors.sender_phone_number}
                </small>
                <div>
                  <label className="customModalLabel">Room number:</label>
                  <TextField
                    label="Room number"
                    name="room_number"
                    value={props.roomNumber}
                    fullWidth
                    required
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={makeNewRentRegistration}
              >
                Submit
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
