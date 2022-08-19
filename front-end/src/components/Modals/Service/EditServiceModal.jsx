import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditServiceModal(props) {
  const [errors, setErrors] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [input, setInput] = useState({
    name: "",
    description: "",
    unit: "",
    unit_price: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("editServiceModal")
      );
      model.show();
      axios.get(AppUrl.EditService + props.serviceId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.service);
          setCheckbox(response.data.service);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.serviceId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("editServiceModal")
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

  const handleCheckbox = (e) => {
    e.persist();
    setCheckbox(e.target.checked);
  };

  const updateService = (e) => {
    e.preventDefault();
    const service = {
      name: input.name,
      description: input.description,
      unit: input.unit,
      unit_price: input.unit_price,
      is_compulsory: checkbox,
    };
    axios
      .put(AppUrl.UpdateService + props.serviceId, service)
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
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
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
        id="editServiceModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit new category</h5>
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
              <form className="flexForm">
                <div className="formInput">
                  <label className="inputItemLabel">Service name:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="name"
                    onChange={handleInput}
                    value={input.name}
                  />
                </div>
                <span>{errors.name}</span>
                <div className="formInput">
                  <label className="inputItemLabel">Description:</label>
                  <textarea
                    type="text"
                    className="inputItem"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                  />
                </div>
                <div className="formInput">
                  <label className="inputItemLabel">Unit:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="unit"
                    onChange={handleInput}
                    value={input.unit}
                  />
                </div>
                <span>{errors.unit}</span>
                <div className="formInput">
                  <label className="inputItemLabel">Cost per unit:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="unit_price"
                    onChange={handleInput}
                    value={input.unit_price}
                  />
                </div>
                <span>{errors.unit_price}</span>
                <div className="formInput">
                  <label>Compulsory:</label>
                  <input
                    type="checkbox"
                    className="inputItem"
                    name="is_compulsory"
                    onChange={handleCheckbox}
                    defaultChecked={checkbox === 1 ? true : false}
                  />
                </div>
                <span>{errors.is_compulsory}</span>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={updateService}
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
