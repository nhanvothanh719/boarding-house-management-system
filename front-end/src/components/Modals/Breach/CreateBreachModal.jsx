import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function CreateBreachModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    description: "",
    severity_level: "",
    allowed_violate_number: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addBreachModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBreachModal")
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

  const addBreach = (e) => {
    e.preventDefault();
    const breach = {
      name: input.name,
      description: input.description,
      severity_level: input.severity_level,
      allowed_violate_number: input.allowed_violate_number,
    };
    axios
      .post(AppUrl.StoreBreach, breach)
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
      <form
        class="modal fade"
        id="addBreachModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add new breach
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div className="formInput">
                  <label className="inputItemLabel">Name:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="name"
                    onChange={handleInput}
                    value={input.name}
                    id="inputName"
                  />
                </div>
                <small className="text-danger">{errors.name}</small>
                <div className="formInput">
                  <label className="inputItemLabel">Description:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    id="inputDescription"
                  />
                </div>
                <small className="text-danger">{errors.description}</small>
                <div className="formInput">
                  <label className="inputItemLabel">Severity level:</label>
                  <select
                    class="form-control"
                    name="severity_level"
                    onChange={handleInput}
                    value={input.severity_level}
                  >
                    <option selected>--- Severity level ---</option>
                    <option value="1" key="1">
                      {" "}
                      Serious{" "}
                    </option>
                    <option value="2" key="2">
                      {" "}
                      Significant{" "}
                    </option>
                    <option value="3" key="3">
                      {" "}
                      Normal{" "}
                    </option>
                    <option value="4" key="4">
                      {" "}
                      Negligible{" "}
                    </option>
                  </select>
                </div>
                <div className="formInput">
                  <label className="inputItemLabel">
                    Number of offenses allowed:
                  </label>
                  <input
                    type="text"
                    className="inputItem"
                    name="allowed_violate_number"
                    onChange={handleInput}
                    value={input.allowed_violate_number}
                    id="inputAllowedViolateNumber"
                  />
                </div>
                <small className="text-danger">
                  {errors.allowed_violate_number}
                </small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBreach}
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
      </form>
    </Fragment>
  );
}

