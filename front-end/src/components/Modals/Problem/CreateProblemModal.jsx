import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";

export default function CreateProblemModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
  });
  const [severityLevel, setSeverityLevel] = useState("");

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createProblemModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createProblemModal")
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

  const handleSeverityLevelChange = (event) => {
    setSeverityLevel(event.target.value);
  };

  const sendProblem = (e) => {
    const problem = {
      title: input.title,
      description: input.description,
      severity_level: severityLevel,
    };
    axios
      .post(AppUrl.StoreRenterProblem, problem)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setSeverityLevel("");
          setInput({
            title: "",
            description: "",
          })
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
        id="createProblemModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Create problem
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
                  <label className="customModalLabel">Title:</label>
                  <TextField
                    label="Title"
                    name="title"
                    value={input.title}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError" >{errors.title}</small>
                <div>
                  <label className="customModalLabel">Description:</label>
                  <TextField
                    label="Description"
                    name="description"
                    value={input.description}
                    onChange={handleInput}
                    fullWidth
                    multiline
                    required
                  />
                </div>
                <small className="text-danger customSmallError" >{errors.description}</small>
                <div>
                  <label className="customModalLabel">Severity level:</label>
                  <FormControl fullWidth>
                    <InputLabel>Severity level</InputLabel>
                    <Select
                      value={severityLevel}
                      label="Severity level"
                      onChange={handleSeverityLevelChange}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                    >
                      <MenuItem value={1} style={{  display: "block", padding: "5px 30px 5px" }}>High</MenuItem>
                      <MenuItem value={2} style={{  display: "block", padding: "5px 30px 5px" }}>Normal</MenuItem>
                      <MenuItem value={3} style={{  display: "block", padding: "5px 30px 5px" }}>Low</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <small className="text-danger customSmallError" >{errors.severity_level}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={sendProblem}
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
