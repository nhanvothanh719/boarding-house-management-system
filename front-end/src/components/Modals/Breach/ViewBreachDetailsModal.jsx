import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import { TextField, } from "@mui/material";

export default function ViewBreachDetailsModal(props) {
  const [input, setInput] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("viewBreachModal")
      );
      model.show();
      axios.get(AppUrl.GetBreachDetails + props.breachId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.breach);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.breachId]);

  const closeModal = (e, value) => {
    props.setShowDetailsModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <form
        class="modal fade"
        id="viewBreachModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">View breach details</h5>
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
              </form>
            </div>
            <div class="modal-footer">
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
