import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

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
              <h5 class="modal-title">Create new category</h5>
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
                class="btn btn-success"
                data-dismiss="modal"
                onClick={createService}
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
