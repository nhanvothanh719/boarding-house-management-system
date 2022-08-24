import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import { TextField } from "@mui/material";

export default function CreateServiceModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    description: "",
    unit: "",
    unit_price: "",
    is_compulsory: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createServiceModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createServiceModal")
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

  const createService = (e) => {
    e.preventDefault();
    const service = {
      name: input.name,
      description: input.description,
      unit: input.unit,
      unit_price: input.unit_price,
      is_compulsory: input.is_compulsory,
    };
    axios
      .post(AppUrl.StoreService, service)
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
        id="createServiceModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
            <h5 class="customModalTitle">Create new service</h5>
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
              <form>
                <div>
                  <label className="customModalLabel">Service name:</label>
                  <TextField
                    label="Service name"
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <span>{errors.name}</span>
                <div>
                  <label className="customModalLabel">Description:</label>
                  <TextField
                    label="Description"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    fullWidth
                    required
                    multiline
                  />
                </div>
                <div>
                  <label className="customModalLabel">Unit:</label>
                  <TextField
                    label="Unit"
                    name="unit"
                    value={input.unit}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <span>{errors.unit}</span>
                <div>
                  <label className="customModalLabel">Cost per unit:</label>
                  <TextField
                    label="Unit price"
                    name="unit_price"
                    value={input.unit_price}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <span>{errors.unit_price}</span>
                <div>
                  <label className="customModalLabel">Compulsory:</label>
                  <input
                    type="checkbox"
                    className="customCheckbox"
                    name="is_compulsory"
                    onChange={handleInput}
                    defaultChecked={input.is_compulsory === 1 ? true : false}
                  />
                </div>
                <span>{errors.is_compulsory}</span>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={createService}
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
