import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenterEdit from "../../Search/SearchRenterEdit";
import { TextField } from "@mui/material";

export default function EditMotorbikeModal(props) {
  const [errors, setErrors] = useState([]);
  const [motorbikeImage, setMotorbikeImage] = useState([]);
  const [input, setInput] = useState({
    license_plate: "",
    renter: "",
  });
  const [selectedRenter, setSelectedRenter] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("editMotorbikeModal")
      );
      model.show();
      axios.get(AppUrl.EditMotorbike + props.motorbikeId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.motorbike);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.motorbikeId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("editMotorbikeModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
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

  const updateMotorbike = (e) => {
    e.preventDefault();
    const motorbike = new FormData();
    motorbike.append("renter_id", selectedRenter.id);
    motorbike.append("license_plate", input.license_plate);
    if (motorbikeImage.motorbike_image) {
      motorbike.append("motorbike_image", motorbikeImage.motorbike_image);
    }
    axios
      .post(AppUrl.UpdateMotorbike + props.motorbikeId, motorbike)
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
        id="editMotorbikeModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Edit motorbike</h5>
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
                  <SearchRenterEdit getSelectedRenter={getSelectedRenter} currentRenter={input.renter} />
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
              <img src={`http://127.0.0.1:8000/${input.motorbike_image}`} alt= "" style={{width: "60px", height: "60px", borderRadius: "50%"}}/>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateMotorbike}
              >
                Update
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
