import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function EditBreachModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    description: "",
    severity_level: "",
    allowed_violate_number: "",
  });
  const [selectSeverityLevel, setSelectSeverityLevel] = useState('');

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("updateBreachModal")
      );
      model.show();
      axios.get(AppUrl.EditBreach + props.breachId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.breach);
          setSelectSeverityLevel(response.data.breach.severity_level);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.breachId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("updateBreachModal")
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

  const updateBreach = (e) => {
    e.preventDefault();
    const breach = {
      name: input.name,
      description: input.description,
      severity_level: selectSeverityLevel,
      allowed_violate_number: input.allowed_violate_number,
    };
    axios
      .put(AppUrl.UpdateBreach + props.breachId, breach)
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
      <form
        class="modal fade"
        id="updateBreachModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Update breach</h5>
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
                  <label className="customModalLabel">Description:</label>
                  <TextField
                    label="Description"
                    name="description"
                    value={input.description === null ? "" : input.description}
                    onChange={handleInput}
                    fullWidth
                    required
                    multiline
                  />
                </div>
                <small className="text-danger customSmallError">{errors.description}</small>
                <div>
                  <label className="customModalLabel">Severity level:</label>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      onChange={(e) => setSelectSeverityLevel(e.target.value)}
                      value={selectSeverityLevel}
                      required
                    >
                      <MenuItem
                        value={1}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Serious
                      </MenuItem>
                      <MenuItem
                        value={2}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Significant
                      </MenuItem>
                      <MenuItem
                        value={3}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Normal
                      </MenuItem>
                      <MenuItem
                        value={4}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Negligible
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label className="customModalLabel">
                    Number of offenses allowed:
                  </label>
                  <TextField
                    label="Number of offenses allowed"
                    name="allowed_violate_number"
                    value={input.allowed_violate_number}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">
                  {errors.allowed_violate_number}
                </small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateBreach}
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
      </form>
    </Fragment>
  );
}
