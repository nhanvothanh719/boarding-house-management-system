import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenter from "../../Search/SearchRenter";
import { TextField } from "@mui/material";

export default function CreateMotorbikeModal(props) {
  const [errors, setErrors] = useState([]);
  const [motorbikeImage, setMotorbikeImage] = useState([]);
  const [input, setInput] = useState({
    license_plate: "",
  });
  const [selectedRenter, setSelectedRenter] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createMotorbikeModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createMotorbikeModal")
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

  const handleMotorbikeImage = (e) => {
    setMotorbikeImage({ motorbike_image: e.target.files[0] });
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  };

  const createMotorbike = (e) => {
    e.preventDefault();
    const motorbike = new FormData();
    motorbike.append("renter_id", selectedRenter.id);
    motorbike.append("license_plate", input.license_plate);
    if (motorbikeImage.motorbike_image) {
      motorbike.append("motorbike_image", motorbikeImage.motorbike_image);
    }
    axios
      .post(AppUrl.StoreMotorbike, motorbike)
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
        id="createMotorbikeModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Create new motorbike</h5>
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
                <div className="form-group">
                  <label className="customModalLabel">Motorbike license plate:</label>
                  <TextField
                    label="License plate"
                    name="license_plate"
                    value={input.license_plate}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger">{errors.license_plate}</small>
                <div className="form-group">
                  <label className="customModalLabel">Owner:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter}/>
                </div>
                <small className="text-danger">{errors.renter_id}</small>
                <div className="form-group">
                  <label className="customModalLabel">Motorbike image:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="motorbike_image"
                    onChange={handleMotorbikeImage}
                  />
                </div>
                <small className="text-danger">{errors.motorbike_image}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={createMotorbike}
              >
                Send
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
